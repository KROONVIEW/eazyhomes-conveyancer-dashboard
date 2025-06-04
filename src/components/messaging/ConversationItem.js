import React from "react";

const ConversationItem = ({ name, avatarUrl, lastMessage, timestamp, active, onClick, unreadCount = 0, type, hasUnread }) => {
  return (
    <div
      className={`contact-item flex items-center px-4 py-3 cursor-pointer transition-colors relative ${active ? "active" : ""} ${type === 'broadcast' ? 'broadcast-channel' : ''} ${type === 'team' ? 'group-chat' : ''} ${hasUnread ? 'has-unread' : ''}`}
      onClick={onClick}
    >
      <img
        src={avatarUrl || "/images/avatars/face 2.jpg"}
        alt={name}
        className="contact-avatar w-10 h-10 rounded-full object-cover border border-gray-200 mr-3"
      />
      {unreadCount > 0 && <div className="unread-badge show-badge">{unreadCount}</div>}
      <div className="contact-info flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="contact-name font-semibold text-gray-800 text-sm truncate">
            {type === 'broadcast' && <i className="fas fa-bullhorn broadcast-icon"></i>}
            {name}
            {type === 'team' && <i className="fas fa-users group-icon"></i>}
          </span>
          <span className="message-time text-[11px] text-gray-400 ml-2 whitespace-nowrap">{timestamp}</span>
        </div>
        <div className="last-message text-xs text-gray-500 truncate">{lastMessage}</div>
      </div>
    </div>
  );
};

export default ConversationItem; 