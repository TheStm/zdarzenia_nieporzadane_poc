"""Tests for role-based authorization across all endpoints."""


class TestReporterAccess:
    def test_reporter_can_create_incident(self, client, reporter_headers, sample_incident_data):
        r = client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)
        assert r.status_code == 201
        assert r.json()["reporter_user_id"] is not None

    def test_reporter_sees_only_own_incidents(
        self, client, reporter_headers, coordinator_headers, sample_incident_data
    ):
        # Reporter creates an incident
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)
        # Coordinator creates an incident
        client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)

        r = client.get("/api/incidents", headers=reporter_headers)
        assert r.status_code == 200
        assert r.json()["total"] == 1

    def test_reporter_can_view_own_incident(self, client, reporter_headers, sample_incident_data):
        created = client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers).json()
        r = client.get(f"/api/incidents/{created['id']}", headers=reporter_headers)
        assert r.status_code == 200

    def test_reporter_cannot_view_others_incident(
        self, client, reporter_headers, coordinator_headers, sample_incident_data
    ):
        created = client.post(
            "/api/incidents", json=sample_incident_data, headers=coordinator_headers
        ).json()
        r = client.get(f"/api/incidents/{created['id']}", headers=reporter_headers)
        assert r.status_code == 403

    def test_reporter_cannot_change_status(self, client, reporter_headers, sample_incident_data):
        created = client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers).json()
        r = client.patch(
            f"/api/incidents/{created['id']}/status",
            json={"status": "in_triage"},
            headers=reporter_headers,
        )
        assert r.status_code == 403

    def test_reporter_cannot_access_rca(self, client, reporter_headers):
        r = client.post(
            "/api/incidents/1/rca",
            json={"description": "test", "team_members": "Dr X"},
            headers=reporter_headers,
        )
        assert r.status_code == 403

    def test_reporter_cannot_access_dashboard(self, client, reporter_headers):
        r = client.get("/api/dashboard/stats", headers=reporter_headers)
        assert r.status_code == 403

    def test_reporter_cannot_access_export(self, client, reporter_headers):
        r = client.get("/api/export/incidents.xlsx", headers=reporter_headers)
        assert r.status_code == 403

    def test_reporter_cannot_create_user(self, client, reporter_headers):
        r = client.post(
            "/api/auth/users",
            json={
                "email": "new@example.com",
                "password": "newpass123",
                "full_name": "New",
                "role": "reporter",
            },
            headers=reporter_headers,
        )
        assert r.status_code == 403


class TestCoordinatorAccess:
    def test_coordinator_can_create_incident(self, client, coordinator_headers, sample_incident_data):
        r = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        assert r.status_code == 201

    def test_coordinator_sees_all_incidents(
        self, client, reporter_headers, coordinator_headers, sample_incident_data
    ):
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)
        client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)

        r = client.get("/api/incidents", headers=coordinator_headers)
        assert r.status_code == 200
        assert r.json()["total"] == 2

    def test_coordinator_can_change_status(self, client, coordinator_headers, sample_incident_data):
        created = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers).json()
        r = client.patch(
            f"/api/incidents/{created['id']}/status",
            json={"status": "in_triage"},
            headers=coordinator_headers,
        )
        assert r.status_code == 200

    def test_coordinator_can_access_rca(self, client, coordinator_headers, sample_incident_data):
        created = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers).json()
        r = client.post(
            f"/api/incidents/{created['id']}/rca",
            json={"description": "Analiza przyczyn", "team_members": "Dr X"},
            headers=coordinator_headers,
        )
        assert r.status_code == 201

    def test_coordinator_can_access_dashboard(self, client, coordinator_headers):
        r = client.get("/api/dashboard/stats", headers=coordinator_headers)
        assert r.status_code == 200

    def test_coordinator_can_access_export(self, client, coordinator_headers):
        r = client.get("/api/export/incidents.xlsx", headers=coordinator_headers)
        assert r.status_code == 200

    def test_coordinator_cannot_create_user(self, client, coordinator_headers):
        r = client.post(
            "/api/auth/users",
            json={
                "email": "new@example.com",
                "password": "newpass123",
                "full_name": "New",
                "role": "reporter",
            },
            headers=coordinator_headers,
        )
        assert r.status_code == 403


class TestAdminAccess:
    def test_admin_can_create_user(self, client, admin_headers):
        r = client.post(
            "/api/auth/users",
            json={
                "email": "new@example.com",
                "password": "newpass123",
                "full_name": "New User",
                "role": "reporter",
            },
            headers=admin_headers,
        )
        assert r.status_code == 201

    def test_admin_sees_all_incidents(
        self, client, reporter_headers, admin_headers, sample_incident_data
    ):
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)
        client.post("/api/incidents", json=sample_incident_data, headers=admin_headers)

        r = client.get("/api/incidents", headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["total"] == 2

    def test_admin_can_change_status(self, client, admin_headers, sample_incident_data):
        created = client.post("/api/incidents", json=sample_incident_data, headers=admin_headers).json()
        r = client.patch(
            f"/api/incidents/{created['id']}/status",
            json={"status": "in_triage"},
            headers=admin_headers,
        )
        assert r.status_code == 200

    def test_admin_can_access_dashboard(self, client, admin_headers):
        r = client.get("/api/dashboard/stats", headers=admin_headers)
        assert r.status_code == 200


class TestUnauthenticatedAccess:
    def test_incidents_require_auth(self, client):
        assert client.get("/api/incidents").status_code == 401
        assert client.post("/api/incidents", json={}).status_code == 401

    def test_rca_requires_auth(self, client):
        assert client.post("/api/incidents/1/rca", json={}).status_code == 401

    def test_dashboard_requires_auth(self, client):
        assert client.get("/api/dashboard/stats").status_code == 401

    def test_export_requires_auth(self, client):
        assert client.get("/api/export/incidents.xlsx").status_code == 401

    def test_create_user_requires_auth(self, client):
        assert client.post("/api/auth/users", json={}).status_code == 401

    def test_login_is_public(self, client):
        r = client.post("/api/auth/login", json={"email": "x", "password": "y"})
        assert r.status_code == 401  # bad creds, but NOT 401 for missing token

    def test_health_is_public(self, client):
        assert client.get("/api/health").status_code == 200
