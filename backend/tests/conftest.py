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


# --- Per-role user fixtures ---

def _make_user(db, email, role):
    from app.models.user import User
    from app.services.auth import hash_password

    user = User(
        email=email,
        hashed_password=hash_password("testpass123"),
        full_name=f"Test {role.title()}",
        role=role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _make_headers(user):
    from app.services.auth import create_access_token

    token = create_access_token(user.id, user.role)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def reporter_user(db):
    return _make_user(db, "reporter@example.com", "reporter")


@pytest.fixture
def reporter_headers(reporter_user):
    return _make_headers(reporter_user)


@pytest.fixture
def coordinator_user(db):
    return _make_user(db, "coordinator@example.com", "coordinator")


@pytest.fixture
def coordinator_headers(coordinator_user):
    return _make_headers(coordinator_user)


@pytest.fixture
def admin_user(db):
    return _make_user(db, "admin@example.com", "admin")


@pytest.fixture
def admin_headers(admin_user):
    return _make_headers(admin_user)


# Backward-compat aliases for existing auth tests
@pytest.fixture
def created_user(reporter_user):
    return reporter_user


@pytest.fixture
def auth_token(created_user):
    from app.services.auth import create_access_token

    return create_access_token(created_user.id, created_user.role)


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}
