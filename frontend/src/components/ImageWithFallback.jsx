import React, { useState } from 'react';

export const ImageWithFallback = ({ src, alt, className = '', fallbackType = 'pond' }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    if (fallbackType === 'banner') {
      return (
        <div className={`bg-gradient-to-tr from-blue-900 via-slate-800 to-emerald-900 flex flex-col items-center justify-center p-6 text-center text-white ${className}`}>
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-xl mb-3 shadow-lg">
            印
          </div>
          <h3 className="text-lg font-black text-amber-300">VB–G RAM G SMART SYSTEM</h3>
          <p className="text-xs text-slate-300 font-semibold mt-1">Smart Rural Employment Management & Transparency Portal</p>
        </div>
      );
    }

    if (fallbackType === 'face') {
      return (
        <div className={`bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-emerald-400 ${className}`}>
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-black text-2xl shadow-inner">
            RK
          </div>
          <div className="text-xs font-bold text-slate-200 mt-2">Field Worker</div>
          <div className="text-[10px] text-slate-400 font-mono">SUP-TN-10245</div>
        </div>
      );
    }

    // Default Pond Fallback SVG
    return (
      <div className={`bg-gradient-to-tr from-cyan-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center p-6 text-center text-slate-100 ${className}`}>
        <svg className="w-20 h-20 text-cyan-400 opacity-90 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M12 6v6l4 2" />
        </svg>
        <div className="text-sm font-black text-emerald-400">Official Completed Amrit Sarovar Pond</div>
        <div className="text-xs text-slate-400 font-mono mt-1">Worksite Code: WK12345 • தமிழ்நாடு (TN)</div>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
    />
  );
};
