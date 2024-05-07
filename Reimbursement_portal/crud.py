from sqlalchemy.orm import Session
import models , schemas

def add_position(db : Session , post : schemas.Addposition):
    db_position = models.Position(post = post.post)
    db.add(db_position)
    db.commit()
    db.refresh(db_position)
    return db_position