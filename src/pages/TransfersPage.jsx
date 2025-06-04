import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { PlusIcon, DocumentTextIcon, UserIcon, HomeIcon, ArrowDownTrayIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import transfers from '../data/mockTransfers';

const stages = ['Instruction', 'FICA', 'OTP', 'Bond', 'Compliance', 'Lodged', 'Registered'];
const matterTypes = ['Freehold', 'Sectional', 'Estate', 'Divorce'];

function TransfersPage() {
  const [transfersData, setTransfers] = useState(transfers);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ file: '', property: '', buyer: '', seller: '', agent: '', type: matterTypes[0] });

  const filteredTransfers = transfersData.filter(t =>
    t.file.toLowerCase().includes(search.toLowerCase()) ||
    t.property.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardCard title="Transfers">
        {/* Create Transfer Button & Filter */}
        <div className="flex items-center justify-between mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold" onClick={() => setShowModal(true)}>
            <PlusIcon className="h-5 w-5" /> New Transfer
          </button>
          <input
            type="text"
            placeholder="Search by file or property..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-64"
          />
        </div>
        {/* Transfers Table */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-sm">
                <th className="py-2 px-4 text-left">File</th>
                <th className="py-2 px-4 text-left">Property</th>
                <th className="py-2 px-4 text-left">Buyer</th>
                <th className="py-2 px-4 text-left">Seller</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-center">Stage</th>
                <th className="py-2 px-4 text-center">Due</th>
                <th className="py-2 px-4 text-center">Assigned</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map((t, idx) => (
                <tr key={t.file} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 font-medium text-blue-700 flex items-center gap-2"><DocumentTextIcon className="h-4 w-4 text-blue-400" /> {t.file}</td>
                  <td className="py-2 px-4 truncate max-w-xs">{t.property}</td>
                  <td className="py-2 px-4 truncate max-w-xs">{t.buyer}</td>
                  <td className="py-2 px-4 truncate max-w-xs">{t.seller}</td>
                  <td className="py-2 px-4">{t.type}</td>
                  <td className="py-2 px-4 text-center">
                    <span className={
                      t.stage === 'Lodged' ? 'bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      t.stage === 'In Progress' ? 'bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      t.stage === 'Awaiting OTP' ? 'bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      t.stage === 'Bond Registration' ? 'bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      t.stage === 'Clearance Certificate' ? 'bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      t.stage === 'Signed by All Parties' ? 'bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      t.stage === 'Final Review' ? 'bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      t.stage === 'Lodgement Ready' ? 'bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      t.stage === 'Prep Deeds Office' ? 'bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      t.stage === 'Bond Cancelled' ? 'bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold' :
                      'bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold'
                    }>{t.stage}</span>
                  </td>
                  <td className="py-2 px-4 text-center">{t.due}</td>
                  <td className="py-2 px-4 text-center">{t.assigned}</td>
                  <td className="py-2 px-4 text-right flex gap-2 justify-end">
                    <button className="p-1 rounded hover:bg-gray-100" title="Export"><ArrowDownTrayIcon className="h-5 w-5 text-blue-500" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Add Transfer Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">New Transfer</h3>
                <button onClick={() => setShowModal(false)}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">File Name / Ref Number</label>
                  <input className="w-full border rounded px-2 py-1" value={form.file} onChange={e => setForm(f => ({ ...f, file: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Property Info (ERF No, Title Deed No, Address)</label>
                  <input className="w-full border rounded px-2 py-1" value={form.property} onChange={e => setForm(f => ({ ...f, property: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Buyer</label>
                    <input className="w-full border rounded px-2 py-1" value={form.buyer} onChange={e => setForm(f => ({ ...f, buyer: e.target.value }))} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Seller</label>
                    <input className="w-full border rounded px-2 py-1" value={form.seller} onChange={e => setForm(f => ({ ...f, seller: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Agent Info (optional)</label>
                  <input className="w-full border rounded px-2 py-1" value={form.agent} onChange={e => setForm(f => ({ ...f, agent: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Matter Type</label>
                  <select className="w-full border rounded px-2 py-1" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {matterTypes.map(type => <option key={type}>{type}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => setShowModal(false)} type="button">Cancel</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold" type="submit">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}

export default TransfersPage; 