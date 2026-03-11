from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.database import engine, Base
from db import models
import os
from dotenv import load_dotenv

load_dotenv()

def create_db_and_tables():
    Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables() #startup
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/health")
async def health_check():
    return {"status":"ok"}


'''
 Depreciated method
# @app.on_event("startup")
# def on_startup():
#     create_db_and_tables()   
'''






