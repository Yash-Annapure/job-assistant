from ml.llm_service import LLMService
from fastapi import HTTPException
import json
import re

def clean_cv_text(raw_text: str) -> str:
    # remove extra whitespace and newlines
    text = re.sub(r'\n+', ' ', raw_text)
    text = re.sub(r'\s+', ' ', text)
    # remove common CV noise
    text = re.sub(r'\+\d[\d\s\-]+', '', text)  # phone numbers
    text = re.sub(r'[\w\.-]+@[\w\.-]+', '', text)  # emails
    text = re.sub(r'http\S+', '', text)  # urls
    text = re.sub(r'\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}', '', text)  # dates
    return text.strip()

async def parse_cv(cv_text: str) -> dict:
    # TEMP MOCK — remove before deployment
    return {
        "skills": ["Python", "FastAPI", "Docker", "React", "PostgreSQL", "Machine Learning", "PyTorch", "AWS EC2"],
        "years_of_experience": "1",
        "education": ["M.Sc. Applied Data Science & AI - SRH Heidelberg", "B.Tech AI & Data Science - VIT Pune"],
        "job_titles": ["Junior Software Intern"]
    }
    cleaned = clean_cv_text(cv_text)
    llm = LLMService()
    response = await llm.send_prompt(
        f"Extract from this CV: {cleaned[:2000]}\n"
        f"Return ONLY valid JSON with these fields:\n"
        f'{{"skills": [], "years_of_experience": "string", "education": [], "job_titles": []}}\n'
        f"If a field is missing return 'not listed'. No markdown, no explanation."
    )
    try:
        response = response.strip().replace("```json", "").replace("```", "")
        parsed_dict = json.loads(response)
        return parsed_dict
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Failed to parse CV response")

