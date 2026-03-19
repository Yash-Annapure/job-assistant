from sys import prefix
from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.database import engine, Base
from api.cv import router as cv_router
from db import models
import os
from dotenv import load_dotenv
from api import auth
from api import jobs
from api import applications
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

def create_db_and_tables():
    Base.metadata.create_all(bind=engine)



@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables() #startup
    yield

app = FastAPI(lifespan=lifespan)
#had to add this for CORS policy error workoaround, since the frontend is running on a different port than the backend, the browser blocks the requests due to CORS policy. This middleware allows requests from the specified origin (in this case, the React dev server) to access the backend API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #react dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv_router, prefix="/cv", tags=["cv"])
app.include_router(auth.router, prefix="/auth",tags=["auth"])
app.include_router(jobs.router, prefix="/jobs",tags=["jobs"])
app.include_router(applications.router, prefix="/applications",tags=["applications"])

@app.get("/health")
async def health_check():
    return {"status":"ok"}


'''
 Depreciated method
# @app.on_event("startup")
# def on_startup():
#     create_db_and_tables()   
'''






