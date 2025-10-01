from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.progress import Progress as ProgressModel
from app.schemas.progress import Progress, ProgressCreate, ProgressUpdate

router = APIRouter()

@router.get("/progress/me", response_model=List[Progress])
async def get_my_progress(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get progress for a specific user"""
    progress = db.query(ProgressModel).filter(ProgressModel.user_id == user_id).all()
    return progress

@router.post("/progress", response_model=Progress)
async def create_progress(
    progress_data: ProgressCreate,
    db: Session = Depends(get_db)
):
    """Create or update progress for a user"""
    # Check if progress already exists
    existing = db.query(ProgressModel).filter(
        ProgressModel.user_id == progress_data.user_id,
        ProgressModel.lesson_id == progress_data.lesson_id
    ).first()
    
    if existing:
        # Update existing progress
        for field, value in progress_data.dict(exclude_unset=True).items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new progress
        progress = ProgressModel(**progress_data.dict())
        db.add(progress)
        db.commit()
        db.refresh(progress)
        return progress

@router.put("/progress/{progress_id}", response_model=Progress)
async def update_progress(
    progress_id: int,
    progress_data: ProgressUpdate,
    db: Session = Depends(get_db)
):
    """Update progress by ID"""
    progress = db.query(ProgressModel).filter(ProgressModel.id == progress_id).first()
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    for field, value in progress_data.dict(exclude_unset=True).items():
        setattr(progress, field, value)
    
    db.commit()
    db.refresh(progress)
    return progress