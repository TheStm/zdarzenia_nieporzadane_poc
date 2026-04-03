"""Tests for authentication and user management."""
import time

import jwt


class TestPasswordHashing:
    def test_create_user_hashes_password(self, client, admin_headers):
        response = client.post(
            "/api/auth/users",
            json={
                "email": "test@example.com",
                "password": "securepass123",
                "full_name": "Test User",
                "role": "reporter",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert "password" not in data
        assert "hashed_password" not in data

    def test_verify_password_correct(self, client, admin_headers):
        client.post(
            "/api/auth/users",
            json={
                "email": "test@example.com",
                "password": "securepass123",
                "full_name": "Test User",
                "role": "reporter",
            },
            headers=admin_headers,
        )
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "securepass123"},
        )
        assert response.status_code == 200

    def test_verify_password_wrong(self, client, admin_headers):
        client.post(
            "/api/auth/users",
            json={
                "email": "test@example.com",
                "password": "securepass123",
                "full_name": "Test User",
                "role": "reporter",
            },
            headers=admin_headers,
        )
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "wrongpassword"},
        )
        assert response.status_code == 401


class TestLogin:
    def test_login_returns_token(self, client, created_user):
        response = client.post(
            "/api/auth/login",
            json={"email": "reporter@example.com", "password": "testpass123"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_token_contains_user_info(self, client, created_user):
        response = client.post(
            "/api/auth/login",
            json={"email": "reporter@example.com", "password": "testpass123"},
        )
        token = response.json()["access_token"]
        payload = jwt.decode(token, options={"verify_signature": False})
        assert payload["sub"] == str(created_user.id)
        assert payload["role"] == "reporter"

    def test_login_wrong_password_401(self, client, created_user):
        response = client.post(
            "/api/auth/login",
            json={"email": "reporter@example.com", "password": "wrongpass"},
        )
        assert response.status_code == 401

    def test_login_nonexistent_user_401(self, client):
        response = client.post(
            "/api/auth/login",
            json={"email": "nobody@example.com", "password": "testpass123"},
        )
        assert response.status_code == 401

    def test_login_inactive_user_401(self, client, db):
        from app.models.user import User
        from app.services.auth import hash_password

        user = User(
            email="inactive@example.com",
            hashed_password=hash_password("testpass123"),
            full_name="Inactive User",
            role="reporter",
            is_active=False,
        )
        db.add(user)
        db.commit()

        response = client.post(
            "/api/auth/login",
            json={"email": "inactive@example.com", "password": "testpass123"},
        )
        assert response.status_code == 401


class TestMe:
    def test_me_returns_user_profile(self, client, auth_headers, created_user):
        response = client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "reporter@example.com"
        assert data["full_name"] == "Test Reporter"
        assert data["role"] == "reporter"
        assert data["id"] == created_user.id

    def test_me_without_token_401(self, client):
        response = client.get("/api/auth/me")
        assert response.status_code == 401

    def test_me_with_invalid_token_401(self, client):
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid.token.here"},
        )
        assert response.status_code == 401

    def test_me_with_expired_token_401(self, client, created_user):
        from app.config import settings

        payload = {
            "sub": str(created_user.id),
            "role": created_user.role,
            "exp": int(time.time()) - 10,
        }
        expired_token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {expired_token}"},
        )
        assert response.status_code == 401


class TestCreateUser:
    def test_create_user_returns_201(self, client, admin_headers):
        response = client.post(
            "/api/auth/users",
            json={
                "email": "new@example.com",
                "password": "securepass123",
                "full_name": "New User",
                "role": "coordinator",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "new@example.com"
        assert data["full_name"] == "New User"
        assert data["role"] == "coordinator"
        assert data["is_active"] is True
        assert "id" in data

    def test_create_user_duplicate_email_409(self, client, admin_headers, created_user):
        response = client.post(
            "/api/auth/users",
            json={
                "email": "reporter@example.com",
                "password": "anotherpass123",
                "full_name": "Duplicate User",
                "role": "reporter",
            },
            headers=admin_headers,
        )
        assert response.status_code == 409

    def test_create_user_short_password_422(self, client, admin_headers):
        response = client.post(
            "/api/auth/users",
            json={
                "email": "short@example.com",
                "password": "short",
                "full_name": "Short Pass",
                "role": "reporter",
            },
            headers=admin_headers,
        )
        assert response.status_code == 422

    def test_create_user_default_role_reporter(self, client, admin_headers):
        response = client.post(
            "/api/auth/users",
            json={
                "email": "default@example.com",
                "password": "securepass123",
                "full_name": "Default Role",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        assert response.json()["role"] == "reporter"
