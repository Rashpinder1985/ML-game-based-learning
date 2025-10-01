from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    status = Column(String(50), default="not_started")  # not_started, in_progress, completed
    score = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    best_submission_id = Column(Integer, ForeignKey("submissions.id"))
    progress_metadata = Column(JSON)  # Additional progress data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    lesson = relationship("Lesson")
    best_submission = relationship("Submission")