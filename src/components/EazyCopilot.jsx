import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PaperAirplaneIcon, ExclamationTriangleIcon, PlusIcon, XMarkIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { marked } from 'marked';
import aiService from '../services/aiService';

// Modern Brain Logo SVG Component
const BrainIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.89 2 10 2.89 10 4C10 4.74 10.4 5.4 11 5.73V6.27C10.4 6.6 10 7.26 10 8C10 8.74 10.4 9.4 11 9.73V10.27C10.4 10.6 10 11.26 10 12C10 12.74 10.4 13.4 11 13.73V14.27C10.4 14.6 10 15.26 10 16C10 17.11 10.89 18 12 18C13.11 18 14 17.11 14 16C14 15.26 13.6 14.6 13 14.27V13.73C13.6 13.4 14 12.74 14 12C14 11.26 13.6 10.6 13 10.27V9.73C13.6 9.4 14 8.74 14 8C14 7.26 13.6 6.6 13 6.27V5.73C13.6 5.4 14 4.74 14 4C14 2.89 13.11 2 12 2M8 6C6.89 6 6 6.89 6 8C6 8.74 6.4 9.4 7 9.73V10.27C6.4 10.6 6 11.26 6 12C6 12.74 6.4 13.4 7 13.73V14.27C6.4 14.6 6 15.26 6 16C6 17.11 6.89 18 8 18C8.74 18 9.4 17.6 9.73 17H10.27C10.6 17.6 11.26 18 12 18C12.74 18 13.4 17.6 13.73 17H14.27C14.6 17.6 15.26 18 16 18C17.11 18 18 17.11 18 16C18 15.26 17.6 14.6 17 14.27V13.73C17.6 13.4 18 12.74 18 12C18 11.26 17.6 10.6 17 10.27V9.73C17.6 9.4 18 8.74 18 8C18 6.89 17.11 6 16 6C15.26 6 14.6 6.4 14.27 7H13.73C13.4 6.4 12.74 6 12 6C11.26 6 10.6 6.4 10.27 7H9.73C9.4 6.4 8.74 6 8 6Z"/>
  </svg>
);

// Enhanced Typing Animation with smooth dots
const TypingLoader = () => (
  <div className="flex items-center justify-start mb-6">
    <div className="flex items-center space-x-3 bg-white rounded-3xl px-6 py-4 shadow-sm border border-gray-100">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
        <BrainIcon className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <span className="text-sm text-gray-600 font-medium">EazyCopilot is thinking...</span>
    </div>
  </div>
);

// Configure marked for clean rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Modern Message Component with Streaming Support and Attachments
const Message = ({ message, isUser, timestamp, isStreaming = false, attachments = [] }) => {
  const renderContent = () => {
    if (isUser) {
      return <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>;
    } else {
      // Render markdown for AI responses
      const htmlContent = marked(message);
      return (
        <div 
          className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[85%] lg:max-w-[70%] ${
        isUser 
          ? 'bg-purple-600 text-white rounded-3xl rounded-br-lg px-6 py-4' 
          : 'bg-white text-gray-800 rounded-3xl rounded-bl-lg px-6 py-4 shadow-sm border border-gray-100'
      }`}>
        {!isUser && (
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-3">
              <BrainIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-purple-600 tracking-wide">EAZYCOPILOT</span>
          </div>
        )}
        <div className="relative">
          {/* Render attachments for user messages */}
          {isUser && attachments && attachments.length > 0 && (
            <div className="mb-3 space-y-2">
              {attachments.map((attachment) => {
                const FileIcon = attachment.type.startsWith('image/') ? PhotoIcon : DocumentIcon;
                return (
                  <div key={attachment.id} className="flex items-center space-x-3 bg-purple-500/20 rounded-lg p-3">
                    {attachment.preview ? (
                      <img 
                        src={attachment.preview} 
                        alt={attachment.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <FileIcon className="w-8 h-8 text-purple-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-purple-100 truncate">{attachment.name}</p>
                      <p className="text-xs text-purple-200">{formatFileSize(attachment.size)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {renderContent()}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-purple-600 ml-1 animate-pulse rounded-sm"></span>
          )}
        </div>
        <p className={`text-xs mt-3 ${isUser ? 'text-purple-100' : 'text-gray-400'}`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

// Modern Floating Welcome Box (Gemini-inspired)
const WelcomeMessage = ({ userName = "Kabelo", onSuggestionClick }) => (
  <div className="flex items-center justify-center min-h-[60vh] px-4">
    <div className="text-center max-w-2xl">
      {/* Floating Welcome Box */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Brain Logo */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
            <BrainIcon className="w-8 h-8 text-white" />
          </div>
          
          {/* Greeting */}
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            Hello, <span className="font-medium text-purple-600">{userName}</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-8 font-light">
            How can I help you today?
          </p>
          
          {/* Suggested Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
            {[
              "Can a seller cancel after OTP is signed?",
              "How do I complete the FICA form?",
              "What does 'cooling-off period' mean?",
              "Where do I upload my client's ID?"
                         ].map((suggestion, index) => (
               <button
                 key={index}
                 onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
                 className="text-left p-4 rounded-2xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 group"
               >
                 <span className="text-sm text-gray-700 group-hover:text-purple-700">
                   {suggestion}
                 </span>
               </button>
             ))}
          </div>
        </div>
      </div>
      
      {/* Bottom hint */}
      <p className="text-sm text-gray-500 font-light">
        Your AI legal assistant for the EazyHomes platform
      </p>
    </div>
  </div>
);

// Modern Service Status
const ServiceStatus = ({ isConfigured }) => {
  if (isConfigured) return null;
  
  return (
    <div className="mx-4 mb-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-amber-800">Service Configuration Required</p>
            <p className="text-xs text-amber-600 mt-1">AI service needs to be configured with API keys.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EazyCopilot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serviceConfigured, setServiceConfigured] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check service configuration on mount
  useEffect(() => {
    const status = aiService.getStatus();
    setServiceConfigured(status.configured);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && attachments.length === 0) || isLoading) return;

    const userMessage = inputValue.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message with attachments
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      isUser: true,
      timestamp,
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setAttachments([]);
    setIsLoading(true);

    // Create placeholder AI message for streaming
    const aiMessageId = Date.now() + 1;
    const aiMessage = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMessage]);
    setStreamingMessageId(aiMessageId);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      // Stream AI response
      await aiService.getEazyReply(userMessage, conversationHistory, (chunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, text: msg.text + chunk }
            : msg
        ));
      });

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Update the AI message with error
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, text: "I apologize, but I encountered an error. Please try again or contact support if the issue persists." }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setAttachments([]);
    inputRef.current?.focus();
  };

  // Handle file attachment
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove attachment
  const removeAttachment = (attachmentId) => {
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== attachmentId);
      // Clean up preview URLs
      const removed = prev.find(att => att.id === attachmentId);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };



  // Get file icon
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return PhotoIcon;
    }
    return DocumentIcon;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-sm">
              <BrainIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-light text-gray-800">EazyCopilot</h1>
              <p className="text-sm text-gray-500 font-light">AI Legal Assistant</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors font-light"
            >
              New chat
            </button>
          )}
        </div>
      </div>

      {/* Service Status */}
      <ServiceStatus isConfigured={serviceConfigured} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeMessage onSuggestionClick={(suggestion) => {
            setInputValue(suggestion);
            inputRef.current?.focus();
          }} />
        ) : (
          <div className="px-6 py-4">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                isStreaming={streamingMessageId === message.id}
                attachments={message.attachments}
              />
            ))}
            {isLoading && <TypingLoader />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Modern Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Attachment Preview */}
          {attachments.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  {attachments.length} file{attachments.length > 1 ? 's' : ''} attached
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {attachments.map((attachment) => {
                  const FileIcon = getFileIcon(attachment.type);
                  return (
                    <div key={attachment.id} className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
                      {attachment.preview ? (
                        <img 
                          src={attachment.preview} 
                          alt={attachment.name}
                          className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                        />
                      ) : (
                        <FileIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                      </div>
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove attachment"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="relative">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
            />
            
            {/* Attachment button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="absolute left-3 bottom-3 p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors disabled:opacity-50"
              title="Attach files"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write, ask, or search anything..."
              className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none max-h-32 text-sm font-light placeholder-gray-500"
              rows="1"
              style={{ minHeight: '56px' }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && attachments.length === 0) || isLoading}
              className="absolute right-3 bottom-3 p-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center font-light">
            EazyCopilot provides general guidance. Always consult with a qualified attorney for specific legal advice.
          </p>
        </div>
      </div>
    </div>
  );
};

// PropTypes for components
Message.propTypes = {
  message: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
  timestamp: PropTypes.string.isRequired,
  isStreaming: PropTypes.bool,
  attachments: PropTypes.array,
};

ServiceStatus.propTypes = {
  isConfigured: PropTypes.bool.isRequired,
};

WelcomeMessage.propTypes = {
  userName: PropTypes.string,
  onSuggestionClick: PropTypes.func,
};

export default EazyCopilot; 