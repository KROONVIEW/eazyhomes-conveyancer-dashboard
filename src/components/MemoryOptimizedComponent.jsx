// Memory-Optimized Component Wrapper
// Provides automatic memory optimization for React components

import React, { memo, forwardRef, useEffect, useRef } from 'react';
import { useMemoryOptimization } from '../utils/advancedMemoryManager';

// Higher-Order Component for memory optimization
export const withMemoryOptimization = (WrappedComponent, options = {}) => {
  const {
    displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component',
    shouldUpdate = () => true,
    cacheProps = false,
    lazyRender = false,
    cleanupOnUnmount = true
  } = options;

  const MemoryOptimizedComponent = memo(
    forwardRef((props, ref) => {
      const componentRef = useRef();
      const { registerComponent, unregisterComponent } = useMemoryOptimization();
      const renderCountRef = useRef(0);

      useEffect(() => {
        renderCountRef.current += 1;
        
        // Register component with memory manager
        registerComponent(componentRef.current, {
          type: 'wrapped-component',
          displayName,
          renderCount: renderCountRef.current,
          props: cacheProps ? props : null
        });

        return () => {
          if (cleanupOnUnmount) {
            unregisterComponent(componentRef.current);
          }
        };
      }, [props, displayName, cacheProps, cleanupOnUnmount, registerComponent, unregisterComponent]);

      // Lazy rendering optimization
      if (lazyRender && renderCountRef.current === 0) {
        return null;
      }

      return (
        <div ref={componentRef}>
          <WrappedComponent {...props} ref={ref} />
        </div>
      );
    }),
    (prevProps, nextProps) => {
      // Custom comparison function
      if (typeof shouldUpdate === 'function') {
        return !shouldUpdate(prevProps, nextProps);
      }
      
      // Default shallow comparison
      const prevKeys = Object.keys(prevProps);
      const nextKeys = Object.keys(nextProps);
      
      if (prevKeys.length !== nextKeys.length) {
        return false;
      }
      
      return prevKeys.every(key => prevProps[key] === nextProps[key]);
    }
  );

  MemoryOptimizedComponent.displayName = `MemoryOptimized(${displayName})`;
  
  return MemoryOptimizedComponent;
};

// Virtualized List Component for memory optimization
export const MemoryOptimizedVirtualList = memo(({
  items = [],
  renderItem,
  itemHeight = 50,
  containerHeight = 400,
  overscan = 5,
  className = '',
  ...props
}) => {
  const containerRef = useRef();
  const [scrollTop, setScrollTop] = React.useState(0);
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  useEffect(() => {
    registerComponent(containerRef.current, {
      type: 'virtual-list',
      itemCount: items.length,
      itemHeight,
      containerHeight
    });

    return () => {
      unregisterComponent(containerRef.current);
    };
  }, [items.length, itemHeight, containerHeight, registerComponent, unregisterComponent]);

  const handleScroll = React.useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // Generate visible items
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    if (items[i]) {
      visibleItems.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute',
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight
        }
      });
    }
  }

  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`memory-optimized-virtual-list ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, style }) => (
          <div key={index} style={style}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
});

MemoryOptimizedVirtualList.displayName = 'MemoryOptimizedVirtualList';

// Lazy Image Component with memory optimization
export const MemoryOptimizedImage = memo(({
  src,
  alt = '',
  placeholder = null,
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = useRef();
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
      registerComponent(imgRef.current, {
        type: 'lazy-image',
        src,
        isInView,
        isLoaded
      });
    }

    return () => {
      observer.disconnect();
      if (imgRef.current) {
        unregisterComponent(imgRef.current);
      }
    };
  }, [src, isInView, isLoaded, registerComponent, unregisterComponent]);

  const handleLoad = React.useCallback((e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  }, [onLoad]);

  const handleError = React.useCallback((e) => {
    setHasError(true);
    if (onError) onError(e);
  }, [onError]);

  return (
    <div ref={imgRef} className={`memory-optimized-image ${className}`}>
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          {...props}
        />
      )}
      {(!isInView || (!isLoaded && !hasError)) && placeholder && (
        <div className="image-placeholder">
          {placeholder}
        </div>
      )}
      {hasError && (
        <div className="image-error">
          Failed to load image
        </div>
      )}
    </div>
  );
});

MemoryOptimizedImage.displayName = 'MemoryOptimizedImage';

// Memoized Form Component
export const MemoryOptimizedForm = memo(({
  children,
  onSubmit,
  className = '',
  ...props
}) => {
  const formRef = useRef();
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  useEffect(() => {
    registerComponent(formRef.current, {
      type: 'form',
      fieldCount: formRef.current?.elements?.length || 0
    });

    return () => {
      unregisterComponent(formRef.current);
    };
  }, [registerComponent, unregisterComponent]);

  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    if (onSubmit) {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      onSubmit(data, e);
    }
  }, [onSubmit]);

  return (
    <form
      ref={formRef}
      className={`memory-optimized-form ${className}`}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  );
});

MemoryOptimizedForm.displayName = 'MemoryOptimizedForm';

// Debounced Input Component
export const MemoryOptimizedInput = memo(({
  value,
  onChange,
  debounceMs = 300,
  className = '',
  ...props
}) => {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = useRef();
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    registerComponent(timeoutRef.current, {
      type: 'debounced-input',
      debounceMs
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        unregisterComponent(timeoutRef.current);
      }
    };
  }, [debounceMs, registerComponent, unregisterComponent]);

  const handleChange = React.useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (onChange) {
        onChange(newValue);
      }
    }, debounceMs);
  }, [onChange, debounceMs]);

  return (
    <input
      value={localValue}
      onChange={handleChange}
      className={`memory-optimized-input ${className}`}
      {...props}
    />
  );
});

MemoryOptimizedInput.displayName = 'MemoryOptimizedInput';

// Modal Component with memory optimization
export const MemoryOptimizedModal = memo(({
  isOpen,
  onClose,
  children,
  className = '',
  ...props
}) => {
  const modalRef = useRef();
  const { registerComponent, unregisterComponent } = useMemoryOptimization();

  useEffect(() => {
    if (isOpen) {
      registerComponent(modalRef.current, {
        type: 'modal',
        isOpen
      });

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape' && onClose) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
        unregisterComponent(modalRef.current);
      };
    }
  }, [isOpen, onClose, registerComponent, unregisterComponent]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      className={`memory-optimized-modal ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={handleBackdropClick}
      {...props}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
});

MemoryOptimizedModal.displayName = 'MemoryOptimizedModal';

// Export all components
export default {
  withMemoryOptimization,
  MemoryOptimizedVirtualList,
  MemoryOptimizedImage,
  MemoryOptimizedForm,
  MemoryOptimizedInput,
  MemoryOptimizedModal
}; 