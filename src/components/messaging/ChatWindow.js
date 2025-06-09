import React, { useRef, useEffect, useState, useCallback, useMemo, memo } from "react";
import { FiVideo, FiPhone, FiMoreHorizontal, FiPaperclip, FiSend, FiSmile, FiCamera, FiImage, FiFile, FiX, FiCheck, FiSearch } from "react-icons/fi";
import MessageBubble from "./MessageBubble.jsx";
import IOSEmojiPicker from './EmojiPicker.jsx';
import FileAttachment from './FileAttachment.jsx';
import { useDropzone } from 'react-dropzone';
import MessageThread from './MessageThread';
import AdvancedSearch from './AdvancedSearch';

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

const CURRENT_USER_AVATAR = '/images/avatars/face 2 (2).jpg';

// Enhanced Message Status Component (WhatsApp-like)
const MessageStatus = memo(({ status, isSent }) => {
  if (!isSent) {return null;}
  
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <FiCheck className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <FiCheck className="w-3 h-3 text-gray-400" />
            <FiCheck className="w-3 h-3 text-gray-400" />
          </div>
        );
      case 'read':
        return (
          <div className="flex -space-x-1">
            <FiCheck className="w-3 h-3 text-blue-500" />
            <FiCheck className="w-3 h-3 text-blue-500" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-end mt-1">
      {getStatusIcon()}
    </div>
  );
});

// Enhanced Message Bubble Component
const EnhancedMessageBubble = memo(({ message, isOwn, showAvatar, senderName }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  
  return (
    <div className={`flex items-end space-x-2 mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for received messages */}
      {!isOwn && showAvatar && (
        <img
          src={message.senderAvatar}
          alt={senderName}
          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
        />
      )}
      
      {/* Message Container */}
      <div className={`relative max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        {/* Sender Name for group chats */}
        {!isOwn && senderName && (
          <p className="text-xs text-gray-500 mb-1 ml-3">{senderName}</p>
        )}
        
        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
            isOwn
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
              : message.isBroadcast
              ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-900 border border-purple-300 rounded-bl-md'
              : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
          }`}
        >
          {/* Broadcast Indicator */}
          {message.isBroadcast && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-300">
              <span className="text-xs font-semibold text-purple-700">📢 {message.sender}</span>
            </div>
          )}
          
          {/* Message Content */}
          <p className="text-sm leading-relaxed break-words">{message.text}</p>
          
          {/* Attachment Indicator */}
          {message.hasAttachment && (
            <div className={`mt-2 p-2 rounded-lg ${
              isOwn ? 'bg-blue-400/30' : 'bg-gray-100'
            }`}>
              <div className="flex items-center gap-2">
                <FiFile className="w-4 h-4" />
                <span className="text-xs">Document attached</span>
              </div>
            </div>
          )}
          
          {/* Timestamp and Status */}
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${
              isOwn ? 'text-blue-100' : message.isBroadcast ? 'text-purple-600' : 'text-gray-500'
            }`}>
              {message.timestamp}
            </span>
            <MessageStatus status={message.status} isSent={isOwn} />
          </div>
          
          {/* Context Menu Button */}
          <button
            onClick={() => setShowContextMenu(!showContextMenu)}
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-full transition-all duration-200 ${
              isOwn ? 'hover:bg-blue-400/30' : 'hover:bg-gray-100'
            }`}
          >
            <FiMoreHorizontal className="w-3 h-3" />
          </button>
          
          {/* Context Menu */}
          {showContextMenu && (
            <div className="absolute top-8 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[150px] z-10">
              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Reply</button>
              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Copy Text</button>
              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Forward</button>
              {isOwn && (
                <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Delete</button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Spacer for sent messages */}
      {isOwn && <div className="w-8" />}
    </div>
  );
});

// Memoized components for better performance
const MemoizedMessageBubble = memo(MessageBubble);

// Optimized file preview component
const FilePreview = memo(({ file, onRemove }) => (
  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium truncate text-gray-900">{file.name}</div>
      <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
    </div>
    <button
      onClick={() => onRemove(file.id)}
      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
    >
      <FiX className="w-4 h-4" />
    </button>
  </div>
));

// Format file size utility (moved outside component to prevent recreation)
const formatFileSize = (bytes) => {
  if (bytes === 0) {return '0 Bytes';}
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ChatWindow = ({ chat, onVideoCall, onVoiceCall, onUserProfileClick }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [messageReactions, setMessageReactions] = useState({});
  
  // Refs for DOM manipulation
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Memoized combined messages to prevent unnecessary recalculations
  const allMessages = useMemo(() => {
    console.log('ChatWindow - chat:', chat);
    console.log('ChatWindow - chat.messages:', chat?.messages);
    console.log('ChatWindow - local messages:', messages);
    const combined = [...(chat?.messages || []), ...messages].sort((a, b) => a.id - b.id);
    console.log('ChatWindow - allMessages:', combined);
    return combined;
  }, [chat?.messages, messages]);

  // Optimized scroll to bottom with requestAnimationFrame for 60fps
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      });
    }
  }, []);

  // Enhanced message sending with better UX
  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (!input.trim() && attachedFiles.length === 0) {return;}

    const newMessage = {
      id: Date.now(),
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      isSent: true,
      senderAvatar: CURRENT_USER_AVATAR,
      status: 'sent',
      hasAttachment: attachedFiles.length > 0,
      attachments: attachedFiles
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setAttachedFiles([]);
    
    // Optimized auto-scroll
    scrollToBottom();

    // Simulate message status updates
    const messageId = newMessage.id;
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'read' } : msg
      ));
    }, 2500);
  }, [input, attachedFiles, scrollToBottom]);

  // Enhanced typing simulation
  useEffect(() => {
    if (input.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [input]);

  // Optimized file selection handler
  const handleFileSelect = useCallback((e, type) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      type,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));
    
    setAttachedFiles(prev => [...prev, ...newFiles]);
    setShowAttachmentMenu(false);
    
    // Reset file input
    if (e.target) {
      e.target.value = '';
    }
  }, []);

  // Optimized emoji handler
  const handleEmojiClick = useCallback((emojiData) => {
    console.log('🔍 Emoji data received:', emojiData);
    // Handle both emoji string and emoji object formats
    const emoji = typeof emojiData === 'string' ? emojiData : emojiData.emoji;
    console.log('😊 Adding emoji:', emoji);
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  }, []);

  // Optimized file removal
  const removeAttachedFile = useCallback((fileId) => {
    setAttachedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up object URLs
      const removed = prev.find(f => f.id === fileId);
      if (removed?.url) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  }, []);

  // Enhanced input change handler with typing indicator
  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  // Optimized toggle handlers
  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
    setShowAttachmentMenu(false);
  }, []);

  const toggleAttachmentMenu = useCallback(() => {
    setShowAttachmentMenu(prev => !prev);
    setShowEmojiPicker(false);
  }, []);

  // Enhanced call handlers with tooltips
  const handleVideoCallClick = useCallback(() => {
    onVideoCall?.(chat);
  }, [onVideoCall, chat]);

  const handleVoiceCallClick = useCallback(() => {
    onVoiceCall?.(chat);
  }, [onVoiceCall, chat]);

  // User profile click handler
  const handleUserProfileClick = useCallback(() => {
    if (onUserProfileClick && chat) {
      onUserProfileClick(chat);
    }
  }, [onUserProfileClick, chat]);

  // Effect for scrolling
  useEffect(() => {
    scrollToBottom();
  }, [chat, scrollToBottom]);

  // Clear messages when chat changes - optimized
  useEffect(() => {
    setMessages([]);
    setAttachedFiles([]);
    setInput("");
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
    // Reset thread state when switching chats
    setShowThread(false);
    setSelectedMessage(null);
    setThreadMessages([]);
  }, [chat?.id]);

  // Phase 3: Advanced Features Handlers
  const handleAddReaction = useCallback((messageId, emoji, userId) => {
    setMessageReactions(prev => {
      const messageReactions = prev[messageId] || [];
      const existingReaction = messageReactions.find(r => r.emoji === emoji);
      
      if (existingReaction) {
        if (!existingReaction.users.includes(userId)) {
          existingReaction.users.push(userId);
        }
      } else {
        messageReactions.push({
          emoji,
          users: [userId]
        });
      }
      
      return {
        ...prev,
        [messageId]: [...messageReactions]
      };
    });
  }, []);

  const handleRemoveReaction = useCallback((messageId, emoji, userId) => {
    setMessageReactions(prev => {
      const messageReactions = prev[messageId] || [];
      const updatedReactions = messageReactions.map(reaction => {
        if (reaction.emoji === emoji) {
          return {
            ...reaction,
            users: reaction.users.filter(id => id !== userId)
          };
        }
        return reaction;
      }).filter(reaction => reaction.users.length > 0);
      
      return {
        ...prev,
        [messageId]: updatedReactions
      };
    });
  }, []);

  const handleStartThread = useCallback((message) => {
    console.log('Starting thread for message:', message);
    
    if (!message || !message.id) {
      console.error('Invalid message passed to handleStartThread:', message);
      return;
    }
    
    setSelectedMessage(message);
    setThreadMessages([]); // In real app, fetch thread messages from backend
    setShowThread(true);
  }, []);

  const handleSendThreadReply = useCallback(async (reply) => {
    console.log('Sending thread reply:', reply);
    setThreadMessages(prev => [...prev, reply]);
    // In real app, send to backend
  }, []);

  const handleCopyMessage = useCallback((message) => {
    navigator.clipboard.writeText(message.text);
    console.log('Message copied to clipboard');
  }, []);

  const handleDeleteMessage = useCallback((message) => {
    console.log('Deleting message:', message.id);
    // In real app, send delete request to backend
  }, []);

  const handleForwardMessage = useCallback((message) => {
    console.log('Forwarding message:', message.id);
    // In real app, open forward dialog
  }, []);

  const handleSearchMessage = useCallback((result) => {
    console.log('Navigating to message:', result);
    // In real app, scroll to message and highlight it
  }, []);

  // Enhanced empty state
  if (!chat) {return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white w-full items-center justify-center text-gray-400 text-lg">
      <div className="text-center p-8 max-w-md">
        <div className="text-6xl mb-6 opacity-50 animate-pulse">💬</div>
        <div className="text-2xl font-light mb-3 text-gray-600">Welcome to Messages</div>
        <div className="text-sm text-gray-500 leading-relaxed">
          Select a conversation from the sidebar to start chatting with your colleagues and clients.
        </div>
      </div>
    </div>
  );}

  return (
    <div className="flex flex-col h-full bg-white w-full font-['Poppins']">
      {/* Enhanced Chat Header with Premium Styling */}
      <div className="px-6 py-4 bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          {/* User Info - Clickable for Profile */}
          <div 
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -m-2 transition-all duration-200"
            onClick={handleUserProfileClick}
          >
            <div className="relative">
              <img 
                src={chat.avatarUrl} 
                alt={chat.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md hover:shadow-lg transition-shadow duration-200" 
                loading="lazy"
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              )}
      </div>
        <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 text-lg truncate hover:text-blue-600 transition-colors">
                {chat.name}
              </div>
              <div className="flex items-center gap-2">
                {chat.online ? (
                  <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 
                    Online
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">Last seen recently</div>
                )}
                {isTyping && (
                  <div className="text-xs text-blue-600 font-medium animate-pulse">
                    typing...
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setShowAdvancedSearch(true)}
              className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              title="Advanced search"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <button 
              onClick={handleVideoCallClick}
              className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              title="Start video call"
            >
              <FiVideo className="w-5 h-5" />
            </button>
            <button 
              onClick={handleVoiceCallClick}
              className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              title="Start voice call"
            >
              <FiPhone className="w-5 h-5" />
            </button>
            <button className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              title="More options"
            >
              <FiMoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Messages Container with Better Scrolling */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-2 bg-gradient-to-b from-gray-50/30 to-white"
        style={{ 
          scrollBehavior: 'smooth',
          willChange: 'scroll-position',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        {allMessages.map((message, index) => {
          const isOwn = message.isSent || message.sender === 'You';
          // Show avatar for all non-own messages (simpler and more reliable)
          const showAvatar = !isOwn;
          
          // Check if this is the start of new messages
          const isFirstNewMessage = message.isNewNotification && 
            (index === 0 || !allMessages[index - 1]?.isNewNotification);
          
          // Count consecutive new messages from this point
          let newMessageCount = 0;
          if (isFirstNewMessage) {
            for (let i = index; i < allMessages.length && allMessages[i]?.isNewNotification; i++) {
              newMessageCount++;
            }
          }
          
          return (
            <div key={message.id} className="group">
              {/* New Messages Line Breaker */}
              {isFirstNewMessage && (
                <div className="flex items-center justify-center my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
                  <div className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg animate-pulse">
                    {newMessageCount} new message{newMessageCount > 1 ? 's' : ''}
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-red-300 via-transparent to-transparent"></div>
                </div>
              )}
              
              <MemoizedMessageBubble
                message={{
                  ...message,
                  reactions: messageReactions[message.id] || []
                }}
                isOwn={isOwn}
                onAddReaction={handleAddReaction}
                onRemoveReaction={handleRemoveReaction}
                onStartThread={handleStartThread}
                onCopyMessage={handleCopyMessage}
                onDeleteMessage={handleDeleteMessage}
                onForwardMessage={handleForwardMessage}
                currentUserId="user1"
                showAvatar={showAvatar}
                threadCount={0} // In real app, get from backend
              />
            </div>
          );
        })}
          <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Message Input Area */}
      <div className="p-6 border-t border-gray-100 bg-white">
        {/* File Previews */}
        {attachedFiles.length > 0 && (
          <div className="mb-4 space-y-2">
            {attachedFiles.map((file) => (
              <FilePreview key={file.id} file={file} onRemove={removeAttachedFile} />
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          {/* Attachment Button */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleAttachmentMenu}
              className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              title="Attach file"
            >
              <FiPaperclip className="w-5 h-5" />
            </button>
            
            {/* Enhanced Attachment Menu */}
            {showAttachmentMenu && (
              <div className="absolute bottom-14 left-0 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[180px] z-10">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <FiFile className="w-4 h-4 text-blue-500" />
                  Document
                </button>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <FiImage className="w-4 h-4 text-green-500" />
                  Image
                </button>
                <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <FiCamera className="w-4 h-4 text-purple-500" />
                  Camera
                </button>
              </div>
            )}
          </div>

      {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={handleInputChange}
            placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-500 resize-none max-h-32"
              rows="1"
              style={{ minHeight: '48px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            
            {/* Emoji Button */}
            <button
              type="button"
              onClick={toggleEmojiPicker}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-all duration-200"
              title="Add emoji"
            >
              <FiSmile className="w-4 h-4" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() && attachedFiles.length === 0}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed"
            title="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>

        {/* Enhanced Emoji Picker */}
        <IOSEmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiClick}
          position="top-right"
          theme="light"
        />
        </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
        onChange={(e) => handleFileSelect(e, 'document')}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'image')}
        className="hidden"
      />

      {/* Phase 3 Modals */}
      <MessageThread
        isOpen={showThread}
        onClose={() => {
          setShowThread(false);
          setSelectedMessage(null);
        }}
        parentMessage={selectedMessage}
        threadMessages={threadMessages}
        onSendReply={handleSendThreadReply}
        currentUserId="user1"
        onAddReaction={handleAddReaction}
        onRemoveReaction={handleRemoveReaction}
      />

      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        chatData={{ [chat?.id]: chat }} // In real app, pass all chat data
        onSelectMessage={handleSearchMessage}
        onSelectConversation={() => {}}
      />
    </div>
  );
};

export default ChatWindow; 