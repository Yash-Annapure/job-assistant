from fastembed import TextEmbedding
#sentence-transformers (previously had this but it was filling up the space a lot)
from sklearn.metrics.pairwise import cosine_similarity
from ml.llm_service import LLMService
import json

model = TextEmbedding("BAAI/bge-small-en-v1.5")
async def match_cv_to_job(cv_text: str, job_description: str, skills: list) -> dict:
    # TEMP MOCK — remove before deployment
    return {
        "match_score": 78.50,
        "skill-analysis": {
            "matching_skills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
            "missing_skills": ["Kubernetes", "React Native"]
        }
    }
    llm = LLMService()
    
    # use full raw text for cosine similarity — semantic accuracy
    embeddings = list(model.embed([cv_text, job_description]))
    cv_embedding = embeddings[0]
    job_embedding = embeddings[1]
    match_score = cosine_similarity([cv_embedding], [job_embedding])[0][0]
    score_percentage = round(float(match_score) * 100, 2)

    # only skills list for Gemini — already extracted and cached
    missing_and_matching_info = await llm.send_prompt(
        f"Skills: {skills}\n"
        f"Job: {job_description[:800]}\n"
        f"Return ONLY JSON: {{matching_skills: [], missing_skills: []}}"
    )
    missing_and_matching_info = missing_and_matching_info.strip().replace("```json", "").replace("```", "")
    missing_and_matching_info = json.loads(missing_and_matching_info)
    
    return {
        "match_score": score_percentage,
        "skill-analysis": missing_and_matching_info
    }
    
