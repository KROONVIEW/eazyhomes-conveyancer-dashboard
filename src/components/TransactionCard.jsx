import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  'Completed': 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Delayed': 'bg-red-100 text-red-800',
  'Draft': 'bg-gray-100 text-gray-800',
};

const progressBarColors = {
  'Completed': 'bg-green-500',
  'In Progress': 'bg-blue-500',
  'Delayed': 'bg-red-500',
  'Draft': 'bg-gray-400',
};

export default function TransactionCard({ matter, onViewDetails, onViewTimeline, onAttorneyClick }) {
  const progress = Math.round((matter.currentStep / matter.totalSteps) * 100);
  const statusColor = statusColors[matter.status] || 'bg-gray-100 text-gray-800';
  const progressBarColor = progressBarColors[matter.status] || 'bg-gray-400';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-gray-900">{matter.address}</div>
          <div className="text-sm text-gray-500">Client: {matter.clientName}</div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>{matter.status}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2/3">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full ${progressBarColor}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="text-xs text-gray-600">{progress}% complete</div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          <span>Assigned Attorney: </span>
          <button
            className="text-blue-600 hover:underline font-medium"
            onClick={() => onAttorneyClick && onAttorneyClick(matter.assignedAttorneyId)}
            type="button"
          >
            {matter.assignedAttorneyName}
          </button>
        </div>
        <div>Last update: {formatDistanceToNow(new Date(matter.lastUpdateTimestamp), { addSuffix: true })}</div>
      </div>
      <div className="flex space-x-2 mt-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
          onClick={() => onViewDetails && onViewDetails(matter.id)}
        >
          View Details
        </button>
        <button
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 text-sm font-semibold"
          onClick={() => onViewTimeline && onViewTimeline(matter.id)}
        >
          Timeline
        </button>
      </div>
    </div>
  );
} 