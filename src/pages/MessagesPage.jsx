import React, { useState, useCallback, useEffect } from "react";
import ConversationList from "../components/messaging/ConversationList.jsx";
import ChatWindow from "../components/messaging/ChatWindow.js";
import CallModal from "../components/messaging/CallModal";
import MessagesFAB from "../components/messaging/MessagesFAB";
import broadcastService from "../services/broadcastService";
import audioManager from "../utils/audioUtils";

// Enhanced avatar list with better quality placeholders
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

// ENHANCED MOCK DATA FOR COMPREHENSIVE TESTING
// This includes all message types, attachments, reactions, and edge cases
const chatData = {
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
        text: "Absolutely! How about 1 PM at the usual place?",
        sender: "You",
        timestamp: "11:47",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "Perfect! I'll see you there. I have some questions about the new FICA requirements.",
        sender: "Jessica Wu",
        timestamp: "11:48",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (2).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "Great! I'll bring the updated guidelines. We can go through them together.",
        sender: "You",
        timestamp: "11:50",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "Thanks! You're always so helpful. Looking forward to it! 😊",
        sender: "Jessica Wu",
        timestamp: "11:52",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (2).jpg",
        status: "delivered"
      }
    ]
  },
  3: {
    id: 3,
    name: "Project Alpha",
    avatarUrl: "/images/avatars/face_1 (3).jpg",
    online: true,
    role: "Project Team",
    messages: [
      {
        id: 1,
        text: "Team update: We've completed phase 1 of the digital transformation project.",
        sender: "Project Alpha",
        timestamp: "14:20",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (3).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Great work everyone! What's our timeline for phase 2?",
        sender: "You",
        timestamp: "14:22",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "We're targeting a 3-week timeline. Phase 2 will focus on user interface improvements and mobile optimization.",
        sender: "Project Alpha",
        timestamp: "14:25",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (3).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "Sounds good! Do we need any additional resources for the mobile optimization?",
        sender: "You",
        timestamp: "14:27",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "We might need one additional frontend developer. I'll discuss with management and get back to you.",
        sender: "Project Alpha",
        timestamp: "14:30",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (3).jpg",
        status: "delivered"
      }
    ]
  },
  4: {
    id: 4,
    name: "Client: Mr. Patel",
    avatarUrl: "/images/avatars/face_1 (4).jpg",
    online: false,
    role: "Client",
    email: "r.patel@email.com",
    phone: "+27 82 345 6789",
    verificationStatus: {
      identity: true,
      address: true,
      employment: false,
      fica: true
    },
    messages: [
      {
        id: 1,
        text: "Good morning! I wanted to check on the status of my property registration.",
        sender: "Mr. Patel",
        timestamp: "08:15",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (4).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Good morning Mr. Patel! Your registration is progressing well. We're currently waiting for the municipal clearance certificate.",
        sender: "You",
        timestamp: "08:30",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "That's great to hear! Approximately how long does the municipal clearance usually take?",
        sender: "Mr. Patel",
        timestamp: "08:35",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (4).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "Typically 5-7 business days. I'll follow up with them today to ensure there are no delays.",
        sender: "You",
        timestamp: "08:40",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "Perfect! I really appreciate your proactive approach. This is why I chose EasyHomes.",
        sender: "Mr. Patel",
        timestamp: "08:42",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (4).jpg",
        status: "delivered"
      },
      {
        id: 6,
        text: "Thank you for your trust in us! I'll keep you updated on any progress.",
        sender: "You",
        timestamp: "08:45",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      }
    ]
  },
  5: {
    id: 5,
    name: "Team Marketing",
    avatarUrl: "/images/avatars/face_1 (5).jpg",
    online: true,
    role: "Marketing Team",
    messages: [
      {
        id: 1,
        text: "The new website launch campaign is ready for review. Can we schedule a meeting?",
        sender: "Team Marketing",
        timestamp: "16:45",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (5).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Looks great! How about tomorrow at 10 AM?",
        sender: "You",
        timestamp: "16:50",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "Perfect! I'll send you the meeting invite. We'll go through the analytics dashboard and conversion metrics.",
        sender: "Team Marketing",
        timestamp: "16:52",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (5).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "Excellent! I'm particularly interested in the mobile conversion rates.",
        sender: "You",
        timestamp: "16:55",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "Campaign launch is live! Initial metrics look very promising - 40% increase in leads!",
        sender: "Team Marketing",
        timestamp: "17:30",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (5).jpg",
        status: "delivered"
      }
    ]
  },
  6: {
    id: 6,
    name: "Anna Kim",
    avatarUrl: "/images/avatars/face_1 (6).jpg",
    online: true,
    role: "Senior Associate",
    email: "anna.kim@easyhomes.com",
    phone: "+27 11 345 6789",
    verificationStatus: {
      identity: true,
      address: true,
      employment: true,
      fica: true
    },
    messages: [
      {
        id: 1,
        text: "I've reviewed the contract amendments for the Johannesburg development project.",
        sender: "Anna Kim",
        timestamp: "13:20",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (6).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Excellent! Any concerns I should be aware of?",
        sender: "You",
        timestamp: "13:25",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "Overall it looks good, but I noticed a few clauses that could be optimized for better risk management.",
        sender: "Anna Kim",
        timestamp: "13:28",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (6).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "That's exactly the kind of insight I was hoping for. What time works for you tomorrow?",
        sender: "You",
        timestamp: "13:30",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "Let's sync up tomorrow at 11 AM to go through the details. I have a few suggestions for optimization.",
        sender: "Anna Kim",
        timestamp: "13:32",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (6).jpg",
        status: "delivered"
      },
      {
        id: 6,
        text: "Perfect! I'll book Conference Room A. Looking forward to your insights.",
        sender: "You",
        timestamp: "13:35",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      }
    ]
  },
  7: {
    id: 7,
    name: "Support Desk",
    avatarUrl: "/images/avatars/face_1 (7).jpg",
    online: true,
    role: "Support Team",
    messages: [
      {
        id: 1,
        text: "Your IT support ticket #2024-0156 has been resolved. Please test the new printer setup.",
        sender: "Support Desk",
        timestamp: "10:30",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (7).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Thank you! The printer is working perfectly now.",
        sender: "You",
        timestamp: "10:45",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "Great! We've also updated your network settings for better performance. Is everything running smoothly?",
        sender: "Support Desk",
        timestamp: "10:50",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (7).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "Yes, everything is working much faster now. Thanks for the excellent support!",
        sender: "You",
        timestamp: "10:55",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "You're welcome! Please let us know if you need any further assistance. We're here to help 24/7.",
        sender: "Support Desk",
        timestamp: "11:00",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (7).jpg",
        status: "delivered"
      }
    ]
  },
  8: {
    id: 8,
    name: "Jane Doe",
    avatarUrl: "/images/avatars/face_1 (8).jpg",
    online: true,
    role: "Property Consultant",
    email: "jane.doe@easyhomes.com",
    phone: "+27 11 456 7890",
    verificationStatus: {
      identity: true,
      address: true,
      employment: true,
      fica: true
    },
    messages: [
      {
        id: 1,
        text: "Hi! I hope you're having a great day. I wanted to update you on the Sandton property listing.",
        sender: "Jane Doe",
        timestamp: "15:20",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (8).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Hi Jane! Thanks for the update. How are the viewings going?",
        sender: "You",
        timestamp: "15:25",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "Really well! We've had 8 viewings this week and 3 serious inquiries. The pricing seems spot on.",
        sender: "Jane Doe",
        timestamp: "15:27",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (8).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "That's fantastic news! Any offers yet?",
        sender: "You",
        timestamp: "15:30",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "Yes! We received an offer this morning - R2.8M, which is very close to asking price. The buyers are pre-approved.",
        sender: "Jane Doe",
        timestamp: "15:32",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (8).jpg",
        status: "delivered"
      },
      {
        id: 6,
        text: "Excellent work! Let's discuss the terms. Are you free for a quick call?",
        sender: "You",
        timestamp: "15:35",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 7,
        text: "Absolutely! I'm free now. Should I call you or would you prefer to meet in person?",
        sender: "Jane Doe",
        timestamp: "15:36",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (8).jpg",
        status: "delivered"
      },
      {
        id: 8,
        text: "Let's do a video call. I'll send you the meeting link now.",
        sender: "You",
        timestamp: "15:38",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      }
    ]
  },
  9: {
    id: 9,
    name: "Michael Chen",
    avatarUrl: "/images/avatars/face_1 (9).jpg",
    online: false,
    role: "Legal Assistant",
    email: "michael.chen@easyhomes.com",
    phone: "+27 11 567 8901",
    verificationStatus: {
      identity: true,
      address: true,
      employment: true,
      fica: true
    },
    messages: [
      {
        id: 1,
        text: "Good afternoon! I've completed the title deed search for the Rosebank property.",
        sender: "Michael Chen",
        timestamp: "14:15",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (9).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Great! Any issues found?",
        sender: "You",
        timestamp: "14:20",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "Clean title, no encumbrances. However, there's a small boundary dispute from 2019 that was resolved but worth noting.",
        sender: "Michael Chen",
        timestamp: "14:22",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (9).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "Thanks for catching that. Can you send me the resolution documents?",
        sender: "You",
        timestamp: "14:25",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "Already prepared! I'll email them to you now along with the full title search report.",
        sender: "Michael Chen",
        timestamp: "14:27",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (9).jpg",
        status: "delivered"
      },
      {
        id: 6,
        text: "Perfect! Your attention to detail is always appreciated. Thanks Michael!",
        sender: "You",
        timestamp: "14:30",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      }
    ]
  },
  10: {
    id: 10,
    name: "Sarah Williams",
    avatarUrl: "/images/avatars/face_1 (10).jpg",
    online: true,
    role: "Client Relations Manager",
    email: "sarah.williams@easyhomes.com",
    phone: "+27 11 678 9012",
    verificationStatus: {
      identity: true,
      address: true,
      employment: true,
      fica: true
    },
    messages: [
      {
        id: 1,
        text: "Hi! I wanted to give you a heads up about Mrs. Thompson's feedback on her recent property purchase.",
        sender: "Sarah Williams",
        timestamp: "12:30",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (10).jpg",
        status: "delivered"
      },
      {
        id: 2,
        text: "Oh, I hope it's positive! How did everything go?",
        sender: "You",
        timestamp: "12:35",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "Absolutely glowing! She specifically mentioned your professionalism and how you made the process stress-free. 5-star review! ⭐⭐⭐⭐⭐",
        sender: "Sarah Williams",
        timestamp: "12:37",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (10).jpg",
        status: "delivered"
      },
      {
        id: 4,
        text: "That's wonderful to hear! Mrs. Thompson was such a pleasure to work with.",
        sender: "You",
        timestamp: "12:40",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "She also mentioned she'll be referring her daughter who's looking to buy her first home. Great work building that relationship!",
        sender: "Sarah Williams",
        timestamp: "12:42",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (10).jpg",
        status: "delivered"
      },
      {
        id: 6,
        text: "That's the best compliment! I'll make sure to give her daughter the same level of service. Thanks for letting me know! 😊",
        sender: "You",
        timestamp: "12:45",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      }
    ]
  },
  // DIAGNOSTIC TEST CONVERSATION - All Features
  99: {
    id: 99,
    name: "Test Features",
    avatarUrl: "/images/avatars/face_1 (20).jpg",
    online: true,
    role: "Test Environment",
    email: "test@easyhomes.com",
    phone: "+27 11 999 0000",
    verificationStatus: {
      identity: true,
      address: true,
      employment: true,
      fica: true
    },
    messages: [
      {
        id: 1,
        text: "**DIAGNOSTIC MESSAGE**: This conversation tests all messaging features including attachments, reactions, and formatting.",
        sender: "Test Bot",
        timestamp: "10:00",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (20).jpg",
        status: "delivered",
        reactions: [
          { emoji: "👍", users: ["user1", "user2"], count: 2 },
          { emoji: "❤️", users: ["user3"], count: 1 }
        ]
      },
      {
        id: 2,
        text: "Testing **bold text**, *italic text*, and formatting support.",
        sender: "You",
        timestamp: "10:01",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 3,
        text: "File attachment test - this message should show an attachment preview",
        sender: "Test Bot",
        timestamp: "10:02",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (20).jpg",
        status: "delivered",
        hasAttachment: true,
        attachmentName: "test-document.pdf",
        attachmentSize: "1.2 MB"
      },
      {
        id: 4,
        text: "Testing call functionality - video and voice call buttons should work",
        sender: "You",
        timestamp: "10:03",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read"
      },
      {
        id: 5,
        text: "Testing emoji picker - click the emoji button to test iOS-style picker",
        sender: "Test Bot",
        timestamp: "10:04",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (20).jpg",
        status: "delivered"
      },
      {
        id: 6,
        text: "Testing file upload - drag and drop or click attachment button",
        sender: "You",
        timestamp: "10:05",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "delivered"
      },
      {
        id: 7,
        text: "Testing search functionality - use the search bar to find messages",
        sender: "Test Bot",
        timestamp: "10:06",
        isSent: false,
        senderAvatar: "/images/avatars/face_1 (20).jpg",
        status: "delivered"
      },
      {
        id: 8,
        text: "All features should be working:\n• iOS Emoji Picker\n• File Attachments\n• Video/Voice Calls\n• Message Reactions\n• Smooth Scrolling\n• Message Status\n• User Profiles",
        sender: "You",
        timestamp: "10:07",
        isSent: true,
        senderAvatar: "/images/avatars/face 2 (2).jpg",
        status: "read",
        reactions: [
          { emoji: "✅", users: ["test-bot"], count: 1 }
        ]
      }
    ]
  }
};

// Mock message pools for specific conversations (clean format, no ** formatting)
const conversationMessages = {
  0: [ // Firm-Wide Broadcast
    "Team Meeting scheduled for tomorrow at 10 AM in Conference Room A",
    "New document retention guidelines are now in effect",
    "Congratulations to Sarah for completing her advanced certification!",
    "System Maintenance will occur this weekend from 2-6 AM",
    "Advanced Property Law seminar available next Friday",
    "Our team exceeded client satisfaction targets this month",
    "New client onboarding process starts Monday",
    "Please update your passwords by end of week"
  ],
  
  1: [ // John Carlo
    "Can you review the Henderson file when you have a moment?",
    "The client called about expediting their transfer",
    "Draft deed is ready for your review and approval",
    "Running 10 minutes late for our 2 PM meeting",
    "Completed the FICA verification for new client",
    "Need status update on the Patel property transfer",
    "Client wants to schedule consultation this week",
    "Have you received the updated deed of sale?"
  ],
  
  2: [ // Jessica Wu
    "I've updated the compliance checklist - please check",
    "Are you free for lunch today? Want to discuss new procedures",
    "Perfect! I'll see you there. Have some questions about FICA requirements",
    "Thanks! You're always so helpful. Looking forward to it!",
    "Can we go through the new compliance procedures together?",
    "I need help with the Williams matter documentation",
    "The client submitted all required documents this morning",
    "Meeting went well - client is very satisfied with our service"
  ],
  
  3: [ // Project Alpha
    "Phase 2 development is ahead of schedule",
    "Need approval for additional frontend resources",
    "Mobile optimization testing completed successfully",
    "User interface improvements are ready for review",
    "Client feedback on new features is very positive",
    "Ready to deploy the latest updates to production",
    "Team meeting scheduled for tomorrow at 3 PM",
    "Budget review needed for next quarter planning"
  ],
  
  4: [ // Client: Mr. Patel
    "Thank you for the update on my property registration",
    "When can I expect the municipal clearance certificate?",
    "I have some questions about the transfer process",
    "The documentation you provided was very helpful",
    "Can we schedule a meeting to discuss next steps?",
    "I'm very satisfied with EasyHomes service so far",
    "Do I need to provide any additional documents?",
    "Looking forward to completing this transaction soon"
  ],
  
  5: [ // Team Marketing
    "New campaign metrics are exceeding expectations",
    "Website conversion rates have improved by 35%",
    "Social media engagement is at an all-time high",
    "Need approval for additional marketing budget",
    "Client testimonials are coming in very positive",
    "Ready to launch the next phase of our campaign",
    "Analytics dashboard shows strong ROI trends",
    "Competitor analysis report is ready for review"
  ],
  
  6: [ // Anna Kim
    "Contract review for Johannesburg project is complete",
    "Found some optimization opportunities in the agreement",
    "Risk management clauses need minor adjustments",
    "Client is very happy with our legal expertise",
    "Ready to finalize the development contract terms",
    "Compliance check completed - everything looks good",
    "Meeting with stakeholders went very well today",
    "Legal documentation is ready for your signature"
  ],
  
  7: [ // Support Desk
    "Your IT ticket has been resolved successfully",
    "Network performance improvements are now active",
    "New software updates are available for installation",
    "Printer configuration has been optimized",
    "Security patches have been applied to all systems",
    "Backup systems are functioning perfectly",
    "Help desk is available 24/7 for any issues",
    "System maintenance completed ahead of schedule"
  ],
  
  8: [ // Jane Doe
    "Sandton property listing is getting great interest",
    "Three serious buyers are considering offers",
    "Property viewing scheduled for this afternoon",
    "Market analysis shows excellent pricing strategy",
    "Client is very impressed with our service quality",
    "New listing photos have increased inquiry rates",
    "Ready to present the latest offer to the seller",
    "Property market trends are very favorable right now"
  ],
  
  9: [ // Michael Chen
    "Title deed search completed for Rosebank property",
    "Legal documentation review is finished",
    "Found no issues with the property ownership history",
    "Transfer documents are ready for processing",
    "Client meeting went very well this morning",
    "All compliance requirements have been met",
    "Ready to proceed with the next phase",
    "Legal team is standing by for any questions"
  ]
};

// Active conversations that can receive messages (all visible conversations)
const activeConversations = [
  { id: 0, name: "Firm-Wide Broadcast", sender: "System" },
  { id: 1, name: "John Carlo", sender: "John Carlo" },
  { id: 2, name: "Jessica Wu", sender: "Jessica Wu" },
  { id: 3, name: "Project Alpha", sender: "Project Alpha" },
  { id: 4, name: "Client: Mr. Patel", sender: "Mr. Patel" },
  { id: 5, name: "Team Marketing", sender: "Team Marketing" },
  { id: 6, name: "Anna Kim", sender: "Anna Kim" },
  { id: 7, name: "Support Desk", sender: "Support Desk" },
  { id: 8, name: "Jane Doe", sender: "Jane Doe" },
  { id: 9, name: "Michael Chen", sender: "Michael Chen" }
];

// Track last message sender to ensure fair distribution
let lastMessageSenders = [];

// All conversations are now in the main chatData object

const MessagesPage = () => {
  // Start with test conversation for diagnostics
  const [activeConversationId, setActiveConversationId] = useState(99);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [dynamicChatData, setDynamicChatData] = useState(chatData);
  
  // Notification system state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [newMessageCounters, setNewMessageCounters] = useState({});
  const [lastReadMessages, setLastReadMessages] = useState({});

  // User role for broadcast permissions (in real app, this would come from auth context)
  const userRole = 'admin'; // or 'user', 'conveyancer', etc.

  // Notification sound function
  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a pleasant notification sound (two-tone chime)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio context not available:', error);
    }
  }, []);

  // Generate new message notification with fair distribution
  const generateNotification = useCallback(() => {
    // Get available conversations (exclude those that sent last 2 messages for fair distribution)
    let availableConversations = activeConversations.filter(conv => 
      !lastMessageSenders.slice(-2).includes(conv.id)
    );
    
    // If all conversations are in recent senders, reset and use all
    if (availableConversations.length === 0) {
      availableConversations = activeConversations;
      lastMessageSenders = [];
    }
    
    // Randomly select a conversation
    const selectedConversation = availableConversations[Math.floor(Math.random() * availableConversations.length)];
    const conversationId = selectedConversation.id;
    
    // Get message pool for this conversation
    const messagePool = conversationMessages[conversationId];
    const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
    
    // Get conversation data for proper sender info
    const conversationData = dynamicChatData[conversationId];
    
    const newMessage = {
      id: Date.now() + Math.random(),
      text: randomMessage,
      sender: selectedConversation.sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: false,
      senderAvatar: conversationData?.avatarUrl || "/images/avatars/face_1 (1).jpg",
      status: "delivered",
      isNewNotification: true,
      isBroadcast: conversationId === 0 // Only firm broadcast is broadcast type
    };

    // Debug logging
    console.log('🖼️ New message avatar info:', {
      conversationId,
      sender: selectedConversation.sender,
      avatarUrl: conversationData?.avatarUrl,
      senderAvatar: newMessage.senderAvatar
    });

    // Update chat data with new message
    setDynamicChatData(prevData => {
      const updatedData = { ...prevData };
      if (updatedData[conversationId]) {
        // Add new message to the beginning (newest first)
        updatedData[conversationId].messages = [newMessage, ...(updatedData[conversationId].messages || [])];
        
        // Update last activity timestamp for sorting
        updatedData[conversationId].lastActivity = Date.now();
      }
      return updatedData;
    });

    // Update unread counts
    setUnreadCounts(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || 0) + 1
    }));

    // Update new message counter for line breakers
    setNewMessageCounters(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || 0) + 1
    }));

    // Track this sender for fair distribution
    lastMessageSenders.push(conversationId);
    if (lastMessageSenders.length > 3) {
      lastMessageSenders.shift(); // Keep only last 3
    }

    // Play notification sound
    playNotificationSound();

    console.log(`📢 New message from ${selectedConversation.name}:`, randomMessage);
  }, [playNotificationSound, dynamicChatData]);

  // Auto-clear unread messages when conversation is opened
  useEffect(() => {
    if (activeConversationId && unreadCounts[activeConversationId] > 0) {
      // Clear unread count for active conversation
      setUnreadCounts(prev => ({
        ...prev,
        [activeConversationId]: 0
      }));

      // Mark messages as read and remove new notification flags
      setDynamicChatData(prevData => {
        const updatedData = { ...prevData };
        if (updatedData[activeConversationId]) {
          updatedData[activeConversationId].messages = updatedData[activeConversationId].messages.map(msg => ({
            ...msg,
            isNewNotification: false
          }));
        }
        return updatedData;
      });

      // Reset new message counter
      setNewMessageCounters(prev => ({
        ...prev,
        [activeConversationId]: 0
      }));
    }
  }, [activeConversationId, unreadCounts]);

  // Single notification interval with random conversation selection
  useEffect(() => {
    if (!notificationsEnabled) return;

    // Generate notifications every 45 seconds with random conversation selection
    const interval = setInterval(() => {
      generateNotification();
    }, 45000); // 45 seconds for demo (adjust as needed)

    return () => {
      clearInterval(interval);
    };
  }, [notificationsEnabled, generateNotification]);

  // Enhanced call handlers with better UX feedback and iOS ringing sound
  const handleVideoCall = useCallback((chat) => {
    console.log('📹 Initiating video call with:', chat?.name);
    console.log('🔊 Starting iOS ringing sound for video call...');
    
    // Start iOS ringing sound immediately when call is initiated
    audioManager.startIOSRinging();
    
    setSelectedUserData(chat);
    setShowVideoCall(true);
  }, []);

  const handleVoiceCall = useCallback((chat) => {
    console.log('📞 Initiating voice call with:', chat?.name);
    console.log('🔊 Starting iOS ringing sound for voice call...');
    
    // Start iOS ringing sound immediately when call is initiated
    audioManager.startIOSRinging();
    
    setSelectedUserData(chat);
    setShowVoiceCall(true);
  }, []);

  const handleCallEnd = useCallback(() => {
    console.log('📞 Ending call and stopping ringing sound...');
    
    // Stop any ringing sound when call ends
    audioManager.stopRinging();
    
    setShowVideoCall(false);
    setShowVoiceCall(false);
    setSelectedUserData(null);
  }, []);

  // User profile modal handlers
  const handleUserProfileClick = useCallback((user) => {
    setSelectedUserData(user);
    setShowUserProfile(true);
  }, []);

  const handleCloseUserProfile = useCallback(() => {
    setShowUserProfile(false);
    setSelectedUserData(null);
  }, []);

  // Handle broadcast sending - REAL FUNCTIONALITY
  const handleSendBroadcast = useCallback(async (broadcastMessage) => {
    console.log('Handling broadcast send:', broadcastMessage);
    
    try {
      // Add broadcast to the firm-wide broadcast conversation (ID: 0)
      setDynamicChatData(prevData => {
        const updatedData = { ...prevData };
        
        // Add to broadcast conversation
        if (updatedData[0]) {
          const newBroadcastMsg = {
            id: broadcastMessage.id,
            text: `**${broadcastMessage.subject}**: ${broadcastMessage.text}`,
            sender: broadcastMessage.sender,
            timestamp: broadcastMessage.timestamp,
            isBroadcast: true,
            priority: broadcastMessage.priority,
            subject: broadcastMessage.subject,
            recipients: broadcastMessage.recipients,
            status: 'delivered',
            readBy: []
          };
          
          updatedData[0].messages = [...(updatedData[0].messages || []), newBroadcastMsg];
        }

        // If targeting specific group, create/update group conversation
        if (broadcastMessage.recipients.groupId !== 'all') {
          const groupChatId = `group_${broadcastMessage.recipients.groupId}`;
          
          if (!updatedData[groupChatId]) {
            // Create new group conversation
            updatedData[groupChatId] = {
              id: groupChatId,
              name: `${broadcastMessage.recipients.groupName}`,
              avatarUrl: '/images/avatars/face_1 (1).jpg',
              online: true,
              role: 'Group Chat',
              isGroup: true,
              members: broadcastMessage.recipients.members,
              messages: []
            };
          }
          
          // Add broadcast as announcement in group chat
          const groupAnnouncementMsg = {
            id: `${broadcastMessage.id}_group`,
            text: `**ANNOUNCEMENT**: ${broadcastMessage.text}`,
            sender: broadcastMessage.sender,
            timestamp: broadcastMessage.timestamp,
            isBroadcast: true,
            isAnnouncement: true,
            priority: broadcastMessage.priority,
            subject: broadcastMessage.subject,
            status: 'delivered',
            readBy: []
          };
          
          updatedData[groupChatId].messages = [...(updatedData[groupChatId].messages || []), groupAnnouncementMsg];
        }

        return updatedData;
      });

      console.log('Broadcast successfully added to conversations');
      return true;
      
    } catch (error) {
      console.error('Failed to handle broadcast:', error);
      throw error;
    }
  }, []);

  // COMPREHENSIVE DIAGNOSTIC LOGGING
  console.log('MESSAGING DIAGNOSTICS:');
  console.log('Active Conversation ID:', activeConversationId);
  console.log('Available Chat IDs:', Object.keys(dynamicChatData));
  console.log('Selected Chat Data:', dynamicChatData[activeConversationId]);
  console.log('Selected Chat Messages:', dynamicChatData[activeConversationId]?.messages?.length || 0);
  console.log('User Role:', userRole);
  console.log('Show User Profile:', showUserProfile);
  console.log('Show Video Call:', showVideoCall);
  console.log('Show Voice Call:', showVoiceCall);
  
  // Component validation
  if (!dynamicChatData[activeConversationId]) {
    console.error('ERROR: No chat data found for ID:', activeConversationId);
  }
  
  // Feature availability check
  console.log('FEATURE AVAILABILITY CHECK:');
  console.log('ConversationList Component: Loaded');
  console.log('ChatWindow Component: Loaded');
  console.log('CallModal Component: Loaded');
  console.log('BroadcastService: Loaded');
  console.log('Dynamic Chat Data: Real-time updates enabled');
  console.log('Test Conversation (ID 99): Available for feature testing');

  return (
    <div className="h-screen flex bg-gray-50 font-['Poppins']">
      {/* Notification Toggle - Repositioned to bottom right */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Demo Notifications</span>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="rounded border-gray-300"
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Random messages every 45 seconds from 10 conversations
          </div>
        </div>
      </div>

      {/* Conversation List */}
      <div className="w-80 border-r border-gray-200 bg-white shadow-sm">
        <ConversationList
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
          onUserProfileClick={handleUserProfileClick}
          chatData={dynamicChatData}
          userRole={userRole}
          onSendBroadcast={handleSendBroadcast}
          unreadCounts={unreadCounts}
          newMessageCounters={newMessageCounters}
        />
      </div>

      {/* Right Panel: Enhanced Chat Window */}
      <div className="flex-1 h-full min-w-0 flex flex-col bg-white relative">
        <ChatWindow 
          chat={dynamicChatData[activeConversationId]} 
          onVideoCall={handleVideoCall}
          onVoiceCall={handleVoiceCall}
          onUserProfileClick={handleUserProfileClick}
        />
      </div>

      {/* Enhanced Call Modal with Better Animations */}
      <CallModal
        isOpen={showVideoCall || showVoiceCall}
        onClose={handleCallEnd}
        contact={selectedUserData}
        callType={showVideoCall ? 'video' : 'voice'}
        onCallStart={(contact, type) => {
          console.log(`Call started: ${type} call with ${contact.name}`);
        }}
        onCallEnd={(contact, type, duration) => {
          console.log(`Call ended: ${type} call with ${contact.name}, duration: ${duration}s`);
          handleCallEnd();
        }}
      />

      {/* User Profile Modal - Phase 2 Implementation */}
      {showUserProfile && selectedUserData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-gray-100">
              <button
                onClick={handleCloseUserProfile}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* User Avatar - Large and Prominent */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img 
                    src={selectedUserData.avatarUrl} 
                    alt={selectedUserData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {selectedUserData.online && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-3 border-white rounded-full"></div>
                  )}
                </div>
                
                {/* User Info */}
                <h2 className="text-2xl font-bold text-gray-900 mt-4">{selectedUserData.name}</h2>
                <p className="text-sm text-blue-600 font-medium">{selectedUserData.role}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">{selectedUserData.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-700">{selectedUserData.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Verification Status - Key Feature */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Verification Status</h3>
                <div className="space-y-2">
                  {[
                    { key: 'identityVerified', label: 'Identity Verified' },
                    { key: 'proofOfAddress', label: 'Proof of Address Confirmed' },
                    { key: 'ficaCompliant', label: 'FICA Compliant' },
                    { key: 'bondApproved', label: 'Bond Approved' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {selectedUserData.verificationStatus?.[key] ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span className={`text-sm ${selectedUserData.verificationStatus?.[key] ? 'text-gray-700' : 'text-gray-500'}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => handleVideoCall(selectedUserData)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Video Call
                </button>
                <button 
                  onClick={() => handleVoiceCall(selectedUserData)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Voice Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages FAB for quick messaging actions */}
      <MessagesFAB 
        activeChat={dynamicChatData[activeConversationId]}
        onVideoCall={handleVideoCall}
        onVoiceCall={handleVoiceCall}
      />
    </div>
  );
};

export default MessagesPage; 