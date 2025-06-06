// Communication Service - Backend Logic for Client-Conveyancer Communication
import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  DOCUMENT: 'document',
  SYSTEM: 'system',
  NOTIFICATION: 'notification',
  STATUS_UPDATE: 'status_update'
};

// Communication Channels
export const COMMUNICATION_CHANNELS = {
  MATTER_CHAT: 'matter_chat',
  GENERAL: 'general',
  URGENT: 'urgent',
  DOCUMENT_REQUEST: 'document_request'
};

// Participant Types
export const PARTICIPANT_TYPES = {
  CONVEYANCER: 'conveyancer',
  BUYER: 'buyer',
  SELLER: 'seller',
  SYSTEM: 'system'
};

class CommunicationService {
  constructor() {
    this.messagesCollection = 'messages';
    this.conversationsCollection = 'conversations';
    this.notificationsCollection = 'notifications';
  }

  // Create or get conversation for a matter
  async getOrCreateConversation(matterId, participants) {
    try {
      // Check if conversation exists
      const q = query(
        collection(db, this.conversationsCollection),
        where('matterId', '==', matterId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Return existing conversation
        const doc = querySnapshot.docs[0];
        return { firebaseId: doc.id, ...doc.data() };
      }
      
      // Create new conversation
      const conversationData = {
        id: uuidv4(),
        matterId,
        participants,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
        unreadCount: {},
        status: 'active'
      };

      const docRef = await addDoc(collection(db, this.conversationsCollection), conversationData);
      
      return {
        ...conversationData,
        firebaseId: docRef.id
      };
    } catch (error) {
      console.error('Error creating/getting conversation:', error);
      throw error;
    }
  }

  // Send message
  async sendMessage(conversationId, matterId, senderId, senderType, content, messageType = MESSAGE_TYPES.TEXT, attachments = []) {
    try {
      const messageData = {
        id: uuidv4(),
        conversationId,
        matterId,
        senderId,
        senderType,
        content,
        messageType,
        attachments,
        timestamp: serverTimestamp(),
        read: false,
        readBy: {},
        edited: false,
        editedAt: null
      };

      // Add message to messages collection
      const docRef = await addDoc(collection(db, this.messagesCollection), messageData);
      
      // Update conversation with last message
      await this.updateConversationLastMessage(conversationId, {
        ...messageData,
        firebaseId: docRef.id
      });

      return {
        ...messageData,
        firebaseId: docRef.id
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get messages for a conversation
  async getMessages(conversationId, limit = 50) {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        firebaseId: doc.id,
        ...doc.data()
      })).reverse(); // Reverse to show oldest first
    } catch (error) {
      console.error('Error fetching messages:', error);
      return this.getMockMessages(conversationId);
    }
  }

  // Real-time message listener
  subscribeToMessages(conversationId, callback) {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );
      
      return onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({
          firebaseId: doc.id,
          ...doc.data()
        }));
        callback(messages);
      });
    } catch (error) {
      console.error('Error setting up message listener:', error);
      callback(this.getMockMessages(conversationId));
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Mark message as read
  async markMessageAsRead(messageId, userId) {
    try {
      const docRef = doc(db, this.messagesCollection, messageId);
      await updateDoc(docRef, {
        read: true,
        [`readBy.${userId}`]: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  // Send system notification
  async sendSystemNotification(matterId, recipientId, recipientType, title, message, actionType = null, actionData = null) {
    try {
      const notificationData = {
        id: uuidv4(),
        matterId,
        recipientId,
        recipientType,
        title,
        message,
        type: MESSAGE_TYPES.SYSTEM,
        actionType,
        actionData,
        timestamp: serverTimestamp(),
        read: false,
        priority: 'normal'
      };

      const docRef = await addDoc(collection(db, this.notificationsCollection), notificationData);
      
      return {
        ...notificationData,
        firebaseId: docRef.id
      };
    } catch (error) {
      console.error('Error sending system notification:', error);
      throw error;
    }
  }

  // Send status update message
  async sendStatusUpdate(matterId, conversationId, oldStatus, newStatus, stage, updatedBy) {
    try {
      const statusMessage = `Matter status updated from "${oldStatus}" to "${newStatus}". Current stage: ${stage}`;
      
      return await this.sendMessage(
        conversationId,
        matterId,
        'system',
        PARTICIPANT_TYPES.SYSTEM,
        statusMessage,
        MESSAGE_TYPES.STATUS_UPDATE,
        []
      );
    } catch (error) {
      console.error('Error sending status update:', error);
      throw error;
    }
  }

  // Send document request
  async sendDocumentRequest(matterId, conversationId, requestedBy, requestedFrom, documentType, message) {
    try {
      const requestMessage = `Document request: ${documentType}. ${message}`;
      
      return await this.sendMessage(
        conversationId,
        matterId,
        requestedBy,
        PARTICIPANT_TYPES.CONVEYANCER,
        requestMessage,
        MESSAGE_TYPES.DOCUMENT,
        [{
          type: 'document_request',
          documentType,
          requestedFrom,
          status: 'pending'
        }]
      );
    } catch (error) {
      console.error('Error sending document request:', error);
      throw error;
    }
  }

  // Get notifications for user
  async getNotifications(userId, userType, limit = 20) {
    try {
      const q = query(
        collection(db, this.notificationsCollection),
        where('recipientId', '==', userId),
        where('recipientType', '==', userType),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        firebaseId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Update conversation last message
  async updateConversationLastMessage(conversationId, message) {
    try {
      const docRef = doc(db, this.conversationsCollection, conversationId);
      await updateDoc(docRef, {
        lastMessage: {
          content: message.content,
          timestamp: message.timestamp,
          senderId: message.senderId,
          senderType: message.senderType
        },
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  }

  // Get conversations for user
  async getUserConversations(userId, userType) {
    try {
      const q = query(
        collection(db, this.conversationsCollection),
        where(`participants.${userType}`, 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        firebaseId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  // Mock data for fallback
  getMockMessages(conversationId) {
    return [
      {
        id: uuidv4(),
        conversationId,
        senderId: 'conveyancer-1',
        senderType: PARTICIPANT_TYPES.CONVEYANCER,
        content: 'Good morning! I need to request some additional FICA documents from you.',
        messageType: MESSAGE_TYPES.TEXT,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: uuidv4(),
        conversationId,
        senderId: 'buyer-1',
        senderType: PARTICIPANT_TYPES.BUYER,
        content: 'Hi! What documents do you need?',
        messageType: MESSAGE_TYPES.TEXT,
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        read: true
      },
      {
        id: uuidv4(),
        conversationId,
        senderId: 'conveyancer-1',
        senderType: PARTICIPANT_TYPES.CONVEYANCER,
        content: 'I need an updated bank statement (not older than 3 months) and proof of income.',
        messageType: MESSAGE_TYPES.DOCUMENT,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false,
        attachments: [{
          type: 'document_request',
          documentType: 'Bank Statement',
          status: 'pending'
        }]
      }
    ];
  }

  // Mock notifications
  getMockNotifications(userId) {
    return [
      {
        id: uuidv4(),
        title: 'Document Uploaded',
        message: 'New FICA document has been uploaded for MAT-20394',
        type: MESSAGE_TYPES.NOTIFICATION,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'normal'
      },
      {
        id: uuidv4(),
        title: 'Status Update',
        message: 'Matter MAT-20395 status changed to "In Progress"',
        type: MESSAGE_TYPES.STATUS_UPDATE,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: true,
        priority: 'normal'
      }
    ];
  }
}

export default new CommunicationService(); 