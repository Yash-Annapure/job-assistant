# CV upload & parsing routes
from db import models
from fastapi import APIRouter
from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.database import get_db

class CV_input(BaseModel):
    user_id: int
    raw_text: str
    file_path: str

router = APIRouter()

@router.post("/cv/upload")
async def upload_cv(cv: CV_input, db = Depends(get_db)):
    db_cv = models.CV(user_id = cv.user_id, raw_text = cv.raw_text, file_path = cv.file_path)
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv
    # pass

    '''
    Request comes in
        → FastAPI calls get_db()
        → Session created
        → db handed to your route
        → Route does its work
        → yield resumes
        → Session closed
    Request done
    '''