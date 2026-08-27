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
from api import users
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mcp import FastApiMCP
from starlette.requests import Request
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from rate_limiter import limiter
import mcp_server

load_dotenv()

def create_db_and_tables():
    Base.metadata.create_all(bind=engine)



@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables() #startup
    yield

app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

#had to add this for CORS policy error workoaround, since the frontend is running on a different port than the backend, the browser blocks the requests due to CORS policy. This middleware allows requests from the specified origin (in this case, the React dev server) to access the backend API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #react dev server
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

app.include_router(cv_router, prefix="/cv", tags=["cv"])
app.include_router(auth.router, prefix="/auth",tags=["auth"])
app.include_router(jobs.router, prefix="/jobs",tags=["jobs"])
app.include_router(applications.router, prefix="/applications",tags=["applications"])
app.include_router(users.router,prefix="/users",tags=["/users"])

@app.get("/health")
async def health_check():
    return {"status":"ok"}

# MCP server instance which exposes existing FastAPI routes as MCP tools
mcp_server = FastApiMCP(app)
mcp_server.mount() # ← mounts at /mcp by default


'''
 Depreciated method
# @app.on_event("startup")
# def on_startup():
#     create_db_and_tables()   
'''






