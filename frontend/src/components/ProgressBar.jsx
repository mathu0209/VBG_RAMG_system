import React from 'react';

/**
 * Reusable clean ProgressBar component
 * @param {number} value - Progress percentage (0 - 100)
 * @param {string} color - Optional custom fill color
 * @param {string} height - Height of the progress bar (e.g. "8px", "12px")
 */
export const ProgressBar = ({ value = 0, color = 'var(--primary)', height = '8px' }) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="progress-bar-track" style={{ height }}>
      <div 
        className="progress-bar-fill"
        style={{ 
          width: `${normalizedValue}%`,
          backgroundColor: color 
        }} 
      />
    </div>
  );
};

export default ProgressBar;
