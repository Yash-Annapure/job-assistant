from ml.llm_service import LLMService
from fastapi import HTTPException
import json

async def parse_cv(cv_text:str)->dict:
    llm = LLMService()
    response =await llm.send_prompt(
        f'''
        Extract the following information from this CV text and return ONLY a valid JSON object with no additional text, markdown, or explanation:
        {{
        "skills": ["list of technical skills"],
        "years_of_experience": number,
        "education": ["list of degrees/certifications"],
        "job_titles": ["list of previous job titles"] 
        }}
        cv_text = {cv_text}, if any one of the above fields is missing then return not listed for that field, and get next best appropirate field for assesment like CGPA/GPA
        '''
    )
    try:
        response = response.strip().replace("```json", "").replace("```", "")
        parsed_dict = json.loads(response)
        return parsed_dict
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Failed to parse CV response")

