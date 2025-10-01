from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/ml_learning"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # Runner
    RUNNER_URL: str = "http://runner:8000"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    
    class Config:
        env_file = ".env"
        
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Handle ALLOWED_ORIGINS as comma-separated string
        if isinstance(self.ALLOWED_ORIGINS, str):
            self._allowed_origins_list = [origin.strip() for origin in self.ALLOWED_ORIGINS.split(',')]
        else:
            self._allowed_origins_list = self.ALLOWED_ORIGINS
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Get ALLOWED_ORIGINS as a list of strings."""
        return self._allowed_origins_list

settings = Settings()
