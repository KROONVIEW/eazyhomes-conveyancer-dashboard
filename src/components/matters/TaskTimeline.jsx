import React from "react";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const tasks = [
  {
    id: 1,
    name: "Offer to Purchase signed",
    status: "completed",
    completedAt: "2025-05-24T10:03:00Z"
  },
  {
    id: 2,
    name: "FICA documents uploaded",
    status: "completed",
    completedAt: "2025-05-25T13:45:00Z"
  },
  {
    id: 3,
    name: "Mandate signed",
    status: "in_progress",
    startedAt: "2025-05-29T09:00:00Z"
  },
  {
    id: 4,
    name: "Power of Attorney requested",
    status: "pending"
  },
  {
    id: 5,
    name: "Deeds Office Lodged",
    status: "pending"
  }
];

const statusStyles = {
  pending: 'bg-gray-400',
  in_progress: 'bg-blue-500 animate-pulse',
  completed: 'bg-green-500'
};

const statusText = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed'
};

function formatDate(dateStr) {
  if (!dateStr) {return '';}
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const TaskTimeline = () => {
  return (
    <div className="relative px-2 sm:px-4 py-6">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-300 z-0" aria-hidden="true" />
      <ul className="space-y-8">
        {tasks.map((task, idx) => {
          const isCurrent = task.status === 'in_progress';
          const isCompleted = task.status === 'completed';
          const isPending = task.status === 'pending';
          return (
            <li key={task.id} className="relative flex items-start gap-x-4 group">
              {/* Dot */}
              <div className="flex flex-col items-center z-10">
                <span
                  className={`w-4 h-4 rounded-full border-2 border-white shadow ${statusStyles[task.status]} flex items-center justify-center`}
                  aria-label={statusText[task.status]}
                >
                  {isCompleted && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                </span>
                {/* Connector line for all but last */}
                {idx < tasks.length - 1 && (
                  <span className="flex-1 w-px bg-gray-300 mt-1" />
                )}
              </div>
              {/* Content */}
              <div
                className={`flex-1 min-w-0 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 transition-all duration-200
                  ${isCurrent ? 'ring-2 ring-blue-200 shadow-lg relative z-20' : ''}
                  ${isCompleted ? 'opacity-60' : ''}
                  group-hover:bg-blue-50 group-hover:border-blue-100`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-base truncate">{task.name}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium
                    ${isCompleted ? 'bg-green-100 text-green-700' : isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {statusText[task.status]}
                  </span>
                </div>
                {/* Timestamp */}
                {isCompleted && (
                  <div className="text-xs text-gray-500 mt-1">{formatDate(task.completedAt)}</div>
                )}
                {isCurrent && (
                  <div className="text-xs text-blue-500 mt-1">Started: {formatDate(task.startedAt)}</div>
                )}
                {/* Optional note preview (example) */}
                {task.note && (
                  <div className="text-xs text-gray-400 mt-2 italic">{task.note}</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskTimeline; 