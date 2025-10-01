import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_submit_code():
    submission_data = {
        "lesson_id": 1,
        "user_id": "test_user",
        "code": "print('Hello, World!')",
        "language": "python"
    }
    
    response = client.post("/api/v1/submit", json=submission_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["lesson_id"] == submission_data["lesson_id"]
    assert data["user_id"] == submission_data["user_id"]
    assert data["code"] == submission_data["code"]
    assert data["language"] == submission_data["language"]
    assert data["status"] == "pending"

def test_get_submission_not_found():
    response = client.get("/api/v1/submissions/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()