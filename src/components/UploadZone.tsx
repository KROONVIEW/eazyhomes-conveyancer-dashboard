import React, { useRef, useState, useCallback, useEffect } from 'react';

type UploadZoneProps = {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string[];
  children?: React.ReactNode;
  maxFileSize?: number;
  disabled?: boolean;
};

const UploadZone: React.FC<UploadZoneProps> = ({ 
  onFileUpload, 
  acceptedTypes = ['.pdf', '.docx'], 
  children,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memory-optimized drag handlers with proper cleanup
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        // Use timeout to prevent flickering
        if (dragTimeoutRef.current) {
          clearTimeout(dragTimeoutRef.current);
        }
        dragTimeoutRef.current = setTimeout(() => {
          setDragActive(false);
        }, 50);
      }
      return newCounter;
    });
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    // Clear any pending timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, [disabled]);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type must be one of: ${acceptedTypes.join(', ')}`;
    }

    // Check if file is empty
    if (file.size === 0) {
      return 'File cannot be empty';
    }

    return null;
  }, [acceptedTypes, maxFileSize]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragActive(false);
    setDragCounter(0);
    
    if (disabled) return;
    
    // Clear any pending timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      const validationError = validateFile(file);
      if (validationError) {
        console.warn('File validation failed:', validationError);
        // In a real app, you might want to show this error to the user
        return;
      }
      
      onFileUpload(file);
      
      // Clear the dataTransfer for security
      e.dataTransfer.clearData();
    }
  }, [disabled, onFileUpload, validateFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      const validationError = validateFile(file);
      if (validationError) {
        console.warn('File validation failed:', validationError);
        // Reset the input
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        return;
      }
      
      onFileUpload(file);
      
      // Reset the input for future uploads
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [disabled, onFileUpload, validateFile]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  // Reset drag state when disabled changes
  useEffect(() => {
    if (disabled) {
      setDragActive(false);
      setDragCounter(0);
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
        dragTimeoutRef.current = null;
      }
    }
  }, [disabled]);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 ${
        disabled 
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
          : dragActive 
          ? 'border-blue-500 bg-blue-100 cursor-pointer' 
          : 'border-blue-300 bg-blue-50 hover:bg-blue-100 cursor-pointer'
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={disabled ? 'File upload disabled' : 'Click to upload file or drag and drop'}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
        aria-hidden="true"
      />
      {children || (
        <>
          <span className={`font-semibold ${disabled ? 'text-gray-400' : 'text-blue-700'}`}>
            Drag & drop files here or <span className="underline">browse</span>
          </span>
        </>
      )}
    </div>
  );
};

export default UploadZone; 