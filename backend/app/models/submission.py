from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    user_id = Column(String(100), nullable=False)
    code = Column(Text, nullable=False)
    language = Column(String(50), default="python")
    status = Column(String(50), default="pending")  # pending, running, completed, failed
    result = Column(JSON)  # {passed, metrics, hints, logs}
    job_id = Column(String(100))  # Reference to runner job
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    lesson = relationship("Lesson", back_populates="submissions")