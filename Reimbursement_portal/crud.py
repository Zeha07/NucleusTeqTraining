from sqlalchemy.orm import Session
import models , schemas

def add_position(db : Session , post : schemas.Addposition):
    db_position = models.Position(post = post.post.lower())
    db.add(db_position)
    db.commit()
    db.refresh(db_position)
    return db_position



def get_positions(db:Session):
    positions = db.query(models.Position).all()
    # db.refresh()
    return positions


def add_department(db : Session , department : schemas.Adddepartment):
    db_department = models.Department(department = department.department.lower())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department


def get_departments(db:Session):
    departments = db.query(models.Department).all()
    # db.refresh()
    return departments

def get_users(db:Session):
    users = db.query(models.User).all()
    return users

def add_user(db : Session , user : schemas.UserBase):
    db_position = db.query(models.Position).filter(models.Position.post ==user.position).first()
    db_department = db.query(models.Department).filter(models.Department.department == user.department).first()
    if user.manager == "None":
         db_user = models.User(email = user.email , passwd = user.passwd , deptID = db_department.id , username = user.username , pID = db_position.id   )
    else :
        db_manager = db.query(models.User).filter(models.User.username== user.username).first()
        db_user = db_user = models.User(email = user.email , passwd = user.passwd , mID = db_manager.empid| null, deptID = db_department.id , username = user.username , pID = db_position.id   )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user