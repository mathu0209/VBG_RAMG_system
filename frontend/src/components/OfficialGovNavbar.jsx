import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Globe, Clock, LogOut, Grid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { NotificationBell } from './shared/NotificationBell';

export const OfficialGovNavbar = ({ onToggleShowcase, isShowcaseOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const [timeStr, setTimeStr] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
                        ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTimeStr(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-2xl font-sans">
      
      {/* Top Banner Stripe */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-900 px-6 py-1.5 flex items-center justify-between text-xs font-bold border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-black tracking-wider uppercase text-xs">
            GOVERNMENT OF INDIA • TAMIL NADU STATE
          </span>
          <span className="hidden md:inline text-slate-300">• Ministry of Rural Development</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-cyan-300 text-xs font-bold">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Main Widescreen Header Bar */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between flex-wrap gap-4">
        
        {/* Brand Logo & Emblem */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl shadow-inner group-hover:scale-105 transition-all">
            印
          </div>
          <div>
            <div className="text-lg font-black text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
              {t('shortTitle') || 'VB–G RAM G SMART SYSTEM'}
            </div>
            <div className="text-xs text-slate-300 font-bold mt-1">
              Smart Rural Employment Management & Transparency Portal
            </div>
          </div>
        </Link>

        {/* Center Quick Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 text-sm font-bold">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname === '/' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            Admin Dashboard
          </Link>

          <Link
            to="/worker-dashboard"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname === '/worker-dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            Supervisor Portal
          </Link>

          <Link
            to="/block-officer-portal"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname === '/block-officer-portal' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            Block Officer Portal
          </Link>

          <Link
            to="/worker-portal"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname === '/worker-portal' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            Worker Portal
          </Link>

          <Link
            to="/work-progress"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname === '/work-progress' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            Real-Time Inspection
          </Link>

          <Link
            to="/ai-fraud"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              location.pathname === '/ai-fraud' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            AI Fraud Radar
          </Link>
        </nav>

        {/* Right Controls: Notification Bell + Multilingual Selector + User Profile */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold">
            <Globe className="w-4 h-4 text-cyan-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-100 font-bold outline-none cursor-pointer text-sm"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
            </select>
          </div>

          {user ? (
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl text-sm font-bold">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xs">
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <span className="font-bold text-slate-100 hidden sm:inline">{user.fullName?.split(' ')[0]}</span>
              <button
                onClick={logout}
                title="Logout"
                className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-600/30 hover:bg-blue-500"
            >
              Login
            </Link>
          )}

          {onToggleShowcase && (
            <button
              onClick={onToggleShowcase}
              className={`p-2.5 rounded-xl border text-sm font-bold transition-all flex items-center gap-1.5 ${
                isShowcaseOpen
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
              title="Toggle Screen Grid Preview"
            >
              <Grid className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
