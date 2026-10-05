const envApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const API_BASE_URL = envApiUrl.endsWith('/') ? envApiUrl.slice(0, -1) : envApiUrl;

export interface DetectionPayload {
  sensor: string;
  confidence_threshold: number;
  filter_low_wind: boolean;
  filter_biogenic: boolean;
  filter_algae: boolean;
  sar_opacity: number;
}

export interface DriftPayload {
  incident_id: string;
  detection_lat: number;
  detection_lon: number;
  detection_time: string;
  slick_area_km2: number;
  wind_speed_knots?: number;
  wind_direction_deg?: number;
  current_speed_knots?: number;
  current_direction_deg?: number;
  leeway_factor?: number;
  max_hours_backward?: number;
  forecast_hours_forward?: number;
}

export interface AttributionPayload {
  origin_lat: number;
  origin_lon: number;
  origin_time: string;
  temporal_window_hours?: number;
  spatial_radius_km?: number;
}

export interface AlertPayload {
  incident_id: string;
  result_label: string;
  confidence: number;
  location_name: string;
  estimated_area_km2: number;
  estimated_barrels: number;
  recipient_email?: string;
}

export const api = {
  // Check backend health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Get active incidents from DuckDB
  async getIncidents() {
    const res = await fetch(`${API_BASE_URL}/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return await res.json();
  },

  // Trigger AI SAR detection
  async processDetection(payload: DetectionPayload) {
    const res = await fetch(`${API_BASE_URL}/detection/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to process detection');
    return await res.json();
  },

  // Run hydrodynamic drift simulation
  async runDriftSimulation(payload: DriftPayload) {
    const res = await fetch(`${API_BASE_URL}/drift/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to run drift simulation');
    return await res.json();
  },

  // Query Marine Cadastre AIS correlation
  async correlateAis(payload: AttributionPayload) {
    const res = await fetch(`${API_BASE_URL}/attribution/correlate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to correlate AIS');
    return await res.json();
  },

  // Dispatch emergency alert notification
  async dispatchAlert(payload: AlertPayload) {
    const res = await fetch(`${API_BASE_URL}/detection/dispatch-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to dispatch alert');
    return await res.json();
  },

  // Fetch court-admissible forensic report
  async getForensicReport(incidentId: string) {
    const res = await fetch(`${API_BASE_URL}/reports/${incidentId}`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return await res.json();
  },

  // Fetch specialized stakeholder dossier (authorities, environment, public, legal)
  async getStakeholderDossier(target: string, incidentId: string = 'INC-GOM-2024-08') {
    const res = await fetch(`${API_BASE_URL}/reports/stakeholder/${target}?incident_id=${incidentId}`);
    if (!res.ok) throw new Error(`Failed to fetch ${target} stakeholder dossier`);
    return await res.json();
  },

  // Get operational satellite tile layer configurations (NASA GIBS / Copernicus / OpenSeaMap)
  async getSatelliteLayers() {
    const res = await fetch(`${API_BASE_URL}/satellite/layers`);
    if (!res.ok) throw new Error('Failed to fetch satellite layers');
    return await res.json();
  },

  // Search live open STAC catalogs (Sentinel-1 SAR, Sentinel-2 MSI, Landsat)
  async searchSatelliteScenes(payload: {
    bbox?: [number, number, number, number];
    point?: [number, number];
    start_date?: string;
    end_date?: string;
    collections?: string[];
    sensor_type?: string;
    limit?: number;
  }) {
    const res = await fetch(`${API_BASE_URL}/satellite/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to search satellite scenes');
    return await res.json();
  },

  // Analyze a real satellite scene with Refined Lee filter and OilSpillNet segmentation
  async analyzeSatelliteScene(payload: {
    scene_id: string;
    platform: string;
    center_lat: number;
    center_lon: number;
    kernel_size?: string;
    confidence_threshold?: number;
    filter_low_wind?: boolean;
    filter_biogenic?: boolean;
    filter_algae?: boolean;
  }) {
    const res = await fetch(`${API_BASE_URL}/satellite/analyze-scene`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to analyze satellite scene');
    return await res.json();
  },

  // Get live metocean conditions (wind, waves, currents) for any coordinate
  async getLiveMetocean(lat: number, lon: number) {
    const res = await fetch(`${API_BASE_URL}/drift/metocean-live?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Failed to fetch live metocean data');
    return await res.json();
  },

  // Upload custom or real-world AIS CSV logs into DuckDB
  async uploadAisCsv(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/attribution/upload-ais`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload AIS CSV');
    return await res.json();
  },

  // Create a new real-world operational incident anywhere on Earth
  async createIncident(payload: {
    title: string;
    location_name: string;
    lat: number;
    lon: number;
    area_km2?: number;
    sensor?: string;
  }) {
    const params = new URLSearchParams({
      title: payload.title,
      location_name: payload.location_name,
      lat: payload.lat.toString(),
      lon: payload.lon.toString(),
      area_km2: (payload.area_km2 || 15.0).toString(),
      sensor: payload.sensor || 'Sentinel-1 SAR (IW Mode)',
    });
    const res = await fetch(`${API_BASE_URL}/incidents/create?${params.toString()}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return await res.json();
  },

  // Analyze a real uploaded satellite/drone image tile
  async analyzeUploadedImage(file: File, centerLat: number, centerLon: number, pixelResM: number = 10) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('center_lat', centerLat.toString());
    formData.append('center_lon', centerLon.toString());
    formData.append('pixel_res_m', pixelResM.toString());
    const res = await fetch(`${API_BASE_URL}/detection/analyze-upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to analyze uploaded image');
    return await res.json();
  },

  // Get high-risk maritime satellite surveillance hotspots
  async getSatelliteHotspots() {
    const res = await fetch(`${API_BASE_URL}/satellite/hotspots`);
    if (!res.ok) throw new Error('Failed to fetch satellite hotspots');
    return await res.json();
  },
};



