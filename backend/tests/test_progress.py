import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_progress():
    response = client.get("/api/v1/progress/me?user_id=test_user")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_progress():
    progress_data = {
        "user_id": "test_user",
        "lesson_id": 1,
        "status": "in_progress",
        "score": 0,
        "attempts": 1
    }
    
    response = client.post("/api/v1/progress", json=progress_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["user_id"] == progress_data["user_id"]
    assert data["lesson_id"] == progress_data["lesson_id"]
    assert data["status"] == progress_data["status"]
    assert data["score"] == progress_data["score"]
    assert data["attempts"] == progress_data["attempts"]

def test_update_progress_not_found():
    update_data = {"status": "completed", "score": 100}
    response = client.put("/api/v1/progress/99999", json=update_data)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()