import React, { useState, useRef } from 'react';
import { 
  Ship, 
  FileCheck, 
  ShieldAlert,
  Database,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  SlidersHorizontal,
  Upload
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { NauticalMap } from '../components/map/NauticalMap';
import { SpeedAnomalyChart } from '../components/charts/SpeedAnomalyChart';
import { VesselInspectModal } from '../components/common/VesselInspectModal';
import { api } from '../services/api';

export const AttributionPage: React.FC = () => {
  const { 
    activeIncident, 
    selectedVessel, 
    setSelectedVessel, 
    setActivePage,
    isAnalyzing,
    runFullPipeline,
    setIsVesselModalOpen,
    exportCSV,
    showToast
  } = useIncident();

  const [vesselFilter, setVesselFilter] = useState<'all' | 'tanker' | 'cargo'>('all');
  const [spatialRadius, setSpatialRadius] = useState(25);
  const [temporalHours, setTemporalHours] = useState(4);
  const [isUploadingAIS, setIsUploadingAIS] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentVessel = selectedVessel || activeIncident.vessels[0];

  const filteredVessels = activeIncident.vessels.filter((v) => {
    if (vesselFilter === 'tanker') return v.type.toLowerCase().includes('tanker');
    if (vesselFilter === 'cargo') return v.type.toLowerCase().includes('cargo') || v.type.toLowerCase().includes('carrier');
    return true;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAIS(true);
    showToast(`Uploading and parsing ${file.name} into DuckDB...`);
    try {
      const res = await api.uploadAisCsv(file);
      showToast(`✓ Ingested ${res.records_ingested} real AIS records (${res.unique_vessels_in_db} vessels in DuckDB)`);
      runFullPipeline();
    } catch (err) {
      console.error(err);
      showToast("Error uploading AIS CSV. Please ensure standard CSV columns.");
    } finally {
      setIsUploadingAIS(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExportAIS = () => {
    const csvRows = activeIncident.vessels.map((v) => ({
      MMSI: v.mmsi,
      VesselName: v.name,
      IMO: v.imo,
      Flag: v.flag,
      Type: v.type,
      RiskScore: v.riskScore,
      MinDistance_m: v.minDistanceM,
      SpeedAnomaly: v.hasSpeedAnomaly ? 'YES' : 'NO',
      AISBlackout: v.hasAisBlackout ? 'YES' : 'NO',
      IsCulprit: v.isCulprit ? 'PRIMARY_SUSPECT' : 'CLEARED'
    }));

    exportCSV(csvRows, `ais_attribution_audit_${activeIncident.id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Page Header */}
      <div className="bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AIS Vessel Traffic Correlation & Attribution Engine
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300">
              High-Confidence Match Identified
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Querying Marine Cadastre historical AIS pings within the hindcast origin spatio-temporal corridor
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAIS}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploadingAIS ? 'Ingesting CSV...' : 'Upload Real AIS CSV'}</span>
          </button>

          <button
            onClick={handleExportAIS}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export AIS Audit CSV</span>
          </button>

          <button
            onClick={runFullPipeline}
            disabled={isAnalyzing}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 transition"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Correlating DuckDB...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>Correlate DuckDB AIS</span>
              </>
            )}
          </button>
        </div>
      </div>


      {/* Main Grid: Suspect Leaderboard + Map + Vessel Forensic Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Suspect Ranking Leaderboard (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Spatio-Temporal Corridor Filter Sliders */}
          <div className="bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
                <span>Spatio-Temporal Corridor Filter</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                DuckDB GIS
              </span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Spatial Search Radius</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">{spatialRadius} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={spatialRadius}
                  onChange={(e) => {
                    setSpatialRadius(Number(e.target.value));
                    showToast(`Search corridor radius: ${e.target.value} km`);
                  }}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Temporal Search Window</span>
                  <span className="font-mono font-bold text-amber-500">±{temporalHours} hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={temporalHours}
                  onChange={(e) => {
                    setTemporalHours(Number(e.target.value));
                    showToast(`Temporal corridor window: ±${e.target.value} hours`);
                  }}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col h-full">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                <span>Suspect Attribution</span>
              </h3>
              
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                <button
                  onClick={() => setVesselFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                    vesselFilter === 'all' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-cyan-400' : 'text-slate-500'
                  }`}
                >
                  All ({activeIncident.vessels.length})
                </button>
                <button
                  onClick={() => setVesselFilter('tanker')}
                  className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                    vesselFilter === 'tanker' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-cyan-400' : 'text-slate-500'
                  }`}
                >
                  Tankers
                </button>
                <button
                  onClick={() => setVesselFilter('cargo')}
                  className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                    vesselFilter === 'cargo' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-cyan-400' : 'text-slate-500'
                  }`}
                >
                  Cargo
                </button>
              </div>
            </div>

            {/* Suspect Leaderboard List */}
            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
              {filteredVessels.map((vessel, idx) => {
                const isSelected = currentVessel.id === vessel.id;
                return (
                  <div
                    key={vessel.id}
                    onClick={() => setSelectedVessel(vessel)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 dark:border-cyan-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {vessel.name}
                          </span>
                          {vessel.isCulprit && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-600 text-white">
                              Culprit
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {vessel.type} • {vessel.flag}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-sm font-extrabold font-mono ${
                            vessel.riskScore > 80
                              ? 'text-red-600 dark:text-red-400'
                              : vessel.riskScore > 50
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {vessel.riskScore}%
                        </div>
                        <div className="text-[10px] text-slate-400">Risk Score</div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">
                        CPA Distance: <b>{(vessel.minDistanceM / 1000).toFixed(1)} km</b>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVessel(vessel);
                          setIsVesselModalOpen(true);
                        }}
                        type="button"
                        className="text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Dossier</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Column: Interactive Nautical Map (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col h-[650px]">
          <NauticalMap />
        </div>

        {/* Right Column: Deep Vessel Forensic Inspector (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Forensic Inspector</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                IMO: {currentVessel.imo}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{currentVessel.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  MMSI: {currentVessel.mmsi} | CallSign: {currentVessel.callSign}
                </div>
              </div>

              {/* Anomaly Summary Callout */}
              <div
                className={`p-2.5 rounded-lg border text-[11px] ${
                  currentVessel.hasSpeedAnomaly || currentVessel.hasAisBlackout
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-800 dark:text-red-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold mb-0.5">MARPOL Violation Telemetry:</div>
                <div>{currentVessel.speedAnomalySummary}</div>
              </div>

              {/* Speed Profile Chart Component */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                  Speed Over Ground (SOG) Anomaly Deceleration
                </div>
                <SpeedAnomalyChart 
                  data={currentVessel.speedProfile} 
                  vesselName={currentVessel.name}
                  hasAnomaly={currentVessel.hasSpeedAnomaly}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setIsVesselModalOpen(true)}
                  type="button"
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full AIS Forensic Dossier</span>
                </button>

                <button
                  onClick={() => setActivePage('reports')}
                  type="button"
                  className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition text-xs shadow-sm"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Issue PSC Detention Warrant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VesselInspectModal />
    </div>
  );
};
