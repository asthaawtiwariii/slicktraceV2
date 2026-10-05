# 🛰️ SlickTrace V2

SlickTrace V2 is a maritime intelligence and decision-support platform designed for detecting and analyzing potential marine oil spills using satellite imagery, modeling spill drift trajectory, analyzing surrounding vessel traffic, and generating structured investigation reports.

The system integrates geospatial map visualization with analytical backend services to help operators inspect satellite imagery, estimate slick dimensions, simulate surface drift based on metocean conditions, correlate historical AIS vessel positions, and prepare preliminary incident dossiers.

---

## 🚨 Problem

Marine oil spills cause severe environmental and economic damage to coastal ecosystems and marine life. Detecting slicks across vast oceanic areas is challenging due to sensor noise, weather conditions, and natural look-alikes such as calm waters or algal blooms. Furthermore, once an oil spill is identified, determining its origin, predicting its movement under ocean currents and wind, and identifying vessels that were in the vicinity during the release window requires complex spatio-temporal correlation.

---

## 💡 Solution

SlickTrace V2 provides a structured, modular pipeline that connects satellite observation with maritime traffic analytics:

```
Satellite Input → Preprocessing → Oil Spill Detection → Spill Analysis → Drift Simulation → AIS Analysis → Vessel Attribution → Reports
```

By combining image processing filters, hydrodynamic drift formulations, spatial AIS trajectory indexing, and heuristic multi-criteria risk scoring, the platform enables investigators and response teams to explore incident scenarios from initial detection to report generation.

---

## ⚙️ How It Works

The platform operates across 8 core stages:

### 1. Satellite Data / Image Input
Users can select pre-loaded incident case studies (such as Mauritius or Gulf of Mexico scenarios), browse publicly indexed satellite metadata via STAC catalogs, or upload custom GeoTIFF/image tiles. The map interface loads tile layers from public web map tile services (including NASA GIBS overlays and OpenSeaMap nautical charts) to provide visual context around the area of interest.

### 2. SAR Preprocessing
Radar backscatter data undergoes radiometric calibration and speckle filtering to improve dark-spot contrast. The backend applies adaptive window filters (such as Refined Lee filtering) and polarimetric ratio calculations (VV/VH channels) to minimize noise and improve edge definition across ocean surfaces.

### 3. Oil Spill Detection
The system identifies potential dark-spot anomalies corresponding to surface dampening caused by oil films. Algorithmic segmentation routines extract slick boundaries, while dual-polarization feature checks help filter out common false positives such as biogenic slicks and low-wind calm zones.

### 4. Spill Characterization
Detected slick polygons are analyzed geometrically and physically using standard estimation models. The system computes surface area using the Shoelace formula, estimates oil thickness and volume categories aligned with Bonn Agreement Oil Appearance Code (BAOAC) standards, and approximates spreading timeline using Fay spreading formulations.

### 5. Drift Simulation
A Lagrangian particle tracking module calculates forward drift (where the slick is heading) and backward hindcasting (where the slick likely originated). The model combines surface ocean currents, wind leeway factors ($\sim 3\%$), wave-driven Stokes drift, and empirical weathering equations (evaporation and emulsification curves) to generate trajectory paths and uncertainty boundaries.

### 6. AIS Vessel Analysis
The backend indexes historical AIS (Automatic Identification System) vessel records within an embedded DuckDB database. For a given incident time window and geographic radius, the system retrieves nearby vessels, reconstructs trajectory tracks, calculates the Closest Point of Approach (CPA), and flags behavioral anomalies like sudden speed drops or transmission gaps.

### 7. Vessel Attribution
Vessels identified within the spatio-temporal corridor are scored using a weighted multi-criteria risk model. The composite score evaluates distance to origin, temporal overlap, vessel type (e.g., crude tanker vs. cargo), navigational speed changes, and AIS track continuity to rank ships by potential correlation with the spill event.

### 8. Evidence & Report Generation
The platform compiles all detection metrics, drift coordinates, vessel profiles, and risk scores into dedicated stakeholder views. Users can inspect tailored summaries for maritime authorities, environmental response teams, and legal/insurance investigators, with options to export structured JSON packages or print formatted summary dossiers.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS v4
- **Mapping**: Leaflet (`react-leaflet` / `leaflet`) with custom tile layer integrations
- **Icons**: Lucide React

### Backend & Analytics
- **Web API**: FastAPI (Python 3.10+) with Uvicorn
- **Data Modeling & Validation**: Pydantic v2
- **Numerical Processing**: NumPy & standard math/statistical libraries
- **Spatial / Data Storage**: DuckDB (in-process SQL OLAP database for AIS records)

### External Data & Services
- **Map Tiles & Imagery Overlays**: OpenStreetMap, CartoDB Dark Ocean, Esri World Imagery, OpenSeaMap, OpenTopoMap
- **NASA GIBS Services**: Web tile endpoints for MODIS, VIIRS Nighttime lights, Chlorophyll-a, and Thermal layers
- **Meteo & Marine API**: Open-Meteo Marine API client integration for wind/current lookups
- **AIS Seed Data**: Sample datasets formatted according to Marine Cadastre AIS standards

---

## 📂 Project Structure

```
slicktrace/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application entrypoint & middleware
│   │   ├── config.py               # Application settings & environment configuration
│   │   ├── database.py             # DuckDB initialization & AIS sample data seeding
│   │   ├── schemas.py              # Pydantic schemas for requests and responses
│   │   ├── routers/                # API route handlers (detection, drift, attribution, reports)
│   │   └── services/               # Core analytical and mathematical services
│   │       ├── preprocessing_service.py    # Speckle filtering & radiometric calibration
│   │       ├── detection_service.py        # Segmentation simulation & look-alike checks
│   │       ├── characterization_service.py # Shoelace area, BAOAC & Fay spreading age
│   │       ├── drift_service.py            # Lagrangian drift & weathering calculations
│   │       ├── ais_service.py              # DuckDB spatial queries & CPA calculations
│   │       └── attribution_service.py      # Multi-criteria vessel risk scoring
│   └── requirements.txt            # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── map/NauticalMap.tsx # Leaflet multi-layer map component
    │   │   ├── dashboard/          # Metrics cards, incident selector, and panels
    │   │   └── common/             # Navigation bars, modal dialogs, and UI controls
    │   ├── pages/
    │   │   ├── DashboardPage.tsx   # Operational overview & incident summary
    │   │   ├── DetectionPage.tsx   # Satellite imagery viewer & detection controls
    │   │   ├── DriftModelPage.tsx  # Lagrangian drift & weathering simulator
    │   │   ├── AttributionPage.tsx # Vessel corridor search & attribution leaderboard
    │   │   └── ReportsPage.tsx     # Multi-stakeholder reporting & export console
    │   ├── services/api.ts         # Axios/Fetch API client connecting to FastAPI
    │   └── types/index.ts          # Shared TypeScript interfaces
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Running the Project

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher with `npm`

---

### 1. Start the Backend

```bash
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
# On Windows (PowerShell):
python -m venv venv
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
# python3 -m venv venv && source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

*The interactive API documentation is available at `http://localhost:8000/docs`.*

---

### 2. Start the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

*The web application is accessible at `http://localhost:5173`.*

---

## 📊 Key Features

- **Interactive Geospatial Map**: Leaflet map supporting base layers (Dark Ocean, Satellite Hybrid, Nautical Chart, Bathymetry) and NASA GIBS optical/thermal overlays.
- **Live Metocean Weather Synchronization**: Real-time atmospheric 10m wind vector and ocean surface current velocity lookup for any coordinate via Open-Meteo Marine & ECMWF live APIs.
- **Custom / Real-World AIS Ingestion**: Direct drag-and-drop CSV uploader for historical vessel tracks (Marine Cadastre, Spire, or VDR logs) with instant DuckDB indexing.
- **Incident Scenario Library**: Pre-configured benchmark case studies (Mauritius, Peru, Red Sea, Tobago, and Gulf of Mexico) for instant demonstration and analysis.
- **Speckle Reduction & Image Filters**: Configurable Lee adaptive filter kernel sizes (3×3, 5×5, 7×7) and sigma-zero contrast estimation.
- **Physical Spill Calculations**: Automatic estimation of surface area ($\text{km}^2$), volume ($\text{m}^3$), thickness ($\mu\text{m}$), and approximate age.
- **Interactive Drift Modeler**: Dynamic Lagrangian advection with adjustable wind leeway factor ($\sim 3\%$) and empirical PyGNOME weathering curves.
- **AIS Spatial Corridor Query**: Trajectory retrieval and CPA calculation against DuckDB tables with speed anomaly and transponder gap detection.
- **Attribution Scoreboard**: Transparent weighted risk scoring breaking down proximity, timing, vessel type, and transmission continuity.
- **Stakeholder Report Generator**: Pre-formatted incident dossiers tailored for enforcement (USCG), environmental response (EPA/NOAA), and legal documentation.


---

## ⚠️ Data & Limitations

- **AIS Data**: Uses sample and historical AIS records seeded into DuckDB. It does not provide real-time global live AIS satellite tracking unless connected to a commercial live streaming AIS provider.
- **Satellite Feeds & STAC**: Public STAC catalogs and NASA GIBS tile layers depend on external web service availability and internet connectivity. Synthetic Aperture Radar detection algorithms operate on uploaded tiles or pre-processed benchmark scenes.
- **Model Implementations**: Drift simulations and detection metrics are computed using programmatic mathematical implementations of standard empirical formulas (e.g., Stiver & Mackay evaporation, Fay spreading, Lagrangian advection) directly in Python, rather than heavyweight external desktop software suites.
- **Attribution Scope**: Vessel scoring is an investigative correlation tool based on spatio-temporal proximity and track characteristics. It does not constitute legal proof of liability on its own.

---

## 🎯 Use Cases

- **Oil Spill Monitoring & Education**: Demonstrating how remote sensing and oceanographic principles are applied in maritime surveillance.
- **Spill Movement Analysis**: Estimating the potential trajectory and coastal impact zones of surface contaminants for early response planning.
- **Vessel Activity Investigation**: Assisting maritime analysts in narrowing down candidate vessels present near a spill location during the estimated release window.
- **Environmental Response Planning**: Providing containment teams with estimated slick dimensions, thickness categories, and weathering states.
- **Dossier & Report Preparation**: Generating structured preliminary investigation summaries for inter-agency coordination.

---

## 🔮 Future Improvements

- [ ] Direct integration with real-time AIS feed providers via WebSocket (e.g., AISStream, Spire, or MarineTraffic API).
- [ ] Integration of operational ocean forecasting models (e.g., Copernicus Marine CMEMS / HYCOM ocean current feeds).
- [ ] Automated Sentinel-1 SAR acquisition pipeline with direct Sentinel Hub / Copernicus Data Space API processing.
- [ ] Full deep-learning inference pipeline deployment using GPU-accelerated PyTorch / ONNX runtimes on backend servers.
- [ ] Automated PDF dossier generation with cryptographic timestamp sealing.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
