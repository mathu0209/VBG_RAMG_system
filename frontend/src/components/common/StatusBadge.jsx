import React from 'react';

export const StatusBadge = ({ status = 'success', text, className = '' }) => {
  const norm = status?.toString().toLowerCase() || 'success';

  let badgeStyle = "bg-[#12B981]/10 text-[#10B981] border-[#12B981]/30";

  if (norm.includes('warning') || norm.includes('pending') || norm.includes('delayed') || norm.includes('in progress')) {
    badgeStyle = "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/30";
  } else if (norm.includes('danger') || norm.includes('mismatch') || norm.includes('alert') || norm.includes('absent') || norm.includes('rejected')) {
    badgeStyle = "bg-[#EF4444]/10 text-[#DC2626] border-[#EF4444]/30";
  } else if (norm.includes('info') || norm.includes('active') || norm.includes('present') || norm.includes('completed')) {
    badgeStyle = "bg-[#1456D9]/10 text-[#1456D9] border-[#1456D9]/30";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wide uppercase ${badgeStyle} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {text || status}
    </span>
  );
};

export default StatusBadge;
