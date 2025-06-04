import React from "react";

const FiltersBar = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-white rounded-md shadow">
      <input
        type="text"
        placeholder="Search by client or property"
        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        <option value="prep">Prep</option>
        <option value="lodged">Lodged</option>
        <option value="signed">Signed</option>
      </select>
    </div>
  );
};

export default FiltersBar; 