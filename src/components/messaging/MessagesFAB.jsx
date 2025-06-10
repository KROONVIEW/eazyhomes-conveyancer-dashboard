import React, { useState, useRef, useEffect } from 'react';
import { 
  FiPlus, 
  FiX, 
  FiVideo, 
  FiPhone,
  FiSearch, 
  FiPaperclip,
  FiMessageCircle
} from 'react-icons/fi';

const MessagesFAB = ({ 
  activeChat, 
  onNewConversation, 
  onVideoCall, 
  onVoiceCall,
  showNewChatModal,
  setShowNewChatModal 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const fabRef = useRef(null);

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
        setShowNewChatModal(false);
        setShowVideoCallModal(false);
        setShowSearchModal(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const toggleMenu = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(!isOpen);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  // Quick action handlers
  const handleNewConversation = () => {
    console.log('💬 Creating New Conversation');
    // Create a simple new conversation modal or trigger
    const newContactName = prompt('Enter contact name for new conversation:');
    if (newContactName && newContactName.trim()) {
      console.log(`💬 New conversation started with: ${newContactName.trim()}`);
      // If onNewConversation prop is available, use it
      if (onNewConversation) {
        onNewConversation(newContactName.trim());
      } else {
        // Fallback: Show success message
        alert(`New conversation with ${newContactName.trim()} will be created!`);
      }
    }
    setIsOpen(false);
  };

  const handleVideoCall = () => {
    if (activeChat) {
      console.log(`📹 Initiating Video Call with ${activeChat.name}`);
      onVideoCall?.(activeChat);
    } else {
      console.log('📹 No active chat selected for video call');
    }
    setIsOpen(false);
  };

  const handleVoiceCall = () => {
    if (activeChat) {
      console.log(`📞 Initiating Voice Call with ${activeChat.name}`);
      onVoiceCall?.(activeChat);
    } else {
      console.log('📞 No active chat selected for voice call');
    }
    setIsOpen(false);
  };

  const handleGlobalSearch = () => {
    console.log('🔍 Opening Global Message Search');
    // Simple search implementation
    const searchTerm = prompt('Enter search term to find in messages:');
    if (searchTerm && searchTerm.trim()) {
      console.log(`🔍 Searching for: "${searchTerm.trim()}"`);
      alert(`Searching for "${searchTerm.trim()}" in all conversations...\n\nThis would normally show search results in a modal.`);
    }
    setShowSearchModal(true);
    setIsOpen(false);
  };

  const handleShareDocument = () => {
    console.log('📎 Opening Document Share');
    // Trigger file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.doc,.docx,.jpg,.png,.txt';
    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      console.log('📎 Files selected for sharing:', files.map(f => f.name));
      
      if (files.length > 0) {
        const fileNames = files.map(f => f.name).join(', ');
        const chatName = activeChat ? activeChat.name : 'selected conversation';
        
        // Simulate file processing
        console.log(`📎 Processing ${files.length} file(s) for sharing...`);
        alert(`Files selected: ${fileNames}\n\nThese files would be uploaded and shared in ${chatName}.`);
        
        // Here you would normally handle the actual file upload logic
        // For now, we'll just show success feedback
        setTimeout(() => {
          console.log('📎 Files successfully processed for sharing');
        }, 1000);
      }
    };
    fileInput.click();
    setIsOpen(false);
  };

  const quickActions = [
    {
      id: 'new-chat',
      label: 'New Conversation',
      description: 'Start new chat',
      icon: FiMessageCircle,
      onClick: handleNewConversation,
      color: 'bg-green-500 hover:bg-green-600',
      delay: 0
    },
    {
      id: 'video-call',
      label: activeChat ? `Video Call ${activeChat.name}` : 'Video Call',
      description: activeChat ? 'Start video call' : 'Select chat first',
      icon: FiVideo,
      onClick: handleVideoCall,
      color: activeChat ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400',
      delay: 50,
      disabled: !activeChat
    },
    {
      id: 'voice-call',
      label: activeChat ? `Call ${activeChat.name}` : 'Voice Call',
      description: activeChat ? 'Start voice call' : 'Select chat first',
      icon: FiPhone,
      onClick: handleVoiceCall,
      color: activeChat ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-400',
      delay: 100,
      disabled: !activeChat
    },
    {
      id: 'global-search',
      label: 'Search Messages',
      description: 'Find in conversations',
      icon: FiSearch,
      onClick: handleGlobalSearch,
      color: 'bg-orange-500 hover:bg-orange-600',
      delay: 150
    },
    {
      id: 'share-document',
      label: 'Share Document',
      description: 'Quick file sharing',
      icon: FiPaperclip,
      onClick: handleShareDocument,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      delay: 200
    }
  ];

  return (
    <>
      <div ref={fabRef} className="fixed bottom-24 right-6 z-50 group">
        {/* Backdrop overlay when menu is open */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
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
                    onClick={action.disabled ? undefined : action.onClick}
                    className={`w-12 h-12 ${action.color} text-white rounded-full shadow-lg flex items-center justify-center transform transition-all duration-200 ${
                      action.disabled 
                        ? 'cursor-not-allowed opacity-50' 
                        : 'hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 active:scale-95'
                    }`}
                    title={action.label}
                    disabled={action.disabled}
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
            title={isOpen ? 'Close menu' : 'Quick messaging actions'}
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

        {/* Active Chat Info when menu is closed (shows on hover) */}
        {!isOpen && activeChat && (
          <div className="absolute bottom-20 left-0 transform -translate-x-full translate-y-4 bg-white rounded-lg shadow-xl p-4 min-w-48 border border-gray-200 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 pointer-events-none">
            <div className="flex items-center space-x-3 mb-3">
              <img src={activeChat.avatarUrl} alt={activeChat.name} className="w-8 h-8 rounded-full" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{activeChat.name}</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p>Quick actions available for this conversation</p>
            </div>
          </div>
        )}
      </div>





      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Search Messages</h3>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Search across all conversations..."
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Recent Searches</p>
                <div className="space-y-1">
                  {['contract documents', 'meeting schedule', 'invoice #1042'].map((search, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <FiSearch className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesFAB; 