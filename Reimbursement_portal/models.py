from sqlalchemy import Column , Integer, String
from sqlalchemy.orm import relationship

from database import Base
class Position(Base):
    __tablename__ = "position"
    id = Column(Integer , primary_key = True)
    post = Column(String(16) , unique = True,)


