import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Enhanced mock data with more realistic client information
const mockClients = [
  {
    id: 'EZT1001',
    name: 'Alice Smith',
    email: 'alice.smith@email.com',
    phone: '+27 82 123 4567',
    status: 'Active',
    matter: '12 Oak Ave, Sandton',
    matterType: 'Purchase',
    lastActivity: '2025-06-02 11:30 AM',
    pending: 1,
    unreadMessages: 2,
    statusClass: 'active',
    priority: 'medium',
    progress: 65,
    nextAction: 'POA Document Required',
    attorney: 'Sarah Johnson',
    timeline: [
      { stage: 'Offer Signed', date: '2025-05-20', completed: true },
      { stage: 'FICA Uploaded', date: '2025-05-22', completed: true },
      { stage: 'Lodged', date: '2025-05-30', completed: true },
      { stage: 'Bond Approval', date: '', completed: false },
      { stage: 'Registration', date: '', completed: false }
    ],
    documents: {
      needed: [
        { name: 'POA.pdf', urgent: true, requested: '2025-06-01' },
        { name: 'Latest Rates Bill', urgent: false, requested: '2025-06-01' }
      ],
      uploaded: [
        { name: 'FICA.pdf', uploadDate: '2025-05-22', status: 'approved' },
        { name: 'OTP.pdf', uploadDate: '2025-05-25', status: 'approved' }
      ],
      firm: [
        { name: 'Draft Deed.pdf', date: '2025-05-28' },
        { name: 'Transfer Duty Receipt.pdf', date: '2025-05-30' }
      ]
    }
  },
  {
    id: 'EZT1002',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+27 83 987 6543',
    status: 'Invitation Sent',
    matter: '78 Pine Rd, Rosebank',
    matterType: 'Sale',
    lastActivity: 'N/A',
    pending: 1,
    unreadMessages: 3,
    statusClass: 'pending',
    priority: 'high',
    progress: 10,
    nextAction: 'Awaiting Portal Access',
    attorney: 'Michael Chen',
    timeline: [
      { stage: 'Offer Signed', date: '2025-06-01', completed: true },
      { stage: 'FICA Upload', date: '', completed: false },
      { stage: 'Lodge', date: '', completed: false },
      { stage: 'Bond Approval', date: '', completed: false },
      { stage: 'Registration', date: '', completed: false }
    ],
    documents: {
      needed: [],
      uploaded: [],
      firm: []
    }
  },
  {
    id: 'EZT1003',
    name: 'Fatima Patel',
    email: 'fatima.patel@email.com',
    phone: '+27 84 555 7890',
    status: 'Deactivated',
    matter: '22 Maple St, Fourways',
    matterType: 'Purchase',
    lastActivity: '2025-05-28 14:10 PM',
    pending: 0,
    unreadMessages: 0,
    statusClass: 'deactivated',
    priority: 'low',
    progress: 100,
    nextAction: 'Matter Completed',
    attorney: 'Sarah Johnson',
  timeline: [
      { stage: 'Offer Signed', date: '2025-04-15', completed: true },
      { stage: 'FICA Uploaded', date: '2025-04-20', completed: true },
      { stage: 'Lodged', date: '2025-05-01', completed: true },
      { stage: 'Bond Approval', date: '2025-05-15', completed: true },
      { stage: 'Registration', date: '2025-05-28', completed: true }
    ],
    documents: {
      needed: [],
      uploaded: [
        { name: 'FICA.pdf', uploadDate: '2025-04-20', status: 'approved' },
        { name: 'POA.pdf', uploadDate: '2025-04-22', status: 'approved' },
        { name: 'Rates Certificate.pdf', uploadDate: '2025-04-25', status: 'approved' }
      ],
      firm: [
        { name: 'Final Deed.pdf', date: '2025-05-28' },
        { name: 'Registration Certificate.pdf', date: '2025-05-28' }
      ]
    }
  }
];

const mockTemplates = [
  { id: 1, name: 'FICA Documents Checklist', category: 'documents' },
  { id: 2, name: 'Bond Application Requirements', category: 'documents' },
  { id: 3, name: 'Welcome Message', category: 'communication' },
  { id: 4, name: 'Status Update - Lodged', category: 'communication' },
  { id: 5, name: 'Status Update - Registered', category: 'communication' },
  { id: 6, name: 'Document Request Reminder', category: 'communication' }
];

const quickMessages = [
  'Thank you for uploading the documents. We will review them shortly.',
  'Your matter has been lodged with the Deeds Office. We will keep you updated on the progress.',
  'Please upload the missing POA document at your earliest convenience.',
  'Congratulations! Your property transfer has been registered.',
  'We need additional information. Please contact our office.',
  'Your bond application has been approved. Proceeding to next stage.'
];

export default function ClientPortalPage() {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, from: 'Firm', sender: 'Sarah Johnson', text: 'Welcome to your client portal!', time: '2025-05-20 09:00', read: true },
    { id: 2, from: 'Client', sender: 'Alice Smith', text: 'Thank you!', time: '2025-05-20 09:05', read: true },
    { id: 3, from: 'Firm', sender: 'Sarah Johnson', text: 'Please upload your POA document when convenient.', time: '2025-05-22 10:00', read: true }
  ]);
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [bulkSelected, setBulkSelected] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [clientDocuments, setClientDocuments] = useState(mockClients.reduce((acc, client) => {
    acc[client.id] = client.documents;
    return acc;
  }, {}));
  const [demoNotifications, setDemoNotifications] = useState(true); // Toggle for demo mode
  const [clientsData, setClientsData] = useState(mockClients);

  // Auto-clear unread messages when Messages tab is opened
  useEffect(() => {
    if (activeTab === 'communication' && selectedClient.unreadMessages > 0) {
      // Clear unread messages for selected client
      setClientsData(prev => prev.map(client => 
        client.id === selectedClient.id 
          ? { ...client, unreadMessages: 0 }
          : client
      ));
      
      // Update selectedClient to reflect the change
      setSelectedClient(prev => ({ ...prev, unreadMessages: 0 }));
    }
  }, [activeTab, selectedClient.id]);

  // Demo notification system - sends message every 2 minutes
  useEffect(() => {
    if (!demoNotifications) {return;}

    const interval = setInterval(() => {
      // Pick a random client to receive a message
      const randomClientIndex = Math.floor(Math.random() * clientsData.length);
      const randomClient = clientsData[randomClientIndex];
      
      // Demo messages
      const demoMessages = [
        "Hi, I have a question about my property transfer.",
        "When will the next stage be completed?",
        "I've uploaded the requested document.",
        "Could you please provide an update?",
        "Is there anything else I need to do?",
        "Thank you for the update!",
        "I need clarification on the timeline.",
        "The document you requested is ready."
      ];
      
      const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
      
      // Add message to messages array
      const newMessage = {
        id: Date.now(),
        from: 'Client',
        sender: randomClient.name,
        text: randomMessage,
        time: new Date().toLocaleString(),
        read: false
      };
      
      setMessages(prev => [newMessage, ...prev]);
      
      // Update client's unread count and last activity
      setClientsData(prev => prev.map(client => 
        client.id === randomClient.id 
          ? { 
              ...client, 
              unreadMessages: client.unreadMessages + 1,
              lastActivity: new Date().toLocaleString()
            }
          : client
      ));
      
      // Play notification sound
      playNotificationSound();
      
      console.log(`Demo notification: New message from ${randomClient.name}`);
    }, 300000); // 5 minutes = 300000ms

    return () => clearInterval(interval);
  }, [demoNotifications, clientsData]);

  // Notification sound function
  const playNotificationSound = () => {
    // Create a smooth notification sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a pleasant notification sound (two-tone chime)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Filter clients based on search and filters
  const filteredClients = useMemo(() => {
    const filtered = clientsData.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.matter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || client.statusClass === statusFilter;
      const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Smart sorting: Unread messages first, then recent activity, then alphabetical
    return filtered.sort((a, b) => {
      // Priority 1: Unread messages (clients with unread messages come first)
      if (a.unreadMessages > 0 && b.unreadMessages === 0) {return -1;}
      if (a.unreadMessages === 0 && b.unreadMessages > 0) {return 1;}
      
      // Priority 2: If both have unread messages, sort by count (more unread first)
      if (a.unreadMessages > 0 && b.unreadMessages > 0) {
        return b.unreadMessages - a.unreadMessages;
      }
      
      // Priority 3: Recent activity (convert lastActivity to comparable format)
      const getActivityTime = (activity) => {
        if (activity === 'N/A') {return 0;}
        return new Date(activity).getTime() || 0;
      };
      
      const aTime = getActivityTime(a.lastActivity);
      const bTime = getActivityTime(b.lastActivity);
      
      if (aTime !== bTime) {return bTime - aTime;}
      
      // Priority 4: Alphabetical by name
      return a.name.localeCompare(b.name);
    });
      }, [searchTerm, statusFilter, priorityFilter, clientsData]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {return;}
    
    const newMessage = {
      id: Date.now(),
      from: 'Firm',
      sender: 'You',
      text: message,
      time: new Date().toLocaleString(),
      read: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const sendQuickMessage = (quickMsg) => {
    const newMessage = {
      id: Date.now(),
      from: 'Firm',
      sender: 'You',
      text: quickMsg,
      time: new Date().toLocaleString(),
      read: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setShowQuickMessages(false);
  };

  const updateClientStatus = (clientId, newStatus) => {
    // In real app, this would call an API
    console.log(`Updating client ${clientId} status to ${newStatus}`);
  };

  const toggleBulkSelect = (clientId) => {
    setBulkSelected(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Performing bulk action: ${action} on clients:`, bulkSelected);
    setBulkSelected([]);
    setShowBulkActions(false);
  };

  // Enhanced Document Management Functions
  const addRequiredDocument = (clientId, documentName, isUrgent = false) => {
    const newDoc = {
      name: documentName,
      urgent: isUrgent,
      requested: new Date().toISOString().split('T')[0]
    };

    setClientDocuments(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        needed: [...prev[clientId].needed, newDoc]
      }
    }));

    // Update client's timeline to reflect new document requirement
    updateClientTimeline(clientId, `Document requested: ${documentName}`, 'pending');
    
    // Auto-send notification to client (in real app, this would trigger an API call)
    console.log(`Notification sent to client ${clientId}: New document required - ${documentName}`);
  };

  const removeRequiredDocument = (clientId, documentName) => {
    setClientDocuments(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        needed: prev[clientId].needed.filter(doc => doc.name !== documentName)
      }
    }));

    updateClientTimeline(clientId, `Document requirement removed: ${documentName}`, 'completed');
  };

  const markDocumentAsUploaded = (clientId, documentName) => {
    const doc = clientDocuments[clientId].needed.find(d => d.name === documentName);
    if (!doc) {return;}

    // Move from needed to uploaded
    setClientDocuments(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        needed: prev[clientId].needed.filter(d => d.name !== documentName),
        uploaded: [...prev[clientId].uploaded, {
          name: documentName,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'pending_review'
        }]
      }
    }));

    updateClientTimeline(clientId, `Document uploaded: ${documentName}`, 'completed');
  };

  const updateClientTimeline = (clientId, action, status) => {
    // In real app, this would update the database and sync with client's view
    console.log(`Timeline updated for ${clientId}: ${action} - Status: ${status}`);
    
    // Update last activity
    setClientsData(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, lastActivity: new Date().toLocaleString() }
        : client
    ));
  };

  const handleAddDocument = () => {
    if (!newDocumentName.trim()) {return;}
    
    addRequiredDocument(selectedClient.id, newDocumentName, false);
    setNewDocumentName('');
    setShowAddDocument(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - Client List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
                  <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Bulk Actions
                  </button>
              </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search clients, matters, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
        </div>
      </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="deactivated">Completed</option>
            </select>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedClient.id === client.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {showBulkActions && (
                      <input
                        type="checkbox"
                        checked={bulkSelected.includes(client.id)}
                        onChange={() => toggleBulkSelect(client.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                                         <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                       client.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-200' :
                       client.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                       'bg-slate-50 text-slate-600 border border-slate-200'
                     }`}>
                       {client.priority}
                     </span>
              </div>
                  <p className="text-sm text-gray-600 mb-1">{client.matter}</p>
                  <p className="text-xs text-gray-500 mb-2">{client.id} • {client.matterType}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{client.progress}%</span>
          </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${client.progress}%` }}
                      ></div>
        </div>
      </div>

                  <div className="flex items-center justify-between">
                                         <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                       client.statusClass === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                       client.statusClass === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                       'bg-slate-50 text-slate-600 border border-slate-200'
                     }`}>
                       {client.status}
                     </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                             {client.pending > 0 && (
                         <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-full text-xs font-medium">
                           {client.pending} pending
                         </span>
                       )}
                       {client.unreadMessages > 0 && (
                         <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                           {client.unreadMessages} unread
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions Panel */}
        {showBulkActions && bulkSelected.length > 0 && (
          <div className="p-4 bg-blue-50 border-t border-blue-200">
            <div className="text-sm text-blue-700 mb-2">{bulkSelected.length} clients selected</div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('send-message')}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send Message
              </button>
              <button 
                onClick={() => handleBulkAction('update-status')}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update Status
              </button>
          <button 
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
          >
                Export
          </button>
        </div>
          </div>
        )}
      </div>

      {/* Center Panel - Client Details */}
      <div className="flex-1 flex flex-col">
        {/* Client Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
              <p className="text-gray-600">{selectedClient.matter}</p>
            </div>
                         <div className="flex items-center gap-3">
               <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                 selectedClient.statusClass === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                 selectedClient.statusClass === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                 'bg-slate-50 text-slate-600 border-slate-200'
               }`}>
                 {selectedClient.status}
               </span>
               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                 Quick Actions
               </button>
             </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-6">
                       {[
             { id: 'overview', label: 'Overview' },
             { id: 'timeline', label: 'Timeline' },
             { id: 'documents', label: 'Documents' },
             { id: 'communication', label: 'Messages' },
             { id: 'settings', label: 'Settings' }
           ].map(tab => (
                             <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                   activeTab === tab.id 
                     ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                 }`}
               >
                 {tab.label}
               </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Client Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Email:</span> {selectedClient.email}</p>
                    <p><span className="text-gray-500">Phone:</span> {selectedClient.phone}</p>
                    <p><span className="text-gray-500">Attorney:</span> {selectedClient.attorney}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Matter Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Matter ID:</span> {selectedClient.id}</p>
                    <p><span className="text-gray-500">Type:</span> {selectedClient.matterType}</p>
                    <p><span className="text-gray-500">Progress:</span> {selectedClient.progress}%</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Current Status</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Next Action:</span> {selectedClient.nextAction}</p>
                    <p><span className="text-gray-500">Last Activity:</span> {selectedClient.lastActivity}</p>
                                         <p><span className="text-gray-500">Priority:</span> 
                       <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium border ${
                         selectedClient.priority === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                         selectedClient.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                         'bg-slate-50 text-slate-600 border-slate-200'
                       }`}>
                         {selectedClient.priority}
                       </span>
                     </p>
                  </div>
                </div>
              </div>

              {/* Smart Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Smart Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('communication')}
                    className="p-4 text-center bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group relative"
                  >
                    {selectedClient.unreadMessages > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedClient.unreadMessages}
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {selectedClient.unreadMessages > 0 ? 'Reply to Messages' : 'Send Message'}
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="p-4 text-center bg-white border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors group relative"
                  >
                    {clientDocuments[selectedClient.id]?.needed.length > 0 && (
                      <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {clientDocuments[selectedClient.id].needed.length}
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-700 group-hover:text-emerald-600">
                      {clientDocuments[selectedClient.id]?.needed.length > 0 ? 'Manage Documents' : 'Add Document'}
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => updateClientStatus(selectedClient.id, 'next_stage')}
                    className="p-4 text-center bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {selectedClient.progress < 100 ? 'Advance Stage' : 'Complete Matter'}
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/audit-trail')}
                    className="p-4 text-center bg-white border border-gray-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="text-sm font-medium text-gray-700 group-hover:text-slate-600">View Audit Trail</div>
                  </button>
                </div>
                
                {/* Contextual Suggestions */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Suggested Next Actions:</h4>
                  <div className="text-sm text-blue-700">
                    {selectedClient.unreadMessages > 0 && "• Respond to client messages"}
                    {clientDocuments[selectedClient.id]?.needed.length > 0 && "• Follow up on pending documents"}
                    {selectedClient.progress < 50 && "• Update client on matter progress"}
                    {selectedClient.statusClass === 'pending' && "• Send portal access invitation"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Matter Timeline</h3>
              <div className="space-y-4">
                {selectedClient.timeline.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.completed 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.stage}
                        </h4>
                        {step.date && (
                          <span className="text-sm text-gray-500">{step.date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Add Document Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Document Management</h3>
                  <button
                    onClick={() => setShowAddDocument(!showAddDocument)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    + Add Required Document
                  </button>
                </div>
                
                {showAddDocument && (
                  <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Enter document name..."
                      value={newDocumentName}
                      onChange={(e) => setNewDocumentName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddDocument}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddDocument(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

                             {/* Documents Needed */}
               {clientDocuments[selectedClient.id]?.needed.length > 0 && (
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <h3 className="font-semibold text-gray-900 mb-6">Documents Needed from Client</h3>
                   <div className="space-y-4">
                     {clientDocuments[selectedClient.id].needed.map((doc, index) => (
                       <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                             <div className="w-4 h-4 bg-red-500 rounded"></div>
                           </div>
                           <div className="flex-1">
                             <p className="font-semibold text-gray-900">{doc.name}</p>
                             <p className="text-sm text-gray-500">Requested: {doc.requested}</p>
                           </div>
                           {doc.urgent && (
                             <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-full">Urgent</span>
                           )}
                         </div>
                         <div className="flex gap-2">
                           <button className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                             Send Reminder
                           </button>
                           <button 
                             onClick={() => removeRequiredDocument(selectedClient.id, doc.name)}
                             className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                           >
                             Remove
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

                             {/* Documents Uploaded */}
               {clientDocuments[selectedClient.id]?.uploaded.length > 0 && (
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <h3 className="font-semibold text-gray-900 mb-6">Documents Uploaded by Client</h3>
                   <div className="space-y-4">
                     {clientDocuments[selectedClient.id].uploaded.map((doc, index) => (
                       <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                             <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                           </div>
                           <div className="flex-1">
                             <p className="font-semibold text-gray-900">{doc.name}</p>
                             <p className="text-sm text-gray-500">Uploaded: {doc.uploadDate}</p>
                           </div>
                           <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-medium rounded-full">
                             {doc.status}
                           </span>
                         </div>
                         <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                           View
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

                             {/* Firm Documents */}
               {clientDocuments[selectedClient.id]?.firm.length > 0 && (
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <h3 className="font-semibold text-gray-900 mb-6">Documents from Firm</h3>
                   <div className="space-y-4">
                     {clientDocuments[selectedClient.id].firm.map((doc, index) => (
                       <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                             <div className="w-4 h-4 bg-blue-500 rounded"></div>
                           </div>
                           <div className="flex-1">
                             <p className="font-semibold text-gray-900">{doc.name}</p>
                             <p className="text-sm text-gray-500">Created: {doc.date}</p>
                           </div>
                         </div>
                         <div className="flex gap-3">
                           <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                             View
                           </button>
                           <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                             Send to Client
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Secure Messages</h3>
              
              {/* Message History */}
              <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === 'Firm' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.from === 'Firm' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.from === 'Firm' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.sender} • {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Messages */}
              {showQuickMessages && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Messages</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {quickMessages.map((quickMsg, index) => (
                      <button
                        key={index}
                        onClick={() => sendQuickMessage(quickMsg)}
                        className="text-left p-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        {quickMsg}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <form onSubmit={sendMessage} className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickMessages(!showQuickMessages)}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Automation Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Automation Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Auto-send status updates</h4>
                      <p className="text-sm text-gray-500">Automatically notify client when matter status changes</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Document reminders</h4>
                      <p className="text-sm text-gray-500">Send reminders for pending document uploads</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Demo notifications</h4>
                      <p className="text-sm text-gray-500">Enable demo message notifications (every 30 seconds)</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={demoNotifications}
                      onChange={(e) => setDemoNotifications(e.target.checked)}
                      className="rounded border-gray-300" 
                    />
            </div>
          </div>
        </div>

              {/* Message Templates */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Message Templates</h3>
                <div className="space-y-3">
                  {mockTemplates.filter(t => t.category === 'communication').map(template => (
                    <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium text-gray-900">{template.name}</span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add New Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Quick Actions & Notifications */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                 {/* Quick Actions */}
         <div className="p-6 border-b border-gray-200">
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
             <h3 className="font-semibold text-gray-900 mb-6">Quick Actions</h3>
             <div className="space-y-4">
               <button className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                     <div className="w-4 h-4 bg-blue-500 rounded"></div>
                   </div>
                   <div>
                     <div className="font-medium text-gray-900 group-hover:text-blue-600">Send Status Update</div>
                     <div className="text-sm text-gray-500">Notify client of progress</div>
                   </div>
                 </div>
               </button>
               
               <button className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors group">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100">
                     <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                   </div>
                   <div>
                     <div className="font-medium text-gray-900 group-hover:text-emerald-600">Request Documents</div>
                     <div className="text-sm text-gray-500">Send document checklist</div>
                   </div>
                 </div>
               </button>
               
               <button className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors group">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100">
                     <div className="w-4 h-4 bg-amber-500 rounded"></div>
                   </div>
                   <div>
                     <div className="font-medium text-gray-900 group-hover:text-amber-600">Send Reminder</div>
                     <div className="text-sm text-gray-500">Follow up on pending items</div>
                   </div>
            </div>
               </button>
            </div>
          </div>
        </div>

                 {/* Recent Activity */}
         <div className="p-6 border-b border-gray-200">
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
             <h3 className="font-semibold text-gray-900 mb-6">Recent Activity</h3>
             <div className="space-y-4">
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mt-0.5">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                 </div>
                 <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                     <span className="font-medium text-gray-900">Alice Smith</span>
                   </div>
                   <p className="text-gray-600 text-sm">Uploaded FICA document</p>
                   <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mt-0.5">
                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                 </div>
                 <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                     <span className="font-medium text-gray-900">System</span>
                   </div>
                   <p className="text-gray-600 text-sm">Matter EZT1002 status updated</p>
                   <p className="text-gray-400 text-xs mt-1">4 hours ago</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center mt-0.5">
                   <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                 </div>
                 <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                     <span className="font-medium text-gray-900">John Doe</span>
                   </div>
                   <p className="text-gray-600 text-sm">Portal invitation sent</p>
                   <p className="text-gray-400 text-xs mt-1">1 day ago</p>
                 </div>
               </div>
          </div>
        </div>
      </div>

                 {/* System Status */}
         <div className="p-6">
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
             <h3 className="font-semibold text-gray-900 mb-6">System Status</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                 <span className="text-sm font-medium text-gray-600">Portal Uptime</span>
                 <span className="text-sm font-bold text-emerald-600">99.9%</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                 <span className="text-sm font-medium text-gray-600">Active Sessions</span>
                 <span className="text-sm font-bold text-blue-600">23</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                 <span className="text-sm font-medium text-gray-600">Messages Today</span>
                 <span className="text-sm font-bold text-slate-600">47</span>
               </div>
             </div>
            </div>
        </div>
      </div>
    </div>
  );
} 