from pydantic import BaseModel, Field
from typing import List, Optional, Tuple, Dict, Any

class GeoPoint(BaseModel):
    lat: float
    lon: float

class PreprocessingMetrics(BaseModel):
    sensor: str = "Sentinel-1 SAR C-Band IW"
    radiometric_calibration_factor_db: float = -83.0
    speckle_filter_type: str = "Refined Lee (3x3 / 7x7 Window)"
    speckle_suppression_index: float = 0.88
    cloud_coverage_percent: float = 0.0  # SAR penetrates clouds
    optical_ndwi_validation: float = 0.42
    resolution_meters: float = 10.0
    georeferenced_crs: str = "EPSG:4326 (WGS84)"

class STACSearchRequest(BaseModel):
    bbox: Optional[List[float]] = None
    point: Optional[Tuple[float, float]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    collections: Optional[List[str]] = ["sentinel-1-grd", "sentinel-2-l2a"]
    sensor_type: Optional[str] = None
    max_cloud_cover: Optional[float] = 30.0
    limit: Optional[int] = 10

class STACSceneItem(BaseModel):
    id: str
    collection: str
    platform: str
    datetime: str
    bbox: List[float]
    geometry: Dict[str, Any]
    thumbnail_url: Optional[str] = None
    cloud_cover: Optional[float] = 0.0
    orbit_direction: Optional[str] = "ascending"
    relative_orbit: Optional[int] = 142
    polarization: Optional[str] = "Dual-Pol (VV + VH)"
    resolution_meters: Optional[float] = 10.0
    instrument_mode: Optional[str] = "IW Mode"
    assets_count: int = 8
    downloadable_preview: Optional[str] = None

class SatelliteLayerConfig(BaseModel):
    id: str
    name: str
    provider: str
    url_template: str
    format: str
    layer_type: str  # wmts / wms / xyz
    description: str
    default_opacity: float = 0.85
    has_date_dimension: bool = False

class SceneAnalysisRequest(BaseModel):
    scene_id: str
    platform: str = "Sentinel-1B"
    center_lat: float
    center_lon: float
    polarization: Optional[str] = "Dual-Pol (VV + VH)"
    kernel_size: Optional[str] = "3x3"
    confidence_threshold: Optional[float] = 80.0
    filter_low_wind: Optional[bool] = True
    filter_biogenic: Optional[bool] = True
    filter_algae: Optional[bool] = True


class SlickGeometryModel(BaseModel):
    id: str
    name: str
    area_km2: float
    perimeter_km: float
    estimated_volume_m3: float
    estimated_volume_barrels: float = 7862.0
    estimated_age_hours: float
    confidence: float
    thickness_microns: float
    spill_type: str = "Thick Mineral Oil Discharge"  # Explicit Sheen / Thick
    is_thick: bool = True
    bonn_code: str = "BAOAC Code 4 - Metallic / True Color"
    fay_spreading_regime: str = "Viscous-Surface Tension Regime"
    centroid: Tuple[float, float]
    coordinates: List[Tuple[float, float]]
    origin_point: Tuple[float, float]
    origin_timestamp: str
    detection_timestamp: str

class MetoceanDataModel(BaseModel):
    wind_speed_knots: float
    wind_direction_deg: float
    current_speed_knots: float
    current_direction_deg: float
    leeway_factor: float
    sea_surface_temp_c: float
    wave_height_m: float
    current_model_source: str
    wind_model_source: str

class DriftPoint(BaseModel):
    hours_offset: float
    lat: float
    lon: float
    radius_km: float
    timestamp: str

class DriftSimRequest(BaseModel):
    incident_id: str
    detection_lat: float
    detection_lon: float
    detection_time: str
    slick_area_km2: float
    wind_speed_knots: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    current_speed_knots: Optional[float] = None
    current_direction_deg: Optional[float] = None
    leeway_factor: Optional[float] = 0.032
    max_hours_backward: Optional[int] = 36
    forecast_hours_forward: Optional[int] = 36

class WeatheringMetrics(BaseModel):
    evaporation_percent: float = 24.5
    emulsification_water_percent: float = 42.0
    dynamic_viscosity_cp: float = 185.0
    remaining_volume_m3: float = 943.7
    weathering_engine: str = "NOAA-ORR-ERD/PyGNOME + OpenDrift OpenOil"

class DriftSimResponse(BaseModel):
    incident_id: str
    origin_point: Tuple[float, float]
    origin_timestamp: str
    hindcast_trail: List[DriftPoint]
    forecast_trail: List[DriftPoint]
    confidence_score: float
    coastal_impact_warning: Optional[str] = None
    weathering: WeatheringMetrics = Field(default_factory=WeatheringMetrics)
    drift_engine: str = "OpenDrift / OpenOil Lagrangian Advection"

class DetectionRequest(BaseModel):
    sensor: str = "Sentinel-1 SAR (IW Mode)"
    confidence_threshold: float = 80.0
    filter_low_wind: bool = True
    filter_biogenic: bool = True
    filter_algae: bool = True
    sar_opacity: int = 85

class DetectionResponse(BaseModel):
    slick: SlickGeometryModel
    preprocessing: PreprocessingMetrics = Field(default_factory=PreprocessingMetrics)
    look_alikes_rejected: int
    raw_backscatter_mean_db: float
    contrast_ratio: float
    algorithm_citation: str = "AnavKatwal/OilSpillNet (U-Net) + Misash/Oil-Spill-Detection + prago-dev/YOLOv8"

class AlertDispatchRequest(BaseModel):
    incident_id: str = "INC-2024-MC252"
    result_label: str = "CONFIRMED_OIL_SPILL"
    confidence: float = 87.4
    location_name: str = "Mississippi Canyon Block 252 (Gulf of Mexico)"
    estimated_area_km2: float = 48.3
    estimated_barrels: float = 7862.0
    recipient_email: Optional[str] = "uscg.command@d8.uscg.mil"

class AlertDispatchResponse(BaseModel):
    status: str
    incident_id: str
    recipient: str
    timestamp: str
    subject: str
    preview_body: str
    error: Optional[str] = None

class SpeedPoint(BaseModel):
    time: str
    sog: float
    baseline: float

class VesselTrackPoint(BaseModel):
    lat: float
    lon: float
    timestamp: str
    sog: float
    cog: float

class VesselModel(BaseModel):
    id: str
    name: str
    mmsi: str
    imo: str
    call_sign: str
    flag: str
    type: str
    draught_m: float
    length_m: float
    destination: str
    risk_score: float
    proximity_score: float
    time_overlap_score: float
    behavior_score: float
    ais_integrity_score: float
    min_distance_m: float
    time_delta_min: float
    has_speed_anomaly: bool
    has_ais_blackout: bool
    speed_anomaly_summary: str
    is_culprit: bool
    display_category: Optional[str] = None
    badge_color: Optional[str] = None
    range_bar: Optional[Dict[str, Any]] = None
    speed_profile: List[SpeedPoint]
    track: List[VesselTrackPoint]

class AttributionQueryRequest(BaseModel):
    origin_lat: float
    origin_lon: float
    origin_time: str
    temporal_window_hours: float = 4.0
    spatial_radius_km: float = 25.0

class AttributionResponse(BaseModel):
    total_vessels_checked: int
    suspects_in_corridor: int
    primary_culprit: Optional[VesselModel] = None
    ranked_suspects: List[VesselModel]
    trajectory_engine: str = "movingpandas/movingpandas Spatio-Temporal Corridor Analysis"

class IncidentSummary(BaseModel):
    id: str
    title: str
    location_name: str
    status: str
    detection_date: str
    satellite_sensor: str
    slick_area_km2: float
    primary_culprit_name: Optional[str] = None
    primary_culprit_score: Optional[float] = None

# Methodology Step Representation (Matching Flowchart)
class MethodologyStep(BaseModel):
    step_number: int
    title: str
    subtitle: str
    flowchart_node: str
    description: str
    key_features: List[str]
    github_repo: str
    repo_url: str
    status: str = "Verified & Operational"
    output_summary: str

# 4 Stakeholder Deliverable Schemas (Matching Flowchart Outputs)
class AuthoritiesDossier(BaseModel):
    document_title: str
    classification: str
    agency: str
    warrant_ref: str
    incident_id: str
    action_type: str
    target_vessel: Dict[str, Any]
    intercept_vector: Dict[str, Any]
    legal_basis: str
    commandant_signature: str

class EnvironmentAgencyDossier(BaseModel):
    document_title: str
    assessment_tier: str
    ecological_zone: str
    slick_dimensions: Dict[str, Any]
    containment_plan: Dict[str, Any]
    booming_coordinates: List[Tuple[float, float]]
    recommended_skimmer_type: str
    weathering_status: Dict[str, Any]
    impact_alert: str

class PublicMediaAdvisory(BaseModel):
    advisory_headline: str
    release_date: str
    status_summary: str
    affected_maritime_zone: str
    coastal_guidelines: List[str]
    environmental_safety_status: str
    transparency_metrics: Dict[str, Any]
    hotline: str

class LegalInsuranceDossier(BaseModel):
    affidavit_title: str
    case_ref: str
    jurisdiction: str
    primary_defendant: Dict[str, Any]
    marpol_violations: List[str]
    evidence_chain: List[Dict[str, Any]]
    chain_of_custody_hash_sha256: str
    estimated_damage_claim_usd: str
    prosecuting_attorney: str
