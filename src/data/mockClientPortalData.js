// Enhanced mock data with more realistic client information
export const mockClients = [
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

export const mockTemplates = [
  { id: 1, name: 'FICA Documents Checklist', category: 'documents' },
  { id: 2, name: 'Bond Application Requirements', category: 'documents' },
  { id: 3, name: 'Welcome Message', category: 'communication' },
  { id: 4, name: 'Status Update - Lodged', category: 'communication' },
  { id: 5, name: 'Status Update - Registered', category: 'communication' },
  { id: 6, name: 'Document Request Reminder', category: 'communication' }
];

export const quickMessages = [
  'Thank you for uploading the documents. We will review them shortly.',
  'Your matter has been lodged with the Deeds Office. We will keep you updated on the progress.',
  'Please upload the missing POA document at your earliest convenience.',
  'Congratulations! Your property transfer has been registered.',
  'We need additional information. Please contact our office.',
  'Your bond application has been approved. Proceeding to next stage.'
];

export const initialMessages = [
  { id: 1, from: 'Firm', sender: 'Sarah Johnson', text: 'Welcome to your client portal!', time: '2025-05-20 09:00', read: true },
  { id: 2, from: 'Client', sender: 'Alice Smith', text: 'Thank you!', time: '2025-05-20 09:05', read: true },
  { id: 3, from: 'Firm', sender: 'Sarah Johnson', text: 'Please upload your POA document when convenient.', time: '2025-05-22 10:00', read: true }
];

export const demoMessages = [
  "Hi, I have a question about my property transfer.",
  "When will the next stage be completed?",
  "I've uploaded the requested document.",
  "Could you please provide an update?",
  "Is there anything else I need to do?",
  "Thank you for the update!",
  "I need clarification on the timeline.",
  "The document you requested is ready."
]; 