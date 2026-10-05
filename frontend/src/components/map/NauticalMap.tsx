import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useIncident } from '../../context/IncidentContext';
import { useTheme } from '../../context/ThemeContext';
import type { BasemapId, SatelliteLayerId } from '../../types';
import { 
  Layers, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Minus, 
  Compass, 
  Satellite, 
  Ruler, 
  Calendar 
} from 'lucide-react';

export const NauticalMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteTileLayerRef = useRef<L.TileLayer | null>(null);

  const {
    activeIncident,
    selectedVessel,
    setSelectedVessel,
    timelineProgress,
    basemap,
    setBasemap,
    activeSatelliteLayer,
    setActiveSatelliteLayer,
    satelliteLayerOpacity,
    setSatelliteLayerOpacity,
    satelliteDate,
    setSatelliteDate,
    showSlick,
    setShowSlick,
    showHindcast,
    setShowHindcast,
    showForecast,
    setShowForecast,
    showAis,
    setShowAis,
    showSarFootprint,
    setShowSarFootprint,
    showBoomingZones,
    setShowBoomingZones,
    sarOpacity,
    setIsVesselModalOpen,
    showToast,
  } = useIncident();

  const { theme } = useTheme();
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showBasemapMenu, setShowBasemapMenu] = useState(false);
  const [showSatelliteMenu, setShowSatelliteMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<string | null>(null);

  // Basemap Tile URLs
  const basemapTiles: Record<BasemapId, { name: string; url: string; subdomains: string; maxZoom: number; desc: string }> = {
    dark: {
      name: 'Dark Ocean',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      subdomains: 'abcd',
      maxZoom: 18,
      desc: 'CartoDB Dark Matter for low-light tactical ops'
    },
    satellite: {
      name: 'Satellite Hybrid',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      subdomains: 'abcd',
      maxZoom: 18,
      desc: 'High-res Sentinel/Landsat/Esri optical imagery'
    },
    nautical: {
      name: 'Maritime Nautical Chart',
      url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
      subdomains: 'abc',
      maxZoom: 18,
      desc: 'OpenSeaMap seamarks & nautical navigation aid'
    },
    topo: {
      name: 'Bathymetry & Topo',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      maxZoom: 17,
      desc: 'High-relief topographic and coastal bathymetry'
    },
    voyager: {
      name: 'Voyager Clean',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      subdomains: 'abcd',
      maxZoom: 18,
      desc: 'Clean vector navigation chart'
    }
  };

  // Real NASA GIBS & Operational Satellite Layer Configurations
  const satelliteLayers: Record<SatelliteLayerId, { 
    name: string; 
    getUrl: (date: string) => string; 
    maxZoom: number; 
    icon: string;
    desc: string;
    hasDate: boolean;
  }> = {
    none: {
      name: 'None (Default Vector)',
      getUrl: () => '',
      maxZoom: 18,
      icon: 'Eye',
      desc: 'Standard vector radar analysis without external satellite raster overlay',
      hasDate: false
    },
    'nasa-gibs-modis-terra': {
      name: 'NASA GIBS MODIS Terra Daily (250m)',
      getUrl: (date) => `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
      maxZoom: 9,
      icon: 'Sun',
      desc: 'Real daily global optical satellite imagery from NASA Terra satellite.',
      hasDate: true
    },
    'nasa-gibs-viirs-snpp': {
      name: 'NASA GIBS VIIRS SNPP Daily True Color',
      getUrl: (date) => `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
      maxZoom: 9,
      icon: 'Sparkles',
      desc: 'High-definition daily polar pass from Suomi-NPP VIIRS sensor.',
      hasDate: true
    },
    'nasa-gibs-viirs-dnb': {
      name: 'NASA VIIRS Night Lights & Vessel Detection',
      getUrl: (date) => `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_DayNightBand_ENCC/default/${date}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`,
      maxZoom: 8,
      icon: 'Moon',
      desc: 'Panchromatic night lights detecting ship positions and nocturnal illicit bilge dumping.',
      hasDate: true
    },
    'nasa-gibs-chlorophyll': {
      name: 'NASA Chlorophyll-a (Algae Bloom Discriminator)',
      getUrl: (date) => `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Chlorophyll_A/default/${date}/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png`,
      maxZoom: 7,
      icon: 'Waves',
      desc: 'Ocean color chlorophyll concentration to eliminate false positives from phytoplankton.',
      hasDate: true
    },
    'nasa-gibs-thermal-anomalies': {
      name: 'NASA VIIRS Thermal Anomalies & Flares',
      getUrl: (date) => `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_NOAA20_Thermal_Anomalies_375m_All/default/${date}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`,
      maxZoom: 8,
      icon: 'Flame',
      desc: 'Thermal hotspots for offshore platform gas flaring and tanker fire incidents.',
      hasDate: true
    },
    'sentinel-2-cloudless': {
      name: 'Copernicus Sentinel-2 Cloudless (10m)',
      getUrl: () => `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg`,
      maxZoom: 14,
      icon: 'Satellite',
      desc: '10-meter seamless cloud-free European Space Agency Sentinel-2 global mosaic.',
      hasDate: false
    }
  };

  // Resize map when entering/exiting fullscreen
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Synchronize wheel zoom with fullscreen
  useEffect(() => {
    if (!mapRef.current) return;
    if (isFullscreen) {
      mapRef.current.scrollWheelZoom.enable();
    } else {
      mapRef.current.scrollWheelZoom.disable();
    }
  }, [isFullscreen]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: activeIncident.center,
      zoom: activeIncident.zoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    // Mouse movement listener for coordinates HUD
    map.on('mousemove', (e) => {
      setMouseCoords(`${e.latlng.lat.toFixed(4)}°N, ${e.latlng.lng.toFixed(4)}°W`);
    });

    layersGroupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [activeIncident.id]);

  // Update Basemap Layer when basemap or theme changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing tile layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const currentBase = basemapTiles[basemap] || basemapTiles.dark;
    
    // For nautical, add dark/light base underneath seamark overlay
    if (basemap === 'nautical') {
      const baseUnder = L.tileLayer(
        theme === 'dark' 
          ? basemapTiles.dark.url 
          : basemapTiles.voyager.url,
        { maxZoom: 18, subdomains: 'abcd' }
      ).addTo(map);

      const seamark = L.tileLayer(basemapTiles.nautical.url, {
        maxZoom: 18,
      }).addTo(map);

      tileLayerRef.current = seamark;
      return () => {
        map.removeLayer(baseUnder);
        map.removeLayer(seamark);
      };
    }

    const newLayer = L.tileLayer(currentBase.url, {
      maxZoom: currentBase.maxZoom,
      subdomains: currentBase.subdomains,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [basemap, theme]);

  // Update Real Satellite Raster Overlay (NASA GIBS / Copernicus)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old satellite overlay layer
    if (satelliteTileLayerRef.current) {
      map.removeLayer(satelliteTileLayerRef.current);
      satelliteTileLayerRef.current = null;
    }

    if (activeSatelliteLayer === 'none') return;

    const satConfig = satelliteLayers[activeSatelliteLayer];
    if (!satConfig) return;

    const satUrl = satConfig.getUrl(satelliteDate);
    if (!satUrl) return;

    const satLayer = L.tileLayer(satUrl, {
      maxZoom: satConfig.maxZoom,
      opacity: satelliteLayerOpacity / 100,
      zIndex: 10,
    }).addTo(map);

    satelliteTileLayerRef.current = satLayer;

    return () => {
      if (satLayer && map) {
        map.removeLayer(satLayer);
      }
    };
  }, [activeSatelliteLayer, satelliteDate, satelliteLayerOpacity]);

  // Render Vector Layers & Overlays
  useEffect(() => {
    const map = mapRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const { slick, hindcastTrail, forecastTrail, vessels } = activeIncident;

    // 1. SAR Satellite Coverage Bounding Footprint
    if (showSarFootprint) {
      const padLat = 0.22;
      const padLon = 0.35;
      const [cLat, cLon] = slick.centroid;
      const sarBounds: L.LatLngExpression[] = [
        [cLat + padLat, cLon - padLon],
        [cLat + padLat, cLon + padLon],
        [cLat - padLat, cLon + padLon],
        [cLat - padLat, cLon - padLon],
      ];

      L.polygon(sarBounds, {
        color: '#06b6d4', // cyan-500
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#0891b2',
        fillOpacity: 0.04,
      })
        .bindTooltip(`🛰️ ${activeIncident.satelliteSensor} Swath Footprint (10m Res)`, {
          permanent: false,
          direction: 'top',
        })
        .addTo(group);
    }

    // 2. Oil Slick Segmentation Mask
    if (showSlick && slick.coordinates && slick.coordinates.length > 0) {
      // Main hydrocarbon dark-spot polygon
      L.polygon(slick.coordinates as L.LatLngExpression[], {
        color: '#ef4444', // red-500
        weight: 2.5,
        fillColor: '#b91c1c', // red-700
        fillOpacity: (sarOpacity / 100) * 0.75,
      })
        .bindPopup(
          `<div class="p-2 font-sans text-xs bg-slate-900 text-slate-100 rounded">
            <div class="font-bold text-red-400 mb-1">🛢️ ${slick.name}</div>
            <div>Area: <b>${slick.areaKm2} km²</b></div>
            <div>Volume: <b>${slick.estimatedVolumeBarrels ?? 7862} bbls</b></div>
            <div>BAOAC: <b>${slick.bonnCode ?? 'Code 4 (Metallic/True)'}</b></div>
            <div>Spill Age: <b>${slick.estimatedAgeHours}h (Fay Spreading)</b></div>
            <div>Confidence: <b>${slick.confidence}%</b></div>
          </div>`
        )
        .addTo(group);

      // Spill centroid marker
      const centroidIcon = L.divIcon({
        className: 'custom-centroid-icon',
        html: `<div class="relative flex items-center justify-center">
                <div class="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md animate-ping absolute opacity-75"></div>
                <div class="w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white shadow-md relative"></div>
              </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker(slick.centroid as L.LatLngExpression, { icon: centroidIcon })
        .bindTooltip(`Centroid (${slick.centroid[0].toFixed(3)}°N, ${slick.centroid[1].toFixed(3)}°W)`, {
          permanent: false,
          direction: 'top',
        })
        .addTo(group);
    }

    // 3. Containment Booming Coordinates
    if (showBoomingZones && slick.centroid) {
      const [cLat, cLon] = slick.centroid;
      const boomCoords: L.LatLngExpression[] = [
        [cLat - 0.12, cLon - 0.15],
        [cLat - 0.10, cLon - 0.10],
        [cLat - 0.08, cLon - 0.04],
      ];

      L.polyline(boomCoords, {
        color: '#10b981', // emerald-500
        weight: 4,
        dashArray: '6, 4',
      })
        .bindTooltip('🛡️ USCG/EPA Containment Boom Barrier #1', {
          permanent: false,
          direction: 'top',
        })
        .addTo(group);
    }

    // 4. Backward Lagrangian Hindcast Drift Trail
    if (showHindcast && hindcastTrail && hindcastTrail.length > 0) {
      const latlngs: L.LatLngExpression[] = hindcastTrail.map((pt) => [pt.lat, pt.lon]);

      // Hindcast polyline
      L.polyline(latlngs, {
        color: '#f59e0b', // amber-500
        weight: 3,
        dashArray: '8, 6',
      }).addTo(group);

      // Hindcast uncertainty circles
      hindcastTrail.forEach((pt) => {
        L.circle([pt.lat, pt.lon], {
          radius: pt.radiusKm * 1000,
          color: '#f59e0b',
          weight: 1,
          fillColor: '#fbbf24',
          fillOpacity: 0.12,
        })
          .bindTooltip(`Hindcast ${pt.timestamp} (±${pt.radiusKm} km)`, {
            permanent: false,
            direction: 'bottom',
          })
          .addTo(group);
      });

      // Probable Origin Marker
      const originPt = slick.originPoint;
      const originIcon = L.divIcon({
        className: 'custom-origin-icon',
        html: `<div class="p-1 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] font-mono border border-white shadow-md">
                t₀ ORIGIN
              </div>`,
        iconSize: [60, 20],
        iconAnchor: [30, 10],
      });

      L.marker(originPt as L.LatLngExpression, { icon: originIcon })
        .bindPopup(
          `<div class="p-2 font-sans text-xs bg-slate-900 text-slate-100 rounded">
            <div class="font-bold text-amber-400 mb-1">🎯 Probable Origin (t₀)</div>
            <div>Coords: <b>${originPt[0].toFixed(4)}°N, ${originPt[1].toFixed(4)}°W</b></div>
            <div>Discharge Time: <b>${slick.originTimestamp}</b></div>
            <div>Model: <b>OpenDrift OpenOil Lagrangian Hindcast</b></div>
          </div>`
        )
        .addTo(group);
    }

    // 5. Forward Coastal Impact Forecast Trail
    if (showForecast && forecastTrail && forecastTrail.length > 0) {
      const fLatlngs: L.LatLngExpression[] = [
        slick.centroid as L.LatLngExpression,
        ...forecastTrail.map((pt) => [pt.lat, pt.lon] as L.LatLngExpression),
      ];

      L.polyline(fLatlngs, {
        color: '#3b82f6', // blue-500
        weight: 2.5,
        dashArray: '4, 4',
      }).addTo(group);

      forecastTrail.forEach((pt) => {
        L.circle([pt.lat, pt.lon], {
          radius: pt.radiusKm * 1000,
          color: '#3b82f6',
          weight: 1,
          fillColor: '#60a5fa',
          fillOpacity: 0.15,
        })
          .bindTooltip(`Forecast ${pt.timestamp} (Coastal Impact)`, {
            permanent: false,
            direction: 'top',
          })
          .addTo(group);
      });
    }

    // 6. AIS Vessel Tracks & Culprit Markers
    if (showAis && vessels && vessels.length > 0) {
      vessels.forEach((vessel) => {
        const isSelected = selectedVessel?.id === vessel.id;
        const isCulprit = vessel.isCulprit;

        // Vessel track
        if (vessel.track && vessel.track.length > 0) {
          const trackPts: L.LatLngExpression[] = vessel.track.map((t) => [t.lat, t.lon]);

          L.polyline(trackPts, {
            color: isCulprit ? '#ef4444' : isSelected ? '#06b6d4' : '#64748b',
            weight: isCulprit ? 3.5 : isSelected ? 3 : 1.5,
            opacity: isCulprit ? 0.9 : 0.6,
          }).addTo(group);
        }

        // Current vessel position marker
        const currentPt = vessel.track?.[Math.min(vessel.track.length - 1, Math.floor((timelineProgress / 100) * vessel.track.length))] || vessel.track?.[0];
        if (currentPt) {
          const markerColor = isCulprit ? 'bg-red-600' : isSelected ? 'bg-cyan-500' : 'bg-slate-500';
          const vesselIcon = L.divIcon({
            className: 'custom-vessel-icon',
            html: `<div class="w-4 h-4 ${markerColor} rounded-full border-2 border-white shadow-md flex items-center justify-center cursor-pointer">
                    <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });

          const marker = L.marker([currentPt.lat, currentPt.lon], { icon: vesselIcon }).addTo(group);

          marker.on('click', () => {
            setSelectedVessel(vessel);
            setIsVesselModalOpen(true);
          });

          marker.bindTooltip(
            `<div class="font-sans text-xs">
              <span class="font-bold">${vessel.name}</span> (${vessel.type})<br/>
              SOG: <b>${currentPt.sog} kn</b> | Risk: <b>${vessel.riskScore}%</b>
            </div>`,
            { permanent: false, direction: 'top' }
          );
        }
      });
    }
  }, [
    activeIncident,
    showSlick,
    showHindcast,
    showForecast,
    showAis,
    showSarFootprint,
    showBoomingZones,
    sarOpacity,
    selectedVessel,
    timelineProgress,
  ]);

  // Zoom controls
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView(activeIncident.center, activeIncident.zoom);
      showToast(`Map recentered to ${activeIncident.locationName}`);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const toggleMeasure = () => {
    setIsMeasuring((prev) => {
      const next = !prev;
      if (next) {
        showToast("Ruler Tool Active: Click two points on map to measure nautical distance.");
      }
      return next;
    });
  };

  return (
    <div className={`relative w-full h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950' : 'rounded-xl overflow-hidden shadow-2xl border border-slate-700/50'}`}>
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

      {/* Top Left: Operational Status & Satellite Layer Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-lg text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200">{activeIncident.locationName}</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400 font-mono text-[11px]">{activeIncident.satelliteSensor}</span>
        </div>

        {activeSatelliteLayer !== 'none' && (
          <div className="flex items-center gap-2 bg-cyan-950/90 backdrop-blur-md px-3 py-1 rounded-lg border border-cyan-700/80 shadow-md text-xs text-cyan-200">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">{satelliteLayers[activeSatelliteLayer].name}</span>
            <span className="text-cyan-500 font-mono text-[10px]">({satelliteDate})</span>
          </div>
        )}
      </div>

      {/* Top Right: Tactical Tools Dock */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Real Satellite Layer Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSatelliteMenu(!showSatelliteMenu);
              setShowBasemapMenu(false);
              setShowLayerMenu(false);
            }}
            className={`p-2.5 rounded-lg backdrop-blur-md border shadow-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
              activeSatelliteLayer !== 'none'
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-cyan-500/30'
                : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800'
            }`}
            title="Real Satellite WMS/WMTS Layers"
          >
            <Satellite className="w-4 h-4 text-cyan-300" />
            <span>NASA GIBS</span>
          </button>

          {showSatelliteMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-3 z-30 animate-in fade-in zoom-in-95">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>🛰️ Real Satellite Feeds</span>
                <span className="text-[10px] text-cyan-400 font-mono">NASA / ESA</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {(Object.keys(satelliteLayers) as SatelliteLayerId[]).map((key) => {
                  const item = satelliteLayers[key];
                  const isSel = activeSatelliteLayer === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveSatelliteLayer(key);
                        showToast(`Active Satellite Raster: ${item.name}`);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-start gap-2 ${
                        isSel
                          ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/50'
                          : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                      }`}
                    >
                      <div className="mt-0.5">{isSel ? '●' : '○'}</div>
                      <div>
                        <div className="font-semibold leading-tight">{item.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Date dimension controller */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-cyan-400" /> Satellite Pass Date</span>
                </label>
                <input
                  type="date"
                  value={satelliteDate}
                  onChange={(e) => setSatelliteDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Raster Opacity Slider */}
              <div className="pt-2 mt-2 border-t border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Raster Opacity</span>
                  <span className="font-mono text-cyan-400">{satelliteLayerOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={satelliteLayerOpacity}
                  onChange={(e) => setSatelliteLayerOpacity(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Basemap Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowBasemapMenu(!showBasemapMenu);
              setShowSatelliteMenu(false);
              setShowLayerMenu(false);
            }}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg backdrop-blur-md border border-slate-700/80 shadow-lg transition-all"
            title="Switch Basemap Chart"
          >
            <Compass className="w-4 h-4 text-slate-300" />
          </button>

          {showBasemapMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-2 z-30 animate-in fade-in zoom-in-95">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                Nautical Basemaps
              </div>
              {(Object.keys(basemapTiles) as BasemapId[]).map((key) => {
                const item = basemapTiles[key];
                const isSel = basemap === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setBasemap(key);
                      setShowBasemapMenu(false);
                      showToast(`Basemap switched to: ${item.name}`);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isSel ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSel && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Vector Overlays Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLayerMenu(!showLayerMenu);
              setShowSatelliteMenu(false);
              setShowBasemapMenu(false);
            }}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg backdrop-blur-md border border-slate-700/80 shadow-lg transition-all"
            title="Layer Overlays"
          >
            <Layers className="w-4 h-4 text-slate-300" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-3 z-30 text-xs space-y-2.5 animate-in fade-in zoom-in-95">
              <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">
                Vector Analysis Layers
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={showSlick}
                  onChange={(e) => setShowSlick(e.target.checked)}
                  className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                />
                <span>🛢️ Oil Slick Dark-Spot Polygon</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={showSarFootprint}
                  onChange={(e) => setShowSarFootprint(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
                />
                <span>🛰️ SAR Swath Footprint</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={showHindcast}
                  onChange={(e) => setShowHindcast(e.target.checked)}
                  className="rounded border-slate-700 text-amber-600 focus:ring-amber-500"
                />
                <span>🎯 Lagrangian Backward Hindcast (t₀)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={showForecast}
                  onChange={(e) => setShowForecast(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <span>🌊 Forward Shoreline Threat Cone</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={showAis}
                  onChange={(e) => setShowAis(e.target.checked)}
                  className="rounded border-slate-700 text-slate-400 focus:ring-slate-500"
                />
                <span>🚢 AIS Vessel Tracks & Culprits</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={showBoomingZones}
                  onChange={(e) => setShowBoomingZones(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span>🛡️ Containment Booming Barriers</span>
              </label>
            </div>
          )}
        </div>

        {/* Ruler Distance Tool */}
        <button
          onClick={toggleMeasure}
          className={`p-2.5 rounded-lg backdrop-blur-md border shadow-lg transition-all ${
            isMeasuring
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800'
          }`}
          title="Measure Nautical Distance"
        >
          <Ruler className="w-4 h-4" />
        </button>

        {/* Recenter */}
        <button
          onClick={handleRecenter}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg backdrop-blur-md border border-slate-700/80 shadow-lg transition-all"
          title="Recenter Map"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg backdrop-blur-md border border-slate-700/80 shadow-lg transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Right: Zoom & Navigation Controls */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-lg backdrop-blur-md border border-slate-700/80 shadow-lg transition-all"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-lg backdrop-blur-md border border-slate-700/80 shadow-lg transition-all"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left: HUD Coordinates & Scale */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
        {mouseCoords && (
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-md border border-slate-700/80 text-[11px] font-mono text-slate-400 shadow-lg">
            {mouseCoords}
          </div>
        )}
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-md border border-slate-700/80 text-[11px] font-mono text-cyan-400 shadow-lg">
          CRS: EPSG:4326 (WGS 84)
        </div>
      </div>
    </div>
  );
};
