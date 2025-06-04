import React from "react";

const statusColors = {
  Registered: "bg-green-100 text-green-700 border-green-200",
  Delayed: "bg-red-100 text-red-700 border-red-200",
  "Awaiting Signature": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
};

const StatusTag = ({ status }) => {
  const color = statusColors[status] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>{status}</span>
  );
};

export default StatusTag; 