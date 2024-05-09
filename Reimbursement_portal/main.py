from fastapi import Depends , FastAPI
from sqlalchemy.orm import Session
import models , crud , schemas
from database import SessionLocal ,engine
models.Base.metadata.create_all(bind = engine)
app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/addposition")
def add_Position(position : schemas.Addposition , db : Session = Depends(get_db)):
    db_position = crud.add_position(db , position)
    return db_position


@app.post("/adddepartment")
def add_Department(department : schemas.Adddepartment , db : Session = Depends(get_db)):
    db_department= crud.add_department(db , department)
    return db_department

@app.post("/adduser")
def add_user(user : schemas.UserBase , db : Session = Depends(get_db)):
    db_user = crud.add_user(db, user)
    return db_user


@app.get("/getpositions")
def get_positions(db : Session = Depends(get_db)):
    users = crud.get_positions(db)
    return users


@app.get("/getdepartments")
def get_positions(db : Session = Depends(get_db)):
    departments = crud.get_departments(db)
    return departments 


@app.get("/getusers")
def get_users(db:Session = Depends(get_db)):
    users = crud.get_users(db)
    return users