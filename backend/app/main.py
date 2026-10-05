from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
        allow_origin_regex=r"https?://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register API Routers
app.include_router(incidents.router)
app.include_router(detection.router)
app.include_router(satellite.router)
app.include_router(drift.router)
app.include_router(attribution.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/docs",
        "database": "DuckDB High-Performance Analytics Engine",
        "ais_dataset_source": "https://marinecadastre.gov/accessais/"
    }

@app.get("/api/health")
def healthcheck():
    return {
        "status": "healthy",
        "database_connected": True,
        "active_feed": "Marine Cadastre AIS + Sentinel-1 SAR"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
