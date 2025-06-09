import React from "react";
import ConversationList from "../components/messaging/ConversationList.jsx";
import ChatWindow from "../components/messaging/ChatWindow.js";
import CallModal from "../components/messaging/CallModal";
import MessagesFAB from "../components/messaging/MessagesFAB";
import { useMessagesState } from "../hooks/useMessagesState";

const MessagesPageRefactored = () => {
  const {
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
  } = useMessagesState();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Main Messages Layout */}
      <div className="flex-1 flex bg-white shadow-sm border border-gray-200 rounded-lg m-4 overflow-hidden">
        {/* Conversation List Sidebar */}
        <div className="w-80 min-w-[20rem] max-w-sm h-full border-r border-gray-200 bg-gray-50 flex-shrink-0">
          <ConversationList
            conversations={Object.values(dynamicChatData)}
            activeConversationId={activeConversationId}
            onConversationSelect={setActiveConversationId}
            unreadCounts={unreadCounts}
            newMessageCounters={newMessageCounters}
            lastReadMessages={lastReadMessages}
            onVideoCall={handleVideoCall}
            onVoiceCall={handleVoiceCall}
            onUserProfileClick={handleUserProfileClick}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={setNotificationsEnabled}
            onSendBroadcast={handleSendBroadcast}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 h-full min-w-0 flex flex-col bg-white">
          <ChatWindow
            conversation={dynamicChatData[activeConversationId]}
            onSendMessage={(messageText, attachments) => 
              handleSendMessage(activeConversationId, messageText, attachments)
            }
            onVideoCall={handleVideoCall}
            onVoiceCall={handleVoiceCall}
            onUserProfileClick={handleUserProfileClick}
            onMarkAsRead={() => markAsRead(activeConversationId)}
          />
        </div>
      </div>

      {/* Call Modals */}
      {(showVideoCall || showVoiceCall) && (
        <CallModal
          isOpen={showVideoCall || showVoiceCall}
          onClose={handleCallEnd}
          contact={selectedUserData}
          callType={showVideoCall ? 'video' : 'voice'}
        />
      )}

      {/* Messages FAB */}
      <MessagesFAB
        onSendBroadcast={handleSendBroadcast}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={setNotificationsEnabled}
        unreadCount={Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)}
      />
    </div>
  );
};

export default MessagesPageRefactored; 