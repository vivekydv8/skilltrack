import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "SkillTrackAI - Longitudinal Skilling Outcomes & Employability Intelligence Platform"
    VERSION: str = "1.0.0-RELEASE"
    DESCRIPTION: str = "Official System for Govt. of Maharashtra, Dept. of Skills, Employment, Entrepreneurship & Innovation"
    
    # Defaults to SQLite for zero-config immediate local run; switches to PostgreSQL via env var
    # Canonical absolute path ensures consistency regardless of execution CWD
    _backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    _default_db = os.path.join(_backend_dir, "skilltrackai.db").replace("\\", "/")
    _raw_db = os.getenv("DATABASE_URL", f"sqlite:///{_default_db}")
    if _raw_db.startswith("sqlite:///."):
        DATABASE_URL: str = f"sqlite:///{_default_db}"
    else:
        DATABASE_URL: str = _raw_db
    
    # JWT Secret Key
    SECRET_KEY: str = os.getenv("SECRET_KEY", "sih26135-maharashtra-skilltrack-secret-key-2026")
    
    # Twilio Live SMS Configuration
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")
    
    # Frontend base URL for SMS survey links
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # Integration Stubs Configuration
    SMS_GATEWAY_ENABLED: bool = os.getenv("SMS_GATEWAY_ENABLED", "False").lower() == "true"
    SMS_GATEWAY_URL: str = os.getenv("SMS_GATEWAY_URL", "https://api.sms-gateway-stub.gov.in/v1/send")
    
    EPFO_API_ENABLED: bool = os.getenv("EPFO_API_ENABLED", "False").lower() == "true"
    EPFO_API_URL: str = os.getenv("EPFO_API_URL", "https://api.epfindia-stub.gov.in/v2/uan-verify")
    
    UDYAM_API_ENABLED: bool = os.getenv("UDYAM_API_ENABLED", "False").lower() == "true"

    # DigiLocker OAuth2 Configuration
    DIGILOCKER_CLIENT_ID: str = os.getenv("DIGILOCKER_CLIENT_ID", "")
    DIGILOCKER_CLIENT_SECRET: str = os.getenv("DIGILOCKER_CLIENT_SECRET", "")
    DIGILOCKER_REDIRECT_URI: str = os.getenv("DIGILOCKER_REDIRECT_URI", "http://localhost:5173/digilocker/callback")
    DIGILOCKER_AUTH_URL: str = os.getenv("DIGILOCKER_AUTH_URL", "https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize")
    DIGILOCKER_TOKEN_URL: str = os.getenv("DIGILOCKER_TOKEN_URL", "https://digilocker.meripehchaan.gov.in/public/oauth2/1/token")
    DIGILOCKER_USER_URL: str = os.getenv("DIGILOCKER_USER_URL", "https://digilocker.meripehchaan.gov.in/public/oauth2/1/user")
    DIGILOCKER_FILES_URL: str = os.getenv("DIGILOCKER_FILES_URL", "https://digilocker.meripehchaan.gov.in/public/oauth2/1/files/issued")
    DIGILOCKER_REVOKE_URL: str = os.getenv("DIGILOCKER_REVOKE_URL", "https://digilocker.meripehchaan.gov.in/public/oauth2/1/revoke")

settings = Settings()
