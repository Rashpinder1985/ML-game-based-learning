from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class JobResult(BaseModel):
    passed: bool
    metrics: Optional[Dict[str, Any]] = None
    hints: Optional[list] = None
    logs: Optional[str] = None

class Job(BaseModel):
    id: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True