import React from "react";

const StatCard = ({ icon, title, value, className = "" }) => {
  return (
    <div className={`bg-white rounded-md shadow-sm p-6 flex items-center gap-4 ${className}`}>
      <div className="p-2 rounded-full bg-blue-100 text-blue-600 mb-2 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800 leading-tight">{value}</div>
        <div className="text-sm text-gray-500 font-medium">{title}</div>
      </div>
    </div>
  );
};

export default StatCard; 