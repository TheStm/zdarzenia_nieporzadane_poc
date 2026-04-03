"""Tests for notification system."""
import pytest


@pytest.fixture
def incident_with_notifications(client, reporter_headers, coordinator_user, sample_incident_data):
    """Create an incident as reporter — should generate notifications for coordinators."""
    resp = client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)
    return resp.json()


class TestNotificationCreation:
    def test_incident_creates_notification_for_coordinators(
        self, client, reporter_headers, coordinator_headers, coordinator_user, sample_incident_data
    ):
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)

        resp = client.get("/api/notifications", headers=coordinator_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["unread_count"] >= 1
        types = [n["type"] for n in data["items"]]
        assert "incident_created" in types

    def test_status_change_notifies_reporter(
        self, client, reporter_headers, coordinator_headers, sample_incident_data
    ):
        inc = client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers).json()
        client.patch(
            f"/api/incidents/{inc['id']}/status",
            json={"status": "in_triage"},
            headers=coordinator_headers,
        )

        resp = client.get("/api/notifications", headers=reporter_headers)
        data = resp.json()
        types = [n["type"] for n in data["items"]]
        assert "status_changed" in types

    def test_rca_creation_notifies_reporter(
        self, client, reporter_headers, coordinator_headers, sample_incident_data
    ):
        inc = client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers).json()
        client.post(
            f"/api/incidents/{inc['id']}/rca",
            json={"description": "Analiza", "team_members": "Dr X"},
            headers=coordinator_headers,
        )

        resp = client.get("/api/notifications", headers=reporter_headers)
        types = [n["type"] for n in resp.json()["items"]]
        assert "rca_created" in types

    def test_action_assignment_notifies_responsible_user(
        self, client, coordinator_headers, coordinator_user, admin_user, admin_headers, sample_incident_data
    ):
        inc = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers).json()
        rca = client.post(
            f"/api/incidents/{inc['id']}/rca", json={}, headers=coordinator_headers
        ).json()
        client.post(
            f"/api/rca/{rca['id']}/actions",
            json={
                "description": "Zrób coś",
                "responsible_person": "Admin",
                "responsible_user_id": admin_user.id,
                "deadline": "2026-05-01",
            },
            headers=coordinator_headers,
        )

        resp = client.get("/api/notifications", headers=admin_headers)
        types = [n["type"] for n in resp.json()["items"]]
        assert "action_assigned" in types


class TestNotificationAPI:
    def test_get_notifications_returns_own(
        self, client, reporter_headers, coordinator_headers, coordinator_user, sample_incident_data
    ):
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)

        resp = client.get("/api/notifications", headers=coordinator_headers)
        assert resp.status_code == 200
        assert "items" in resp.json()
        assert "unread_count" in resp.json()

    def test_get_unread_count(
        self, client, reporter_headers, coordinator_headers, coordinator_user, sample_incident_data
    ):
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)

        resp = client.get("/api/notifications/unread-count", headers=coordinator_headers)
        assert resp.status_code == 200
        assert resp.json()["unread_count"] >= 1

    def test_mark_as_read(
        self, client, reporter_headers, coordinator_headers, coordinator_user, sample_incident_data
    ):
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)

        notifs = client.get("/api/notifications", headers=coordinator_headers).json()
        notif_id = notifs["items"][0]["id"]

        resp = client.patch(f"/api/notifications/{notif_id}/read", headers=coordinator_headers)
        assert resp.status_code == 200

        count = client.get("/api/notifications/unread-count", headers=coordinator_headers).json()
        assert count["unread_count"] == 0

    def test_mark_all_as_read(
        self, client, reporter_headers, coordinator_headers, coordinator_user, sample_incident_data
    ):
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)

        resp = client.post("/api/notifications/mark-all-read", headers=coordinator_headers)
        assert resp.status_code == 200

        count = client.get("/api/notifications/unread-count", headers=coordinator_headers).json()
        assert count["unread_count"] == 0

    def test_cannot_read_others_notifications(
        self, client, reporter_headers, coordinator_headers, coordinator_user, sample_incident_data
    ):
        client.post("/api/incidents", json=sample_incident_data, headers=reporter_headers)

        notifs = client.get("/api/notifications", headers=coordinator_headers).json()
        notif_id = notifs["items"][0]["id"]

        # Reporter tries to mark coordinator's notification as read
        resp = client.patch(f"/api/notifications/{notif_id}/read", headers=reporter_headers)
        assert resp.status_code == 404

    def test_notifications_require_auth(self, client):
        assert client.get("/api/notifications").status_code == 401
        assert client.get("/api/notifications/unread-count").status_code == 401
