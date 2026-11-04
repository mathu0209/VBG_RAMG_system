import React, { useState } from 'react';
import { MOCK_DATA } from '../services/api';
import { GisMap } from '../components/GisMap';
import { MapPin, Layers, Filter } from 'lucide-react';

export const GisViewPage = () => {
  const [projects] = useState(MOCK_DATA.projects);
  const [selectedVillage, setSelectedVillage] = useState('ALL');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">GIS Interactive Spatial Dashboard</h2>
          <p className="text-xs text-slate-400">OpenStreetMap & Leaflet Geolocation Mapping for State → District → Panchayat → Worksites</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
          >
            <option value="ALL">All Villages (Hoskote Block)</option>
            <option value="MUT">Muthsandra Village</option>
            <option value="ANUG">Anugondanahalli</option>
          </select>
        </div>
      </div>

      {/* Fullscreen Map container */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
        <GisMap projects={projects} height="600px" />
      </div>
    </div>
  );
};
