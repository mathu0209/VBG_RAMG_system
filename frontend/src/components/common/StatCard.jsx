import React from 'react';
import Card from './Card';

export const StatCard = ({ title, value, icon: Icon, trend, trendType = 'up', subtext, iconBg = 'bg-[#1456D9]/10', iconColor = 'text-[#1456D9]' }) => {
  return (
    <Card className="flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl md:text-3xl font-extrabold text-[#172033] tracking-tight">{value}</div>
        
        {(trend || subtext) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold">
            {trend && (
              <span className={`px-2 py-0.5 rounded-md font-bold ${
                trendType === 'up' 
                  ? 'bg-[#12B981]/10 text-[#12B981]' 
                  : trendType === 'down' 
                  ? 'bg-[#EF4444]/10 text-[#EF4444]' 
                  : 'bg-slate-100 text-[#667085]'
              }`}>
                {trend}
              </span>
            )}
            {subtext && <span className="text-[#667085]">{subtext}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
