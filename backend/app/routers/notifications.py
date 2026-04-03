from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.notification import NotificationListResponse, NotificationRead, UnreadCountResponse
from app.services import notifications as service

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=NotificationListResponse)
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = service.get_notifications(db, current_user.id)
    unread = service.get_unread_count(db, current_user.id)
    return NotificationListResponse(items=items, unread_count=unread)


@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = service.get_unread_count(db, current_user.id)
    return UnreadCountResponse(unread_count=count)


@router.patch("/{notification_id}/read", response_model=NotificationRead)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = service.mark_as_read(db, notification_id, current_user.id)
    if notif is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.commit()
    return notif


@router.post("/mark-all-read")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service.mark_all_as_read(db, current_user.id)
    db.commit()
    return {"status": "ok"}
