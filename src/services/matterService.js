// Matter Service - Backend Logic for Conveyancer Workflow
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
// Matter Status Constants
export const MATTER_STATUS = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  AWAITING_SIGNATURE: 'Awaiting Signature',
  IN_PROGRESS: 'In Progress',
  DELAYED: 'Delayed',
  REGISTERED: 'Registered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};
// Matter Stages Constants
export const MATTER_STAGES = {
  INITIAL_CONSULTATION: 'Initial Consultation',
  OFFER_TO_PURCHASE: 'Offer to Purchase',
  FICA_COMPLETE: 'FICA Complete',
  AWAITING_BANK_CLEARANCE: 'Awaiting Bank Clearance',
  BOND_APPROVAL: 'Bond Approval',
  TRANSFER_DOCUMENTS: 'Transfer Documents',
  FINAL_REGISTRATION: 'Final Registration'
};
// Matter Types
export const MATTER_TYPES = {
  SECTIONAL_TITLE: 'Sectional Title',
  FREEHOLD: 'Freehold',
  BOND_CANCELLATION: 'Bond Cancellation',
  ESTATE: 'Estate',
  COMMERCIAL: 'Commercial'
};
class MatterService {
  constructor() {
    this.collection = 'matters';
    this.mockMatters = []; // Store mock matters for development
    this.listeners = []; // Store listeners for mock real-time updates
    this.initializeMockData();
  }
  // Initialize mock data
  initializeMockData() {
    this.mockMatters = [
      {
        id: "MAT-20394",
        client: "Lindiwe Nkosi",
        address: "12 Oak Avenue, Sandton",
        status: "Awaiting Signature",
        progress: 70,
        stage: "Awaiting Bank Clearance",
        assignedTo: "Thuli M.",
        updatedAt: "2025-05-30T10:23:00Z",
        type: "Sectional Title",
        documents: [
          {
            id: "doc-1",
            type: "Offer to Purchase",
            uploadedAt: "2025-05-25T10:00:00Z",
            metadata: { signed: false }
          },
          {
            id: "doc-2", 
            type: "Sale Agreement",
            uploadedAt: "2025-05-26T14:00:00Z",
            metadata: { signed: false }
          }
        ],
        communications: [],
        ficaStatus: {
          buyer: { completed: true, documents: ['ID Copy', 'Proof of Address', 'Bank Statement'] },
          seller: { completed: true, documents: ['ID Copy', 'Proof of Address'] }
        }
      },
      {
        id: "MAT-20395",
        client: "Sipho Dlamini",
        address: "34 Pine Lane, Pretoria",
        status: "In Progress",
        progress: 40,
        stage: "Offer to Purchase",
        assignedTo: "Kabelo S.",
        updatedAt: "2025-05-29T15:10:00Z",
        type: "Freehold",
        documents: [
          {
            id: "doc-3",
            type: "Property Valuation",
            uploadedAt: "2025-05-20T09:00:00Z",
            metadata: { verified: true }
          }
        ],
        communications: [],
        ficaStatus: {
          buyer: { completed: false, documents: ['ID Copy'] },
          seller: { completed: true, documents: ['ID Copy', 'Proof of Address'] }
        }
      },
      {
        id: "MAT-20396",
        client: "Fatima Patel",
        address: "56 Main Road, Cape Town",
        status: "Registered",
        progress: 90,
        stage: "Final Registration",
        assignedTo: "Thuli M.",
        updatedAt: "2025-05-28T09:00:00Z",
        type: "Bond Cancellation",
        documents: [
          {
            id: "doc-4",
            type: "Offer to Purchase",
            uploadedAt: "2025-05-15T10:00:00Z",
            metadata: { signed: true, signedAt: "2025-05-16T12:00:00Z" }
          },
          {
            id: "doc-5",
            type: "Sale Agreement", 
            uploadedAt: "2025-05-16T14:00:00Z",
            metadata: { signed: true, signedAt: "2025-05-17T10:00:00Z" }
          },
          {
            id: "doc-6",
            type: "Transfer Documents",
            uploadedAt: "2025-05-20T11:00:00Z",
            metadata: { lodged: true }
          }
        ],
        communications: [],
        ficaStatus: {
          buyer: { completed: true, documents: ['ID Copy', 'Proof of Address', 'Bank Statement'] },
          seller: { completed: true, documents: ['ID Copy', 'Proof of Address'] }
        }
      },
      {
        id: "MAT-20397",
        client: "Johan van der Merwe",
        address: "78 Market St, Bloemfontein",
        status: "Draft",
        progress: 10,
        stage: "Initial Consultation",
        assignedTo: "Kabelo S.",
        updatedAt: "2025-05-27T14:30:00Z",
        type: "Estate",
        documents: [],
        communications: [],
        ficaStatus: {
          buyer: { completed: false, documents: [] },
          seller: { completed: false, documents: [] }
        }
      }
    ];
  }
  // Notify all listeners of changes (for mock real-time updates)
  notifyListeners() {this.listeners.forEach((callback, index) => {
      try {callback([...this.mockMatters]);
      } catch (error) { // Error logging removed for production
}
    });
  }
  // Create new matter
  async createMatter(matterData) {
    try {
      const matter = {
        id: `MAT-${Date.now()}`,
        ...matterData,
        status: matterData.status || MATTER_STATUS.DRAFT,
        stage: matterData.stage || MATTER_STAGES.INITIAL_CONSULTATION,
        progress: matterData.progress || 0,
        createdAt: db ? serverTimestamp() : new Date().toISOString(),
        updatedAt: db ? serverTimestamp() : new Date().toISOString(),
        documents: [],
        communications: [],
        tasks: [],
        ficaStatus: {
          buyer: { completed: false, documents: [] },
          seller: { completed: false, documents: [] }
        }
      };
      if (!db) {const newMatter = { ...matter, firebaseId: `mock-${matter.id}` };
        this.mockMatters.unshift(newMatter);
        // Notify listeners of the change
        setTimeout(() => this.notifyListeners(), 100);
        return newMatter;
      }
      const docRef = await addDoc(collection(db, this.collection), matter);
      return { ...matter, firebaseId: docRef.id };
    } catch (error) { // Error logging removed for production
// Fallback to mock creation
      const matter = {
        id: `MAT-${Date.now()}`,
        ...matterData,
        status: matterData.status || MATTER_STATUS.DRAFT,
        stage: matterData.stage || MATTER_STAGES.INITIAL_CONSULTATION,
        progress: matterData.progress || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: [],
        communications: [],
        tasks: [],
        ficaStatus: {
          buyer: { completed: false, documents: [] },
          seller: { completed: false, documents: [] }
        }
      };
      return { ...matter, firebaseId: `mock-${matter.id}` };
    }
  }
  // Get all matters
  async getAllMatters() {
    try {
      // Check if Firebase is available
      if (!db) {return [...this.mockMatters];
      }
      const q = query(
        collection(db, this.collection),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        firebaseId: doc.id,
        ...doc.data()
      }));
    } catch (error) { // Error logging removed for production
// Return mock data if Firebase fails
      return this.getMockMatters();
    }
  }
  // Get matter by ID
  async getMatterById(matterId) {
    const docRef = doc(db, this.collection, matterId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { firebaseId: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Matter not found');
    }
  }
  // Update matter
  async updateMatter(matterId, updates) {
    if (!db) {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      // Update mock data
      const index = this.mockMatters.findIndex(m => m.id === matterId || m.firebaseId === matterId);
      if (index !== -1) {
        this.mockMatters[index] = { ...this.mockMatters[index], ...updateData };
        // Notify listeners of the change
        setTimeout(() => this.notifyListeners(), 100);
      } else {
        // Matter not found in mock data - silently handle
      }
      return updateData;
    }
    const docRef = doc(db, this.collection, matterId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    return updateData;
  }
  // Update matter status and progress
  async updateMatterProgress(matterId, status, stage, progress) {
    return await this.updateMatter(matterId, {
      status,
      stage,
      progress: Math.min(100, Math.max(0, progress))
    });
  }
  // Add document to matter
  async addDocumentToMatter(matterId, documentData) {
    if (!db) {
      const newDocument = {
        id: uuidv4(),
        ...documentData,
        uploadedAt: new Date().toISOString()
      };
      // Update mock data
      const index = this.mockMatters.findIndex(m => m.id === matterId || m.firebaseId === matterId);
      if (index !== -1) {
        this.mockMatters[index].documents = [...(this.mockMatters[index].documents || []), newDocument];
        this.mockMatters[index].updatedAt = new Date().toISOString();
        // Notify listeners of the change
        setTimeout(() => this.notifyListeners(), 100);
      }
      return newDocument;
    }
    const matter = await this.getMatterById(matterId);
    const newDocument = {
      id: uuidv4(),
      ...documentData,
      uploadedAt: new Date().toISOString()
    };
    const updatedDocuments = [...(matter.documents || []), newDocument];
    await this.updateMatter(matterId, {
      documents: updatedDocuments
    });
    return newDocument;
  }
  // Add communication to matter
  async addCommunication(matterId, communicationData) {
    const matter = await this.getMatterById(matterId);
    const newCommunication = {
      id: uuidv4(),
      ...communicationData,
      timestamp: new Date().toISOString(),
      read: false
    };
    const updatedCommunications = [...(matter.communications || []), newCommunication];
    await this.updateMatter(matterId, {
      communications: updatedCommunications
    });
    return newCommunication;
  }
  // Update FICA status
  async updateFicaStatus(matterId, party, status, documents = []) {
    if (!db) {
      // Update mock data
      const index = this.mockMatters.findIndex(m => m.id === matterId || m.firebaseId === matterId);
      if (index !== -1) {
        const updatedFicaStatus = {
          ...this.mockMatters[index].ficaStatus,
          [party]: {
            completed: status,
            documents: documents,
            updatedAt: new Date().toISOString()
          }
        };
        this.mockMatters[index] = {
          ...this.mockMatters[index],
          ficaStatus: updatedFicaStatus,
          updatedAt: new Date().toISOString()
        };
        // Notify listeners of the change
        setTimeout(() => this.notifyListeners(), 100);
        return updatedFicaStatus;
      }
      return null;
    }
    const matter = await this.getMatterById(matterId);
    const updatedFicaStatus = {
      ...matter.ficaStatus,
      [party]: {
        completed: status,
        documents: documents,
        updatedAt: new Date().toISOString()
      }
    };
    await this.updateMatter(matterId, {
      ficaStatus: updatedFicaStatus
    });
    return updatedFicaStatus;
  }
  // Get matters by status
  async getMattersByStatus(status) {
    try {
      const q = query(
        collection(db, this.collection),
        where('status', '==', status),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        firebaseId: doc.id,
        ...doc.data()
      }));
    } catch (error) { // Error logging removed for production
return [];
    }
  }
  // Real-time listener for matters
  subscribeToMatters(callback) {
    try {
      // Check if Firebase is available
      if (!db) {// Add callback to listeners array
        this.listeners.push(callback);
        // Immediately call with current data
        callback([...this.mockMatters]);
        // Return unsubscribe function that removes the listener
        return () => {const index = this.listeners.indexOf(callback);
          if (index > -1) {
            this.listeners.splice(index, 1);
          }
        };
      }
      const q = query(
        collection(db, this.collection),
        orderBy('updatedAt', 'desc')
      );return onSnapshot(q, (querySnapshot) => {
        const matters = querySnapshot.docs.map(doc => ({
          firebaseId: doc.id,
          ...doc.data()
        }));callback(matters);
      }, (error) => { // Error logging removed for production
// Fallback to mock data on error
        callback(this.getMockMatters());
      });
    } catch (error) { // Error logging removed for production
// Fallback to mock data
      callback(this.getMockMatters());
      return () => {}; // Return empty unsubscribe function
    }
  }
  // Mock data fallback (preserves existing UI data)
  getMockMatters() {
    return [
      {
        id: "MAT-20394",
        client: "Lindiwe Nkosi",
        address: "12 Oak Avenue, Sandton",
        status: "Awaiting Signature",
        progress: 60,
        stage: "Awaiting Bank Clearance",
        assignedTo: "Thuli M.",
        updatedAt: "2025-05-30T10:23:00Z",
        type: "Sectional Title",
        documents: [],
        communications: [],
        ficaStatus: {
          buyer: { completed: false, documents: [] },
          seller: { completed: true, documents: ['ID Copy', 'Proof of Address'] }
        }
      },
      {
        id: "MAT-20395",
        client: "Sipho Dlamini",
        address: "34 Pine Lane, Pretoria",
        status: "In Progress",
        progress: 30,
        stage: "Offer to Purchase",
        assignedTo: "Kabelo S.",
        updatedAt: "2025-05-29T15:10:00Z",
        type: "Freehold",
        documents: [],
        communications: [],
        ficaStatus: {
          buyer: { completed: false, documents: [] },
          seller: { completed: false, documents: [] }
        }
      },
      {
        id: "MAT-20396",
        client: "Fatima Patel",
        address: "56 Main Road, Cape Town",
        status: "Registered",
        progress: 100,
        stage: "Final Registration",
        assignedTo: "Thuli M.",
        updatedAt: "2025-05-28T09:00:00Z",
        type: "Bond Cancellation",
        documents: [],
        communications: [],
        ficaStatus: {
          buyer: { completed: true, documents: ['ID Copy', 'Proof of Address', 'Bank Statement'] },
          seller: { completed: true, documents: ['ID Copy', 'Proof of Address'] }
        }
      },
      {
        id: "MAT-20397",
        client: "Johan van der Merwe",
        address: "78 Market St, Bloemfontein",
        status: "Delayed",
        progress: 40,
        stage: "FICA Complete",
        assignedTo: "Kabelo S.",
        updatedAt: "2025-05-27T14:30:00Z",
        type: "Estate",
        documents: [],
        communications: [],
        ficaStatus: {
          buyer: { completed: true, documents: ['ID Copy', 'Proof of Address'] },
          seller: { completed: false, documents: [] }
        }
      }
    ];
  }
}
// Mock Matter Service for Overview Page
const mockMatters = [
  {
    id: 'MAT-001',
    address: '12 Oak Avenue, Sandton',
    assignedAttorneyId: 'ATT-001',
    assignedAttorneyName: 'John Doe',
    currentStep: 3,
    totalSteps: 6,
    status: 'In Progress',
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    type: 'Transfer',
    clientName: 'Alice Smith',
    value: 120000,
  },
  {
    id: 'MAT-002',
    address: '34 Pine Lane, Bryanston',
    assignedAttorneyId: 'ATT-002',
    assignedAttorneyName: 'Jane Smith',
    currentStep: 6,
    totalSteps: 6,
    status: 'Completed',
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    type: 'Bond Registration',
    clientName: 'Bob Johnson',
    value: 95000,
  },
  {
    id: 'MAT-003',
    address: '56 Maple Street, Rosebank',
    assignedAttorneyId: 'ATT-003',
    assignedAttorneyName: 'Sarah Lee',
    currentStep: 2,
    totalSteps: 6,
    status: 'Delayed',
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
    type: 'Deceased Estate',
    clientName: 'Carol White',
    value: 60000,
  },
  // Add more mock matters as needed
];
export async function fetchMatters({ search = '', startDate, endDate } = {}) {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  let filtered = mockMatters;
  if (search) {
    filtered = filtered.filter(m =>
      m.address.toLowerCase().includes(search.toLowerCase()) ||
      m.clientName.toLowerCase().includes(search.toLowerCase())
    );
  }
  // Date filtering (if provided)
  if (startDate) {
    filtered = filtered.filter(m => m.lastUpdateTimestamp >= new Date(startDate).getTime());
  }
  if (endDate) {
    filtered = filtered.filter(m => m.lastUpdateTimestamp <= new Date(endDate).getTime());
  }
  return filtered;
}
// Create and export singleton instance
const matterService = new MatterService();
export default matterService; 