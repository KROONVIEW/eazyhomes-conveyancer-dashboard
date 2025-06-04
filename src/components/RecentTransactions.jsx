import React from "react";

const mockTransactions = [
  { client: 'Alice Smith', property: '12 Oak Ave', status: 'Lodged', date: '2024-05-01', assigned: 'John Doe' },
  { client: 'Bob Jones', property: '34 Maple St', status: 'Prep', date: '2024-05-02', assigned: 'Jane Lee' },
  { client: 'Carol White', property: '56 Pine Rd', status: 'Signed', date: '2024-05-03', assigned: 'John Doe' },
  { client: 'David Black', property: '78 Cedar Blvd', status: 'Lodged', date: '2024-05-04', assigned: 'Jane Lee' },
  { client: 'Eva Green', property: '90 Birch Ln', status: 'Prep', date: '2024-05-05', assigned: 'John Doe' },
];

export default function RecentTransactions() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md col-span-2">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Client</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Property</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date Initiated</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Assigned To</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTransactions.map((tx, i) => (
              <tr key={i}>
                <td className="px-4 py-2">{tx.client}</td>
                <td className="px-4 py-2">{tx.property}</td>
                <td className="px-4 py-2">{tx.status}</td>
                <td className="px-4 py-2">{tx.date}</td>
                <td className="px-4 py-2">{tx.assigned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 