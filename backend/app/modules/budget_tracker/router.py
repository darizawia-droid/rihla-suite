"""Budget Tracker — Actual vs Estimated cost analysis.

Post-voyage module to:
  - Record actual costs per category
  - Compare with original quotation
  - Identify cost overruns and savings
  - Generate profitability report
  - Track trends across projects for better future quotations
"""

from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.modules.projects.models import Project
from app.modules.quotations.models import Quotation, QuotationLine
from app.shared.dependencies import require_auth
from .models import ActualCostLine as ActualCostLineModel

router = APIRouter(prefix="/budget", tags=["budget-tracker"],
                   dependencies=[Depends(require_auth)])


# ── Schemas ──────────────────────────────────────────────────────────

class ActualCostLineSchema(BaseModel):
    category: str  # hotel, transport, guide, monument, activity, restaurant, misc
    label: str
    day_number: Optional[int] = None
    supplier: Optional[str] = None
    estimated_cost: Optional[float] = None  # Auto-filled from quotation
    actual_cost: float
    invoice_ref: Optional[str] = None
    notes: Optional[str] = None


class ActualCostsSubmit(BaseModel):
    lines: list[ActualCostLineSchema]
    actual_pax_count: Optional[int] = None
    total_client_payment: Optional[float] = None
    notes: Optional[str] = None


# ── Endpoints ────────────────────────────────────────────────────────

@router.post("/{project_id}/actuals", summary="Submit actual costs")
def submit_actuals(
    project_id: str,
    data: ActualCostsSubmit,
    db: Session = Depends(get_db),
):
    """Submit actual costs for a completed project.

    Automatically compares with the original quotation.
    """
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    # 1. Clear previous actuals for this project
    db.query(ActualCostLineModel).filter(ActualCostLineModel.project_id == project_id).delete()

    # 2. Save new actuals
    for line in data.lines:
        db_line = ActualCostLineModel(
            project_id=project_id,
            category=line.category,
            label=line.label,
            actual_cost=line.actual_cost,
            notes=line.notes,
        )
        db.add(db_line)
    
    db.commit()

    # 3. Load original quotation for comparison and build report
    return get_budget_report(project_id, db)


@router.get("/{project_id}/report", summary="Get budget report")
def get_budget_report(project_id: str, db: Session = Depends(get_db)):
    """Retrieve the budget comparison report for a project."""
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    # Fetch actuals from DB
    db_actuals = db.query(ActualCostLineModel).filter(ActualCostLineModel.project_id == project_id).all()

    # Load original quotation
    quotation = db.execute(
        select(Quotation)
        .where(Quotation.project_id == project_id)
        .options(selectinload(Quotation.lines))
    ).scalars().first()

    if not quotation and not db_actuals:
        return {
            "project_id": project_id,
            "status": "no_data",
            "message": "No quotation or actuals found. Submit actuals first.",
        }

    # Build estimated by category from quotation
    estimated_by_cat: dict[str, float] = {}
    estimated_total = 0
    if quotation:
        for l in quotation.lines:
            cat = str(l.category) if l.category else "misc"
            cost = float(l.total_cost or 0)
            estimated_by_cat[cat] = estimated_by_cat.get(cat, 0) + cost
            estimated_total += cost

    # Build actuals report
    actual_by_cat: dict[str, float] = {}
    actual_total = 0
    lines_data = []

    for line in db_actuals:
        actual_by_cat[line.category] = actual_by_cat.get(line.category, 0) + float(line.actual_cost)
        actual_total += float(line.actual_cost)

        # Try to match with quotation for line-level variance
        # (This is a bit simplified, in a real system we'd use quotation_line_id)
        matching_est = 0
        if quotation:
            matching = [l for l in quotation.lines if str(l.category) == line.category]
            if matching:
                # Average or sum? For now, we just sum them if multiple match same category
                matching_est = sum(float(m.total_cost or 0) for m in matching) / len(matching)

        variance = float(line.actual_cost) - matching_est
        variance_pct = (variance / matching_est * 100) if matching_est != 0 else None

        lines_data.append({
            "id": line.id,
            "category": line.category,
            "label": line.label,
            "actual_cost": float(line.actual_cost),
            "estimated_cost": round(matching_est, 2),
            "variance": round(variance, 2),
            "variance_pct": round(variance_pct, 1) if variance_pct is not None else None,
            "notes": line.notes,
            "status": "over" if variance > 0 else "under" if variance < 0 else "on_budget"
        })

    # Category comparison
    all_categories = set(list(estimated_by_cat.keys()) + list(actual_by_cat.keys()))
    category_comparison = []
    for cat in sorted(all_categories):
        est = estimated_by_cat.get(cat, 0)
        act = actual_by_cat.get(cat, 0)
        diff = act - est
        category_comparison.append({
            "category": cat,
            "estimated": round(est, 2),
            "actual": round(act, 2),
            "variance": round(diff, 2),
            "variance_pct": round(diff / est * 100, 1) if est else None,
            "status": "over" if diff > 0 else "under" if diff < 0 else "on_budget",
        })

    # Overall profitability
    selling_total = float(quotation.total_selling or 0) if quotation else 0
    actual_margin = selling_total - actual_total if selling_total else 0
    actual_margin_pct = (actual_margin / selling_total * 100) if selling_total != 0 else 0
    estimated_margin_pct = float(quotation.margin_pct or 0) if quotation else 0

    return {
        "project_id": project_id,
        "project_name": project.name,
        "status": "completed" if db_actuals else "estimated_only",
        "pax_count": {
            "estimated": project.pax_count,
            "actual": project.pax_count, # Simplified
        },
        "totals": {
            "estimated_cost": round(estimated_total, 2),
            "actual_cost": round(actual_total, 2),
            "variance": round(actual_total - estimated_total, 2),
            "variance_pct": round((actual_total - estimated_total) / estimated_total * 100, 1) if estimated_total else None,
            "selling_total": round(selling_total, 2),
        },
        "profitability": {
            "estimated_margin_pct": estimated_margin_pct,
            "actual_margin": round(actual_margin, 2),
            "actual_margin_pct": round(actual_margin_pct, 1),
            "margin_variance": round(actual_margin_pct - estimated_margin_pct, 1),
        },
        "by_category": category_comparison,
        "lines": lines_data,
    }


@router.get("/trends", summary="Budget variance trends across projects")
def budget_trends(db: Session = Depends(get_db)):
    """Analyze budget accuracy trends across all projects with actuals."""
    # Query all projects that have actual cost lines
    p_ids = [r[0] for r in db.query(ActualCostLineModel.project_id).distinct().all()]
    
    if not p_ids:
        return {
            "total_projects_tracked": 0,
            "message": "No budget data available. Submit actuals for completed projects.",
        }

    projects_summary = []
    total_estimated = 0
    total_actual = 0
    category_variances: dict[str, list[float]] = {}

    for pid in p_ids:
        report = get_budget_report(pid, db)
        totals = report.get("totals", {})
        est = totals.get("estimated_cost", 0)
        act = totals.get("actual_cost", 0)
        total_estimated += est
        total_actual += act

        projects_summary.append({
            "project_id": pid,
            "project_name": report.get("project_name", ""),
            "estimated": est,
            "actual": act,
            "variance_pct": totals.get("variance_pct"),
        })

        for cat in report.get("by_category", []):
            cat_name = cat["category"]
            if cat.get("variance_pct") is not None:
                category_variances.setdefault(cat_name, []).append(cat["variance_pct"])

    avg_category_variance = {
        cat: round(sum(vals) / len(vals), 1)
        for cat, vals in category_variances.items()
        if vals
    }

    overall_variance = ((total_actual - total_estimated) / total_estimated * 100) if total_estimated else 0

    # Recommendations
    recommendations = []
    for cat, avg in avg_category_variance.items():
        if avg > 5:
            recommendations.append(
                f"⚠️ {cat.upper()}: Coûts réels dépassent les estimations de {avg:.1f}% en moyenne."
            )
        elif avg < -5:
            recommendations.append(
                f"💡 {cat.upper()}: Économies constatées ({abs(avg):.1f}% sous estimations)."
            )

    return {
        "total_projects_tracked": len(projects_summary),
        "overall_variance_pct": round(overall_variance, 1),
        "total_estimated": round(total_estimated, 2),
        "total_actual": round(total_actual, 2),
        "projects": projects_summary,
        "avg_variance_by_category": avg_category_variance,
        "recommendations": recommendations,
    }
