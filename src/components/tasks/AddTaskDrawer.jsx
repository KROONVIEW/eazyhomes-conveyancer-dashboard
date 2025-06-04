import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const matters = [
  { id: 'EZT1001', name: '12 Main Rd' },
  { id: 'EZT1002', name: '34 Oak Ave' },
  { id: 'EZT1003', name: '56 River Lane' },
];
const teamMembers = [
  { id: 1, name: 'Eddie Lobovski' },
  { id: 2, name: 'Alexey Sheve' },
  { id: 3, name: 'Anton Tlachche' },
  { id: 4, name: 'D. Wilson' },
];
const priorities = [
  { label: "High", color: "bg-red-500" },
  { label: "Medium", color: "bg-yellow-400" },
  { label: "Low", color: "bg-blue-500" }
];
const statuses = [
  { label: "To Do", color: "bg-gray-400" },
  { label: "Doing", color: "bg-yellow-500" },
  { label: "Done", color: "bg-green-500" }
];

export default function AddTaskDrawer({ open, onClose }) {
  const [matter, setMatter] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [matterQuery, setMatterQuery] = useState("");
  const [matterOptions, setMatterOptions] = useState([]);
  const [matterLoading, setMatterLoading] = useState(false);
  const [matterError, setMatterError] = useState("");
  const [description, setDescription] = useState("");
  const [descError, setDescError] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const taskTemplates = [
    "Draft Deed of Sale",
    "Request FICA Docs (Buyer)",
    "Liaise with Bank for Bond Approval",
    "Prepare Transfer Duty Declaration"
  ];
  const MIN_DESC_LENGTH = 8;
  const [teamOptions, setTeamOptions] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamQuery, setTeamQuery] = useState("");
  const [assigneeError, setAssigneeError] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const statusOptions = [
    { label: "Pending", color: "bg-yellow-400 text-yellow-900" },
    { label: "In Progress", color: "bg-blue-400 text-blue-900" },
    { label: "Completed", color: "bg-green-400 text-green-900" },
    { label: "Overdue", color: "bg-red-400 text-red-900" },
  ];
  const [status, setStatus] = useState(statusOptions[0]);
  const [statusError, setStatusError] = useState("");
  const priorityOptions = [
    { label: "High", color: "bg-red-500 text-white" },
    { label: "Medium", color: "bg-yellow-400 text-yellow-900" },
    { label: "Low", color: "bg-blue-500 text-white" },
  ];
  const [priority, setPriority] = useState(priorityOptions[1]);
  const [priorityError, setPriorityError] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatType, setRepeatType] = useState('');
  const [recurringError, setRecurringError] = useState('');
  const repeatOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Custom', value: 'custom' },
  ];
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderChannel, setReminderChannel] = useState("");
  const [reminderError, setReminderError] = useState("");
  const reminderChannels = [
    { label: "Email", value: "email" },
    { label: "SMS", value: "sms" },
    { label: "In-app", value: "inapp" },
  ];
  const [checklistEnabled, setChecklistEnabled] = useState(false);
  const [checklist, setChecklist] = useState([{ id: 1, text: '' }]);
  const [checklistError, setChecklistError] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState('');
  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const tagSuggestions = ["Urgent", "Client", "Finance", "Legal", "Follow-up", "Docs", "Review"];
  const [client, setClient] = useState("");
  const [clientOptions, setClientOptions] = useState([]);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");

  // Helper: check if date is weekend
  function isWeekend(dateStr) {
    const d = new Date(dateStr);
    return d.getDay() === 0 || d.getDay() === 6;
  }
  // Placeholder for holiday logic
  function isHoliday(dateStr) {
    // Example: return true for 2025-01-01
    return false;
  }

  // Fetch matters as user types
  useEffect(() => {
    if (!matterQuery) {
      setMatterOptions([]);
      return;
    }
    setMatterLoading(true);
    setMatterError("");
    // Simulate async fetch
    setTimeout(() => {
      // Mocked data; replace with real API call
      const allMatters = [
        { id: 'T#1001', name: '123 Main St' },
        { id: 'T#1002', name: '456 Elm St' },
        { id: 'T#1003', name: '789 Pine Ln' },
        { id: 'T#1004', name: '101 Cedar Rd' },
      ];
      const filtered = allMatters.filter(m =>
        m.id.toLowerCase().includes(matterQuery.toLowerCase()) ||
        m.name.toLowerCase().includes(matterQuery.toLowerCase())
      );
      setMatterOptions(filtered);
      setMatterLoading(false);
    }, 500);
  }, [matterQuery]);

  // Fetch team members as user types
  useEffect(() => {
    setTeamLoading(true);
    // Simulate async fetch
    setTimeout(() => {
      // Mocked data; replace with real API call
      const allMembers = [
        { id: 1, name: 'Eddie Lobovski', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 2, name: 'Alexey Sheve', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
        { id: 3, name: 'Anton Tlachche', avatar: 'https://randomuser.me/api/portraits/men/34.jpg' },
        { id: 4, name: 'D. Wilson', avatar: 'https://randomuser.me/api/portraits/men/35.jpg' },
        { id: 5, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: 6, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { id: 7, name: 'Alice B.', avatar: 'https://randomuser.me/api/portraits/women/46.jpg' },
      ];
      const filtered = teamQuery
        ? allMembers.filter(m => m.name.toLowerCase().includes(teamQuery.toLowerCase()))
        : allMembers;
      setTeamOptions(filtered);
      setTeamLoading(false);
    }, 400);
  }, [teamQuery]);

  // Simulate async fetch for client options when matter changes
  useEffect(() => {
    if (!matter) {
      setClientOptions([]);
      return;
    }
    setClientLoading(true);
    setTimeout(() => {
      // Mock: only show if matter id ends with even number
      if (matter.id && parseInt(matter.id.replace(/\D/g, "").slice(-1)) % 2 === 0) {
        setClientOptions([
          { id: 'C001', name: 'Acme Holdings' },
          { id: 'C002', name: 'Smith Family Trust' },
        ]);
      } else {
        setClientOptions([]);
      }
      setClientLoading(false);
    }, 400);
  }, [matter]);

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    const valid = files.filter(f => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
    if (valid.length !== files.length) {
      setAttachmentError('Some files were not added due to type/size restrictions.');
    } else {
      setAttachmentError('');
    }
    setAttachments([...attachments, ...valid]);
  }
  function handleRemoveFile(idx) {
    setAttachments(attachments.filter((_, i) => i !== idx));
  }

  function handleAddTag(tag) {
    if (!tag.trim() || tags.includes(tag)) return;
    setTags([...tags, tag]);
    setTagInput("");
  }
  function handleRemoveTag(idx) {
    setTags(tags.filter((_, i) => i !== idx));
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (!matter) {
      setMatterError("Please select a matter.");
      return;
    } else {
      setMatterError("");
    }
    if (description.trim().length < MIN_DESC_LENGTH) {
      setDescError(`Description must be at least ${MIN_DESC_LENGTH} characters.`);
      return;
    } else {
      setDescError("");
    }
    if (assignees.length === 0) {
      setAssigneeError("Please assign at least one member.");
      return;
    } else {
      setAssigneeError("");
    }
    if (!dueDate) {
      setDueDateError("Please select a due date.");
      return;
    } else if (new Date(dueDate) < new Date(new Date().toDateString())) {
      setDueDateError("Due date cannot be in the past.");
      return;
    } else {
      setDueDateError("");
    }
    if (!status) {
      setStatusError("Please select a status.");
      return;
    } else {
      setStatusError("");
    }
    if (!priority) {
      setPriorityError("Please select a priority.");
      return;
    } else {
      setPriorityError("");
    }
    if (isRecurring && !repeatType) {
      setRecurringError('Please select a repeat option.');
      return;
    } else {
      setRecurringError('');
    }
    if (reminderEnabled) {
      if (!reminderDate) {
        setReminderError("Please select a reminder date.");
        return;
      } else if (dueDate && new Date(reminderDate) >= new Date(dueDate)) {
        setReminderError("Reminder must be before due date.");
        return;
      } else if (!reminderChannel) {
        setReminderError("Please select a reminder channel.");
        return;
      } else {
        setReminderError("");
      }
    }
    if (checklistEnabled) {
      if (checklist.length === 0 || checklist.some(item => !item.text.trim())) {
        setChecklistError('Please add at least one subtask and fill all items.');
        return;
      } else {
        setChecklistError('');
      }
    }
    if (attachments.some(f => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE_MB * 1024 * 1024)) {
      setAttachmentError('Please remove invalid files.');
      return;
    } else {
      setAttachmentError('');
    }
    if (clientOptions.length > 0 && !client) {
      setClientError("Please select a client.");
      return;
    } else {
      setClientError("");
    }
    alert(`Matter: ${matter.id} (${matter.name})\nAssignees: ${assignees.map(a => a.name).join(', ')}\nDescription: ${description}`);
    setMatter("");
    setAssignees([]);
    setDescription("");
    onClose();
  };

  function renderMarkdown(md) {
    // Simple markdown: bold, italic, code, line breaks
    return md
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br />');
  }

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
          <label className="block font-medium mb-1">Matter <span className="text-red-500">*</span></label>
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={matterQuery}
                onChange={e => setMatterQuery(e.target.value)}
                placeholder="Search matter by ID or address..."
                className="w-full border rounded px-3 py-2 focus:ring focus:border-blue-500 pr-10"
                autoComplete="off"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {matterQuery && (
              <Listbox value={matter} onChange={setMatter}>
                <div className="relative mt-1">
                  <Listbox.Button className="w-full border rounded px-3 py-2 text-left focus:ring flex items-center gap-2">
                    <span>{matter ? `${matter.id} (${matter.name})` : "Select matter"}</span>
                    <ChevronDownIcon className="w-5 h-5 ml-auto text-gray-400" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded max-h-40 overflow-auto">
                    {matterLoading ? (
                      <div className="px-4 py-2 text-gray-500">Loading...</div>
                    ) : matterOptions.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No results</div>
                    ) : (
                      matterOptions.map((m) => (
                        <Listbox.Option
                          key={m.id}
                          value={m}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 flex items-center gap-2 ${active ? "bg-blue-100" : ""}`
                          }
                        >
                          <span className="font-mono text-blue-700">{m.id}</span>
                          <span className="text-gray-700">{m.name}</span>
                          {matter && matter.id === m.id && <CheckIcon className="w-4 h-4 text-blue-600 ml-auto" />}
                        </Listbox.Option>
                      ))
                    )}
                  </Listbox.Options>
                </div>
              </Listbox>
            )}
            {/* Error if not selected and form submitted */}
            {matterError && <div className="text-red-500 text-xs mt-1">{matterError}</div>}
          </div>
          <label className="block font-medium mb-1">Assigned To <span className="text-red-500">*</span></label>
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {assignees.map(member => (
                <span key={member.id} className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full mr-1" />
                  {member.name}
                  <button type="button" className="ml-1 text-blue-400 hover:text-red-500" onClick={() => setAssignees(assignees.filter(a => a.id !== member.id))}>&times;</button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={teamQuery}
                onChange={e => setTeamQuery(e.target.value)}
                placeholder="Search team members..."
                className="w-full border rounded px-3 py-2 focus:ring focus:border-blue-500 pr-10"
                autoComplete="off"
              />
            </div>
            <Listbox value={assignees} onChange={setAssignees} multiple>
              <div className="relative mt-1">
                <Listbox.Button className="w-full border rounded px-3 py-2 text-left focus:ring flex items-center gap-2">
                  <span>{assignees.length > 0 ? `${assignees.length} selected` : "Select team members"}</span>
                  <ChevronDownIcon className="w-5 h-5 ml-auto text-gray-400" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded max-h-40 overflow-auto">
                  {teamLoading ? (
                    <div className="px-4 py-2 text-gray-500">Loading...</div>
                  ) : teamOptions.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500">No results</div>
                  ) : (
                    teamOptions.map((m) => (
                      <Listbox.Option
                        key={m.id}
                        value={m}
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 flex items-center gap-2 ${active ? "bg-blue-100" : ""}`
                        }
                      >
                        <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full" />
                        <span className="text-gray-700">{m.name}</span>
                        {assignees.find(a => a.id === m.id) && <CheckIcon className="w-4 h-4 text-blue-600 ml-auto" />}
                      </Listbox.Option>
                    ))
                  )}
                </Listbox.Options>
              </div>
            </Listbox>
            {assigneeError && <div className="text-red-500 text-xs mt-1">{assigneeError}</div>}
          </div>
          <label className="block font-medium mb-1">Due Date <span className="text-red-500">*</span></label>
          <div className="mb-4 relative">
            <input
              type="date"
              name="dueDate"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:ring focus:border-blue-500 ${dueDateError ? 'border-red-400' : ''}`}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {dueDate && (isWeekend(dueDate) || isHoliday(dueDate)) && (
              <div className="text-xs mt-1 text-yellow-600 flex items-center gap-1">
                <span role="img" aria-label="warning">⚠️</span>
                {isWeekend(dueDate) ? 'Selected date is a weekend.' : ''}
                {isHoliday(dueDate) ? 'Selected date is a holiday.' : ''}
              </div>
            )}
            {dueDateError && <div className="text-red-500 text-xs mt-1">{dueDateError}</div>}
          </div>
          <label className="block font-medium mb-1">Task Status <span className="text-red-500">*</span></label>
          <div className="mb-4">
            <Listbox value={status} onChange={setStatus}>
              <div className="relative">
                <Listbox.Button className="w-full border rounded px-3 py-2 text-left focus:ring flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
                  <ChevronDownIcon className="w-5 h-5 ml-auto text-gray-400" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded max-h-40 overflow-auto">
                  {statusOptions.map((s) => (
                    <Listbox.Option
                      key={s.label}
                      value={s}
                      className={({ active }) =>
                        `cursor-pointer select-none px-4 py-2 flex items-center gap-2 ${active ? "bg-blue-100" : ""}`
                      }
                    >
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>
                      {status.label === s.label && <CheckIcon className="w-4 h-4 text-blue-600 ml-auto" />}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
            {statusError && <div className="text-red-500 text-xs mt-1">{statusError}</div>}
          </div>
          <label className="block font-medium mb-1">Priority <span className="text-red-500">*</span></label>
          <div className="mb-4 flex gap-2">
            {priorityOptions.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${priority.label === p.label ? p.color + ' border-blue-600 shadow' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                onClick={() => setPriority(p)}
                aria-pressed={priority.label === p.label}
              >
                {p.label}
              </button>
            ))}
          </div>
          {priorityError && <div className="text-red-500 text-xs mb-2">{priorityError}</div>}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={e => setIsRecurring(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="font-medium">Recurring Task</span>
            </label>
            {isRecurring && (
              <div className="mt-2 flex flex-col gap-2">
                <label className="block text-sm font-medium mb-1">Repeat</label>
                <div className="flex gap-2">
                  {repeatOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${repeatType === opt.value ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                      onClick={() => setRepeatType(opt.value)}
                      aria-pressed={repeatType === opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {recurringError && <div className="text-red-500 text-xs mt-1">{recurringError}</div>}
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={e => setReminderEnabled(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="font-medium">Reminders</span>
            </label>
            {reminderEnabled && (
              <div className="mt-2 flex flex-col gap-2">
                <label className="block text-sm font-medium mb-1">Reminder Date</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={e => setReminderDate(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  max={dueDate || undefined}
                />
                <label className="block text-sm font-medium mb-1">Channel</label>
                <div className="flex gap-2">
                  {reminderChannels.map(ch => (
                    <button
                      key={ch.value}
                      type="button"
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${reminderChannel === ch.value ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                      onClick={() => setReminderChannel(ch.value)}
                      aria-pressed={reminderChannel === ch.value}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {reminderError && <div className="text-red-500 text-xs mt-1">{reminderError}</div>}
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checklistEnabled}
                onChange={e => setChecklistEnabled(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="font-medium">Subtasks / Checklist</span>
            </label>
            {checklistEnabled && (
              <div className="mt-2 flex flex-col gap-2">
                {checklist.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.text}
                      onChange={e => {
                        const updated = checklist.map((c, i) => i === idx ? { ...c, text: e.target.value } : c);
                        setChecklist(updated);
                      }}
                      className="flex-1 border rounded px-3 py-2 focus:ring focus:border-blue-500"
                      placeholder={`Subtask ${idx + 1}`}
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 text-lg px-2"
                      onClick={() => setChecklist(checklist.filter((_, i) => i !== idx))}
                      disabled={checklist.length === 1}
                      aria-label="Remove subtask"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-1 px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition self-start"
                  onClick={() => setChecklist([...checklist, { id: Date.now(), text: '' }])}
                >
                  + Add Subtask
                </button>
              </div>
            )}
            {checklistError && <div className="text-red-500 text-xs mt-1">{checklistError}</div>}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">File Attachments</label>
            <div className="border-2 border-dashed rounded px-4 py-6 text-center bg-gray-50 relative">
              <input
                type="file"
                multiple
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                style={{ zIndex: 2 }}
                aria-label="Add attachments"
              />
              <span className="text-gray-500">Drag & drop or click to select files (max {MAX_FILE_SIZE_MB}MB each, images/docs only)</span>
            </div>
            {attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1 text-xs">
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button type="button" className="text-red-400 hover:text-red-600" onClick={() => handleRemoveFile(idx)} aria-label="Remove file">&times;</button>
                  </div>
                ))}
              </div>
            )}
            {attachmentError && <div className="text-red-500 text-xs mt-1">{attachmentError}</div>}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Labels / Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, idx) => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  {tag}
                  <button type="button" className="ml-1 text-blue-400 hover:text-red-500" onClick={() => handleRemoveTag(idx)}>&times;</button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                    e.preventDefault();
                    handleAddTag(tagInput.trim());
                  }
                }}
                placeholder="Add tag..."
                className="w-full border rounded px-3 py-2 focus:ring focus:border-blue-500"
                autoComplete="off"
              />
              {tagInput && (
                <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-10 max-h-32 overflow-auto">
                  {tagSuggestions.filter(s => s.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(s)).map(s => (
                    <button
                      key={s}
                      type="button"
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 text-sm"
                      onMouseDown={() => handleAddTag(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {tagError && <div className="text-red-500 text-xs mt-1">{tagError}</div>}
          </div>
          {clientOptions.length > 0 && (
            <div className="mb-4">
              <label className="block font-medium mb-1">Client Association <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring focus:border-blue-500"
                  required
                >
                  <option value="">Select client</option>
                  {clientOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
                {clientLoading && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Loading...</span>}
              </div>
              {clientError && <div className="text-red-500 text-xs mt-1">{clientError}</div>}
            </div>
          )}
          <div className="mb-4">
            <button
              type="button"
              className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-1"
              onClick={() => setNotesOpen(v => !v)}
              aria-expanded={notesOpen}
            >
              {notesOpen ? '▼' : '►'} Internal Notes (Markdown supported)
            </button>
            {notesOpen && (
              <>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring focus:border-blue-500 mb-2"
                  rows={3}
                  placeholder="Add internal notes..."
                />
                {notes && (
                  <div className="bg-gray-50 border rounded px-3 py-2 text-sm text-gray-700">
                    <div className="mb-1 font-semibold text-xs text-gray-500">Preview:</div>
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }} />
                  </div>
                )}
              </>
            )}
          </div>
          <label className="block font-medium mb-1">Task Description <span className="text-red-500">*</span></label>
          <div className="mb-4 relative">
            <textarea
              name="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              onFocus={() => setShowTemplates(true)}
              onBlur={() => setTimeout(() => setShowTemplates(false), 200)}
              className={`border rounded px-3 py-2 w-full focus:ring min-h-[80px] ${descError ? 'border-red-400' : ''}`}
              placeholder="Describe the task..."
              required
            />
            {/* Template suggestions dropdown */}
            {showTemplates && (
              <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-10">
                {taskTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 text-sm"
                    onMouseDown={() => { setDescription(tpl); setShowTemplates(false); }}
                  >
                    {tpl}
                  </button>
                ))}
              </div>
            )}
            {descError && <div className="text-red-500 text-xs mt-1">{descError}</div>}
          </div>
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