// Notification Service - Real-time Updates for Mobile Portal
class NotificationService {
  constructor() {
    this.listeners = new Map();
    this.notifications = [];
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Subscribe to notifications for a specific matter
  subscribe(matterId, callback) {
    if (!this.listeners.has(matterId)) {
      this.listeners.set(matterId, new Set());
    }
    this.listeners.get(matterId).add(callback);

    // Return unsubscribe function
    return () => {
      const matterListeners = this.listeners.get(matterId);
      if (matterListeners) {
        matterListeners.delete(callback);
        if (matterListeners.size === 0) {
          this.listeners.delete(matterId);
        }
      }
    };
  }

  // Notify all listeners for a specific matter
  notify(matterId, notification) {
    const matterListeners = this.listeners.get(matterId);
    if (matterListeners) {
      matterListeners.forEach(callback => {
        try {
          callback(notification);
        } catch (error) {
          console.error('Error in notification callback:', error);
        }
      });
    }

    // Store notification for history
    this.notifications.unshift({
      ...notification,
      matterId,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });

    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    // Show browser notification if permission granted
    this.showBrowserNotification(notification);
  }

  // Show browser notification
  showBrowserNotification(notification) {
    if (this.permission !== 'granted') {return;}

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: notification.priority === 'high',
        silent: notification.priority === 'low'
      });

      // Auto-close after 5 seconds for non-high priority
      if (notification.priority !== 'high') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        if (notification.action) {
          notification.action();
        }
      };
    } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  }

  // Get notification history for a matter
  getNotifications(matterId, limit = 10) {
    return this.notifications
      .filter(n => n.matterId === matterId)
      .slice(0, limit);
  }

  // Clear notifications for a matter
  clearNotifications(matterId) {
    this.notifications = this.notifications.filter(n => n.matterId !== matterId);
  }

  // Predefined notification types for matter updates
  notifyStatusUpdate(matterId, oldStatus, newStatus) {
    this.notify(matterId, {
      type: 'status_update',
      title: 'Status Updated',
      message: `Your matter status changed from "${oldStatus}" to "${newStatus}"`,
      priority: 'medium',
      category: 'status'
    });
  }

  notifyDocumentUpdate(matterId, documentName, action) {
    const actionMessages = {
      uploaded: `Document "${documentName}" has been uploaded`,
      signed: `Document "${documentName}" has been signed`,
      approved: `Document "${documentName}" has been approved`,
      rejected: `Document "${documentName}" needs revision`
    };

    this.notify(matterId, {
      type: 'document_update',
      title: 'Document Update',
      message: actionMessages[action] || `Document "${documentName}" has been updated`,
      priority: action === 'rejected' ? 'high' : 'medium',
      category: 'documents'
    });
  }

  notifyNewMessage(matterId, senderName, messagePreview) {
    this.notify(matterId, {
      type: 'new_message',
      title: 'New Message',
      message: `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
      priority: 'medium',
      category: 'messages'
    });
  }

  notifyProgressUpdate(matterId, milestone) {
    this.notify(matterId, {
      type: 'progress_update',
      title: 'Progress Update',
      message: `Milestone reached: ${milestone}`,
      priority: 'medium',
      category: 'progress'
    });
  }

  notifyUrgentAction(matterId, actionRequired) {
    this.notify(matterId, {
      type: 'urgent_action',
      title: 'Action Required',
      message: actionRequired,
      priority: 'high',
      category: 'urgent'
    });
  }

  // Simulate real-time updates (for demo purposes)
  startDemoUpdates(matterId) {
    const demoUpdates = [
      () => this.notifyNewMessage(matterId, 'Thuli M.', 'Your documents have been reviewed and approved.'),
      () => this.notifyDocumentUpdate(matterId, 'Sale Agreement', 'signed'),
      () => this.notifyStatusUpdate(matterId, 'Awaiting Signature', 'Registered'),
      () => this.notifyProgressUpdate(matterId, 'Registration Complete')
    ];

    let updateIndex = 0;
    const interval = setInterval(() => {
      if (updateIndex < demoUpdates.length) {
        demoUpdates[updateIndex]();
        updateIndex++;
      } else {
        clearInterval(interval);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }

  // Check if there are unread notifications
  hasUnreadNotifications(matterId) {
    return this.notifications.some(n => 
      n.matterId === matterId && !n.read
    );
  }

  // Mark notifications as read
  markAsRead(matterId, notificationIds = null) {
    this.notifications.forEach(notification => {
      if (notification.matterId === matterId) {
        if (!notificationIds || notificationIds.includes(notification.id)) {
          notification.read = true;
        }
      }
    });
  }

  // Get unread count for a matter
  getUnreadCount(matterId) {
    return this.notifications.filter(n => 
      n.matterId === matterId && !n.read
    ).length;
  }
}

export default new NotificationService(); 