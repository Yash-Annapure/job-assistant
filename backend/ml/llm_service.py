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
    
    async def translate_to_english(self,text:str) -> str:
        translated_text = await self.send_prompt(f"Detect the language, translate it into English, if it is not in English return only the translated text without any explaination. If the text is already in English, return it as is: {text}")
        return translated_text

