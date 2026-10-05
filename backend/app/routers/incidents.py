from fastapi import APIRouter, HTTPException
from typing import List
from ..database import get_duckdb_connection
from ..schemas import IncidentSummary

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentSummary])
def get_incidents():
    """List active maritime oil spill incidents in EEZ"""
    conn = get_duckdb_connection()
    rows = conn.execute("""
        SELECT id, title, location_name, status, detection_date, satellite_sensor, area_km2
        FROM incidents
    """).fetchall()
    conn.close()

    return [
        IncidentSummary(
            id=r[0],
            title=r[1],
            location_name=r[2],
            status=r[3],
            detection_date=r[4],
            satellite_sensor=r[5],
            slick_area_km2=r[6],
            primary_culprit_name="Vessel PA2017",
            primary_culprit_score=94.2
        )
        for r in rows
    ]

@router.post("/create")
def create_custom_incident(
    title: str,
    location_name: str,
    lat: float,
    lon: float,
    area_km2: float = 15.0,
    sensor: str = "Sentinel-1 SAR (IW Mode)"
):
    """
    Creates a new real-world operational incident anywhere on Earth,
    computes live metocean data, backward origin, and inserts into DuckDB.
    """
    import uuid
    import math
    from datetime import datetime, timezone
    from ..services.metocean_service import MetoceanService
    from ..services.drift_service import DriftService
    from ..schemas import DriftSimRequest

    incident_id = f"INC-REAL-{str(uuid.uuid4())[:8].upper()}"
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    # Fetch live weather
    metocean = MetoceanService.get_metocean_conditions(lat, lon)

    # Compute backward origin
    drift_req = DriftSimRequest(
        incident_id=incident_id,
        detection_lat=lat,
        detection_lon=lon,
        detection_time=now_str,
        slick_area_km2=area_km2,
        current_speed_knots=metocean.current_speed_knots,
        current_direction_deg=metocean.current_direction_deg,
        wind_speed_knots=metocean.wind_speed_knots,
        wind_direction_deg=metocean.wind_direction_deg,
        max_hours_backward=24
    )
    drift_res = DriftService.simulate_drift(drift_req)
    origin_lat, origin_lon = drift_res.origin_point

    conn = get_duckdb_connection()
    conn.execute("""
        INSERT INTO incidents (
            id, title, location_name, status, detection_date,
            satellite_sensor, orbit_pass, resolution,
            centroid_lat, centroid_lon, area_km2, perimeter_km,
            estimated_volume_m3, estimated_age_hours, confidence,
            thickness_microns, origin_lat, origin_lon, origin_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, [
        incident_id, title, location_name, "EMERGENCY_ACTIVE", now_str,
        sensor, "Ascending Pass", "10m",
        lat, lon, area_km2, round(math.sqrt(area_km2) * 4.2, 1),
        round(area_km2 * 25.0, 1), 24.0, 88.5,
        25.0, origin_lat, origin_lon, drift_res.origin_timestamp
    ])
    conn.close()

    return {
        "id": incident_id,
        "title": title,
        "location_name": location_name,
        "status": "EMERGENCY_ACTIVE",
        "detection_date": now_str,
        "centroid": [lat, lon],
        "area_km2": area_km2,
        "origin_point": [origin_lat, origin_lon],
        "metocean": metocean
    }

@router.get("/{incident_id}")
def get_incident_detail(incident_id: str):
    """Retrieve full incident telemetry and parameters"""
    conn = get_duckdb_connection()
    row = conn.execute("SELECT * FROM incidents WHERE id = ?", [incident_id]).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Incident not found")

    return {
        "id": row[0],
        "title": row[1],
        "location_name": row[2],
        "status": row[3],
        "detection_date": row[4],
        "satellite_sensor": row[5],
        "orbit_pass": row[6],
        "resolution": row[7],
        "centroid": [row[8], row[9]],
        "area_km2": row[10],
        "perimeter_km": row[11],
        "estimated_volume_m3": row[12],
        "estimated_age_hours": row[13],
        "confidence": row[14],
        "thickness_microns": row[15],
        "origin_point": [row[16], row[17]],
        "origin_timestamp": row[18]
    }


