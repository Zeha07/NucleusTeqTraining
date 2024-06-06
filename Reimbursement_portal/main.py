from fastapi import Depends , FastAPI, HTTPException, status , Form ,UploadFile ,File
from sqlalchemy.orm import Session
from models import Position , Department ,User ,Reimbursement
from crud import * 
from schemas import *
from database import SessionLocal ,engine
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated , List
from fastapi.responses import JSONResponse ,FileResponse
import json
import os 
import base64
from uuid import uuid4
import logging

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


Base.metadata.create_all(bind = engine)

origins = {           
    "http://localhost:3000"
}

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
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

db_dependency = Annotated[Session ,Depends(get_db)]



#departments apis
@app.get("/getDepartments" , response_model= List[DepartmentModel])
async def get_departments(db: Session =Depends(get_db)):
    db_departments = db.query(Department).all()
    return db_departments


@app.post("/adddepartment")
def add_Department(department : str =Form(...), db : Session = Depends(get_db)):
    db_department= add_department(db , department=department)
    return {"data" : department}

@app.delete("/deldepartment")
async def Deldepartment(deptId : int = Form(...) , db :Session =Depends(get_db)):
    db_users = db.query(User).filter(User.deptID==deptId).all()
    user =[]
    for emp in db_users:
        emp.deptID=42
        db.commit()
        db.refresh(emp)
        user.append(emp)

    db_dept = db.query(Department).filter(Department.id == deptId).delete()
    db.commit()
    return status.HTTP_200_OK

#register apis
@app.post("/register")
async def Register(position :int =Form(...) , department : int = Form(...) , usermail : str =Form(...) , password :str =Form(...) , username :str =Form(...) , db :Session =Depends(get_db)):
    # user = schemas.RegisterUser(pID=position , deptID=department ,email=usermail,passwd = get_password_hash(password),username = username , mId = 0)
    db_user = User(pID=position , deptID=department ,email=usermail,passwd = password,username = username , mId = 0)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)    
    print(username)
    return db_user

#login apis
@app.post("/login")
async def Login (username : str =Form(...) , password :str =Form(...),db:Session = Depends(get_db)):
    db_user = db.query(User).filter( User.username == username).first()
    if not db_user  :
        return HTTPException(status_code=400, detail="Invalid Username")
    if db_user.passwd != password :
        print(username)
        print(db_user.passwd)
        print(password)
        return HTTPException(status_code=400 , detail = "Wrong password")
    print(type(db_user.pID))
    return db_user

# User APIS ##########################################

#Get user credentials for Admin page
@app.get('/employeescredentials')
async def employee_credentials(db : Session =Depends(get_db)):
    db_emps = db.query( User).filter( User.pID==1).all()
    result =[]
    for amp in db_emps :
        manager = "Admin"
        if amp.mId!=0:
            db_manager = db.query( User).filter( User.empid==amp.mId).first()
            manager = db_manager.username
        department = db.query( Department).filter( Department.id == amp.deptID).first()
        emp = {"department" : department.department , "manager" : manager , "username" : amp.username , "email": amp.email , "empId": amp.empid}
        result.append(emp)

    return result


@app.post('/singleempcred')
def SingleEmpCred(empId : int = Form(...) ,db :Session =Depends(get_db)):
    cur_emp = db.query( User).filter( User.empid ==empId).first()
    cur_manager= db.query( User).filter( User.empid == cur_emp.mId).first()
    curmanager ={"username" : "" , "id" : 0}
    cur_department = db.query( Department).filter( Department.id==cur_emp.deptID).first()
    if  cur_manager:
       curmanager = {"username" :cur_manager.username , "id" : cur_manager.empid}
    managers = GetDeptManagers(cur_emp.deptID , db)
    departments = db.query(Department).all()
    return  {"curmanager" : curmanager , "managers" : managers , "cur_dept" :cur_department ,"departments" :departments }
    #return {"message" : "called" , "empid" : empId}



@app.post('/getdeptmanagers')
async def getdeptman(department : int =Form(...), empId :int =Form(...),db :Session = Depends(get_db)):
    managers = GetDeptManagers(department , db)
    return [manager for manager in managers if manager['id']!=empId]




##########UPDATE  EMPLOYEE  CREDENTIALS ####################
@app.put('/updateEmp')
async def UpdateEmp(empId:int=Form(...) , manager:int =Form(...) ,dept:int =Form(...) ,db :Session =Depends(get_db)):
    db_emp = db.query( User).filter( User.empid==empId).first()
    db_emp.mId = manager
    db_emp.deptID= dept
    db.commit()
    db.refresh(db_emp)
    m = db.query( User).filter( User.empid == manager ).first()
    if not m :
        m=None
    else :
        m = m.username
    department = db.query( Department).filter( Department.id == dept).first()
    dbemp ={"username" : db_emp.username , "email" : db_emp.email ,"manager" :m ,"department" :department.department}
    print(dbemp)
    return dbemp


###############################UPDATE  MANAGER  DEPARTMENT##########################
@app.put("/updateManager")
async def updatemanager(empId : int =Form(...) , dept :int =Form(...),newmanager : int =Form(...), db:Session =Depends(get_db)):
    db_manager = db.query( User).filter( User.empid==empId).first()
    db_manager.deptID=dept
    db.commit()
    db.refresh(db_manager)
    print("department updated !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    # try:
    #     emps_list = json.loads(emps)
    #     print("Deserialized emps:", emps_list)
    # except json.JSONDecodeError as e:
    #     print("Failed to decode JSON:", e)
    #     return {"error": "Failed to decode JSON"}
    emps_list = GetManagerEmp(empId,db)
    # Update each employee's manager
    for emp in emps_list:
        try:
            emp_id = emp['id']
            db_emp = db.query( User).filter( User.empid == emp_id).first()
            if db_emp:
                db_emp.mId = newmanager
                db.commit()
                db.refresh(db_emp)
                print(f"Manager updated for employee ID {emp_id}")
            else:
                print(f"Employee with ID {emp_id} not found")
        except KeyError as e:
            print(f"Key error: {e} in emp: {emp}")
    return {"Response" : "data changed"}


@app.post('/getmanageremp')
def Getmanageremp(manager : int =Form(...) , db:Session =Depends(get_db)):
    emps = GetManagerEmp(manager,db)
    print(emps)
    return emps


@app.get('/managerscredentials')
async def manager_credentials(db : Session =Depends(get_db)):
    db_emps = db.query( User).filter( User.pID==2).all()
    result =[]
    for amp in db_emps :
        manager = "Admin"
        if amp.mId!=0:
            db_manager = db.query( User).filter( User.empid==amp.mId).first()
            manager = db_manager.username
        department = db.query( Department).filter( Department.id == amp.deptID).first()
        emp = {"department" : department.department , "manager" : manager , "username" : amp.username , "email": amp.email , "empId": amp.empid}
        result.append(emp)

    return result   

@app.delete('/delemp')
async def del_emp(empId :int = Form(), db :Session = Depends(get_db)):
    db_emp = db.query(User).filter(User.empid == empId).delete()
    db.commit()
    return status.HTTP_200_OK

######################################         REIMBURSEMENT        CLAIM  ############################################################################################
##########################  IMAGE HANDELLING ###########################

UPLOAD_DIRECTORY ="Reimbursement_image"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.post('/upload')
async def upload_file(file: UploadFile = File(...) ,type :str =Form(...),empId:int =Form(...) ,amt :int=Form(...) ,date :str =Form(...)):
    print(type ,empId , amt , date)
    
    if not file.filename.lower().endswith(('.jpg' ,'jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only .jpg and .jpeg files are allowed.")
    contents = await file.read()
    image_filename = f"{uuid4()}.jpg"

    image_path = os.path.join(UPLOAD_DIRECTORY, image_filename)


    with open(image_path, "wb") as buffer:
        buffer.write(contents)

    file_url = f"/uploads/{image_filename}"

    db =SessionLocal()
    mId = db.query( User).filter( User.empid==empId).first()
    
    print(mId)
    image =  Reimbursement(empid =empId ,type = type , amt = amt, date = date ,receipt=file_url , mId= mId.mId , appr_m = 0  ,comments ="")
    db.add(image)
    db.commit()
    db.refresh(image)
    # image = db.query(Image).filter(Image.filename==image_filename).first()
    # image_id = image.id
    print(file_url)
    print(image.rId)
    return JSONResponse(content={"message": "File uploaded successfully!", "id": image.rId})





@app.post("/getselfimbursementsall")
async def Get_ALL_Imburse(empId : int =Form(...), db :Session = Depends(get_db)):
    imbursements = get_all_imbursements(empId,db)
    imburses =[]
    for i in imbursements:
        trial ={"rid" : i.rId , "type" :i.type,"amt" :i.amt,"date" :i.date ,"status":i.status,"comments" : i.comments}
        imburses.append(trial)
    return imburses

@app.post('/getselfimbursementsunapproved')
async def GetUnapproved(empId :int = Form(...) ,db :Session = Depends(get_db)):
    imbursements = get_all_imbursements(empId,db)
    imburses =[]
    
    for i in imbursements:
        
        if i.status is None:
            print(i.empid)
            trial ={"rid" : i.rId , "type" :i.type,"amt" :i.amt,"date" :i.date ,"status":i.status,"comments" : i.comments}
            imburses.append(trial)
    return imburses



@app.post('/toreview')
async def To_review(empid:int =Form(...),db:Session =Depends(get_db)):
    db_imburses = db.query( Reimbursement).filter( Reimbursement.mId==empid).all()
    toreview =[]
    for imburse in db_imburses:
        if imburse.status is None:
            db_emp = db.query( User).filter( User.empid==imburse.empid).first()
            trial = {"rid" : imburse.rId ,
                     "empusername" : db_emp.username ,
                       "empid" : db_emp.empid ,
                         "type" :imburse.type ,
                         "amt" :imburse.amt ,
                         "date" :imburse.date}
            toreview.append(trial)
    return toreview


@app.post('/reviewadmin')
async def To_review_admin(db:Session =Depends(get_db)):
    db_imburses = db.query( Reimbursement).all()
    toreview =[]
    for imburse in db_imburses:
        if imburse.status is None:
            db_emp = db.query( User).filter( User.empid==imburse.empid).first()
            trial = {"rid" : imburse.rId ,
                     "empusername" : db_emp.username ,
                       "empid" : db_emp.empid ,
                         "type" :imburse.type ,
                         "amt" :imburse.amt ,
                         "date" :imburse.date}
            toreview.append(trial)
    return toreview


@app.post("/get_image/")
async def get_image(id: int = Form(...), db: Session = Depends(get_db)):
    print(f"id type: {type(id)}")  # Debug: Print type of id

    db_image = db.query( Reimbursement).filter( Reimbursement.rId == id).first()
    if not db_image:
        print("Image not found in database")
        raise HTTPException(status_code=404, detail="Image not found")
    else:
        print(f"db_image.receipt: {db_image.receipt}")  # Debug: Print db_image.receipt

    file_path = db_image.receipt
    filename = file_path.split("/")[-1]
    print(f"filename: {filename}")  # Debug: Print filename

    file_path = os.path.join(UPLOAD_DIRECTORY, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    with open(file_path, 'rb') as f:
        base64image = base64.b64encode(f.read())

    baseimg = base64image.decode("utf-8")
    print(f"baseimg type: {type(baseimg)}")  # Debug: Print type of baseimg

    return JSONResponse(content={"img": baseimg})

@app.put("/reviewapprove")
async def review_approve(rid: int = Form(...), appr_m: int = Form(...), status: bool = Form(...), comment: str = Form(...), db: Session = Depends(get_db)):
    db_image = db.query( Reimbursement).filter( Reimbursement.rId == rid).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Reimbursement not found")
    
    db_image.approved_by = appr_m
    db_image.status = status
    db_image.comments = comment
    db.commit()
    db.refresh(db_image)
    print(rid , appr_m,status,comment)
    
    return {"message": "Review updated successfully"}