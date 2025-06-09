import React, { useRef, useEffect, useState, useCallback, useMemo, memo } from "react";
import { FiVideo, FiPhone, FiMoreHorizontal, FiPaperclip, FiSend, FiSmile, FiCamera, FiImage, FiFile, FiX } from "react-icons/fi";
import OptimizedMessageBubble from "./OptimizedMessageBubble";
import IOSEmojiPicker from './EmojiPicker.jsx';
import FileAttachment from './FileAttachment.jsx';
import { useDropzone } from 'react-dropzone';

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

// Memoized components for better performance
const MemoizedMessageBubble = memo(OptimizedMessageBubble);

// Optimized file preview component
const FilePreview = memo(({ file, onRemove }) => (
  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium truncate">{file.name}</div>
      <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
    </div>
    <button
      onClick={() => onRemove(file.id)}
      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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

const OptimizedChatWindow = memo(({ chat, onVideoCall, onVoiceCall }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  
  // Refs for DOM manipulation
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Memoized combined messages to prevent unnecessary recalculations
  const allMessages = useMemo(() => {
    return [...(chat?.messages || []), ...messages].sort((a, b) => a.id - b.id);
  }, [chat?.messages, messages]);

  // Optimized scroll to bottom with requestAnimationFrame
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    });
  }, []);

  // Optimized message sending with useCallback
  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (!input.trim()) {return;}

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
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    
    // Optimized auto-scroll
    scrollToBottom();

    // Batch status updates to reduce re-renders
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
    }, 2000);
  }, [input, scrollToBottom]);

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
    
    // Reset file input
    if (e.target) {
      e.target.value = '';
    }
  }, []);

  // Optimized emoji handler
  const handleEmojiClick = useCallback((emojiData) => {
    setInput(prev => prev + emojiData.emoji);
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

  // Optimized input change handler
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

  // Optimized call handlers
  const handleVideoCallClick = useCallback(() => {
    onVideoCall?.(chat);
  }, [onVideoCall, chat]);

  const handleVoiceCallClick = useCallback(() => {
    onVoiceCall?.(chat);
  }, [onVoiceCall, chat]);

  // Effect for scrolling - optimized with dependencies
  useEffect(() => {
    scrollToBottom();
  }, [allMessages.length, scrollToBottom]);

  // Clear messages when chat changes - optimized
  useEffect(() => {
    if (chat?.id) {
      setMessages([]);
      setAttachedFiles([]);
      setShowEmojiPicker(false);
      setShowAttachmentMenu(false);
    }
  }, [chat?.id]);

  // Cleanup effect for file URLs
  useEffect(() => {
    return () => {
      attachedFiles.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [attachedFiles]);

  if (!chat) {return (
    <div className="flex flex-col h-full bg-gray-50 w-full items-center justify-center text-gray-400 text-lg">
      <div className="text-center">
        <div className="text-6xl mb-4">💬</div>
        <div className="text-xl font-medium mb-2">Select a conversation to start chatting</div>
        <div className="text-sm">Choose a contact from the list to begin messaging</div>
      </div>
    </div>
  );}

  return (
    <div className="flex flex-col h-full bg-gray-50 w-full">
      {/* Search Bar - Optimized */}
      <div className="px-6 py-3 bg-white border-b border-gray-100">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          placeholder="Search messages, contacts..."
        />
      </div>

      {/* Chat Header - Optimized */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-white min-h-[60px]">
        <img 
          src={chat.avatarUrl} 
          alt={chat.name} 
          className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm" 
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-lg truncate">{chat.name}</div>
          <div className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span> 
            Online
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button 
            className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100 transition-all"
            title="More options"
          >
            <FiMoreHorizontal className="w-5 h-5" />
          </button>
          <button 
            onClick={handleVideoCallClick}
            className="p-2 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95"
            title={`Video call ${chat.name}`}
          >
            <FiVideo className="w-5 h-5 text-gray-500 hover:text-blue-500 transition-colors" />
          </button>
          <button 
            onClick={handleVoiceCallClick}
            className="p-2 rounded-full hover:bg-green-50 transition-all transform hover:scale-105 active:scale-95"
            title={`Voice call ${chat.name}`}
          >
            <FiPhone className="w-5 h-5 text-gray-500 hover:text-green-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Messages Container - Optimized with virtual scrolling preparation */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        style={{ 
          scrollBehavior: 'smooth',
          willChange: 'scroll-position'
        }}
      >
        {allMessages.map((message) => (
          <MemoizedMessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.isSent}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attached Files Preview - Optimized */}
      {attachedFiles.length > 0 && (
        <div className="px-6 py-2 bg-white border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file) => (
              <FilePreview
                key={file.id}
                file={file}
                onRemove={removeAttachedFile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message Input - Optimized */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 relative">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          {/* Attachment Button */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleAttachmentMenu}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
              title="Attach files"
            >
              <FiPaperclip className="w-5 h-5" />
            </button>

            {/* Attachment Menu */}
            {showAttachmentMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  type="button"
                  onClick={() => {
                    imageInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <FiImage className="w-4 h-4 text-blue-500" />
                  Images
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <FiFile className="w-4 h-4 text-green-500" />
                  Documents
                </button>
              </div>
            )}

            {/* Hidden File Inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e, 'image')}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
              multiple
              onChange={(e) => handleFileSelect(e, 'document')}
              className="hidden"
            />
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Type a message..."
            />
            
            {/* Emoji Button */}
            <button
              type="button"
              onClick={toggleEmojiPicker}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-yellow-500 rounded-full hover:bg-gray-100 transition-all"
              title="Add emoji"
            >
              <FiSmile className="w-5 h-5" />
            </button>

            {/* iOS Emoji Picker */}
            <IOSEmojiPicker
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onEmojiSelect={(emoji) => {
                setInput(prev => prev + emoji);
                setShowEmojiPicker(false);
              }}
              position="top-right"
              theme="light"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            title="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
});

OptimizedChatWindow.displayName = 'OptimizedChatWindow';

export default OptimizedChatWindow; 