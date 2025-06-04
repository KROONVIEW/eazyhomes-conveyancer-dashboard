import React, { useState } from "react";
import { FiPlus, FiSearch, FiVolume2 } from "react-icons/fi";
import ConversationItem from "./ConversationItem";

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

const dummyConversations = [
  {
    id: "broadcast",
    name: "Firm-Wide Broadcast",
    avatarUrl: avatarList[0],
    lastMessage: "System update scheduled for 2 AM, June 2nd.",
    timestamp: "2m ago",
    type: "broadcast",
  },
  {
    id: 1,
    name: "John Carlo",
    avatarUrl: avatarList[1],
    lastMessage: "See you at the office tomorrow!",
    timestamp: "5m ago",
    type: "personal",
  },
  {
    id: 2,
    name: "Team Transfers",
    avatarUrl: avatarList[2],
    lastMessage: "New transfer assigned to you.",
    timestamp: "10m ago",
    type: "team",
  },
  {
    id: 3,
    name: "Alice Smith",
    avatarUrl: avatarList[3],
    lastMessage: "Sent the signed documents.",
    timestamp: "1h ago",
    type: "personal",
  },
  {
    id: 4,
    name: "Team Announcements",
    avatarUrl: avatarList[4],
    lastMessage: "Quarterly meeting at 3 PM today.",
    timestamp: "15m ago",
    type: "team",
  },
  {
    id: 5,
    name: "Sarah Lee",
    avatarUrl: avatarList[5],
    lastMessage: "Can you review the contract?",
    timestamp: "20m ago",
    type: "personal",
  },
  {
    id: 6,
    name: "Finance Team",
    avatarUrl: avatarList[6],
    lastMessage: "Invoice #1042 has been approved.",
    timestamp: "25m ago",
    type: "team",
  },
  {
    id: 7,
    name: "Legal Updates",
    avatarUrl: avatarList[7],
    lastMessage: "New compliance guidelines released.",
    timestamp: "30m ago",
    type: "team",
  },
  {
    id: 8,
    name: "Michael Tan",
    avatarUrl: avatarList[8],
    lastMessage: "Thanks for your help!",
    timestamp: "35m ago",
    type: "personal",
  },
  {
    id: 9,
    name: "HR Team",
    avatarUrl: avatarList[9],
    lastMessage: "Policy update: Remote work extended.",
    timestamp: "40m ago",
    type: "team",
  },
  {
    id: 10,
    name: "Jessica Wu",
    avatarUrl: avatarList[10],
    lastMessage: "Lunch at 1 PM?",
    timestamp: "45m ago",
    type: "personal",
  },
  {
    id: 11,
    name: "Project Alpha",
    avatarUrl: avatarList[11],
    lastMessage: "Deadline moved to next Friday.",
    timestamp: "50m ago",
    type: "team",
  },
  {
    id: 12,
    name: "Client: Mr. Patel",
    avatarUrl: avatarList[12],
    lastMessage: "Received the documents, thank you.",
    timestamp: "1h ago",
    type: "personal",
  },
  {
    id: 13,
    name: "Team Marketing",
    avatarUrl: avatarList[13],
    lastMessage: "Campaign launch is live!",
    timestamp: "1h 10m ago",
    type: "team",
  },
  {
    id: 14,
    name: "Anna Kim",
    avatarUrl: avatarList[14],
    lastMessage: "Let's sync up tomorrow.",
    timestamp: "1h 20m ago",
    type: "personal",
  },
  {
    id: 15,
    name: "Support Desk",
    avatarUrl: avatarList[15],
    lastMessage: "Your ticket has been resolved.",
    timestamp: "1h 30m ago",
    type: "team",
  },
  {
    id: 16,
    name: "Client: Mrs. Green",
    avatarUrl: avatarList[16],
    lastMessage: "Can we reschedule our call?",
    timestamp: "2h ago",
    type: "personal",
  },
  {
    id: 17,
    name: "Team Operations",
    avatarUrl: avatarList[17],
    lastMessage: "System maintenance at midnight.",
    timestamp: "2h 10m ago",
    type: "team",
  },
  {
    id: 18,
    name: "David Lin",
    avatarUrl: avatarList[18],
    lastMessage: "I'll send the files shortly.",
    timestamp: "2h 20m ago",
    type: "personal",
  },
  {
    id: 19,
    name: "Team Compliance",
    avatarUrl: avatarList[19],
    lastMessage: "Reminder: Submit your reports.",
    timestamp: "2h 30m ago",
    type: "team",
  },
  {
    id: 20,
    name: "Client: Mr. Brown",
    avatarUrl: avatarList[1],
    lastMessage: "Looking forward to our meeting.",
    timestamp: "3h ago",
    type: "personal",
  },
  {
    id: 21,
    name: "Jane Doe",
    avatarUrl: avatarList[7],
    lastMessage: "Sent over the updated agreement.",
    timestamp: "just now",
    type: "personal",
  },
];

const tabOptions = [
  { label: "All", key: "all" },
  { label: "Personal", key: "personal" },
  { label: "Teams", key: "team" },
];

const ConversationList = ({ activeId, onSelect }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = dummyConversations.filter((c) =>
    activeTab === "all" ? true : c.type === activeTab
  ).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">Message</h1>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FiPlus className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      {/* Search Bar */}
      <div className="flex items-center px-4 py-2 border-b border-gray-100 bg-gray-50">
        <FiSearch className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm"
          placeholder="Search messages, contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Tabs */}
      <div className="flex space-x-4 px-4 py-2 border-b border-gray-100 bg-white">
        {tabOptions.map(tab => (
          <button
            key={tab.key}
            className={`pb-1 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Pinned Broadcast */}
      <div className="bg-yellow-50 flex items-center gap-3 px-4 py-3 border-b border-yellow-200 cursor-pointer">
        <span className="bg-yellow-400 text-white rounded-full p-1"><FiVolume2 className="w-4 h-4" /></span>
        <span className="font-semibold text-yellow-800 text-sm">Firm-Wide Broadcast</span>
      </div>
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.filter(c => c.type !== "broadcast").map(convo => (
          <ConversationItem
            key={convo.id}
            {...convo}
            active={activeId === convo.id}
            onClick={() => onSelect(convo.id)}
            unreadCount={convo.unreadCount || 0}
            type={convo.type}
            hasUnread={convo.unreadCount > 0}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationList; 