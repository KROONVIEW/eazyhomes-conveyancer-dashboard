import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import OptimizedMessageBubble from './OptimizedMessageBubble';

// Virtual scrolling hook for message lists
const useVirtualScrolling = (messages, containerHeight, itemHeight = 80) => {
  const [scrollTop, setScrollTop] = useState(0);
  const OVERSCAN = 5; // Render extra items for smooth scrolling

  const virtualData = useMemo(() => {
    if (!messages.length || !containerHeight) {
      return {
        visibleMessages: [],
        totalHeight: 0,
        offsetY: 0,
        startIndex: 0,
        endIndex: 0
      };
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + (OVERSCAN * 2);
    const endIndex = Math.min(messages.length - 1, startIndex + visibleCount);

    return {
      visibleMessages: messages.slice(startIndex, endIndex + 1),
      totalHeight: messages.length * itemHeight,
      offsetY: startIndex * itemHeight,
      startIndex,
      endIndex
    };
  }, [messages, containerHeight, scrollTop, itemHeight]);

  return {
    ...virtualData,
    setScrollTop
  };
};

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    visibleCount: 0,
    totalCount: 0,
    fps: 0
  });

  const frameRef = useRef();
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  const measureRender = useCallback((callback) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      renderTime: end - start
    }));
  }, []);

  const updateFPS = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;
    
    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      setMetrics(prev => ({ ...prev, fps }));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
    
    frameRef.current = requestAnimationFrame(updateFPS);
  }, []);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(updateFPS);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateFPS]);

  return { metrics, measureRender };
};

// Optimized scroll handler with debouncing
const useOptimizedScroll = (onScroll, delay = 16) => {
  const timeoutRef = useRef();
  const lastScrollRef = useRef(0);

  const handleScroll = useCallback((event) => {
    const now = performance.now();
    
    // Throttle scroll events to 60fps
    if (now - lastScrollRef.current < delay) {
      return;
    }
    
    lastScrollRef.current = now;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      onScroll(event);
    });
  }, [onScroll, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return handleScroll;
};

// Main Virtual Message List Component
const VirtualMessageList = React.memo(({
  messages = [],
  containerHeight = 400,
  itemHeight = 80,
  onScroll,
  className = '',
  showPerformanceMetrics = false
}) => {
  const containerRef = useRef();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef();

  // Virtual scrolling logic
  const {
    visibleMessages,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop
  } = useVirtualScrolling(messages, containerHeight, itemHeight);

  // Performance monitoring
  const { metrics, measureRender } = usePerformanceMonitor();

  // Optimized scroll handling
  const handleScroll = useOptimizedScroll(useCallback((event) => {
    const scrollTop = event.target.scrollTop;
    setScrollTop(scrollTop);
    
    // Update scrolling state
    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set scrolling to false after scroll ends
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
    
    // Call external scroll handler
    if (onScroll) {
      onScroll(event);
    }
  }, [setScrollTop, onScroll]), 16);

  // Update performance metrics
  useEffect(() => {
    measureRender(() => {
      // Measure render performance
    });
  }, [visibleMessages, measureRender]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Expose scroll to bottom method
  React.useImperativeHandle(containerRef, () => ({
    scrollToBottom
  }), [scrollToBottom]);

  return (
    <div className="virtual-message-list-container relative">
      {/* Performance Metrics Overlay */}
      {showPerformanceMetrics && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 z-50 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
          <div>Visible: {visibleMessages.length}/{messages.length}</div>
          <div>FPS: {metrics.fps}</div>
          <div>Range: {startIndex}-{endIndex}</div>
          <div>{isScrolling ? '🔄 Scrolling' : '✅ Idle'}</div>
        </div>
      )}

      {/* Virtual Scroll Container */}
      <div
        ref={containerRef}
        className={`virtual-scroll-container overflow-y-auto ${className}`}
        style={{
          height: containerHeight,
          transform: 'translateZ(0)', // Hardware acceleration
          willChange: isScrolling ? 'scroll-position' : 'auto'
        }}
        onScroll={handleScroll}
      >
        {/* Virtual spacer for total height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible messages container */}
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}
          >
            {visibleMessages.map((message, index) => {
              const messageIndex = startIndex + index;
              return (
                <div
                  key={message.id || messageIndex}
                  style={{
                    minHeight: itemHeight,
                    padding: '8px 0'
                  }}
                >
                  <OptimizedMessageBubble
                    {...message}
                    senderAvatar={message.isSent ? message.senderAvatar : message.senderAvatar}
                    status={message.status}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicators */}
      {messages.length > 10 && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          {/* Scroll to bottom button */}
          {startIndex + visibleMessages.length < messages.length - 5 && (
            <button
              onClick={scrollToBottom}
              className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
              title="Scroll to bottom"
            >
              ↓
            </button>
          )}
        </div>
      )}
    </div>
  );
});

// Display name for debugging
VirtualMessageList.displayName = 'VirtualMessageList';

// Export additional utilities
export const MessageListUtils = {
  // Calculate optimal item height based on message content
  calculateItemHeight: (message) => {
    let baseHeight = 60; // Base height for simple messages
    
    if (message.attachment) {baseHeight += 40;}
    if (message.text && message.text.length > 100) {baseHeight += 20;}
    if (message.isBroadcast) {baseHeight += 10;}
    
    return Math.max(baseHeight, 50);
  },

  // Batch message updates for better performance
  batchMessageUpdates: (messages, updates) => {
    const messageMap = new Map(messages.map(msg => [msg.id, msg]));
    
    updates.forEach(update => {
      if (messageMap.has(update.id)) {
        messageMap.set(update.id, { ...messageMap.get(update.id), ...update });
      }
    });
    
    return Array.from(messageMap.values());
  },

  // Optimize message data for rendering
  optimizeMessageData: (messages) => {
    return messages.map(message => ({
      ...message,
      // Pre-calculate expensive operations
      _optimized: true,
      _timestamp: new Date(message.timestamp).getTime()
    }));
  }
};

export default VirtualMessageList; 