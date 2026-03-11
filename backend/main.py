from fastapi import FastAPI
from db.database import engine, Base
from db import models

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status":"ok"}

