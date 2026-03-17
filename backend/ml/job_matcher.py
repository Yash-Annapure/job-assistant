from fastembed import TextEmbedding
#sentence-transformers (previously had this but it was filling up the space a lot)
from sklearn.metrics.pairwise import cosine_similarity
from ml.llm_service import LLMService
from ml.cv_parser import parse_cv
import json

model = TextEmbedding("BAAI/bge-small-en-v1.5")
async def match_cv_to_job(cv_text:str,job_description:str) -> dict:
    llm = LLMService()
    embeddings = list(model.embed([cv_text, job_description]))
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
    
