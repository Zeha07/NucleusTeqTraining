from sqlalchemy import Column , Integer, String
from sqlalchemy.orm import relationship

from database import Base
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
    email = Column(Ema)




