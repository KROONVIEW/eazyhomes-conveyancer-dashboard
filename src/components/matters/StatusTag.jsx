import React from "react";

const statusColors = {
  // Draft = Gray
  "Draft": "bg-gray-100 text-gray-700 border-gray-200",
  
  // In Progress = Blue  
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  
  // Awaiting Signature = Light Orange
  "Awaiting Signature": "bg-orange-100 text-orange-600 border-orange-200",
  
  // Registered = Green
  "Registered": "bg-green-100 text-green-700 border-green-200",
  
  // Completed = Dark Green
  "Completed": "bg-green-200 text-green-800 border-green-300",
  
  // Other statuses
  "Delayed": "bg-red-100 text-red-700 border-red-200",
  "Active": "bg-blue-100 text-blue-700 border-blue-200",
  "Cancelled": "bg-gray-200 text-gray-600 border-gray-300",
};

const StatusTag = ({ status }) => {
  const color = statusColors[status] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>{status}</span>
  );
};

export default StatusTag; 