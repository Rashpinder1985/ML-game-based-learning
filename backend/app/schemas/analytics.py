from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class Module0ProgressResponse(BaseModel):
    challenge_id: int
    status: str
    attempts: int
    best_score: int
    xp_earned: int
    time_to_complete: Optional[float]
    hints_used: int
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class UserAnalyticsResponse(BaseModel):
    total_sessions: int
    total_time_spent: float
    challenges_completed: int
    lessons_accessed: int
    code_submissions: int
    current_streak: int
    module0_progress: list[Module0ProgressResponse]

    class Config:
        from_attributes = True


class PlatformStatsResponse(BaseModel):
    total_users: int
    active_users_today: int
    new_registrations_today: int
    challenges_completed_today: int
    lessons_accessed_today: int
    code_submissions_today: int
    avg_session_duration: float


class GameStatsUpdate(BaseModel):
    xp_earned: int
    hearts_remaining: int
    current_streak: int
    challenge_id: int
    completed: bool
    time_to_complete: Optional[float] = None
    hints_used: Optional[int] = None


class BadgeEarned(BaseModel):
    badge_name: str
    badge_description: str
    xp_reward: int