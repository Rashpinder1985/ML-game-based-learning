from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.lesson import Lesson as LessonModel
from app.schemas.lesson import Lesson

router = APIRouter()

@router.get("/lessons", response_model=List[Lesson])
async def get_lessons(
    skip: int = 0,
    limit: int = 100,
    module: str = None,
    difficulty: str = None,
    db: Session = Depends(get_db)
):
    """Get all lessons with optional filtering"""
    query = db.query(LessonModel).filter(LessonModel.is_active == True)
    
    if module:
        query = query.filter(LessonModel.module == module)
    if difficulty:
        query = query.filter(LessonModel.difficulty == difficulty)
    
    lessons = query.offset(skip).limit(limit).all()
    return lessons

@router.get("/lessons/{lesson_id}", response_model=Lesson)
async def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Get a specific lesson by ID"""
    lesson = db.query(LessonModel).filter(
        LessonModel.id == lesson_id,
        LessonModel.is_active == True
    ).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return lesson