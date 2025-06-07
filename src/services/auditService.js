import authService from './authService';

class AuditService {
  constructor() {
    this.logs = [];
    this.maxLogs = 10000; // Maximum logs to keep in memory
    this.storageKey = 'easyhomes_audit_logs';
    this.init();
  }

  // Initialize the audit service
  init() {
    this.loadLogsFromStorage();
    console.log('🔍 Audit Service initialized');
    
    // Add initial system startup log
    this.log('System Startup', {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    // Add some sample logs if this is the first time running
    if (this.logs.length <= 1) {
      this.addSampleLogs();
    }
  }

  // Add sample logs for demonstration
  addSampleLogs() {
    const sampleLogs = [
      {
        action: 'Document Upload',
        details: { fileName: 'FICA.pdf', matterId: 'EZT1001', fileSize: '2.5MB' },
        user: { name: 'Jane Doe', role: 'conveyancer', email: 'jane@example.com' }
      },
      {
        action: 'Matter Status Changed',
        details: { matterId: 'EZT1002', oldStatus: 'Prep', newStatus: 'Lodged' },
        user: { name: 'Sipho Dlamini', role: 'conveyancer', email: 'sipho@example.com' }
      },
      {
        action: 'Client Created',
        details: { clientId: 'CLT1003', clientName: 'Fatima Patel' },
        user: { name: 'Thabo Mokoena', role: 'assistant', email: 'thabo@example.com' }
      },
      {
        action: 'Document Download',
        details: { fileName: 'Transfer_Deed.pdf', matterId: 'EZT1001' },
        user: { name: 'Jane Doe', role: 'conveyancer', email: 'jane@example.com' }
      },
      {
        action: 'Profile Updated',
        details: { changes: { firmName: 'Updated Law Firm Name' } },
        user: { name: 'Admin User', role: 'admin', email: 'admin@example.com' }
      }
    ];

    sampleLogs.forEach((sample, index) => {
      const logEntry = {
        id: this.generateId(),
        timestamp: new Date(Date.now() - (index * 3600000)).toISOString(), // Spread over last few hours
        user: {
          id: `sample_${index}`,
          email: sample.user.email,
          name: sample.user.name,
          role: sample.user.role
        },
        action: sample.action,
        details: {
          ...sample.details,
          userAgent: navigator.userAgent,
          url: window.location.href,
          sessionId: this.getSessionId()
        },
        severity: this.getSeverity(sample.action),
        category: this.getCategory(sample.action)
      };

      this.logs.push(logEntry);
    });

    this.saveLogsToStorage();
    console.log('📝 Added sample audit logs for demonstration');
  }

  // Load logs from localStorage
  loadLogsFromStorage() {
    try {
      const storedLogs = localStorage.getItem(this.storageKey);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
        console.log(`📋 Loaded ${this.logs.length} audit logs from storage`);
      }
    } catch (error) {
      console.error('Error loading audit logs from storage:', error);
      this.logs = [];
    }
  }

  // Save logs to localStorage
  saveLogsToStorage() {
    try {
      // Keep only the most recent logs to prevent storage overflow
      const logsToSave = this.logs.slice(-this.maxLogs);
      localStorage.setItem(this.storageKey, JSON.stringify(logsToSave));
    } catch (error) {
      console.error('Error saving audit logs to storage:', error);
      // If storage is full, try to clear old logs and save again
      this.clearOldLogs();
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.logs.slice(-1000)));
      } catch (retryError) {
        console.error('Failed to save audit logs even after cleanup:', retryError);
      }
    }
  }

  // Clear old logs to free up memory and storage
  clearOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90); // Keep logs for 90 days
    
    const initialCount = this.logs.length;
    this.logs = this.logs.filter(log => new Date(log.timestamp) > cutoffDate);
    
    const removedCount = initialCount - this.logs.length;
    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} old audit logs`);
      this.saveLogsToStorage();
    }
  }

  // Create a new audit log entry
  log(action, details = {}) {
    const user = authService.getCurrentUser();
    const profile = authService.getUserProfile();
    
    const logEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      user: {
        id: user?.uid || 'anonymous',
        email: user?.email || 'unknown',
        name: profile ? `${profile.firstName} ${profile.lastName}`.trim() : user?.displayName || 'Unknown User',
        role: profile?.role || 'unknown'
      },
      action,
      details: {
        ...details,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.getSessionId()
      },
      severity: this.getSeverity(action),
      category: this.getCategory(action)
    };

    this.logs.push(logEntry);
    
    // Trigger memory management if needed
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Save to storage periodically
    if (this.logs.length % 10 === 0) {
      this.saveLogsToStorage();
    }

    console.log('📝 Audit Log:', logEntry);
    return logEntry;
  }

  // Generate unique ID for log entries
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get or create session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('audit_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('audit_session_id', sessionId);
    }
    return sessionId;
  }

  // Determine severity level based on action
  getSeverity(action) {
    const highSeverity = ['delete', 'remove', 'logout', 'login_failed', 'access_denied'];
    const mediumSeverity = ['create', 'update', 'upload', 'download', 'login', 'status_change'];
    
    const actionLower = action.toLowerCase();
    
    if (highSeverity.some(keyword => actionLower.includes(keyword))) {
      return 'high';
    } else if (mediumSeverity.some(keyword => actionLower.includes(keyword))) {
      return 'medium';
    }
    return 'low';
  }

  // Categorize actions
  getCategory(action) {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('login') || actionLower.includes('logout') || actionLower.includes('auth')) {
      return 'authentication';
    } else if (actionLower.includes('document') || actionLower.includes('file') || actionLower.includes('upload') || actionLower.includes('download')) {
      return 'document_management';
    } else if (actionLower.includes('matter') || actionLower.includes('case')) {
      return 'matter_management';
    } else if (actionLower.includes('client') || actionLower.includes('contact')) {
      return 'client_management';
    } else if (actionLower.includes('user') || actionLower.includes('profile') || actionLower.includes('settings')) {
      return 'user_management';
    } else if (actionLower.includes('system') || actionLower.includes('config')) {
      return 'system';
    }
    return 'general';
  }

  // Get all logs with optional filtering
  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];

    // Filter by user
    if (filters.user && filters.user !== 'All') {
      filteredLogs = filteredLogs.filter(log => log.user.name === filters.user);
    }

    // Filter by action
    if (filters.action && filters.action !== 'All') {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }

    // Filter by category
    if (filters.category && filters.category !== 'All') {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category);
    }

    // Filter by severity
    if (filters.severity && filters.severity !== 'All') {
      filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
    }

    // Filter by date range
    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
    }

    // Search in details
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.action.toLowerCase().includes(searchLower) ||
        log.user.name.toLowerCase().includes(searchLower) ||
        JSON.stringify(log.details).toLowerCase().includes(searchLower)
      );
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return filteredLogs;
  }

  // Get unique users for filtering
  getUsers() {
    const users = new Set();
    this.logs.forEach(log => users.add(log.user.name));
    return ['All', ...Array.from(users).sort()];
  }

  // Get unique actions for filtering
  getActions() {
    const actions = new Set();
    this.logs.forEach(log => actions.add(log.action));
    return ['All', ...Array.from(actions).sort()];
  }

  // Get unique categories for filtering
  getCategories() {
    const categories = new Set();
    this.logs.forEach(log => categories.add(log.category));
    return ['All', ...Array.from(categories).sort()];
  }

  // Export logs to CSV
  exportToCSV(filters = {}) {
    const logs = this.getLogs(filters);
    
    if (logs.length === 0) {
      throw new Error('No logs to export');
    }

    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Category', 'Severity', 'Details'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        `"${new Date(log.timestamp).toLocaleString()}"`,
        `"${log.user.name}"`,
        `"${log.user.role}"`,
        `"${log.action}"`,
        `"${log.category}"`,
        `"${log.severity}"`,
        `"${JSON.stringify(log.details).replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.log('Export Audit Logs', { 
      exportedCount: logs.length,
      filters: filters
    });

    return csvContent;
  }

  // Pre-built logging methods for common actions
  logLogin(success = true, details = {}) {
    return this.log(success ? 'User Login' : 'Login Failed', {
      success,
      ...details
    });
  }

  logLogout(details = {}) {
    return this.log('User Logout', details);
  }

  logDocumentUpload(fileName, matterId = null, details = {}) {
    return this.log('Document Upload', {
      fileName,
      matterId,
      fileSize: details.fileSize,
      fileType: details.fileType,
      ...details
    });
  }

  logDocumentDownload(fileName, matterId = null, details = {}) {
    return this.log('Document Download', {
      fileName,
      matterId,
      ...details
    });
  }

  logDocumentDelete(fileName, matterId = null, details = {}) {
    return this.log('Document Delete', {
      fileName,
      matterId,
      ...details
    });
  }

  logMatterCreate(matterId, details = {}) {
    return this.log('Matter Created', {
      matterId,
      ...details
    });
  }

  logMatterUpdate(matterId, changes = {}, details = {}) {
    return this.log('Matter Updated', {
      matterId,
      changes,
      ...details
    });
  }

  logMatterStatusChange(matterId, oldStatus, newStatus, details = {}) {
    return this.log('Matter Status Changed', {
      matterId,
      oldStatus,
      newStatus,
      ...details
    });
  }

  logClientCreate(clientId, details = {}) {
    return this.log('Client Created', {
      clientId,
      ...details
    });
  }

  logClientUpdate(clientId, changes = {}, details = {}) {
    return this.log('Client Updated', {
      clientId,
      changes,
      ...details
    });
  }

  logProfileUpdate(changes = {}, details = {}) {
    return this.log('Profile Updated', {
      changes,
      ...details
    });
  }

  logSystemAccess(page, details = {}) {
    return this.log('Page Access', {
      page,
      ...details
    });
  }

  logError(error, context = {}) {
    return this.log('System Error', {
      error: error.message || error,
      stack: error.stack,
      context,
      severity: 'high'
    });
  }

  // Get audit statistics
  getStatistics(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentLogs = this.logs.filter(log => new Date(log.timestamp) > cutoffDate);
    
    const stats = {
      totalLogs: recentLogs.length,
      uniqueUsers: new Set(recentLogs.map(log => log.user.id)).size,
      actionCounts: {},
      categoryCounts: {},
      severityCounts: { low: 0, medium: 0, high: 0 },
      dailyActivity: {}
    };

    recentLogs.forEach(log => {
      // Count actions
      stats.actionCounts[log.action] = (stats.actionCounts[log.action] || 0) + 1;
      
      // Count categories
      stats.categoryCounts[log.category] = (stats.categoryCounts[log.category] || 0) + 1;
      
      // Count severity
      stats.severityCounts[log.severity]++;
      
      // Count daily activity
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      stats.dailyActivity[date] = (stats.dailyActivity[date] || 0) + 1;
    });

    return stats;
  }

  // Force save all logs
  forceSave() {
    this.saveLogsToStorage();
  }

  // Clear all logs (admin function)
  clearAllLogs() {
    const user = authService.getCurrentUser();
    const profile = authService.getUserProfile();
    
    if (profile?.role !== 'admin') {
      throw new Error('Only administrators can clear audit logs');
    }

    const logCount = this.logs.length;
    this.logs = [];
    localStorage.removeItem(this.storageKey);
    
    console.log(`🗑️ Cleared ${logCount} audit logs`);
    
    // Log the clearing action
    this.log('Audit Logs Cleared', {
      clearedCount: logCount,
      clearedBy: user?.email
    });
  }
}

// Create singleton instance
const auditService = new AuditService();

export default auditService; 