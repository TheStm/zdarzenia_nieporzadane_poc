from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.user import User


def create_notification(
    db: Session, user_id: int, type: str, title: str, message: str, link: str | None = None
) -> Notification:
    notif = Notification(
        user_id=user_id, type=type, title=title, message=message, link=link
    )
    db.add(notif)
    db.flush()
    return notif


def notify_user(
    db: Session, user_id: int | None, type: str, title: str, message: str, link: str | None = None
) -> None:
    if user_id is None:
        return
    create_notification(db, user_id, type, title, message, link)


def notify_coordinators(
    db: Session, type: str, title: str, message: str, link: str | None = None
) -> None:
    users = db.query(User).filter(User.role.in_(["coordinator", "admin"]), User.is_active == True).all()
    for user in users:
        create_notification(db, user.id, type, title, message, link)


def get_notifications(db: Session, user_id: int) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )


def get_unread_count(db: Session, user_id: int) -> int:
    return (
        db.query(func.count(Notification.id))
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .scalar()
        or 0
    )


def mark_as_read(db: Session, notification_id: int, user_id: int) -> Notification | None:
    notif = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == user_id)
        .first()
    )
    if notif is None:
        return None
    notif.is_read = True
    db.flush()
    return notif


def mark_all_as_read(db: Session, user_id: int) -> int:
    count = (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .update({"is_read": True})
    )
    db.flush()
    return count
