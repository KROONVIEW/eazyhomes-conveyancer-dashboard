// Memory-Optimized React Hooks
// Implements best-in-class memory management for React components

import { useState, useEffect, useCallback, useRef, useMemo, useLayoutEffect } from 'react';
import { useMemoryOptimization } from '../utils/advancedMemoryManager';

// Memory-safe state hook that prevents memory leaks
export const useMemorySafeState = (initialState) => {
  const [state, setState] = useState(initialState);
  const mountedRef = useRef(true);
  const componentRef = useRef({}); // Create an object to use as WeakMap key
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  useEffect(() => {
    registerComponent(componentRef.current, { type: 'state-hook', initialState });
    
    return () => {
      mountedRef.current = false;
      unregisterComponent(componentRef.current);
    };
  }, [registerComponent, unregisterComponent, initialState]);

  const setSafeState = useCallback((newState) => {
    if (mountedRef.current) {
      setState(newState);
    }
  }, []);

  return [state, setSafeState];
};

// Debounced state with memory optimization
export const useMemoryOptimizedDebouncedState = (initialValue, delay = 300) => {
  const [value, setValue] = useMemorySafeState(initialValue);
  const [debouncedValue, setDebouncedValue] = useMemorySafeState(initialValue);
  const timeoutRef = useRef();
  const mountedRef = useRef(true);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setDebouncedValue(value);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, setDebouncedValue]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [debouncedValue, setValue];
};

// Cached computation hook with memory management
export const useMemoryOptimizedMemo = (computeFn, deps, cacheKey) => {
  const { getCache, setCache } = useMemoryOptimization();
  const depsRef = useRef(deps);
  const resultRef = useRef();

  return useMemo(() => {
    // Check if dependencies have changed
    const depsChanged = !depsRef.current || 
      deps.length !== depsRef.current.length ||
      deps.some((dep, index) => dep !== depsRef.current[index]);

    if (!depsChanged && resultRef.current !== undefined) {
      return resultRef.current;
    }

    // Check cache if cacheKey is provided
    if (cacheKey) {
      const cached = getCache('memo', cacheKey);
      if (cached && !depsChanged) {
        resultRef.current = cached;
        return cached;
      }
    }

    // Compute new result
    const result = computeFn();
    resultRef.current = result;
    depsRef.current = deps;

    // Cache result if cacheKey is provided
    if (cacheKey) {
      setCache('memo', cacheKey, result);
    }

    return result;
  }, deps);
};

// Event listener hook with automatic cleanup and memory tracking
export const useMemoryOptimizedEventListener = (eventName, handler, element = window, options = {}) => {
  const savedHandler = useRef();
  const elementRef = useRef(element);
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  // Update handler ref when handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = elementRef.current;
    if (!targetElement?.addEventListener) {return;}

    const eventListener = (event) => {
      if (savedHandler.current) {
        savedHandler.current(event);
      }
    };

    // Register with memory manager
    registerComponent(eventListener, { 
      type: 'event-listener', 
      eventName, 
      element: targetElement.constructor.name 
    });

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
      unregisterComponent(eventListener);
    };
  }, [eventName, element, options, registerComponent, unregisterComponent]);
};

// Interval hook with memory optimization
export const useMemoryOptimizedInterval = (callback, delay) => {
  const savedCallback = useRef();
  const intervalRef = useRef();
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || delay === undefined) {return;}

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    intervalRef.current = setInterval(tick, delay);
    
    // Create an object to register instead of the interval ID (which is a number)
    const intervalObj = { id: intervalRef.current, delay };
    registerComponent(intervalObj, { 
      type: 'interval', 
      delay 
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        unregisterComponent(intervalObj);
      }
    };
  }, [delay, registerComponent, unregisterComponent]);
};

// Fetch hook with memory optimization and caching
export const useMemoryOptimizedFetch = (url, options = {}, cacheOptions = {}) => {
  const [data, setData] = useMemorySafeState(null);
  const [loading, setLoading] = useMemorySafeState(true);
  const [error, setError] = useMemorySafeState(null);
  const abortControllerRef = useRef();
  const { getCache, setCache } = useMemoryOptimization();
  
  const {
    cacheTTL = 300000, // 5 minutes
    cacheKey = `${url}_${JSON.stringify(options)}`,
    enableCache = true
  } = cacheOptions;

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (enableCache && !forceRefresh) {
      const cachedData = getCache('fetch', cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result
      if (enableCache) {
        setCache('fetch', cacheKey, result);
      }
      
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options, enableCache, cacheKey, getCache, setCache, setData, setLoading, setError]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, refetch };
};

// Optimized ref hook that prevents memory leaks
export const useMemoryOptimizedRef = (initialValue = null) => {
  const ref = useRef(initialValue);
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  useEffect(() => {
    registerComponent(ref, { type: 'ref', initialValue });
    
    return () => {
      // Clear ref value to prevent memory leaks
      ref.current = null;
      unregisterComponent(ref);
    };
  }, [registerComponent, unregisterComponent, initialValue]);

  return ref;
};

// Callback hook with memory optimization
export const useMemoryOptimizedCallback = (callback, deps, cacheKey) => {
  const { getCache, setCache } = useMemoryOptimization();
  
  return useCallback((...args) => {
    // Check cache if cacheKey is provided
    if (cacheKey) {
      const argsKey = `${cacheKey}_${JSON.stringify(args)}`;
      const cached = getCache('callback', argsKey);
      if (cached) {
        return cached;
      }
    }

    const result = callback(...args);

    // Cache result if cacheKey is provided and result is cacheable
    if (cacheKey && result !== undefined) {
      const argsKey = `${cacheKey}_${JSON.stringify(args)}`;
      setCache('callback', argsKey, result);
    }

    return result;
  }, deps);
};

// Layout effect hook with memory optimization
export const useMemoryOptimizedLayoutEffect = (effect, deps) => {
  const { registerComponent, unregisterComponent } = useMemoryOptimization();
  const effectRef = useRef();

  useLayoutEffect(() => {
    effectRef.current = effect;
    registerComponent(effectRef.current, { type: 'layout-effect' });
    
    const cleanup = effect();
    
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
      unregisterComponent(effectRef.current);
    };
  }, deps);
};

// Previous value hook with memory optimization
export const useMemoryOptimizedPrevious = (value) => {
  const ref = useMemoryOptimizedRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value, ref]);
  
  return ref.current;
};

// Local storage hook with memory optimization
export const useMemoryOptimizedLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useMemorySafeState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, setStoredValue]);

  // Clean up localStorage on unmount if needed
  useEffect(() => {
    return () => {
      // Optionally clean up localStorage on unmount
      // window.localStorage.removeItem(key);
    };
  }, [key]);

  return [storedValue, setValue];
};

// Throttled callback hook with memory optimization
export const useMemoryOptimizedThrottle = (callback, delay) => {
  const lastRun = useMemoryOptimizedRef(Date.now());
  const timeoutRef = useMemoryOptimizedRef();

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      callback(...args);
      lastRun.current = now;
    } else {
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRun.current = Date.now();
      }, delay - timeSinceLastRun);
    }
  }, [callback, delay, lastRun, timeoutRef]);
};

// Window size hook with memory optimization
export const useMemoryOptimizedWindowSize = () => {
  const [windowSize, setWindowSize] = useMemorySafeState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useMemoryOptimizedThrottle(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 100);

  useMemoryOptimizedEventListener('resize', handleResize);

  return windowSize;
};

// Intersection observer hook with memory optimization
export const useMemoryOptimizedIntersectionObserver = (
  elementRef,
  options = {},
  callback
) => {
  const [isIntersecting, setIsIntersecting] = useMemorySafeState(false);
  const observerRef = useMemoryOptimizedRef();
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {return;}

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsIntersecting(entry.isIntersecting);
        if (callback) {
          callback(entry);
        }
      },
      options
    );

    observerRef.current = observer;
    registerComponent(observer, { type: 'intersection-observer' });
    observer.observe(element);

    return () => {
      observer.disconnect();
      unregisterComponent(observer);
    };
  }, [elementRef, options, callback, setIsIntersecting, observerRef, registerComponent, unregisterComponent]);

  return isIntersecting;
};

export default {
  useMemorySafeState,
  useMemoryOptimizedDebouncedState,
  useMemoryOptimizedMemo,
  useMemoryOptimizedEventListener,
  useMemoryOptimizedInterval,
  useMemoryOptimizedFetch,
  useMemoryOptimizedRef,
  useMemoryOptimizedCallback,
  useMemoryOptimizedLayoutEffect,
  useMemoryOptimizedPrevious,
  useMemoryOptimizedLocalStorage,
  useMemoryOptimizedThrottle,
  useMemoryOptimizedWindowSize,
  useMemoryOptimizedIntersectionObserver
}; 