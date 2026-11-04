import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ShieldCheck, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export function LiveLocationHeader({ title, subtitle, showLogout = true }) {
  const [timeStr, setTimeStr] = useState('');
  const [coords, setCoords] = useState('13.1187° N, 79.9079° E');
  const [locationName, setLocationName] = useState('பூண்டி ஊராட்சி, திருவள்ளூர் மாவட்டம், தமிழ்நாடு');
  const { user, logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      setTimeStr(`${datePart} • ${timePart}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Browser Live Geolocation Telemetry
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setCoords(`${lat}° N, ${lng}° E`);
        },
        (err) => {
          console.warn('Geolocation fallback used:', err.message);
        }
      );
    }

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-100 font-sans shadow-xl">
      
      {/* Top Telemetry & Location Stripe */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-emerald-950 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs border-b border-slate-800/80 flex-wrap gap-2">
        
        {/* State Authority Title */}
        <div className="flex items-center gap-2 font-bold tracking-wider text-amber-400 uppercase text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>தமிழ்நாடு அரசு • ஊரக வளர்ச்சி மற்றும் ஊராட்சித் துறை</span>
        </div>

        {/* Live GPS Geofence Telemetry & Real-Time Clock */}
        <div className="flex items-center gap-4 text-[11px] font-mono font-medium flex-wrap">
          <div className="flex items-center gap-1 text-emerald-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-xs sm:max-w-md">{user?.village || user?.panchayat || 'பூண்டி ஊராட்சி'}, {user?.district || 'திருவள்ளூர் மாவட்டம்'} ({coords})</span>
          </div>

          <div className="flex items-center gap-1.5 text-cyan-300 font-bold border-l border-slate-800 pl-3">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
            <span>{timeStr}</span>
          </div>
        </div>

      </div>

      {/* Main Navigation Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl shadow-inner">
            印
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
              {title || 'VB–G RAM G ஸ்மார்ட் அமைப்பு'}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {subtitle || 'ஸ்மார்ட் கிராமப்புற வேலைவாய்ப்பு மேலாண்மை மற்றும் வெளிப்படைத்தன்மை போர்டல்'}
            </p>
          </div>
        </div>

        {/* User Badge & Language/Logout Actions */}
        <div className="flex items-center gap-3">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer font-bold text-xs"
            >
              <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
              <option value="en" className="bg-slate-900 text-white">English</option>
            </select>
          </div>

          {/* 9-Screen Grid View Toggle Button */}
          <button
            onClick={() => navigate('/grid')}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="9-திரை தொகுதி காட்சி"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>9-திரை காட்சி</span>
          </button>

          {/* User Profile Badge */}
          {user && (
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <span className="text-slate-200 hidden sm:inline">{user.fullName?.split(' ')[0]}</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                {user.role === 'WORKER' ? 'பணியாளர்' : user.role === 'SUPERVISOR' ? 'மேற்பார்வையாளர்' : 'நிர்வாகி'}
              </span>
            </div>
          )}

          {/* Sign Out Button */}
          {showLogout && user && (
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="வெளியேறு"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>வெளியேறு</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default LiveLocationHeader;
