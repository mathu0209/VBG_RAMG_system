import React from 'react';

export function Card({ children, className = '', title, subtitle, action, headerBg = 'bg-slate-900/60' }) {
  return (
    <div className={`bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl hover:border-slate-700 transition-all ${className}`}>
      {(title || action) && (
        <div className={`px-5 py-4 border-b border-slate-800 flex items-center justify-between ${headerBg}`}>
          <div>
            {title && <h3 className="font-semibold text-slate-100 text-lg tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export default Card;
