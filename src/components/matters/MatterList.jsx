import React from "react";
import MatterCard from "./MatterCard";

const MatterList = ({ matters, onRowClick }) => {
  if (!matters.length) {
    return (
      <div className="text-center text-gray-400 py-12 bg-white rounded-xl shadow-md mt-4 flex flex-col items-center">
        <svg className="w-12 h-12 mb-2 text-gray-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 0V7a2 2 0 00-2-2h-4.18A2 2 0 0112 3.82V3a2 2 0 00-2-2H6a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2v-1.18a2 2 0 01.82-1.64L21 13.41V13a2 2 0 00-2-2h-3a4 4 0 00-4 4v2" /></svg>
        <div>No matters found — try changing filters or adding a new one.</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {matters.map(matter => (
        <MatterCard key={matter.id} matter={matter} onClick={() => onRowClick(matter)} />
      ))}
    </div>
  );
};

export default MatterList; 