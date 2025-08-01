import React from 'react';
import { FiX } from 'react-icons/fi';

const NewConversationModal = ({ isOpen, onClose, onStartConversation }) => {
  if (!isOpen) {return null;}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">New Conversation</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-600">New conversation modal coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal; 