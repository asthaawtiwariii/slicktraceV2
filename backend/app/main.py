import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

from .config import settings
from .database import init_db
from .routers import incidents, detection, drift, attribution, reports, satellite

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DuckDB tables and seed data
    init_db()
    print(f"[*] SlickTrace V2 Backend initialized with DuckDB at {settings.DATABASE_PATH}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Automated AI Oil Spill Detection, Hydrodynamic Lagrangian Drift Modeling & AIS Attribution Engine",
    lifespan=lifespan
)

# Configure CORS
origins = settings.CORS_ORIGINS
if "*" in origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=r"https?://.*\.onrender\.com|https?://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register API Routers under /api
app.include_router(incidents.router)
app.include_router(detection.router)
app.include_router(satellite.router)
app.include_router(drift.router)
app.include_router(attribution.router)
app.include_router(reports.router)

@app.get("/api/health")
def healthcheck():
    return {
        "status": "healthy",
        "database_connected": True,
        "active_feed": "Marine Cadastre AIS + Sentinel-1 SAR"
    }

@app.get("/api/info")
def api_info():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/docs",
        "database": "DuckDB High-Performance Analytics Engine",
        "ais_dataset_source": "https://marinecadastre.gov/accessais/"
    }

# Locate static assets in backend/static or frontend/dist
BACKEND_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BACKEND_DIR / "static"
FRONTEND_DIST = BACKEND_DIR.parent / "frontend" / "dist"

SERVE_DIR = STATIC_DIR if (STATIC_DIR.exists() and (STATIC_DIR / "index.html").exists()) else FRONTEND_DIST

if SERVE_DIR.exists() and (SERVE_DIR / "index.html").exists():
    if (SERVE_DIR / "assets").exists():
        app.mount("/assets", StaticFiles(directory=str(SERVE_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = SERVE_DIR / full_path
        if full_path and file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(SERVE_DIR / "index.html")
else:
    @app.get("/")
    def root():
        return {
            "system": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "operational",
            "docs": "/docs",
            "database": "DuckDB High-Performance Analytics Engine"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
