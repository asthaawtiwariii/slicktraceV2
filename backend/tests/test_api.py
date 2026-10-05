import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "SlickTrace" in data["system"]
    assert "docs" in data

def test_healthcheck():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True

def test_get_incidents():
    response = client.get("/api/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert isinstance(incidents, list)
    assert len(incidents) > 0
    assert "id" in incidents[0]
    assert "title" in incidents[0]
    assert "slick_area_km2" in incidents[0]

def test_get_incident_detail():
    response = client.get("/api/incidents/INC-GOM-2024-08")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "INC-GOM-2024-08"
    assert "centroid" in data
    assert "area_km2" in data
    assert "origin_point" in data

def test_get_incident_not_found():
    response = client.get("/api/incidents/NON_EXISTENT_ID")
    assert response.status_code == 404

def test_detection_process():
    payload = {
        "sensor": "Sentinel-1 SAR (IW Mode)",
        "confidence_threshold": 80.0,
        "filter_low_wind": True,
        "filter_biogenic": True,
        "filter_algae": True,
        "sar_opacity": 85
    }
    response = client.post("/api/detection/process", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "slick" in data
    assert "preprocessing" in data
    assert "look_alikes_rejected" in data
    assert data["slick"]["confidence"] >= 0
    assert data["slick"]["area_km2"] > 0
    assert "bonn_code" in data["slick"]
    assert len(data["slick"]["coordinates"]) > 0

def test_yolo_predict():
    response = client.post("/api/detection/yolo-predict?image_filename=sentinel1_sar_crop.tif&conf=0.3")
    assert response.status_code == 200
    data = response.json()
    assert "detected" in data
    assert "detections" in data

def test_dispatch_alert():
    payload = {
        "incident_id": "INC-2024-MC252",
        "result_label": "CONFIRMED_OIL_SPILL",
        "confidence": 87.4,
        "location_name": "Mississippi Canyon Block 252 (Gulf of Mexico)",
        "estimated_area_km2": 48.3,
        "estimated_barrels": 7862.0,
        "recipient_email": "uscg.command@d8.uscg.mil"
    }
    response = client.post("/api/detection/dispatch-alert", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["SIMULATED_DISPATCH", "SENT"]
    assert data["incident_id"] == "INC-2024-MC252"
    assert "subject" in data
    assert "preview_body" in data

def test_drift_simulate():
    payload = {
        "incident_id": "INC-GOM-2024-08",
        "detection_lat": 28.32,
        "detection_lon": -89.85,
        "detection_time": "2024-08-14T06:00:00Z",
        "slick_area_km2": 48.3,
        "wind_speed_knots": 15.0,
        "wind_direction_deg": 220.0,
        "current_speed_knots": 1.2,
        "current_direction_deg": 140.0,
        "leeway_factor": 0.035,
        "max_hours_backward": 18,
        "forecast_hours_forward": 24
    }
    response = client.post("/api/drift/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "hindcast_trail" in data
    assert "forecast_trail" in data
    assert "weathering" in data
    assert "origin_point" in data
    assert len(data["hindcast_trail"]) > 0
    assert len(data["forecast_trail"]) > 0

def test_attribution_correlate():
    payload = {
        "origin_lat": 28.32,
        "origin_lon": -89.85,
        "origin_time": "2024-08-14T02:00:00Z",
        "temporal_window_hours": 4.0,
        "spatial_radius_km": 25.0
    }
    response = client.post("/api/attribution/correlate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "ranked_suspects" in data
    assert data["total_vessels_checked"] > 0
    assert len(data["ranked_suspects"]) > 0
    assert "risk_score" in data["ranked_suspects"][0]

def test_forensic_report():
    response = client.get("/api/reports/INC-GOM-2024-08")
    assert response.status_code == 200
    data = response.json()
    assert data["incident_id"] == "INC-GOM-2024-08"
    assert "culprit_particulars" in data
    assert "chain_of_custody_hash" in data

def test_authorities_dossier():
    response = client.get("/api/reports/stakeholder/authorities")
    assert response.status_code == 200
    data = response.json()
    assert "document_title" in data
    assert "target_vessel" in data
    assert "intercept_vector" in data

def test_environment_dossier():
    response = client.get("/api/reports/stakeholder/environment")
    assert response.status_code == 200
    data = response.json()
    assert "document_title" in data
    assert "containment_plan" in data
    assert "booming_coordinates" in data

def test_public_advisory():
    response = client.get("/api/reports/stakeholder/public")
    assert response.status_code == 200
    data = response.json()
    assert "advisory_headline" in data
    assert "coastal_guidelines" in data

def test_legal_dossier():
    response = client.get("/api/reports/stakeholder/legal")
    assert response.status_code == 200
    data = response.json()
    assert "affidavit_title" in data
    assert "marpol_violations" in data
    assert "chain_of_custody_hash_sha256" in data

def test_invalid_stakeholder_dossier():
    response = client.get("/api/reports/stakeholder/invalid_target")
    assert response.status_code == 400

def test_satellite_layers():
    response = client.get("/api/satellite/layers")
    assert response.status_code == 200
    layers = response.json()
    assert isinstance(layers, list)
    assert len(layers) >= 5
    assert any("nasa-gibs" in l["id"] for l in layers)
    assert any("openseamap" in l["id"] for l in layers)

def test_satellite_hotspots():
    response = client.get("/api/satellite/hotspots")
    assert response.status_code == 200
    hotspots = response.json()
    assert isinstance(hotspots, list)
    assert len(hotspots) >= 4
    assert any(h["id"] == "hotspot-gom" for h in hotspots)
    assert any("mauritius" in h["id"].lower() for h in hotspots)

def test_satellite_search():
    payload = {
        "point": [28.38, -89.92],
        "collections": ["sentinel-1-grd", "sentinel-2-l2a"],
        "limit": 4
    }
    response = client.post("/api/satellite/search", json=payload)
    assert response.status_code == 200
    scenes = response.json()
    assert isinstance(scenes, list)
    assert len(scenes) > 0
    assert "platform" in scenes[0]
    assert "orbit_direction" in scenes[0]

def test_satellite_analyze_scene():
    payload = {
        "scene_id": "S1B_IW_GRDH_TEST",
        "platform": "Sentinel-1B",
        "center_lat": 28.38,
        "center_lon": -89.92,
        "kernel_size": "3x3",
        "confidence_threshold": 80.0,
        "filter_low_wind": True,
        "filter_biogenic": True,
        "filter_algae": True
    }
    response = client.post("/api/satellite/analyze-scene", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "slick" in data
    assert "preprocessing" in data
    assert data["slick"]["confidence"] >= 80.0
    assert data["slick"]["area_km2"] > 0

