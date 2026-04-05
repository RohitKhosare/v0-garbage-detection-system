from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.api import health, auth, detection, bins, heatmap, routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown events"""
    # Startup
    logger.info("Starting CleanCity AI Backend...")
    await init_db()
    logger.info("Database initialized")
    yield
    # Shutdown
    logger.info("Shutting down CleanCity AI Backend...")


# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description="Production-ready backend for garbage detection system",
    version=settings.API_VERSION,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(health.router)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(detection.router, prefix="/api/v1", tags=["Detection"])
app.include_router(bins.router, prefix="/api/v1", tags=["Bins"])
app.include_router(heatmap.router, prefix="/api/v1", tags=["Heatmap"])
app.include_router(routes.router, prefix="/api/v1", tags=["Routes"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "CleanCity AI Backend API",
        "version": settings.API_VERSION,
        "docs": "/docs",
        "status": "operational"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
