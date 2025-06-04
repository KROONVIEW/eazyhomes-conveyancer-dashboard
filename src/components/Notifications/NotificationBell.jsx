import React from 'react';
import { FiBell } from 'react-icons/fi';

export default function NotificationBell({ unreadCount = 3, onClick }) {
  return (
    <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none" onClick={onClick} aria-label="Notifications">
      <FiBell className="w-6 h-6 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
          {unreadCount}
        </span>
      )}
    </button>
  );
} 