export type Theme = 'light' | 'dark';

export type PageId = 'dashboard' | 'detection' | 'drift' | 'attribution' | 'reports';

export type BasemapId = 'dark' | 'satellite' | 'nautical' | 'topo' | 'voyager';

export type SatelliteLayerId = 
  | 'none'
  | 'nasa-gibs-modis-terra'
  | 'nasa-gibs-viirs-snpp'
  | 'nasa-gibs-viirs-dnb'
  | 'nasa-gibs-chlorophyll'
  | 'nasa-gibs-thermal-anomalies'
  | 'sentinel-2-cloudless';

export interface STACSceneItem {
  id: string;
  collection: string;
  platform: string;
  datetime: string;
  bbox: [number, number, number, number];
  geometry: Record<string, unknown>;
  thumbnail_url?: string;
  cloud_cover?: number;
  orbit_direction?: string;
  relative_orbit?: number;
  polarization?: string;
  resolution_meters?: number;
  instrument_mode?: string;
  assets_count: number;
  downloadable_preview?: string;
}

export interface STACSearchRequest {
  bbox?: [number, number, number, number];
  point?: [number, number];
  start_date?: string;
  end_date?: string;
  collections?: string[];
  sensor_type?: string;
  max_cloud_cover?: number;
  limit?: number;
}

export interface SatelliteLayerConfig {
  id: string;
  name: string;
  provider: string;
  url_template: string;
  format: string;
  layer_type: string;
  description: string;
  default_opacity: number;
  has_date_dimension: boolean;
}

export interface MaritimeHotspot {
  id: string;
  name: string;
  center: [number, number];
  bbox: [number, number, number, number];
  description: string;
  preferred_sensor: string;
  primary_threat: string;
}

export type GeoPoint = [number, number]; // [lat, lon]

export type StakeholderType = 'authorities' | 'environment' | 'public' | 'legal';

export interface PreprocessingData {
  sensor: string;
  radiometricCalibrationFactorDb: number;
  speckleFilterType: string;
  speckleSuppressionIndex: number;
  cloudCoveragePercent: number;
  opticalNdwiValidation: number;
  resolutionMeters: number;
  georeferencedCrs: string;
}

export interface WeatheringData {
  evaporationPercent: number;
  emulsificationWaterPercent: number;
  dynamicViscosityCp: number;
  remainingVolumeM3: number;
  weatheringEngine: string;
}

export interface SlickGeometry {
  id: string;
  name: string;
  areaKm2: number;
  perimeterKm: number;
  estimatedVolumeM3: number;
  estimatedVolumeBarrels?: number;
  estimatedAgeHours: number;
  confidence: number;
  centroid: GeoPoint;
  coordinates: GeoPoint[];
  originPoint: GeoPoint;
  originTimestamp: string;
  detectionTimestamp: string;
  thicknessMicrons: number;
  spillType?: string; // "Thick Mineral Oil Discharge" | "Sheen"
  isThick?: boolean;
  bonnCode?: string;
  faySpreadingRegime?: string;
}

export interface MetoceanData {
  windSpeedKnots: number;
  windDirectionDeg: number;
  currentSpeedKnots: number;
  currentDirectionDeg: number;
  leewayFactor: number;
  seaSurfaceTempC: number;
  waveHeightM: number;
  currentModelSource: string;
  windModelSource: string;
}

export interface DriftConePoint {
  hoursOffset: number; // e.g. -18, -12, 0, +12, +24
  lat: number;
  lon: number;
  radiusKm: number;
  timestamp: string;
}

export interface VesselTrackPoint {
  lat: number;
  lon: number;
  timestamp: string;
  sog: number; // Speed over ground in knots
  cog: number; // Course over ground in degrees
}

export interface SpeedDataPoint {
  time: string;
  sog: number;
  baseline: number;
}

export interface Vessel {
  id: string;
  name: string;
  mmsi: string;
  imo: string;
  callSign: string;
  flag: string;
  type: string;
  draughtM: number;
  lengthM: number;
  destination: string;
  riskScore: number; // 0 - 100
  proximityScore: number;
  timeOverlapScore: number;
  behaviorScore: number;
  aisIntegrityScore: number;
  minDistanceM: number;
  timeDeltaMin: number;
  hasSpeedAnomaly: boolean;
  hasAisBlackout: boolean;
  speedAnomalySummary: string;
  speedProfile: SpeedDataPoint[];
  track: VesselTrackPoint[];
  isCulprit: boolean;
  displayCategory?: 'Speed Anomaly' | 'Past anomaly trajectory';
  rangeBar?: { value: number; min: number; max: number };
  badgeColor?: 'red' | 'blue' | 'orange' | 'green';
}

export interface KeyframeEvent {
  id: string;
  time: string;
  type: 'satellite' | 'origin' | 'ais_gap' | 'speed_drop' | 'detection';
  label: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface IncidentScenario {
  id: string;
  title: string;
  locationName: string;
  center: GeoPoint;
  zoom: number;
  status: 'Critical Alert' | 'Under Investigation' | 'Dossier Prepared' | 'Enforcement Dispatched';
  detectionDate: string;
  satelliteSensor: string;
  orbitPass: string;
  resolution: string;
  slick: SlickGeometry;
  metocean: MetoceanData;
  hindcastTrail: DriftConePoint[];
  forecastTrail: DriftConePoint[];
  vessels: Vessel[];
  keyframes: KeyframeEvent[];
  preprocessing?: PreprocessingData;
  weathering?: WeatheringData;
}

export interface MethodologyStep {
  step_number: number;
  title: string;
  subtitle: string;
  flowchart_node: string;
  description: string;
  key_features: string[];
  github_repo: string;
  repo_url: string;
  status: string;
  output_summary: string;
}

export interface InvestigationReport {
  reportId: string;
  generatedDate: string;
  investigatingOfficer: string;
  agency: string;
  incidentRef: string;
  summary: string;
  primaryCulprit: Vessel;
  secondarySuspects: Vessel[];
  slickSummary: SlickGeometry;
  metoceanSummary: MetoceanData;
  evidenceChain: {
    timestamp: string;
    stage: string;
    source: string;
    finding: string;
  }[];
}
