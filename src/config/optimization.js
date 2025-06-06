// System Optimization Configuration
export const OPTIMIZATION_CONFIG = {
  // Performance thresholds
  PERFORMANCE: {
    MAX_MEMORY_USAGE: 80, // percentage
    MAX_RENDER_TIME: 1000, // milliseconds
    MAX_BUNDLE_SIZE: 500, // KB
    CACHE_EXPIRY: 5 * 60 * 1000, // 5 minutes
    DEBOUNCE_DELAY: 300, // milliseconds
    THROTTLE_DELAY: 100, // milliseconds
  },

  // Lazy loading configuration
  LAZY_LOADING: {
    ENABLED: true,
    INTERSECTION_THRESHOLD: 0.1,
    ROOT_MARGIN: '50px',
    PRELOAD_CRITICAL: true,
  },

  // Caching strategy
  CACHING: {
    ENABLED: true,
    MAX_CACHE_SIZE: 50, // number of items
    CACHE_STRATEGIES: {
      FINANCIAL_DATA: 5 * 60 * 1000, // 5 minutes
      SEARCH_RESULTS: 2 * 60 * 1000, // 2 minutes
      USER_PREFERENCES: 30 * 60 * 1000, // 30 minutes
      STATIC_DATA: 60 * 60 * 1000, // 1 hour
    }
  },

  // Network optimization
  NETWORK: {
    REQUEST_TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    CONCURRENT_REQUESTS: 6,
    ENABLE_COMPRESSION: true,
  },

  // Image optimization
  IMAGES: {
    LAZY_LOAD: true,
    WEBP_SUPPORT: true,
    PLACEHOLDER_BLUR: true,
    MAX_WIDTH: 1920,
    QUALITY: 85,
  },

  // Bundle optimization
  BUNDLE: {
    CODE_SPLITTING: true,
    TREE_SHAKING: true,
    MINIFICATION: true,
    COMPRESSION: true,
    ANALYZE_BUNDLE: false, // Set to true for bundle analysis
  },

  // Development settings
  DEVELOPMENT: {
    PERFORMANCE_MONITOR: true,
    CONSOLE_WARNINGS: true,
    MEMORY_LEAK_DETECTION: true,
    RENDER_PROFILING: false,
  },

  // Production settings
  PRODUCTION: {
    PERFORMANCE_MONITOR: false,
    CONSOLE_WARNINGS: false,
    MEMORY_LEAK_DETECTION: false,
    RENDER_PROFILING: false,
    SERVICE_WORKER: true,
  }
};

// Environment-specific configuration
export const getOptimizationConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseConfig = OPTIMIZATION_CONFIG;
  
  if (isDevelopment) {
    return {
      ...baseConfig,
      ...baseConfig.DEVELOPMENT,
    };
  }
  
  return {
    ...baseConfig,
    ...baseConfig.PRODUCTION,
  };
};

// Performance monitoring utilities
export const PERFORMANCE_METRICS = {
  // Core Web Vitals thresholds
  CORE_WEB_VITALS: {
    LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
    FID: { good: 100, poor: 300 },   // First Input Delay
    CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  },

  // Custom metrics
  CUSTOM_METRICS: {
    INITIAL_LOAD: { good: 3000, poor: 5000 },
    ROUTE_CHANGE: { good: 500, poor: 1000 },
    API_RESPONSE: { good: 1000, poor: 3000 },
    SEARCH_RESPONSE: { good: 300, poor: 800 },
  }
};

// Memory management utilities
export const MEMORY_MANAGEMENT = {
  // Cleanup intervals
  CLEANUP_INTERVALS: {
    CACHE_CLEANUP: 10 * 60 * 1000, // 10 minutes
    EVENT_LISTENER_CLEANUP: 5 * 60 * 1000, // 5 minutes
    COMPONENT_CLEANUP: 1 * 60 * 1000, // 1 minute
  },

  // Memory thresholds
  THRESHOLDS: {
    WARNING: 70, // percentage
    CRITICAL: 85, // percentage
    CLEANUP_TRIGGER: 80, // percentage
  },

  // Cleanup strategies
  STRATEGIES: {
    AGGRESSIVE_CLEANUP: false,
    LAZY_CLEANUP: true,
    SCHEDULED_CLEANUP: true,
  }
};

export default OPTIMIZATION_CONFIG; 