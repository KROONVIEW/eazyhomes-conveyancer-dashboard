// Optimized State Management Hooks
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Debounced state hook to prevent excessive re-renders
export const useDebouncedState = (initialValue, delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeoutRef = useRef();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [value, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [debouncedValue, setValue];
};

// Safe async state hook that prevents state updates after unmount
export const useSafeAsyncState = (initialState) => {
  const [state, setState] = useState(initialState);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setSafeState = useCallback((newState) => {
    if (mountedRef.current) {
      setState(newState);
    }
  }, []);

  return [state, setSafeState];
};

// Optimized event listener hook with automatic cleanup
export const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) {return;}

    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

// Optimized interval hook with cleanup
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {return;}

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

// Memoized computation hook
export const useMemoizedComputation = (computeFn, deps) => {
  return useMemo(computeFn, deps);
};

// Optimized fetch hook with cleanup and caching
export const useOptimizedFetch = (url, options = {}) => {
  const [data, setData] = useSafeAsyncState(null);
  const [loading, setLoading] = useSafeAsyncState(true);
  const [error, setError] = useSafeAsyncState(null);
  const abortControllerRef = useRef();
  const cacheRef = useRef(new Map());

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    if (!forceRefresh && cacheRef.current.has(cacheKey)) {
      const cachedData = cacheRef.current.get(cacheKey);
      setData(cachedData);
      setLoading(false);
      return;
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
      cacheRef.current.set(cacheKey, result);
      
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options, setData, setLoading, setError]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, loading, error, refetch: () => fetchData(true) };
}; 