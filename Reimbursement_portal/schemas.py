from pydantic import BaseModel




class Addposition(BaseModel):
     post :str
     class Config:
        orm_mode = True

