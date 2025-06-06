import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiX, 
  FiHome, 
  FiUpload, 
  FiMessageCircle, 
  FiClipboard,
  FiFileText,
  FiUsers
} from 'react-icons/fi';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const fabRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key to close the menu
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(!isOpen);
      
      // Reset animation state after transition
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  // Quick action handlers with enhanced functionality
  const handleNewTransfer = () => {
    console.log('🏠 Initiating New Property Transfer');
    // Navigate to matters page with new matter modal
    navigate('/matters?action=new');
    setIsOpen(false);
  };

  const handleUploadDocument = () => {
    console.log('📄 Opening Document Upload');
    // Navigate to documents page with upload modal
    navigate('/documents?action=upload');
    setIsOpen(false);
  };

  const handleInitiateChat = () => {
    console.log('💬 Initiating Secure Chat');
    // Navigate to messages page with new chat
    navigate('/messages?action=new');
    setIsOpen(false);
  };

  const handleAddTask = () => {
    console.log('✅ Creating New Task');
    // Navigate to tasks page with new task modal
    navigate('/tasks?action=new');
    setIsOpen(false);
  };

  const handleQuickClient = () => {
    console.log('👥 Adding New Client');
    // Navigate to clients page with new client modal
    navigate('/clients?action=new');
    setIsOpen(false);
  };

  const handleQuickMatter = () => {
    console.log('📋 Quick Matter View');
    // Navigate to matters overview
    navigate('/matters');
    setIsOpen(false);
  };

  const quickActions = [
    {
      id: 'new-transfer',
      label: 'Start New Transfer',
      description: 'Initiate property transfer',
      icon: FiHome,
      onClick: handleNewTransfer,
      color: 'bg-green-500 hover:bg-green-600',
      delay: 0
    },
    {
      id: 'new-chat',
      label: 'Secure Message',
      description: 'Start conversation',
      icon: FiMessageCircle,
      onClick: handleInitiateChat,
      color: 'bg-blue-500 hover:bg-blue-600',
      delay: 50
    },
    {
      id: 'upload-doc',
      label: 'Upload Document',
      description: 'Add documents to matter',
      icon: FiUpload,
      onClick: handleUploadDocument,
      color: 'bg-purple-500 hover:bg-purple-600',
      delay: 100
    },
    {
      id: 'add-task',
      label: 'Create Task',
      description: 'Add new task',
      icon: FiClipboard,
      onClick: handleAddTask,
      color: 'bg-orange-500 hover:bg-orange-600',
      delay: 150
    },
    {
      id: 'new-client',
      label: 'Add Client',
      description: 'Register new client',
      icon: FiUsers,
      onClick: handleQuickClient,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      delay: 200
    },
    {
      id: 'view-matters',
      label: 'View Matters',
      description: 'Browse all matters',
      icon: FiFileText,
      onClick: handleQuickMatter,
      color: 'bg-teal-500 hover:bg-teal-600',
      delay: 250
    }
  ];

  return (
    <div ref={fabRef} className="fixed bottom-6 right-6 z-50 group">
      {/* Backdrop overlay when menu is open */}
      {isOpen && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md transition-opacity duration-300 ease-in-out"
          style={{ zIndex: -1 }}
        />
      )}

      {/* Speed Dial Menu */}
      <div className="relative">
        {/* Quick Action Items */}
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.id}
              className={`absolute bottom-20 right-0 transform transition-all duration-300 ease-out ${
                isOpen 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
              }`}
              style={{
                bottom: `${80 + (index * 70)}px`,
                transitionDelay: isOpen ? `${action.delay}ms` : '0ms'
              }}
            >
              {/* Action Button with Tooltip */}
              <div className="flex items-center space-x-3 group">
                {/* Tooltip */}
                <div className={`bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg transform transition-all duration-200 ${
                  isOpen ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                }`}>
                  <div className="flex flex-col">
                    <span className="font-semibold">{action.label}</span>
                    <span className="text-xs text-gray-300">{action.description}</span>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                    <div className="w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={action.onClick}
                  className={`w-12 h-12 ${action.color} text-white rounded-full shadow-lg flex items-center justify-center transform transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 active:scale-95`}
                  title={action.label}
                >
                  <IconComponent className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Main FAB Button */}
        <button
          onClick={toggleMenu}
          className={`w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-xl flex items-center justify-center transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 ${
            isOpen 
              ? 'rotate-45 scale-110 shadow-2xl' 
              : 'hover:scale-110 hover:shadow-2xl'
          } ${isAnimating ? 'animate-pulse' : ''}`}
          title={isOpen ? 'Close menu' : 'Quick actions'}
        >
          {/* Icon with smooth transition */}
          <div className="relative w-6 h-6">
            <FiPlus 
              className={`absolute inset-0 w-6 h-6 transition-all duration-300 ease-in-out ${
                isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'
              }`} 
            />
            <FiX 
              className={`absolute inset-0 w-6 h-6 transition-all duration-300 ease-in-out ${
                isOpen ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'
              }`} 
            />
          </div>
        </button>

        {/* Ripple effect on click */}
        {isAnimating && (
          <div className="absolute inset-0 w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-20"></div>
        )}
      </div>

      {/* Quick stats overlay - shows on hover when menu is closed */}
      {!isOpen && (
        <div className="absolute bottom-20 left-0 transform -translate-x-full translate-y-4 bg-white rounded-lg shadow-xl p-4 min-w-48 border border-gray-200 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 pointer-events-none">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Stats</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Active Matters:</span>
              <span className="font-medium text-blue-600">24</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Tasks:</span>
              <span className="font-medium text-orange-600">8</span>
            </div>
            <div className="flex justify-between">
              <span>New Messages:</span>
              <span className="font-medium text-green-600">3</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingActionButton; 