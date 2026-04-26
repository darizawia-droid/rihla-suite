"""AI router — FastAPI endpoints for AI operations."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.modules.ai.schemas import AIGenerateRequest, AIGenerateResponse
from app.modules.ai.service import AIService
from app.shared.dependencies import require_auth

router = APIRouter(prefix="/ai", tags=["ai"], dependencies=[Depends(require_auth)])
_limiter = Limiter(key_func=get_remote_address)

class MagicBriefPayload(BaseModel):
    brief: str

@router.post("/generate", response_model=AIGenerateResponse)
@_limiter.limit("20/minute")
async def generate_content(request: Request, data: AIGenerateRequest, db: Session = Depends(get_db)):
    service = AIService(db)
    try:
        return await service.generate_content(data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI service error: {str(e)}",
        )

@router.post("/magic-extract")
@_limiter.limit("10/minute")
async def extract_project(request: Request, payload: MagicBriefPayload, db: Session = Depends(get_db)):
    service = AIService(db)
    try:
        return await service.extract_project_from_brief(payload.brief)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI extraction error: {str(e)}",
        )

@router.get("/predictive-pricing/{project_id}")
async def predictive_pricing(
    project_id: str,
    market: str = "FR",
    db: Session = Depends(get_db)
):
    from fastapi.responses import JSONResponse
    service = AIService(db)
    result = await service.suggest_optimal_pricing(project_id, db, market)
    if "error" in result:
        return JSONResponse(status_code=502, content=result)
    return result
