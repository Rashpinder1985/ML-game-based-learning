from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String(100), primary_key=True, index=True)
    status = Column(String(50), default="pending")  # pending, running, completed, failed
    result = Column(JSON)  # {passed, metrics, hints, logs}
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))