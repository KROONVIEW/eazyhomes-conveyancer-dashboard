import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiPaperclip, FiX, FiFile, FiImage, FiVideo, FiMusic, FiDownload, FiEye } from 'react-icons/fi';
import messageService, { formatFileSize, getFileIcon } from '../../services/messageService';

const FileAttachment = ({ 
  onFilesSelected, 
  onRemoveFile, 
  attachedFiles = [], 
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '' 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Handle file drop and selection
  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    console.log('📎 Files dropped:', { acceptedFiles, rejectedFiles });
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(({ file, errors }) => ({
        file: file.name,
        errors: errors.map(e => e.message).join(', ')
      }));
      setErrors(prev => [...prev, ...newErrors]);
    }

    // Process accepted files
    for (const file of acceptedFiles) {
      try {
        // Validate file
        messageService.validateFile(file);
        
        // Check if we're at max files limit
        if (attachedFiles.length >= maxFiles) {
          setErrors(prev => [...prev, {
            file: file.name,
            errors: `Maximum ${maxFiles} files allowed`
          }]);
          continue;
        }

        // Create file object with preview
        const fileObject = {
          id: `file_${Date.now()}_${Math.random()}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          uploadProgress: 0,
          status: 'pending' // pending, uploading, uploaded, error
        };

        // Add to attached files
        onFilesSelected([...attachedFiles, fileObject]);

        // Start upload simulation
        setUploadProgress(prev => ({ ...prev, [fileObject.id]: 0 }));
        
        // Simulate upload progress
        const uploadInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileObject.id] || 0;
            const newProgress = Math.min(currentProgress + Math.random() * 20, 100);
            
            if (newProgress >= 100) {
              clearInterval(uploadInterval);
              // Update file status to uploaded
              onFilesSelected(prevFiles => 
                prevFiles.map(f => 
                  f.id === fileObject.id 
                    ? { ...f, status: 'uploaded', uploadProgress: 100 }
                    : f
                )
              );
              return { ...prev, [fileObject.id]: 100 };
            }
            
            return { ...prev, [fileObject.id]: newProgress };
          });
        }, 200);

      } catch (error) {
        console.error('❌ File validation error:', error);
        setErrors(prev => [...prev, {
          file: file.name,
          errors: error.message
        }]);
      }
    }
  }, [attachedFiles, maxFiles, onFilesSelected]);

  // Configure dropzone
  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneIsDragActive,
    open
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    },
    maxSize,
    maxFiles,
    multiple: true,
    noClick: true,
    noKeyboard: true
  });

  // Handle file removal
  const handleRemoveFile = (fileId) => {
    const updatedFiles = attachedFiles.filter(f => f.id !== fileId);
    onRemoveFile(fileId);
    
    // Clean up upload progress
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });

    // Clean up preview URLs
    const fileToRemove = attachedFiles.find(f => f.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  // Clear errors
  const clearErrors = () => {
    setErrors([]);
  };

  // Get file type icon
  const getFileTypeIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FiImage className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <FiVideo className="w-4 h-4" />;
    if (fileType.startsWith('audio/')) return <FiMusic className="w-4 h-4" />;
    return <FiFile className="w-4 h-4" />;
  };

  return (
    <div className={`space-y-3 font-['Poppins'] ${className}`}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 cursor-pointer
          ${dropzoneIsDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        
        <div className="text-center">
          <FiPaperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <div className="text-sm text-gray-600">
            {dropzoneIsDragActive ? (
              <p className="text-blue-600 font-medium">Drop files here...</p>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={open}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Click to attach files
                </button>
                <p className="text-gray-500 mt-1">or drag and drop</p>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Max {maxFiles} files, {formatFileSize(maxSize)} each
          </p>
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-red-800">Upload Errors</h4>
            <button
              onClick={clearErrors}
              className="text-red-600 hover:text-red-800"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>
                <strong>{error.file}:</strong> {error.errors}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Attached files list */}
      {attachedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Attached Files ({attachedFiles.length}/{maxFiles})
          </h4>
          
          <div className="space-y-2">
            {attachedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
              >
                {/* File icon/preview */}
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      {getFileTypeIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                  
                  {/* Upload progress */}
                  {file.status === 'pending' && uploadProgress[file.id] !== undefined && (
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[file.id]}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round(uploadProgress[file.id])}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Status indicators */}
                  {file.status === 'uploaded' && (
                    <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                  )}
                  {file.status === 'error' && (
                    <p className="text-xs text-red-600 mt-1">✗ Upload failed</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {file.preview && (
                    <button
                      onClick={() => window.open(file.preview, '_blank')}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Preview"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Remove"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick attach button */}
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <FiPaperclip className="w-4 h-4" />
        Attach Files
      </button>
    </div>
  );
};

// File preview modal component
export const FilePreviewModal = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null;

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-full p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
        >
          <FiX className="w-6 h-6" />
        </button>
        
        <div className="bg-white rounded-lg overflow-hidden">
          {isImage && (
            <img
              src={file.preview || file.url}
              alt={file.name}
              className="max-w-full max-h-96 object-contain"
            />
          )}
          
          {isPDF && (
            <iframe
              src={file.url}
              title={file.name}
              className="w-full h-96"
            />
          )}
          
          {!isImage && !isPDF && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{file.name}</h3>
              <p className="text-gray-500 mb-4">{formatFileSize(file.size)}</p>
              <button
                onClick={() => window.open(file.url, '_blank')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiDownload className="w-4 h-4" />
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileAttachment; 