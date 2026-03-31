class TestDashboardStats:
    def test_stats_empty(self, client):
        resp = client.get("/api/dashboard/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 0
        assert data["by_status"] == {}
        assert data["by_category"] == {}
        assert data["by_severity"] == {}

    def test_stats_with_incidents(self, client, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data)
        client.post("/api/incidents", json=sample_incident_data)

        resp = client.get("/api/dashboard/stats")
        data = resp.json()
        assert data["total"] == 2
        assert data["by_status"]["new"] == 2
        assert data["by_category"]["B"] == 2
        assert data["by_severity"]["2"] == 2

    def test_stats_by_month(self, client, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data)

        resp = client.get("/api/dashboard/stats")
        data = resp.json()
        assert "by_month" in data
        assert len(data["by_month"]) > 0
