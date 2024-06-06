from fastapi import FastAPI , HTTPException , Depends ,status ,Form ,File , UploadFile
# from fastapi.responses import JSONResponse
# import jwt
# from jwt.exceptions import InvalidTokenError 
# from typing import Annotated , List
from sqlalchemy.orm import Session
# from pydantic import BaseModel
from database import SessionLocal , engine
import models 
# from datetime import datetime, timedelta, timezone
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import OAuth2PasswordBearer , OAuth2PasswordRequestForm
# from starlette.middleware.base import BaseHTTPMiddleware
# from starlette.requests import Request
# from starlette.responses import Response
# from passlib.context import CryptContext
# from jose import JWTError , jwt
app = FastAPI()
 
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = {           
    "http://localhost:3000"
}


# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# db_dependency = Annotated[Session ,Depends(get_db)]

# models.Base.metadata.create_all(bind = engine)


# SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# class TransactionBase(BaseModel):
#     amount:float
#     category :str
#     description:str
#     is_income : bool
#     date :str

# class TransactionModel(TransactionBase):
#     id:int

#     class Config:
#         orm_mode = True


# class UserCreate(BaseModel):
#     username : str
#     password :str


# class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
#     def __init__(self, app, max_upload_size: int):
#         super().__init__(app)
#         self.max_upload_size = max_upload_size

#     async def dispatch(self, request: Request, call_next):
#         if request.method == "POST" and request.url.path == "/upload":
#             content_length = request.headers.get("Content-Length")
#             if content_length:
#                 if int(content_length) > self.max_upload_size:
#                     return Response("File too large", status_code=413)
#         return await call_next(request)

# app.add_middleware(LimitUploadSizeMiddleware, max_upload_size=1 * 1024 * 1024 * 1024)

# def get_user_by_username(db :Session , username :str):
#     return db.query(models.User).filter(models.User.username == username).first()


# def create_user(db:Session ,user :UserCreate):
#     hashed_password = pwd_context.hash(user.password)
#     db_user = models.User(models.User.username ==user.username , hashed_password = hashed_password)
#     db.add(db_user)
#     db.commit()
#     return "complete"


# @app.post("/register")
# def register_user(user :UserCreate , db : Session= Depends(get_db)):
#     db_user = get_user_by_username(db , username = user.username)
#     if db_user :
#         raise HTTPException(status_code=400, detail="username already registered")
#     return create_user(db = db , user =user)
# #Authentication
# def authenticate_user(username : str , password :str , db:Session):
#     user = db.query(models.User) .filter(models.User.username == username).first()
#     if not user:
#         return False
#     if not pwd_context.verify(password , user.hashed_password):
#         return False
#     return user

# #access token

# def create_access_token(data :dict , expires_delta :timedelta|None = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.now(timezone.utc) +expires_delta
#     else:
#         expire = datetime.now(timezone.utc) + timedelta(minutes = 15)
#     to_encode.update({"exp" :expire})
#     encoded_jwt = jwt.encode(to_encode , SECRET_KEY , algorithm=ALGORITHM)
#     return encoded_jwt

# @app.post("/token")
# def login_for_access_token(form_data : OAuth2PasswordRequestForm = Depends() , db:Session = Depends(get_db)):
#  user = authenticate_user(form_data.username , form_data.password , db)
#  if not user :
#     raise HTTPException(
#         status_code = status.HTTP_401_UNAUTHORIZED,
#         detail = "Incorrect username or password",
#         headers = {"WWW.Authenticator" : "Bearer"},
#     )
#  access_token_expires = timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
#  access_token = create_access_token(
#      data = {"sub" : user.username} , expires_delta=access_token_expires
#  )
#  return {"access_token" : access_token , "token-type" : "bearer"}

# def verify_token(token :str = Depends(oauth2_scheme)):
#     try:
#         payload = jwt.decode(token , SECRET_KEY , algorithms=[ALGORITHM])
#         username : str = payload.get("sub")
#         if username is None :
#             raise HTTPException(status_code=403 , detail="Token is invalid or expired ! login again")
#         return payload
#     except JWTError :
#         raise HTTPException(status_code= 403 , detail= "Token expired")
    


# @app.get("/verify-token/{token}")
# async def verify_user_token(token :str):
#     verify_token(token = token)
#     return {"message" : "token is valid"}








# @app.post("/transactions/")
# async def create_transaction(amount : int = Form(...) ,category :str = Form(...) , description :str =Form(...) , is_income :bool = Form(...)  , date :str =Form(...) ):
#     # db_transaction = models.transaction(**transactions.dict())
#     # db.add(db_transaction)
#     # db.commit()
#     print("data received")
#     # db.refresh(db_transaction)
#     return {"category" : category}

# @app.get("/transactions" , response_model = List[TransactionModel])
# async def read_transactions(db:db_dependency , skip : int = 0 , limit :int = 100):
#     transactions = db.query(models.transaction).offset(skip).limit(limit).all()
#     return transactions

# @app.get('/trial')
# async def trial():
#     return {"data" : "Hello ! it's working"}


# @app.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     content = await file.read()
#     if not content:
#         raise HTTPException(status_code=400, detail="No file uploaded")
    
#     db = SessionLocal()
#     image = models.Image(filename=file.filename, content=content)
#     db.add(image)
#     db.commit()
#     db.refresh(image)
    
#     return JSONResponse(content={"message": "File uploaded successfully!", "id": image.id})


from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse ,FileResponse
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import shutil
import base64
from uuid import uuid4
from database import Base
# Database configuration
# DATABASE_URL = "mysql+mysqlconnector://username:password@localhost/image_upload"

# Set up SQLAlchemy
# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# Define the Image model
class Image(Base):
    __tablename__ = 'imagesnew'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    url = Column(String(255), nullable=False)

# Create the images table
Base.metadata.create_all(bind=engine)

# Initialize FastAPI
# app = FastAPI()
current_folder = os.getcwd()
parent_folder = os.path.dirname(current_folder)
target_folder = os.path.join(parent_folder,"claimimages")
os.makedirs(target_folder , exist_ok=True)
# Directory to store uploaded images
UPLOAD_DIRECTORY = "uploads"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only .jpg and .jpeg files are allowed.")

    # Generate a unique filename to avoid conflicts
    # file_extension = file.filename.split(".")[-1]
    # unique_filename = f"{uuid4()}.{file_extension}"
    # file_location = os.path.join(UPLOAD_DIRECTORY, unique_filename)

    #save file to receipt imaege folder
    contents = await file.read()
    image_filename = f"{uuid4()}.jpg"
   
   
    image_path = os.path.join(UPLOAD_DIRECTORY, image_filename)


    with open(image_path, "wb") as buffer:
        buffer.write(contents)

    file_url = f"/uploads/{image_filename}"

    # Store the file URL in the database
    db =SessionLocal()
    image = Image(filename=image_filename, url=file_url)
    db.add(image)
    db.commit()
    db.refresh(image)
    # image = db.query(Image).filter(Image.filename==image_filename).first()
    # image_id = image.id
    print(file_url)
    print(image.id)
    return JSONResponse(content={"message": "File uploaded successfully!", "id": image.id, "filename": image.filename})

@app.post("/uploads/")
async def get_image(id:int = Form(...)):
   print(type(id))
   
   db =SessionLocal()
   db_image = db.query(Image).filter(Image.id==id).first()
   if not db_image:
       print("image not found")
   else :
       print(db_image.url)
       
   file_path = db_image.url 
   filename = file_path.split("/")[-1]
   print(filename)
    
    
   
   file_path = os.path.join(UPLOAD_DIRECTORY, filename)
   if not os.path.exists(file_path):
       raise HTTPException(status_code=404, detail="File not found")
   
   with open(file_path , 'rb') as f:
       base64image = base64.b64encode(f.read())
   baseimg = base64image.decode("utf-8")
    
    
   print(type(baseimg))
   return JSONResponse (content ={"img" : baseimg})
    
    
    
    # return FileResponse(file_path)
    # return{"url" : file_path}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
