from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_coordinator_or_admin
from app.models.user import User
from app.services import dashboard as service

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_coordinator_or_admin),
):
    return service.get_stats(db)
