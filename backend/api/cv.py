# CV upload & parsing routes
from db import models
from fastapi import APIRouter,HTTPException
from fastapi import Depends,UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.database import get_db
from auth_utils import get_current_user
from ml.cv_parser import parse_cv
from db.models import CV
import PyPDF2
import docx
import io

# #user_id: int   no need for user_id as the get current user takes it automatically from the token
# class CV_input(BaseModel):
#     raw_text: str
#     file_path: str (switched to file upload instead of path)

router = APIRouter()

@router.post("/upload")
async def upload_cv(
    file: UploadFile = File(...),
    db = Depends(get_db),
    current_user = Depends(get_current_user)
):
    content = await file.read()
    raw_text = ""

    if file.filename.endswith(".pdf"):
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        for page in pdf_reader.pages:
            raw_text += page.extract_text()

    elif file.filename.endswith(".docx"):
        doc = docx.Document(io.BytesIO(content))
        for para in doc.paragraphs:
            raw_text += para.text + "\n"
    else:
        raise HTTPException(400, "Only PDF and DOCX files are supported")

    # delete existing CV first
    existing = db.query(CV).filter(CV.user_id == current_user.id).first()
    if existing:
        db.delete(existing)
        db.commit()

    db_cv = models.CV(
        user_id=current_user.id,
        raw_text=raw_text,
        file_path=f"/uploads/{file.filename}"
    )
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv
    # pass

@router.post("/analyze")
async def analyze_cv(db = Depends(get_db), current_user = Depends(get_current_user)):
    get_cv = db.query(CV).filter(CV.user_id == current_user.id).first()
    if not get_cv:
        raise HTTPException(404,"Item not found")
    parsed_cv = await parse_cv(get_cv.raw_text)
    return parsed_cv

@router.delete("/delete")
async def delete_cv(db = Depends(get_db), current_user = Depends(get_current_user)):
    db_cv = db.query(CV).filter(CV.user_id == current_user.id).first()
    if not db_cv:
        raise HTTPException(404, "No CV found")
    db.delete(db_cv)
    db.commit()
    return {"message": "CV deleted successfully"}

@router.get("/get")
async def get_cv(db = Depends(get_db), current_user = Depends(get_current_user)):
    db_cv = db.query(CV).filter(CV.user_id == current_user.id).first()
    if not db_cv:
        return None
    return db_cv
    
    
    
    
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