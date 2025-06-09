import React, { useRef, useEffect, useState } from "react";
import { FiVideo, FiPhone, FiMoreHorizontal, FiPaperclip, FiSend, FiSmile, FiCamera, FiChevronDown } from "react-icons/fi";
import MessageBubble from "./MessageBubble";

const CURRENT_USER_AVATAR = '/images/avatars/face 2 (2).jpg';

const EnhancedChatWindow = ({ chat, onVideoCall, onVoiceCall }) => {
  const [input, setInput] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !chat) {return;}

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

    // Add message to user messages
    setUserMessages(prev => [...prev, newMessage]);
    setInput("");
    
    // Auto-scroll to bottom
    setTimeout(() => scrollToBottom("smooth"), 100);
    
    console.log('📤 Message sent:', newMessage);

    // Simulate message status updates
    setTimeout(() => {
      setUserMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setUserMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
  };

  const handleVideoCall = () => {
    if (chat) {
      console.log(`📹 Video call initiated from header with ${chat.name}`);
      onVideoCall?.(chat);
    }
  };

  const handleVoiceCall = () => {
    if (chat) {
      console.log(`📞 Voice call initiated from header with ${chat.name}`);
      onVoiceCall?.(chat);
    }
  };

  // Enhanced scroll to bottom with smooth behavior
  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior, 
        block: "end",
        inline: "nearest"
      });
    }
  };

  // Check if user is scrolled to bottom
  const checkScrollPosition = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold
      setIsScrolledToBottom(isAtBottom);
      setShowScrollToBottom(!isAtBottom && getAllMessages().length > 5);
    }
  };

  // Get all messages (chat + user messages)
  const getAllMessages = () => {
    const chatMessages = chat?.messages || [];
    const allMessages = [...chatMessages, ...userMessages].sort((a, b) => a.id - b.id);
    return allMessages;
  };

  // Handle typing indicator
  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Show typing indicator
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isScrolledToBottom) {
      setTimeout(() => scrollToBottom("smooth"), 100);
    }
  }, [userMessages, chat?.messages]);

  // Scroll to bottom when chat changes (new conversation)
  useEffect(() => {
    if (chat) {
      setUserMessages([]); // Clear user messages when switching chats
      setTimeout(() => scrollToBottom("auto"), 50);
      setIsScrolledToBottom(true);
      setShowScrollToBottom(false);
    }
  }, [chat?.id]);

  if (!chat) {return (
    <div className="flex flex-col h-full bg-gray-50 w-full items-center justify-center text-gray-400 text-lg">
      <div className="text-center">
        <div className="text-6xl mb-4">💬</div>
        <div className="text-xl font-medium mb-2">Select a conversation to start chatting</div>
        <div className="text-sm">Choose a contact from the list to begin messaging</div>
      </div>
    </div>
  );}

  const allMessages = getAllMessages();

  return (
    <div className="flex flex-col h-full bg-gray-50 w-full">
      {/* Search Bar */}
      <div className="px-6 py-3 bg-white border-b border-gray-100">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          placeholder="Search messages, contacts..."
        />
      </div>

      {/* Chat Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-white min-h-[60px]">
        <img 
          src={chat.avatarUrl} 
          alt={chat.name} 
          className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm" 
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-lg truncate">{chat.name}</div>
          <div className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span> 
            {chat.online ? 'Online' : chat.lastSeen}
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
            onClick={handleVideoCall}
            className="p-2 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95"
            title={`Video call ${chat.name}`}
          >
            <FiVideo className="w-5 h-5 text-gray-500 hover:text-blue-500 transition-colors" />
          </button>
          <button 
            onClick={handleVoiceCall}
            className="p-2 rounded-full hover:bg-green-50 transition-all transform hover:scale-105 active:scale-95"
            title={`Voice call ${chat.name}`}
          >
            <FiPhone className="w-5 h-5 text-gray-500 hover:text-green-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50 scroll-smooth"
        onScroll={checkScrollPosition}
        style={{
          scrollBehavior: 'smooth',
          overflowAnchor: 'none'
        }}
      >
        <div className="flex flex-col gap-4 w-full">
          {allMessages.map(msg => (
            <MessageBubble
              key={msg.id}
              {...msg}
              senderAvatar={msg.isSent ? CURRENT_USER_AVATAR : chat.avatarUrl}
              status={msg.status}
            />
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>You are typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Scroll to Bottom Button */}
        {showScrollToBottom && (
          <button
            onClick={() => scrollToBottom("smooth")}
            className="fixed bottom-32 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-40 flex items-center justify-center group transform hover:scale-110 active:scale-95"
            title="Scroll to bottom"
          >
            <FiChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Message Input */}
      <form className="flex items-center gap-2 px-6 py-4 border-t bg-white w-full" onSubmit={handleSendMessage}>
        <button 
          type="button" 
          className="p-2 text-gray-400 hover:text-blue-500 transition-all rounded-full hover:bg-blue-50 transform hover:scale-105 active:scale-95"
          title="Attach file"
          onClick={() => console.log('📎 Attach file clicked')}
        >
          <FiPaperclip className="w-5 h-5" />
        </button>
        
        <div className="relative flex-1 min-w-0 flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none px-2 py-1 text-base placeholder-gray-500"
            placeholder="Type a message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          
          <button 
            type="button" 
            className="p-2 text-gray-400 hover:text-yellow-500 transition-all rounded-full hover:bg-yellow-50 transform hover:scale-105 active:scale-95"
            title="Add emoji"
            onClick={() => console.log('😊 Emoji picker clicked')}
          >
            <FiSmile className="w-5 h-5" />
          </button>
          
          <button 
            type="button" 
            className="p-2 text-gray-400 hover:text-purple-500 transition-all rounded-full hover:bg-purple-50 transform hover:scale-105 active:scale-95"
            title="Take photo"
            onClick={() => console.log('📷 Camera clicked')}
          >
            <FiCamera className="w-5 h-5" />
          </button>
          
          {input.trim() && (
            <button 
              type="submit" 
              className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              title="Send message"
            >
              <FiSend className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedChatWindow; 