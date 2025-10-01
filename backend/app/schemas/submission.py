from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class SubmissionCreate(BaseModel):
    lesson_id: int
    code: str
    language: str = "python"

class SubmissionResult(BaseModel):
    passed: bool
    metrics: Optional[Dict[str, Any]] = None
    hints: Optional[list] = None
    logs: Optional[str] = None

class Submission(BaseModel):
    id: int
    lesson_id: int
    user_id: int
    code: str
    language: str
    status: str
    result: Optional[Dict[str, Any]] = None
    job_id: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
