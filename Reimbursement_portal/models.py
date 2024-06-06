from sqlalchemy import Column , Integer, String,ForeignKey ,Boolean
from sqlalchemy.orm import relationship
from fastapi.security import OAuth2PasswordBearer


from    .database import Base
class Position(Base):
    __tablename__ = "position"
    id = Column(Integer , primary_key = True)
    post = Column(String(16) , unique = True,)



class Department(Base):
    __tablename__= "department"
    id = Column(Integer , primary_key = True)
    department = Column(String(255) , unique = True)





class User(Base):
    __tablename__ = "user"
    empid = Column(Integer,primary_key=True)
    email = Column(String(255),unique = True )
    passwd = Column(String(255))
    mId = Column(Integer )
    deptID = Column(Integer)
    username = Column(String(255) , unique = True)
    pID = Column(Integer)

class Reimbursement(Base):
    __tablename__ = "reimburse"
    rId = Column(Integer,primary_key=True)
    empid =Column(Integer)
    type =Column(String(40))
    amt =Column(Integer)
    date = Column(String(8))
    receipt=Column(String(255))
    mId =Column(Integer)
    appr_m=Column(Integer)
    status = Column(Boolean)
    comments=Column(String(255))
    


