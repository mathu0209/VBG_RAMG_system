import React, { useState } from 'react';
import { MOCK_DATA } from '../services/api';
import { GisMap } from '../components/GisMap';
import { Briefcase, Plus, MapPin, CheckCircle, Clock, X } from 'lucide-react';

export const ProjectManagementPage = () => {
  const [projects, setProjects] = useState(MOCK_DATA.projects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '',
    workType: 'WATER_CONSERVATION',
    estimatedCost: '350000',
    sanctionedDays: '90',
    latitude: '12.9642',
    longitude: '77.7815',
    villageName: 'Muthsandra'
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      projectCode: `PRJ-KA-HOS-00${projects.length + 1}`,
      title: newProject.title || 'New MGNREGS Work Site',
      workType: newProject.workType,
      estimatedCost: Number(newProject.estimatedCost),
      sanctionedDays: Number(newProject.sanctionedDays),
      status: 'APPROVED',
      latitude: Number(newProject.latitude),
      longitude: Number(newProject.longitude),
      villageName: newProject.villageName,
      completionProgress: 0
    };

    setProjects([created, ...projects]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">Project Management & GIS Work Sites</h2>
          <p className="text-xs text-slate-400">Sanction Work, Assign Supervisors & Track Geofenced Project Execution Progress</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Create New Work Project
        </button>
      </div>

      {/* Map Overview */}
      <div className="glass-card p-5 rounded-2xl space-y-3">
        <h3 className="text-base font-bold text-slate-100">Interactive GIS Project Map</h3>
        <GisMap projects={projects} height="320px" />
      </div>

      {/* Project Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div key={proj.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400">{proj.projectCode}</span>
                <span className="badge badge-success">{proj.status}</span>
              </div>
              <h4 className="font-bold text-slate-100 text-sm">{proj.title}</h4>
              <div className="text-xs text-slate-400">Type: {proj.workType}</div>
              <div className="text-xs text-slate-400">Est. Budget: ₹{proj.estimatedCost?.toLocaleString('en-IN')}</div>
              <div className="text-xs text-slate-400">Sanctioned Days: {proj.sanctionedDays} Days</div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-400">Execution Progress</span>
                <span className="text-emerald-400 font-bold">{proj.completionProgress || 45}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${proj.completionProgress || 45}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-card p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-100">Create & GIS Pin New Project</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Village Pond Deepening & Water Conservation"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Work Type</label>
                  <select
                    value={newProject.workType}
                    onChange={(e) => setNewProject({...newProject, workType: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                  >
                    <option value="WATER_CONSERVATION">Water Conservation</option>
                    <option value="ROAD_CONSTRUCTION">Rural Connectivity / Road</option>
                    <option value="DREDGING">Canal Dredging</option>
                    <option value="PLANTATION">Afforestation / Plantation</option>
                    <option value="LAND_DEVELOPMENT">Land Levelling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProject.estimatedCost}
                    onChange={(e) => setNewProject({...newProject, estimatedCost: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Latitude (N)</label>
                  <input
                    type="text"
                    required
                    value={newProject.latitude}
                    onChange={(e) => setNewProject({...newProject, latitude: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Longitude (E)</label>
                  <input
                    type="text"
                    required
                    value={newProject.longitude}
                    onChange={(e) => setNewProject({...newProject, longitude: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save & Sanction Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
