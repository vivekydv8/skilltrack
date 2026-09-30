from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database

# Import routers
from app.routers import (
    auth, trainees, placements, followups, employer, analytics, risk, privacy, integrations,
    trainee_portal, ai_portal, digilocker
)
from seed_trainee_portal import seed_trainee_portal_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed realistic dataset
    print("[LIFESPAN] Creating relational schema tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed_database(db)
        seed_trainee_portal_data()
    finally:
        db.close()
    yield
    # Shutdown
    print("[LIFESPAN] SkillTrackAI backend shut down cleanly.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(trainees.router)
app.include_router(placements.router)
app.include_router(followups.router)
app.include_router(employer.router)
app.include_router(analytics.router)
app.include_router(risk.router)
app.include_router(privacy.router)
app.include_router(trainee_portal.router)
app.include_router(ai_portal.router)
app.include_router(integrations.router)
app.include_router(digilocker.router)

@app.get("/")
def root():
    return {
        "app": "SkillTrackAI",
        "vision": "From Training Data to Employability Intelligence",
        "authority": "Government of Maharashtra · Department of Skills, Employment, Entrepreneurship & Innovation",
        "status": "Online",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/api/health")
def healthcheck():
    return {"status": "healthy", "database": "connected"}
