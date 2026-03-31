import pytest


@pytest.fixture
def rca_id(client, sample_incident_data):
    inc = client.post("/api/incidents", json=sample_incident_data).json()
    rca = client.post(f"/api/incidents/{inc['id']}/rca", json={}).json()
    return rca["id"]


class TestCreateAction:
    def test_create_action_item(self, client, rca_id):
        resp = client.post(
            f"/api/rca/{rca_id}/actions",
            json={
                "description": "Wdrożyć alert alergii w systemie HIS",
                "responsible_person": "Mgr Kowalska",
                "deadline": "2026-04-30",
            },
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["rca_id"] == rca_id
        assert data["status"] == "todo"
        assert data["responsible_person"] == "Mgr Kowalska"

    def test_create_action_nonexistent_rca_404(self, client):
        resp = client.post(
            "/api/rca/99999/actions",
            json={
                "description": "Test",
                "responsible_person": "Test",
                "deadline": "2026-04-30",
            },
        )
        assert resp.status_code == 404

    def test_create_action_validates_required(self, client, rca_id):
        resp = client.post(f"/api/rca/{rca_id}/actions", json={})
        assert resp.status_code == 422


class TestListActions:
    def test_list_actions_for_rca(self, client, rca_id):
        client.post(
            f"/api/rca/{rca_id}/actions",
            json={"description": "Action 1", "responsible_person": "A", "deadline": "2026-04-30"},
        )
        client.post(
            f"/api/rca/{rca_id}/actions",
            json={"description": "Action 2", "responsible_person": "B", "deadline": "2026-05-15"},
        )
        resp = client.get(f"/api/rca/{rca_id}/actions")
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_list_actions_empty(self, client, rca_id):
        resp = client.get(f"/api/rca/{rca_id}/actions")
        assert resp.status_code == 200
        assert len(resp.json()) == 0


class TestUpdateAction:
    def test_update_action_status(self, client, rca_id):
        create_resp = client.post(
            f"/api/rca/{rca_id}/actions",
            json={"description": "Task", "responsible_person": "X", "deadline": "2026-04-30"},
        )
        action_id = create_resp.json()["id"]

        resp = client.patch(
            f"/api/actions/{action_id}",
            json={"status": "completed", "completion_notes": "Zrealizowano 15.04"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "completed"
        assert data["completed_at"] is not None

    def test_update_nonexistent_action_404(self, client):
        resp = client.patch("/api/actions/99999", json={"status": "completed"})
        assert resp.status_code == 404
