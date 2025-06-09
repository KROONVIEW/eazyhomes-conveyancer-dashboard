import React, { useState } from 'react';

const mockNotifications = [
  { id: 1, type: 'task', message: 'Task "Send FICA docs" is due tomorrow.', read: false, time: '2h ago' },
  { id: 2, type: 'compliance', message: '3 matters require urgent FICA action.', read: false, time: '1d ago' },
  { id: 3, type: 'system', message: 'System update scheduled for tonight.', read: true, time: '3d ago' },
  { id: 4, type: 'task', message: 'New document uploaded by client.', read: true, time: '4d ago' },
];

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'System', value: 'system' },
  { label: 'Tasks', value: 'task' },
  { label: 'Compliance', value: 'compliance' },
];

export default function NotificationDrawer({ open, onClose }) {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filtered = notifications.filter(n => {
    if (filter === 'all') {return true;}
    if (filter === 'unread') {return !n.read;}
    return n.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all ${open ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div className="flex space-x-2 p-4 border-b overflow-x-auto">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              className={`px-3 py-1 rounded text-xs font-medium border transition-colors focus:outline-none ${
                filter === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto h-[calc(100%-120px)] p-4">
          {filtered.length === 0 ? (
            <div className="text-gray-400 text-center mt-8">No notifications.</div>
          ) : (
            <ul className="space-y-4">
              {filtered.map(n => (
                <li key={n.id} className={`p-3 rounded-lg border ${n.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'} flex items-start justify-between`}>
                  <div>
                    <div className="text-sm font-medium text-gray-800 mb-1">{n.message}</div>
                    <div className="text-xs text-gray-400">{n.time}</div>
                  </div>
                  {!n.read && (
                    <button
                      className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => markAsRead(n.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 