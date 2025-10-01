from datetime import datetime
from typing import Optional, Dict, Any

from pydantic import BaseModel


class ProgressBase(BaseModel):
    lesson_id: int
    status: str = "not_started"
    score: int = 0
    attempts: int = 0
    progress_metadata: Optional[Dict[str, Any]] = None


class ProgressCreate(ProgressBase):
    best_submission_id: Optional[int] = None


class ProgressUpdate(BaseModel):
    status: Optional[str] = None
    score: Optional[int] = None
    attempts: Optional[int] = None
    best_submission_id: Optional[int] = None
    progress_metadata: Optional[Dict[str, Any]] = None


class Progress(ProgressBase):
    id: int
    user_id: int
    best_submission_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
