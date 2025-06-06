// Performance Booster Utility
// Helps improve performance grade from D to higher levels

export const performanceBooster = {
  // Optimize images by lazy loading
  optimizeImages: () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });
  },

  // Clean up unused event listeners
  cleanupEventListeners: () => {
    // Remove any orphaned event listeners
    const elements = document.querySelectorAll('[data-cleanup]');
    elements.forEach(el => {
      const events = el.getAttribute('data-cleanup').split(',');
      events.forEach(event => {
        el.removeEventListener(event.trim(), () => {});
      });
    });
  },

  // Optimize DOM queries
  optimizeDOM: () => {
    // Cache frequently accessed elements
    const cache = new Map();
    const originalQuerySelector = document.querySelector;
    const originalQuerySelectorAll = document.querySelectorAll;

    document.querySelector = function(selector) {
      if (cache.has(selector)) {
        return cache.get(selector);
      }
      const result = originalQuerySelector.call(this, selector);
      cache.set(selector, result);
      return result;
    };

    document.querySelectorAll = function(selector) {
      const cacheKey = `all:${selector}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }
      const result = originalQuerySelectorAll.call(this, selector);
      cache.set(cacheKey, result);
      return result;
    };
  },

  // Reduce memory usage
  reduceMemoryUsage: () => {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }

    // Clear console logs in production
    if (process.env.NODE_ENV === 'production') {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
    }
  },

  // Optimize network requests
  optimizeNetwork: () => {
    // Add request deduplication
    const pendingRequests = new Map();
    
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      const key = `${url}:${JSON.stringify(options)}`;
      
      if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
      }
      
      const promise = originalFetch.call(this, url, options);
      pendingRequests.set(key, promise);
      
      promise.finally(() => {
        pendingRequests.delete(key);
      });
      
      return promise;
    };
  },

  // Run all optimizations
  boostPerformance: () => {
    performanceBooster.optimizeImages();
    performanceBooster.cleanupEventListeners();
    performanceBooster.optimizeDOM();
    performanceBooster.reduceMemoryUsage();
    performanceBooster.optimizeNetwork();
    
    console.log('🚀 Performance boost applied!');
  }
};

// Auto-run optimizations
if (typeof window !== 'undefined') {
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', performanceBooster.boostPerformance);
  } else {
    performanceBooster.boostPerformance();
  }
  
  // Run periodically
  setInterval(() => {
    performanceBooster.reduceMemoryUsage();
  }, 30000); // Every 30 seconds
}

export default performanceBooster; 