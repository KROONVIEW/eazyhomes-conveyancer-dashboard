import React from "react";
import { FiPaperclip } from "react-icons/fi";

// WhatsApp-style checkmark SVGs
const SingleCheckIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" width="16" height="16" {...props}>
    <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const DoubleCheckIcon = (props) => (
  <svg viewBox="0 0 20 16" fill="none" width="16" height="16" {...props}>
    <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function getAttachmentPreview(attachment) {
  if (!attachment) return null;
  if (attachment.type === 'image') {
    return (
      <div className="attachment-preview image">
        <img src={attachment.url} alt={attachment.name} className="attachment-thumbnail" />
        <div className="attachment-details">
          <span className="attachment-name">{attachment.name}</span>
          <span className="attachment-size">{attachment.size}</span>
        </div>
        <a href={attachment.url} download className="attachment-download-icon"><i className="fas fa-download"></i></a>
      </div>
    );
  }
  // PDF or DOC
  return (
    <div className={`attachment-preview ${attachment.type}`}>
      <div className="attachment-icon">
        <i className={`fas fa-file-${attachment.type === 'pdf' ? 'pdf' : 'word'}`}></i>
      </div>
      <div className="attachment-details">
        <span className="attachment-name">{attachment.name}</span>
        <span className="attachment-size">{attachment.size}</span>
      </div>
      <a href={attachment.url} download className="attachment-download-icon"><i className="fas fa-download"></i></a>
    </div>
  );
}

const faceImages = Array.from({length: 16}, (_, i) => `/images/avatars/face_1 (${i+1}).jpg`);

function getConsistentFace(senderKey) {
  // Simple hash: sum char codes, mod faceImages.length
  let hash = 0;
  if (typeof senderKey === 'string') {
    for (let i = 0; i < senderKey.length; i++) hash += senderKey.charCodeAt(i);
  } else if (typeof senderKey === 'number') {
    hash = senderKey;
  }
  return faceImages[hash % faceImages.length];
}

const MessageBubble = ({ text, timestamp, isSent, imageUrl, isBroadcast, attachment, senderAvatar, status, senderName, senderId }) => {
  // Use consistent face for each sender if senderAvatar is missing and this is an incoming message
  const avatarToShow = !isSent
    ? (senderAvatar || getConsistentFace(senderName || senderId || 'unknown'))
    : senderAvatar;

  if (isBroadcast) {
    return (
      <div className="message-bubble system-broadcast" style={{ background: '#f5f7fa', color: '#444', fontWeight: 600, textAlign: 'center', borderRadius: 12, margin: '12px auto', maxWidth: 320, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
        <p style={{ margin: 0 }}>{text}</p>
        <div className="message-meta" style={{ justifyContent: 'center', color: '#888', fontWeight: 400, fontSize: '0.85em' }}>
          <span className="message-time">{timestamp}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`message-bubble ${isSent ? 'outgoing' : 'incoming'}`}
      style={isSent ? { flexDirection: 'row-reverse', alignItems: 'flex-start', marginLeft: 'auto', marginRight: 0, maxWidth: '80%' } : {}}>
      {/* Avatar: left for incoming, top-right for outgoing */}
      {!isSent && (
        <img src={avatarToShow} alt="avatar" className="message-sender-avatar" />
      )}
      {isSent && (
        <img src={avatarToShow} alt="avatar" className="message-sender-avatar" style={{ marginLeft: 10, marginBottom: 0, alignSelf: 'flex-start' }} />
      )}
      <div style={isSent ? { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, position: 'relative', width: '100%' } : {}}>
        <div className="message-content" style={{ background: isSent ? '#007bff' : '#fff', color: isSent ? '#fff' : '#222', borderRadius: isSent ? '18px 18px 0 18px' : '18px 18px 18px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: '12px 16px', margin: '2px 0', minWidth: 80, maxWidth: 400, position: 'relative' }}>
          {/* Do NOT render imageUrl at all */}
          {getAttachmentPreview(attachment)}
          {text && <p className="mb-1" style={{ margin: 0 }}>{text}</p>}
          <div className="message-meta" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', fontSize: '0.75em', color: isSent ? '#eee' : '#777', marginTop: 6, gap: 4, position: isSent ? 'absolute' : 'static', bottom: isSent ? 8 : undefined, right: isSent ? 12 : undefined }}>
            {isSent && (
              <span className="message-status-icons show-sent">
                {status === 'sent' && <SingleCheckIcon className="status-icon sent" />}
                {status === 'delivered' && <DoubleCheckIcon className="status-icon delivered" />}
                {status === 'read' && <DoubleCheckIcon className="status-icon read" />}
              </span>
            )}
            <span className="message-time">{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 