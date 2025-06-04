import React, { useEffect } from 'react';

const typeStyles = {
  info: 'bg-blue-600',
  warning: 'bg-yellow-500',
  success: 'bg-green-600',
  error: 'bg-red-600',
};

export default function NotificationToast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white font-medium ${typeStyles[type]}`}
      role="alert"
    >
      {message}
      <button className="ml-4 text-white/80 hover:text-white text-lg" onClick={onClose}>&times;</button>
    </div>
  );
} 