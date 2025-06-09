import React from "react";

const tasks = [
  {
    id: "EZT1001",
    title: "Offer to Purchase signed",
    status: "done",
    completedAt: "2025-05-24T10:03:00Z"
  },
  {
    id: "EZT1002",
    title: "FICA uploaded",
    status: "done",
    completedAt: "2025-05-25T13:45:00Z"
  },
  {
    id: "EZT1003",
    title: "Mandate signed",
    status: "doing",
    startedAt: "2025-05-29T09:00:00Z",
    note: "Waiting on seller signature"
  },
  {
    id: "EZT1004",
    title: "Power of Attorney requested",
    status: "to_do"
  },
  {
    id: "EZT1005",
    title: "Deeds Office Lodgement",
    status: "to_do"
  }
];

const statusDot = {
  to_do: "bg-gray-400",
  doing: "bg-yellow-500 animate-pulse",
  done: "bg-green-500"
};

const statusBadge = {
  to_do: "bg-gray-100 text-gray-600",
  doing: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700"
};

const statusText = {
  to_do: "To Do",
  doing: "Doing",
  done: "Done"
};

function formatDate(dateStr) {
  if (!dateStr) {return "";}
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " at " + date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

const TimelineTaskPreview = () => {
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 px-2 sm:px-6 py-4 max-w-2xl mx-auto overflow-y-auto">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-300" aria-hidden="true" />
      <ul className="divide-y divide-gray-100">
        {tasks.map((task, idx) => (
          <li
            key={task.id}
            className="relative pl-10 flex gap-4 items-start py-6 group hover:bg-gray-50 transition-colors duration-150"
          >
            {/* Timeline dot */}
            <div className={`absolute left-4 top-6 -ml-1 w-3 h-3 rounded-full border-2 border-white shadow ${statusDot[task.status]}`}></div>
            {/* Task Content */}
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-gray-900 font-medium text-sm truncate">{task.title}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[task.status]}`}>{statusText[task.status]}</span>
                {task.id && (
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-mono ml-1">{task.id}</span>
                )}
              </div>
              {/* Date/Time */}
              {task.status === "done" && (
                <p className="text-xs text-gray-500">Completed on {formatDate(task.completedAt)}</p>
              )}
              {task.status === "doing" && (
                <p className="text-xs text-yellow-700">Started: {formatDate(task.startedAt)}</p>
              )}
              {/* Optional Note */}
              {task.note && (
                <p className="text-xs text-gray-400 italic">{task.note}</p>
              )}
            </div>
            {/* Optional dropdown for future interactivity */}
            <div className="ml-auto pr-2 flex items-center">
              <button className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors" title="More actions">
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="4" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="16" r="1.5" fill="currentColor"/></svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimelineTaskPreview; 