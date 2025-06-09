import React from 'react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-full ${className}`}>
    {children}
  </div>
);

export default Card; 