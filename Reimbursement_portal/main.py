from fastapi import Depends, FastAPI, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from models import Position, Department, User, Reimbursement
from crud import *
from schemas import *
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from fastapi.responses import JSONResponse, FileResponse
import json
import os
import base64
from uuid import uuid4
import logging
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
# Setup logging
LOG_FILENAME = 'app.log'
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler(LOG_FILENAME),
                        logging.StreamHandler()
                    ])
logger = logging.getLogger(__name__)

app = FastAPI()

Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

############################################################################################################
from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)
###############################################################################################
# departments apis
@app.get("/getDepartments", response_model=List[DepartmentModel])
async def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).filter(Department.department != "no_dept").all()
    return departments

@app.post("/adddepartment")
def add_Department(department: str = Form(...), db: Session = Depends(get_db)):
    db_department = add_department(db, department=department)
    return {"data": department}
 

@app.delete("/deldepartment")
async def Deldepartment(deptId: int = Form(...), db: Session = Depends(get_db)):
    db_users = db.query(User).filter(User.deptID == deptId).all()
    user = []
    for emp in db_users:
        emp.deptID = 42
        db.commit()
        db.refresh(emp)
        user.append(emp)

    db_dept = db.query(Department).filter(Department.id == deptId).delete()
    db.commit()
    return status.HTTP_200_OK

# register apis
@app.post("/register")
async def Register(
    position: int = Form(...),
    department: int = Form(...),
    usermail: str = Form(...),
    password: str = Form(...),
    username: str = Form(...),
    db: Session = Depends(get_db)
):
    try:

        passwd = pwd_context.hash(password)
        logger.info("New user registration")
        db_user = User(pID=position, deptID=department, email=usermail, passwd=passwd, username=username, mId=29)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"New user registered: {username}")
        return db_user
    except IntegrityError as e:
        logger.error(f"Integrity error during user registration: {e}")
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=400, detail="User with this email or username already exists")
    except SQLAlchemyError as e:
        logger.error(f"Database error during user registration: {e}")
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Internal server error")
    except Exception as e:
        logger.error(f"Unexpected error during user registration: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

# login apis
@app.post("/login")
async def Login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == username).first()
    if not db_user:
        logger.warning(f"Login attempt with invalid username: {username}")
        return HTTPException(status_code=400, detail="Invalid Username")
    if not pwd_context.verify(password, db_user.passwd):
        logger.warning(f"Incorrect password attempt for username: {username}")
        return HTTPException(status_code=400, detail="Wrong password")
    logger.info(f"User logged in: {username}")
    return db_user

# User APIS ##########################################

# Get user credentials for Admin page
@app.get('/employeescredentials')
async def employee_credentials(db: Session = Depends(get_db)):
 try:
        db_emps = db.query(User).filter(User.pID == 1).all()
        if not db_emps:
            logger.warning("No employees found with pID = 1")
            raise HTTPException(status_code=404, detail="No employees found with pID = 1")

        result = []
        for amp in db_emps:
            manager = "Admin"
            if amp.mId != 0:
                db_manager = db.query(User).filter(User.empid == amp.mId).first()
                if db_manager:
                    manager = db_manager.username
                else:
                    logger.warning(f"Manager with empid {amp.mId} not found")
                    manager = "Unknown Manager"

            department = db.query(Department).filter(Department.id == amp.deptID).first()
            if not department:
                logger.warning(f"Department with id {amp.deptID} not found")
                department_name = "Unknown Department"
            else:
                department_name = department.department

            emp = {
                "department": department_name,
                "manager": manager,
                "username": amp.username,
                "email": amp.email,
                "empId": amp.empid
            }
            result.append(emp)

        logger.info("Fetched employee credentials for admin")
        return result

 except HTTPException as http_exc:
        
        logger.error(f"HTTPException occurred: {http_exc.detail}")
        raise http_exc

 except Exception as exc:
        logger.error(f"An error occurred: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")






@app.post('/singleempcred')
def SingleEmpCred(empId: int = Form(...), db: Session = Depends(get_db)):
    try:
        # Fetch the current employee
        cur_emp = db.query(User).filter(User.empid == empId).first()
        if not cur_emp:
            logger.warning(f"Employee with ID {empId} not found")
            raise HTTPException(status_code=404, detail=f"Employee with ID {empId} not found")

        # Fetch the current manager
        cur_manager = db.query(User).filter(User.empid == cur_emp.mId).first()
        curmanager = {"username": "", "id": 0}
        if cur_manager:
            curmanager = {"username": cur_manager.username, "id": cur_manager.empid}
        else:
            logger.warning(f"Manager with ID {cur_emp.mId} not found for employee ID {empId}")

        # Fetch the current department
        cur_department = db.query(Department).filter(Department.id == cur_emp.deptID).first()
        if not cur_department:
            logger.warning(f"Department with ID {cur_emp.deptID} not found for employee ID {empId}")
            cur_department = {"department": "Unknown Department", "id": cur_emp.deptID}

        # Fetch department managers
        managers = GetDeptManagers(cur_emp.deptID, db)
        if not managers:
            logger.warning(f"No managers found for department ID {cur_emp.deptID}")

        # Fetch all departments
        departments = db.query(Department).all()
        if not departments:
            logger.warning("No departments found")

        logger.info(f"Fetched credentials for employee ID: {empId}")
        return {
            "curmanager": curmanager,
            "managers": managers,
            "cur_dept": cur_department,
            "departments": departments
        }

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to be handled by FastAPI
        logger.error(f"HTTPException occurred: {http_exc.detail}")
        raise http_exc

    except Exception as exc:
        # Handle unexpected exceptions
        logger.error(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Make sure to configure your logger properly in your FastAPI app setup
logging.basicConfig(level=logging.INFO)






@app.post('/getdeptmanagers')
async def getdeptman(department: int = Form(...), empId: int = Form(...), db: Session = Depends(get_db)):
    try:
        # Fetch department managers
        managers = GetDeptManagers(department, db)
        if not managers:
            logger.warning(f"No managers found for department ID {department}")
            raise HTTPException(status_code=404, detail=f"No managers found for department ID {department}")

        # Filter out the employee with empId
        filtered_managers = [manager for manager in managers if manager['id'] != empId]
        logger.info(f"Fetched department managers for department ID: {department}")

        return filtered_managers

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to be handled by FastAPI
        logger.error(f"HTTPException occurred: {http_exc.detail}")
        raise http_exc

    except Exception as exc:
        # Handle unexpected exceptions
        logger.error(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Make sure to configure your logger properly in your FastAPI app setup
logging.basicConfig(level=logging.INFO)







##########UPDATE EMPLOYEE CREDENTIALS ####################
@app.put('/updateEmp')
async def UpdateEmp(empId: int = Form(...), manager: int = Form(...), dept: int = Form(...), db: Session = Depends(get_db)):
    try:
        # Fetch the current employee
        db_emp = db.query(User).filter(User.empid == empId).first()
        if not db_emp:
            logger.warning(f"Employee with ID {empId} not found")
            raise HTTPException(status_code=404, detail=f"Employee with ID {empId} not found")

        # Update the employee's manager and department
        db_emp.mId = manager
        db_emp.deptID = dept
        db.commit()
        db.refresh(db_emp)

        # Fetch the manager's username
        m = db.query(User).filter(User.empid == manager).first()
        manager_username = m.username if m else None
        if not m:
            logger.warning(f"Manager with ID {manager} not found for employee ID {empId}")

        # Fetch the department's name
        department = db.query(Department).filter(Department.id == dept).first()
        if not department:
            logger.warning(f"Department with ID {dept} not found for employee ID {empId}")
            raise HTTPException(status_code=404, detail=f"Department with ID {dept} not found")

        # Prepare the response
        dbemp = {
            "username": db_emp.username,
            "email": db_emp.email,
            "manager": manager_username,
            "department": department.department
        }
        logger.info(f"Updated credentials for employee ID: {empId}")
        return dbemp

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to be handled by FastAPI
        logger.error(f"HTTPException occurred: {http_exc.detail}")
        raise http_exc

    except Exception as exc:
        # Handle unexpected exceptions
        logger.error(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")
    

    
###############################UPDATE MANAGER DEPARTMENT##########################
@app.put("/updateManager")
async def updatemanager(empId: int = Form(...), dept: int = Form(...), newmanager: int = Form(...), db: Session = Depends(get_db)):
    emps_list = GetManagerEmp(empId, db)
    if not emps_list:
            logger.warning(f"No employees found for manager ID {empId}")
    
    if newmanager==0:
        newmanager=29
        # Update each employee's manager to the new manager
    for emp in emps_list:
            try:
                emp_id = emp['id']
                db_emp = db.query(User).filter(User.empid == emp_id).first()
                if db_emp:
                    db_emp.mId = newmanager
                    db.commit()
                    db.refresh(db_emp)
                    logger.info(f"Manager updated for employee ID: {emp_id}")
                else:
                    logger.warning(f"Employee with ID: {emp_id} not found")
            except KeyError as e:
                logger.error(f"Key error: {e} in emp: {emp}")

    try:
        # Fetch the manager
        db_manager = db.query(User).filter(User.empid == empId).first()
        if not db_manager:
            logger.warning(f"Manager with ID {empId} not found")
            raise HTTPException(status_code=404, detail=f"Manager with ID {empId} not found")

        # Update the manager's department
        db_manager.deptID = dept
        db.commit()
        db.refresh(db_manager)
        logger.info(f"Updated department for manager ID: {empId}")

        # Fetch the employees managed by the manager
       
        return {"Response": "Data changed"}

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to be handled by FastAPI
        logger.error(f"HTTPException occurred: {http_exc.detail}")
        raise http_exc

    except Exception as exc:
        # Handle unexpected exceptions
        logger.error(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post('/getmanageremp')
def Getmanageremp(manager: int = Form(...), db: Session = Depends(get_db)):
    emps = GetManagerEmp(manager, db)
    logger.info(f"Fetched employees managed by manager ID: {manager}")
    return emps

@app.get('/managerscredentials')
async def manager_credentials(db: Session = Depends(get_db)):
    try:
        db_emps = db.query(User).filter(User.pID == 2).all()
        result = []

        if not db_emps:
            logger.warning("No managers found")

        for amp in db_emps:
            manager = "Admin"
            if amp.mId != 0:
                db_manager = db.query(User).filter(User.empid == amp.mId).first()
                if db_manager:
                    manager = db_manager.username
                else:
                    logger.warning(f"Manager with ID {amp.mId} not found for user ID {amp.empid}")

            department = db.query(Department).filter(Department.id == amp.deptID).first()
            if not department:
                logger.warning(f"Department with ID {amp.deptID} not found for user ID {amp.empid}")
                department_name = "Unknown Department"
            else:
                department_name = department.department

            emp = {
                "department": department_name,
                "manager": manager,
                "username": amp.username,
                "email": amp.email,
                "empId": amp.empid
            }
            result.append(emp)

        logger.info("Fetched manager credentials")
        return result

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to be handled by FastAPI
        logger.error(f"HTTPException occurred: {http_exc.detail}")
        raise http_exc

    except Exception as exc:
        # Handle unexpected exceptions
        logger.error(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.delete('/delemp')
async def del_emp(empId: int = Form(), db: Session = Depends(get_db)):
    try:
        # Attempt to delete the employee
        db_emp = db.query(User).filter(User.empid == empId).first()
        if not db_emp:
            logger.warning(f"Employee with ID {empId} not found")
            raise HTTPException(status_code=404, detail=f"Employee with ID {empId} not found")
        
        db.delete(db_emp)
        db.commit()
        logger.info(f"Deleted employee ID: {empId}")
        return {"status": "success", "message": "Employee deleted successfully"}

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to be handled by FastAPI
        logger.error(f"HTTPException occurred: {http_exc.detail}")
        raise http_exc

    except Exception as exc:
        # Handle unexpected exceptions
        logger.error(f"An unexpected error occurred while deleting employee ID {empId}: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")


###################################### REIMBURSEMENT CLAIM ############################################################################################
########################## IMAGE HANDELLING ###########################

UPLOAD_DIRECTORY = "Reimbursement_image"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.post('/upload')
async def upload_file(file: UploadFile = File(...), type: str = Form(...), empId: int = Form(...), amt: int = Form(...), date: str = Form(...)):
    logger.info(f"Uploading file for employee ID: {empId}, type: {type}, amount: {amt}, date: {date}")
    if not file.filename.lower().endswith(('.jpg', 'jpeg')):
        logger.error(f"Invalid file type uploaded by employee ID: {empId}")
        raise HTTPException(status_code=400, detail="Invalid file type. Only .jpg and .jpeg files are allowed.")
    contents = await file.read()
    image_filename = f"{uuid4()}.jpg"
    image_path = os.path.join(UPLOAD_DIRECTORY, image_filename)
    with open(image_path, "wb") as buffer:
        buffer.write(contents)
    file_url = f"/uploads/{image_filename}"
    db = SessionLocal()
    mId = db.query(User).filter(User.empid == empId).first()
    image = Reimbursement(empid=empId, type=type, amt=amt, date=date, receipt=file_url, mId=mId.mId, appr_m=0, comments="")
    db.add(image)
    db.commit()
    db.refresh(image)
    logger.info(f"File uploaded successfully by employee ID: {empId}, Reimbursement ID: {image.rId}")
    return JSONResponse(content={"message": "File uploaded successfully!", "id": image.rId})

@app.post("/getselfimbursementsall")
async def Get_ALL_Imburse(empId: int = Form(...), db: Session = Depends(get_db)):
    imbursements = get_all_imbursements(empId, db)
    imburses = []
    for i in imbursements:
        trial = {"rid": i.rId, "type": i.type, "amt": i.amt, "date": i.date, "status": i.status, "comments": i.comments}
        imburses.append(trial)
    logger.info(f"Fetched all reimbursements for employee ID: {empId}")
    return imburses

@app.post('/getselfimbursementsunapproved')
async def GetUnapproved(empId: int = Form(...), db: Session = Depends(get_db)):
    imbursements = get_all_imbursements(empId, db)
    imburses = []
    for i in imbursements:
        if i.status is None:
            trial = {"rid": i.rId, "type": i.type, "amt": i.amt, "date": i.date, "status": i.status, "comments": i.comments}
            imburses.append(trial)
    logger.info(f"Fetched unapproved reimbursements for employee ID: {empId}")
    return imburses

@app.post('/toreview')
async def To_review(empid: int = Form(...), db: Session = Depends(get_db)):
    db_imburses = db.query(Reimbursement).filter(Reimbursement.mId == empid).all()
    toreview = []
    for imburse in db_imburses:
        if imburse.status is None:
            db_emp = db.query(User).filter(User.empid == imburse.empid).first()
            trial = {"rid": imburse.rId, "empusername": db_emp.username, "empid": db_emp.empid, "type": imburse.type, "amt": imburse.amt, "date": imburse.date}
            toreview.append(trial)
    logger.info(f"Fetched reimbursements to review for manager ID: {empid}")
    return toreview

@app.post('/reviewadmin')
async def To_review_admin(db: Session = Depends(get_db)):
    db_imburses = db.query(Reimbursement).all()
    toreview = []
    for imburse in db_imburses:
        if imburse.status is None:
            db_emp = db.query(User).filter(User.empid == imburse.empid).first()
            trial = {"rid": imburse.rId, "empusername": db_emp.username, "empid": db_emp.empid, "type": imburse.type, "amt": imburse.amt, "date": imburse.date}
            toreview.append(trial)
    logger.info("Fetched reimbursements to review for admin")
    return toreview

@app.post("/get_image/")
async def get_image(id: int = Form(...), db: Session = Depends(get_db)):
    db_image = db.query(Reimbursement).filter(Reimbursement.rId == id).first()
    if not db_image:
        logger.error(f"Image not found in database for Reimbursement ID: {id}")
        raise HTTPException(status_code=404, detail="Image not found")
    file_path = db_image.receipt
    filename = file_path.split("/")[-1]
    file_path = os.path.join(UPLOAD_DIRECTORY, filename)
    if not os.path.exists(file_path):
        logger.error(f"File not found for Reimbursement ID: {id}, file path: {file_path}")
        raise HTTPException(status_code=404, detail="File not found")
    with open(file_path, 'rb') as f:
        base64image = base64.b64encode(f.read())
    baseimg = base64image.decode("utf-8")
    logger.info(f"Fetched image for Reimbursement ID: {id}")
    return JSONResponse(content={"img": baseimg})

@app.put("/reviewapprove")
async def review_approve(rid: int = Form(...), appr_m: int = Form(...), status: bool = Form(...), comment: str = Form(...), db: Session = Depends(get_db)):
    db_image = db.query(Reimbursement).filter(Reimbursement.rId == rid).first()
    if not db_image:
        logger.error(f"Reimbursement not found for Reimbursement ID: {rid}")
        raise HTTPException(status_code=404, detail="Reimbursement not found")
    db_image.approved_by = appr_m
    db_image.status = status
    db_image.comments = comment
    db.commit()
    db.refresh(db_image)
    logger.info(f"Review updated for Reimbursement ID: {rid}, approved by: {appr_m}")
    return {"message": "Review updated successfully"}
