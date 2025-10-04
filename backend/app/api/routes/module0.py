from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_active_user
from app.models.user import User
from app.models.analytics import Module0Progress, UserAnalytics, PlatformAnalytics
from app.schemas.analytics import (
    Module0ProgressResponse, UserAnalyticsResponse, 
    GameStatsUpdate, BadgeEarned
)
from typing import List

router = APIRouter()


@router.get("/progress", response_model=UserAnalyticsResponse)
async def get_user_progress(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's Module 0 progress and overall analytics."""
    # Get Module 0 progress
    module0_progress = db.query(Module0Progress).filter(
        Module0Progress.user_id == current_user.id
    ).order_by(Module0Progress.challenge_id).all()
    
    # Get user analytics
    user_analytics = db.query(UserAnalytics).filter(
        UserAnalytics.user_id == current_user.id
    ).all()
    
    # Calculate totals
    total_sessions = len(user_analytics)
    total_time_spent = sum(a.time_spent for a in user_analytics)
    total_challenges_completed = len([p for p in module0_progress if p.status == "completed"])
    total_lessons_accessed = sum(a.lessons_accessed for a in user_analytics)
    total_code_submissions = sum(a.code_submissions for a in user_analytics)
    
    # Calculate current streak from game stats
    current_streak = current_user.game_stats.get("current_streak", 0)
    
    # Format Module 0 progress
    module0_progress_data = []
    for progress in module0_progress:
        module0_progress_data.append(Module0ProgressResponse(
            challenge_id=progress.challenge_id,
            status=progress.status,
            attempts=progress.attempts,
            best_score=progress.best_score,
            xp_earned=progress.xp_earned,
            time_to_complete=progress.time_to_complete,
            hints_used=progress.hints_used,
            completed_at=progress.completed_at
        ))
    
    return UserAnalyticsResponse(
        total_sessions=total_sessions,
        total_time_spent=total_time_spent,
        challenges_completed=total_challenges_completed,
        lessons_accessed=total_lessons_accessed,
        code_submissions=total_code_submissions,
        current_streak=current_streak,
        module0_progress=module0_progress_data
    )


@router.post("/challenge-complete")
async def complete_challenge(
    game_stats: GameStatsUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user progress when completing a Module 0 challenge."""
    # Get or create Module 0 progress for this challenge
    progress = db.query(Module0Progress).filter(
        Module0Progress.user_id == current_user.id,
        Module0Progress.challenge_id == game_stats.challenge_id
    ).first()
    
    if not progress:
        progress = Module0Progress(
            user_id=current_user.id,
            challenge_id=game_stats.challenge_id,
            status="unlocked"
        )
        db.add(progress)
    
    # Update progress
    progress.attempts += 1
    
    if game_stats.completed:
        progress.status = "completed"
        progress.best_score = max(progress.best_score, 100)  # Assume 100 for completed
        progress.xp_earned = game_stats.xp_earned
        progress.time_to_complete = game_stats.time_to_complete
        progress.hints_used = game_stats.hints_used or 0
        progress.completed_at = datetime.utcnow()
        
        # Update user stats
        current_user.total_xp += game_stats.xp_earned
        current_user.game_stats["current_streak"] = game_stats.current_streak
        current_user.game_stats["max_streak"] = max(
            current_user.game_stats.get("max_streak", 0),
            game_stats.current_streak
        )
        current_user.game_stats["challenges_completed"] += 1
        
        # Update hearts
        current_user.game_stats["hearts"] = game_stats.hearts_remaining
        
        # Check for level up
        new_level = (current_user.total_xp // 100) + 1
        if new_level > current_user.current_level:
            current_user.current_level = new_level
        
        # Update platform analytics
        today = datetime.utcnow().date()
        platform_stats = db.query(PlatformAnalytics).filter(
            PlatformAnalytics.date >= today
        ).first()
        
        if platform_stats:
            platform_stats.challenges_completed += 1
        else:
            platform_stats = PlatformAnalytics(
                total_users=db.query(User).count(),
                challenges_completed=1
            )
            db.add(platform_stats)
    
    db.commit()
    
    # Check for badges
    badges_earned = []
    
    # First challenge badge
    if game_stats.challenge_id == 1 and game_stats.completed:
        if "first_challenge" not in current_user.badges:
            current_user.badges.append("first_challenge")
            badges_earned.append(BadgeEarned(
                badge_name="First Steps",
                badge_description="Completed your first challenge!",
                xp_reward=50
            ))
            current_user.total_xp += 50
    
    # Streak badges
    if game_stats.current_streak >= 3 and "streak_3" not in current_user.badges:
        current_user.badges.append("streak_3")
        badges_earned.append(BadgeEarned(
            badge_name="Getting Hot",
            badge_description="Achieved a 3-challenge streak!",
            xp_reward=100
        ))
        current_user.total_xp += 100
    
    # Perfect challenge badge
    if game_stats.hints_used == 0 and game_stats.completed and "no_hints" not in current_user.badges:
        current_user.badges.append("no_hints")
        badges_earned.append(BadgeEarned(
            badge_name="Independent Learner",
            badge_description="Completed a challenge without hints!",
            xp_reward=75
        ))
        current_user.total_xp += 75
    
    if badges_earned:
        db.commit()
    
    return {
        "message": "Challenge progress updated",
        "badges_earned": badges_earned,
        "new_level": current_user.current_level,
        "total_xp": current_user.total_xp
    }


@router.get("/leaderboard")
async def get_leaderboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get Module 0 leaderboard."""
    # Get top users by XP
    top_users = db.query(User).order_by(User.total_xp.desc()).limit(10).all()
    
    leaderboard = []
    for i, user in enumerate(top_users, 1):
        leaderboard.append({
            "rank": i,
            "username": user.full_name or user.email.split("@")[0],
            "level": user.current_level,
            "total_xp": user.total_xp,
            "challenges_completed": user.game_stats.get("challenges_completed", 0),
            "max_streak": user.game_stats.get("max_streak", 0),
            "badges_count": len(user.badges),
            "is_current_user": user.id == current_user.id
        })
    
    return {
        "leaderboard": leaderboard,
        "current_user_rank": next(
            (i for i, user in enumerate(top_users, 1) if user.id == current_user.id),
            None
        )
    }


@router.post("/unlock-challenge/{challenge_id}")
async def unlock_challenge(
    challenge_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Unlock a Module 0 challenge."""
    if challenge_id < 1 or challenge_id > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid challenge ID"
        )
    
    # Check if previous challenge is completed (except for challenge 1)
    if challenge_id > 1:
        prev_progress = db.query(Module0Progress).filter(
            Module0Progress.user_id == current_user.id,
            Module0Progress.challenge_id == challenge_id - 1,
            Module0Progress.status == "completed"
        ).first()
        
        if not prev_progress:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Complete the previous challenge first"
            )
    
    # Create or update progress
    progress = db.query(Module0Progress).filter(
        Module0Progress.user_id == current_user.id,
        Module0Progress.challenge_id == challenge_id
    ).first()
    
    if not progress:
        progress = Module0Progress(
            user_id=current_user.id,
            challenge_id=challenge_id,
            status="unlocked"
        )
        db.add(progress)
    elif progress.status == "locked":
        progress.status = "unlocked"
    
    db.commit()
    
    return {"message": f"Challenge {challenge_id} unlocked"}