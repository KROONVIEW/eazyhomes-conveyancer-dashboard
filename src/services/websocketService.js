import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.messageListeners = new Map();
    this.statusListeners = new Map();
    this.typingListeners = new Map();
  }

  // Initialize WebSocket connection
  connect(userId, authToken) {
    try {
      const socketUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001';
      
      this.socket = io(socketUrl, {
        auth: {
          token: authToken,
          userId: userId
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.setupEventListeners();
      
      console.log('🔌 WebSocket connecting to:', socketUrl);
      
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      this.handleConnectionError(error);
    }
  }

  // Setup all WebSocket event listeners
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionChange(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
      this.isConnected = false;
      this.notifyConnectionChange(false);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, reconnect manually
        this.reconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.handleConnectionError(error);
    });

    // Message events
    this.socket.on('new_message', (messageData) => {
      console.log('📨 New message received:', messageData);
      this.notifyMessageListeners(messageData);
    });

    this.socket.on('message_status_update', (statusData) => {
      console.log('📊 Message status update:', statusData);
      this.notifyStatusListeners(statusData);
    });

    this.socket.on('user_typing', (typingData) => {
      console.log('⌨️ User typing:', typingData);
      this.notifyTypingListeners(typingData);
    });

    this.socket.on('user_stopped_typing', (typingData) => {
      console.log('⌨️ User stopped typing:', typingData);
      this.notifyTypingListeners({ ...typingData, isTyping: false });
    });

    // Broadcast events
    this.socket.on('broadcast_message', (broadcastData) => {
      console.log('📢 Broadcast received:', broadcastData);
      this.notifyMessageListeners({
        ...broadcastData,
        isBroadcast: true
      });
    });

    // Presence events
    this.socket.on('user_online', (userData) => {
      console.log('🟢 User came online:', userData);
      this.notifyPresenceChange(userData.userId, true);
    });

    this.socket.on('user_offline', (userData) => {
      console.log('🔴 User went offline:', userData);
      this.notifyPresenceChange(userData.userId, false);
    });
  }

  // Send message through WebSocket
  sendMessage(conversationId, messageData) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    const payload = {
      conversationId,
      ...messageData,
      timestamp: new Date().toISOString()
    };

    this.socket.emit('send_message', payload);
    console.log('📤 Message sent via WebSocket:', payload);
  }

  // Send broadcast message
  sendBroadcast(broadcastData) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    this.socket.emit('send_broadcast', broadcastData);
    console.log('📢 Broadcast sent via WebSocket:', broadcastData);
  }

  // Send typing indicator
  sendTyping(conversationId, isTyping = true) {
    if (!this.isConnected) return;

    this.socket.emit('typing', {
      conversationId,
      isTyping,
      timestamp: new Date().toISOString()
    });
  }

  // Join conversation room
  joinConversation(conversationId) {
    if (!this.isConnected) return;

    this.socket.emit('join_conversation', { conversationId });
    console.log('🏠 Joined conversation:', conversationId);
  }

  // Leave conversation room
  leaveConversation(conversationId) {
    if (!this.isConnected) return;

    this.socket.emit('leave_conversation', { conversationId });
    console.log('🚪 Left conversation:', conversationId);
  }

  // Subscribe to message updates
  subscribeToMessages(conversationId, callback) {
    this.messageListeners.set(conversationId, callback);
    this.joinConversation(conversationId);
    
    return () => {
      this.messageListeners.delete(conversationId);
      this.leaveConversation(conversationId);
    };
  }

  // Subscribe to status updates
  subscribeToStatus(callback) {
    const listenerId = Date.now().toString();
    this.statusListeners.set(listenerId, callback);
    
    return () => {
      this.statusListeners.delete(listenerId);
    };
  }

  // Subscribe to typing indicators
  subscribeToTyping(conversationId, callback) {
    this.typingListeners.set(conversationId, callback);
    
    return () => {
      this.typingListeners.delete(conversationId);
    };
  }

  // Notify message listeners
  notifyMessageListeners(messageData) {
    const conversationId = messageData.conversationId;
    const listener = this.messageListeners.get(conversationId);
    
    if (listener) {
      listener(messageData);
    }
  }

  // Notify status listeners
  notifyStatusListeners(statusData) {
    this.statusListeners.forEach(listener => {
      listener(statusData);
    });
  }

  // Notify typing listeners
  notifyTypingListeners(typingData) {
    const conversationId = typingData.conversationId;
    const listener = this.typingListeners.get(conversationId);
    
    if (listener) {
      listener(typingData);
    }
  }

  // Notify connection change
  notifyConnectionChange(isConnected) {
    // Emit custom event for connection status
    window.dispatchEvent(new CustomEvent('websocket_connection_change', {
      detail: { isConnected }
    }));
  }

  // Notify presence change
  notifyPresenceChange(userId, isOnline) {
    window.dispatchEvent(new CustomEvent('user_presence_change', {
      detail: { userId, isOnline }
    }));
  }

  // Handle connection errors
  handleConnectionError(error) {
    console.error('WebSocket error:', error);
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnect();
    } else {
      console.error('Max reconnection attempts reached');
      this.notifyConnectionChange(false);
    }
  }

  // Reconnect logic
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.socket) {
        this.socket.connect();
      }
    }, delay);
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.messageListeners.clear();
    this.statusListeners.clear();
    this.typingListeners.clear();
    
    console.log('🔌 WebSocket disconnected');
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id || null
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 