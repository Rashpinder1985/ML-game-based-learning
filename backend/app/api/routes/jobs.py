from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.job import Job as JobModel
from app.schemas.job import Job

router = APIRouter()

@router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str, db: Session = Depends(get_db)):
    """Get job status and result by ID"""
    job = db.query(JobModel).filter(JobModel.id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job