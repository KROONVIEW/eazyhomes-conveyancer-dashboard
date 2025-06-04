import React from 'react';

const DashboardCard = ({ title, children, className = '', ...props }) => (
  <div className={`bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-lg shadow-lg shadow-blue-100/40 border border-gray-100 p-6 flex flex-col ${className}`}
    {...props}
  >
    {title && (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
    )}
    <div className="flex-grow">
      {children}
    </div>
  </div>
);

export default DashboardCard; 