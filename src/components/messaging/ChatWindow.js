import React, { useRef, useEffect, useState } from "react";
import { FiVideo, FiPhone, FiMoreHorizontal, FiPaperclip, FiSend, FiSmile, FiCamera } from "react-icons/fi";
import MessageBubble from "./MessageBubble";

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

const CURRENT_USER_AVATAR = '/images/avatars/face 2 (2).jpg';

const dummyChat = {
  id: 1,
  name: "John Carlo",
  avatarUrl: avatarList[1],
  online: true,
  matter: {
    id: 1204,
    address: "12 Oak Avenue",
  },
  messages: [
    {
      id: 1,
      text: "Hi John, please see the attached document.",
      timestamp: "09:00",
      isSent: false,
      senderAvatar: avatarList[2],
      status: 'read',
    },
    {
      id: 2,
      text: "Here is the signed contract.",
      timestamp: "09:01",
      isSent: true,
      senderAvatar: avatarList[1],
      status: 'read',
    },
    {
      id: 3,
      text: "Thank you! I'll review and get back to you.",
      timestamp: "09:02",
      isSent: false,
      senderAvatar: avatarList[3],
      status: 'delivered',
    },
    {
      id: 4,
      text: "System update scheduled for 2 AM, June 2nd.",
      timestamp: "09:05",
      isBroadcast: true,
    },
    {
      id: 5,
      text: "Please see the attached PDF.",
      timestamp: "09:10",
      isSent: true,
      attachment: { name: "contract.pdf" },
      senderAvatar: avatarList[1],
      status: 'delivered',
    },
    {
      id: 6,
      text: "Here's an image.",
      timestamp: "09:11",
      isSent: true,
      senderAvatar: avatarList[1],
      status: 'sent',
    },
    {
      id: 7,
      text: "This is another system message.",
      timestamp: "09:12",
      isBroadcast: true,
    },
    {
      id: 8,
      text: "Let me know if you have any questions!",
      timestamp: "09:13",
      isSent: false,
      senderAvatar: avatarList[4],
      status: 'read',
    },
    {
      id: 9,
      text: "Received, thank you!",
      timestamp: "09:14",
      isSent: true,
      senderAvatar: avatarList[1],
      status: 'read',
    },
    // Additional simulated messages for a busy chat
    {
      id: 10,
      text: "Quarterly meeting at 3 PM today.",
      timestamp: "09:15",
      isBroadcast: true,
    },
    {
      id: 11,
      text: "Can you review the contract?",
      timestamp: "09:16",
      isSent: false,
      senderAvatar: avatarList[5],
      status: 'delivered',
    },
    {
      id: 12,
      text: "Invoice #1042 has been approved.",
      timestamp: "09:17",
      isBroadcast: true,
    },
    {
      id: 13,
      text: "New compliance guidelines released.",
      timestamp: "09:18",
      isBroadcast: true,
    },
    {
      id: 14,
      text: "Thanks for your help!",
      timestamp: "09:19",
      isSent: false,
      senderAvatar: avatarList[8],
      status: 'read',
    },
    {
      id: 15,
      text: "Policy update: Remote work extended.",
      timestamp: "09:20",
      isBroadcast: true,
    },
    {
      id: 16,
      text: "Lunch at 1 PM?",
      timestamp: "09:21",
      isSent: false,
      senderAvatar: avatarList[10],
      status: 'delivered',
    },
    {
      id: 17,
      text: "Deadline moved to next Friday.",
      timestamp: "09:22",
      isBroadcast: true,
    },
    {
      id: 18,
      text: "Received the documents, thank you.",
      timestamp: "09:23",
      isSent: false,
      senderAvatar: avatarList[12],
      status: 'read',
    },
    {
      id: 19,
      text: "Campaign launch is live!",
      timestamp: "09:24",
      isBroadcast: true,
    },
    {
      id: 20,
      text: "Let's sync up tomorrow.",
      timestamp: "09:25",
      isSent: false,
      senderAvatar: avatarList[14],
      status: 'delivered',
    },
    {
      id: 21,
      text: "Your ticket has been resolved.",
      timestamp: "09:26",
      isBroadcast: true,
    },
    {
      id: 22,
      text: "Can we reschedule our call?",
      timestamp: "09:27",
      isSent: false,
      senderAvatar: avatarList[16],
      status: 'read',
    },
    {
      id: 23,
      text: "System maintenance at midnight.",
      timestamp: "09:28",
      isBroadcast: true,
    },
    {
      id: 24,
      text: "I'll send the files shortly.",
      timestamp: "09:29",
      isSent: false,
      senderAvatar: avatarList[18],
      status: 'delivered',
    },
    {
      id: 25,
      text: "Reminder: Submit your reports.",
      timestamp: "09:30",
      isBroadcast: true,
    },
    {
      id: 26,
      text: "Looking forward to our meeting.",
      timestamp: "09:31",
      isSent: false,
      senderAvatar: avatarList[1],
      status: 'read',
    },
  ],
};

const ChatWindow = ({ chat }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (!chat) return (
    <div className="flex flex-col h-full bg-gray-50 w-full items-center justify-center text-gray-400 text-lg">
      Select a conversation to start chatting.
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 w-full">
      {/* Search Bar */}
      <div className="px-6 py-3 bg-white border-b border-gray-100">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Search messages, contacts..."
        />
      </div>
      {/* Chat Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-white min-h-[60px]">
        <img src={chat.avatarUrl} alt={chat.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-lg truncate">{chat.name}</div>
          <div className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> Online
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button className="p-2 text-gray-400 hover:text-blue-500"><FiMoreHorizontal className="w-5 h-5" /></button>
          <button className="p-2 rounded-full hover:bg-gray-100"><FiVideo className="w-5 h-5 text-gray-500" /></button>
          <button className="p-2 rounded-full hover:bg-gray-100"><FiPhone className="w-5 h-5 text-gray-500" /></button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
        <div className="flex flex-col gap-4 w-full">
          {chat.messages.map(msg => (
            <MessageBubble
              key={msg.id}
              {...msg}
              senderAvatar={msg.isSent ? CURRENT_USER_AVATAR : chat.avatarUrl}
              status={msg.status}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Message Input */}
      <form className="flex items-center gap-2 px-6 py-4 border-t bg-white w-full" onSubmit={e => { e.preventDefault(); }}>
        <button type="button" className="p-2 text-gray-400 hover:text-blue-500"><FiPaperclip className="w-5 h-5" /></button>
        <div className="relative flex-1 min-w-0 flex items-center bg-gray-50 border rounded-full px-4 py-2">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none px-2 py-1 text-base"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="button" className="p-2 text-gray-400 hover:text-blue-500"><FiSmile className="w-5 h-5" /></button>
          <button type="button" className="p-2 text-gray-400 hover:text-blue-500"><FiCamera className="w-5 h-5" /></button>
          {input.trim() && (
            <button type="submit" className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"><FiSend className="w-5 h-5" /></button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatWindow; 