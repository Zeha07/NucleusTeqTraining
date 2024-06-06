import sys
import os
import pytest
from fastapi.testclient import TestClient

# Adjust the path to ensure the main module can be imported
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from .main import app, get_db

client = TestClient(app)

def test_get_departments():
    response = client.get("/getDepartments")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_add_department():
    response = client.post("/adddepartment", data={"department": "Test Department"})
    assert response.status_code == 200
    assert response.json() == {"data": "Test Department"}

def test_register_user():
    response = client.post("/register", data={
        "position": 1,
        "department": 1,
        "usermail": "test@example.com",
        "password": "testpassword",
        "username": "testuser"
    })
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

def test_login_user():
    response = client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
