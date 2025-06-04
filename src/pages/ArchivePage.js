import React, { useState } from "react";

const dummyTransfers = [
  { id: 1, name: "Transfer #101", date: "2024-05-01", status: "Completed" },
  { id: 2, name: "Transfer #102", date: "2024-05-03", status: "Completed" },
];
const dummyClients = [
  { id: 1, name: "Alice Smith", date: "2023-12-01", status: "Inactive" },
  { id: 2, name: "Bob Johnson", date: "2023-11-15", status: "Inactive" },
];
const dummyDocuments = [
  { id: 1, name: "Deed.pdf", date: "2023-10-10", status: "Archived" },
  { id: 2, name: "Contract.pdf", date: "2023-09-20", status: "Archived" },
];

const tabOptions = [
  { label: "Archived Transfers", key: "transfers" },
  { label: "Archived Clients", key: "clients" },
  { label: "Archived Documents", key: "documents" },
];

const ArchivePage = () => {
  const [activeTab, setActiveTab] = useState("transfers");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const renderTable = () => {
    let data = [];
    if (activeTab === "transfers") data = dummyTransfers;
    if (activeTab === "clients") data = dummyClients;
    if (activeTab === "documents") data = dummyDocuments;
    return (
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.status}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">View Details</button>
                  <button className="text-green-600 hover:text-green-900">Unarchive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Archived Records</h1>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <input
          type="text"
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search all archived items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option>All</option>
            <option>Transfers</option>
            <option>Clients</option>
            <option>Documents</option>
          </select>
          <input
            type="date"
            className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dateRange.from}
            onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
          />
          <span className="self-center text-gray-400">-</span>
          <input
            type="date"
            className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dateRange.to}
            onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-2">
        {tabOptions.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-medium text-sm rounded-t transition-colors focus:outline-none ${activeTab === tab.key ? "bg-white border border-b-0 border-gray-200 text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {renderTable()}
    </div>
  );
};

export default ArchivePage; 