import sys
import os
import pytest

from fastapi.testclient import TestClient

from fastapi.testclient import TestClient
from .main import app, get_db
from .database import Base, SessionLocal, engine
from .models import User, Department, Reimbursement

# Adjust the path to ensure the main module can be imported
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))



client = TestClient(app)

def test_get_departments():
    response = client.get("/getDepartments")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_add_department():
    response = client.post("/adddepartment", data={"department": "Test Department1"})
    assert response.status_code == 200
    assert response.json() == {"data": "Test Department1"}

def test_register_user():
    response = client.post("/register", data={
        "position": 1,
        "department": 44,
        "usermail": "test3@example.com",
        "password": "testpassword",
        "username": "testuser3"
    })
    assert response.status_code == 200
    assert response.json()["username"] == "testuser3"

def test_login_user():
    response = client.post("/login", data={
        "username": "testuser3",
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert response.json()["username"] == "testuser3"


# @pytest.fixture(scope="module")
# def setup_db():
#     Base.metadata.create_all(bind=engine)
#     db = SessionLocal()
#     db.add_all([
#         Department(id=1, department="HR"),
#         User(empid=1, username="admin", email="admin@example.com", pID=1, deptID=1, mId=0),
#         User(empid=2, username="manager1", email="manager1@example.com", pID=2, deptID=1, mId=1),
#         User(empid=3, username="employee1", email="employee1@example.com", pID=1, deptID=1, mId=2),
#     ])
#     db.commit()
#     db.close()
#     yield
#     Base.metadata.drop_all(bind=engine)






def test_employee_credentials(client     ):
    response = client.get("/employeescredentials")
    assert response.status_code == 200
    data = response.json()
    print(len(data))
    assert len(data) == 14  # Adjust based on the setup

def test_single_employee_credential(client     ):
    response = client.post("/singleempcred", data={"empId": 53})
    assert response.status_code == 200
    data = response.json()
    assert data['curmanager']['username'] == 'managercustomercare01'

def test_get_dept_managers(client     ):
    response = client.post("/getdeptmanagers", data={"department": 39, "empId": 19})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1  # Adjust based on the setup

def test_update_employee(client     ):
    response = client.put("/updateEmp", data={"empId": 53, "manager": 19, "dept": 39})
    assert response.status_code == 200
    data = response.json()
    assert data['manager'] == 'managercustomercare01'

def test_update_manager(client     ):
    response = client.put("/updateManager", data={"empId": 21, "dept": 36, "newmanager":19})
    assert response.status_code == 200
    assert response.json()["Response"] == "data changed"

def test_manager_credentials(client     ):
    response = client.get("/managerscredentials")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 11  # Adjust based on the setup

def test_delete_employee(client     ):
    response = client.delete("/delemp", data={"empId":53 })
    assert response.status_code == 200
    response = client.get("/employeescredentials")
    data = response.json()
    assert len(data) == 12  # Employee count should decrease by one

def test_upload_file(client     ):
    with open("test.jpg", "wb") as f:
        f.write(b"test data")
    
    with open("test.jpg", "rb") as f:
        response = client.post("/upload", files={"file": f}, data={"type": "Travel", "empId": 3, "amt": 100, "date": "2024-01-01"})
    
    os.remove("test.jpg")
    assert response.status_code == 200
    assert response.json()["message"] == "File uploaded successfully!"

def test_get_all_reimbursements(client     ):
    response = client.post("/getselfimbursementsall", data={"empId": 30})
    assert response.status_code == 200

def test_get_unapproved_reimbursements(client     ):
    response = client.post("/getselfimbursementsunapproved", data={"empId": 30})
    assert response.status_code == 200

def test_to_review(client     ):
    response = client.post("/toreview", data={"empid": 19})
    assert response.status_code == 200

def test_to_review_admin(client     ):
    response = client.post("/reviewadmin")
    assert response.status_code == 200

def test_get_image(client     ):
    response = client.post("/get_image/", data={"id": 1})
    assert response.status_code == 200

def test_review_approve(client     ):
    response = client.put("/reviewapprove", data={"rid": 7, "appr_m": 19, "status": True, "comment": "Approved"})
    assert response.status_code == 200
    assert response.json()["message"] == "Review updated successfully"