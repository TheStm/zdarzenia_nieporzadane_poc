class TestCreateIncident:
    def test_create_incident_returns_201(self, client, sample_incident_data):
        response = client.post("/api/incidents", json=sample_incident_data)
        assert response.status_code == 201

    def test_create_incident_returns_id(self, client, sample_incident_data):
        response = client.post("/api/incidents", json=sample_incident_data)
        data = response.json()
        assert "id" in data
        assert isinstance(data["id"], int)

    def test_create_incident_sets_status_new(self, client, sample_incident_data):
        response = client.post("/api/incidents", json=sample_incident_data)
        data = response.json()
        assert data["status"] == "new"

    def test_create_incident_stores_all_fields(self, client, sample_incident_data):
        response = client.post("/api/incidents", json=sample_incident_data)
        data = response.json()
        assert data["event_type"] == "ZN"
        assert data["department"] == "Oddział Chirurgii"
        assert data["category"] == "B"
        assert data["severity"] == 2
        assert data["reporter_name"] == "Dr Anna Kowalska"

    def test_create_incident_validates_description_min_length(self, client, sample_incident_data):
        sample_incident_data["description"] = "Too short"
        response = client.post("/api/incidents", json=sample_incident_data)
        assert response.status_code == 422

    def test_create_incident_validates_required_fields(self, client):
        response = client.post("/api/incidents", json={})
        assert response.status_code == 422

    def test_create_anonymous_incident(self, client, sample_incident_data):
        sample_incident_data["reporter_anonymous"] = True
        sample_incident_data["reporter_name"] = None
        response = client.post("/api/incidents", json=sample_incident_data)
        assert response.status_code == 201
        assert response.json()["reporter_anonymous"] is True


class TestGetIncident:
    def test_get_incident_by_id(self, client, sample_incident_data):
        create_resp = client.post("/api/incidents", json=sample_incident_data)
        incident_id = create_resp.json()["id"]

        response = client.get(f"/api/incidents/{incident_id}")
        assert response.status_code == 200
        assert response.json()["id"] == incident_id

    def test_get_nonexistent_incident_returns_404(self, client):
        response = client.get("/api/incidents/99999")
        assert response.status_code == 404


class TestListIncidents:
    def test_list_incidents_empty(self, client):
        response = client.get("/api/incidents")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0

    def test_list_incidents_returns_created(self, client, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data)
        client.post("/api/incidents", json=sample_incident_data)

        response = client.get("/api/incidents")
        data = response.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    def test_list_incidents_filter_by_status(self, client, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data)
        response = client.get("/api/incidents?status=new")
        assert response.json()["total"] == 1

        response = client.get("/api/incidents?status=closed")
        assert response.json()["total"] == 0

    def test_list_incidents_filter_by_category(self, client, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data)
        response = client.get("/api/incidents?category=B")
        assert response.json()["total"] == 1

        response = client.get("/api/incidents?category=A")
        assert response.json()["total"] == 0


class TestUpdateIncidentStatus:
    def test_update_status(self, client, sample_incident_data):
        create_resp = client.post("/api/incidents", json=sample_incident_data)
        incident_id = create_resp.json()["id"]

        response = client.patch(
            f"/api/incidents/{incident_id}/status",
            json={"status": "in_triage"},
        )
        assert response.status_code == 200
        assert response.json()["status"] == "in_triage"

    def test_update_status_nonexistent_returns_404(self, client):
        response = client.patch(
            "/api/incidents/99999/status",
            json={"status": "in_triage"},
        )
        assert response.status_code == 404
