import React, { useState } from "react";

const teamMembers = [
  { id: 1, name: 'Eddie Lobovski' },
  { id: 2, name: 'Alexey Sheve' },
  { id: 3, name: 'Anton Tlachche' },
  { id: 4, name: 'D. Wilson' },
];
const priorities = ["High", "Medium", "Low"];
const statuses = ["To Do", "Doing", "Done"];
const clients = ["A. Smith", "B. Jones", "C. Brown", "D. Wilson", "E. Green"];
const matters = [
  { id: 'EZT1001', name: '12 Main Rd' },
  { id: 'EZT1002', name: '34 Oak Ave' },
  { id: 'EZT1003', name: '56 River Lane' },
  { id: 'EZT1004', name: '78 Oak Ave' },
  { id: 'EZT1005', name: '90 Pine St' },
];

export default function AddTaskSimpleDrawer({ open, onClose }) {
  const [name, setName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [client, setClient] = useState("");
  const [matter, setMatter] = useState("");
  const [notes, setNotes] = useState("");
  const [draft, setDraft] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!name || !assignee || !priority || !status || !startDate || !endDate || !client || !matter) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    alert(`Task: ${name}\nAssignee: ${assignee}\nPriority: ${priority}\nStatus: ${status}\nStart: ${startDate}\nEnd: ${endDate}\nClient: ${client}\nMatter: ${matter}\nNotes: ${notes}\nDraft: ${draft}`);
    setName("");
    setAssignee("");
    setPriority("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setClient("");
    setMatter("");
    setNotes("");
    setDraft(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} aria-hidden="true" />
      {/* Drawer */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transition-transform duration-300 transform ${open ? 'translate-x-0' : 'translate-x-full'} rounded-l-lg flex flex-col`} tabIndex={-1} aria-modal="true" role="dialog">
        <div className="flex items-center justify-between mb-6 p-6">
          <h2 className="text-xl font-bold">Add Task</h2>
          <button type="button" className="text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 overflow-y-auto">
          <label className="block font-medium mb-1">Task Title</label>
          <input
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mb-4 border rounded px-3 py-2 w-full focus:ring"
            placeholder="Enter task title"
            required
          />
          <label className="block font-medium mb-1">Matter</label>
          <select
            name="matter"
            value={matter}
            onChange={e => setMatter(e.target.value)}
            className="mb-4 border rounded px-3 py-2 w-full focus:ring"
            required
          >
            <option value="">Select matter</option>
            {matters.map(m => (
              <option key={m.id} value={m.id}>{m.id}</option>
            ))}
          </select>
          <label className="block font-medium mb-1">Assign to Member</label>
          <select
            name="assignee"
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            className="mb-4 border rounded px-3 py-2 w-full focus:ring"
            required
          >
            <option value="">Select member</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="mb-4 border rounded px-3 py-2 w-full focus:ring"
            required
          />
          <label className="block font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="mb-4 border rounded px-3 py-2 w-full focus:ring"
            required
          />
          <label className="block font-medium mb-1">Priority</label>
          <div className="mb-4 flex gap-3">
            {priorities.map(p => (
              <label key={p} className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer border ${priority === p ? (p === 'High' ? 'border-red-500 bg-red-50 text-red-700' : p === 'Medium' ? 'border-yellow-400 bg-yellow-50 text-yellow-700' : 'border-blue-500 bg-blue-50 text-blue-700') : 'border-gray-200 bg-white text-gray-700'} text-xs font-semibold`}>
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                  className="form-radio hidden"
                />
                <span className={`w-2 h-2 rounded-full inline-block ${p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-yellow-400' : 'bg-blue-500'}`}></span>
                {p}
              </label>
            ))}
          </div>
          <label className="block font-medium mb-1">Status</label>
          <div className="mb-4 flex gap-3">
            {statuses.map(s => (
              <label key={s} className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer border ${status === s ? (s === 'To Do' ? 'border-yellow-400 bg-yellow-50 text-yellow-700' : s === 'Doing' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-green-500 bg-green-50 text-green-700') : 'border-gray-200 bg-white text-gray-700'} text-xs font-semibold`}>
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="form-radio hidden"
                />
                <span className={`w-2 h-2 rounded-full inline-block ${s === 'To Do' ? 'bg-yellow-400' : s === 'Doing' ? 'bg-blue-400' : 'bg-green-500'}`}></span>
                {s}
              </label>
            ))}
          </div>
          <label className="block font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="mb-4 border rounded px-3 py-2 w-full focus:ring"
            placeholder="Additional notes (optional)"
            rows={3}
          />
          <div className="flex items-center mb-4">
            <input type="checkbox" name="draft" checked={draft} onChange={e => setDraft(e.target.checked)} className="mr-2" id="draft" />
            <label htmlFor="draft" className="text-sm text-gray-700">Save as draft/template</label>
          </div>
          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          <div className="flex gap-3 mt-auto">
            <button
              type="button"
              className="flex-1 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 rounded px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold transition shadow focus:outline-none focus:ring-2 focus:ring-blue-200">Save Task</button>
          </div>
        </form>
      </aside>
    </>
  );
} 