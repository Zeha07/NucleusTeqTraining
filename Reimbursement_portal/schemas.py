from pydantic import BaseModel
from typing import Annotated



class Addposition(BaseModel):
     post :str
     class Config:
        orm_mode = True


class Adddepartment(BaseModel):
     department : str
     class Config:
        orm_mode = True

class showUser(BaseModel):
   username: str
   email: str | None = None
   full_name: str | None = None
   disabled: bool | None = None



class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None

class UserInDB(showUser):
    hashed_password: str
   

       

class UserBase(showUser):
   passwd :str 




# class User(UserBase):
class UserBase(BaseModel):
   # email :str 
   # passwd :str 
   mID : int | None
   pID:int
   deptID : int
   usermail:str
   username:str
   hashed_password:str
   # username:str
   class Config:
      orm_mode = True


class DepartmentBase(BaseModel):
   department :str


class DepartmentModel(DepartmentBase):
   id : int
   class Config:
      orm_mode = True


class RegisterUser(BaseModel):
    pID : int
    deptID : int 
    username : str
    passwd : str
    email :str
    mId : int | None = None

class Employee_Credentials(BaseModel):
    department:str
    username :str
    email:str
    manager:str |None =None
    empId :int