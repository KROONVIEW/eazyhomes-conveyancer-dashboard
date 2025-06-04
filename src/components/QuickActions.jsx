import React from "react";
import { FiPlusCircle, FiUpload, FiEdit3 } from 'react-icons/fi';

const actions = [
  { text: 'New Matter', icon: FiPlusCircle },
  { text: 'Upload Doc', icon: FiUpload },
  { text: 'New Invoice', icon: FiEdit3 },
];

export default function QuickActions() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="flex flex-col gap-2">
        <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Start New Transfer</button>
        <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">Upload Document</button>
        <button className="bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500">Add Note</button>
      </div>
    </div>
  );
} 