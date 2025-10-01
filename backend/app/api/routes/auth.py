from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User as UserModel
from app.schemas.user import UserCreate, UserRead, Token, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    """Register a new user account."""
    existing_user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = UserModel(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.options("/register", include_in_schema=False)
def preflight_register() -> Response:
    """Handle CORS preflight requests for register endpoint."""
    return Response(status_code=status.HTTP_200_OK)


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Token:
    """Authenticate user and issue JWT access token."""
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return Token(access_token=access_token)


@router.post("/login/json", response_model=Token)
def login_json(payload: LoginRequest, db: Session = Depends(get_db)) -> Token:
    """JSON-based login helper for clients that prefer JSON payloads."""
    user = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return Token(access_token=access_token)


@router.options("/login/json", include_in_schema=False)
def preflight_login_json() -> Response:
    """Handle CORS preflight requests for JSON login endpoint."""
    return Response(status_code=status.HTTP_200_OK)


@router.get("/me", response_model=UserRead)
def read_users_me(current_user: UserModel = Depends(get_current_active_user)) -> UserRead:
    """Retrieve the current authenticated user profile."""
    return current_user
