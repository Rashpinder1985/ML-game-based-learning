from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import (
    authenticate_user, create_access_token, get_password_hash,
    verify_password, generate_verification_token, generate_reset_token,
    get_current_active_user
)
from app.core.config import settings
from app.models.user import User
from app.models.analytics import UserAnalytics, PlatformAnalytics
from app.schemas.auth import (
    UserRegister, UserLogin, Token, UserResponse, 
    PasswordReset, PasswordResetConfirm, EmailVerification
)
from app.schemas.analytics import PlatformStatsResponse
import uuid

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user."""
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        verification_token = generate_verification_token()
        
        new_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            verification_token=verification_token,
            is_verified=False,
            total_xp=0,
            current_level=1,
            badges=[],
            game_stats={
                "hearts": 3,
                "max_streak": 0,
                "current_streak": 0,
                "challenges_completed": 0
            }
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # TODO: Send verification email
        print(f"Verification token for {user_data.email}: {verification_token}")
        
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post("/login", response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login a user and return access token."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create session analytics
    session_id = str(uuid.uuid4())
    session_analytics = UserAnalytics(
        user_id=user.id,
        session_id=session_id,
        last_activity=datetime.utcnow()
    )
    db.add(session_analytics)
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user


@router.post("/verify-email")
async def verify_email(verification_data: EmailVerification, db: Session = Depends(get_db)):
    """Verify user email with token."""
    user = db.query(User).filter(User.verification_token == verification_data.token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    user.is_verified = True
    user.verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully"}


@router.post("/forgot-password")
async def forgot_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    """Send password reset token."""
    user = db.query(User).filter(User.email == reset_data.email).first()
    if not user:
        # Don't reveal if email exists
        return {"message": "If the email exists, a reset link has been sent"}
    
    reset_token = generate_reset_token()
    user.reset_token = reset_token
    db.commit()
    
    # TODO: Send reset email
    print(f"Reset token for {reset_data.email}: {reset_token}")
    
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(reset_data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Reset password with token."""
    user = db.query(User).filter(User.reset_token == reset_data.token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )
    
    user.hashed_password = get_password_hash(reset_data.new_password)
    user.reset_token = None
    db.commit()
    
    return {"message": "Password reset successfully"}


@router.get("/platform-stats", response_model=PlatformStatsResponse)
async def get_platform_stats(db: Session = Depends(get_db)):
    """Get platform statistics (admin endpoint)."""
    try:
        # Get basic stats directly from database
        total_users = db.query(User).count()
        
        return PlatformStatsResponse(
            total_users=total_users,
            active_users_today=0,
            new_registrations_today=0,
            challenges_completed_today=0,
            lessons_accessed_today=0,
            code_submissions_today=0,
            avg_session_duration=0.0
        )
    except Exception as e:
        print(f"Error in platform stats: {e}")
        # Return minimal stats on error
        return PlatformStatsResponse(
            total_users=0,
            active_users_today=0,
            new_registrations_today=0,
            challenges_completed_today=0,
            lessons_accessed_today=0,
            code_submissions_today=0,
            avg_session_duration=0.0
        )