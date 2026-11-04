import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Globe, Clock, User, LogOut, Grid, ShieldCheck, Phone, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const PanchayatSetuNavbar = ({ onToggleShowcase, isShowcaseOpen }) => {
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
      
      {/* Top National Tricolor Header Stripe */}
      <div className="bg-gradient-to-r from-orange-600 via-white to-emerald-600 h-1.5 w-full" />

      {/* Government Identification Bar */}
      <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-bold flex-wrap gap-2">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="text-amber-400 font-black uppercase tracking-wider">
            GOVERNMENT OF INDIA • PANCHAYATI RAJ & RURAL DEVELOPMENT
          </span>
          <span className="hidden lg:inline text-slate-500">|</span>
          <span className="hidden lg:inline text-emerald-400">
            {lang === 'ta' ? 'தமிழ்நாடு பஞ்சாயத்து சேது போர்ட்டல்' : lang === 'hi' ? 'पंचायत सेतु पोर्टल - तमिलनाडु' : 'Tamil Nadu Panchayat Setu Portal'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>{timeStr}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Helpline: 1800-111-222</span>
          </div>
        </div>
      </div>

      {/* Main Panchayat Setu Header with Lion Emblem */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        
        {/* Emblem & Portal Title */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-2xl shadow-inner group-hover:scale-105 transition-all">
            印
          </div>
          <div>
            <div className="text-xl font-black text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
              PANCHAYAT SETU
            </div>
            <div className="text-xs font-black text-emerald-400 mt-1 uppercase tracking-wider">
              {lang === 'ta' 
                ? 'VB–G RAM G கிராமப்புற வேலைவாய்ப்பு மற்றும் வெளிப்படைத்தன்மை போர்ட்டல்' 
                : lang === 'hi'
                ? 'वीबी-जी राम जी ग्रामीण रोजगार एवं पारदर्शिता पोर्टल'
                : 'VB–G RAM G Smart Rural Employment & Transparency System'}
            </div>
          </div>
        </Link>

        {/* Right Controls: Multilingual Switcher + User Profile + Showcase Drawer */}
        <div className="flex items-center gap-3">
          
          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold">
            <Globe className="w-4 h-4 text-cyan-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-100 font-bold outline-none cursor-pointer text-sm"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* User Profile / Login Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-sm font-bold">
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
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-black text-sm shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
            >
              Portal Login
            </Link>
          )}

          {/* 9-Screen Showcase Drawer Toggle */}
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

        </div>

      </div>

      {/* Panchayat Setu Main Navigation Menu Bar */}
      <div className="bg-slate-950 border-t border-slate-800 px-6 py-2.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm font-bold whitespace-nowrap">
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-xl transition-all ${
              location.pathname === '/' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {lang === 'ta' ? 'முகப்பு (Home)' : 'Home'}
          </Link>

          <Link
            to="/worker-portal"
            className={`px-4 py-1.5 rounded-xl transition-all ${
              location.pathname === '/worker-portal' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {lang === 'ta' ? 'பணியாளர் போர்ட்டல் (Worker Portal)' : 'Worker Portal'}
          </Link>

          <Link
            to="/worker-dashboard"
            className={`px-4 py-1.5 rounded-xl transition-all ${
              location.pathname === '/worker-dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {lang === 'ta' ? 'மேற்பார்வையாளர் மையம் (Supervisor Portal)' : 'Supervisor Portal'}
          </Link>

          <Link
            to="/block-officer-portal"
            className={`px-4 py-1.5 rounded-xl transition-all ${
              location.pathname === '/block-officer-portal' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {lang === 'ta' ? 'வட்டார அதிகாரி (Block Officer)' : 'Block Officer Portal'}
          </Link>

          <Link
            to="/work-progress"
            className={`px-4 py-1.5 rounded-xl transition-all ${
              location.pathname === '/work-progress' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {lang === 'ta' ? 'நிகழ்நேர பணி ஆய்வு (Live Inspection)' : 'Live Inspection'}
          </Link>

          <Link
            to="/ai-fraud"
            className={`px-4 py-1.5 rounded-xl transition-all ${
              location.pathname === '/ai-fraud' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {lang === 'ta' ? 'AI மோசடி ஆய்வு (AI Fraud Radar)' : 'AI Fraud Radar'}
          </Link>

          <Link
            to="/register"
            className={`px-4 py-1.5 rounded-xl transition-all ${
              location.pathname === '/register' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {lang === 'ta' ? 'புதிய கணக்கு பதிவு (Register Account)' : 'Register Account'}
          </Link>
        </div>
      </div>

    </header>
  );
};
