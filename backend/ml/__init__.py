from llm_service import LLMService
import json


async def parse_cv(cv_text:str) -> dict:
    LLM = LLMService()
    
