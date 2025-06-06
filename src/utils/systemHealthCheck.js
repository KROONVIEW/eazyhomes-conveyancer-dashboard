// System Health Check Utility
import { OPTIMIZATION_CONFIG, PERFORMANCE_METRICS } from '../config/optimization';

class SystemHealthCheck {
  constructor() {
    this.healthMetrics = {
      performance: { score: 0, issues: [] },
      memory: { score: 0, issues: [] },
      network: { score: 0, issues: [] },
      errors: { score: 0, issues: [] },
      overall: { score: 0, grade: 'F' }
    };
    
    this.isRunning = false;
    this.checkInterval = null;
  }

  // Start continuous health monitoring
  startMonitoring(interval = 30000) { // 30 seconds
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.runHealthCheck();
    
    this.checkInterval = setInterval(() => {
      this.runHealthCheck();
    }, interval);
    
    console.log('🏥 System health monitoring started');
  }

  // Stop health monitoring
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
    console.log('🏥 System health monitoring stopped');
  }

  // Run comprehensive health check
  async runHealthCheck() {
    try {
      // Reset metrics
      this.resetMetrics();
      
      // Run individual checks
      await this.checkPerformance();
      await this.checkMemoryUsage();
      await this.checkNetworkHealth();
      await this.checkErrorRate();
      
      // Calculate overall score
      this.calculateOverallScore();
      
      // Log results
      this.logHealthReport();
      
      return this.healthMetrics;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return null;
    }
  }

  // Reset all metrics
  resetMetrics() {
    Object.keys(this.healthMetrics).forEach(key => {
      if (key !== 'overall') {
        this.healthMetrics[key] = { score: 0, issues: [] };
      }
    });
  }

  // Check performance metrics
  async checkPerformance() {
    const metrics = this.healthMetrics.performance;
    let score = 100;

    try {
      // Check Core Web Vitals if available
      if (window.performance && window.performance.getEntriesByType) {
        const navigationEntries = window.performance.getEntriesByType('navigation');
        
        if (navigationEntries.length > 0) {
          const entry = navigationEntries[0];
          
          // Check page load time
          const loadTime = entry.loadEventEnd - entry.navigationStart;
          if (loadTime > PERFORMANCE_METRICS.CUSTOM_METRICS.INITIAL_LOAD.poor) {
            score -= 30;
            metrics.issues.push(`Slow page load: ${Math.round(loadTime)}ms`);
          } else if (loadTime > PERFORMANCE_METRICS.CUSTOM_METRICS.INITIAL_LOAD.good) {
            score -= 15;
            metrics.issues.push(`Moderate page load: ${Math.round(loadTime)}ms`);
          }

          // Check DOM content loaded time
          const domLoadTime = entry.domContentLoadedEventEnd - entry.navigationStart;
          if (domLoadTime > 3000) {
            score -= 20;
            metrics.issues.push(`Slow DOM load: ${Math.round(domLoadTime)}ms`);
          }
        }
      }

      // Check for long tasks
      if (window.PerformanceObserver) {
        const longTasks = window.performance.getEntriesByType('longtask');
        if (longTasks.length > 5) {
          score -= 25;
          metrics.issues.push(`${longTasks.length} long tasks detected`);
        }
      }

      // Check bundle size (approximate)
      const scripts = document.querySelectorAll('script[src]');
      let totalScriptSize = 0;
      scripts.forEach(script => {
        if (script.src.includes('static/js/')) {
          totalScriptSize += 500; // Approximate size in KB
        }
      });

      if (totalScriptSize > OPTIMIZATION_CONFIG.PERFORMANCE.MAX_BUNDLE_SIZE * 2) {
        score -= 20;
        metrics.issues.push(`Large bundle size: ~${totalScriptSize}KB`);
      }

    } catch (error) {
      score -= 10;
      metrics.issues.push('Performance check failed');
    }

    metrics.score = Math.max(0, score);
  }

  // Check memory usage
  async checkMemoryUsage() {
    const metrics = this.healthMetrics.memory;
    let score = 100;

    try {
      if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        const percentage = Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100);

        if (percentage > OPTIMIZATION_CONFIG.PERFORMANCE.MAX_MEMORY_USAGE) {
          score -= 40;
          metrics.issues.push(`High memory usage: ${percentage}% (${usedMB}MB)`);
        } else if (percentage > 60) {
          score -= 20;
          metrics.issues.push(`Moderate memory usage: ${percentage}% (${usedMB}MB)`);
        }

        // Check for memory leaks (increasing usage over time)
        if (!this.previousMemoryUsage) {
          this.previousMemoryUsage = usedMB;
        } else {
          const memoryIncrease = usedMB - this.previousMemoryUsage;
          if (memoryIncrease > 10) { // More than 10MB increase
            score -= 15;
            metrics.issues.push(`Potential memory leak: +${memoryIncrease}MB`);
          }
          this.previousMemoryUsage = usedMB;
        }
      } else {
        metrics.issues.push('Memory monitoring not available');
      }
    } catch (error) {
      score -= 10;
      metrics.issues.push('Memory check failed');
    }

    metrics.score = Math.max(0, score);
  }

  // Check network health
  async checkNetworkHealth() {
    const metrics = this.healthMetrics.network;
    let score = 100;

    try {
      // Check connection type if available
      if (navigator.connection) {
        const connection = navigator.connection;
        
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          score -= 30;
          metrics.issues.push(`Slow connection: ${connection.effectiveType}`);
        } else if (connection.effectiveType === '3g') {
          score -= 15;
          metrics.issues.push(`Moderate connection: ${connection.effectiveType}`);
        }

        if (connection.saveData) {
          metrics.issues.push('Data saver mode enabled');
        }
      }

      // Check for failed network requests
      const resourceEntries = window.performance.getEntriesByType('resource');
      const failedRequests = resourceEntries.filter(entry => 
        entry.transferSize === 0 && entry.decodedBodySize === 0
      );

      if (failedRequests.length > 0) {
        score -= failedRequests.length * 5;
        metrics.issues.push(`${failedRequests.length} failed network requests`);
      }

      // Check for slow API responses
      const apiRequests = resourceEntries.filter(entry => 
        entry.name.includes('/api/') || entry.name.includes('fetch')
      );

      const slowRequests = apiRequests.filter(entry => 
        entry.duration > PERFORMANCE_METRICS.CUSTOM_METRICS.API_RESPONSE.poor
      );

      if (slowRequests.length > 0) {
        score -= slowRequests.length * 10;
        metrics.issues.push(`${slowRequests.length} slow API requests`);
      }

    } catch (error) {
      score -= 10;
      metrics.issues.push('Network check failed');
    }

    metrics.score = Math.max(0, score);
  }

  // Check error rate
  async checkErrorRate() {
    const metrics = this.healthMetrics.errors;
    let score = 100;

    try {
      // Check for JavaScript errors
      if (!this.errorCount) this.errorCount = 0;
      
      // Set up error listeners if not already done
      if (!this.errorListenersSet) {
        window.addEventListener('error', () => this.errorCount++);
        window.addEventListener('unhandledrejection', () => this.errorCount++);
        this.errorListenersSet = true;
      }

      if (this.errorCount > 0) {
        score -= this.errorCount * 20;
        metrics.issues.push(`${this.errorCount} JavaScript errors`);
      }

      // Check console errors (if available)
      const consoleErrors = this.getConsoleErrors();
      if (consoleErrors > 0) {
        score -= consoleErrors * 10;
        metrics.issues.push(`${consoleErrors} console errors`);
      }

    } catch (error) {
      score -= 10;
      metrics.issues.push('Error check failed');
    }

    metrics.score = Math.max(0, score);
  }

  // Get console error count (mock implementation)
  getConsoleErrors() {
    // This would need to be implemented with console override
    return 0;
  }

  // Calculate overall health score
  calculateOverallScore() {
    const scores = [
      this.healthMetrics.performance.score,
      this.healthMetrics.memory.score,
      this.healthMetrics.network.score,
      this.healthMetrics.errors.score
    ];

    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    this.healthMetrics.overall.score = Math.round(averageScore);

    // Assign grade
    if (averageScore >= 90) this.healthMetrics.overall.grade = 'A';
    else if (averageScore >= 80) this.healthMetrics.overall.grade = 'B';
    else if (averageScore >= 70) this.healthMetrics.overall.grade = 'C';
    else if (averageScore >= 60) this.healthMetrics.overall.grade = 'D';
    else this.healthMetrics.overall.grade = 'F';
  }

  // Log health report
  logHealthReport() {
    const { overall, performance, memory, network, errors } = this.healthMetrics;
    
    console.group(`🏥 System Health Report - Grade: ${overall.grade} (${overall.score}/100)`);
    
    console.log(`📊 Performance: ${performance.score}/100`, performance.issues.length > 0 ? performance.issues : '✅ Good');
    console.log(`🧠 Memory: ${memory.score}/100`, memory.issues.length > 0 ? memory.issues : '✅ Good');
    console.log(`🌐 Network: ${network.score}/100`, network.issues.length > 0 ? network.issues : '✅ Good');
    console.log(`❌ Errors: ${errors.score}/100`, errors.issues.length > 0 ? errors.issues : '✅ Good');
    
    console.groupEnd();

    // Emit health status event
    window.dispatchEvent(new CustomEvent('systemHealthUpdate', {
      detail: this.healthMetrics
    }));
  }

  // Get current health status
  getHealthStatus() {
    return this.healthMetrics;
  }

  // Get health recommendations
  getRecommendations() {
    const recommendations = [];
    
    if (this.healthMetrics.performance.score < 80) {
      recommendations.push('Consider implementing lazy loading for heavy components');
      recommendations.push('Optimize bundle size with code splitting');
    }
    
    if (this.healthMetrics.memory.score < 80) {
      recommendations.push('Check for memory leaks in event listeners');
      recommendations.push('Implement proper component cleanup');
    }
    
    if (this.healthMetrics.network.score < 80) {
      recommendations.push('Implement request caching');
      recommendations.push('Add retry logic for failed requests');
    }
    
    if (this.healthMetrics.errors.score < 80) {
      recommendations.push('Add error boundaries to components');
      recommendations.push('Implement proper error handling');
    }
    
    return recommendations;
  }
}

// Create singleton instance
const systemHealthCheck = new SystemHealthCheck();

export default systemHealthCheck; 