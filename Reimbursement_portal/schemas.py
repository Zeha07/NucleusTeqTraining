from pydantic import BaseModel




class Addposition(BaseModel):
     post :str
     class Config:
        orm_mode = True


class Adddepartment(BaseModel):
     department : str
     class Config:
        orm_mode = True

class showUser(BaseModel):
   email :str 
   # passwd :str 
   manager : str 
   position:str
   department : str
   username:str
   def __init__(self , email , manager, position,department ,username):
      self.email = email
      self.manager = manager
      self.position = position
      self.department = department
      self.username = username

   

class UserBase(showUser):
   passwd :str 




class Adduser(UserBase):
   # class UserBase(BaseModel):
   # email :str 
   # passwd :str 
   mID : int | None
   pID:int
   deptID : int
   # username:str
   class Config:
      orm_mode = True


