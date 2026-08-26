# Job listing & search routes
from ml.cv_parser import parse_cv
from db.database import get_db
import httpx
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query
from db.models import Joblisting
from auth_utils import get_current_user
from pydantic import BaseModel, Field
from ml.job_matcher import match_cv_to_job
from db.models import Joblisting
from db.models import CV
from ml.interview_prep import generate_interview_questions
from ml.cover_letter import generate_cover_letter
from ml.llm_service import LLMService
import json
import asyncio

router = APIRouter()

@router.get("/search")
async def search_jobs(query: str = Query(..., max_length=100), location: str = Query(None, max_length=100), limit: int = Query(20, ge=1, le=100), current_user = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        params = {"q": query}
        if location:
            params["location"] = location
        try:
            # Fetch page 1 first to discover how many pages exist
            first = await client.get("https://www.arbeitnow.com/api/job-board-api", params={**params, "page": 1})
            first_data = first.json()
            last_page = first_data.get("meta", {}).get("last_page", 1)
            pages_to_fetch = min(last_page, 5)  # cap at 5 pages (~75-100 results)

            # Fetch remaining pages in parallel
            extra_responses = await asyncio.gather(*[
                client.get("https://www.arbeitnow.com/api/job-board-api", params={**params, "page": p})
                for p in range(2, pages_to_fetch + 1)
            ])
            responses = [first] + list(extra_responses)
            jobs = []
            seen_slugs = set()
            for resp in responses:
                if resp.status_code == 200:
                    for job in resp.json().get("data", []):
                        slug = job.get("slug")
                        if slug and slug not in seen_slugs:
                            seen_slugs.add(slug)
                            jobs.append({
                                "title": job.get("title"),
                                "company": job.get("company_name"),
                                "location": job.get("location"),
                                "url": job.get("url"),
                                "slug": slug,
                                "description": job.get("description", "")[:3000],
                                "tags": job.get("tags", []),
                                "remote": job.get("remote", False),
                            })
            return jobs[:limit]
        except httpx.HTTPError:
            raise HTTPException(500, "Failed to fetch jobs")


class JobInput(BaseModel):
    title: str
    company: str
    description: str
    url: str

class JobMatchInput(BaseModel):
    job_description: str = Field(..., max_length=10000)

@router.post("/save")
async def save_jobs(job: JobInput, db = Depends(get_db), current_user = Depends(get_current_user)):
    description = job.description
    # only translate if non-English characters detected
    if any(ord(char) > 127 for char in job.description):
        llm = LLMService()
        try:
            description = await llm.translate_to_english(job.description)
        except:
            description = job.description

    db_jobs = Joblisting(
        title=job.title,
        company=job.company,
        description=description,
        url=job.url,
        source="arbeitnow"
    )
    db.add(db_jobs)
    db.commit()
    db.refresh(db_jobs)
    return db_jobs

@router.post("/match")
async def match_cv(input: JobMatchInput, db = Depends(get_db), current_user = Depends(get_current_user)):
    get_cv = db.query(CV).filter(CV.user_id == current_user.id).first()
    if not get_cv:
        raise HTTPException(404, "No CV found")
    if get_cv.parsed_skills:
        skills = json.loads(get_cv.parsed_skills)
    else:
        parsed = await parse_cv(get_cv.raw_text)
        skills = parsed.get("skills", [])
        # cache it so next call is instant
        get_cv.parsed_skills = json.dumps(skills)
        db.commit()
    result = await match_cv_to_job(get_cv.raw_text, input.job_description, skills)
    return result

#Feature to be implemented in the future - requires more work on the LLM side to generate good questions based on CV and job description
# @router.post("/interview-prep")
# async def interview_prep(input: JobMatchInput, db = Depends(get_db), current_user = Depends(get_current_user)):
#     get_cv = db.query(CV).filter(CV.user_id == current_user.id).first()
#     if not get_cv:
#         raise HTTPException(404,"Item not found")
#     interview_prep_questions = await generate_interview_questions(get_cv.raw_text, input.job_description)
#     return interview_prep_questions

@router.post("/cover-letter")
async def cover_letter(input: JobMatchInput, db = Depends(get_db), current_user = Depends(get_current_user)):
    get_cv = db.query(CV).filter(CV.user_id == current_user.id).first()
    if not get_cv:
        raise HTTPException(404,"Item not found")
    cover_letter = await generate_cover_letter(get_cv.raw_text, input.job_description)
    return cover_letter
   

    
