// Mock Chat Data for EasyHomes Dashboard
// Comprehensive chat data with conversations and message histories

export const chatData = {
  1: {
    id: 1,
    name: "John Carlo",
    avatarUrl: "/images/avatars/face_1 (2).jpg",
    online: true,
    status: "online",
    type: "personal",
    lastSeen: "Active now",
    matter: {
      id: 1204,
      address: "12 Oak Avenue"
    },
    messages: [
      {
        id: 1,
        text: "Hey! How's the property transfer going?",
        timestamp: "09:00",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (2).jpg",
        status: 'read'
      },
      {
        id: 2,
        text: "Going well! Just waiting for the final documents from the seller.",
        timestamp: "09:05",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: 'read'
      },
      {
        id: 3,
        text: "Great! Let me know if you need any help with the bond registration.",
        timestamp: "09:10",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (2).jpg",
        status: 'delivered'
      },
      {
        id: 4,
        text: "Will do, thanks! See you at the office tomorrow!",
        timestamp: "09:15",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: 'delivered'
      },
      {
        id: 5,
        text: "See you at the office tomorrow!",
        timestamp: "09:20",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (2).jpg",
        status: 'read'
      }
    ]
  },
  2: {
    id: 2,
    name: "Team Transfers",
    avatarUrl: "/images/avatars/face_1 (3).jpg",
    online: true,
    status: "online",
    type: "team",
    lastSeen: "Active now",
    messages: [
      {
        id: 1,
        text: "New transfer assigned to you: Property ID #TF2024-0156",
        timestamp: "08:50",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (3).jpg",
        status: 'read'
      },
      {
        id: 2,
        text: "Thanks! I'll review the details now.",
        timestamp: "08:55",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: 'read'
      },
      {
        id: 3,
        text: "New transfer assigned to you.",
        timestamp: "09:00",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (3).jpg",
        status: 'delivered'
      }
    ]
  },
  3: {
    id: 3,
    name: "Alice Smith",
    avatarUrl: "/images/avatars/face_1 (4).jpg",
    online: false,
    status: "away",
    type: "personal",
    lastSeen: "1 hour ago",
    matter: {
      id: 1205,
      address: "45 Pine Street"
    },
    messages: [
      {
        id: 1,
        text: "Hi! I've completed the deed of sale review.",
        timestamp: "08:00",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (4).jpg",
        status: 'read'
      },
      {
        id: 2,
        text: "Excellent! Any issues found?",
        timestamp: "08:05",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: 'read'
      },
      {
        id: 3,
        text: "Just minor corrections needed. I'll send the marked-up version.",
        timestamp: "08:10",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (4).jpg",
        status: 'delivered'
      },
      {
        id: 4,
        text: "Sent the signed documents.",
        timestamp: "08:15",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (4).jpg",
        status: 'read'
      }
    ]
  },
  4: {
    id: 4,
    name: "Team Announcements",
    avatarUrl: "/images/avatars/face_1 (5).jpg",
    status: "online",
    type: "team",
    lastSeen: "Active now",
    messages: [
      {
        id: 1,
        senderId: 4,
        senderName: "HR Team",
        content: "📢 Quarterly team meeting scheduled for today at 3 PM in Conference Room A.",
        timestamp: "2024-06-05T07:45:00Z",
        type: "text"
      },
      {
        id: 2,
        senderId: 4,
        senderName: "HR Team",
        content: "Agenda includes Q2 performance review and upcoming training sessions.",
        timestamp: "2024-06-05T07:46:00Z",
        type: "text"
      },
      {
        id: 3,
        senderId: 4,
        senderName: "HR Team",
        content: "Quarterly meeting at 3 PM today.",
        timestamp: "2024-06-05T08:45:00Z",
        type: "text"
      }
    ]
  },
  5: {
    id: 5,
    name: "Sarah Lee",
    avatarUrl: "/images/avatars/face_1 (6).jpg",
    status: "away",
    type: "personal",
    lastSeen: "20 minutes ago",
    messages: [
      {
        id: 1,
        senderId: 5,
        senderName: "Sarah Lee",
        content: "Hi! I need your expertise on a complex property transfer.",
        timestamp: "2024-06-05T08:30:00Z",
        type: "text"
      },
      {
        id: 2,
        senderId: "me",
        senderName: "You",
        content: "Sure! What's the situation?",
        timestamp: "2024-06-05T08:35:00Z",
        type: "text"
      },
      {
        id: 3,
        senderId: 5,
        senderName: "Sarah Lee",
        content: "It involves a sectional title with some bond complications.",
        timestamp: "2024-06-05T08:40:00Z",
        type: "text"
      },
      {
        id: 4,
        senderId: 5,
        senderName: "Sarah Lee",
        content: "Can you review the contract?",
        timestamp: "2024-06-05T08:40:00Z",
        type: "text"
      }
    ]
  },
  6: {
    id: 6,
    name: "Finance Team",
    avatarUrl: "/images/avatars/face_1 (7).jpg",
    status: "online",
    type: "team",
    lastSeen: "Active now",
    messages: [
      {
        id: 1,
        senderId: 6,
        senderName: "Finance Manager",
        content: "💰 Invoice #1042 has been processed and approved.",
        timestamp: "2024-06-05T08:35:00Z",
        type: "text"
      },
      {
        id: 2,
        senderId: 6,
        senderName: "Finance Manager",
        content: "Payment will be processed within 24 hours.",
        timestamp: "2024-06-05T08:36:00Z",
        type: "text"
      },
      {
        id: 3,
        senderId: 6,
        senderName: "Finance Manager",
        content: "Invoice #1042 has been approved.",
        timestamp: "2024-06-05T08:35:00Z",
        type: "text"
      }
    ]
  },
  7: {
    id: 7,
    name: "Legal Updates",
    avatarUrl: "/images/avatars/face_1 (8).jpg",
    status: "online",
    type: "team",
    lastSeen: "Active now",
    messages: [
      {
        id: 1,
        senderId: 7,
        senderName: "Legal Compliance",
        content: "📋 New compliance guidelines have been released by the Law Society.",
        timestamp: "2024-06-05T08:30:00Z",
        type: "text"
      },
      {
        id: 2,
        senderId: 7,
        senderName: "Legal Compliance",
        content: "Please review the updated procedures for property transfers.",
        timestamp: "2024-06-05T08:31:00Z",
        type: "text"
      },
      {
        id: 3,
        senderId: 7,
        senderName: "Legal Compliance",
        content: "New compliance guidelines released.",
        timestamp: "2024-06-05T08:30:00Z",
        type: "text"
      }
    ]
  },
  8: {
    id: 8,
    name: "Michael Tan",
    avatarUrl: "/images/avatars/face_1 (9).jpg",
    status: "online",
    type: "personal",
    lastSeen: "35 minutes ago",
    messages: [
      {
        id: 1,
        senderId: 8,
        senderName: "Michael Tan",
        content: "Hey! Thanks for helping me with the bond documentation yesterday.",
        timestamp: "2024-06-05T08:25:00Z",
        type: "text"
      },
      {
        id: 2,
        senderId: "me",
        senderName: "You",
        content: "No problem! Happy to help.",
        timestamp: "2024-06-05T08:26:00Z",
        type: "text"
      },
      {
        id: 3,
        senderId: 8,
        senderName: "Michael Tan",
        content: "Thanks for your help!",
        timestamp: "2024-06-05T08:25:00Z",
        type: "text"
      }
    ]
  },
  9: {
    id: 9,
    name: "HR Team",
    avatarUrl: "/images/avatars/face_1 (10).jpg",
    status: "online",
    type: "team",
    lastSeen: "Active now",
    messages: [
      {
        id: 1,
        senderId: 9,
        senderName: "HR Manager",
        content: "📢 Policy update: Remote work policy has been extended until December 2024.",
        timestamp: "2024-06-05T08:20:00Z",
        type: "text"
      },
      {
        id: 2,
        senderId: 9,
        senderName: "HR Manager",
        content: "Please update your work preferences in the HR portal.",
        timestamp: "2024-06-05T08:21:00Z",
        type: "text"
      },
      {
        id: 3,
        senderId: 9,
        senderName: "HR Manager",
        content: "Policy update: Remote work extended.",
        timestamp: "2024-06-05T08:20:00Z",
        type: "text"
      }
    ]
  },
  10: {
    id: 10,
    name: "Jessica Wu",
    avatarUrl: "/images/avatars/face_1 (11).jpg",
    status: "online",
    type: "personal",
    lastSeen: "45 minutes ago",
    messages: [
      {
        id: 1,
        senderId: 10,
        senderName: "Jessica Wu",
        content: "Hey! Are you free for lunch today?",
        timestamp: "2024-06-05T08:15:00Z",
        type: "text"
      },
      {
        id: 2,
        senderId: "me",
        senderName: "You",
        content: "Sure! What time works for you?",
        timestamp: "2024-06-05T08:16:00Z",
        type: "text"
      },
      {
        id: 3,
        senderId: 10,
        senderName: "Jessica Wu",
        content: "Lunch at 1 PM?",
        timestamp: "2024-06-05T08:15:00Z",
        type: "text"
      }
    ]
  }
};

// Helper functions for accessing chat data
export const getChatById = (id) => {
  return chatData[id] || null;
};

export const getAllChatIds = () => {
  return Object.keys(chatData).map(id => parseInt(id));
};

export const getChatList = () => {
  return Object.values(chatData);
};

export default chatData; 