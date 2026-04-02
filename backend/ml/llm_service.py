from fastapi import HTTPException

from google import genai 
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()

class LLMService:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("JOB_ASSISTANT_GEMINI_API_KEY"))
    async def send_prompt(self, prompt: str) -> str:
        for attempt in range(2):
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                if response and response.text:
                    return response.text
                raise HTTPException(status_code=500, detail="Empty response from Gemini")
            except HTTPException:
                raise
            except Exception as e:
                if "429" in str(e) and attempt == 0:
                    await asyncio.sleep(10)
                    continue
                elif "429" in str(e):
                    raise HTTPException(status_code=429, detail="AI service is busy. Please wait a few seconds and try again.")
                raise HTTPException(status_code=500, detail="AI service error. Please try again.")
        raise HTTPException(status_code=429, detail="AI service is busy. Please wait a few seconds and try again.")
