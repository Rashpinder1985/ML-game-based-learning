from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import lessons, submissions, jobs, progress
from app.core.config import settings
from app.core.database import engine, Base

app = FastAPI(
    title="ML Learning Platform API",
    description="Backend API for ML game-based learning platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(lessons.router, prefix="/api/v1", tags=["lessons"])
app.include_router(submissions.router, prefix="/api/v1", tags=["submissions"])
app.include_router(jobs.router, prefix="/api/v1", tags=["jobs"])
app.include_router(progress.router, prefix="/api/v1", tags=["progress"])

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "ML Learning Platform API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}