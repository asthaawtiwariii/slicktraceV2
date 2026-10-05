from fastapi import APIRouter, Query
from ..schemas import DriftSimRequest, DriftSimResponse, MetoceanDataModel
from ..services.drift_service import DriftService
from ..services.metocean_service import MetoceanService

router = APIRouter(prefix="/api/drift", tags=["Hydrodynamic Drift"])

@router.get("/metocean-live", response_model=MetoceanDataModel)
def get_live_metocean(
    lat: float = Query(..., description="Latitude of oceanic point"),
    lon: float = Query(..., description="Longitude of oceanic point")
):
    """
    Fetches real-time operational ocean currents, 10m winds, and wave metrics
    for any global oceanic coordinate via Open-Meteo live feeds.
    """
    return MetoceanService.get_metocean_conditions(lat, lon)

@router.post("/simulate", response_model=DriftSimResponse)
def run_drift_simulation(request: DriftSimRequest):
    """
    Solves Lagrangian vector drift equation:
    - Traces backward in time (hindcasting) to locate origin (x0, y0, t0)
    - Traces forward in time (forecasting) to project coastal impact
    """
    return DriftService.simulate_drift(request)

