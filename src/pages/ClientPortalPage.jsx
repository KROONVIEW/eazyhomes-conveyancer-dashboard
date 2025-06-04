import React, { useState } from 'react';

const mockClients = [
  {
    id: 'EZT1001',
    name: 'Alice Smith',
    status: 'Active',
    matter: '12 Oak Ave',
    lastActivity: '2025-06-02 11:30 AM',
    pending: '1 Document, 0 Unread Msgs',
    statusClass: 'active',
    actions: ['View Portal', 'Deactivate'],
  },
  {
    id: 'EZT1002',
    name: 'John Doe',
    status: 'Invitation Sent',
    matter: '78 Pine Rd',
    lastActivity: 'N/A',
    pending: 'Invitation Pending',
    statusClass: 'pending',
    actions: ['Resend Invite', 'Deactivate'],
  },
  {
    id: 'EZT1003',
    name: 'Fatima Patel',
    status: 'Deactivated',
    matter: '22 Maple St',
    lastActivity: '2025-05-28 14:10 PM',
    pending: '0 Pending',
    statusClass: 'deactivated',
    actions: ['Reactivate'],
  },
];

const mockMatter = {
  id: 'EZT1001',
  property: '12 Oak Ave',
  status: 'Lodged',
  client: 'Alice Smith',
  timeline: [
    { stage: 'Offer Signed', date: '2025-05-20' },
    { stage: 'FICA Uploaded', date: '2025-05-22' },
    { stage: 'Lodged', date: '2025-05-30' },
  ],
  documents: [
    { name: 'FICA.pdf', uploaded: true },
    { name: 'OTP.pdf', uploaded: true },
    { name: 'POA.pdf', uploaded: false },
  ],
};

const mockMessages = [
  { from: 'Firm', text: 'Welcome to your client portal!', time: '2025-05-20 09:00' },
  { from: 'Alice Smith', text: 'Thank you!', time: '2025-05-20 09:05' },
  { from: 'Firm', text: 'Please upload your POA document.', time: '2025-05-22 10:00' },
];

const mockTemplates = [
  { id: 1, name: 'FICA Documents Checklist' },
  { id: 2, name: 'Bond Application Requirements' },
];

const mockStatusTemplates = {
  lodged: 'Matter Lodged: What\'s Next',
  registered: 'Matter Registered: Congratulations!',
};

export default function ClientPortalPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [statusLodged, setStatusLodged] = useState(mockStatusTemplates.lodged);
  const [statusRegistered, setStatusRegistered] = useState(mockStatusTemplates.registered);
  const [templates, setTemplates] = useState(mockTemplates);

  // Engagement metrics mock
  const metrics = [
    { label: 'Total Portals Active', value: 55 },
    { label: 'Clients with Pending Actions', value: 12, warning: true },
    { label: 'Avg. Login Frequency (Last 7 Days)', value: '3.2 logins/client' },
    { label: 'Documents Uploaded (Today)', value: 7 },
  ];

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { from: 'Alice Smith', text: message, time: new Date().toLocaleString() }]);
    setMessage('');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Client Portal Overview Dashboard */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Client Portal Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClients.map((client) => (
            <div key={client.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">{client.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${client.statusClass === 'active' ? 'bg-green-100 text-green-700' : client.statusClass === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{client.status}</span>
              </div>
              <div className="mb-2 text-sm text-gray-600">
                <p className="mb-1">Matter: <span className="font-medium text-gray-800">{client.id} - {client.matter}</span></p>
                <p className="mb-1">Last Activity: <span className="font-medium text-gray-800">{client.lastActivity}</span></p>
                <p>Pending Actions: <span className="font-bold text-red-600">{client.pending}</span></p>
              </div>
              <div className="flex gap-2 mt-4">
                {client.actions.map((action, i) => (
                  <button
                    key={action}
                    className={
                      i === 0
                        ? 'flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition'
                        : 'flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg border border-gray-300 transition'
                    }
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Client Portal Settings */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Automated Client Portal Settings</h2>
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-700">Automated Updates (Matter Milestones)</h3>
          <p className="mb-3 text-gray-500">Configure automatic messages sent to clients when matter status changes.</p>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
            <label htmlFor="status-lodged-template" className="w-48 font-medium text-gray-700">On "Lodged" Status:</label>
            <select id="status-lodged-template" value={statusLodged} onChange={e => setStatusLodged(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="Matter Lodged: What's Next">Matter Lodged: What's Next</option>
              <option value="Deeds Office Lodgement Confirmed">Deeds Office Lodgement Confirmed</option>
            </select>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg border border-gray-300 transition">Edit Template</button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label htmlFor="status-registered-template" className="w-48 font-medium text-gray-700">On "Registered" Status:</label>
            <select id="status-registered-template" value={statusRegistered} onChange={e => setStatusRegistered(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="Matter Registered: Congratulations!">Matter Registered: Congratulations!</option>
              <option value="Final Steps for Registration">Final Steps for Registration</option>
            </select>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg border border-gray-300 transition">Edit Template</button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Document Request Templates</h3>
          <p className="mb-3 text-gray-500">Manage standard document lists for client requests.</p>
          <div className="mb-4">
            {templates.map(t => (
              <div key={t.id} className="flex items-center gap-3 mb-2">
                <span className="flex-1 text-gray-700">{t.name}</span>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-lg border border-gray-300 transition">View/Edit</button>
                <button className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1 rounded-lg border border-red-300 transition">Delete</button>
              </div>
            ))}
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition">Add New Template</button>
        </div>
      </div>

      {/* Client Engagement & Audit Section */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Client Engagement & Audit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2 text-center">{m.label}</h3>
              <p className={`text-3xl font-bold ${m.warning ? 'text-yellow-500' : 'text-blue-800'} text-center`}>{m.value}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-6 text-center">
          <p className="mb-2 text-gray-600">For detailed client interaction history, visit the Audit Trail.</p>
          <a href="/audit-trail">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">Go to Audit Trail</button>
          </a>
        </div>
      </div>

      {/* Matter Details Section - Enhanced Conveyancer View */}
      <div className="conveyancer-matter-details-card">
        <div className="matter-header-top">
          <div className="matter-id-property">
            <span className="matter-label">Matter:</span> <span className="matter-value">{mockMatter.id}</span>
            <span className="property-label">Property:</span> <span className="property-value">{mockMatter.property}</span>
          </div>
          <span className="matter-status-badge lodged">{mockMatter.status}</span>
        </div>
        <p className="client-info">Client: {mockMatter.client}</p>

        {/* Matter Progress Bar */}
        <div className="matter-progress-section">
          <h3>Matter Progress</h3>
          <div className="progress-bar-conveyancer-container">
            {/* Dynamically render steps based on timeline and status */}
            <div className="progress-step completed">
              <div className="step-icon">✔</div>
              <div className="step-label">Offer Signed</div>
              <div className="step-date">2025-05-20</div>
            </div>
            <div className="progress-step completed">
              <div className="step-icon">✔</div>
              <div className="step-label">FICA Uploaded</div>
              <div className="step-date">2025-05-22</div>
            </div>
            <div className="progress-step active">
              <div className="step-icon">3</div>
              <div className="step-label">Lodged</div>
              <div className="step-date">2025-05-30</div>
            </div>
            <div className="progress-step pending">
              <div className="step-icon"></div>
              <div className="step-label">Bond Approval</div>
              <div className="step-date"></div>
            </div>
            <div className="progress-step pending">
              <div className="step-icon"></div>
              <div className="step-label">Registered</div>
              <div className="step-date"></div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="matter-documents-section">
          <h3>Documents</h3>
          <div className="document-categories">
            <div className="doc-category-block documents-needed">
              <h4>Documents Needed from Client</h4>
              <ul>
                <li>POA.pdf <button className="btn-sm btn-outline-primary">Request Upload</button></li>
                <li>Latest Rates Bill <button className="btn-sm btn-outline-primary">Request Upload</button></li>
              </ul>
              <button className="btn-secondary add-doc-request-btn">Add New Request</button>
            </div>
            <div className="doc-category-block documents-uploaded">
              <h4>Documents Uploaded by Client</h4>
              <ul>
                <li>FICA.pdf <span className="doc-status uploaded">Uploaded</span> <button className="btn-sm btn-secondary">View</button></li>
                <li>OTP.pdf <span className="doc-status uploaded">Uploaded</span> <button className="btn-sm btn-secondary">View</button></li>
              </ul>
            </div>
            <div className="doc-category-block documents-from-firm">
              <h4>Documents From Firm</h4>
              <ul>
                <li>Draft Deed.pdf <button className="btn-sm btn-secondary">View</button></li>
                <li>Transfer Duty Rec.pdf <button className="btn-sm btn-secondary">View</button></li>
              </ul>
              <button className="btn-primary upload-firm-doc-btn">Upload Firm Document</button>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="matter-quick-actions">
          <h3>Quick Actions for This Matter</h3>
          <div className="action-buttons-grid">
            <button className="btn-primary">Update Status</button>
            <button className="btn-secondary">Send Secure Message</button>
            <button className="btn-secondary">Add Note to File</button>
            <button className="btn-secondary">Generate Document</button>
            <button className="btn-secondary">Link to Audit Trail</button>
          </div>
        </div>
      </div>

      {/* Secure Messages Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Secure Messages</h2>
        <div className="flex flex-col h-80 mb-4 overflow-y-auto space-y-2 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${msg.from === 'Firm' ? 'bg-gray-100 text-gray-800 self-start' : 'bg-blue-600 text-white self-end'}`}
            >
              <span className="block text-xs text-gray-400 mb-1">{msg.from} - {msg.time}</span>
              {msg.text}
            </div>
          ))}
        </div>
        <form className="flex gap-2 items-center" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full shadow transition" type="submit">Send</button>
        </form>
      </div>
    </div>
  );
} 