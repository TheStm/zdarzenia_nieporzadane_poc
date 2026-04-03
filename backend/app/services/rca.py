from datetime import datetime

from sqlalchemy.orm import Session

from app.models.incident import Incident
from app.models.rca import ActionItem, ActionStatus, RCAAnalysis, RCAStatus
from app.schemas.rca import (
    ActionItemCreate,
    ActionItemUpdate,
    RCACreate,
    RCAUpdate,
)


def create_rca(db: Session, incident_id: int, data: RCACreate) -> RCAAnalysis | None:
    incident = db.get(Incident, incident_id)
    if incident is None:
        return None

    rca = RCAAnalysis(
        incident_id=incident_id,
        status=RCAStatus.DRAFT,
        description=data.description,
        team_members=data.team_members,
    )
    db.add(rca)
    db.commit()
    db.refresh(rca)
    return rca


def get_rca_by_incident(db: Session, incident_id: int) -> RCAAnalysis | None:
    return db.query(RCAAnalysis).filter(RCAAnalysis.incident_id == incident_id).first()


def get_rca(db: Session, rca_id: int) -> RCAAnalysis | None:
    return db.get(RCAAnalysis, rca_id)


def update_rca(db: Session, rca_id: int, data: RCAUpdate) -> RCAAnalysis | None:
    rca = db.get(RCAAnalysis, rca_id)
    if rca is None:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(rca, field, value)

    if data.status == RCAStatus.COMPLETED and rca.completed_at is None:
        rca.completed_at = datetime.now()

    db.commit()
    db.refresh(rca)
    return rca


def create_action(db: Session, rca_id: int, data: ActionItemCreate) -> ActionItem | None:
    rca = db.get(RCAAnalysis, rca_id)
    if rca is None:
        return None

    action = ActionItem(
        rca_id=rca_id,
        description=data.description,
        responsible_person=data.responsible_person,
        responsible_user_id=data.responsible_user_id,
        deadline=data.deadline,
        status=ActionStatus.TODO,
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    return action


def list_actions(db: Session, rca_id: int) -> list[ActionItem]:
    return (
        db.query(ActionItem)
        .filter(ActionItem.rca_id == rca_id)
        .order_by(ActionItem.deadline)
        .all()
    )


def update_action(db: Session, action_id: int, data: ActionItemUpdate) -> ActionItem | None:
    action = db.get(ActionItem, action_id)
    if action is None:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(action, field, value)

    if data.status == ActionStatus.COMPLETED and action.completed_at is None:
        action.completed_at = datetime.now()

    db.commit()
    db.refresh(action)
    return action
