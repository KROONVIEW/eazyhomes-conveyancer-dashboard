import React, { useState, useCallback } from "react";
import ConversationList from "../components/messaging/ConversationList";
import ChatWindow from "../components/messaging/ChatWindow";
import CallModal from "../components/messaging/CallModal.jsx";

// Simulated chat data for each user (matching ConversationList)
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

const chatData = {
  1: {
    id: 1,
    name: "John Carlo",
    avatarUrl: avatarList[1],
    online: true,
    messages: [
      { id: 1, text: "Hi John, please see the attached document.", timestamp: "09:00", isSent: false, senderAvatar: avatarList[2], status: 'read' },
      { id: 2, text: "Here is the signed contract.", timestamp: "09:01", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "Thank you! I'll review and get back to you.", timestamp: "09:02", isSent: false, senderAvatar: avatarList[3], status: 'delivered' },
      { id: 4, text: "Looking forward to our meeting.", timestamp: "09:31", isSent: false, senderAvatar: avatarList[1], status: 'read' },
    ],
  },
  2: {
    id: 2,
    name: "Team Transfers",
    avatarUrl: avatarList[2],
    online: true,
    messages: [
      { id: 1, text: "New transfer assigned to you.", timestamp: "10:00", isSent: false, senderAvatar: avatarList[2], status: 'delivered' },
      { id: 2, text: "Transfer #1042: Please review the documents.", timestamp: "10:01", isSent: true, senderAvatar: avatarList[1], status: 'sent' },
      { id: 3, text: "Transfer completed successfully.", timestamp: "10:05", isSent: false, senderAvatar: avatarList[2], status: 'read' },
    ],
  },
  3: {
    id: 3,
    name: "Alice Smith",
    avatarUrl: avatarList[3],
    online: true,
    messages: [
      { id: 1, text: "Sent the signed documents.", timestamp: "11:00", isSent: false, senderAvatar: avatarList[3], status: 'delivered' },
      { id: 2, text: "Thank you, Alice!", timestamp: "11:01", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "Let me know if you need anything else.", timestamp: "11:02", isSent: false, senderAvatar: avatarList[3], status: 'read' },
    ],
  },
  4: {
    id: 4,
    name: "Team Announcements",
    avatarUrl: avatarList[4],
    online: true,
    messages: [
      { id: 1, text: "Quarterly meeting at 3 PM today.", timestamp: "12:00", isBroadcast: true },
      { id: 2, text: "Don't forget to submit your reports.", timestamp: "12:10", isBroadcast: true },
      { id: 3, text: "Team lunch scheduled for Friday!", timestamp: "12:20", isBroadcast: true },
    ],
  },
  5: {
    id: 5,
    name: "Sarah Lee",
    avatarUrl: avatarList[5],
    online: true,
    messages: [
      { id: 1, text: "Can you review the contract?", timestamp: "13:00", isSent: false, senderAvatar: avatarList[5], status: 'delivered' },
      { id: 2, text: "Reviewed and sent back.", timestamp: "13:05", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "Thanks so much!", timestamp: "13:06", isSent: false, senderAvatar: avatarList[5], status: 'read' },
    ],
  },
  6: {
    id: 6,
    name: "Finance Team",
    avatarUrl: avatarList[6],
    online: true,
    messages: [
      { id: 1, text: "Invoice #1042 has been approved.", timestamp: "14:00", isBroadcast: true },
      { id: 2, text: "Expense report submitted.", timestamp: "14:10", isBroadcast: true },
      { id: 3, text: "Budget review meeting at 2 PM.", timestamp: "14:20", isBroadcast: true },
    ],
  },
  7: {
    id: 7,
    name: "Legal Updates",
    avatarUrl: avatarList[7],
    online: true,
    messages: [
      { id: 1, text: "New compliance guidelines released.", timestamp: "15:00", isBroadcast: true },
      { id: 2, text: "Policy update: Remote work extended.", timestamp: "15:10", isBroadcast: true },
      { id: 3, text: "Legal Q&A at 4 PM.", timestamp: "15:20", isBroadcast: true },
    ],
  },
  8: {
    id: 8,
    name: "Michael Tan",
    avatarUrl: avatarList[8],
    online: true,
    messages: [
      { id: 1, text: "Thanks for your help!", timestamp: "16:00", isSent: false, senderAvatar: avatarList[8], status: 'read' },
      { id: 2, text: "Anytime, Michael.", timestamp: "16:01", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "Let's catch up soon.", timestamp: "16:02", isSent: false, senderAvatar: avatarList[8], status: 'read' },
    ],
  },
  9: {
    id: 9,
    name: "HR Team",
    avatarUrl: avatarList[9],
    online: true,
    messages: [
      { id: 1, text: "Policy update: Remote work extended.", timestamp: "17:00", isBroadcast: true },
      { id: 2, text: "HR Q&A session at 11 AM tomorrow.", timestamp: "17:10", isBroadcast: true },
      { id: 3, text: "Reminder: Submit your timesheets.", timestamp: "17:20", isBroadcast: true },
    ],
  },
  10: {
    id: 10,
    name: "Jessica Wu",
    avatarUrl: avatarList[10],
    online: true,
    messages: [
      { id: 1, text: "Lunch at 1 PM?", timestamp: "18:00", isSent: false, senderAvatar: avatarList[10], status: 'delivered' },
      { id: 2, text: "Sounds good!", timestamp: "18:01", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "See you then.", timestamp: "18:02", isSent: false, senderAvatar: avatarList[10], status: 'read' },
    ],
  },
  11: {
    id: 11,
    name: "Project Alpha",
    avatarUrl: avatarList[11],
    online: true,
    messages: [
      { id: 1, text: "Deadline moved to next Friday.", timestamp: "19:00", isBroadcast: true },
      { id: 2, text: "Alpha team standup at 9 AM.", timestamp: "19:10", isBroadcast: true },
      { id: 3, text: "Sprint review at 3 PM.", timestamp: "19:20", isBroadcast: true },
    ],
  },
  12: {
    id: 12,
    name: "Client: Mr. Patel",
    avatarUrl: avatarList[12],
    online: true,
    messages: [
      { id: 1, text: "Received the documents, thank you.", timestamp: "20:00", isSent: false, senderAvatar: avatarList[12], status: 'read' },
      { id: 2, text: "You're welcome, Mr. Patel.", timestamp: "20:01", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "Let me know if you have any questions.", timestamp: "20:02", isSent: false, senderAvatar: avatarList[12], status: 'read' },
    ],
  },
  13: {
    id: 13,
    name: "Team Marketing",
    avatarUrl: avatarList[13],
    online: true,
    messages: [
      { id: 1, text: "Campaign launch is live!", timestamp: "21:00", isBroadcast: true },
      { id: 2, text: "Marketing sync at 2 PM.", timestamp: "21:10", isBroadcast: true },
      { id: 3, text: "Share your feedback on the new campaign.", timestamp: "21:20", isBroadcast: true },
    ],
  },
  14: {
    id: 14,
    name: "Anna Kim",
    avatarUrl: avatarList[14],
    online: true,
    messages: [
      { id: 1, text: "Let's sync up tomorrow.", timestamp: "22:00", isSent: false, senderAvatar: avatarList[14], status: 'delivered' },
      { id: 2, text: "Sure, Anna!", timestamp: "22:01", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "See you then.", timestamp: "22:02", isSent: false, senderAvatar: avatarList[14], status: 'read' },
    ],
  },
  15: {
    id: 15,
    name: "Support Desk",
    avatarUrl: avatarList[15],
    online: true,
    messages: [
      { id: 1, text: "Your ticket has been resolved.", timestamp: "23:00", isBroadcast: true },
      { id: 2, text: "If you need further assistance, reply here.", timestamp: "23:10", isBroadcast: true },
      { id: 3, text: "Thank you!", timestamp: "23:20", isSent: true, senderAvatar: avatarList[1], status: 'read' },
    ],
  },
  16: {
    id: 16,
    name: "Client: Mrs. Green",
    avatarUrl: avatarList[16],
    online: true,
    messages: [
      { id: 1, text: "Can we reschedule our call?", timestamp: "08:00", isSent: false, senderAvatar: avatarList[16], status: 'read' },
      { id: 2, text: "Of course, Mrs. Green. What time works for you?", timestamp: "08:01", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "Tomorrow at 10 AM?", timestamp: "08:02", isSent: false, senderAvatar: avatarList[16], status: 'read' },
      { id: 4, text: "Confirmed. See you then!", timestamp: "08:03", isSent: true, senderAvatar: avatarList[1], status: 'read' },
    ],
  },
  17: {
    id: 17,
    name: "Team Operations",
    avatarUrl: avatarList[17],
    online: true,
    messages: [
      { id: 1, text: "System maintenance at midnight.", timestamp: "07:00", isBroadcast: true },
      { id: 2, text: "Operations sync at 4 PM.", timestamp: "07:10", isBroadcast: true },
      { id: 3, text: "Please update your status reports.", timestamp: "07:20", isBroadcast: true },
    ],
  },
  18: {
    id: 18,
    name: "David Lin",
    avatarUrl: avatarList[18],
    online: true,
    messages: [
      { id: 1, text: "I'll send the files shortly.", timestamp: "06:00", isSent: false, senderAvatar: avatarList[18], status: 'delivered' },
      { id: 2, text: "Received, thanks David!", timestamp: "06:01", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "Let me know if you need anything else.", timestamp: "06:02", isSent: false, senderAvatar: avatarList[18], status: 'read' },
    ],
  },
  19: {
    id: 19,
    name: "Team Compliance",
    avatarUrl: avatarList[19],
    online: true,
    messages: [
      { id: 1, text: "Reminder: Submit your reports.", timestamp: "05:00", isBroadcast: true },
      { id: 2, text: "Compliance Q&A at 2 PM.", timestamp: "05:10", isBroadcast: true },
      { id: 3, text: "Policy update: New guidelines effective next week.", timestamp: "05:20", isBroadcast: true },
    ],
  },
  20: {
    id: 20,
    name: "Client: Mr. Brown",
    avatarUrl: avatarList[1],
    online: true,
    messages: [
      { id: 1, text: "Looking forward to our meeting.", timestamp: "04:00", isSent: false, senderAvatar: avatarList[1], status: 'read' },
      { id: 2, text: "Me too, Mr. Brown!", timestamp: "04:01", isSent: true, senderAvatar: avatarList[1], status: 'read' },
      { id: 3, text: "See you at 2 PM.", timestamp: "04:02", isSent: false, senderAvatar: avatarList[1], status: 'read' },
    ],
  },
};

const MessagesPage = () => {
  const [activeId, setActiveId] = useState(1); // default to first real chat
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState('voice');
  const [callContact, setCallContact] = useState(null);

  // Video call handler
  const handleVideoCall = useCallback((chat) => {
    console.log('📹 Video call initiated with:', chat?.name);
    setCallContact(chat);
    setCallType('video');
    setShowCallModal(true);
  }, []);

  // Voice call handler
  const handleVoiceCall = useCallback((chat) => {
    console.log('📞 Voice call initiated with:', chat?.name);
    setCallContact(chat);
    setCallType('voice');
    setShowCallModal(true);
  }, []);

  // Call end handler
  const handleCallEnd = useCallback(() => {
    setShowCallModal(false);
    setCallContact(null);
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Main Container with optimized aspect ratio */}
      <div className="flex-1 flex bg-white shadow-sm border border-gray-200 rounded-lg m-4 overflow-hidden">
        {/* Left Panel: Conversation List */}
        <div className="w-80 min-w-[20rem] max-w-sm h-full border-r border-gray-200 bg-gray-50 flex-shrink-0">
          <ConversationList activeId={activeId} onSelect={setActiveId} />
        </div>
        {/* Right Panel: Chat Window */}
        <div className="flex-1 h-full min-w-0 flex flex-col bg-white">
          <ChatWindow 
            chat={chatData[activeId]} 
            onVideoCall={handleVideoCall}
            onVoiceCall={handleVoiceCall}
          />
        </div>
      </div>
      
      {/* Call Modal */}
      <CallModal
        isOpen={showCallModal}
        onClose={handleCallEnd}
        contact={callContact}
        callType={callType}
        onCallStart={(contact, type) => {
          console.log(`📞 Call started: ${type} call with ${contact.name}`);
        }}
        onCallEnd={(contact, type, duration) => {
          console.log(`📞 Call ended: ${type} call with ${contact.name}, duration: ${duration}s`);
          handleCallEnd();
        }}
      />
    </div>
  );
};

export default MessagesPage; 