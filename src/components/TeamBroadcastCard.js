import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiBell } from 'react-icons/fi';

const TeamBroadcastCard = () => {
  const navigate = useNavigate();
  const recentMessages = [
    { id: 1, type: 'update', message: 'System update scheduled for 2 AM, June 2nd.', time: '5 min ago' },
    { id: 2, type: 'message', message: 'John Doe: Document for Transfer #1015 uploaded.', time: '30 min ago' },
    { id: 3, type: 'message', message: 'New offer received for 789 Pine Ln.', time: '1 hr ago' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Recent Messages</h3>
        <div className="relative">
          <FiMessageSquare className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </div>
      </div>
      <ul className="space-y-3 flex-grow overflow-y-auto">
        {recentMessages.map((msg) => (
          <li key={msg.id} className="flex items-start text-sm">
            {msg.type === 'update' ? (
              <FiBell className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <FiMessageSquare className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-grow">
              <p className="text-gray-700 leading-tight">{msg.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{msg.time}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button 
          onClick={() => navigate('/messages')} 
          className="text-blue-600 hover:underline text-sm font-medium cursor-pointer bg-transparent border-none p-0"
        >
          View All Messages
        </button>
      </div>
    </div>
  );
};

export default TeamBroadcastCard; 