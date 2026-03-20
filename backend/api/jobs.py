# Job listing & search routes
from db.database import get_db
import httpx
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from db.models import Joblisting
from auth_utils import get_current_user
from pydantic import BaseModel
from ml.job_matcher import match_cv_to_job
from db.models import Joblisting
from db.models import CV
from ml.interview_prep import generate_interview_questions
from ml.cover_letter import generate_cover_letter
from ml.llm_service import LLMService

router = APIRouter()

@router.get("/search")
async def search_jobs(query: str, location: str = None):
    async with httpx.AsyncClient() as client:
        params = {"q": query}
        if location:
            params["location"] = location
        try:
            response = await client.get("https://www.arbeitnow.com/api/job-board-api", params=params)
            data = response.json()
            return data["data"]
        except httpx.HTTPError:
            raise HTTPException(500, "Failed to fetch jobs")


class JobInput(BaseModel):
    title: str
    company: str
    description: str
    url: str

class JobMatchInput(BaseModel):
    job_description: str

@router.post("/save")
async def save_jobs(job: JobInput, db = Depends(get_db), current_user = Depends(get_current_user)):
    llm = LLMService()
    job.description = await llm.translate_to_english(job.description)
    db_jobs = Joblisting(title = job.title, company = job.company, description = job.description, url = job.url, source = "arbeitnow")
    db.add(db_jobs)
    db.commit()
    db.refresh(db_jobs)
    return db_jobs

@router.post("/match")
async def match_jobs(input: JobMatchInput, db = Depends(get_db), current_user = Depends(get_current_user)):
    get_cv = db.query(CV).filter(CV.user_id == current_user.id).first()
    if not get_cv:
        raise HTTPException(404,"Item not found")
    matched_jobs = await match_cv_to_job(get_cv.raw_text, input.job_description) 
    return matched_jobs

@router.post("/interview-prep")
async def interview_prep(input: JobMatchInput, db = Depends(get_db), current_user = Depends(get_current_user)):
    get_cv = db.query(CV).filter(CV.user_id == current_user.id).first()
    if not get_cv:
        raise HTTPException(404,"Item not found")
    interview_prep_questions = await generate_interview_questions(get_cv.raw_text, input.job_description)
    return interview_prep_questions

@router.post("/cover-letter")
async def cover_letter(input: JobMatchInput, db = Depends(get_db), current_user = Depends(get_current_user)):
    get_cv = db.query(CV).filter(CV.user_id == current_user.id).first()
    if not get_cv:
        raise HTTPException(404,"Item not found")
    cover_letter = await generate_cover_letter(get_cv.raw_text, input.job_description, current_user.username)
    return cover_letter
   

    
