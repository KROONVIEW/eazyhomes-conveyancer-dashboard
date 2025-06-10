// Broadcast Service - Handles targeted broadcasting to specific user groups
class BroadcastService {
  constructor() {
    this.userGroups = {
      all: {
        id: 'all',
        name: 'All Firm Members',
        members: [
          'john.carlo', 'jessica.wu', 'alice.smith', 'sarah.lee', 'michael.tan',
          'anna.kim', 'david.lin', 'kabelo.mokoena', 'mpho.sithole', 'nathan.jones',
          'emma.watson', 'james.bond', 'mary.jane', 'peter.parker', 'tony.stark',
          'bruce.wayne', 'clark.kent', 'diana.prince', 'barry.allen', 'hal.jordan',
          'arthur.curry', 'victor.stone', 'oliver.queen', 'kara.danvers'
        ],
        count: 24
      },
      conveyancers: {
        id: 'conveyancers',
        name: 'Conveyancers Only',
        members: [
          'john.carlo', 'jessica.wu', 'alice.smith', 'sarah.lee', 
          'kabelo.mokoena', 'mpho.sithole', 'nathan.jones', 'emma.watson'
        ],
        count: 8
      },
      support: {
        id: 'support',
        name: 'Support Staff',
        members: [
          'michael.tan', 'anna.kim', 'david.lin', 'mary.jane', 'peter.parker', 'tony.stark'
        ],
        count: 6
      },
      management: {
        id: 'management',
        name: 'Management Team',
        members: [
          'bruce.wayne', 'clark.kent', 'diana.prince', 'kabelo.mokoena'
        ],
        count: 4
      },
      // Custom group for specific users (Kabelo, Mpho, Nathan)
      project_team: {
        id: 'project_team',
        name: 'Project Team Alpha',
        members: ['kabelo.mokoena', 'mpho.sithole', 'nathan.jones'],
        count: 3
      }
    };

    this.userProfiles = {
      'john.carlo': { name: 'John Carlo', role: 'Senior Conveyancer', avatar: '/images/avatars/face_1 (1).jpg' },
      'jessica.wu': { name: 'Jessica Wu', role: 'Junior Conveyancer', avatar: '/images/avatars/face_1 (2).jpg' },
      'alice.smith': { name: 'Alice Smith', role: 'Conveyancer', avatar: '/images/avatars/face_1 (3).jpg' },
      'sarah.lee': { name: 'Sarah Lee', role: 'Senior Conveyancer', avatar: '/images/avatars/face_1 (4).jpg' },
      'michael.tan': { name: 'Michael Tan', role: 'Support Specialist', avatar: '/images/avatars/face_1 (5).jpg' },
      'anna.kim': { name: 'Anna Kim', role: 'Senior Associate', avatar: '/images/avatars/face_1 (6).jpg' },
      'david.lin': { name: 'David Lin', role: 'IT Support', avatar: '/images/avatars/face_1 (7).jpg' },
      'kabelo.mokoena': { name: 'Kabelo Mokoena', role: 'Project Manager', avatar: '/images/avatars/face_1 (8).jpg' },
      'mpho.sithole': { name: 'Mpho Sithole', role: 'Senior Developer', avatar: '/images/avatars/face_1 (9).jpg' },
      'nathan.jones': { name: 'Nathan Jones', role: 'Business Analyst', avatar: '/images/avatars/face_1 (10).jpg' },
      'emma.watson': { name: 'Emma Watson', role: 'Legal Advisor', avatar: '/images/avatars/face_1 (11).jpg' },
      'james.bond': { name: 'James Bond', role: 'Security Consultant', avatar: '/images/avatars/face_1 (12).jpg' },
      'mary.jane': { name: 'Mary Jane', role: 'HR Manager', avatar: '/images/avatars/face_1 (13).jpg' },
      'peter.parker': { name: 'Peter Parker', role: 'Junior Developer', avatar: '/images/avatars/face_1 (14).jpg' },
      'tony.stark': { name: 'Tony Stark', role: 'CTO', avatar: '/images/avatars/face_1 (15).jpg' },
      'bruce.wayne': { name: 'Bruce Wayne', role: 'Managing Partner', avatar: '/images/avatars/face_1 (16).jpg' },
      'clark.kent': { name: 'Clark Kent', role: 'Senior Partner', avatar: '/images/avatars/face_1 (17).jpg' },
      'diana.prince': { name: 'Diana Prince', role: 'Operations Director', avatar: '/images/avatars/face_1 (18).jpg' },
      'barry.allen': { name: 'Barry Allen', role: 'Compliance Officer', avatar: '/images/avatars/face_1 (19).jpg' },
      'hal.jordan': { name: 'Hal Jordan', role: 'Risk Manager', avatar: '/images/avatars/face_1 (20).jpg' }
    };
  }

  // Get all available user groups
  getUserGroups() {
    return Object.values(this.userGroups);
  }

  // Get specific user group
  getUserGroup(groupId) {
    return this.userGroups[groupId];
  }

  // Get user profile
  getUserProfile(userId) {
    return this.userProfiles[userId];
  }

  // Get all user profiles
  getAllUsers() {
    return Object.keys(this.userProfiles).map(userId => ({
      id: userId,
      ...this.userProfiles[userId]
    }));
  }

  // Get user names for a list of user IDs
  getUserNames(userIds) {
    return userIds.map(userId => this.getUserProfile(userId)?.name || userId).join(', ');
  }

  // Send broadcast to specific group
  async sendBroadcast(broadcastData) {
    console.log('📢 Broadcasting message:', broadcastData);
    
    try {
      // Validate broadcast data
      this.validateBroadcast(broadcastData);
      
      // Handle custom recipients or get predefined group
      let targetGroup;
      if (typeof broadcastData.recipients === 'object') {
        // Custom recipients object
        targetGroup = broadcastData.recipients;
        // Validate custom group structure
        if (!targetGroup.groupId || !targetGroup.members || !Array.isArray(targetGroup.members)) {
          throw new Error('Invalid custom recipient group structure');
        }
      } else {
        // Predefined group ID
        targetGroup = this.getUserGroup(broadcastData.recipients);
        if (!targetGroup) {
          throw new Error(`Invalid recipient group: ${broadcastData.recipients}`);
        }
      }

      // Create broadcast message
      const broadcastMessage = {
        id: `broadcast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'broadcast',
        subject: broadcastData.subject,
        text: broadcastData.message,
        sender: broadcastData.sender || 'Firm Administration',
        timestamp: this.formatTimestamp(new Date()),
        isBroadcast: true,
        priority: broadcastData.priority || 'normal',
        recipients: {
          groupId: targetGroup.id,
          groupName: targetGroup.name,
          memberCount: targetGroup.count,
          members: targetGroup.members
        },
        status: 'sent',
        readBy: [],
        deliveredTo: []
      };

      // Simulate delivery to each member
      await this.deliverToMembers(broadcastMessage, targetGroup.members);

      console.log('✅ Broadcast sent successfully:', broadcastMessage);
      return broadcastMessage;

    } catch (error) {
      console.error('❌ Broadcast failed:', error);
      throw error;
    }
  }

  // Validate broadcast data
  validateBroadcast(broadcastData) {
    if (!broadcastData.subject || !broadcastData.subject.trim()) {
      throw new Error('Broadcast subject is required');
    }
    if (!broadcastData.message || !broadcastData.message.trim()) {
      throw new Error('Broadcast message is required');
    }
    if (!broadcastData.recipients) {
      throw new Error('Recipients group is required');
    }
    
    // Validate custom recipients
    if (typeof broadcastData.recipients === 'object' && broadcastData.recipients.groupId === 'custom') {
      if (!broadcastData.recipients.members || broadcastData.recipients.members.length === 0) {
        throw new Error('At least one recipient must be selected');
      }
      if (broadcastData.recipients.members.length > 50) {
        throw new Error('Too many recipients (max 50 users)');
      }
    }
    
    if (broadcastData.subject.length > 100) {
      throw new Error('Subject line too long (max 100 characters)');
    }
    if (broadcastData.message.length > 1000) {
      throw new Error('Message too long (max 1000 characters)');
    }
  }

  // Simulate delivery to group members
  async deliverToMembers(broadcastMessage, members) {
    const deliveryPromises = members.map(async (memberId) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      
      // Mark as delivered
      broadcastMessage.deliveredTo.push({
        userId: memberId,
        deliveredAt: new Date().toISOString(),
        status: 'delivered'
      });
      
      console.log(`📨 Delivered to ${this.getUserProfile(memberId)?.name || memberId}`);
    });

    await Promise.all(deliveryPromises);
  }

  // Format timestamp
  formatTimestamp(date) {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  // Get broadcast history
  getBroadcastHistory() {
    // In a real app, this would fetch from backend
    return [];
  }

  // Mark broadcast as read by user
  markAsRead(broadcastId, userId) {
    console.log(`📖 User ${userId} read broadcast ${broadcastId}`);
    // In a real app, this would update the backend
  }

  // Get delivery status for broadcast
  getDeliveryStatus(broadcastId) {
    // In a real app, this would fetch from backend
    return {
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0
    };
  }

  // Create targeted group chat from broadcast
  createGroupChatFromBroadcast(broadcastMessage) {
    const groupId = `group_${broadcastMessage.recipients.groupId}_${Date.now()}`;
    
    return {
      id: groupId,
      name: `${broadcastMessage.recipients.groupName} - ${broadcastMessage.subject}`,
      type: 'group',
      isFromBroadcast: true,
      broadcastId: broadcastMessage.id,
      members: broadcastMessage.recipients.members.map(memberId => ({
        id: memberId,
        ...this.getUserProfile(memberId)
      })),
      createdAt: new Date().toISOString(),
      createdBy: broadcastMessage.sender
    };
  }
}

// Export singleton instance
const broadcastService = new BroadcastService();
export default broadcastService; 