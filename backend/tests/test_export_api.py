"""Tests for Excel export (using coordinator role)."""


class TestExportExcel:
    def test_export_returns_xlsx(self, client, coordinator_headers, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)

        response = client.get("/api/export/incidents.xlsx", headers=coordinator_headers)
        assert response.status_code == 200
        assert "spreadsheetml" in response.headers["content-type"]
        assert len(response.content) > 100

    def test_export_empty_still_returns_xlsx(self, client, coordinator_headers):
        response = client.get("/api/export/incidents.xlsx", headers=coordinator_headers)
        assert response.status_code == 200
        assert "spreadsheetml" in response.headers["content-type"]

    def test_export_with_filter(self, client, coordinator_headers, sample_incident_data):
        client.post("/api/incidents", json=sample_incident_data, headers=coordinator_headers)
        response = client.get("/api/export/incidents.xlsx?category=B", headers=coordinator_headers)
        assert response.status_code == 200
