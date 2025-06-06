import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Message Service Class
class MessageService {
  // Send a text message
  async sendMessage(messageData) {
    try {
      console.log('📤 Sending message:', messageData);
      
      // Simulate API call for now - replace with actual endpoint
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              id: Date.now(),
              ...messageData,
              status: 'sent',
              timestamp: new Date().toISOString(),
              deliveredAt: null,
              readAt: null
            }
          });
        }, 500); // Simulate network delay
      });

      console.log('✅ Message sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  // Upload file attachment
  async uploadAttachment(file, onProgress) {
    try {
      console.log('📎 Uploading attachment:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type);
      formData.append('size', file.size);

      // Simulate file upload with progress
      return new Promise((resolve, reject) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Simulate successful upload response
            const uploadResponse = {
              id: `file_${Date.now()}`,
              name: file.name,
              type: file.type,
              size: file.size,
              url: URL.createObjectURL(file), // Create blob URL for preview
              uploadedAt: new Date().toISOString()
            };
            
            console.log('✅ File uploaded successfully:', uploadResponse);
            resolve(uploadResponse);
          }
          
          if (onProgress) {
            onProgress(Math.min(progress, 100));
          }
        }, 100);
      });

      // Real API call would look like this:
      /*
      const response = await apiClient.post('/messages/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(progress);
          }
        },
      });
      return response.data;
      */
    } catch (error) {
      console.error('❌ Failed to upload attachment:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  // Send message with attachment
  async sendMessageWithAttachment(messageData, attachment) {
    try {
      console.log('📤 Sending message with attachment:', { messageData, attachment });
      
      // First upload the attachment
      const uploadedFile = await this.uploadAttachment(attachment.file);
      
      // Then send the message with attachment reference
      const messageWithAttachment = {
        ...messageData,
        attachment: {
          id: uploadedFile.id,
          name: uploadedFile.name,
          type: uploadedFile.type,
          size: uploadedFile.size,
          url: uploadedFile.url
        }
      };
      
      return await this.sendMessage(messageWithAttachment);
    } catch (error) {
      console.error('❌ Failed to send message with attachment:', error);
      throw error;
    }
  }

  // Update message status (delivered, read, etc.)
  async updateMessageStatus(messageId, status) {
    try {
      console.log(`📊 Updating message ${messageId} status to: ${status}`);
      
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              messageId,
              status,
              timestamp: new Date().toISOString()
            }
          });
        }, 200);
      });

      console.log('✅ Message status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update message status:', error);
      throw error;
    }
  }

  // Get conversation messages
  async getConversationMessages(conversationId, page = 1, limit = 50) {
    try {
      console.log(`📥 Fetching messages for conversation ${conversationId}`);
      
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              messages: [], // Would contain actual messages from backend
              pagination: {
                page,
                limit,
                total: 0,
                hasMore: false
              }
            }
          });
        }, 300);
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch messages:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(messageIds) {
    try {
      console.log('👁️ Marking messages as read:', messageIds);
      
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              messageIds,
              readAt: new Date().toISOString()
            }
          });
        }, 200);
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to mark messages as read:', error);
      throw error;
    }
  }

  // Search messages
  async searchMessages(query, conversationId = null) {
    try {
      console.log('🔍 Searching messages:', { query, conversationId });
      
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              results: [], // Would contain search results
              query,
              total: 0
            }
          });
        }, 400);
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to search messages:', error);
      throw error;
    }
  }

  // Delete message
  async deleteMessage(messageId) {
    try {
      console.log('🗑️ Deleting message:', messageId);
      
      // Simulate API call
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { success: true } });
        }, 300);
      });

      console.log('✅ Message deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to delete message:', error);
      throw error;
    }
  }

  // Get supported file types
  getSupportedFileTypes() {
    return {
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      documents: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ],
      maxSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    };
  }

  // Validate file before upload
  validateFile(file) {
    const supportedTypes = this.getSupportedFileTypes();
    const allSupportedTypes = [...supportedTypes.images, ...supportedTypes.documents];
    
    if (!allSupportedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported`);
    }
    
    if (file.size > supportedTypes.maxSize) {
      throw new Error(`File size exceeds maximum limit of ${supportedTypes.maxSize / 1024 / 1024}MB`);
    }
    
    return true;
  }
}

// Create singleton instance
const messageService = new MessageService();

// Export service and utilities
export default messageService;

export const MessageStatus = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
};

export const AttachmentTypes = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video',
  AUDIO: 'audio'
};

// Utility functions
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
  if (fileType.includes('text')) return '📄';
  return '📎';
}; 