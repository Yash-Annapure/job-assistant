# Job listing & search routes
import httpx
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

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



   

    
