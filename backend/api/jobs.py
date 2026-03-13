# Job listing & search routes
from db.database import get_db
import httpx
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from db.models import Joblisting
from auth_utils import get_current_user
from pydantic import BaseModel

router = APIRouter()

@router.get("/search")
async def search_jobs(query: str,location : str = None):
    async with httpx.AsyncClient() as client:
        params = {"q":query,"location":location}
        try:
            response = await client.get("https://www.arbeitnow.com/api/job-board-api",params=params)
            data = response.json()
            return data["data"]
        except httpx.HTTPError:
            raise HTTPException(500, "Failed to fetch jobs")


class JobInput(BaseModel):
    title: str
    company: str
    description: str
    url: str

@router.post("/save")
async def save_jobs(job: JobInput, db = Depends(get_db), current_user = Depends(get_current_user)):
    db_jobs = Joblisting(title = job.title, company = job.company, description = job.description, url = job.url, source = "arbeitnow")
    db.add(db_jobs)
    db.commit()
    db.refresh(db_jobs)
    return db_jobs

   

    
