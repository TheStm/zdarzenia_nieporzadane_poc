from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_coordinator_or_admin
from app.models.incident import Category, Status
from app.models.user import User
from app.schemas.incident import (
    IncidentCreate,
    IncidentListResponse,
    IncidentRead,
    IncidentStatusUpdate,
)
from app.services import incidents as service
from app.services import notifications as notif_service

router = APIRouter(prefix="/api/incidents", tags=["incidents"])

STATUS_LABELS = {
    "new": "Nowe", "in_triage": "W triage", "rejected": "Odrzucone",
    "in_analysis": "W analizie", "escalated_rca": "Eskalowane RCA",
    "action_plan": "Plan działań", "implementing": "Wdrażanie", "closed": "Zamknięte",
}

CATEGORY_LABELS = {
    "A": "Procedury kliniczne", "B": "Farmakoterapia", "C": "Zakażenia",
    "D": "Sprzęt medyczny", "E": "Upadki", "F": "Odleżyny",
    "G": "Krew", "H": "Opieka", "I": "Dokumentacja",
    "J": "Samouszkodzenie", "K": "Infrastruktura", "L": "Organizacja",
    "M": "Prawa pacjenta", "X": "Inne",
}


def _val(enum_or_str):
    return enum_or_str.value if hasattr(enum_or_str, "value") else str(enum_or_str)


@router.post("", response_model=IncidentRead, status_code=201)
def create_incident(
    data: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    incident = service.create_incident(db, data, user_id=current_user.id)
    cat = _val(incident.category)
    notif_service.notify_coordinators(
        db,
        type="incident_created",
        title="Nowe zgłoszenie",
        message=f"ZN-{incident.id:04d}: {incident.department}, {CATEGORY_LABELS.get(cat, cat)}",
        link=f"/incidents/{incident.id}",
    )
    db.commit()
    return incident


@router.get("/{incident_id}", response_model=IncidentRead)
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    incident = service.get_incident(db, incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    if current_user.role == "reporter" and incident.reporter_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return incident


@router.get("", response_model=IncidentListResponse)
def list_incidents(
    status: Status | None = None,
    category: Category | None = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = current_user.id if current_user.role == "reporter" else None
    items, total = service.list_incidents(
        db, status=status, category=category, skip=skip, limit=limit, user_id=user_id
    )
    return IncidentListResponse(items=items, total=total)


@router.patch("/{incident_id}/status", response_model=IncidentRead)
def update_incident_status(
    incident_id: int,
    data: IncidentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_coordinator_or_admin),
):
    incident = service.get_incident(db, incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    old_status = _val(incident.status)
    incident = service.update_incident_status(db, incident_id, data)
    new_status = _val(data.status)
    notif_service.notify_user(
        db,
        user_id=incident.reporter_user_id,
        type="status_changed",
        title="Zmiana statusu zgłoszenia",
        message=f"ZN-{incident.id:04d}: {STATUS_LABELS.get(old_status, old_status)} → {STATUS_LABELS.get(new_status, new_status)}",
        link=f"/incidents/{incident.id}",
    )
    db.commit()
    return incident
