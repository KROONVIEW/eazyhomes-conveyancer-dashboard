import React, { memo, useMemo } from "react";
import { FiPaperclip } from "react-icons/fi";

// Memoized WhatsApp-style checkmark SVGs
const SingleCheckIcon = memo((props) => (
  <svg viewBox="0 0 16 16" fill="none" width="16" height="16" {...props}>
    <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
));

const DoubleCheckIcon = memo((props) => (
  <svg viewBox="0 0 20 16" fill="none" width="16" height="16" {...props}>
    <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
));

// Memoized attachment preview component
const AttachmentPreview = memo(({ attachment }) => {
  if (!attachment) return null;
  
  if (attachment.type === 'image') {
    return (
      <div className="mb-2">
        <img 
          src={attachment.url} 
          alt={attachment.name} 
          className="max-w-full h-auto rounded-lg"
          loading="lazy"
          style={{ maxHeight: '200px', objectFit: 'cover' }}
        />
        <div className="text-xs text-gray-500 mt-1">
          <span>{attachment.name}</span>
        </div>
      </div>
    );
  }
  
  // PDF or DOC
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg mb-2">
      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">
          {attachment.type === 'pdf' ? 'PDF' : 'DOC'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{attachment.name}</div>
        <div className="text-xs text-gray-500">{attachment.size}</div>
      </div>
    </div>
  );
});

// Pre-computed face images array (moved outside component)
const faceImages = Array.from({length: 16}, (_, i) => `/images/avatars/face_1 (${i+1}).jpg`);

// Optimized hash function for consistent face selection
const getConsistentFace = (senderKey) => {
  let hash = 0;
  if (typeof senderKey === 'string') {
    for (let i = 0; i < senderKey.length; i++) hash += senderKey.charCodeAt(i);
  } else if (typeof senderKey === 'number') {
    hash = senderKey;
  }
  return faceImages[hash % faceImages.length];
};

// Memoized status icons component
const StatusIcons = memo(({ status }) => {
  switch (status) {
    case 'sent':
      return <SingleCheckIcon className="w-4 h-4 text-gray-400" />;
    case 'delivered':
      return <DoubleCheckIcon className="w-4 h-4 text-gray-400" />;
    case 'read':
      return <DoubleCheckIcon className="w-4 h-4 text-blue-500" />;
    default:
      return null;
  }
});

// Optimized broadcast message component
const BroadcastMessage = memo(({ text, timestamp }) => (
  <div className="flex justify-center my-4">
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 max-w-sm text-center">
      <p className="text-sm text-yellow-800 font-medium">{text}</p>
      <div className="text-xs text-yellow-600 mt-1">{timestamp}</div>
    </div>
  </div>
));

// Main MessageBubble component with comprehensive optimizations
const OptimizedMessageBubble = memo(({ 
  message, 
  isCurrentUser 
}) => {
  // Destructure message properties for better performance
  const {
    text,
    timestamp,
    isSent = isCurrentUser,
    imageUrl,
    isBroadcast,
    attachment,
    senderAvatar,
    status,
    senderName,
    senderId
  } = message || {};

  // Memoized avatar calculation
  const avatarToShow = useMemo(() => {
    if (isSent) return senderAvatar || '/images/avatars/face 2 (2).jpg';
    return senderAvatar || getConsistentFace(senderName || senderId || 'unknown');
  }, [isSent, senderAvatar, senderName, senderId]);

  // Handle broadcast messages
  if (isBroadcast) {
    return <BroadcastMessage text={text} timestamp={timestamp} />;
  }

  return (
    <div className={`flex gap-3 mb-4 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img 
          src={avatarToShow} 
          alt="avatar" 
          className="w-8 h-8 rounded-full object-cover"
          loading="lazy"
        />
      </div>
      
      {/* Message content */}
      <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
        {/* Message bubble */}
        <div className={`
          px-4 py-2 rounded-2xl shadow-sm
          ${isSent 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
          }
        `}>
          <AttachmentPreview attachment={attachment} />
          {text && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {text}
            </p>
          )}
        </div>
        
        {/* Timestamp and status */}
        <div className={`flex items-center gap-1 mt-1 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-500">{timestamp}</span>
          {isSent && <StatusIcons status={status} />}
        </div>
      </div>
    </div>
  );
});

// Set display names for debugging
SingleCheckIcon.displayName = 'SingleCheckIcon';
DoubleCheckIcon.displayName = 'DoubleCheckIcon';
AttachmentPreview.displayName = 'AttachmentPreview';
StatusIcons.displayName = 'StatusIcons';
BroadcastMessage.displayName = 'BroadcastMessage';
OptimizedMessageBubble.displayName = 'OptimizedMessageBubble';

export default OptimizedMessageBubble; 