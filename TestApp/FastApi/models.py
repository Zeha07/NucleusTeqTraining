from database import Base
from sqlalchemy import Column , String , Integer , Boolean , Float

class transaction(Base):
    __tablename__ = "transactions"
    id = Column (Integer , primary_key= True , index = True)
    amount = Column (Float)
    category = Column (String(45))
    description = Column(String(45))
    is_income = Column(Boolean)
    date = Column(String(6))
