from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.incident import Category, Incident, Status
from app.schemas.incident import IncidentCreate, IncidentStatusUpdate


def create_incident(db: Session, data: IncidentCreate) -> Incident:
    incident = Incident(**data.model_dump())
    incident.status = Status.NEW
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


def get_incident(db: Session, incident_id: int) -> Incident | None:
    return db.get(Incident, incident_id)


def list_incidents(
    db: Session,
    status: Status | None = None,
    category: Category | None = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[Incident], int]:
    query = db.query(Incident)

    if status is not None:
        query = query.filter(Incident.status == status)
    if category is not None:
        query = query.filter(Incident.category == category)

    total = query.count()
    items = query.order_by(Incident.created_at.desc()).offset(skip).limit(limit).all()
    return items, total


def update_incident_status(
    db: Session, incident_id: int, data: IncidentStatusUpdate
) -> Incident | None:
    incident = db.get(Incident, incident_id)
    if incident is None:
        return None
    incident.status = data.status
    db.commit()
    db.refresh(incident)
    return incident
