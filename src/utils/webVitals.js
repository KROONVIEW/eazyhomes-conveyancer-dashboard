import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Web Vitals thresholds (Google's recommended values)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
};

// Function to send metrics to analytics (replace with your analytics service)
function sendToAnalytics(metric) {
  // In production, send to your analytics service
  console.log('Web Vitals Metric:', metric);
  
  // Example: Send to Google Analytics
  // gtag('event', metric.name, {
  //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //   event_category: 'Web Vitals',
  //   event_label: metric.id,
  //   non_interaction: true,
  // });
}

// Function to get performance rating
function getPerformanceRating(metricName, value) {
  const threshold = THRESHOLDS[metricName];
  if (!threshold) {return 'unknown';}
  
  if (value <= threshold.good) {return 'good';}
  if (value <= threshold.poor) {return 'needs-improvement';}
  return 'poor';
}

// Enhanced metric reporting with performance insights
function reportMetric(metric) {
  const rating = getPerformanceRating(metric.name, metric.value);
  
  const enhancedMetric = {
    ...metric,
    rating,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    connectionType: navigator.connection?.effectiveType || 'unknown'
  };
  
  sendToAnalytics(enhancedMetric);
  
  // Log performance issues in development
  if (process.env.NODE_ENV === 'development') {
    if (rating === 'poor') {
      console.warn(`⚠️ Poor ${metric.name} performance:`, {
        value: metric.value,
        threshold: THRESHOLDS[metric.name],
        suggestions: getPerformanceSuggestions(metric.name)
      });
    }
  }
}

// Performance improvement suggestions
function getPerformanceSuggestions(metricName) {
  const suggestions = {
    CLS: [
      'Add size attributes to images and videos',
      'Avoid inserting content above existing content',
      'Use CSS transforms instead of changing layout properties'
    ],
    INP: [
      'Reduce JavaScript execution time',
      'Break up long tasks',
      'Use web workers for heavy computations'
    ],
    FCP: [
      'Reduce server response times',
      'Eliminate render-blocking resources',
      'Minify CSS and JavaScript'
    ],
    LCP: [
      'Optimize images and videos',
      'Preload important resources',
      'Reduce server response times'
    ],
    TTFB: [
      'Use a CDN',
      'Optimize server performance',
      'Use service workers for caching'
    ]
  };
  
  return suggestions[metricName] || [];
}

// Main function to initialize Web Vitals monitoring
export function initWebVitals() {
  onCLS(reportMetric);
  onINP(reportMetric);
  onFCP(reportMetric);
  onLCP(reportMetric);
  onTTFB(reportMetric);
}

// Function to manually report custom metrics
export function reportCustomMetric(name, value, unit = 'ms') {
  const metric = {
    name,
    value,
    unit,
    id: `${name}-${Date.now()}`,
    timestamp: Date.now()
  };
  
  sendToAnalytics(metric);
}

// Performance monitoring for React components
export function measureComponentPerformance(componentName, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  reportCustomMetric(`component-${componentName}`, end - start);
  
  return result;
}

export default initWebVitals; 