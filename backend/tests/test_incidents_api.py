"""Tests for incident CRUD operations (using coordinator role for full access)."""


class TestCreateIncident:
    def test_create_incident_returns_201(self, client, coordinator_headers, sample_incident_data):
        response = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        assert response.status_code == 201

    def test_create_incident_returns_id(self, client, coordinator_headers, sample_incident_data):
        response = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        data = response.json()
        assert "id" in data
        assert isinstance(data["id"], int)

    def test_create_incident_sets_status_new(self, client, coordinator_headers, sample_incident_data):
        response = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        data = response.json()
        assert data["status"] == "new"

    def test_create_incident_stores_all_fields(self, client, coordinator_headers, sample_incident_data):
        response = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        data = response.json()
        assert data["event_type"] == "ZN"
        assert data["department"] == "Oddział Chirurgii"
        assert data["category"] == "B"
        assert data["severity"] == 2
        assert data["reporter_name"] == "Dr Anna Kowalska"

    def test_create_incident_sets_reporter_user_id(self, client, coordinator_headers, coordinator_user, sample_incident_data):
        response = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        data = response.json()
        assert data["reporter_user_id"] == coordinator_user.id

    def test_create_incident_validates_description_min_length(self, client, coordinator_headers, sample_incident_data):
        sample_incident_data["description"] = "Too short"
        response = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        assert response.status_code == 422

    def test_create_incident_validates_required_fields(self, client, coordinator_headers):
        response = client.post("/api/incidents", json={}, headers=coordinator_headers)
        assert response.status_code == 422

    def test_create_anonymous_incident(self, client, coordinator_headers, sample_incident_data):
        sample_incident_data["reporter_anonymous"] = True
        sample_incident_data["reporter_name"] = None
        response = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        assert response.status_code == 201
        assert response.json()["reporter_anonymous"] is True


class TestGetIncident:
    def test_get_incident_by_id(self, client, coordinator_headers, sample_incident_data):
        create_resp = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        incident_id = create_resp.json()["id"]

        response = client.get(f"/api/incidents/{incident_id}", headers=coordinator_headers)
        assert response.status_code == 200
        assert response.json()["id"] == incident_id

    def test_get_nonexistent_incident_returns_404(self, client, coordinator_headers):
        response = client.get("/api/incidents/99999", headers=coordinator_headers)
        assert response.status_code == 404


class TestListIncidents:
    def test_list_incidents_empty(self, client, coordinator_headers):
        response = client.get("/api/incidents", headers=coordinator_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0

    def test_list_incidents_returns_created(self, client, coordinator_headers, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)

        response = client.get("/api/incidents", headers=coordinator_headers)
        data = response.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    def test_list_incidents_filter_by_status(self, client, coordinator_headers, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        response = client.get("/api/incidents?status=new", headers=coordinator_headers)
        assert response.json()["total"] == 1

        response = client.get("/api/incidents?status=closed", headers=coordinator_headers)
        assert response.json()["total"] == 0

    def test_list_incidents_filter_by_category(self, client, coordinator_headers, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        response = client.get("/api/incidents?category=B", headers=coordinator_headers)
        assert response.json()["total"] == 1

        response = client.get("/api/incidents?category=A", headers=coordinator_headers)
        assert response.json()["total"] == 0


class TestUpdateIncidentStatus:
    def test_update_status(self, client, coordinator_headers, sample_incident_data):
        create_resp = client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        incident_id = create_resp.json()["id"]

        response = client.patch(
            f"/api/incidents/{incident_id}/status",
            json={"status": "in_triage"},
            headers=coordinator_headers,
        )
        assert response.status_code == 200
        assert response.json()["status"] == "in_triage"

    def test_update_status_nonexistent_returns_404(self, client, coordinator_headers):
        response = client.patch(
            "/api/incidents/99999/status",
            json={"status": "in_triage"},
            headers=coordinator_headers,
        )
        assert response.status_code == 404
