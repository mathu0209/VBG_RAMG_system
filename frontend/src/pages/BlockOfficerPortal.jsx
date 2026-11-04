import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertOctagon, FileText, ArrowRight, Activity, Users, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

import { LiveLocationHeader } from '../components/shared/LiveLocationHeader';

export const BlockOfficerPortal = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, lang } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <LiveLocationHeader 
        title="Block Officer Development Portal" 
        subtitle="District & Panchayat Worksite Oversight, Audits & Approvals" 
        showLogout={true} 
      />
      
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 w-full">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center font-black text-xl text-cyan-400 shadow-lg">
              BO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{user?.fullName || 'Block Development Officer'}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] border border-cyan-500/30">
                  Block Officer (வட்டார அதிகாரி)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Officer ID: BDO-TN-401 • Thiruvallur Block • Thiruvallur District
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/work-progress')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              Inspect Work Progress →
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/60 text-slate-200 hover:text-rose-400 text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out / Login</span>
            </button>
          </div>
        </div>

        {/* Block Officer Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Active Worksites</div>
            <div className="text-2xl font-black text-white">45 Projects</div>
            <div className="text-[10px] text-emerald-400">12 Panchayats Covered</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Workers Registered</div>
            <div className="text-2xl font-black text-emerald-400">1,248 Workers</div>
            <div className="text-[10px] text-slate-400">Today Logged: 1,120</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Pending Approvals</div>
            <div className="text-2xl font-black text-amber-400">8 Muster Rolls</div>
            <div className="text-[10px] text-amber-400 font-semibold">Action Required</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Flagged Audit Alerts</div>
            <div className="text-2xl font-black text-rose-400">3 Alerts</div>
            <div className="text-[10px] text-rose-400 font-semibold">Geofence Mismatch</div>
          </div>

        </div>

      </div>
    </div>
  );
};
