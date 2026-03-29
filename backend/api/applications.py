# Application tracking routes
from fastapi import APIRouter,Depends,HTTPException
from db.database import get_db
from auth_utils import get_current_user
from pydantic import BaseModel
from db.models import Application

router = APIRouter()

class Applications(BaseModel):
    job_id : int
    status : str
    notes: str

@router.post("/create")
async def create_application(application:Applications, db = Depends(get_db), current_user = Depends(get_current_user)):
    db_application = Application(job_id = application.job_id, status = application.status, notes = application.notes, user_id = current_user.id)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@router.get("/get")
async def get_applications(db = Depends(get_db), current_user = Depends(get_current_user)):
    existing_application = db.query(Application).filter(Application.user_id == current_user.id).all()
    if not existing_application:
        return []
    return existing_application

class ApplicationUpdate(BaseModel):
    status: str = None
    notes: str = None

@router.patch("/{id}")
async def update_application(id:int, application:ApplicationUpdate, db = Depends(get_db), current_user = Depends(get_current_user)):
    db_application = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not db_application:
        raise HTTPException(404, "Application not found")
    if application.status:
        db_application.status = application.status
    if application.notes:
        db_application.notes = application.notes
    
    db.commit()
    db.refresh(db_application)
    return db_application


@router.delete("/{id}")
async def delete_application(id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    application = db.query(Application).filter(
        Application.id == id,
        Application.user_id == current_user.id
    ).first()
    if not application:
        raise HTTPException(404, "Application not found")
    db.delete(application)
    db.commit()
    return {"message": "Application deleted"}