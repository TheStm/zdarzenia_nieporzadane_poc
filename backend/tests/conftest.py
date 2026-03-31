import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

SQLITE_URL = "sqlite:///./test.db"
engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
TestSession = sessionmaker(bind=engine)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    session = TestSession()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def sample_incident_data():
    return {
        "event_type": "ZN",
        "event_date": "2026-03-30T14:30:00",
        "department": "Oddział Chirurgii",
        "location": "Sala operacyjna",
        "category": "B",
        "description": "Pacjentowi podano niewłaściwy lek — zamiast paracetamolu podano ibuprofen, na który pacjent ma udokumentowaną alergię w dokumentacji medycznej.",
        "severity": 2,
        "immediate_actions_taken": True,
        "immediate_actions_desc": "Podano leki przeciwalergiczne, monitorowano stan pacjenta.",
        "patient_age": 65,
        "patient_sex": "M",
        "reporter_anonymous": False,
        "reporter_name": "Dr Anna Kowalska",
        "reporter_role": "Lekarz",
    }
