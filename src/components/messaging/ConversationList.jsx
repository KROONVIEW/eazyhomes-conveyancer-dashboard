import React, { useState } from 'react';
import { FiPlus, FiSearch, FiMoreHorizontal, FiX } from 'react-icons/fi';
import BroadcastComposer from './BroadcastComposer';
import '../../styles/optimized-scroll.css';

const avatarList = [
  '/images/avatars/face_1 (1).jpg',
  '/images/avatars/face_1 (2).jpg',
  '/images/avatars/face_1 (3).jpg',
  '/images/avatars/face_1 (4).jpg',
  '/images/avatars/face_1 (5).jpg',
  '/images/avatars/face_1 (6).jpg',
  '/images/avatars/face_1 (7).jpg',
  '/images/avatars/face_1 (8).jpg',
  '/images/avatars/face_1 (9).jpg',
  '/images/avatars/face_1 (10).jpg',
  '/images/avatars/face_1 (11).jpg',
  '/images/avatars/face_1 (12).jpg',
  '/images/avatars/face_1 (13).jpg',
  '/images/avatars/face_1 (14).jpg',
  '/images/avatars/face_1 (15).jpg',
  '/images/avatars/face_1 (16).jpg',
  '/images/avatars/face_1 (17).jpg',
  '/images/avatars/face_1 (18).jpg',
  '/images/avatars/face_1 (19).jpg',
  '/images/avatars/face_1 (20).jpg',
];

// Enhanced conversation data with better structure
const conversations = [
  {
    id: 0,
    name: "Firm-Wide Broadcast",
    avatarUrl: "/images/avatars/face_1 (1).jpg",
          lastMessage: "Reminder: All FICA documentation must be submitted by end of week.",
    timestamp: "14:30",
    unreadCount: 0,
    online: true,
    isPinned: true,
    isBroadcast: true,
    role: "Official Announcements"
  },
  {
    id: 1,
    name: "John Carlo",
    avatarUrl: avatarList[1],
    lastMessage: "Looking forward to our meeting.",
    timestamp: "09:31",
    unreadCount: 0,
    online: true,
    role: "Senior Conveyancer"
  },
  {
    id: 2,
    name: "Jessica Wu",
    avatarUrl: avatarList[2],
    lastMessage: "Lunch at 1 PM?",
    timestamp: "18:00",
    unreadCount: 2,
    online: true,
    role: "Junior Conveyancer"
  },
  {
    id: 3,
    name: "Project Alpha",
    avatarUrl: avatarList[3],
    lastMessage: "Deadline moved to next Friday.",
    timestamp: "19:00",
    unreadCount: 1,
    online: true,
    role: "Project Team"
  },
  {
    id: 4,
    name: "Client: Mr. Patel",
    avatarUrl: avatarList[4],
    lastMessage: "Received the documents, thank you.",
    timestamp: "20:00",
    unreadCount: 0,
    online: false,
    role: "Client"
  },
  {
    id: 5,
    name: "Team Marketing",
    avatarUrl: avatarList[5],
    lastMessage: "Campaign launch is live!",
    timestamp: "21:00",
    unreadCount: 3,
    online: true,
    role: "Marketing Team"
  },
  {
    id: 6,
    name: "Anna Kim",
    avatarUrl: avatarList[6],
    lastMessage: "Let's sync up tomorrow.",
    timestamp: "22:00",
    unreadCount: 0,
    online: true,
    role: "Senior Associate"
  },
  {
    id: 7,
    name: "Support Desk",
    avatarUrl: avatarList[7],
    lastMessage: "Your ticket has been resolved.",
    timestamp: "23:00",
    unreadCount: 0,
    online: true,
    role: "Support Team"
  }
];

const ConversationList = ({ activeId, onSelect, onUserProfileClick, chatData, userRole = 'admin', onSendBroadcast, unreadCounts = {}, newMessageCounters = {}, onNewChatCreated }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);
  const [showBroadcastComposer, setShowBroadcastComposer] = useState(false);
  const [showBroadcastFeed, setShowBroadcastFeed] = useState(false);

  // Debug logging
  console.log('ConversationList - chatData:', chatData);
  console.log('ConversationList - activeId:', activeId);

  // Convert chatData to conversations format with proper sorting
  const conversationsFromChatData = Object.values(chatData || {}).map(chat => ({
    id: chat.id,
    name: chat.name,
    avatarUrl: chat.avatarUrl,
    lastMessage: chat.messages && chat.messages.length > 0 
      ? chat.messages[0].text  // Use first message (newest) since we're adding to beginning
      : 'No messages yet',
    timestamp: chat.messages && chat.messages.length > 0 
      ? chat.messages[0].timestamp  // Use first message timestamp
      : '',
    unreadCount: unreadCounts[chat.id] || 0, // Use dynamic unread counts
    online: chat.online,
    role: chat.role,
    isBroadcast: chat.isBroadcast || false,
    isPinned: chat.isPinned || false,
    newMessageCount: newMessageCounters[chat.id] || 0,
    lastActivity: chat.lastActivity || 0
  })).sort((a, b) => {
    // First: Pinned items (Firm Broadcast) always at top
    if (a.isPinned && !b.isPinned) {return -1;}
    if (!a.isPinned && b.isPinned) {return 1;}
    
    // Then: Sort by last activity (newest first)
    if (a.lastActivity !== b.lastActivity) {
      return b.lastActivity - a.lastActivity;
    }
    
    // Finally: Sort by unread count (more unread first)
    return b.unreadCount - a.unreadCount;
  });

  // Calculate unread counts for tabs
  const personalUnreadCount = conversationsFromChatData
    .filter(conv => !conv.name.includes('Team') && !conv.name.includes('Project') && !conv.isBroadcast)
    .reduce((total, conv) => total + conv.unreadCount, 0);
    
  const teamsUnreadCount = conversationsFromChatData
    .filter(conv => conv.name.includes('Team') || conv.name.includes('Project') || conv.isBroadcast)
    .reduce((total, conv) => total + conv.unreadCount, 0);

  // Filter conversations based on active tab and search
  const filteredConversations = conversationsFromChatData.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) {return false;}
    
    switch (activeTab) {
      case 'Personal':
        return !conv.name.includes('Team') && !conv.name.includes('Project') && !conv.isBroadcast;
      case 'Teams':
        return conv.name.includes('Team') || conv.name.includes('Project') || conv.isBroadcast;
      default:
        return true;
    }
  });

  // Get broadcast messages for Teams tab
  const broadcastMessages = chatData[0]?.messages || [];

  const handleConversationClick = (conv) => {
    onSelect(conv.id);
    setShowBroadcastFeed(false);
    if (onUserProfileClick && !conv.isBroadcast) {
      // Store conversation data for potential profile viewing
    }
  };

  const handleUserAvatarClick = (e, conv) => {
    e.stopPropagation();
    if (onUserProfileClick && chatData[conv.id]) {
      onUserProfileClick(chatData[conv.id]);
    }
  };

  const [showNewPersonalChatModal, setShowNewPersonalChatModal] = useState(false);
  const [showNewTeamChatModal, setShowNewTeamChatModal] = useState(false);
  const [newChatForm, setNewChatForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Client',
    avatar: ''
  });
  const [newTeamForm, setNewTeamForm] = useState({
    name: '',
    description: '',
    members: [],
    isPrivate: false
  });

  // Mock team members for selection
  const availableTeamMembers = [
    { id: 'sarah.johnson', name: 'Sarah Johnson', role: 'Senior Conveyancer', avatar: '/images/avatars/face_1 (1).jpg' },
    { id: 'mike.chen', name: 'Mike Chen', role: 'Legal Assistant', avatar: '/images/avatars/face_1 (2).jpg' },
    { id: 'emma.davis', name: 'Emma Davis', role: 'Property Manager', avatar: '/images/avatars/face_1 (3).jpg' },
    { id: 'james.wilson', name: 'James Wilson', role: 'Compliance Officer', avatar: '/images/avatars/face_1 (4).jpg' },
    { id: 'lisa.brown', name: 'Lisa Brown', role: 'Client Relations', avatar: '/images/avatars/face_1 (5).jpg' },
    { id: 'david.taylor', name: 'David Taylor', role: 'Finance Manager', avatar: '/images/avatars/face_1 (6).jpg' }
  ];

  const handleNewPersonalChat = () => {
    setShowNewPersonalChatModal(true);
    setShowNewChatMenu(false);
  };

  const handleNewTeamChat = () => {
    setShowNewTeamChatModal(true);
    setShowNewChatMenu(false);
  };

  const handleAddTeamMember = (member) => {
    if (!newTeamForm.members.find(m => m.id === member.id)) {
      setNewTeamForm(prev => ({
        ...prev,
        members: [...prev.members, member]
      }));
    }
  };

  const handleRemoveTeamMember = (memberId) => {
    setNewTeamForm(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    }));
  };

  const handleCreatePersonalChat = () => {
    if (!newChatForm.name.trim()) {
      alert('Please enter a contact name');
      return;
    }

    // Generate new chat ID
    const newChatId = Object.keys(chatData).length + 1;
    
    // Generate avatar URL first
    const avatarUrl = newChatForm.avatar || `/images/avatars/face_1 (${Math.floor(Math.random() * 20) + 1}).jpg`;
    
    // Create new chat object
    const newChat = {
      id: newChatId,
      name: newChatForm.name.trim(),
      email: newChatForm.email.trim() || `${newChatForm.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newChatForm.phone.trim() || '+27 11 000 0000',
      role: newChatForm.role,
      avatarUrl: avatarUrl,
      online: Math.random() > 0.5, // Random online status
      messages: [
        {
          id: 1,
          text: `Hi! I'm ${newChatForm.name}. Looking forward to working with you.`,
          sender: newChatForm.name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSent: false,
          senderAvatar: avatarUrl,
          status: 'delivered'
        }
      ],
      verificationStatus: {
        identity: false,
        address: false,
        employment: false,
        fica: false
      }
    };

    // Add to chat data via parent callback
    console.log('Creating new personal chat:', newChat);
    
    // Call parent callback to add the new chat
    if (onNewChatCreated) {
      onNewChatCreated(newChatId, newChat);
    }
    
    // Reset form and close modal
    setNewChatForm({ name: '', email: '', phone: '', role: 'Client', avatar: '' });
    setShowNewPersonalChatModal(false);
    
    // Select the new chat
    onSelect(newChatId);
    
    // Show success message
    alert(`New conversation with ${newChat.name} created successfully!`);
  };

  const handleCreateTeamChat = () => {
    if (!newTeamForm.name.trim()) {
      alert('Please enter a team name');
      return;
    }

    // Generate new team chat ID
    const newTeamId = Object.keys(chatData).length + 1;
    
    // Generate avatar URL first
    const avatarUrl = `/images/avatars/face 2 (${Math.floor(Math.random() * 16) + 1}).jpg`;
    
    // Create new team chat object
    const newTeamChat = {
      id: newTeamId,
      name: newTeamForm.name.trim(),
      description: newTeamForm.description.trim(),
      avatarUrl: avatarUrl,
      isTeam: true,
      isPrivate: newTeamForm.isPrivate,
      members: newTeamForm.members,
      online: true,
      role: 'Team Chat',
      messages: [
        {
          id: 1,
          text: `Welcome to ${newTeamForm.name}! This team chat has been created for collaboration.`,
          sender: 'System',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSent: false,
          senderAvatar: avatarUrl,
          isSystem: true,
          status: 'delivered'
        }
      ]
    };

    console.log('Creating new team chat:', newTeamChat);
    
    // Call parent callback to add the new team chat
    if (onNewChatCreated) {
      onNewChatCreated(newTeamId, newTeamChat);
    }
    
    // Reset form and close modal
    setNewTeamForm({ name: '', description: '', members: [], isPrivate: false });
    setShowNewTeamChatModal(false);
    
    // Select the new team chat
    onSelect(newTeamId);
    
    // Show success message
    alert(`Team chat "${newTeamChat.name}" created successfully!`);
  };

  const handleComposeBroadcast = () => {
    setShowBroadcastComposer(true);
    setShowNewChatMenu(false);
  };

  const handleSendBroadcast = async (broadcastData) => {
    console.log('Sending broadcast:', broadcastData);
    try {
      // Call the parent's broadcast handler
      await onSendBroadcast?.(broadcastData);
      setShowBroadcastComposer(false);
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      // Keep composer open on error
    }
  };

  const handleShowBroadcastFeed = () => {
    setShowBroadcastFeed(true);
    setActiveTab('Teams');
  };

  return (
    <div className="h-full flex flex-col bg-white font-['Poppins']">
      {/* Enhanced Header with Premium Styling */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Messages</h1>
          <div className="relative">
            <button 
              onClick={() => setShowNewChatMenu(!showNewChatMenu)}
              className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              title="New conversation"
            >
              <FiPlus className="w-5 h-5" />
            </button>
            
            {/* Enhanced New Chat Menu */}
            {showNewChatMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-10">
                <button 
                  onClick={handleNewPersonalChat}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  New Personal Chat
                </button>
                <button 
                  onClick={handleNewTeamChat}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Create Team Chat
                </button>
                <hr className="my-2 border-gray-100" />
                <button 
                  onClick={handleComposeBroadcast}
                  className="w-full px-4 py-3 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium flex items-center gap-2"
                >
                  📢 Compose Broadcast
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Search Bar with Animation */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-500"
          />
        </div>
      </div>

      {/* Enhanced Tabs with Unread Count Badges */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {['All', 'Personal', 'Teams'].map((tab) => {
            const getUnreadCount = () => {
              if (tab === 'Personal') {return personalUnreadCount;}
              if (tab === 'Teams') {return teamsUnreadCount;}
              return 0; // No count for 'All' tab as requested
            };
            
            const unreadCount = getUnreadCount();
            
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowBroadcastFeed(false);
                }}
                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-sm transform scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab}
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Teams Tab - Enhanced Broadcast Section */}
      {activeTab === 'Teams' && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <button
            onClick={handleShowBroadcastFeed}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              showBroadcastFeed
                ? 'border-purple-500 bg-purple-100 shadow-md'
                : 'border-purple-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg text-white">
                📢
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-purple-900">Firm Announcements</div>
                <div className="text-sm text-purple-600">
                  {broadcastMessages.length} official broadcasts
                </div>
              </div>
              {broadcastMessages.some(msg => msg.unread) && (
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Enhanced Conversation List or Broadcast Feed */}
      <div 
        className="flex-1 overflow-y-auto conversation-list-container"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          willChange: 'scroll-position',
          contain: 'layout style paint'
        }}
      >
        {showBroadcastFeed ? (
          // Dedicated Broadcast Feed
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Official Broadcasts</h3>
              <button
                onClick={() => setShowBroadcastFeed(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Back to conversations
              </button>
            </div>
            
            {broadcastMessages.length > 0 ? (
              <div className="space-y-3">
                {broadcastMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-purple-700">
                        📢 {message.sender}
                      </span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className="text-sm text-gray-900 font-medium mb-1">
                      {message.subject || 'Official Announcement'}
                    </div>
                    <div className="text-sm text-gray-700">{message.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📢</div>
                <p className="text-lg font-medium mb-2">No broadcasts yet</p>
                <p className="text-sm">Official announcements will appear here</p>
              </div>
            )}
          </div>
        ) : (
          // Regular Conversation List
          <div className="space-y-1 p-2">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleConversationClick(conv)}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] conversation-item ${
                  activeId === conv.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 border-l-4 border-blue-500 shadow-sm'
                    : 'hover:bg-gray-50 hover:shadow-sm'
                }`}
                style={{
                  contain: 'layout style paint',
                  transform: 'translateZ(0)',
                  willChange: 'background-color'
                }}
              >
                {/* Pinned Indicator for Broadcast */}
                {conv.isPinned && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}

                <div className="flex items-center space-x-3">
                  {/* Enhanced Avatar with Online Indicator */}
                  <div 
                    className="relative cursor-pointer transform transition-transform hover:scale-110"
                    onClick={(e) => handleUserAvatarClick(e, conv)}
                  >
                    <img
                      src={conv.avatarUrl}
                      alt={conv.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md conversation-avatar-optimized"
                      style={{
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        contain: 'layout'
                      }}
                    />
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                    )}
                    {conv.isBroadcast && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        📢
                      </div>
                    )}
                  </div>

                  {/* Enhanced Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold truncate ${
                        activeId === conv.id ? 'text-blue-900' : 'text-gray-900'
                      } ${conv.unreadCount > 0 ? 'font-bold' : ''}`}>
                        {conv.name}
                      </h3>
                      <span className={`text-xs ${
                        activeId === conv.id ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {conv.timestamp}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${
                        conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'
                      }`}>
                        {conv.isBroadcast && '📢 '}
                        {conv.lastMessage}
                      </p>
                      
                      {/* Enhanced Unread Badge */}
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full animate-bounce">
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Role/Type Indicator */}
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        conv.isBroadcast 
                          ? 'bg-purple-100 text-purple-700'
                          : conv.role === 'Client'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {conv.role}
                      </span>
                    </div>
                  </div>

                  {/* More Options */}
                  <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-200">
                    <FiMoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!showBroadcastFeed && filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg font-medium mb-2">No conversations found</p>
            <p className="text-sm text-center px-8">
              {searchQuery ? 'Try adjusting your search terms' : 'Start a new conversation to get chatting!'}
            </p>
          </div>
        )}
      </div>

      {/* Broadcast Composer Modal */}
      <BroadcastComposer
        isOpen={showBroadcastComposer}
        onClose={() => setShowBroadcastComposer(false)}
        onSendBroadcast={handleSendBroadcast}
        userRole={userRole}
      />

      {/* New Personal Chat Modal */}
      {showNewPersonalChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">New Personal Chat</h3>
              <button 
                onClick={() => setShowNewPersonalChatModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                <input
                  type="text"
                  value={newChatForm.name}
                  onChange={(e) => setNewChatForm({...newChatForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact name"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newChatForm.email}
                  onChange={(e) => setNewChatForm({...newChatForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="contact@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newChatForm.phone}
                  onChange={(e) => setNewChatForm({...newChatForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+27 11 000 0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newChatForm.role}
                  onChange={(e) => setNewChatForm({...newChatForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Client">Client</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Partner">Partner</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewPersonalChatModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePersonalChat}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Team Chat Modal */}
      {showNewTeamChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create Team Chat</h3>
              <button 
                onClick={() => setShowNewTeamChatModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Name *</label>
                <input
                  type="text"
                  value={newTeamForm.name}
                  onChange={(e) => setNewTeamForm({...newTeamForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter team name"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTeamForm.description}
                  onChange={(e) => setNewTeamForm({...newTeamForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the team purpose"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                
                {/* Selected Members */}
                {newTeamForm.members.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-2">Selected ({newTeamForm.members.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {newTeamForm.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-lg">
                          <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full" />
                          <span className="text-xs text-blue-700">{member.name}</span>
                          <button
                            onClick={() => handleRemoveTeamMember(member.id)}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Available Members */}
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                  {availableTeamMembers.filter(member => !newTeamForm.members.find(m => m.id === member.id)).map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer" onClick={() => handleAddTeamMember(member)}>
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm">Add</button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newTeamForm.isPrivate}
                    onChange={(e) => setNewTeamForm({...newTeamForm, isPrivate: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Private team (invite only)</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewTeamChatModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeamChat}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationList; 