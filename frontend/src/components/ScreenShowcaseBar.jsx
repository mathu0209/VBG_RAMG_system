import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Monitor, Grid, ChevronDown, ChevronUp, Globe, Shield, Landmark, HardHat, User, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './shared/NotificationBell';

export const SCREENS = [
  { id: '1', path: '/login', label: '1. Login Portal', role: null, badge: 'Login' },
  { id: '3', path: '/', label: '2. State Admin Portal', role: 'ADMIN', badge: 'Admin' },
  { id: '2', path: '/worker-dashboard', label: '3. Supervisor Portal', role: 'SUPERVISOR', badge: 'Supervisor' },
  { id: '10', path: '/block-officer-portal', label: '4. Block Officer Portal', role: 'BLOCK_OFFICER', badge: 'Block Officer' },
  { id: '11', path: '/worker-portal', label: '5. Rural Worker Portal', role: 'WORKER', badge: 'Worker' },
  { id: '4', path: '/registration', label: '6. Worker Registration', role: 'ADMIN', badge: 'Registration' },
  { id: '5', path: '/face-capture', label: '7. Face Verification', role: 'SUPERVISOR', badge: 'Biometrics' },
  { id: '6', path: '/mark-attendance', label: '8. Site Attendance', role: 'SUPERVISOR', badge: 'GPS/Attendance' },
  { id: '7', path: '/worksite-photo', label: '9. Worksite Geotag', role: 'SUPERVISOR', badge: 'Geotag' },
  { id: '8', path: '/work-progress', label: '10. Work Inspection', role: 'ADMIN', badge: 'Progress' },
  { id: '9', path: '/ai-fraud', label: '11. AI Fraud Radar', role: 'ADMIN', badge: 'AI Audit' },
];

export const ScreenShowcaseBar = ({ onToggleGridView, isGridView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { login, user } = useAuth();

  const handleScreenClick = (screen) => {
    if (isGridView) onToggleGridView();

    // Auto-login session for target portal role if role is defined
    if (screen.role) {
      login({
        id: Date.now(),
        username: `${screen.role.toLowerCase()}_official`,
        fullName: screen.role === 'ADMIN' ? 'Dr. M. Ramanathan (State Admin)' : screen.role === 'SUPERVISOR' ? 'Site Supervisor' : screen.role === 'BLOCK_OFFICER' ? 'K. Sundaram (Block Officer)' : 'Rural Worker',
        email: `${screen.role.toLowerCase()}@vbgramg.tn.gov.in`,
        role: screen.role,
        district: 'Thiruvallur',
        village: 'Poondi'
      }, `jwt-token-${screen.role.toLowerCase()}`);
    }

    navigate(screen.path);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-2 sticky top-0 z-50 shadow-2xl font-sans">
      <div className="flex items-center justify-between flex-wrap gap-2">
        
        {/* Title Branding */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
          <span className="text-xs font-black tracking-wider text-emerald-400 uppercase truncate max-w-xs md:max-w-md">
            {t('shortTitle') || 'VB–G RAM G SMART SYSTEM'}
          </span>
          {user && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-bold text-cyan-300">
              Active: {user.role}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <NotificationBell />

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-200 font-bold outline-none cursor-pointer text-xs"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Grid View Toggle Button */}
          <button
            onClick={onToggleGridView}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
              isGridView
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            {isGridView ? 'Single View' : '9-Screen Grid'}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white"
            title="Toggle Bar"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1 flex items-center gap-1.5 scrollbar-none">
          {SCREENS.map((screen) => {
            const isActive = location.pathname === screen.path && !isGridView;

            return (
              <button
                key={screen.id}
                onClick={() => handleScreenClick(screen)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3 text-indigo-400" />
                <span>{screen.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
