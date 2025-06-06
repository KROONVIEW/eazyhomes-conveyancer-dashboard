// Performance Monitoring Component
import React, { useEffect, useState, useRef } from 'react';
import { FiActivity, FiCpu, FiHardDrive, FiWifi, FiX } from 'react-icons/fi';

const PerformanceMonitor = ({ enabled = process.env.NODE_ENV === 'development' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    memory: { used: 0, total: 0, percentage: 0 },
    renderTime: 0,
    bundleSize: 0,
    networkRequests: 0,
    errors: 0
  });
  const [performanceEntries, setPerformanceEntries] = useState([]);
  const renderStartTime = useRef(performance.now());
  const [fps, setFps] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef();

  // Monitor performance metrics
  useEffect(() => {
    if (!enabled) return;

    const updateMetrics = () => {
      // Memory usage (if available)
      if (performance.memory) {
        const memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          percentage: Math.round((performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100)
        };
        
        setMetrics(prev => ({ ...prev, memory }));
      }

      // Render time (reset to current measurement)
      const renderTime = performance.now() - renderStartTime.current;
      renderStartTime.current = performance.now(); // Reset for next measurement
      setMetrics(prev => ({ ...prev, renderTime: Math.min(renderTime, 1000) })); // Cap at 1000ms

      // Performance entries
      const entries = performance.getEntriesByType('navigation');
      setPerformanceEntries(entries);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, [enabled]);

  // Monitor network requests
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const networkRequests = entries.filter(entry => 
        entry.entryType === 'resource' && 
        (entry.name.includes('api') || entry.name.includes('fetch'))
      ).length;
      
      setMetrics(prev => ({ 
        ...prev, 
        networkRequests: prev.networkRequests + networkRequests 
      }));
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  // Monitor errors
  useEffect(() => {
    const handleError = () => {
      setMetrics(prev => ({ ...prev, errors: prev.errors + 1 }));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  // Get performance grade (optimized thresholds)
  const getPerformanceGrade = () => {
    const { memory, renderTime, errors } = metrics;
    let score = 100;

    // More lenient memory usage scoring
    if (memory.percentage > 95) score -= 30;
    else if (memory.percentage > 85) score -= 15;
    else if (memory.percentage > 75) score -= 5;

    // More lenient render time scoring (capped at 1000ms)
    const cappedRenderTime = Math.min(renderTime, 1000);
    if (cappedRenderTime > 800) score -= 15;
    else if (cappedRenderTime > 500) score -= 8;
    else if (cappedRenderTime > 200) score -= 3;

    // Deduct points for errors
    score -= errors * 3; // Reduced penalty

    // More lenient grading scale
    if (score >= 85) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 55) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const performanceGrade = getPerformanceGrade();

  useEffect(() => {
    if (!enabled) return;

    const updatePerformanceMetrics = () => {
      const now = performance.now();
      frameCountRef.current++;

      // Calculate FPS every second
      if (now - lastTimeRef.current >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setFps(currentFps);
        
        // Get memory usage if available
        if (performance.memory) {
          const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
          setMemoryUsage(memoryMB);
        }

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(updatePerformanceMetrics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePerformanceMetrics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  const getFpsColor = (fps) => {
    if (fps >= 55) return '#4CAF50'; // Green - Excellent
    if (fps >= 45) return '#FFC107'; // Yellow - Good
    if (fps >= 30) return '#FF9800'; // Orange - Acceptable
    return '#F44336'; // Red - Poor
  };

  const getPerformanceStatus = (fps) => {
    if (fps >= 55) return 'EXCELLENT';
    if (fps >= 45) return 'GOOD';
    if (fps >= 30) return 'ACCEPTABLE';
    return 'POOR';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 left-4 w-12 h-12 ${performanceGrade.bg} ${performanceGrade.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 font-bold text-sm`}
        title="Performance Monitor"
      >
        {performanceGrade.grade}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm flex items-center">
          <FiActivity className="w-4 h-4 mr-2 text-blue-600" />
          Performance Monitor
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Performance Grade */}
      <div className={`${performanceGrade.bg} ${performanceGrade.color} rounded-lg p-3 mb-4 text-center`}>
        <div className="text-2xl font-bold">{performanceGrade.grade}</div>
        <div className="text-xs">Performance Grade</div>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        {/* Memory Usage */}
        <div className="bg-gray-50 p-3 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700 flex items-center">
              <FiCpu className="w-3 h-3 mr-1" />
              Memory Usage
            </span>
            <span className="text-xs text-gray-600">
              {metrics.memory.used}MB / {metrics.memory.total}MB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                metrics.memory.percentage > 80 ? 'bg-red-500' :
                metrics.memory.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${metrics.memory.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{metrics.memory.percentage}%</div>
        </div>

        {/* Render Performance */}
        <div className="bg-gray-50 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 flex items-center">
              <FiHardDrive className="w-3 h-3 mr-1" />
              Render Time
            </span>
            <span className={`text-xs ${
              metrics.renderTime > 3000 ? 'text-red-600' :
              metrics.renderTime > 1000 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {metrics.renderTime}ms
            </span>
          </div>
        </div>

        {/* Network Requests */}
        <div className="bg-gray-50 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 flex items-center">
              <FiWifi className="w-3 h-3 mr-1" />
              Network Requests
            </span>
            <span className="text-xs text-gray-600">{metrics.networkRequests}</span>
          </div>
        </div>

        {/* Errors */}
        <div className="bg-gray-50 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              JavaScript Errors
            </span>
            <span className={`text-xs ${metrics.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {metrics.errors}
            </span>
          </div>
        </div>

        {/* Performance Entries */}
        {performanceEntries.length > 0 && (
          <div className="bg-gray-50 p-3 rounded">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Navigation Timing</h4>
            <div className="space-y-1 text-xs text-gray-600">
              {performanceEntries.slice(0, 1).map((entry, index) => (
                <div key={index}>
                  <div>DOM Load: {Math.round(entry.domContentLoadedEventEnd - entry.navigationStart)}ms</div>
                  <div>Page Load: {Math.round(entry.loadEventEnd - entry.navigationStart)}ms</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimization Tips */}
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="text-xs font-medium text-blue-800 mb-2">💡 Optimization Tips</h4>
          <div className="space-y-1 text-xs text-blue-700">
            {metrics.memory.percentage > 80 && (
              <div>• High memory usage detected - consider lazy loading</div>
            )}
            {metrics.renderTime > 3000 && (
              <div>• Slow render time - check for heavy computations</div>
            )}
            {metrics.errors > 0 && (
              <div>• JavaScript errors detected - check console</div>
            )}
            {metrics.memory.percentage <= 60 && metrics.renderTime <= 1000 && metrics.errors === 0 && (
              <div>• Performance is optimal! 🚀</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '4px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: getFpsColor(fps),
            animation: fps < 30 ? 'blink 1s infinite' : 'none'
          }} />
          <span style={{ color: getFpsColor(fps), fontWeight: 'bold' }}>
            {fps} FPS
          </span>
        </div>
        
        <div style={{ fontSize: '10px', color: '#ccc', marginBottom: '2px' }}>
          Status: <span style={{ color: getFpsColor(fps) }}>
            {getPerformanceStatus(fps)}
          </span>
        </div>
        
        {memoryUsage > 0 && (
          <div style={{ fontSize: '10px', color: '#ccc' }}>
            Memory: {memoryUsage}MB
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default PerformanceMonitor; 