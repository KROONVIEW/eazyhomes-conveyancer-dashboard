import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FiX, FiSend, FiCornerDownRight, FiMessageCircle } from 'react-icons/fi';
import MessageBubble from './MessageBubble';

const MessageThread = ({ 
  isOpen, 
  onClose, 
  parentMessage, 
  threadMessages = [], 
  onSendReply, 
  currentUserId = 'user1',
  onAddReaction,
  onRemoveReaction 
}) => {
  const [replyText, setReplyText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [replyText]);

  const handleSendReply = useCallback(async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !parentMessage) {return;}

    setIsTyping(true);
    
    try {
      const reply = {
        id: Date.now(),
        text: replyText.trim(),
        sender: 'You',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        status: 'sent',
        parentMessageId: parentMessage.id,
        isThreadReply: true
      };

      await onSendReply?.(reply);
      setReplyText('');
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setIsTyping(false);
    }
  }, [replyText, parentMessage, onSendReply]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply(e);
    }
  }, [handleSendReply]);

  // Debug logging
  useEffect(() => {
    console.log('MessageThread props:', { isOpen, parentMessage, threadMessages });
  }, [isOpen, parentMessage, threadMessages]);

  if (!isOpen) {return null;}
  
  if (!parentMessage) {
    console.warn('MessageThread: parentMessage is null or undefined');
    return null;
  }

  // Ensure parentMessage has required properties
  if (!parentMessage.id) {
    console.warn('MessageThread: parentMessage missing id property', parentMessage);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <FiMessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Thread</h2>
              <p className="text-sm text-gray-600">
                {threadMessages.length} {threadMessages.length === 1 ? 'reply' : 'replies'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-full transition-all duration-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Parent Message */}
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <img
              src={parentMessage?.senderAvatar || '/images/avatars/face_1 (1).jpg'}
              alt={parentMessage?.sender || 'User'}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{parentMessage?.sender || 'Unknown User'}</span>
                <span className="text-xs text-gray-500">{parentMessage?.timestamp || 'Unknown time'}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-800">{parentMessage?.text || 'No message content'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thread Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {threadMessages.length > 0 ? (
            threadMessages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <FiCornerDownRight className="w-4 h-4 text-gray-400 mt-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <MessageBubble
                    message={message}
                    isOwn={message.sender === 'You'}
                    onAddReaction={onAddReaction}
                    onRemoveReaction={onRemoveReaction}
                    currentUserId={currentUserId}
                    showAvatar={true}
                    isThreadReply={true}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiMessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Start the conversation</p>
              <p className="text-sm">Be the first to reply to this message</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <form onSubmit={handleSendReply} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Reply to thread..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none min-h-[48px] max-h-32"
                rows="1"
                disabled={isTyping}
              />
              
              {/* Character count */}
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {replyText.length}/1000
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!replyText.trim() || isTyping}
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 min-w-[100px] justify-center"
            >
              {isTyping ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  <span className="hidden sm:inline">Reply</span>
                </>
              )}
            </button>
          </form>
          
          {/* Thread Guidelines */}
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
            <span>💡 Keep replies focused on the original message</span>
            <span>⌨️ Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageThread; 