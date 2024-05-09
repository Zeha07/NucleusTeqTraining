from sqlalchemy.orm import Session
import models , schemas

def add_position(db : Session , post : schemas.Addposition):
    db_position = models.Position(post = post.post)
    db.add(db_position)
    db.commit()
    db.refresh(db_position)
    return db_position


def add_department(db : Session , department : schemas.Adddepartment):
    db_department = models.Department(department = department.department)
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department