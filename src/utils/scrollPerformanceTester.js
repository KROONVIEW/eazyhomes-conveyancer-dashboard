/**
 * Scroll Performance Testing Utility
 * Comprehensive testing suite for messaging tab scroll optimization
 */

class ScrollPerformanceTester {
  constructor() {
    this.metrics = {
      scrollEvents: 0,
      frameDrops: 0,
      averageFrameTime: 0,
      maxFrameTime: 0,
      minFrameTime: Infinity,
      totalScrollTime: 0,
      memoryUsage: [],
      scrollPositions: [],
      timestamps: []
    };
    
    this.isRecording = false;
    this.startTime = 0;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.observer = null;
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(container) {
    if (this.isRecording) {
      console.warn('Performance monitoring already active');
      return;
    }

    this.isRecording = true;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.frameCount = 0;
    
    console.log('🚀 Starting scroll performance monitoring...');
    
    // Reset metrics
    this.resetMetrics();
    
    // Monitor scroll events
    this.monitorScrollEvents(container);
    
    // Monitor frame rate
    this.monitorFrameRate();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor layout shifts
    this.monitorLayoutShifts();
    
    return this;
  }

  /**
   * Stop performance monitoring and generate report
   */
  stopMonitoring() {
    if (!this.isRecording) {
      console.warn('Performance monitoring not active');
      return null;
    }

    this.isRecording = false;
    const endTime = performance.now();
    this.metrics.totalScrollTime = endTime - this.startTime;
    
    // Cleanup observers
    if (this.observer) {
      this.observer.disconnect();
    }
    
    console.log('⏹️ Stopping scroll performance monitoring...');
    
    return this.generateReport();
  }

  /**
   * Reset all metrics
   */
  resetMetrics() {
    this.metrics = {
      scrollEvents: 0,
      frameDrops: 0,
      averageFrameTime: 0,
      maxFrameTime: 0,
      minFrameTime: Infinity,
      totalScrollTime: 0,
      memoryUsage: [],
      scrollPositions: [],
      timestamps: [],
      layoutShifts: 0,
      longTasks: 0
    };
  }

  /**
   * Monitor scroll events
   */
  monitorScrollEvents(container) {
    if (!container) {return;}

    const scrollHandler = (e) => {
      if (!this.isRecording) {return;}
      
      const timestamp = performance.now();
      const scrollTop = e.target.scrollTop;
      
      this.metrics.scrollEvents++;
      this.metrics.scrollPositions.push(scrollTop);
      this.metrics.timestamps.push(timestamp);
      
      // Check for scroll performance issues
      if (this.metrics.timestamps.length > 1) {
        const timeDiff = timestamp - this.metrics.timestamps[this.metrics.timestamps.length - 2];
        if (timeDiff > 16.67) { // Slower than 60fps
          this.metrics.frameDrops++;
        }
      }
    };

    container.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Cleanup function
    this.cleanupScrollHandler = () => {
      container.removeEventListener('scroll', scrollHandler);
    };
  }

  /**
   * Monitor frame rate using requestAnimationFrame
   */
  monitorFrameRate() {
    const frameCallback = (timestamp) => {
      if (!this.isRecording) {return;}
      
      if (this.lastFrameTime > 0) {
        const frameTime = timestamp - this.lastFrameTime;
        
        // Update frame metrics
        this.metrics.maxFrameTime = Math.max(this.metrics.maxFrameTime, frameTime);
        this.metrics.minFrameTime = Math.min(this.metrics.minFrameTime, frameTime);
        
        // Calculate running average
        this.frameCount++;
        this.metrics.averageFrameTime = 
          (this.metrics.averageFrameTime * (this.frameCount - 1) + frameTime) / this.frameCount;
        
        // Detect frame drops (>16.67ms = <60fps)
        if (frameTime > 16.67) {
          this.metrics.frameDrops++;
        }
      }
      
      this.lastFrameTime = timestamp;
      requestAnimationFrame(frameCallback);
    };

    requestAnimationFrame(frameCallback);
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage() {
    const memoryInterval = setInterval(() => {
      if (!this.isRecording) {
        clearInterval(memoryInterval);
        return;
      }
      
      if (performance.memory) {
        this.metrics.memoryUsage.push({
          timestamp: performance.now(),
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        });
      }
    }, 1000); // Check every second
  }

  /**
   * Monitor layout shifts using PerformanceObserver
   */
  monitorLayoutShifts() {
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((list) => {
          if (!this.isRecording) {return;}
          
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              this.metrics.layoutShifts += entry.value;
            } else if (entry.entryType === 'longtask') {
              this.metrics.longTasks++;
            }
          }
        });

        this.observer.observe({ entryTypes: ['layout-shift', 'longtask'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport() {
    const report = {
      summary: this.generateSummary(),
      detailed: this.generateDetailedMetrics(),
      recommendations: this.generateRecommendations(),
      timestamp: new Date().toISOString()
    };

    console.log('📊 Scroll Performance Report:', report);
    return report;
  }

  /**
   * Generate performance summary
   */
  generateSummary() {
    const avgFPS = this.metrics.averageFrameTime > 0 ? 1000 / this.metrics.averageFrameTime : 0;
    const frameDropPercentage = this.frameCount > 0 ? (this.metrics.frameDrops / this.frameCount) * 100 : 0;
    
    return {
      duration: `${(this.metrics.totalScrollTime / 1000).toFixed(2)}s`,
      averageFPS: Math.round(avgFPS),
      frameDrops: this.metrics.frameDrops,
      frameDropPercentage: `${frameDropPercentage.toFixed(2)}%`,
      scrollEvents: this.metrics.scrollEvents,
      layoutShifts: this.metrics.layoutShifts.toFixed(4),
      longTasks: this.metrics.longTasks,
      performance: this.getPerformanceGrade(avgFPS, frameDropPercentage)
    };
  }

  /**
   * Generate detailed metrics
   */
  generateDetailedMetrics() {
    const memoryStats = this.calculateMemoryStats();
    
    return {
      frameMetrics: {
        average: `${this.metrics.averageFrameTime.toFixed(2)}ms`,
        max: `${this.metrics.maxFrameTime.toFixed(2)}ms`,
        min: `${this.metrics.minFrameTime.toFixed(2)}ms`,
        total: this.frameCount
      },
      scrollMetrics: {
        totalEvents: this.metrics.scrollEvents,
        positions: this.metrics.scrollPositions.length,
        smoothness: this.calculateScrollSmoothness()
      },
      memoryMetrics: memoryStats,
      performanceEntries: {
        layoutShifts: this.metrics.layoutShifts,
        longTasks: this.metrics.longTasks
      }
    };
  }

  /**
   * Calculate memory statistics
   */
  calculateMemoryStats() {
    if (this.metrics.memoryUsage.length === 0) {
      return { available: false };
    }

    const initial = this.metrics.memoryUsage[0];
    const final = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
    const peak = Math.max(...this.metrics.memoryUsage.map(m => m.used));

    return {
      initial: `${(initial.used / 1024 / 1024).toFixed(2)} MB`,
      final: `${(final.used / 1024 / 1024).toFixed(2)} MB`,
      peak: `${(peak / 1024 / 1024).toFixed(2)} MB`,
      growth: `${((final.used - initial.used) / 1024 / 1024).toFixed(2)} MB`,
      available: true
    };
  }

  /**
   * Calculate scroll smoothness score
   */
  calculateScrollSmoothness() {
    if (this.metrics.timestamps.length < 2) {return 'N/A';}
    
    let smoothEvents = 0;
    for (let i = 1; i < this.metrics.timestamps.length; i++) {
      const timeDiff = this.metrics.timestamps[i] - this.metrics.timestamps[i - 1];
      if (timeDiff <= 16.67) { // 60fps or better
        smoothEvents++;
      }
    }
    
    const smoothnessPercentage = (smoothEvents / (this.metrics.timestamps.length - 1)) * 100;
    return `${smoothnessPercentage.toFixed(1)}%`;
  }

  /**
   * Get performance grade
   */
  getPerformanceGrade(avgFPS, frameDropPercentage) {
    if (avgFPS >= 55 && frameDropPercentage < 5) {return 'A+ (Excellent)';}
    if (avgFPS >= 45 && frameDropPercentage < 10) {return 'A (Very Good)';}
    if (avgFPS >= 35 && frameDropPercentage < 20) {return 'B (Good)';}
    if (avgFPS >= 25 && frameDropPercentage < 30) {return 'C (Fair)';}
    return 'D (Poor)';
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    const summary = this.generateSummary();
    
    if (summary.averageFPS < 45) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Low frame rate detected',
        solution: 'Implement virtual scrolling or reduce DOM complexity'
      });
    }
    
    if (parseFloat(summary.frameDropPercentage) > 15) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Frequent frame drops',
        solution: 'Optimize scroll event handlers and reduce layout thrashing'
      });
    }
    
    if (this.metrics.layoutShifts > 0.1) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Layout shifts detected',
        solution: 'Ensure consistent element sizing and positioning'
      });
    }
    
    if (this.metrics.longTasks > 5) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Long tasks blocking main thread',
        solution: 'Break up large operations and use requestIdleCallback'
      });
    }
    
    const memoryStats = this.calculateMemoryStats();
    if (memoryStats.available && parseFloat(memoryStats.growth) > 10) {
      recommendations.push({
        priority: 'LOW',
        issue: 'Memory usage growth detected',
        solution: 'Check for memory leaks and optimize component cleanup'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'INFO',
        issue: 'No major issues detected',
        solution: 'Performance is within acceptable ranges'
      });
    }
    
    return recommendations;
  }

  /**
   * Export metrics to JSON
   */
  exportMetrics() {
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.isRecording = false;
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.cleanupScrollHandler) {
      this.cleanupScrollHandler();
    }
  }
}

// Utility functions for easy testing
export const testScrollPerformance = (container, duration = 10000) => {
  const tester = new ScrollPerformanceTester();
  
  console.log(`🧪 Starting ${duration/1000}s scroll performance test...`);
  
  tester.startMonitoring(container);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const report = tester.stopMonitoring();
      tester.cleanup();
      resolve(report);
    }, duration);
  });
};

export const quickScrollTest = (container) => {
  return testScrollPerformance(container, 5000); // 5 second test
};

export default ScrollPerformanceTester; 