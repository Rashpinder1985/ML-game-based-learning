import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "ML Learning Platform API"

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_lessons_endpoint():
    response = client.get("/api/v1/lessons")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_lessons_with_filters():
    response = client.get("/api/v1/lessons?module=module1&difficulty=beginner")
    assert response.status_code == 200
    assert isinstance(response.json(), list)