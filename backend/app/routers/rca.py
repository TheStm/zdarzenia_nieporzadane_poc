from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.rca import (
    ActionItemCreate,
    ActionItemRead,
    ActionItemUpdate,
    RCACreate,
    RCARead,
    RCAUpdate,
)
from app.services import rca as service

router = APIRouter(tags=["rca"])


@router.post("/api/incidents/{incident_id}/rca", response_model=RCARead, status_code=201)
def create_rca(incident_id: int, data: RCACreate, db: Session = Depends(get_db)):
    existing = service.get_rca_by_incident(db, incident_id)
    if existing is not None:
        raise HTTPException(status_code=409, detail="RCA already exists for this incident")

    rca = service.create_rca(db, incident_id, data)
    if rca is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return rca


@router.get("/api/incidents/{incident_id}/rca", response_model=RCARead)
def get_rca_for_incident(incident_id: int, db: Session = Depends(get_db)):
    rca = service.get_rca_by_incident(db, incident_id)
    if rca is None:
        raise HTTPException(status_code=404, detail="RCA not found for this incident")
    return rca


@router.patch("/api/rca/{rca_id}", response_model=RCARead)
def update_rca(rca_id: int, data: RCAUpdate, db: Session = Depends(get_db)):
    rca = service.update_rca(db, rca_id, data)
    if rca is None:
        raise HTTPException(status_code=404, detail="RCA not found")
    return rca


@router.post("/api/rca/{rca_id}/actions", response_model=ActionItemRead, status_code=201)
def create_action(rca_id: int, data: ActionItemCreate, db: Session = Depends(get_db)):
    action = service.create_action(db, rca_id, data)
    if action is None:
        raise HTTPException(status_code=404, detail="RCA not found")
    return action


@router.get("/api/rca/{rca_id}/actions", response_model=list[ActionItemRead])
def list_actions(rca_id: int, db: Session = Depends(get_db)):
    return service.list_actions(db, rca_id)


@router.patch("/api/actions/{action_id}", response_model=ActionItemRead)
def update_action(action_id: int, data: ActionItemUpdate, db: Session = Depends(get_db)):
    action = service.update_action(db, action_id, data)
    if action is None:
        raise HTTPException(status_code=404, detail="Action not found")
    return action
