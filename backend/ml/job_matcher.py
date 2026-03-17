from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from ml.llm_service import LLMService
from cv_parser import parse_cv
import json

model = SentenceTransformer('all-MiniLM-L6-v2')
async def match_cv_to_job(cv_text:str,job_description:str) -> dict:
    llm = LLMService()
    embeddings = model.encode([cv_text,job_description])
    cv_embedding = embeddings[0]
    job_embedding = embeddings[1]
    parsed_cv = await parse_cv(cv_text=cv_text)
    match_score = cosine_similarity([cv_embedding],[job_embedding])[0][0]
    score_percentage = round(float(match_score) * 100,2)
    missing_and_matching_info = await llm.send_prompt(f"Identify missing and matching skills from {job_description} for{parsed_cv}," 
                                                      f"return matching_skills and missing_skills as ONLY a valid JSON object with no additional text, markdown, or explanation")
    missing_and_matching_info = missing_and_matching_info.strip().replace("```json", "").replace("```", "")
    missing_and_matching_info = json.loads(missing_and_matching_info)
    return {
        "match_score" : score_percentage,
        "skill-analysis" : missing_and_matching_info
    }
    
