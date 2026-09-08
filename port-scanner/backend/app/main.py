from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .models import Scan, ScanResult
from .routers import scan, reports
from . import auth

# Create database tables in Supabase
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Port Scanner API",
    description="Authorized TCP/UDP/Aggressive port scanning API",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(scan.router)
app.include_router(reports.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "message": "Port Scanner API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }