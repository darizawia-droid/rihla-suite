"""Reviews — clients évaluent guides, chauffeurs, restaurants, hôtels."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from pydantic import BaseModel, Field

from app.core.database import get_db
from app.shared.dependencies import require_auth
from app.modules.reviews.models import Review, ReviewTarget
from app.modules.notifications.service import push_notification

router = APIRouter(prefix="/reviews", tags=["reviews"], dependencies=[Depends(require_auth)])


class ReviewCreate(BaseModel):
    project_id:  str
    target_type: ReviewTarget
    target_id:   Optional[str] = None
    target_name: str
    rating:      int = Field(..., ge=1, le=5)
    comment:     Optional[str] = None


class ReviewOut(BaseModel):
    id:            str
    project_id:    str
    reviewer_name: str
    target_type:   ReviewTarget
    target_name:   str
    rating:        int
    comment:       Optional[str]
    created_at:    str

    class Config:
        from_attributes = True


@router.post("/", response_model=ReviewOut, status_code=201)
async def create_review(
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_auth),
):
    review = Review(
        project_id=data.project_id,
        reviewer_id=current_user["sub"],
        reviewer_name=current_user.get("full_name", "Client"),
        target_type=data.target_type,
        target_id=data.target_id,
        target_name=data.target_name,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # Notify travel designer in charge of this project
    await push_notification(
        db=db,
        project_id=data.project_id,
        sender_name=current_user.get("full_name", "Client"),
        notif_type="review",
        title=f"Avis {data.rating}★ — {data.target_name}",
        message=data.comment or f"Note {data.rating}/5 pour {data.target_name}",
    )

    return review


@router.get("/project/{project_id}", response_model=list[ReviewOut])
def get_project_reviews(project_id: str, db: Session = Depends(get_db)):
    rows = db.execute(
        select(Review).where(Review.project_id == project_id)
        .order_by(Review.created_at.desc())
    ).scalars().all()
    return rows


@router.get("/stats/{project_id}")
def get_review_stats(project_id: str, db: Session = Depends(get_db)):
    reviews = db.execute(
        select(Review).where(Review.project_id == project_id)
    ).scalars().all()
    if not reviews:
        return {"count": 0, "average": None, "by_type": {}}
    by_type: dict[str, list[int]] = {}
    for r in reviews:
        by_type.setdefault(r.target_type, []).append(r.rating)
    return {
        "count": len(reviews),
        "average": round(sum(r.rating for r in reviews) / len(reviews), 1),
        "by_type": {k: round(sum(v) / len(v), 1) for k, v in by_type.items()},
    }
