class TestExportExcel:
    def test_export_returns_xlsx(self, client, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data)
        client.post("/api/incidents", json=sample_incident_data)

        response = client.get("/api/export/incidents.xlsx")
        assert response.status_code == 200
        assert "spreadsheetml" in response.headers["content-type"]
        assert len(response.content) > 100

    def test_export_empty_still_returns_xlsx(self, client):
        response = client.get("/api/export/incidents.xlsx")
        assert response.status_code == 200
        assert "spreadsheetml" in response.headers["content-type"]

    def test_export_with_filter(self, client, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data)
        response = client.get("/api/export/incidents.xlsx?category=B")
        assert response.status_code == 200
