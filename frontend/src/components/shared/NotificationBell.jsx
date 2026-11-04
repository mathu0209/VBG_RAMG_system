import React, { useState, useRef, useEffect } from 'react';
import { Bell, Volume2, VolumeX, ShieldAlert, Check, ExternalLink } from 'lucide-react';
import { useRealtimeFraud } from '../../context/RealtimeFraudContext';
import { useNavigate } from 'react-router-dom';

export function NotificationBell() {
  const { alerts, unreadCount, soundEnabled, setSoundEnabled, markAllAsRead, dismissAlert } = useRealtimeFraud();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) markAllAsRead();
        }}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-slate-800"
        title="Live Fraud Notifications"
      >
        <Bell className="w-5 h-5 text-slate-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-rose-600 text-[10px] font-bold text-white shadow-md">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h4 className="font-semibold text-slate-100 text-sm">Real-Time Risk Alarms</h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                  soundEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title={soundEnabled ? 'Audio Cue Active' : 'Audio Cue Muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={markAllAsRead}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Read
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className="p-3.5 hover:bg-slate-800/40 transition-colors flex items-start gap-3">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 ${
                      alert.risk_score >= 85
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    Risk {alert.risk_score}%
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{alert.type.replace('_', ' ')}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{alert.details}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{alert.worksite}</span>
                      <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-slate-500 hover:text-slate-300 text-xs px-1"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No active fraud alerts detected. System operating normally.
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/ai-fraud');
              }}
              className="w-full text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1 py-1"
            >
              Open AI Fraud Radar Center <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
