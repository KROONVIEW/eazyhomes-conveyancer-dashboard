import React from "react";

function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) {return `${diff}s ago`;}
  if (diff < 3600) {return `${Math.floor(diff/60)}m ago`;}
  if (diff < 86400) {return `${Math.floor(diff/3600)}h ago`;}
  return then.toLocaleDateString();
}

const ActivityFeed = ({ items }) => (
  <ol className="relative border-l border-gray-200 ml-4">
    {items.map(item => (
      <li key={item.id} className="mb-8 ml-6">
        <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-8 ring-white">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">{item.text}</span>
          <span className="text-xs text-gray-400">{timeAgo(item.date)}</span>
        </div>
      </li>
    ))}
  </ol>
);

export default ActivityFeed; 