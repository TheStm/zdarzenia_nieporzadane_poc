from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.incident import Category, Status
from app.schemas.incident import (
    IncidentCreate,
    IncidentListResponse,
    IncidentRead,
    IncidentStatusUpdate,
)
from app.services import incidents as service

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.post("", response_model=IncidentRead, status_code=201)
def create_incident(data: IncidentCreate, db: Session = Depends(get_db)):
    return service.create_incident(db, data)


@router.get("/{incident_id}", response_model=IncidentRead)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = service.get_incident(db, incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.get("", response_model=IncidentListResponse)
def list_incidents(
    status: Status | None = None,
    category: Category | None = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    items, total = service.list_incidents(db, status=status, category=category, skip=skip, limit=limit)
    return IncidentListResponse(items=items, total=total)


@router.patch("/{incident_id}/status", response_model=IncidentRead)
def update_incident_status(
    incident_id: int, data: IncidentStatusUpdate, db: Session = Depends(get_db)
):
    incident = service.update_incident_status(db, incident_id, data)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident
