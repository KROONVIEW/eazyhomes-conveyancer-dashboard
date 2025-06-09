import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FiMoreHorizontal, FiCornerUpLeft, FiCopy, FiShare, FiTrash2, FiMessageCircle } from 'react-icons/fi';
import MessageReactions from './MessageReactions';

const MessageBubble = ({ 
  message, 
  isOwn, 
  onAddReaction, 
  onRemoveReaction, 
  onStartThread,
  onCopyMessage,
  onDeleteMessage,
  onForwardMessage,
  currentUserId = 'user1',
  showAvatar = true,
  isThreadReply = false,
  threadCount = 0
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const contextMenuRef = useRef(null);
  const messageRef = useRef(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    const rect = messageRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenuPosition({
        x: e.clientX,
        y: e.clientY
      });
      setShowContextMenu(true);
    }
  }, []);

  const handleMenuAction = useCallback((action) => {
    setShowContextMenu(false);
    
    switch (action) {
      case 'reply':
        onStartThread?.(message);
        break;
      case 'copy':
        onCopyMessage?.(message);
        navigator.clipboard.writeText(message.text);
        break;
      case 'forward':
        onForwardMessage?.(message);
        break;
      case 'delete':
        onDeleteMessage?.(message);
        break;
      default:
        break;
    }
  }, [message, onStartThread, onCopyMessage, onForwardMessage, onDeleteMessage]);

  // Format message text with basic markdown support
  const formatMessageText = useCallback((text) => {
    if (!text) {return '';}
    
    // Bold text **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic text *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
  }, []);

  // Get status indicator
  const getStatusIndicator = useCallback(() => {
    if (!isOwn) {return null;}
    
    switch (message.status) {
      case 'sent':
        return <span className="text-gray-400 text-xs">✓</span>;
      case 'delivered':
        return <span className="text-gray-400 text-xs">✓✓</span>;
      case 'read':
        return <span className="text-blue-500 text-xs">✓✓</span>;
      default:
        return null;
    }
  }, [isOwn, message.status]);

  return (
    <div 
      ref={messageRef}
      className={`group relative flex gap-3 font-['Poppins'] ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${isThreadReply ? 'ml-4' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleContextMenu}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="flex-shrink-0">
          <img
            src={message.senderAvatar || '/images/avatars/face_1 (1).jpg'}
            alt={message.sender}
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name (for group chats) */}
        {!isOwn && showAvatar && (
          <div className="text-xs text-gray-600 mb-1 px-1">
            {message.sender}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
            isOwn
              ? message.isBroadcast
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              : message.isBroadcast
              ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-gray-900'
              : 'bg-white border border-gray-200 text-gray-900'
          } ${isHovered ? 'shadow-md transform scale-[1.02]' : ''}`}
        >
          {/* Broadcast Indicator */}
          {message.isBroadcast && (
            <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${
              isOwn ? 'border-white/20' : 'border-purple-200'
            }`}>
              <span className="text-sm">📢</span>
              <span className={`text-xs font-medium ${
                isOwn ? 'text-white/90' : 'text-purple-700'
              }`}>
                {message.subject || 'Official Announcement'}
              </span>
            </div>
          )}

          {/* Message Text */}
          <div 
            className={`text-sm leading-relaxed ${
              isOwn ? 'text-white' : 'text-gray-800'
            }`}
            dangerouslySetInnerHTML={{ 
              __html: formatMessageText(message.text) 
            }}
          />

          {/* Attachment Preview */}
          {message.hasAttachment && (
            <div className={`mt-3 p-3 rounded-lg ${
              isOwn ? 'bg-white/10' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${
                  isOwn ? 'bg-white/20' : 'bg-blue-100'
                }`}>
                  📎
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    isOwn ? 'text-white' : 'text-gray-900'
                  }`}>
                    {message.attachmentName || 'Document.pdf'}
                  </div>
                  <div className={`text-xs ${
                    isOwn ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.attachmentSize || '2.4 MB'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message Reactions */}
          {(message.reactions?.length > 0 || isHovered) && (
            <div className="mt-2">
              <MessageReactions
                messageId={message.id}
                reactions={message.reactions || []}
                onAddReaction={onAddReaction}
                onRemoveReaction={onRemoveReaction}
                currentUserId={currentUserId}
              />
            </div>
          )}
        </div>

        {/* Thread Indicator */}
        {threadCount > 0 && !isThreadReply && (
          <button
            onClick={() => onStartThread?.(message)}
            className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md ${
              isOwn 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiMessageCircle className="w-3 h-3" />
            <span>{threadCount} {threadCount === 1 ? 'reply' : 'replies'}</span>
          </button>
        )}

        {/* Timestamp and Status */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${
          isOwn ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <span className="text-xs text-gray-500">
            {message.timestamp}
          </span>
          {getStatusIndicator()}
        </div>
      </div>

      {/* Quick Actions (visible on hover) */}
      {isHovered && (
        <div className={`absolute top-0 ${
          isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
        } flex items-center gap-1 px-2`}>
          <button
            onClick={() => handleMenuAction('reply')}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            title="Reply in thread"
          >
                            <FiCornerUpLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => setShowContextMenu(true)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            title="More options"
          >
            <FiMoreHorizontal className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 min-w-[160px]"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            transform: 'translate(-50%, -10px)'
          }}
        >
          <button
            onClick={() => handleMenuAction('reply')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
                              <FiCornerUpLeft className="w-4 h-4" />
            Reply in thread
          </button>
          <button
            onClick={() => handleMenuAction('copy')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <FiCopy className="w-4 h-4" />
            Copy message
          </button>
          <button
            onClick={() => handleMenuAction('forward')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <FiShare className="w-4 h-4" />
            Forward
          </button>
          {isOwn && (
            <>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => handleMenuAction('delete')}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete message
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble; 