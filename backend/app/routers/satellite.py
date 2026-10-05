from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from ..schemas import (
    STACSearchRequest,
    STACSceneItem,
    SatelliteLayerConfig,
    SceneAnalysisRequest,
    DetectionResponse
)
from ..services.satellite_service import SatelliteService

router = APIRouter(prefix="/api/satellite", tags=["Real Satellite Data"])

@router.get("/layers", response_model=List[SatelliteLayerConfig])
def get_operational_satellite_layers():
    """
    Returns real-time and operational satellite WMS/WMTS tile layer endpoints:
    - NASA GIBS MODIS Terra Daily True Color (250m)
    - NASA GIBS VIIRS SNPP Corrected Reflectance
    - NASA GIBS VIIRS Day/Night Band (Night Lights & Vessels)
    - NASA GIBS MODIS Chlorophyll-a (Algae Bloom Discriminator)
    - NASA GIBS VIIRS Thermal Anomalies / Flares
    - Copernicus Sentinel-2 Cloudless Mosaic (10m)
    - OpenSeaMap Seamark Navigation Overlay
    """
    return SatelliteService.get_satellite_layers()

@router.post("/search", response_model=List[STACSceneItem])
def search_satellite_scenes(request: STACSearchRequest):
    """
    Searches live open STAC catalogs (Earth Search / Microsoft Planetary Computer / Copernicus)
    for real Sentinel-1 SAR (IW VV+VH) and Sentinel-2 MSI satellite acquisitions.
    """
    return SatelliteService.search_stac_scenes(request)

@router.post("/analyze-scene", response_model=DetectionResponse)
def analyze_satellite_scene(request: SceneAnalysisRequest):
    """
    Runs SAR Preprocessing (Refined Lee Speckle Filter), OilSpillNet Segmentation,
    and Polarimetric Look-Alike Suppression on a real satellite scene.
    """
    return SatelliteService.analyze_real_satellite_scene(request)

@router.get("/hotspots")
def get_maritime_satellite_hotspots():
    """
    Returns high-risk global maritime chokepoints and real-world oil spill surveillance zones.
    """
    return [
        {
            "id": "hotspot-gom",
            "name": "Gulf of Mexico — Mississippi Canyon Deepwater Sector",
            "center": [28.38, -89.92],
            "bbox": [-90.8, 27.9, -89.0, 29.1],
            "description": "High-density tanker transit corridor & deepwater extraction infrastructure.",
            "preferred_sensor": "Sentinel-1 SAR C-Band (IW Mode)",
            "primary_threat": "Nocturnal bilge dumping & pipeline leaks"
        },
        {
            "id": "hotspot-malacca",
            "name": "Strait of Malacca — One Fathom Bank TSS",
            "center": [2.88, 101.02],
            "bbox": [100.5, 2.4, 101.6, 3.4],
            "description": "World's busiest maritime oil transit strait carrying 25% of global oil shipments.",
            "preferred_sensor": "Sentinel-1 SAR + Sentinel-2 MSI",
            "primary_threat": "Tank washing & illegal ballast discharge"
        },
        {
            "id": "hotspot-mauritius",
            "name": "Mauritius — Pointe d'Esny & Coral Reef Park",
            "center": [-20.443, 57.747],
            "bbox": [57.5, -20.6, 57.9, -20.2],
            "description": "Grounding zone of MV Wakashio (Aug 2020); Ramsar protected coastal wetland.",
            "preferred_sensor": "Sentinel-1 SAR + Sentinel-2 L2A",
            "primary_threat": "Vessel grounding & heavy bunker fuel"
        },
        {
            "id": "hotspot-tobago",
            "name": "Tobago — Caribbean Sea Dispersion Corridor",
            "center": [11.148, -60.778],
            "bbox": [-61.2, 10.9, -60.4, 11.4],
            "description": "Discharge corridor of mystery barge 'Gulfstream' (Feb 2024); 150km slick.",
            "preferred_sensor": "Sentinel-1 SAR C-Band (IW)",
            "primary_threat": "Abandoned barge & long-range drift"
        },
        {
            "id": "hotspot-peru",
            "name": "Peru — Callao / Ventanilla Coast",
            "center": [-11.928, -77.162],
            "bbox": [-77.4, -12.1, -76.9, -11.7],
            "description": "La Pampilla refinery tanker offloading zone; 12,000 bbls spill (Jan 2022).",
            "preferred_sensor": "Sentinel-1 SAR + Sentinel-2",
            "primary_threat": "Terminal mooring line rupture & crude spill"
        },
        {
            "id": "hotspot-redsea",
            "name": "Red Sea — Bab-el-Mandeb Chokepoint & Hanish Islands",
            "center": [13.72, 42.75],
            "bbox": [42.3, 13.3, 43.2, 14.1],
            "description": "MV Rubymar sinking zone (Feb 2024); 29-mile surface oil slick threatening coral reefs.",
            "preferred_sensor": "Sentinel-2 MSI + Sentinel-1 SAR",
            "primary_threat": "Missile strikes, sinking wrecks & fuel leaks"
        }
    ]
