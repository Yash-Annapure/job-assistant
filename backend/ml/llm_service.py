from google import genai 
from dotenv import load_dotenv
import os

load_dotenv()

class LLMService:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("JOB_ASSISTANT_GEMINI_API_KEY"))
    async def send_prompt(self,prompt:str) -> str:
        response = self.client.models.generate_content(
            model = "gemini-2.5-flash",
            contents = prompt
        )
        return (response.text)
    
