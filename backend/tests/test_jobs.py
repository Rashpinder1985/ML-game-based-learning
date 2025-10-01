import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_job_not_found():
    response = client.get("/api/v1/jobs/non-existent-job-id")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_get_job_invalid_id():
    response = client.get("/api/v1/jobs/")
    assert response.status_code == 404