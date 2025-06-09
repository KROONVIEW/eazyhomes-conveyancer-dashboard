import React, { useState, useEffect } from 'react';
import { useMatterWorkflow } from '../hooks/useMatterWorkflow';
import matterService from '../services/matterService';
import notificationService from '../services/notificationService';

const MobilePortalPage = () => {
  const [selectedMatterId, setSelectedMatterId] = useState(null);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('status');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { matters, error } = useMatterWorkflow();

  // Mock client authentication - in real app, this would come from auth context
  const currentClient = {
    id: 'client-001',
    name: 'Lindiwe Nkosi',
    email: 'lindiwe@example.com',
    role: 'buyer'
  };

  useEffect(() => {
    // Find matters for current client
    if (matters.length > 0) {
      const clientMatter = matters.find(m => 
        m.client === currentClient.name || 
        m.id === 'MAT-20394' // Demo matter
      );
      if (clientMatter) {
        setSelectedMatterId(clientMatter.id);
        setSelectedMatter(clientMatter);
        loadMessages(clientMatter.id);
        setupNotifications(clientMatter.id);
      }
      setLoading(false);
    }
  }, [matters]);

  const setupNotifications = async (matterId) => {
    // Request notification permission
    await notificationService.requestPermission();

    // Subscribe to notifications for this matter
    const unsubscribe = notificationService.subscribe(matterId, (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Update messages if it's a new message notification
      if (notification.type === 'new_message') {
        loadMessages(matterId);
      }
    });

    // Load existing notifications
    const existingNotifications = notificationService.getNotifications(matterId);
    setNotifications(existingNotifications);
    setUnreadCount(notificationService.getUnreadCount(matterId));

    // Start demo updates (remove in production)
    const stopDemo = notificationService.startDemoUpdates(matterId);

    // Cleanup on unmount
    return () => {
      unsubscribe();
      stopDemo();
    };
  };

  const loadMessages = async (matterId) => {
    // Mock messages - in real app, load from communication service
    const mockMessages = [
      {
        id: 1,
        from: 'attorney',
        sender: 'Thuli M.',
        message: 'Welcome to your property transfer portal! I\'ll be guiding you through the process.',
        timestamp: '2025-06-01T09:00:00Z',
        read: true
      },
      {
        id: 2,
        from: 'client',
        sender: currentClient.name,
        message: 'Thank you! When do you need the FICA documents?',
        timestamp: '2025-06-01T09:15:00Z',
        read: true
      },
      {
        id: 3,
        from: 'attorney',
        sender: 'Thuli M.',
        message: 'Please upload your ID, proof of address, and bank statement by end of week. I\'ve updated your document checklist.',
        timestamp: '2025-06-01T14:30:00Z',
        read: true
      },
      {
        id: 4,
        from: 'system',
        sender: 'System',
        message: 'Status updated: Documents ready for signature',
        timestamp: '2025-06-02T10:00:00Z',
        read: false
      }
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {return;}

    const message = {
      id: Date.now(),
      from: 'client',
      sender: currentClient.name,
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // In real app, send to communication service
    try {
      await matterService.addCommunication(selectedMatterId, {
        from: currentClient.id,
        message: newMessage,
        type: 'client_message'
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Awaiting Signature': return 'bg-orange-100 text-orange-600';
      case 'Registered': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getProgressSteps = () => {
    if (!selectedMatter) {return [];}
    
    const steps = [
      { name: 'Application Started', completed: true, date: '2025-05-25' },
      { name: 'Documents Submitted', completed: selectedMatter.progress >= 40, date: selectedMatter.progress >= 40 ? '2025-05-28' : null },
      { name: 'Under Review', completed: selectedMatter.progress >= 60, date: selectedMatter.progress >= 60 ? '2025-05-30' : null },
      { name: 'Ready for Signature', completed: selectedMatter.progress >= 70, date: selectedMatter.progress >= 70 ? '2025-06-01' : null },
      { name: 'Registration Complete', completed: selectedMatter.progress >= 90, date: selectedMatter.progress >= 90 ? '2025-06-05' : null }
    ];
    return steps;
  };

  const getDocumentStatus = (docType) => {
    if (!selectedMatter?.documents) {return 'pending';}
    const doc = selectedMatter.documents.find(d => d.type === docType);
    if (!doc) {return 'pending';}
    if (doc.metadata?.signed) {return 'signed';}
    return 'uploaded';
  };

  const requiredDocuments = [
    { type: 'ID Copy', required: true },
    { type: 'Proof of Address', required: true },
    { type: 'Bank Statement', required: true },
    { type: 'Offer to Purchase', required: false },
    { type: 'Sale Agreement', required: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!selectedMatter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Active Matters</h2>
          <p className="text-gray-600">You don't have any active property transfers at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Property Transfer</h1>
              <p className="text-sm text-gray-600">{selectedMatter.address}</p>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <div className="relative">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                </div>
              )}
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedMatter.status)}`}>
                {selectedMatter.status}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{selectedMatter.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${selectedMatter.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t">
          {[
            { id: 'status', label: 'Status' },
            { id: 'documents', label: 'Documents' },
            { id: 'messages', label: 'Messages' },
            { id: 'notifications', label: 'Updates' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* Matter Details */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Transfer Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-medium">{selectedMatter.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Matter ID:</span>
                  <span className="font-medium">{selectedMatter.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transfer Type:</span>
                  <span className="font-medium">{selectedMatter.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attorney:</span>
                  <span className="font-medium">{selectedMatter.assignedTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date(selectedMatter.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Progress Timeline</h3>
              <div className="space-y-4">
                {getProgressSteps().map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-4 h-4 rounded-full mt-0.5 mr-3 flex-shrink-0 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <div className={`font-medium ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                        {step.name}
                      </div>
                      {step.date && (
                        <div className="text-xs text-gray-500 mt-1">{step.date}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
              <p className="text-sm text-blue-700">
                {selectedMatter.status === 'Awaiting Signature' 
                  ? 'Your documents are ready for signature. Please review and sign the documents in the Documents tab.'
                  : selectedMatter.status === 'In Progress'
                  ? 'We\'re reviewing your submitted documents. You\'ll be notified once they\'re approved.'
                  : 'Your transfer is progressing smoothly. Check back for updates or contact your attorney if you have questions.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Required Documents</h3>
              <div className="space-y-3">
                {requiredDocuments.map((doc, index) => {
                  const status = getDocumentStatus(doc.type);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{doc.type}</div>
                        {doc.required && (
                          <div className="text-xs text-red-600 mt-1">Required</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === 'signed' ? 'bg-green-100 text-green-700' :
                          status === 'uploaded' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {status === 'signed' ? 'Signed' :
                           status === 'uploaded' ? 'Uploaded' :
                           'Pending'}
                        </span>
                        {status === 'pending' && (
                          <button className="text-blue-600 text-sm font-medium">
                            Upload
                          </button>
                        )}
                        {status === 'uploaded' && (
                          <button className="text-gray-600 text-sm">
                            View
                          </button>
                        )}
                        {status === 'signed' && (
                          <button className="text-green-600 text-sm">
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upload Instructions */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Upload Guidelines</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Documents must be clear and legible</li>
                <li>• Accepted formats: PDF, JPG, PNG</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Ensure all information is visible</li>
              </ul>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow-sm h-96 flex flex-col">
            {/* Messages Header */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800">Chat with Your Attorney</h3>
              <p className="text-sm text-gray-600">Secure messaging with {selectedMatter.assignedTo}</p>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.from === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.from === 'client' 
                      ? 'bg-blue-600 text-white' 
                      : message.from === 'system'
                      ? 'bg-gray-100 text-gray-700 text-center'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.from !== 'client' && message.from !== 'system' && (
                      <div className="text-xs font-medium mb-1">{message.sender}</div>
                    )}
                    <div className="text-sm">{message.message}</div>
                    <div className={`text-xs mt-1 ${
                      message.from === 'client' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Recent Updates</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    notificationService.markAsRead(selectedMatterId);
                    setUnreadCount(0);
                  }}
                  className="text-blue-600 text-sm font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 mb-2">No updates yet</div>
                <p className="text-sm text-gray-600">You'll see notifications about your transfer progress here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${
                      notification.priority === 'high' ? 'border-red-500' :
                      notification.priority === 'medium' ? 'border-blue-500' :
                      'border-gray-300'
                    } ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{notification.title}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.category === 'urgent' ? 'bg-red-100 text-red-700' :
                        notification.category === 'documents' ? 'bg-green-100 text-green-700' :
                        notification.category === 'messages' ? 'bg-blue-100 text-blue-700' :
                        notification.category === 'status' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notification.category}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePortalPage; 