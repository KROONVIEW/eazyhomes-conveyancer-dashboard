import React, { useState } from 'react';

const mockLogs = [
  { id: 1, user: 'Jane Doe', action: 'Uploaded Document', date: '2025-06-01T10:30:00Z', matter: 'EZT1001', details: 'FICA.pdf' },
  { id: 2, user: 'Sipho Dlamini', action: 'Changed Status', date: '2025-06-01T09:15:00Z', matter: 'EZT1002', details: 'Prep → Lodged' },
  { id: 3, user: 'Fatima Patel', action: 'Added Note', date: '2025-05-31T16:45:00Z', matter: 'EZT1003', details: 'Awaiting bank clearance' },
  { id: 4, user: 'Jane Doe', action: 'Deleted Document', date: '2025-05-30T14:20:00Z', matter: 'EZT1001', details: 'Old_POA.pdf' },
  { id: 5, user: 'Thabo Mokoena', action: 'Logged In', date: '2025-05-30T08:00:00Z', matter: '', details: '' },
  { id: 6, user: 'Jane Doe', action: 'Created Matter', date: '2025-05-29T11:10:00Z', matter: 'EZT1004', details: 'New transfer opened' },
];

const users = ['All', ...Array.from(new Set(mockLogs.map(l => l.user)).values())];
const actions = ['All', ...Array.from(new Set(mockLogs.map(l => l.action)).values())];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}

export default function AuditTrailPage() {
  const [user, setUser] = useState('All');
  const [action, setAction] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mockLogs.filter(l =>
    (user === 'All' || l.user === user) &&
    (action === 'All' || l.action === action) &&
    (l.matter.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Trail</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select className="border rounded p-2" value={user} onChange={e => setUser(e.target.value)}>
          {users.map(u => <option key={u}>{u}</option>)}
        </select>
        <select className="border rounded p-2" value={action} onChange={e => setAction(e.target.value)}>
          {actions.map(a => <option key={a}>{a}</option>)}
        </select>
        <input
          type="text"
          className="border rounded p-2 flex-1"
          placeholder="Search matter or details..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Export CSV</button>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Matter</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="px-4 py-2 whitespace-nowrap">{formatDate(log.date)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.user}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.action}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.matter}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.details}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center text-gray-400 py-8">No log entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 