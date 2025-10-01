from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ProgressBase(BaseModel):
    user_id: str
    lesson_id: int
    status: str = "not_started"
    score: int = 0
    attempts: int = 0
    progress_metadata: Optional[Dict[str, Any]] = None

class ProgressCreate(ProgressBase):
    pass

class ProgressUpdate(BaseModel):
    status: Optional[str] = None
    score: Optional[int] = None
    attempts: Optional[int] = None
    best_submission_id: Optional[int] = None
    progress_metadata: Optional[Dict[str, Any]] = None

class Progress(ProgressBase):
    id: int
    best_submission_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True