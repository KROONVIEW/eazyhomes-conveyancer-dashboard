import React from "react";
import StatusTag from "./StatusTag";
import ProgressBar from "./ProgressBar";

const MatterCard = ({ matter, onClick }) => (
  <div
    className="bg-white rounded-xl shadow-md p-5 mb-4 cursor-pointer transition-transform transform hover:shadow-lg hover:scale-[1.02] flex flex-col gap-2 border border-gray-100"
    onClick={onClick}
    title={matter.address}
  >
    <div className="flex items-center justify-between">
      <div className="font-bold text-lg text-blue-800 truncate" title={matter.address}>{matter.address}</div>
      <StatusTag status={matter.status} />
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span className="font-semibold text-gray-700">{matter.client}</span>
      <span className="mx-1">•</span>
      <span>{matter.type}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">Assigned:</span>
      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{matter.assignedTo}</span>
    </div>
    <div className="flex items-center gap-2">
      <ProgressBar progress={matter.progress} />
      <span className="text-xs text-gray-400 ml-2">{matter.progress}%</span>
    </div>
    <div className="text-xs text-gray-400 mt-1">Last updated: {new Date(matter.updatedAt).toLocaleString()}</div>
  </div>
);

export default MatterCard; 