import { useState, useCallback, useEffect } from 'react';
import { chatData } from '../data/mockMessagesData';
import broadcastService from '../services/broadcastService';
import audioManager from '../utils/audioUtils';

export const useMessagesState = () => {
  // Core state
  const [activeConversationId, setActiveConversationId] = useState(99);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [dynamicChatData, setDynamicChatData] = useState(chatData);

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [newMessageCounters, setNewMessageCounters] = useState({});
  const [lastReadMessages, setLastReadMessages] = useState({});

  // Audio management
  const playNotificationSound = useCallback(() => {
    if (notificationsEnabled) {
      audioManager.playNotificationSound();
    }
  }, [notificationsEnabled]);

  // Message generation and notifications
  const generateNotification = useCallback(() => {
    const conversations = Object.values(dynamicChatData).filter(conv => conv.id !== 0);
    if (conversations.length === 0) {return;}

    const randomConv = conversations[Math.floor(Math.random() * conversations.length)];
    const messageTemplates = [
      "Quick update on the property transfer",
      "Client has some questions about the process",
      "Documents are ready for review",
      "Meeting scheduled for tomorrow",
      "Need your input on this matter"
    ];

    const newMessage = {
      id: Date.now(),
      text: messageTemplates[Math.floor(Math.random() * messageTemplates.length)],
      sender: randomConv.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: false,
      senderAvatar: randomConv.avatarUrl,
      status: "delivered"
    };

    setDynamicChatData(prev => ({
      ...prev,
      [randomConv.id]: {
        ...prev[randomConv.id],
        messages: [...prev[randomConv.id].messages, newMessage]
      }
    }));

    // Update unread counts
    setUnreadCounts(prev => ({
      ...prev,
      [randomConv.id]: (prev[randomConv.id] || 0) + 1
    }));

    // Update new message counters
    setNewMessageCounters(prev => ({
      ...prev,
      [randomConv.id]: (prev[randomConv.id] || 0) + 1
    }));

    playNotificationSound();
  }, [dynamicChatData, playNotificationSound]);

  // Call handlers
  const handleVideoCall = useCallback((chat) => {
    setSelectedUserData(chat);
    setShowVideoCall(true);
    setShowVoiceCall(false);
  }, []);

  const handleVoiceCall = useCallback((chat) => {
    setSelectedUserData(chat);
    setShowVoiceCall(true);
    setShowVideoCall(false);
  }, []);

  const handleCallEnd = useCallback(() => {
    setShowVideoCall(false);
    setShowVoiceCall(false);
    setSelectedUserData(null);
  }, []);

  // User profile handlers
  const handleUserProfileClick = useCallback((user) => {
    setSelectedUserData(user);
    setShowUserProfile(true);
  }, []);

  const handleCloseUserProfile = useCallback(() => {
    setShowUserProfile(false);
    setSelectedUserData(null);
  }, []);

  // Broadcast handler
  const handleSendBroadcast = useCallback(async (broadcastMessage) => {
    try {
      await broadcastService.sendBroadcast(broadcastMessage);
      
      const newBroadcastMessage = {
        id: Date.now(),
        text: broadcastMessage.message,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBroadcast: true,
        priority: broadcastMessage.priority || "normal",
        subject: broadcastMessage.subject,
        recipients: broadcastMessage.recipients,
        status: "delivered",
        readBy: []
      };

      setDynamicChatData(prev => ({
        ...prev,
        0: {
          ...prev[0],
          messages: [...prev[0].messages, newBroadcastMessage]
        }
      }));

      return { success: true };
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Message sending
  const handleSendMessage = useCallback((conversationId, messageText, attachments = []) => {
    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      senderAvatar: "/images/avatars/face 2 (2).jpg",
      status: "delivered",
      attachments: attachments
    };

    setDynamicChatData(prev => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        messages: [...prev[conversationId].messages, newMessage]
      }
    }));
  }, []);

  // Mark messages as read
  const markAsRead = useCallback((conversationId) => {
    setUnreadCounts(prev => ({
      ...prev,
      [conversationId]: 0
    }));
    
    setNewMessageCounters(prev => ({
      ...prev,
      [conversationId]: 0
    }));

    const conversation = dynamicChatData[conversationId];
    if (conversation && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      setLastReadMessages(prev => ({
        ...prev,
        [conversationId]: lastMessage.id
      }));
    }
  }, [dynamicChatData]);

  // Auto-generate notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        generateNotification();
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [generateNotification]);

  // Mark active conversation as read when it changes
  useEffect(() => {
    if (activeConversationId !== null) {
      markAsRead(activeConversationId);
    }
  }, [activeConversationId, markAsRead]);

  return {
    // State
    activeConversationId,
    setActiveConversationId,
    showUserProfile,
    selectedUserData,
    showVideoCall,
    showVoiceCall,
    dynamicChatData,
    notificationsEnabled,
    setNotificationsEnabled,
    unreadCounts,
    newMessageCounters,
    lastReadMessages,

    // Handlers
    handleVideoCall,
    handleVoiceCall,
    handleCallEnd,
    handleUserProfileClick,
    handleCloseUserProfile,
    handleSendBroadcast,
    handleSendMessage,
    markAsRead,
    playNotificationSound,
  };
}; 