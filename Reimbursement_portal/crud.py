from sqlalchemy.orm import Session
from  models import *
from  schemas import *
import json
import os 
import base64
from uuid import uuid4
from fastapi.responses import JSONResponse ,FileResponse
from fastapi import Depends , FastAPI, HTTPException, status , Form ,UploadFile ,File


UPLOAD_DIRECTORY ="Reimbursement_image"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)


def add_position(db : Session , post : Addposition):
    db_position = Position(post = post.post.lower())
    db.add(db_position)
    db.commit()
    db.refresh(db_position)
    return db_position



def get_positions(db:Session):
    positions = db.query(Position).all()
    # db.refresh()
    return positions


def add_department(db : Session , department : str):
    db_department = Department(department = department.lower())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department


def get_departments(db:Session):
    departments = db.query(Department).all()
    # db.refresh()
    return departments


# def show_users(db:Session ,users : models.User):
    
#     showuser
#     return showuser


def get_users(db:Session):
    users = db.query(User).all()
    # print(users)
    showuser =[]
    for user in users:
        print(user.username)
        this_department = db.query(Department).filter(Department.id == user.deptID).first()
        # db.rollback()
        # print(this_department)
        this_position = db.query(Position).filter(Position.id == user.pID).first()
        # db.rollback()
        this_manager = db.query(User).filter(User.mId == user.mId).first()
        # db.rollback()
        showuser.append({"email" : user.email , "department" : this_department.department , "username" : user.username ,"manager" :this_manager.username, "position" : this_position.post})
    return showuser




def add_user(db : Session , user : RegisterUser):
         db_user = User(email = user.usermail , passwd = user.password , deptID = user.department , username = user.username , pID = user.position   )
         db.add(db_user)
         db.commit()
         db.refresh(db_user)
         return db_user

def GetDeptManagers(department : int ,db:Session):
    managers = db.query(User).filter(User.deptID == department , User.pID==2).all()
    manager=[]
    for i in managers:
        trial = {"username" : i.username , "id" : i.empid}
        manager.append(trial)
    print(manager)
    return manager 

def GetManagerEmp(manager :int ,db:Session):
     emps =[]
     db_emps = db.query(User).filter(User.mId==manager).all()
     for emp in db_emps:
          trial ={"username" :emp.username ,"id" :emp.empid}
          emps.append(trial)
    
     return emps

def get_all_imbursements(empid,db:Session):
    imbursements  = db.query(Reimbursement).filter(Reimbursement.empid==empid).all()
    return imbursements

