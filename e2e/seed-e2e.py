"""Seed the E2E test database with test users."""
import os
import sys

# DATABASE_URL must be set before importing app modules
assert "DATABASE_URL" in os.environ, "DATABASE_URL env var required"

from app.database import Base, engine  # noqa: E402
from app.models.user import User  # noqa: E402
from app.models.incident import Incident, Status  # noqa: E402
from app.models.rca import RCAAnalysis, ActionItem  # noqa: E402
from app.models.notification import Notification  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402
from app.services.auth import hash_password  # noqa: E402

Base.metadata.create_all(bind=engine)

with Session(engine) as db:
    for email, password, name, role in [
        ("admin", "admin", "Administrator", "admin"),
        ("koordynator", "koordynator", "Anna Kowalska", "coordinator"),
        ("reporter", "reporter", "Jan Nowak", "reporter"),
    ]:
        db.add(
            User(
                email=email,
                hashed_password=hash_password(password),
                full_name=name,
                role=role,
            )
        )
    db.commit()
    count = db.query(User).count()
    print(f"Seeded {count} users")
