from database import Base
from sqlalchemy import Column , String , Integer , Boolean , Float ,LargeBinary

class transaction(Base):
    __tablename__ = "transactions"
    id = Column (Integer , primary_key= True , index = True)
    amount = Column (Float)
    category = Column (String(45))
    description = Column(String(45))
    is_income = Column(Boolean)
    date = Column(String(6))


class User(Base):
    __tablename__ = "users"
    id =Column(Integer ,primary_key = True , index = True)
    username = Column(String(255) , unique = True , index = True)
    hashed_password = Column(String(255))


