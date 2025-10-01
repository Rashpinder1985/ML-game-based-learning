from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import httpx
import uuid
from datetime import datetime
from app.core.database import get_db
from app.core.config import settings
from app.models.submission import Submission as SubmissionModel
from app.models.job import Job as JobModel
from app.schemas.submission import Submission, SubmissionCreate, SubmissionResult

router = APIRouter()

async def submit_to_runner(submission_id: int, code: str, language: str):
    """Submit code to runner service"""
    job_id = str(uuid.uuid4())
    
    # Create job record
    db = next(get_db())
    job = JobModel(id=job_id, status="pending")
    db.add(job)
    db.commit()
    
    # Update submission with job_id
    submission = db.query(SubmissionModel).filter(SubmissionModel.id == submission_id).first()
    if submission:
        submission.job_id = job_id
        submission.status = "running"
        db.commit()
    
    # Submit to runner
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.RUNNER_URL}/execute",
                json={
                    "job_id": job_id,
                    "code": code,
                    "language": language
                },
                timeout=30.0
            )
            response.raise_for_status()
            
            # Update job with result
            result_data = response.json()
            job.status = result_data.get("status", "completed")
            job.result = result_data.get("result")
            job.completed_at = datetime.utcnow()
            if submission:
                submission.status = "completed" if job.status == "completed" else "failed"
            db.commit()
            
    except Exception as e:
        # Update job and submission status on error
        job.status = "failed"
        job.error_message = str(e)
        job.completed_at = datetime.utcnow()
        if submission:
            submission.status = "failed"
        db.commit()
    
    db.close()

@router.post("/submit", response_model=Submission)
async def submit_code(
    submission_data: SubmissionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Submit code for execution"""
    # Create submission record
    submission = SubmissionModel(
        lesson_id=submission_data.lesson_id,
        user_id=submission_data.user_id,
        code=submission_data.code,
        language=submission_data.language,
        status="pending"
    )
    
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    # Submit to runner in background
    background_tasks.add_task(
        submit_to_runner,
        submission.id,
        submission_data.code,
        submission_data.language
    )
    
    return submission

@router.get("/submissions/{submission_id}", response_model=Submission)
async def get_submission(submission_id: int, db: Session = Depends(get_db)):
    """Get submission by ID"""
    submission = db.query(SubmissionModel).filter(SubmissionModel.id == submission_id).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return submission