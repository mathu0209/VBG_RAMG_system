import React from 'react';

export const Card = ({ children, className = '', style = {}, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{ borderRadius: '14px', ...style }}
      className={`bg-white border border-[#E4E7EC] shadow-xs p-5 transition-all ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
