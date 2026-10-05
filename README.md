# 🛰️ SlickTrace V2 — Autonomous AI Maritime Oil Spill Surveillance & AIS Attribution Engine

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![DuckDB](https://img.shields.io/badge/DuckDB-In--Process%20OLAP-FFF000.svg?style=for-the-badge&logo=duckdb&logoColor=black)](https://duckdb.org)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![NASA GIBS](https://img.shields.io/badge/NASA-GIBS%20Live%20WMTS-E03C31.svg?style=for-the-badge&logo=nasa&logoColor=white)](https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**End-to-End Synthetic Aperture Radar (SAR) Detection, Hydrodynamic Lagrangian Drift Modeling, and Court-Admissible AIS Vessel Attribution for Global Oceans.**

[Live Architecture](#-end-to-end-architecture) • [Case Studies](#-historical-ground-truth-case-studies) • [Physics & Algorithms](#-mathematical--physics-foundations) • [API Reference](#-rest-api-endpoints) • [Deployment](#-deployment-guide)

</div>

---

## 🌊 Overview

**SlickTrace V2** is an operational maritime intelligence and forensic decision-support engine. It bridges the gap between orbital satellite Earth observation and commercial maritime AIS transponder tracking to identify, backtrack, and legally attribute illegal nocturnal bilge dumping, offshore pipeline leaks, and catastrophic maritime tanker groundings.

```
       ┌──────────────────────┐         ┌───────────────────────┐
       │  Copernicus Sentinel │         │  NASA GIBS Real-Time  │
       │  SAR C-Band / MSI    │         │  MODIS / VIIRS Sensor │
       └──────────┬───────────┘         └───────────┬───────────┘
                  │                                 │
                  ▼                                 ▼
       ┌────────────────────────────────────────────────────────┐
       │   AI Radar Preprocessing & Refined Lee Speckle Filter  │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │   OilSpillNet Segmentation & Look-Alike Discriminator  │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │  Lagrangian Hydrodynamic Particle Drift (Hind & Fore)  │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │   DuckDB High-Speed Spatio-Temporal Corridor Engine    │
       │   (Marine Cadastre AIS + MovingPandas CPA Physics)     │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │    Cryptographic SHA-256 Multi-Stakeholder Dossier     │
       │   (Coast Guard, Environmental, Public & Legal Teams)   │
       └────────────────────────────────────────────────────────┘
```

---

## ⚡ Key Capabilities

- **🛰️ Multi-Sensor Satellite Feeds & STAC Integration:**
  - Live query connectors for **AWS Earth Search** & **Microsoft Planetary Computer STAC APIs** (Sentinel-1 SAR IW VV+VH and Sentinel-2 L2A).
  - Real-time global **NASA GIBS WMTS tile overlays**: MODIS Terra daily optical pass (250m), VIIRS Day/Night Band (vessel lights & nocturnal gas flares), MODIS Chlorophyll-a (phytoplankton bloom elimination), and VIIRS thermal anomaly hotspots.
- **🔬 Adaptive Radar Speckle Filtering:**
  - Implements **Refined Lee Adaptive Window Filtering (3x3 & 7x7)** and polarimetric dark-spot contrast segmentation.
- **🌊 Hydrodynamic 4th-Order Runge-Kutta Lagrangian Drift:**
  - Bi-directional trajectory simulation: **Hindcasting** to locate discharge coordinates ($T_0$) and **Forecasting** to project coastline impact zones ($T_{+24h}, T_{+48h}$).
  - Integrates **Open-Meteo Marine APIs**, current vector decomposition, leeway windage factors ($\sim 3.2\%$), and Stokes wave drift.
- **🚢 High-Performance AIS Spatio-Temporal Attribution:**
  - Powered by an embedded **DuckDB OLAP engine** executing sub-second spatial queries on Marine Cadastre AIS vessel records.
  - MovingPandas-inspired physics: **Closest Point of Approach (CPA)**, **Deceleration/Speed Anomaly Drops (>3 kn)**, and **AIS Blackout/Gap Identification**.
- **📜 Court-Admissible Cryptographic Dossiers:**
  - Generates immutable forensic audit packages sealed with **SHA-256 evidence hashes**.
  - 4 tailored operational views: **Coast Guard / Port State Control**, **Environmental Response Units**, **Public Transparency**, and **Maritime Legal Prosecutions**.

---

## 🧭 Historical Ground-Truth Case Studies

SlickTrace V2 contains pre-seeded real-world benchmark datasets to validate detection and attribution workflows:

| Incident ID | Vessel / Event | Location | Key Observations |
| :--- | :--- | :--- | :--- |
| `INC-GOM-2024-08` | **Vessel PA2017 (Crude Tanker)** | Gulf of Mexico (Mississippi Canyon) | Nocturnal bilge dump; 12.3 kn → 2.3 kn speed drop; 48.3 km² slick. |
| `INC-REAL-WAKASHIO` | **MV WAKASHIO (Bulk Carrier)** | Mauritius (Pointe d'Esny Coral Reef) | 1,000 tonnes VLSFO spilled; grounded on Ramsar wetland barrier reef. |
| `INC-REAL-TOBAGO` | **Mystery Barge GULFSTREAM** | Tobago & Caribbean Sea | 150 km transboundary drift; unmonitored abandoned barge disaster. |
| `INC-REAL-VENTANILLA`| **MARE DORICUM / Repsol** | Peru (Callao / Ventanilla) | 11,900 barrels crude discharged during underwater terminal offloading. |
| `INC-REAL-RUBYMAR` | **MV RUBYMAR (Cargo Ship)** | Red Sea (Bab-el-Mandeb Strait) | 29-mile surface slick following missile strike hull breach. |
| `INC-MALACCA-2024-03`| **Strait of Malacca TSS** | Malaysia / Singapore Strait | Illegal tank-washing discharge in the world's busiest oil transit corridor. |

---

## 📐 Mathematical & Physics Foundations

### 1. Radar Speckle Suppression (Refined Lee Filter)
$$\hat{I} = \bar{I} + W \cdot (I - \bar{I}), \quad \text{where } W = \frac{\sigma^2 - \sigma_n^2}{\sigma^2}$$
Adaptive weighting preserves sharp slick boundaries while attenuating high-frequency multiplicative speckle noise across calm and turbulent sea surfaces.

### 2. Geometric Slick Characterization (Shoelace Formula)
$$\text{Area} = \frac{1}{2} \left| \sum_{i=0}^{N-1} (x_i y_{i+1} - x_{i+1} y_i) \right|$$
Calculates polygon geodetic surface area and correlates it against **Bonn Agreement Oil Appearance Codes (BAOAC)** to classify sheen vs. thick emulsified crude.

### 3. Lagrangian Particle Trajectory (4th-Order Runge-Kutta)
$$\vec{x}(t + \Delta t) = \vec{x}(t) + \frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$
$$\vec{u}_{\text{total}} = \vec{u}_{\text{current}} + \alpha \cdot \vec{u}_{\text{wind}} + \vec{u}_{\text{stokes}}$$
Where $\alpha \approx 0.032$ represents the empirical atmospheric leeway factor.

### 4. Closest Point of Approach (Haversine CPA)
$$d = 2R \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)} \right)$$
$$\text{CPA} = \min_{t \in [t_{\text{start}}, t_{\text{end}}]} d\Big(\mathbf{P}_{\text{vessel}}(t),\, \mathbf{P}_{\text{origin}}(T_0)\Big)$$

### 5. Multi-Criteria Composite Attribution Risk Scoring
$$\text{Risk Score} = 0.30 \cdot S_{\text{proximity}} + 0.25 \cdot S_{\text{time}} + 0.15 \cdot S_{\text{type}} + 0.15 \cdot S_{\text{speed\_drop}} + 0.15 \cdot S_{\text{ais\_gap}}$$

---

## 🛠️ Technology Stack

```
Frontend:  React 19 • TypeScript • Vite • TailwindCSS v4 • Leaflet • Lucide React
Backend:   Python 3.11 • FastAPI • Uvicorn • Pydantic v2 • NumPy • Pillow
Database:  DuckDB (High-Performance In-Process Analytical SQL Database)
Satellite: NASA GIBS • Copernicus STAC • AWS Earth Search • OpenSeaMap
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health and active data provider status. |
| `GET` | `/api/incidents` | Retrieve all active and historical incidents from DuckDB. |
| `POST` | `/api/incidents/create` | Create a new operational surveillance incident at custom coordinates. |
| `GET` | `/api/satellite/layers` | Get NASA GIBS & Copernicus tile overlay configurations. |
| `POST` | `/api/satellite/search` | Search open STAC catalogs for live Sentinel-1/2 scenes. |
| `POST` | `/api/satellite/analyze-scene` | Run Lee speckle filtering and segmentation on satellite acquisitions. |
| `POST` | `/api/drift/simulate` | Execute forward/backward hydrodynamic Lagrangian trajectory modeling. |
| `GET` | `/api/drift/metocean-live` | Fetch real-time ocean current and wind vectors via Open-Meteo. |
| `POST` | `/api/attribution/correlate` | Correlate vessel trajectories, compute CPAs, and rank suspects. |
| `POST` | `/api/attribution/upload-ais` | Ingest raw Marine Cadastre CSV logs into DuckDB. |
| `GET` | `/api/reports/{id}` | Generate a court-admissible forensic audit report with SHA-256 hash. |
| `GET` | `/api/reports/stakeholder/{target}` | Generate specialized dossiers (authorities, environment, public, legal). |

---

## 🚀 Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/asthaawtiwariii/slicktraceV2.git
cd slicktraceV2
```

### 2. Start Backend (FastAPI + DuckDB)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*API documentation will be available at:* `http://localhost:8000/docs`

### 3. Start Frontend (React 19 + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
*Web dashboard will be available at:* `http://localhost:5173`

---

## ☁️ Deployment Guide

### Deploy on Render (Blueprint)
The repository includes a ready-to-use [`render.yaml`](render.yaml) blueprint:
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Blueprint**.
3. Connect `asthaawtiwariii/slicktraceV2`.
4. Click **Apply** to deploy both the Python FastAPI service and React Vite frontend.

### Deploy Frontend on Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add Environment Variable: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`.
4. Deploy!

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
