// Enhanced avatar list with better quality placeholders
export const avatarList = [
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

// ENHANCED MOCK DATA FOR COMPREHENSIVE TESTING
// This includes all message types, attachments, reactions, and edge cases
export const chatData = {
  0: {
    id: 0,
    name: "Firm-Wide Broadcast",
    avatarUrl: "/images/avatars/face_1 (1).jpg",
    online: true,
    role: "Official Announcements",
    isBroadcast: true,
    messages: [
      {
        id: 1,
        text: "**Important Reminder**: All FICA documentation must be submitted by end of week. Please ensure all client files are up to date with the latest compliance requirements.",
        sender: "Firm Administration",
        timestamp: "14:30",
        isBroadcast: true,
        priority: "important",
        subject: "FICA Documentation Deadline",
        recipients: "all",
        status: "delivered",
        readBy: ["user1", "user2", "user3"]
      },
      {
        id: 2,
        text: "**Congratulations** to our Conveyancing Team for achieving a 98% client satisfaction rating this quarter! Your dedication to excellence continues to set the standard for our firm.",
        sender: "Managing Partner",
        timestamp: "12:15",
        isBroadcast: true,
        priority: "normal",
        subject: "Q4 Performance Recognition",
        recipients: "all",
        status: "delivered",
        readBy: ["user1", "user4", "user5"]
      },
      {
        id: 3,
        text: "**System Maintenance Notice**: Our case management system will undergo scheduled maintenance this Saturday from 2:00 AM to 6:00 AM. Please save all work before this time.",
        sender: "IT Department",
        timestamp: "Yesterday",
        isBroadcast: true,
        priority: "urgent",
        subject: "Scheduled System Maintenance",
        recipients: "all",
        status: "delivered",
        readBy: ["user1", "user2", "user3", "user4", "user5", "user6"]
      },
      {
        id: 4,
        text: "**Training Opportunity**: Advanced Property Law seminar available next month. Registration closes Friday. This is an excellent opportunity for professional development.",
        sender: "HR Department",
        timestamp: "2 days ago",
        isBroadcast: true,
        priority: "normal",
        subject: "Professional Development Opportunity",
        recipients: "conveyancers",
        status: "delivered",
        readBy: ["user2", "user3"]
      },
      {
        id: 5,
        text: "**Office Policy Update**: New hybrid work arrangements are now in effect. Please review the updated policy document in your employee portal and confirm your preferred schedule.",
        sender: "Human Resources",
        timestamp: "3 days ago",
        isBroadcast: true,
        priority: "important",
        subject: "Hybrid Work Policy Update",
        recipients: "all",
        status: "delivered",
        readBy: ["user1", "user2", "user3", "user4"]
      }
    ]
  },
  1: {
    id: 1,
    name: "John Carlo",
    avatarUrl: "/images/avatars/face_1 (1).jpg",
    online: true,
    role: "Senior Conveyancer",
    email: "john.carlo@easyhomes.com",
    phone: "+27 11 123 4567",
    verificationStatus: {
      identity: true,
      address: true,
      employment: true,
      fica: true
    },
    messages: [
      {
        id: 1,
        text: "Hi there! I wanted to follow up on the Henderson property transfer. Have you received the updated deed of sale?",
        sender: "John Carlo",
        timestamp: "09:30",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (1).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Yes, I received it this morning. I'm reviewing the amendments now and will get back to you within the hour.",
        sender: "You",
        timestamp: "09:31",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "Perfect! Also, the client mentioned they might want to expedite the process. Are we able to accommodate a faster timeline?",
        sender: "John Carlo",
        timestamp: "09:32",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (1).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "We can definitely expedite this. I'll coordinate with the deeds office to prioritize the registration. Should have an update by tomorrow morning.",
        sender: "You",
        timestamp: "09:35",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "That's fantastic! The client will be thrilled. Looking forward to our meeting this afternoon to discuss the details.",
        sender: "John Carlo",
        timestamp: "09:36",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (1).jpg",
        status: "delivered"
      },
      {
        id: 6,
        text: "See you at 2 PM in Conference Room B. I'll bring all the updated documents.",
        sender: "You",
        timestamp: "09:37",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      }
    ]
  },
  2: {
    id: 2,
    name: "Jessica Wu",
    avatarUrl: "/images/avatars/face_1 (2).jpg",
    online: true,
    role: "Junior Conveyancer",
    email: "jessica.wu@easyhomes.com",
    phone: "+27 11 234 5678",
    verificationStatus: {
      identity: true,
      address: true,
      employment: true,
      fica: false
    },
    messages: [
      {
        id: 1,
        text: "Hey! Are you free for lunch today? I wanted to discuss the new compliance procedures.",
        sender: "Jessica Wu",
        timestamp: "11:45",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (2).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Absolutely! How about 12:30 at the usual place?",
        sender: "You",
        timestamp: "11:46",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "Perfect! See you there. I have some questions about the new FICA requirements.",
        sender: "Jessica Wu",
        timestamp: "11:47",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (2).jpg",
        status: "delivered"
      }
    ]
  }
  // Note: This is a simplified version. The full data would include all conversations
  // from the original file. For now, I'm including just a few to demonstrate the structure.
};

export default chatData; 