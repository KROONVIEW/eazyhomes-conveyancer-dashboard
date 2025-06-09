/**
 * Upload/Download Memory Optimizer
 * Provides centralized memory management for file operations
 */

class UploadDownloadOptimizer {
  constructor() {
    this.activeUploads = new Map();
    this.activeDownloads = new Map();
    this.fileCache = new Map();
    this.progressCallbacks = new Map();
    this.abortControllers = new Map();
    this.cleanupTimers = new Map();
    
    // Performance monitoring
    this.performanceMetrics = {
      totalUploads: 0,
      totalDownloads: 0,
      failedUploads: 0,
      failedDownloads: 0,
      averageUploadTime: 0,
      averageDownloadTime: 0,
      memoryUsage: 0
    };

    // Bind methods to preserve context
    this.cleanup = this.cleanup.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleMemoryPressure = this.handleMemoryPressure.bind(this);

    // Setup event listeners
    this.setupEventListeners();
    
    // Start periodic cleanup
    this.startPeriodicCleanup();
  }

  setupEventListeners() {
    // Handle page visibility changes
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange, { passive: true });
    }

    // Handle memory pressure events
    if (typeof navigator !== 'undefined' && 'memory' in navigator) {
      // Monitor memory usage
      setInterval(() => {
        this.monitorMemoryUsage();
      }, 5000);
    }

    // Handle page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.cleanup, { passive: true });
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause non-critical operations
      this.pauseNonCriticalOperations();
    } else {
      // Page is visible, resume operations
      this.resumeOperations();
    }
  }

  handleMemoryPressure() {
    console.warn('Memory pressure detected, cleaning up upload/download cache');
    this.clearFileCache();
    this.cancelNonCriticalOperations();
  }

  monitorMemoryUsage() {
    if (navigator.memory) {
      const memoryInfo = navigator.memory;
      this.performanceMetrics.memoryUsage = memoryInfo.usedJSHeapSize;
      
      // If memory usage is high, trigger cleanup
      const memoryPressureThreshold = memoryInfo.jsHeapSizeLimit * 0.8;
      if (memoryInfo.usedJSHeapSize > memoryPressureThreshold) {
        this.handleMemoryPressure();
      }
    }
  }

  // File Upload Management
  startUpload(fileId, file, options = {}) {
    const uploadId = `upload_${fileId}_${Date.now()}`;
    const startTime = performance.now();
    
    // Create abort controller
    const abortController = new AbortController();
    this.abortControllers.set(uploadId, abortController);

    // Store upload metadata
    this.activeUploads.set(uploadId, {
      fileId,
      file,
      startTime,
      progress: 0,
      status: 'starting',
      options
    });

    // Increment metrics
    this.performanceMetrics.totalUploads++;

    return {
      uploadId,
      abortController,
      promise: this.simulateUpload(uploadId, file, options)
    };
  }

  async simulateUpload(uploadId, file, options) {
    const upload = this.activeUploads.get(uploadId);
    if (!upload) {throw new Error('Upload not found');}

    try {
      upload.status = 'uploading';
      
      // Simulate chunked upload with progress
      for (let progress = 0; progress <= 100; progress += Math.random() * 15) {
        // Check if upload was aborted
        const abortController = this.abortControllers.get(uploadId);
        if (abortController?.signal.aborted) {
          throw new Error('Upload cancelled');
        }

        // Update progress
        upload.progress = Math.min(progress, 100);
        
        // Notify progress callbacks
        const callback = this.progressCallbacks.get(uploadId);
        if (callback) {
          callback({ progress: upload.progress, status: upload.status });
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      }

      // Upload completed
      upload.status = 'completed';
      upload.endTime = performance.now();
      
      // Update metrics
      const uploadTime = upload.endTime - upload.startTime;
      this.updateAverageUploadTime(uploadTime);

      // Schedule cleanup
      this.scheduleCleanup(uploadId, 'upload');

      return { success: true, uploadId, file };
    } catch (error) {
      upload.status = 'failed';
      upload.error = error.message;
      this.performanceMetrics.failedUploads++;
      
      // Schedule cleanup
      this.scheduleCleanup(uploadId, 'upload');
      
      throw error;
    }
  }

  // File Download Management
  startDownload(templateId, template, options = {}) {
    const downloadId = `download_${templateId}_${Date.now()}`;
    const startTime = performance.now();
    
    // Create abort controller
    const abortController = new AbortController();
    this.abortControllers.set(downloadId, abortController);

    // Store download metadata
    this.activeDownloads.set(downloadId, {
      templateId,
      template,
      startTime,
      progress: 0,
      status: 'starting',
      options
    });

    // Increment metrics
    this.performanceMetrics.totalDownloads++;

    return {
      downloadId,
      abortController,
      promise: this.simulateDownload(downloadId, template, options)
    };
  }

  async simulateDownload(downloadId, template, options) {
    const download = this.activeDownloads.get(downloadId);
    if (!download) {throw new Error('Download not found');}

    try {
      download.status = 'downloading';
      
      // Simulate download with progress
      for (let progress = 0; progress <= 100; progress += Math.random() * 20) {
        // Check if download was aborted
        const abortController = this.abortControllers.get(downloadId);
        if (abortController?.signal.aborted) {
          throw new Error('Download cancelled');
        }

        // Update progress
        download.progress = Math.min(progress, 100);
        
        // Notify progress callbacks
        const callback = this.progressCallbacks.get(downloadId);
        if (callback) {
          callback({ progress: download.progress, status: download.status });
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 150));
      }

      // Create blob and trigger download
      const blob = new Blob(['Mock template content'], { 
        type: template.format === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.name}.${template.format.toLowerCase()}`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      // Download completed
      download.status = 'completed';
      download.endTime = performance.now();
      
      // Update metrics
      const downloadTime = download.endTime - download.startTime;
      this.updateAverageDownloadTime(downloadTime);

      // Schedule cleanup
      this.scheduleCleanup(downloadId, 'download');

      return { success: true, downloadId, template };
    } catch (error) {
      download.status = 'failed';
      download.error = error.message;
      this.performanceMetrics.failedDownloads++;
      
      // Schedule cleanup
      this.scheduleCleanup(downloadId, 'download');
      
      throw error;
    }
  }

  // Progress Tracking
  onProgress(operationId, callback) {
    this.progressCallbacks.set(operationId, callback);
  }

  offProgress(operationId) {
    this.progressCallbacks.delete(operationId);
  }

  // Abort Operations
  abortUpload(uploadId) {
    const abortController = this.abortControllers.get(uploadId);
    if (abortController) {
      abortController.abort();
    }
    this.cleanupOperation(uploadId, 'upload');
  }

  abortDownload(downloadId) {
    const abortController = this.abortControllers.get(downloadId);
    if (abortController) {
      abortController.abort();
    }
    this.cleanupOperation(downloadId, 'download');
  }

  // File Caching
  cacheFile(fileId, file, ttl = 300000) { // 5 minutes default TTL
    const cacheEntry = {
      file,
      timestamp: Date.now(),
      ttl,
      size: file.size
    };
    
    this.fileCache.set(fileId, cacheEntry);
    
    // Schedule cache cleanup
    setTimeout(() => {
      this.fileCache.delete(fileId);
    }, ttl);
  }

  getCachedFile(fileId) {
    const cacheEntry = this.fileCache.get(fileId);
    if (!cacheEntry) {return null;}
    
    // Check if cache entry is still valid
    if (Date.now() - cacheEntry.timestamp > cacheEntry.ttl) {
      this.fileCache.delete(fileId);
      return null;
    }
    
    return cacheEntry.file;
  }

  clearFileCache() {
    this.fileCache.clear();
  }

  // Cleanup Management
  scheduleCleanup(operationId, type, delay = 30000) { // 30 seconds default
    const timerId = setTimeout(() => {
      this.cleanupOperation(operationId, type);
    }, delay);
    
    this.cleanupTimers.set(operationId, timerId);
  }

  cleanupOperation(operationId, type) {
    if (type === 'upload') {
      this.activeUploads.delete(operationId);
    } else if (type === 'download') {
      this.activeDownloads.delete(operationId);
    }
    
    this.abortControllers.delete(operationId);
    this.progressCallbacks.delete(operationId);
    
    const timerId = this.cleanupTimers.get(operationId);
    if (timerId) {
      clearTimeout(timerId);
      this.cleanupTimers.delete(operationId);
    }
  }

  pauseNonCriticalOperations() {
    // Pause uploads/downloads that are not critical
    this.activeUploads.forEach((upload, uploadId) => {
      if (!upload.options?.critical) {
        const abortController = this.abortControllers.get(uploadId);
        if (abortController) {
          abortController.abort();
        }
      }
    });
  }

  resumeOperations() {
    // Resume operations when page becomes visible
    console.log('Resuming upload/download operations');
  }

  cancelNonCriticalOperations() {
    // Cancel non-critical operations to free memory
    this.activeUploads.forEach((upload, uploadId) => {
      if (!upload.options?.critical) {
        this.abortUpload(uploadId);
      }
    });
    
    this.activeDownloads.forEach((download, downloadId) => {
      if (!download.options?.critical) {
        this.abortDownload(downloadId);
      }
    });
  }

  startPeriodicCleanup() {
    // Run cleanup every 2 minutes
    setInterval(() => {
      this.performPeriodicCleanup();
    }, 120000);
  }

  performPeriodicCleanup() {
    const now = Date.now();
    const maxAge = 300000; // 5 minutes
    
    // Clean up old completed operations
    this.activeUploads.forEach((upload, uploadId) => {
      if (upload.status === 'completed' && (now - upload.endTime) > maxAge) {
        this.cleanupOperation(uploadId, 'upload');
      }
    });
    
    this.activeDownloads.forEach((download, downloadId) => {
      if (download.status === 'completed' && (now - download.endTime) > maxAge) {
        this.cleanupOperation(downloadId, 'download');
      }
    });
    
    // Clean up expired cache entries
    this.fileCache.forEach((cacheEntry, fileId) => {
      if ((now - cacheEntry.timestamp) > cacheEntry.ttl) {
        this.fileCache.delete(fileId);
      }
    });
  }

  updateAverageUploadTime(uploadTime) {
    const currentAvg = this.performanceMetrics.averageUploadTime;
    const totalUploads = this.performanceMetrics.totalUploads;
    this.performanceMetrics.averageUploadTime = 
      (currentAvg * (totalUploads - 1) + uploadTime) / totalUploads;
  }

  updateAverageDownloadTime(downloadTime) {
    const currentAvg = this.performanceMetrics.averageDownloadTime;
    const totalDownloads = this.performanceMetrics.totalDownloads;
    this.performanceMetrics.averageDownloadTime = 
      (currentAvg * (totalDownloads - 1) + downloadTime) / totalDownloads;
  }

  // Public API
  getActiveUploads() {
    return Array.from(this.activeUploads.values());
  }

  getActiveDownloads() {
    return Array.from(this.activeDownloads.values());
  }

  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  getMemoryUsage() {
    return {
      activeUploads: this.activeUploads.size,
      activeDownloads: this.activeDownloads.size,
      cachedFiles: this.fileCache.size,
      abortControllers: this.abortControllers.size,
      progressCallbacks: this.progressCallbacks.size,
      cleanupTimers: this.cleanupTimers.size
    };
  }

  // Complete cleanup
  cleanup() {
    // Cancel all active operations
    this.abortControllers.forEach(controller => controller.abort());
    
    // Clear all maps
    this.activeUploads.clear();
    this.activeDownloads.clear();
    this.fileCache.clear();
    this.progressCallbacks.clear();
    this.abortControllers.clear();
    
    // Clear all timers
    this.cleanupTimers.forEach(timerId => clearTimeout(timerId));
    this.cleanupTimers.clear();
    
    // Remove event listeners
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.cleanup);
    }
  }
}

// Create singleton instance
const uploadDownloadOptimizer = new UploadDownloadOptimizer();

export default uploadDownloadOptimizer; 