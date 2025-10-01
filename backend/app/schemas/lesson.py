from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: str
    difficulty: str = "beginner"
    module: str
    is_active: bool = True

class LessonCreate(LessonBase):
    pass

class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    difficulty: Optional[str] = None
    module: Optional[str] = None
    is_active: Optional[bool] = None

class Lesson(LessonBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True