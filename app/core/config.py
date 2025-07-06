from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Banker Property Valuation MVP"
    DATABASE_URL: str = "postgresql://your_db_user:your_db_password@localhost:5432/bank_valuation_mvp"
    # In a real app, use environment variables for sensitive data like DATABASE_URL
    # Example for .env file:
    # DATABASE_URL="postgresql://user:pass@host:port/dbname"

    # Placeholder for other settings
    DEBUG_MODE: bool = True

    class Config:
        env_file = ".env" # Specify the .env file to load
        env_file_encoding = 'utf-8'
        extra = 'ignore' # Ignore extra fields from .env

@lru_cache() # Cache the settings object for performance
def get_settings():
    return Settings()

settings = get_settings()

# To use settings in other modules:
# from app.core.config import settings
# print(settings.APP_NAME)
# print(settings.DATABASE_URL)
```
