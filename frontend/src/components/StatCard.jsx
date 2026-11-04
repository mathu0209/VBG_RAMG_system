import React from 'react';

/**
 * Reusable StatCard component for KPI metrics
 * @param {React.ReactNode} icon - Lucide icon component
 * @param {string} label - Card label
 * @param {string|number} value - Primary metric value
 * @param {string} secondaryInfo - Small secondary info text
 */
export const StatCard = ({ icon, label, value, secondaryInfo }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {icon && <div className="stat-icon-wrapper">{icon}</div>}
      </div>
      <div className="stat-card-value">{value}</div>
      {secondaryInfo && (
        <div className="stat-card-footer">
          <span>{secondaryInfo}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
