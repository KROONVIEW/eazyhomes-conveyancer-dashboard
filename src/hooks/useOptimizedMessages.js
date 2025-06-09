import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// Optimized message state management hook
export const useOptimizedMessages = (initialMessages = []) => {
  // Use Map for O(1) lookups and updates
  const [messageMap, setMessageMap] = useState(() => {
    const map = new Map();
    initialMessages.forEach(msg => map.set(msg.id, msg));
    return map;
  });

  // Track message order separately for efficient sorting
  const [messageOrder, setMessageOrder] = useState(() => 
    initialMessages.map(msg => msg.id).sort((a, b) => a - b)
  );

  // Batch update queue for performance
  const updateQueueRef = useRef([]);
  const batchTimeoutRef = useRef(null);

  // Convert Map to Array with memoization
  const messages = useMemo(() => {
    return messageOrder.map(id => messageMap.get(id)).filter(Boolean);
  }, [messageMap, messageOrder]);

  // Batch updates for better performance
  const flushUpdates = useCallback(() => {
    if (updateQueueRef.current.length === 0) {return;}

    const updates = updateQueueRef.current;
    updateQueueRef.current = [];

    setMessageMap(prevMap => {
      const newMap = new Map(prevMap);
      updates.forEach(({ type, data }) => {
        switch (type) {
          case 'add':
            newMap.set(data.id, data);
            break;
          case 'update':
            if (newMap.has(data.id)) {
              newMap.set(data.id, { ...newMap.get(data.id), ...data });
            }
            break;
          case 'delete':
            newMap.delete(data.id);
            break;
        }
      });
      return newMap;
    });

    // Update order for new messages
    const newMessageIds = updates
      .filter(update => update.type === 'add')
      .map(update => update.data.id);
    
    const deletedMessageIds = updates
      .filter(update => update.type === 'delete')
      .map(update => update.data.id);

    if (newMessageIds.length > 0 || deletedMessageIds.length > 0) {
      setMessageOrder(prevOrder => {
        let newOrder = prevOrder.filter(id => !deletedMessageIds.includes(id));
        newOrder = [...newOrder, ...newMessageIds];
        return newOrder.sort((a, b) => a - b);
      });
    }
  }, []);

  // Queue update with batching
  const queueUpdate = useCallback((type, data) => {
    updateQueueRef.current.push({ type, data });

    // Clear existing timeout
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    // Batch updates for 16ms (60fps)
    batchTimeoutRef.current = setTimeout(flushUpdates, 16);
  }, [flushUpdates]);

  // Add message with optimistic updates
  const addMessage = useCallback((message) => {
    queueUpdate('add', message);
  }, [queueUpdate]);

  // Update message status efficiently
  const updateMessageStatus = useCallback((messageId, status) => {
    queueUpdate('update', { id: messageId, status });
  }, [queueUpdate]);

  // Update multiple messages at once
  const updateMessages = useCallback((updates) => {
    updates.forEach(update => queueUpdate('update', update));
  }, [queueUpdate]);

  // Delete message
  const deleteMessage = useCallback((messageId) => {
    queueUpdate('delete', { id: messageId });
  }, [queueUpdate]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessageMap(new Map());
    setMessageOrder([]);
    updateQueueRef.current = [];
  }, []);

  // Get message by ID efficiently
  const getMessage = useCallback((messageId) => {
    return messageMap.get(messageId);
  }, [messageMap]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages,
    addMessage,
    updateMessageStatus,
    updateMessages,
    deleteMessage,
    clearMessages,
    getMessage,
    messageCount: messageMap.size
  };
};

// Hook for optimistic message updates
export const useOptimisticMessages = (chatId) => {
  const [optimisticMessages, setOptimisticMessages] = useState(new Map());
  const [pendingMessages, setPendingMessages] = useState(new Set());

  // Add optimistic message
  const addOptimisticMessage = useCallback((message) => {
    const optimisticId = `temp_${Date.now()}_${Math.random()}`;
    const optimisticMessage = {
      ...message,
      id: optimisticId,
      status: 'sending',
      isOptimistic: true
    };

    setOptimisticMessages(prev => new Map(prev).set(optimisticId, optimisticMessage));
    setPendingMessages(prev => new Set(prev).add(optimisticId));

    return optimisticId;
  }, []);

  // Confirm optimistic message
  const confirmOptimisticMessage = useCallback((optimisticId, realMessage) => {
    setOptimisticMessages(prev => {
      const newMap = new Map(prev);
      newMap.delete(optimisticId);
      return newMap;
    });
    setPendingMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(optimisticId);
      return newSet;
    });
  }, []);

  // Fail optimistic message
  const failOptimisticMessage = useCallback((optimisticId) => {
    setOptimisticMessages(prev => {
      const newMap = new Map(prev);
      const message = newMap.get(optimisticId);
      if (message) {
        newMap.set(optimisticId, { ...message, status: 'failed' });
      }
      return newMap;
    });
    setPendingMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(optimisticId);
      return newSet;
    });
  }, []);

  // Clear optimistic messages when chat changes
  useEffect(() => {
    setOptimisticMessages(new Map());
    setPendingMessages(new Set());
  }, [chatId]);

  return {
    optimisticMessages: Array.from(optimisticMessages.values()),
    pendingMessages,
    addOptimisticMessage,
    confirmOptimisticMessage,
    failOptimisticMessage
  };
};

// Hook for message caching
export const useMessageCache = (maxSize = 1000) => {
  const cacheRef = useRef(new Map());
  const accessOrderRef = useRef([]);

  const get = useCallback((key) => {
    const value = cacheRef.current.get(key);
    if (value) {
      // Move to end (most recently used)
      const index = accessOrderRef.current.indexOf(key);
      if (index > -1) {
        accessOrderRef.current.splice(index, 1);
      }
      accessOrderRef.current.push(key);
    }
    return value;
  }, []);

  const set = useCallback((key, value) => {
    // Remove if already exists
    if (cacheRef.current.has(key)) {
      const index = accessOrderRef.current.indexOf(key);
      if (index > -1) {
        accessOrderRef.current.splice(index, 1);
      }
    }

    // Add to cache
    cacheRef.current.set(key, value);
    accessOrderRef.current.push(key);

    // Evict oldest if over limit
    while (cacheRef.current.size > maxSize) {
      const oldest = accessOrderRef.current.shift();
      cacheRef.current.delete(oldest);
    }
  }, [maxSize]);

  const clear = useCallback(() => {
    cacheRef.current.clear();
    accessOrderRef.current = [];
  }, []);

  const has = useCallback((key) => {
    return cacheRef.current.has(key);
  }, []);

  return { get, set, clear, has, size: cacheRef.current.size };
};

// Hook for message performance monitoring
export const useMessagePerformance = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    updateTime: 0,
    messageCount: 0,
    cacheHitRate: 0,
    memoryUsage: 0
  });

  const renderStartRef = useRef(0);
  const updateStartRef = useRef(0);
  const cacheHitsRef = useRef(0);
  const cacheMissesRef = useRef(0);

  const startRenderMeasure = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  const endRenderMeasure = useCallback(() => {
    const renderTime = performance.now() - renderStartRef.current;
    setMetrics(prev => ({ ...prev, renderTime }));
  }, []);

  const startUpdateMeasure = useCallback(() => {
    updateStartRef.current = performance.now();
  }, []);

  const endUpdateMeasure = useCallback(() => {
    const updateTime = performance.now() - updateStartRef.current;
    setMetrics(prev => ({ ...prev, updateTime }));
  }, []);

  const recordCacheHit = useCallback(() => {
    cacheHitsRef.current++;
    updateCacheHitRate();
  }, []);

  const recordCacheMiss = useCallback(() => {
    cacheMissesRef.current++;
    updateCacheHitRate();
  }, []);

  const updateCacheHitRate = useCallback(() => {
    const total = cacheHitsRef.current + cacheMissesRef.current;
    const hitRate = total > 0 ? (cacheHitsRef.current / total) * 100 : 0;
    setMetrics(prev => ({ ...prev, cacheHitRate: hitRate }));
  }, []);

  const updateMessageCount = useCallback((count) => {
    setMetrics(prev => ({ ...prev, messageCount: count }));
  }, []);

  const updateMemoryUsage = useCallback(() => {
    if (performance.memory) {
      const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
      setMetrics(prev => ({ ...prev, memoryUsage }));
    }
  }, []);

  // Update memory usage periodically
  useEffect(() => {
    const interval = setInterval(updateMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, [updateMemoryUsage]);

  return {
    metrics,
    startRenderMeasure,
    endRenderMeasure,
    startUpdateMeasure,
    endUpdateMeasure,
    recordCacheHit,
    recordCacheMiss,
    updateMessageCount
  };
};

// Hook for debounced state updates
export const useDebouncedState = (initialValue, delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return [debouncedValue, setValue];
};

// Hook for throttled callbacks
export const useThrottledCallback = (callback, delay = 100) => {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef();

  const throttledCallback = useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - (now - lastCallRef.current));
    }
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}; 