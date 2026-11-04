import React from 'react';

export function Badge({ variant = 'info', children, className = '', pulse = false }) {
  const variantStyles = {
    verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    high_risk: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const selectedStyle = variantStyles[variant.toLowerCase()] || variantStyles.info;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${selectedStyle} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
