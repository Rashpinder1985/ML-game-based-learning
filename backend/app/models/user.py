from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255))
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(255))
    reset_token = Column(String(255))
    last_login = Column(DateTime(timezone=True))
    total_xp = Column(Integer, default=0)
    current_level = Column(Integer, default=1)
    badges = Column(JSON, default=list)  # List of earned badges
    game_stats = Column(JSON, default=dict)  # Module 0 game statistics
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    submissions = relationship("Submission", back_populates="user")
    progress = relationship("Progress", back_populates="user")
    analytics = relationship("UserAnalytics", back_populates="user")
