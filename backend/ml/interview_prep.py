from ml.job_matcher import match_cv_to_job
from ml.llm_service import LLMService
import json
async def generate_interview_questions(cv_text:str,job_description:str) -> dict:
    llm = LLMService()
    score_and_skill_gap = await match_cv_to_job(cv_text=cv_text,job_description=job_description)
    missing_skills = score_and_skill_gap["skill-analysis"]["missing_skills"]
    generate_questions = await llm.send_prompt(f'''Generate extensive targeted interview questions from {missing_skills} for each missing skill,"
                                               "given the missing skills generate 5 interview questions for each in the given format : {{"questions": [{{"skill": "Kubernetes", "questions": ["q1", "q2", "q3","q4","q5"]}}]}}"
                                               "return interview questions as ONLY a valid JSON object with no additional text, markdown, or explanation
                                               ''')
    generate_questions = generate_questions.strip().replace("```json", "").replace("```", "")
    generate_questions = json.loads(generate_questions)
    return generate_questions