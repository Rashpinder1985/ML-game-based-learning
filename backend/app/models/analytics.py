from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class UserAnalytics(Base):
    __tablename__ = "user_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String(255), nullable=False)
    page_views = Column(Integer, default=0)
    time_spent = Column(Float, default=0.0)  # in minutes
    challenges_completed = Column(Integer, default=0)
    lessons_accessed = Column(Integer, default=0)
    code_submissions = Column(Integer, default=0)
    last_activity = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="analytics")


class Module0Progress(Base):
    __tablename__ = "module0_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, nullable=False)  # 1-10
    status = Column(String(50), default="locked")  # locked, unlocked, completed
    attempts = Column(Integer, default=0)
    best_score = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    time_to_complete = Column(Float)  # in minutes
    hints_used = Column(Integer, default=0)
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")


class PlatformAnalytics(Base):
    __tablename__ = "platform_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    total_users = Column(Integer, default=0)
    active_users = Column(Integer, default=0)
    new_registrations = Column(Integer, default=0)
    challenges_completed = Column(Integer, default=0)
    lessons_accessed = Column(Integer, default=0)
    code_submissions = Column(Integer, default=0)
    avg_session_duration = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())