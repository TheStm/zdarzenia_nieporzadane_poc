"""Tests for RCA operations (using coordinator role)."""
import pytest


@pytest.fixture
def incident_id(client, coordinator_headers, sample_incident_data):
    resp = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
    return resp.json()["id"]


class TestCreateRCA:
    def test_create_rca_for_incident(self, client, coordinator_headers, incident_id):
        resp = client.post(
            f"/api/incidents/{incident_id}/rca",
            json={"description": "Analiza wstępna", "team_members": "Dr Nowak, Mgr Kowalska"},
            headers=coordinator_headers,
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["incident_id"] == incident_id
        assert data["status"] == "draft"
        assert data["description"] == "Analiza wstępna"

    def test_create_rca_nonexistent_incident_404(self, client, coordinator_headers):
        resp = client.post(
            "/api/incidents/99999/rca", json={}, headers=coordinator_headers
        )
        assert resp.status_code == 404

    def test_create_duplicate_rca_409(self, client, coordinator_headers, incident_id):
        client.post(
            f"/api/incidents/{incident_id}/rca", json={}, headers=coordinator_headers
        )
        resp = client.post(
            f"/api/incidents/{incident_id}/rca", json={}, headers=coordinator_headers
        )
        assert resp.status_code == 409


class TestGetRCA:
    def test_get_rca_for_incident(self, client, coordinator_headers, incident_id):
        client.post(
            f"/api/incidents/{incident_id}/rca",
            json={"description": "Test"},
            headers=coordinator_headers,
        )
        resp = client.get(
            f"/api/incidents/{incident_id}/rca", headers=coordinator_headers
        )
        assert resp.status_code == 200
        assert resp.json()["description"] == "Test"

    def test_get_rca_nonexistent_404(self, client, coordinator_headers, incident_id):
        resp = client.get(
            f"/api/incidents/{incident_id}/rca", headers=coordinator_headers
        )
        assert resp.status_code == 404


class TestUpdateRCA:
    def test_update_rca_fields(self, client, coordinator_headers, incident_id):
        create_resp = client.post(
            f"/api/incidents/{incident_id}/rca", json={}, headers=coordinator_headers
        )
        rca_id = create_resp.json()["id"]

        resp = client.patch(
            f"/api/rca/{rca_id}",
            json={
                "status": "in_progress",
                "root_causes": "Brak weryfikacji alergii w systemie",
                "contributing_factors": "Przeciążenie personelu, brak procedury",
                "recommendations": "Wdrożyć alert w systemie HIS",
            },
            headers=coordinator_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "in_progress"
        assert data["root_causes"] == "Brak weryfikacji alergii w systemie"

    def test_update_rca_complete_sets_timestamp(self, client, coordinator_headers, incident_id):
        create_resp = client.post(
            f"/api/incidents/{incident_id}/rca", json={}, headers=coordinator_headers
        )
        rca_id = create_resp.json()["id"]

        resp = client.patch(
            f"/api/rca/{rca_id}",
            json={"status": "completed"},
            headers=coordinator_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["completed_at"] is not None

    def test_update_nonexistent_rca_404(self, client, coordinator_headers):
        resp = client.patch(
            "/api/rca/99999",
            json={"status": "in_progress"},
            headers=coordinator_headers,
        )
        assert resp.status_code == 404
