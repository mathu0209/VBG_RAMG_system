import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Globe, Clock, LogOut, Grid, ShieldCheck, Phone, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const UltraCleanNavbar = ({ onToggleShowcase, isShowcaseOpen }) => {
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
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-50 shadow-sm font-sans">
      
      {/* Main Single Widescreen Header Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        
        {/* Brand Logo & Emblem */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-700 font-black text-2xl shadow-sm group-hover:scale-105 transition-all">
            印
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
              VB–G RAM G SMART PORTAL
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1">
              Government of India • Ministry of Rural Development • Tamil Nadu State
            </div>
          </div>
        </Link>

        {/* Center Quick Navigation Links (Ultra Clean & Large Font) */}
        <nav className="hidden xl:flex items-center gap-2 text-sm font-black">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl transition-all ${
              location.pathname === '/' ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'ta' ? 'முகப்பு' : 'Home'}
          </Link>

          <Link
            to="/worker-portal"
            className={`px-4 py-2 rounded-xl transition-all ${
              location.pathname === '/worker-portal' ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'ta' ? 'பணியாளர்' : 'Worker Portal'}
          </Link>

          <Link
            to="/worker-dashboard"
            className={`px-4 py-2 rounded-xl transition-all ${
              location.pathname === '/worker-dashboard' ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'ta' ? 'மேற்பார்வையாளர்' : 'Supervisor Portal'}
          </Link>

          <Link
            to="/block-officer-portal"
            className={`px-4 py-2 rounded-xl transition-all ${
              location.pathname === '/block-officer-portal' ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'ta' ? 'வட்டார அதிகாரி' : 'Block Officer Portal'}
          </Link>

          <Link
            to="/work-progress"
            className={`px-4 py-2 rounded-xl transition-all ${
              location.pathname === '/work-progress' ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'ta' ? 'நிகழ்நேர ஆய்வு' : 'Live Inspection'}
          </Link>

          <Link
            to="/ai-fraud"
            className={`px-4 py-2 rounded-xl transition-all ${
              location.pathname === '/ai-fraud' ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'ta' ? 'AI மோசடி ஆய்வு' : 'AI Fraud Radar'}
          </Link>
        </nav>

        {/* Right Controls: Multilingual Selector + Live Clock + User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Live Clock Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
            <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>{timeStr}</span>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold">
            <Globe className="w-4 h-4 text-blue-600" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer text-sm"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* User Profile / Login Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <span className="font-bold text-slate-800 hidden sm:inline">{user.fullName?.split(' ')[0]}</span>
              <button
                onClick={logout}
                title="Logout"
                className="text-slate-500 hover:text-rose-600 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-700/20 hover:bg-blue-800 transition-all"
            >
              Login
            </Link>
          )}

          {/* 9-Screen Showcase Drawer Toggle */}
          <button
            onClick={onToggleShowcase}
            className={`p-2.5 rounded-xl border text-sm font-bold transition-all flex items-center gap-1.5 ${
              isShowcaseOpen
                ? 'bg-blue-700 text-white border-blue-700 shadow-md'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle Screen Grid Preview"
          >
            <Grid className="w-5 h-5" />
          </button>

        </div>

      </div>

    </header>
  );
};
