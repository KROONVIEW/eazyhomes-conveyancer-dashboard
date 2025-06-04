import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { PlusIcon, TrashIcon, PencilIcon, UserIcon, DocumentCheckIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const mockClients = [
  { id: 1, name: 'Alice Smith', role: 'Buyer', idNumber: '9001011234081', phone: '0821234567', email: 'alice@email.com', address: '12 Main Rd, Cape Town', fica: true, transfers: ['EZT1001'] },
  { id: 2, name: 'Bob Jones', role: 'Seller', idNumber: '8005055432082', phone: '0839876543', email: 'bob@email.com', address: '34 Oak Ave, JHB', fica: false, transfers: ['EZT1002', 'EZT1003'] },
];

function ClientsPage() {
  const [clients, setClients] = useState(mockClients);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  // Form state
  const [form, setForm] = useState({ name: '', role: 'Buyer', idNumber: '', phone: '', email: '', address: '', ficaId: null, ficaProof: null });

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <DashboardCard title="Clients">
        {/* Create Client Button & Bulk Upload */}
        <div className="flex items-center justify-between mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold" onClick={() => setShowModal(true)}>
            <PlusIcon className="h-5 w-5" /> Add Client
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-semibold">
            <ArrowUpTrayIcon className="h-5 w-5" /> Bulk Upload (CSV)
          </button>
        </div>
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-64"
          />
        </div>
        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-sm">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-center">FICA</th>
                <th className="py-2 px-4 text-center">Transfers</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4 font-medium text-blue-700 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-blue-400" /> {client.name}
                  </td>
                  <td className="py-2 px-4">{client.role}</td>
                  <td className="py-2 px-4">{client.phone}</td>
                  <td className="py-2 px-4">{client.email}</td>
                  <td className="py-2 px-4 text-center">
                    {client.fica ? (
                      <span className="inline-flex items-center gap-1 text-green-600 font-semibold"><DocumentCheckIcon className="h-4 w-4" /> FICA</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 font-semibold"><XMarkIcon className="h-4 w-4" /> Missing</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {client.transfers.map(t => <span key={t} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold mr-1">{t}</span>)}
                  </td>
                  <td className="py-2 px-4 text-right flex gap-2 justify-end">
                    <button className="p-1 rounded hover:bg-gray-100" title="Edit"><PencilIcon className="h-5 w-5 text-blue-500" /></button>
                    <button className="p-1 rounded hover:bg-red-100" title="Delete"><TrashIcon className="h-5 w-5 text-red-500" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Add Client Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Client</h3>
                <button onClick={() => setShowModal(false)}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input className="w-full border rounded px-2 py-1" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select className="w-full border rounded px-2 py-1" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    <option>Buyer</option>
                    <option>Seller</option>
                    <option>Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ID Number</label>
                  <input className="w-full border rounded px-2 py-1" value={form.idNumber} onChange={e => setForm(f => ({ ...f, idNumber: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input className="w-full border rounded px-2 py-1" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input className="w-full border rounded px-2 py-1" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Residential Address</label>
                  <input className="w-full border rounded px-2 py-1" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload ID (FICA)</label>
                  <input type="file" className="w-full" onChange={e => setForm(f => ({ ...f, ficaId: e.target.files[0] }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Proof of Residence</label>
                  <input type="file" className="w-full" onChange={e => setForm(f => ({ ...f, ficaProof: e.target.files[0] }))} />
                </div>
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => setShowModal(false)} type="button">Cancel</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold" type="submit">Add Client</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}

export default ClientsPage; 