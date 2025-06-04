import React from "react";

const dummyMatters = [
  {
    id: 1,
    client: "Alice Smith",
    property: "12 Oak Ave",
    status: "Lodged",
    date: "2024-05-01",
    assigned: "John Doe",
  },
  {
    id: 2,
    client: "Bob Jones",
    property: "34 Maple St",
    status: "Prep",
    date: "2024-05-02",
    assigned: "Jane Lee",
  },
  // add more dummy rows if needed
];

const MattersTable = () => {
  return (
    <table className="min-w-full text-left table-auto">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          <th className="px-6 py-3">Client</th>
          <th className="px-6 py-3">Property</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Date</th>
          <th className="px-6 py-3">Assigned</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {dummyMatters.map((matter) => (
          <tr
            key={matter.id}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="px-6 py-4">{matter.client}</td>
            <td className="px-6 py-4">{matter.property}</td>
            <td className="px-6 py-4">{matter.status}</td>
            <td className="px-6 py-4">{matter.date}</td>
            <td className="px-6 py-4">{matter.assigned}</td>
            <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">
              View
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MattersTable; 