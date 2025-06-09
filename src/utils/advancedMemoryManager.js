// Advanced Memory Management System
// Implements best-in-class memory optimization techniques

class AdvancedMemoryManager {
  constructor() {
    this.observers = new Set();
    this.caches = new Map();
    this.timers = new Set();
    this.eventListeners = new Map();
    this.componentRefs = new WeakMap();
    this.memoryThresholds = {
      warning: 70,
      critical: 85,
      emergency: 95
    };
    this.isRunning = false;
    this.cleanupQueue = [];
    this.performanceMetrics = {
      memoryUsage: [],
      renderTimes: [],
      componentCounts: []
    };
    
    this.init();
  }

  init() {
    if (typeof window === 'undefined') {return;}
    
    // Start monitoring
    this.startMemoryMonitoring();
    
    // Setup cleanup intervals
    this.setupCleanupIntervals();
    
    // Setup emergency handlers
    this.setupEmergencyHandlers();
    
    // Setup performance observers
    this.setupPerformanceObservers();
    
    console.log('🧠 Advanced Memory Manager initialized');
  }

  // Memory Monitoring
  startMemoryMonitoring() {
    if (this.isRunning) {return;}
    this.isRunning = true;

    const monitor = () => {
      if (!this.isRunning) {return;}
      
      const memoryInfo = this.getMemoryInfo();
      this.performanceMetrics.memoryUsage.push({
        timestamp: Date.now(),
        ...memoryInfo
      });
      
      // Keep only last 100 measurements
      if (this.performanceMetrics.memoryUsage.length > 100) {
        this.performanceMetrics.memoryUsage.shift();
      }
      
      // Check thresholds and trigger cleanup
      this.checkMemoryThresholds(memoryInfo);
      
      // Schedule next check
      setTimeout(monitor, 2000);
    };
    
    monitor();
  }

  getMemoryInfo() {
    if (!window.performance?.memory) {
      return { used: 0, total: 0, percentage: 0 };
    }
    
    const memory = window.performance.memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
    };
  }

  checkMemoryThresholds(memoryInfo) {
    const { percentage } = memoryInfo;
    
    if (percentage >= this.memoryThresholds.emergency) {
      this.triggerEmergencyCleanup();
    } else if (percentage >= this.memoryThresholds.critical) {
      this.triggerCriticalCleanup();
    } else if (percentage >= this.memoryThresholds.warning) {
      this.triggerWarningCleanup();
    }
  }

  // Cleanup Strategies
  triggerEmergencyCleanup() {
    console.warn('🚨 Emergency memory cleanup triggered');
    
    // Immediate aggressive cleanup
    this.clearAllCaches();
    this.cleanupUnusedComponents();
    this.optimizeImages();
    this.clearEventListeners();
    this.forceGarbageCollection();
    
    // Disable heavy features temporarily
    this.disableHeavyFeatures();
    
    // Re-enable after 30 seconds
    setTimeout(() => this.enableHeavyFeatures(), 30000);
  }

  triggerCriticalCleanup() {
    console.warn('⚠️ Critical memory cleanup triggered');
    
    this.clearExpiredCaches();
    this.cleanupUnusedComponents();
    this.optimizeImages();
    this.forceGarbageCollection();
  }

  triggerWarningCleanup() {
    console.log('💡 Warning memory cleanup triggered');
    
    this.clearExpiredCaches();
    this.cleanupOldMetrics();
    this.optimizeImages();
  }

  // Cache Management
  createCache(name, maxSize = 100, ttl = 300000) { // 5 minutes default TTL
    if (!this.caches.has(name)) {
      this.caches.set(name, {
        data: new Map(),
        maxSize,
        ttl,
        accessTimes: new Map()
      });
    }
    return this.caches.get(name);
  }

  setCache(cacheName, key, value) {
    const cache = this.createCache(cacheName);
    const now = Date.now();
    
    // Remove oldest entries if at max size
    if (cache.data.size >= cache.maxSize) {
      const oldestKey = [...cache.accessTimes.entries()]
        .sort((a, b) => a[1] - b[1])[0][0];
      cache.data.delete(oldestKey);
      cache.accessTimes.delete(oldestKey);
    }
    
    cache.data.set(key, { value, timestamp: now });
    cache.accessTimes.set(key, now);
  }

  getCache(cacheName, key) {
    const cache = this.caches.get(cacheName);
    if (!cache) {return null;}
    
    const entry = cache.data.get(key);
    if (!entry) {return null;}
    
    // Check TTL
    if (Date.now() - entry.timestamp > cache.ttl) {
      cache.data.delete(key);
      cache.accessTimes.delete(key);
      return null;
    }
    
    // Update access time
    cache.accessTimes.set(key, Date.now());
    return entry.value;
  }

  clearAllCaches() {
    this.caches.clear();
    console.log('🗑️ All caches cleared');
  }

  clearExpiredCaches() {
    const now = Date.now();
    let clearedCount = 0;
    
    for (const [name, cache] of this.caches) {
      for (const [key, entry] of cache.data) {
        if (now - entry.timestamp > cache.ttl) {
          cache.data.delete(key);
          cache.accessTimes.delete(key);
          clearedCount++;
        }
      }
    }
    
    if (clearedCount > 0) {
      console.log(`🗑️ Cleared ${clearedCount} expired cache entries`);
    }
  }

  // Component Management
  registerComponent(component, metadata = {}) {
    // Validate that component is a valid WeakMap key (must be an object)
    if (component === null || typeof component !== 'object') {
      console.warn('⚠️ Invalid component passed to registerComponent:', typeof component, component);
      return;
    }
    
    try {
      this.componentRefs.set(component, {
        ...metadata,
        registeredAt: Date.now(),
        lastAccessed: Date.now()
      });
    } catch (error) {
      console.warn('⚠️ Failed to register component:', error.message);
    }
  }

  unregisterComponent(component) {
    // Validate that component is a valid WeakMap key
    if (component === null || typeof component !== 'object') {
      return;
    }
    
    try {
      this.componentRefs.delete(component);
    } catch (error) {
      console.warn('⚠️ Failed to unregister component:', error.message);
    }
  }

  cleanupUnusedComponents() {
    // This would be implemented with React DevTools integration
    // For now, we'll focus on other cleanup strategies
    console.log('🧹 Component cleanup triggered');
  }

  // Event Listener Management
  addEventListenerTracked(element, event, handler, options) {
    const key = `${element.constructor.name}_${event}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, new Set());
    }
    
    this.eventListeners.get(key).add({ element, handler, options });
    element.addEventListener(event, handler, options);
  }

  removeEventListenerTracked(element, event, handler) {
    const key = `${element.constructor.name}_${event}`;
    const listeners = this.eventListeners.get(key);
    
    if (listeners) {
      for (const listener of listeners) {
        if (listener.element === element && listener.handler === handler) {
          listeners.delete(listener);
          element.removeEventListener(event, handler);
          break;
        }
      }
    }
  }

  clearEventListeners() {
    for (const [key, listeners] of this.eventListeners) {
      for (const { element, handler } of listeners) {
        try {
          element.removeEventListener(key.split('_')[1], handler);
        } catch (e) {
          // Ignore errors for removed elements
        }
      }
    }
    this.eventListeners.clear();
    console.log('🗑️ Event listeners cleared');
  }

  // Image Optimization
  optimizeImages() {
    const images = document.querySelectorAll('img');
    let optimizedCount = 0;
    
    images.forEach(img => {
      // Lazy load images not in viewport
      if (!this.isInViewport(img)) {
        if (!img.dataset.originalSrc) {
          img.dataset.originalSrc = img.src;
          img.src = this.createPlaceholderImage(img.width || 100, img.height || 100);
          optimizedCount++;
        }
      }
      
      // Add loading="lazy" if not present
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });
    
    if (optimizedCount > 0) {
      console.log(`🖼️ Optimized ${optimizedCount} images`);
    }
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  createPlaceholderImage(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();
  }

  // Heavy Features Management
  disableHeavyFeatures() {
    // Disable animations
    const style = document.createElement('style');
    style.id = 'memory-optimization-styles';
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
    
    // Disable console logging
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    };
    
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    
    console.log('🔇 Heavy features disabled');
  }

  enableHeavyFeatures() {
    // Re-enable animations
    const style = document.getElementById('memory-optimization-styles');
    if (style) {
      style.remove();
    }
    
    // Re-enable console logging
    if (this.originalConsole) {
      Object.assign(console, this.originalConsole);
      this.originalConsole = null;
    }
    
    console.log('🔊 Heavy features re-enabled');
  }

  // Garbage Collection
  forceGarbageCollection() {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear browser caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Clear storage if critically low on memory
    const memoryInfo = this.getMemoryInfo();
    if (memoryInfo.percentage > 90) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Ignore errors
      }
    }
    
    console.log('🗑️ Garbage collection forced');
  }

  // Performance Observers
  setupPerformanceObservers() {
    if (!window.PerformanceObserver) {return;}
    
    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`⚠️ Long task detected: ${entry.duration}ms`);
            this.triggerWarningCleanup();
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.add(longTaskObserver);
    } catch (e) {
      // Long task API not supported
    }
    
    // Monitor layout shifts
    try {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.value > 0.1) { // Significant layout shift
            console.warn(`⚠️ Layout shift detected: ${entry.value}`);
          }
        });
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.add(layoutShiftObserver);
    } catch (e) {
      // Layout shift API not supported
    }
  }

  // Cleanup Intervals
  setupCleanupIntervals() {
    // Cache cleanup every 5 minutes
    const cacheCleanup = setInterval(() => {
      this.clearExpiredCaches();
    }, 5 * 60 * 1000);
    this.timers.add(cacheCleanup);
    
    // Metrics cleanup every 10 minutes
    const metricsCleanup = setInterval(() => {
      this.cleanupOldMetrics();
    }, 10 * 60 * 1000);
    this.timers.add(metricsCleanup);
    
    // Image optimization every 2 minutes
    const imageOptimization = setInterval(() => {
      this.optimizeImages();
    }, 2 * 60 * 1000);
    this.timers.add(imageOptimization);
  }

  cleanupOldMetrics() {
    const cutoff = Date.now() - (30 * 60 * 1000); // 30 minutes
    
    this.performanceMetrics.memoryUsage = this.performanceMetrics.memoryUsage
      .filter(entry => entry.timestamp > cutoff);
    
    this.performanceMetrics.renderTimes = this.performanceMetrics.renderTimes
      .filter(entry => entry.timestamp > cutoff);
    
    this.performanceMetrics.componentCounts = this.performanceMetrics.componentCounts
      .filter(entry => entry.timestamp > cutoff);
  }

  // Emergency Handlers
  setupEmergencyHandlers() {
    // Handle memory pressure events
    if ('memory' in navigator) {
      navigator.memory.addEventListener?.('memorywarning', () => {
        this.triggerEmergencyCleanup();
      });
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.triggerWarningCleanup();
      }
    });
    
    // Handle before unload
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });
  }

  // Public API
  getMemoryStats() {
    return {
      memoryInfo: this.getMemoryInfo(),
      cacheCount: this.caches.size,
      eventListenerCount: Array.from(this.eventListeners.values())
        .reduce((total, set) => total + set.size, 0),
      performanceMetrics: this.performanceMetrics
    };
  }

  // Cleanup and Destroy
  destroy() {
    this.isRunning = false;
    
    // Clear all timers
    this.timers.forEach(timer => clearInterval(timer));
    this.timers.clear();
    
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Clear caches
    this.clearAllCaches();
    
    // Clear event listeners
    this.clearEventListeners();
    
    console.log('🧠 Advanced Memory Manager destroyed');
  }
}

// Create singleton instance
const advancedMemoryManager = new AdvancedMemoryManager();

// Export utilities for React components
export const useMemoryOptimization = () => {
  const registerComponent = (component, metadata) => {
    advancedMemoryManager.registerComponent(component, metadata);
  };
  
  const unregisterComponent = (component) => {
    advancedMemoryManager.unregisterComponent(component);
  };
  
  const createCache = (name, maxSize, ttl) => {
    return advancedMemoryManager.createCache(name, maxSize, ttl);
  };
  
  const setCache = (cacheName, key, value) => {
    advancedMemoryManager.setCache(cacheName, key, value);
  };
  
  const getCache = (cacheName, key) => {
    return advancedMemoryManager.getCache(cacheName, key);
  };
  
  return {
    registerComponent,
    unregisterComponent,
    createCache,
    setCache,
    getCache,
    getMemoryStats: () => advancedMemoryManager.getMemoryStats()
  };
};

export default advancedMemoryManager; 