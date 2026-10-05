import type { IncidentScenario } from '../types';

export const mockIncidents: IncidentScenario[] = [
  {
    id: 'INC-GOM-2024-08',
    title: 'SPILL-DELTA-08 (Mississippi Canyon Block 42)',
    locationName: 'Gulf of Mexico — EEZ Sector 4',
    center: [28.38, -89.92],
    zoom: 10,
    status: 'Critical Alert',
    detectionDate: '2024-11-25 22:30 UTC',
    satelliteSensor: 'Sentinel-1B (SAR C-Band GRD)',
    orbitPass: 'Ascending Pass #142 (IW Mode)',
    resolution: '10m Spatial Resolution (VV+VH Polarimetric)',
    slick: {
      id: 'SLICK-42A',
      name: 'SPILL-DELTA-08',
      areaKm2: 48.3,
      perimeterKm: 38.6,
      estimatedVolumeM3: 1250,
      estimatedVolumeBarrels: 7862,
      estimatedAgeHours: 34,
      confidence: 94.2,
      thicknessMicrons: 25.8,
      spillType: 'Thick Mineral Oil Discharge',
      isThick: true,
      bonnCode: 'BAOAC Code 4 (Continuous True Color / Dark Metallic)',
      faySpreadingRegime: 'Viscous-Surface Tension Equilibrium',
      centroid: [28.38, -89.92],
      originPoint: [28.465, -90.155],
      originTimestamp: '2024-11-24 12:30 UTC',
      detectionTimestamp: '2024-11-25 22:30 UTC',
      coordinates: [
        [28.42, -90.06],
        [28.44, -89.96],
        [28.41, -89.84],
        [28.35, -89.81],
        [28.31, -89.88],
        [28.33, -90.02],
        [28.38, -90.08],
        [28.42, -90.06]
      ]
    },
    preprocessing: {
      sensor: 'Sentinel-1B C-Band SAR (IW Mode)',
      radiometricCalibrationFactorDb: -83.2,
      speckleFilterType: 'Refined Lee Filter (3x3 Kernel)',
      speckleSuppressionIndex: 0.942,
      cloudCoveragePercent: 0.0,
      opticalNdwiValidation: 0.88,
      resolutionMeters: 10.0,
      georeferencedCrs: 'EPSG:4326 (WGS 84)'
    },
    weathering: {
      evaporationPercent: 24.5,
      emulsificationWaterPercent: 42.0,
      dynamicViscosityCp: 185.0,
      remainingVolumeM3: 943.8,
      weatheringEngine: 'NOAA PyGNOME & OpenDrift OpenOil'
    },
    metocean: {
      windSpeedKnots: 14.2,
      windDirectionDeg: 315, // NW
      currentSpeedKnots: 0.85,
      currentDirectionDeg: 135, // SE
      leewayFactor: 0.032, // 3.2%
      seaSurfaceTempC: 24.6,
      waveHeightM: 1.2,
      currentModelSource: 'NOAA HYCOM Global 1/12° Analysis',
      windModelSource: 'ECMWF ERA5 Atmospheric Reanalysis'
    },
    hindcastTrail: [
      { hoursOffset: 0, lat: 28.38, lon: -89.92, radiusKm: 1.2, timestamp: '25 Nov 22:30' },
      { hoursOffset: -8, lat: 28.40, lon: -89.98, radiusKm: 1.8, timestamp: '25 Nov 14:30' },
      { hoursOffset: -16, lat: 28.42, lon: -90.04, radiusKm: 2.6, timestamp: '25 Nov 06:30' },
      { hoursOffset: -24, lat: 28.44, lon: -90.10, radiusKm: 3.4, timestamp: '24 Nov 22:30' },
      { hoursOffset: -34, lat: 28.465, lon: -90.155, radiusKm: 4.5, timestamp: '24 Nov 12:30 (ORIGIN)' }
    ],
    forecastTrail: [
      { hoursOffset: 0, lat: 28.38, lon: -89.92, radiusKm: 1.2, timestamp: '25 Nov 22:30' },
      { hoursOffset: 12, lat: 28.34, lon: -89.84, radiusKm: 2.2, timestamp: '26 Nov 10:30' },
      { hoursOffset: 24, lat: 28.29, lon: -89.75, radiusKm: 3.5, timestamp: '26 Nov 22:30' },
      { hoursOffset: 36, lat: 28.23, lon: -89.65, radiusKm: 5.1, timestamp: '27 Nov 10:30 (Shoreline Alert)' }
    ],
    vessels: [
      {
        id: 'v-001',
        name: 'Vessel PA2017',
        mmsi: '235109785',
        imo: '9412038',
        callSign: 'V2AB8',
        flag: 'Panama (PA)',
        type: 'Crude Oil Tanker',
        draughtM: 14.8,
        lengthM: 274,
        destination: 'GULFHAVEN TERMINAL',
        riskScore: 94.2,
        proximityScore: 98.0,
        timeOverlapScore: 95.5,
        behaviorScore: 92.0,
        aisIntegrityScore: 91.5,
        minDistanceM: 280,
        timeDeltaMin: 12,
        hasSpeedAnomaly: true,
        hasAisBlackout: true,
        speedAnomalySummary: 'Severe deceleration: Dropped from 14.5 kn to 2.3 kn for 1h 25m while passing origin zone; 45m AIS signal loss.',
        isCulprit: true,
        displayCategory: 'Speed Anomaly',
        badgeColor: 'red',
        rangeBar: { value: -6, min: -10, max: 10 },
        speedProfile: [
          { time: '08:00', sog: 14.6, baseline: 14.5 },
          { time: '10:00', sog: 14.5, baseline: 14.5 },
          { time: '11:30', sog: 14.2, baseline: 14.5 },
          { time: '12:15', sog: 4.8, baseline: 14.5 },
          { time: '12:30', sog: 2.3, baseline: 14.5 },
          { time: '13:00', sog: 2.5, baseline: 14.5 },
          { time: '13:45', sog: 3.1, baseline: 14.5 },
          { time: '14:30', sog: 11.2, baseline: 14.5 },
          { time: '16:00', sog: 14.1, baseline: 14.5 },
          { time: '20:00', sog: 14.4, baseline: 14.5 }
        ],
        track: [
          { lat: 28.58, lon: -90.35, timestamp: '24 Nov 08:00', sog: 14.6, cog: 128 },
          { lat: 28.52, lon: -90.25, timestamp: '24 Nov 10:30', sog: 14.2, cog: 130 },
          { lat: 28.468, lon: -90.158, timestamp: '24 Nov 12:30', sog: 2.3, cog: 132 },
          { lat: 28.43, lon: -90.09, timestamp: '24 Nov 14:15', sog: 3.4, cog: 135 },
          { lat: 28.36, lon: -89.96, timestamp: '24 Nov 17:00', sog: 13.8, cog: 134 },
          { lat: 28.24, lon: -89.78, timestamp: '24 Nov 21:00', sog: 14.4, cog: 135 },
          { lat: 28.12, lon: -89.60, timestamp: '25 Nov 03:00', sog: 14.5, cog: 136 }
        ]
      },
      {
        id: 'v-002',
        name: 'Vessel DA80061',
        mmsi: '211832000',
        imo: '9238471',
        callSign: 'DLBX',
        flag: 'Liberia (LR)',
        type: 'Chemical Tanker',
        draughtM: 11.2,
        lengthM: 182,
        destination: 'NEW ORLEANS',
        riskScore: 78.4,
        proximityScore: 82.0,
        timeOverlapScore: 74.0,
        behaviorScore: 78.5,
        aisIntegrityScore: 72.0,
        minDistanceM: 1850,
        timeDeltaMin: 48,
        hasSpeedAnomaly: false,
        hasAisBlackout: false,
        speedAnomalySummary: 'Course deviation recorded around sector perimeter.',
        isCulprit: false,
        displayCategory: 'Past anomaly trajectory',
        badgeColor: 'blue',
        speedProfile: [
          { time: '08:00', sog: 13.2, baseline: 13.0 },
          { time: '11:00', sog: 13.1, baseline: 13.0 },
          { time: '13:00', sog: 10.4, baseline: 13.0 },
          { time: '15:00', sog: 12.8, baseline: 13.0 },
          { time: '18:00', sog: 13.0, baseline: 13.0 }
        ],
        track: [
          { lat: 28.62, lon: -90.28, timestamp: '24 Nov 09:00', sog: 13.2, cog: 140 },
          { lat: 28.51, lon: -90.12, timestamp: '24 Nov 13:18', sog: 10.6, cog: 142 },
          { lat: 28.39, lon: -89.95, timestamp: '24 Nov 17:30', sog: 12.8, cog: 141 }
        ]
      }
    ],
    keyframes: [
      { id: 'k-1', time: '24 Nov 08:00', type: 'detection', label: 'Vessel MT NORTH STAR enters Sector 4', severity: 'info' },
      { id: 'k-2', time: '24 Nov 12:15', type: 'speed_drop', label: 'MT NORTH STAR drops speed (14.5 -> 2.3 kn)', severity: 'warning' },
      { id: 'k-3', time: '24 Nov 12:30', type: 'origin', label: 'Estimated Discharge Window (t₀)', severity: 'critical' },
      { id: 'k-4', time: '24 Nov 12:45', type: 'ais_gap', label: 'AIS Signal Gap: 45 min blackout recorded', severity: 'critical' },
      { id: 'k-5', time: '25 Nov 22:30', type: 'satellite', label: 'Sentinel-1 SAR Detection Pass (Spill Delta-08)', severity: 'info' }
    ]
  },
  {
    id: 'INC-REAL-WAKASHIO',
    title: 'MV WAKASHIO Coral Reef Grounding (Pointe d\'Esny)',
    locationName: 'Mauritius — Blue Bay Marine Nature Reserve & Lagoon',
    center: [-20.443, 57.747],
    zoom: 11,
    status: 'Enforcement Dispatched',
    detectionDate: '2020-08-10 14:15 UTC',
    satelliteSensor: 'Sentinel-1B SAR + Sentinel-2B MSI (Dual-Pol)',
    orbitPass: 'Ascending Pass #078 (IW Mode 10m)',
    resolution: '10m Calibrated SAR (VV/VH Backscatter)',
    slick: {
      id: 'SLICK-WAKASHIO-01',
      name: 'MV-WAKASHIO-DISCHARGE',
      areaKm2: 32.4,
      perimeterKm: 28.5,
      estimatedVolumeM3: 1000,
      estimatedVolumeBarrels: 6290,
      estimatedAgeHours: 18,
      confidence: 98.5,
      thicknessMicrons: 30.5,
      spillType: 'Very Low Sulfur Fuel Oil (VLSFO)',
      isThick: true,
      bonnCode: 'BAOAC Code 4 (Continuous True Color / Dark Metallic)',
      faySpreadingRegime: 'Viscous-Surface Tension Barrier Regime',
      centroid: [-20.443, 57.747],
      originPoint: [-20.440, 57.745],
      originTimestamp: '2020-08-06 15:30 UTC',
      detectionTimestamp: '2020-08-10 14:15 UTC',
      coordinates: [
        [-20.420, 57.720],
        [-20.415, 57.755],
        [-20.435, 57.770],
        [-20.465, 57.760],
        [-20.470, 57.730],
        [-20.445, 57.715],
        [-20.420, 57.720]
      ]
    },
    preprocessing: {
      sensor: 'Sentinel-1B C-Band SAR + Sentinel-2B MSI',
      radiometricCalibrationFactorDb: -84.1,
      speckleFilterType: 'Refined Lee Filter (5x5 Adaptive Kernel)',
      speckleSuppressionIndex: 0.965,
      cloudCoveragePercent: 2.1,
      opticalNdwiValidation: 0.94,
      resolutionMeters: 10.0,
      georeferencedCrs: 'EPSG:4326 (WGS 84)'
    },
    weathering: {
      evaporationPercent: 18.2,
      emulsificationWaterPercent: 54.0,
      dynamicViscosityCp: 420.0,
      remainingVolumeM3: 818.0,
      weatheringEngine: 'NOAA PyGNOME & OpenDrift Heavy Fuel Module'
    },
    metocean: {
      windSpeedKnots: 18.5,
      windDirectionDeg: 120, // ESE Trade Winds
      currentSpeedKnots: 0.95,
      currentDirectionDeg: 290, // WNW Lagoon Tidal Current
      leewayFactor: 0.035,
      seaSurfaceTempC: 23.4,
      waveHeightM: 2.1,
      currentModelSource: 'CMEMS Indian Ocean Global Analysis',
      windModelSource: 'ECMWF ERA5 Reanalysis'
    },
    hindcastTrail: [
      { hoursOffset: 0, lat: -20.443, lon: 57.747, radiusKm: 0.8, timestamp: '10 Aug 14:15' },
      { hoursOffset: -6, lat: -20.442, lon: 57.746, radiusKm: 1.2, timestamp: '10 Aug 08:15' },
      { hoursOffset: -12, lat: -20.441, lon: 57.746, radiusKm: 1.6, timestamp: '10 Aug 02:15' },
      { hoursOffset: -18, lat: -20.440, lon: 57.745, radiusKm: 2.1, timestamp: '09 Aug 20:15 (REEF CONTACT)' }
    ],
    forecastTrail: [
      { hoursOffset: 0, lat: -20.443, lon: 57.747, radiusKm: 0.8, timestamp: '10 Aug 14:15' },
      { hoursOffset: 12, lat: -20.428, lon: 57.725, radiusKm: 1.9, timestamp: '11 Aug 02:15 (Île aux Aigrettes)' },
      { hoursOffset: 24, lat: -20.412, lon: 57.705, radiusKm: 3.2, timestamp: '11 Aug 14:15 (Blue Bay Wetland)' }
    ],
    vessels: [
      {
        id: 'v-wakashio',
        name: 'MV WAKASHIO',
        mmsi: '372711000',
        imo: '9337145',
        callSign: '3FEP7',
        flag: 'Panama (PA)',
        type: 'Capesize Bulk Carrier',
        draughtM: 16.0,
        lengthM: 300,
        destination: 'TUBARAO, BRAZIL',
        riskScore: 99.2,
        proximityScore: 99.8,
        timeOverlapScore: 99.0,
        behaviorScore: 98.5,
        aisIntegrityScore: 96.0,
        minDistanceM: 50,
        timeDeltaMin: 0,
        hasSpeedAnomaly: true,
        hasAisBlackout: true,
        speedAnomalySummary: 'Course deviation toward coastline; abrupt speed drop from 11.2 kn to 0.0 kn on coral reef collision.',
        isCulprit: true,
        displayCategory: 'Speed Anomaly',
        badgeColor: 'red',
        rangeBar: { value: -10, min: -10, max: 10 },
        speedProfile: [
          { time: '12:00', sog: 11.4, baseline: 11.2 },
          { time: '14:00', sog: 11.2, baseline: 11.2 },
          { time: '15:15', sog: 11.0, baseline: 11.2 },
          { time: '15:30', sog: 0.0, baseline: 11.2 },
          { time: '16:00', sog: 0.0, baseline: 11.2 },
          { time: '20:00', sog: 0.0, baseline: 11.2 }
        ],
        track: [
          { lat: -20.250, lon: 57.950, timestamp: '06 Aug 12:00', sog: 11.4, cog: 235 },
          { lat: -20.350, lon: 57.850, timestamp: '06 Aug 14:00', sog: 11.2, cog: 235 },
          { lat: -20.440, lon: 57.745, timestamp: '06 Aug 15:30', sog: 0.0, cog: 235 },
          { lat: -20.440, lon: 57.745, timestamp: '10 Aug 14:15', sog: 0.0, cog: 235 }
        ]
      }
    ],
    keyframes: [
      { id: 'kw-1', time: '06 Aug 15:30', type: 'origin', label: 'MV WAKASHIO grounded on Pointe d\'Esny coral reef', severity: 'critical' },
      { id: 'kw-2', time: '08 Aug 10:00', type: 'speed_drop', label: 'Bunker tank breach; fuel oil discharge initiates', severity: 'critical' },
      { id: 'kw-3', time: '10 Aug 14:15', type: 'satellite', label: 'Sentinel-1 & Sentinel-2 multi-sensor dark spot confirmation', severity: 'info' }
    ]
  },
  {
    id: 'INC-REAL-TOBAGO',
    title: 'Mystery Barge GULFSTREAM 150km Transboundary Spill',
    locationName: 'Tobago & Caribbean Sea — Cove Eco-Industrial Sector',
    center: [11.148, -60.778],
    zoom: 10,
    status: 'Under Investigation',
    detectionDate: '2024-02-07 22:15 UTC',
    satelliteSensor: 'Sentinel-1A (SAR C-Band GRD)',
    orbitPass: 'Descending Pass #112',
    resolution: '10m Spatial Resolution (VV+VH)',
    slick: {
      id: 'SLICK-TOBAGO-01',
      name: 'BARGE-GULFSTREAM-150KM',
      areaKm2: 85.6,
      perimeterKm: 154.2,
      estimatedVolumeM3: 5500,
      estimatedVolumeBarrels: 34590,
      estimatedAgeHours: 42,
      confidence: 96.8,
      thicknessMicrons: 38.0,
      spillType: 'Heavy Fuel Oil Slurry (Bunker C)',
      isThick: true,
      bonnCode: 'BAOAC Code 5 (Continuous True Color / Heavy Sludge)',
      faySpreadingRegime: 'Gravitational-Viscous Ocean Advection',
      centroid: [11.148, -60.778],
      originPoint: [10.850, -60.950],
      originTimestamp: '2024-02-05 06:00 UTC',
      detectionTimestamp: '2024-02-07 22:15 UTC',
      coordinates: [
        [11.18, -60.72],
        [11.20, -60.80],
        [11.16, -60.92],
        [11.10, -61.05],
        [11.02, -61.18],
        [10.98, -61.12],
        [11.08, -60.85],
        [11.18, -60.72]
      ]
    },
    preprocessing: {
      sensor: 'Sentinel-1A C-Band SAR (IW Mode)',
      radiometricCalibrationFactorDb: -83.8,
      speckleFilterType: 'Refined Lee Filter (3x3 Kernel)',
      speckleSuppressionIndex: 0.951,
      cloudCoveragePercent: 0.0,
      opticalNdwiValidation: 0.89,
      resolutionMeters: 10.0,
      georeferencedCrs: 'EPSG:4326 (WGS 84)'
    },
    weathering: {
      evaporationPercent: 12.5,
      emulsificationWaterPercent: 62.0,
      dynamicViscosityCp: 680.0,
      remainingVolumeM3: 4812.0,
      weatheringEngine: 'NOAA PyGNOME & OpenDrift OpenOil'
    },
    metocean: {
      windSpeedKnots: 16.0,
      windDirectionDeg: 80, // ENE
      currentSpeedKnots: 1.35,
      currentDirectionDeg: 285, // WNW Caribbean Current
      leewayFactor: 0.034,
      seaSurfaceTempC: 27.8,
      waveHeightM: 1.8,
      currentModelSource: 'NOAA HYCOM Global 1/12° Analysis',
      windModelSource: 'ECMWF ERA5'
    },
    hindcastTrail: [
      { hoursOffset: 0, lat: 11.148, lon: -60.778, radiusKm: 1.5, timestamp: '07 Feb 22:15' },
      { hoursOffset: -12, lat: 11.080, lon: -60.820, radiusKm: 2.8, timestamp: '07 Feb 10:15' },
      { hoursOffset: -24, lat: 11.010, lon: -60.870, radiusKm: 4.1, timestamp: '06 Feb 22:15' },
      { hoursOffset: -36, lat: 10.920, lon: -60.910, radiusKm: 5.6, timestamp: '06 Feb 10:15' },
      { hoursOffset: -42, lat: 10.850, lon: -60.950, radiusKm: 6.8, timestamp: '05 Feb 06:00 (TOW LINE RUPTURE)' }
    ],
    forecastTrail: [
      { hoursOffset: 0, lat: 11.148, lon: -60.778, radiusKm: 1.5, timestamp: '07 Feb 22:15' },
      { hoursOffset: 12, lat: 11.220, lon: -61.100, radiusKm: 3.2, timestamp: '08 Feb 10:15' },
      { hoursOffset: 24, lat: 11.310, lon: -61.450, radiusKm: 5.4, timestamp: '08 Feb 22:15 (Grenada EEZ)' },
      { hoursOffset: 36, lat: 11.420, lon: -61.850, radiusKm: 8.0, timestamp: '09 Feb 10:15 (Bonaire Marine Park Alert)' }
    ],
    vessels: [
      {
        id: 'v-solocreed',
        name: 'Tug SOLO CREED / GULFSTREAM BARGE',
        mmsi: '375322000',
        imo: '7505994',
        callSign: 'J8B8',
        flag: 'Tanzania (TZ)',
        type: 'Tug / Unmanned Fuel Oil Barge',
        draughtM: 5.2,
        lengthM: 68,
        destination: 'ST. EUSTATIUS',
        riskScore: 97.5,
        proximityScore: 98.2,
        timeOverlapScore: 96.0,
        behaviorScore: 98.0,
        aisIntegrityScore: 97.0,
        minDistanceM: 120,
        timeDeltaMin: 8,
        hasSpeedAnomaly: true,
        hasAisBlackout: true,
        speedAnomalySummary: 'Towing speed dropped from 7.5 kn to 2.1 kn; complete AIS transponder blackout after towline rupture.',
        isCulprit: true,
        displayCategory: 'Speed Anomaly',
        badgeColor: 'red',
        speedProfile: [
          { time: '02:00', sog: 7.6, baseline: 7.5 },
          { time: '04:30', sog: 7.4, baseline: 7.5 },
          { time: '06:00', sog: 2.1, baseline: 7.5 },
          { time: '07:00', sog: 1.8, baseline: 7.5 },
          { time: '12:00', sog: 0.0, baseline: 7.5 }
        ],
        track: [
          { lat: 10.720, lon: -60.850, timestamp: '05 Feb 02:00', sog: 7.6, cog: 320 },
          { lat: 10.850, lon: -60.950, timestamp: '05 Feb 06:00', sog: 2.1, cog: 318 },
          { lat: 11.020, lon: -60.820, timestamp: '06 Feb 12:00', sog: 1.5, cog: 315 },
          { lat: 11.148, lon: -60.778, timestamp: '07 Feb 22:15', sog: 0.0, cog: 0 }
        ]
      }
    ],
    keyframes: [
      { id: 'kt-1', time: '05 Feb 06:00', type: 'speed_drop', label: 'Tug Solo Creed tow line rupture; Barge capsizes', severity: 'critical' },
      { id: 'kt-2', time: '06 Feb 14:00', type: 'ais_gap', label: 'Full AIS blackout recorded by Trinidad Coast Guard', severity: 'critical' },
      { id: 'kt-3', time: '07 Feb 22:15', type: 'satellite', label: 'Sentinel-1A SAR pass maps 150km continuous fuel slick', severity: 'info' }
    ]
  },
  {
    id: 'INC-REAL-VENTANILLA',
    title: 'MARE DORICUM / La Pampilla Terminal Crude Discharge',
    locationName: 'Peru — Callao / Ventanilla Marine Reserve',
    center: [-11.928, -77.162],
    zoom: 11,
    status: 'Dossier Prepared',
    detectionDate: '2022-01-16 11:40 UTC',
    satelliteSensor: 'Sentinel-1 SAR + Sentinel-2 L2A',
    orbitPass: 'Ascending Pass #034',
    resolution: '10m Spatial Resolution (VV+VH)',
    slick: {
      id: 'SLICK-PERU-01',
      name: 'MARE-DORICUM-CRUDE',
      areaKm2: 58.2,
      perimeterKm: 49.0,
      estimatedVolumeM3: 1890,
      estimatedVolumeBarrels: 11900,
      estimatedAgeHours: 22,
      confidence: 97.4,
      thicknessMicrons: 32.5,
      spillType: 'Crude Oil Discharge',
      isThick: true,
      bonnCode: 'BAOAC Code 4 (Discontinuous True Colour / Metallic)',
      faySpreadingRegime: 'Gravitational-Viscous Spreading Phase',
      centroid: [-11.928, -77.162],
      originPoint: [-11.932, -77.168],
      originTimestamp: '2022-01-15 22:30 UTC',
      detectionTimestamp: '2022-01-16 11:40 UTC',
      coordinates: [
        [-11.910, -77.140],
        [-11.890, -77.170],
        [-11.920, -77.200],
        [-11.960, -77.180],
        [-11.950, -77.145],
        [-11.910, -77.140]
      ]
    },
    preprocessing: {
      sensor: 'Sentinel-1 SAR + Sentinel-2 L2A',
      radiometricCalibrationFactorDb: -82.6,
      speckleFilterType: 'Refined Lee Filter (3x3 Kernel)',
      speckleSuppressionIndex: 0.938,
      cloudCoveragePercent: 5.4,
      opticalNdwiValidation: 0.91,
      resolutionMeters: 10.0,
      georeferencedCrs: 'EPSG:4326 (WGS 84)'
    },
    weathering: {
      evaporationPercent: 28.0,
      emulsificationWaterPercent: 48.0,
      dynamicViscosityCp: 290.0,
      remainingVolumeM3: 1360.8,
      weatheringEngine: 'NOAA PyGNOME & OpenDrift OpenOil'
    },
    metocean: {
      windSpeedKnots: 12.4,
      windDirectionDeg: 190, // S
      currentSpeedKnots: 1.1,
      currentDirectionDeg: 340, // NNW Humboldt Current
      leewayFactor: 0.033,
      seaSurfaceTempC: 19.2,
      waveHeightM: 2.4,
      currentModelSource: 'IMARPE / HYCOM Pacific Regional',
      windModelSource: 'ECMWF ERA5'
    },
    hindcastTrail: [
      { hoursOffset: 0, lat: -11.928, lon: -77.162, radiusKm: 0.9, timestamp: '16 Jan 11:40' },
      { hoursOffset: -8, lat: -11.930, lon: -77.165, radiusKm: 1.5, timestamp: '16 Jan 03:40' },
      { hoursOffset: -16, lat: -11.931, lon: -77.167, radiusKm: 2.2, timestamp: '15 Jan 19:40' },
      { hoursOffset: -22, lat: -11.932, lon: -77.168, radiusKm: 2.8, timestamp: '15 Jan 22:30 (MOORING RUPTURE)' }
    ],
    forecastTrail: [
      { hoursOffset: 0, lat: -11.928, lon: -77.162, radiusKm: 0.9, timestamp: '16 Jan 11:40' },
      { hoursOffset: 12, lat: -11.850, lon: -77.180, radiusKm: 2.1, timestamp: '16 Jan 23:40 (Ancón Marine Protected Area)' },
      { hoursOffset: 24, lat: -11.750, lon: -77.200, radiusKm: 3.8, timestamp: '17 Jan 11:40 (Chancay Fishing Bay)' }
    ],
    vessels: [
      {
        id: 'v-maredoricum',
        name: 'MARE DORICUM',
        mmsi: '247272900',
        imo: '9403487',
        callSign: 'IBDH',
        flag: 'Italy (IT)',
        type: 'Suezmax Crude Oil Tanker',
        draughtM: 15.6,
        lengthM: 274,
        destination: 'REPSOL LA PAMPILLA',
        riskScore: 98.4,
        proximityScore: 99.5,
        timeOverlapScore: 98.0,
        behaviorScore: 97.0,
        aisIntegrityScore: 98.5,
        minDistanceM: 80,
        timeDeltaMin: 0,
        hasSpeedAnomaly: true,
        hasAisBlackout: false,
        speedAnomalySummary: 'Mooring line rupture during discharge; sudden position drift of 420m away from terminal buoy.',
        isCulprit: true,
        displayCategory: 'Speed Anomaly',
        badgeColor: 'red',
        speedProfile: [
          { time: '18:00', sog: 0.1, baseline: 0.0 },
          { time: '21:00', sog: 0.1, baseline: 0.0 },
          { time: '22:30', sog: 1.4, baseline: 0.0 },
          { time: '23:30', sog: 0.8, baseline: 0.0 },
          { time: '04:00', sog: 0.2, baseline: 0.0 }
        ],
        track: [
          { lat: -11.932, lon: -77.168, timestamp: '15 Jan 18:00', sog: 0.1, cog: 210 },
          { lat: -11.930, lon: -77.172, timestamp: '15 Jan 22:30', sog: 1.4, cog: 290 },
          { lat: -11.928, lon: -77.162, timestamp: '16 Jan 11:40', sog: 0.2, cog: 210 }
        ]
      }
    ],
    keyframes: [
      { id: 'kp-1', time: '15 Jan 22:30', type: 'origin', label: 'Tonga tsunami swell causes mooring line rupture at terminal', severity: 'critical' },
      { id: 'kp-2', time: '16 Jan 06:00', type: 'speed_drop', label: 'Submarine offloading hose disconnected', severity: 'critical' },
      { id: 'kp-3', time: '16 Jan 11:40', type: 'satellite', label: 'Sentinel-1 SAR passes over Callao, confirming 58 km² slick', severity: 'info' }
    ]
  },
  {
    id: 'INC-REAL-RUBYMAR',
    title: 'MV RUBYMAR Sinking & 29-Mile Red Sea Oil Slick',
    locationName: 'Red Sea — Bab-el-Mandeb Strait & Hanish Islands',
    center: [13.72, 42.75],
    zoom: 10,
    status: 'Critical Alert',
    detectionDate: '2024-02-28 07:30 UTC',
    satelliteSensor: 'Sentinel-2 MSI + Sentinel-1 SAR',
    orbitPass: 'Descending Pass #056',
    resolution: '10m Spatial Resolution (NDWI + SAR)',
    slick: {
      id: 'SLICK-RUBYMAR-01',
      name: 'MV-RUBYMAR-29MILE-SLICK',
      areaKm2: 64.5,
      perimeterKm: 78.4,
      estimatedVolumeM3: 2400,
      estimatedVolumeBarrels: 15100,
      estimatedAgeHours: 28,
      confidence: 95.1,
      thicknessMicrons: 28.0,
      spillType: 'Bunker Fuel Oil & Ammonium Phosphate Sludge',
      isThick: true,
      bonnCode: 'BAOAC Code 4 (Continuous True Color / Dark Metallic)',
      faySpreadingRegime: 'Gravitational-Viscous Spreading Phase',
      centroid: [13.72, 42.75],
      originPoint: [13.65, 42.82],
      originTimestamp: '2024-02-19 18:00 UTC',
      detectionTimestamp: '2024-02-28 07:30 UTC',
      coordinates: [
        [13.85, 42.60],
        [13.82, 42.68],
        [13.75, 42.74],
        [13.68, 42.80],
        [13.62, 42.85],
        [13.58, 42.82],
        [13.66, 42.72],
        [13.78, 42.62],
        [13.85, 42.60]
      ]
    },
    preprocessing: {
      sensor: 'Sentinel-2 MSI + Sentinel-1 SAR',
      radiometricCalibrationFactorDb: -83.5,
      speckleFilterType: 'Refined Lee Filter (3x3 Kernel)',
      speckleSuppressionIndex: 0.945,
      cloudCoveragePercent: 1.8,
      opticalNdwiValidation: 0.92,
      resolutionMeters: 10.0,
      georeferencedCrs: 'EPSG:4326 (WGS 84)'
    },
    weathering: {
      evaporationPercent: 32.0,
      emulsificationWaterPercent: 41.0,
      dynamicViscosityCp: 210.0,
      remainingVolumeM3: 1632.0,
      weatheringEngine: 'NOAA PyGNOME & OpenDrift OpenOil'
    },
    metocean: {
      windSpeedKnots: 15.2,
      windDirectionDeg: 140, // SE
      currentSpeedKnots: 0.9,
      currentDirectionDeg: 325, // NW Red Sea Current
      leewayFactor: 0.032,
      seaSurfaceTempC: 28.5,
      waveHeightM: 1.4,
      currentModelSource: 'Red Sea Operational Oceanography Center',
      windModelSource: 'ECMWF ERA5'
    },
    hindcastTrail: [
      { hoursOffset: 0, lat: 13.72, lon: 42.75, radiusKm: 1.1, timestamp: '28 Feb 07:30' },
      { hoursOffset: -8, lat: 13.70, lon: 42.77, radiusKm: 1.8, timestamp: '27 Feb 23:30' },
      { hoursOffset: -16, lat: 13.68, lon: 42.79, radiusKm: 2.7, timestamp: '27 Feb 15:30' },
      { hoursOffset: -28, lat: 13.65, lon: 42.82, radiusKm: 3.9, timestamp: '19 Feb 18:00 (MISSILE STRIKE)' }
    ],
    forecastTrail: [
      { hoursOffset: 0, lat: 13.72, lon: 42.75, radiusKm: 1.1, timestamp: '28 Feb 07:30' },
      { hoursOffset: 12, lat: 13.80, lon: 42.68, radiusKm: 2.4, timestamp: '28 Feb 19:30' },
      { hoursOffset: 24, lat: 13.92, lon: 42.58, radiusKm: 4.2, timestamp: '29 Feb 07:30 (Hanish Islands Coral Habitats)' }
    ],
    vessels: [
      {
        id: 'v-rubymar',
        name: 'MV RUBYMAR',
        mmsi: '312168000',
        imo: '9138898',
        callSign: 'V3TK3',
        flag: 'Belize (BZ)',
        type: 'Handymax Bulk Carrier',
        draughtM: 10.4,
        lengthM: 171,
        destination: 'VARNA, BULGARIA',
        riskScore: 99.0,
        proximityScore: 99.5,
        timeOverlapScore: 99.0,
        behaviorScore: 99.0,
        aisIntegrityScore: 98.0,
        minDistanceM: 50,
        timeDeltaMin: 0,
        hasSpeedAnomaly: true,
        hasAisBlackout: true,
        speedAnomalySummary: 'Missile impact in engine room; abandoned vessel drifting northwest while discharging bunker fuel.',
        isCulprit: true,
        displayCategory: 'Speed Anomaly',
        badgeColor: 'red',
        speedProfile: [
          { time: '16:00', sog: 12.4, baseline: 12.0 },
          { time: '18:00', sog: 0.8, baseline: 12.0 },
          { time: '20:00', sog: 0.4, baseline: 12.0 },
          { time: '04:00', sog: 0.3, baseline: 12.0 }
        ],
        track: [
          { lat: 13.55, lon: 42.95, timestamp: '19 Feb 16:00', sog: 12.4, cog: 325 },
          { lat: 13.65, lon: 42.82, timestamp: '19 Feb 18:00', sog: 0.8, cog: 320 },
          { lat: 13.72, lon: 42.75, timestamp: '28 Feb 07:30', sog: 0.3, cog: 320 }
        ]
      }
    ],
    keyframes: [
      { id: 'kr-1', time: '19 Feb 18:00', type: 'origin', label: 'Missile strike in engine room; Crew evacuated', severity: 'critical' },
      { id: 'kr-2', time: '21 Feb 12:00', type: 'ais_gap', label: 'Drifting uncrewed vessel begins leaking fuel & fertilizer', severity: 'critical' },
      { id: 'kr-3', time: '28 Feb 07:30', type: 'satellite', label: 'Sentinel-2 MSI captures 29-mile continuous sheen', severity: 'info' }
    ]
  },
  {
    id: 'INC-MALACCA-2024-03',
    title: 'SPILL-STRAIT-03 (One Fathom Bank West TSS)',
    locationName: 'Strait of Malacca — TSS Traffic Separation Scheme',
    center: [2.88, 101.02],
    zoom: 10,
    status: 'Under Investigation',
    detectionDate: '2024-10-14 06:15 UTC',
    satelliteSensor: 'Sentinel-1A (SAR C-Band GRD)',
    orbitPass: 'Descending Pass #089',
    resolution: '10m Spatial Resolution',
    slick: {
      id: 'SLICK-MAL-03',
      name: 'SPILL-STRAIT-03',
      areaKm2: 26.4,
      perimeterKm: 24.2,
      estimatedVolumeM3: 680,
      estimatedVolumeBarrels: 4277,
      estimatedAgeHours: 19,
      confidence: 91.0,
      thicknessMicrons: 18.4,
      spillType: 'Thick Mineral Oil Discharge',
      isThick: true,
      bonnCode: 'BAOAC Code 3 (Metallic / True Color)',
      faySpreadingRegime: 'Gravity-Viscous Spreading Phase',
      centroid: [2.88, 101.02],
      originPoint: [2.98, 100.86],
      originTimestamp: '2024-10-13 11:15 UTC',
      detectionTimestamp: '2024-10-14 06:15 UTC',
      coordinates: [
        [2.92, 100.95],
        [2.94, 101.05],
        [2.89, 101.12],
        [2.83, 101.06],
        [2.85, 100.94],
        [2.92, 100.95]
      ]
    },
    preprocessing: {
      sensor: 'Sentinel-1A C-Band SAR (IW Mode)',
      radiometricCalibrationFactorDb: -82.9,
      speckleFilterType: 'Refined Lee Filter (3x3 Kernel)',
      speckleSuppressionIndex: 0.925,
      cloudCoveragePercent: 4.2,
      opticalNdwiValidation: 0.81,
      resolutionMeters: 10.0,
      georeferencedCrs: 'EPSG:4326 (WGS 84)'
    },
    weathering: {
      evaporationPercent: 31.2,
      emulsificationWaterPercent: 36.5,
      dynamicViscosityCp: 142.0,
      remainingVolumeM3: 468.0,
      weatheringEngine: 'NOAA PyGNOME & OpenDrift OpenOil'
    },
    metocean: {
      windSpeedKnots: 8.5,
      windDirectionDeg: 220, // SW Monsoon
      currentSpeedKnots: 1.4,
      currentDirectionDeg: 310, // NW Tidal current
      leewayFactor: 0.030,
      seaSurfaceTempC: 29.2,
      waveHeightM: 0.6,
      currentModelSource: 'INCOIS / CMEMS Regional Indo-Pacific',
      windModelSource: 'ECMWF ERA5'
    },
    hindcastTrail: [
      { hoursOffset: 0, lat: 2.88, lon: 101.02, radiusKm: 0.8, timestamp: '14 Oct 06:15' },
      { hoursOffset: -6, lat: 2.91, lon: 100.97, radiusKm: 1.4, timestamp: '14 Oct 00:15' },
      { hoursOffset: -12, lat: 2.94, lon: 100.92, radiusKm: 2.0, timestamp: '13 Oct 18:15' },
      { hoursOffset: -19, lat: 2.98, lon: 100.86, radiusKm: 3.1, timestamp: '13 Oct 11:15 (ORIGIN)' }
    ],
    forecastTrail: [
      { hoursOffset: 0, lat: 2.88, lon: 101.02, radiusKm: 0.8, timestamp: '14 Oct 06:15' },
      { hoursOffset: 12, lat: 2.84, lon: 101.09, radiusKm: 1.8, timestamp: '14 Oct 18:15' },
      { hoursOffset: 24, lat: 2.79, lon: 101.18, radiusKm: 2.9, timestamp: '15 Oct 06:15 (Klang Mangrove Zone)' }
    ],
    vessels: [
      {
        id: 'vm-001',
        name: 'CHEM ORION',
        mmsi: '538006124',
        imo: '9384521',
        callSign: 'V7XQ2',
        flag: 'Marshall Islands (MH)',
        type: 'Chemical Tanker',
        draughtM: 9.8,
        lengthM: 165,
        destination: 'SINGAPORE',
        riskScore: 89.4,
        proximityScore: 94.0,
        timeOverlapScore: 92.0,
        behaviorScore: 86.0,
        aisIntegrityScore: 85.5,
        minDistanceM: 410,
        timeDeltaMin: 18,
        hasSpeedAnomaly: true,
        hasAisBlackout: true,
        speedAnomalySummary: 'Tank washing signature: Sudden zig-zag course change outside TSS with speed drop from 12.8 kn to 4.2 kn.',
        isCulprit: true,
        speedProfile: [
          { time: '08:00', sog: 12.8, baseline: 13.0 },
          { time: '10:30', sog: 12.6, baseline: 13.0 },
          { time: '11:15', sog: 4.2, baseline: 13.0 },
          { time: '12:00', sog: 4.5, baseline: 13.0 },
          { time: '13:30', sog: 12.5, baseline: 13.0 }
        ],
        track: [
          { lat: 3.08, lon: 100.72, timestamp: '13 Oct 08:00', sog: 12.8, cog: 125 },
          { lat: 2.982, lon: 100.862, timestamp: '13 Oct 11:15', sog: 4.2, cog: 128 },
          { lat: 2.86, lon: 101.04, timestamp: '13 Oct 15:00', sog: 12.5, cog: 126 }
        ]
      }
    ],
    keyframes: [
      { id: 'km-1', time: '13 Oct 11:15', type: 'origin', label: 'Suspected chemical wash discharge window', severity: 'critical' },
      { id: 'km-2', time: '14 Oct 06:15', type: 'satellite', label: 'Sentinel-1A SAR Acquisition', severity: 'info' }
    ]
  }
];
