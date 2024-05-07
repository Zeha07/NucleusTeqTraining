from fastapi import Depends , FastAPI
from sqlalchemy.orm import Session
import models , crud , schemas
from database import SessionLocal ,engine
models.Base.metadata.create_all(bind = engine)
app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/addposition")
def add_Position(position : schemas.Addposition , db : Session = Depends(get_db)):
    db_position = crud.add_position(db , position)
    return db_position
