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
        for attempt in range(3):  # try 3 times
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                return response.text
            except Exception as e:
                if "429" in str(e) and attempt < 2:
                    await asyncio.sleep(15)  # wait 15 seconds then retry
                    continue
                elif "429" in str(e):
                    raise HTTPException(status_code=429, detail="AI service is busy. Please try again in a moment.")
                raise HTTPException(status_code=500, detail="AI service error.")
        
    async def translate_to_english(self,text:str) -> str:
        translated_text = await self.send_prompt(f"Detect the language, translate it into English, if it is not in English return only the translated text without any explaination. If the text is already in English, return it as is: {text}")
        return translated_text

