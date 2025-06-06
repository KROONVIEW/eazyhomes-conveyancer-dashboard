// Call Service - Backend logic for call management
class CallService {
  constructor() {
    this.activeCalls = new Map();
    this.callHistory = [];
    this.callListeners = [];
  }

  // Initialize call session
  async initiateCall(contact, callType, initiatorId = 'current-user') {
    const callId = this.generateCallId();
    const callSession = {
      id: callId,
      contact,
      callType,
      initiatorId,
      status: 'initiating',
      startTime: new Date(),
      endTime: null,
      duration: 0,
      participants: [initiatorId, contact.id],
      metadata: {
        quality: 'good',
        connectionType: 'direct',
        deviceType: this.getDeviceType()
      }
    };

    this.activeCalls.set(callId, callSession);
    this.notifyListeners('call_initiated', callSession);

    // Simulate backend API call
    try {
      await this.simulateAPICall('/api/calls/initiate', {
        callId,
        contactId: contact.id,
        callType,
        initiatorId
      });

      console.log(`📞 Call initiated: ${callType} call with ${contact.name}`);
      return { success: true, callId, session: callSession };
    } catch (error) {
      this.activeCalls.delete(callId);
      console.error('Failed to initiate call:', error);
      return { success: false, error: error.message };
    }
  }

  // Update call status
  async updateCallStatus(callId, status, metadata = {}) {
    const callSession = this.activeCalls.get(callId);
    if (!callSession) {
      throw new Error('Call session not found');
    }

    callSession.status = status;
    callSession.metadata = { ...callSession.metadata, ...metadata };

    if (status === 'connected') {
      callSession.connectedTime = new Date();
    }

    this.notifyListeners('call_status_updated', callSession);

    // Simulate backend API call
    await this.simulateAPICall('/api/calls/update-status', {
      callId,
      status,
      metadata
    });

    console.log(`📞 Call ${callId} status updated to: ${status}`);
    return callSession;
  }

  // End call session
  async endCall(callId, reason = 'user_ended') {
    const callSession = this.activeCalls.get(callId);
    if (!callSession) {
      throw new Error('Call session not found');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime - callSession.startTime) / 1000);

    callSession.status = 'ended';
    callSession.endTime = endTime;
    callSession.duration = duration;
    callSession.endReason = reason;

    // Move to call history
    this.callHistory.unshift({ ...callSession });
    this.activeCalls.delete(callId);

    this.notifyListeners('call_ended', callSession);

    // Simulate backend API call
    await this.simulateAPICall('/api/calls/end', {
      callId,
      duration,
      reason,
      endTime: endTime.toISOString()
    });

    console.log(`📞 Call ended: ${callSession.contact.name} (${this.formatDuration(duration)})`);
    return callSession;
  }

  // Get active calls
  getActiveCalls() {
    return Array.from(this.activeCalls.values());
  }

  // Get call history
  getCallHistory(limit = 50) {
    return this.callHistory.slice(0, limit);
  }

  // Get call statistics
  getCallStatistics() {
    const totalCalls = this.callHistory.length;
    const videoCalls = this.callHistory.filter(call => call.callType === 'video').length;
    const voiceCalls = this.callHistory.filter(call => call.callType === 'voice').length;
    const totalDuration = this.callHistory.reduce((sum, call) => sum + call.duration, 0);
    const averageDuration = totalCalls > 0 ? Math.floor(totalDuration / totalCalls) : 0;

    return {
      totalCalls,
      videoCalls,
      voiceCalls,
      totalDuration,
      averageDuration,
      formattedTotalDuration: this.formatDuration(totalDuration),
      formattedAverageDuration: this.formatDuration(averageDuration)
    };
  }

  // Add event listener
  addListener(callback) {
    this.callListeners.push(callback);
    return () => {
      const index = this.callListeners.indexOf(callback);
      if (index > -1) {
        this.callListeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.callListeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in call listener:', error);
      }
    });
  }

  // Utility methods
  generateCallId() {
    return `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  getDeviceType() {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Simulate API calls
  async simulateAPICall(endpoint, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    
    // Simulate occasional failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error(`API call failed: ${endpoint}`);
    }

    return { success: true, data };
  }

  // Call quality monitoring
  async updateCallQuality(callId, qualityMetrics) {
    const callSession = this.activeCalls.get(callId);
    if (!callSession) return;

    callSession.metadata.quality = qualityMetrics.overall;
    callSession.metadata.latency = qualityMetrics.latency;
    callSession.metadata.bandwidth = qualityMetrics.bandwidth;

    await this.simulateAPICall('/api/calls/quality', {
      callId,
      metrics: qualityMetrics
    });
  }

  // Emergency call handling
  async initiateEmergencyCall(emergencyType = 'general') {
    const emergencyContact = {
      id: 'emergency',
      name: 'Emergency Services',
      avatarUrl: '/images/emergency-icon.png',
      online: true
    };

    const result = await this.initiateCall(emergencyContact, 'voice', 'current-user');
    
    if (result.success) {
      // Immediately connect emergency calls
      await this.updateCallStatus(result.callId, 'connected', {
        priority: 'emergency',
        emergencyType
      });
    }

    return result;
  }
}

// Create singleton instance
const callService = new CallService();

export default callService; 