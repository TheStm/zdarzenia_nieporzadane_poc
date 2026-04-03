from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_coordinator_or_admin
from app.models.incident import Incident
from app.models.rca import RCAStatus
from app.models.user import User
from app.schemas.rca import (
    ActionItemCreate,
    ActionItemRead,
    ActionItemUpdate,
    RCACreate,
    RCARead,
    RCAUpdate,
)
from app.services import notifications as notif_service
from app.services import rca as service

router = APIRouter(tags=["rca"])


@router.post("/api/incidents/{incident_id}/rca", response_model=RCARead, status_code=201)
def create_rca(
    incident_id: int,
    data: RCACreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_coordinator_or_admin),
):
    existing = service.get_rca_by_incident(db, incident_id)
    if existing is not None:
        raise HTTPException(status_code=409, detail="RCA already exists for this incident")

    rca = service.create_rca(db, incident_id, data)
    if rca is None:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident = db.get(Incident, incident_id)
    notif_service.notify_user(
        db,
        user_id=incident.reporter_user_id if incident else None,
        type="rca_created",
        title="Rozpoczęto analizę RCA",
        message=f"Dla zgłoszenia ZN-{incident_id:04d} rozpoczęto analizę przyczyn źródłowych",
        link=f"/incidents/{incident_id}",
    )
    db.commit()
    return rca


@router.get("/api/incidents/{incident_id}/rca", response_model=RCARead)
def get_rca_for_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_coordinator_or_admin),
):
    rca = service.get_rca_by_incident(db, incident_id)
    if rca is None:
        raise HTTPException(status_code=404, detail="RCA not found for this incident")
    return rca


@router.patch("/api/rca/{rca_id}", response_model=RCARead)
def update_rca(
    rca_id: int,
    data: RCAUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_coordinator_or_admin),
):
    rca = service.update_rca(db, rca_id, data)
    if rca is None:
        raise HTTPException(status_code=404, detail="RCA not found")

    if data.status == RCAStatus.COMPLETED:
        notif_service.notify_coordinators(
            db,
            type="rca_completed",
            title="Zakończono analizę RCA",
            message=f"Analiza RCA dla ZN-{rca.incident_id:04d} została zakończona",
            link=f"/incidents/{rca.incident_id}",
        )
    db.commit()
    return rca


@router.post("/api/rca/{rca_id}/actions", response_model=ActionItemRead, status_code=201)
def create_action(
    rca_id: int,
    data: ActionItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_coordinator_or_admin),
):
    action = service.create_action(db, rca_id, data)
    if action is None:
        raise HTTPException(status_code=404, detail="RCA not found")

    if action.responsible_user_id:
        rca = service.get_rca(db, rca_id)
        notif_service.notify_user(
            db,
            user_id=action.responsible_user_id,
            type="action_assigned",
            title="Przypisano działanie naprawcze",
            message=f"{action.description[:100]}",
            link=f"/incidents/{rca.incident_id}" if rca else None,
        )
    db.commit()
    return action


@router.get("/api/rca/{rca_id}/actions", response_model=list[ActionItemRead])
def list_actions(
    rca_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_coordinator_or_admin),
):
    return service.list_actions(db, rca_id)


@router.patch("/api/actions/{action_id}", response_model=ActionItemRead)
def update_action(
    action_id: int,
    data: ActionItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_coordinator_or_admin),
):
    action = service.update_action(db, action_id, data)
    if action is None:
        raise HTTPException(status_code=404, detail="Action not found")

    if data.status and data.status.value == "completed":
        rca = service.get_rca(db, action.rca_id)
        notif_service.notify_coordinators(
            db,
            type="action_completed",
            title="Zakończono działanie naprawcze",
            message=f"{action.description[:100]}",
            link=f"/incidents/{rca.incident_id}" if rca else None,
        )
    db.commit()
    return action
