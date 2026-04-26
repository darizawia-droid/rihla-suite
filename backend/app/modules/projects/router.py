"""Projects router — Central entity CRUD."""

from typing import Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select, or_, func, case
from pydantic import BaseModel

from app.core.database import get_db
from app.modules.projects.models import Project, ProjectStatus, ProjectType
from app.shared.exceptions import NotFoundError
from app.shared.schemas import BaseResponse
from app.shared.dependencies import require_auth
from app.shared.audit import log_action

router = APIRouter(prefix="/projects", tags=["projects"], dependencies=[Depends(require_auth)])


class ProjectCreate(BaseModel):
    name: str
    reference: Optional[str] = None
    client_name: Optional[str] = None
    client_email: Optional[str] = None
    status: ProjectStatus = ProjectStatus.DRAFT
    project_type: Optional[ProjectType] = None
    destination: Optional[str] = None
    duration_days: Optional[int] = None
    duration_nights: Optional[int] = None
    pax_count: Optional[int] = None
    travel_dates: Optional[str] = None
    language: str = "fr"
    currency: str = "EUR"
    notes: Optional[str] = None
    highlights: Optional[list[str]] = None
    inclusions: Optional[list[str]] = None
    exclusions: Optional[list[str]] = None


class ProjectUpdate(ProjectCreate):
    name: Optional[str] = None


class ProjectResponse(BaseResponse):
    name: str
    reference: Optional[str]
    client_name: Optional[str]
    client_email: Optional[str]
    status: ProjectStatus
    project_type: Optional[ProjectType]
    destination: Optional[str]
    duration_days: Optional[int]
    duration_nights: Optional[int]
    pax_count: Optional[int]
    travel_dates: Optional[str]
    language: str
    currency: str
    notes: Optional[str]
    cover_image_url: Optional[str]
    map_image_url: Optional[str]
    highlights: Optional[list]
    inclusions: Optional[list]
    exclusions: Optional[list]


class ProjectSummary(BaseModel):
    id: str
    name: str
    reference: Optional[str]
    client_name: Optional[str]
    status: ProjectStatus
    project_type: Optional[ProjectType]
    destination: Optional[str]
    duration_days: Optional[int]
    pax_count: Optional[int]
    currency: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class PaginatedProjects(BaseModel):
    items: list[ProjectResponse]
    total: int
    limit: int
    offset: int
    has_more: bool

    class Config:
        from_attributes = True


@router.get("/", response_model=PaginatedProjects)
def list_projects(
    status: Optional[ProjectStatus] = None,
    search: Optional[str] = None,
    project_type: Optional[ProjectType] = None,
    sort: str = Query(default="updated_at", pattern="^(updated_at|created_at|name|client_name)$"),
    order: str = Query(default="desc", pattern="^(asc|desc)$"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
):
    base = select(Project).where(Project.active == True)
    if status:
        base = base.where(Project.status == status)
    if project_type:
        base = base.where(Project.project_type == project_type)
    if search:
        base = base.where(or_(
            Project.name.ilike(f"%{search}%"),
            Project.client_name.ilike(f"%{search}%"),
            Project.reference.ilike(f"%{search}%"),
            Project.destination.ilike(f"%{search}%"),
        ))

    # Total count (sans limit/offset)
    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()

    # Tri dynamique
    sort_col = getattr(Project, sort, Project.updated_at)
    ordered = base.order_by(sort_col.desc() if order == "desc" else sort_col.asc())
    items = db.execute(ordered.limit(limit).offset(offset)).scalars().all()

    return PaginatedProjects(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
        has_more=(offset + limit) < total,
    )


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(data: ProjectCreate, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_auth)):
    project = Project(**data.model_dump())
    db.add(project)
    db.flush()
    log_action(db, "project", project.id, "create", current_user,
               changes={"name": {"before": None, "after": data.name}})
    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    p = db.execute(select(Project).where(Project.id == project_id)).scalars().first()
    if not p:
        raise NotFoundError(f"Project {project_id} not found")
    return p


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: str, data: ProjectUpdate, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_auth)):
    p = db.execute(select(Project).where(Project.id == project_id)).scalars().first()
    if not p:
        raise NotFoundError(f"Project {project_id} not found")
    updates = data.model_dump(exclude_none=True)
    before = {k: getattr(p, k, None) for k in updates}
    for field, value in updates.items():
        setattr(p, field, value)
    log_action(db, "project", project_id, "update", current_user,
               changes={k: {"before": before[k], "after": updates[k]} for k in updates if before[k] != updates[k]})
    db.commit()
    db.refresh(p)
    return p


@router.patch("/{project_id}/status")
def update_status(project_id: str, new_status: ProjectStatus, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_auth)):
    p = db.execute(select(Project).where(Project.id == project_id)).scalars().first()
    if not p:
        raise NotFoundError()
    old_status = p.status
    p.status = new_status
    log_action(db, "project", project_id, "status_change", current_user,
               changes={"status": {"before": old_status, "after": new_status}})
    db.commit()
    # Invalider le cache KPI après changement de statut
    try:
        from app.core.redis import get_redis_sync
        get_redis_sync().delete(_KPI_CACHE_KEY)
    except Exception:
        pass
    return {"id": project_id, "status": new_status}


@router.get("/{project_id}/audit")
def get_project_audit(project_id: str, db: Session = Depends(get_db)):
    from app.modules.admin.models import AuditLog
    logs = db.execute(
        select(AuditLog)
        .where(AuditLog.entity_id == project_id)
        .order_by(AuditLog.created_at.desc())
        .limit(100)
    ).scalars().all()
    return logs


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: str, db: Session = Depends(get_db)):
    p = db.execute(select(Project).where(Project.id == project_id)).scalars().first()
    if not p:
        raise NotFoundError()
    p.active = False  # soft delete
    db.commit()


_KPI_CACHE_KEY = "rihla:kpis:dashboard"
_KPI_TTL = 300  # 5 minutes


@router.get("/stats/kpis", summary="Dashboard KPIs — real project statistics")
def get_kpis(db: Session = Depends(get_db)):
    """Return real KPIs, cached in Redis for 5 minutes."""
    import json
    from app.core.redis import get_redis_sync

    redis = get_redis_sync()
    cached = redis.get(_KPI_CACHE_KEY)
    if cached:
        try:
            return json.loads(cached)
        except Exception:
            pass  # cache corrompu → recalculer

    now = datetime.now(timezone.utc)
    thirty_days_ago = now - timedelta(days=30)

    total = db.execute(
        select(func.count(Project.id)).where(Project.active == True)
    ).scalar_one()

    status_counts = db.execute(
        select(Project.status, func.count(Project.id))
        .where(Project.active == True)
        .group_by(Project.status)
    ).all()
    by_status = {str(row[0]): row[1] for row in status_counts}

    recent_count = db.execute(
        select(func.count(Project.id)).where(
            Project.active == True,
            Project.created_at >= thirty_days_ago
        )
    ).scalar_one()

    active_count = (
        by_status.get("in_progress", 0) +
        by_status.get("validated", 0) +
        by_status.get("sent", 0)
    )

    top_dest_row = db.execute(
        select(Project.destination, func.count(Project.id).label("cnt"))
        .where(Project.active == True, Project.destination != None)
        .group_by(Project.destination)
        .order_by(func.count(Project.id).desc())
        .limit(1)
    ).first()
    top_destination = top_dest_row[0] if top_dest_row else None

    # Conversion funnel: taux draft→sent→won
    total_nonzero = max(total, 1)
    funnel = {
        "draft_to_sent_pct": round(
            (by_status.get("sent", 0) + by_status.get("won", 0)) / total_nonzero * 100, 1
        ),
        "sent_to_won_pct": round(
            by_status.get("won", 0) / max(by_status.get("sent", 0) + by_status.get("won", 0), 1) * 100, 1
        ),
    }

    result = {
        "total_projects": total,
        "active_projects": active_count,
        "recent_projects_30d": recent_count,
        "by_status": by_status,
        "top_destination": top_destination,
        "funnel": funnel,
        "generated_at": now.isoformat(),
        "cached": False,
    }

    try:
        redis.setex(_KPI_CACHE_KEY, _KPI_TTL, json.dumps(result))
        result["cached"] = False
    except Exception:
        pass

    return result


@router.post("/stats/kpis/invalidate", summary="Force KPI cache refresh")
def invalidate_kpi_cache():
    """Invalide le cache KPI (appelé après mutations critiques)."""
    from app.core.redis import get_redis_sync
    redis = get_redis_sync()
    redis.delete(_KPI_CACHE_KEY)
    return {"invalidated": True}

