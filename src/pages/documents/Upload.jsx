import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import DashboardCard from '../../components/DashboardCard';
import UploadZone from '../../components/UploadZone.tsx';
import DocumentTable from '../../components/DocumentTable.tsx';
import { PlusIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const initialDocs = [
  { id: 1, name: 'FICA.pdf', date: '2024-06-01', type: 'FICA', transfer: 'EZT1001' },
  { id: 2, name: 'TitleDeed.pdf', date: '2024-06-02', type: 'Title Deed', transfer: 'EZT1002' },
  { id: 3, name: 'RatesClearance.pdf', date: '2024-06-03', type: 'Rates', transfer: '' },
];

const docTypes = ['FICA', 'Title Deed', 'Rates', 'OTP', 'Bond Grant'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['.pdf', '.docx', '.doc'];

const Upload = () => {
  const [documents, setDocuments] = useState(initialDocs);
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState(docTypes[0]);
  const [uploadTransfer, setUploadTransfer] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterTransfer, setFilterTransfer] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const pageSize = 10;
  const abortControllerRef = useRef(null);
  const uploadTimeoutRef = useRef(null);

  // Memory-optimized file validation
  const validateFile = useCallback((file) => {
    const errors = {};
    
    if (!file) {
      errors.file = 'Please select a file';
      return errors;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.size = `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_TYPES.includes(fileExtension)) {
      errors.type = `File type must be one of: ${ALLOWED_TYPES.join(', ')}`;
    }

    // Check file name length
    if (file.name.length > 100) {
      errors.name = 'File name must be less than 100 characters';
    }

    return errors;
  }, []);

  // Memory-optimized upload handler with progress tracking
  const handleFileUpload = useCallback((file) => {
    setError('');
    setValidationErrors({});
    
    const errors = validateFile(file);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors before uploading');
      return;
    }

    setUploadFile(file);
    setUploadName(file.name);
    setShowModal(true);
  }, [validateFile]);

  // Memory-optimized upload simulation with abort capability
  const simulateUpload = useCallback(() => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      
      let progress = 0;
      const interval = setInterval(() => {
        if (abortControllerRef.current?.signal.aborted) {
          clearInterval(interval);
          reject(new Error('Upload cancelled'));
          return;
        }
        
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress(100);
          
          // Simulate network delay
          uploadTimeoutRef.current = setTimeout(() => {
            setIsUploading(false);
            resolve();
          }, 500);
        } else {
          setUploadProgress(Math.min(progress, 95));
        }
      }, 200);
    });
  }, []);

  // Memory-optimized upload handler
  const handleUpload = useCallback(async () => {
    if (!uploadFile) {return;}

    try {
      setError('');
      await simulateUpload();
      
      // Add document to list
      setDocuments(prev => [
        ...prev,
        {
          id: Date.now(), // Use timestamp for unique ID
          name: uploadName || uploadFile.name,
          date: new Date().toISOString().slice(0, 10),
          type: uploadType,
          transfer: uploadTransfer,
        },
      ]);

      // Reset form
      setShowModal(false);
      setUploadFile(null);
      setUploadName('');
      setUploadType(docTypes[0]);
      setUploadTransfer('');
      setUploadProgress(0);
    } catch (error) {
      setError(error.message || 'Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [uploadFile, uploadName, uploadType, uploadTransfer, simulateUpload]);

  // Memory-optimized cancel upload
  const handleCancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current);
    }
    setIsUploading(false);
    setUploadProgress(0);
    setError('');
  }, []);

  // Memory-optimized modal close
  const closeModal = useCallback(() => {
    if (isUploading) {
      handleCancelUpload();
    }
    setShowModal(false);
    setUploadFile(null);
    setUploadName('');
    setUploadType(docTypes[0]);
    setUploadTransfer('');
    setError('');
    setValidationErrors({});
  }, [isUploading, handleCancelUpload]);

  // Memory-optimized filtering and sorting
  const { filteredDocs, totalPages, pagedDocs, transferOptions } = useMemo(() => {
    let filtered = documents.filter(doc =>
      (search === '' || doc.name.toLowerCase().includes(search.toLowerCase()) || doc.type.toLowerCase().includes(search.toLowerCase())) &&
      (filterType === 'All' || doc.type === filterType) &&
      (filterTransfer === 'All' || doc.transfer === filterTransfer)
    );

    // Optimized sorting
    filtered = filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }
      if (valA < valB) {return sortDir === 'asc' ? -1 : 1;}
      if (valA > valB) {return sortDir === 'asc' ? 1 : -1;}
      return 0;
    });

    const totalPages = Math.ceil(filtered.length / pageSize);
    const pagedDocs = filtered.slice((page - 1) * pageSize, page * pageSize);
    const transferOptions = Array.from(new Set(documents.map(d => d.transfer).filter(Boolean)));

    return { filteredDocs: filtered, totalPages, pagedDocs, transferOptions };
  }, [documents, search, filterType, filterTransfer, sortBy, sortDir, page, pageSize]);

  // Memory-optimized document handlers
  const handleViewDocument = useCallback((doc) => {
    console.log('Viewing document:', doc.name);
    // In a real app, this would open a document viewer
    alert(`Viewing: ${doc.name}`);
  }, []);

  const handleDownloadDocument = useCallback((doc) => {
    console.log('Downloading document:', doc.name);
    // In a real app, this would trigger a download
    alert(`Downloading: ${doc.name}`);
  }, []);

  const handleDeleteDocument = useCallback((doc) => {
    if (window.confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      setDocuments(docs => docs.filter(d => d.id !== doc.id));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardCard title="Upload Documents">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
              <span className="text-yellow-700 text-sm font-medium">Validation Errors:</span>
            </div>
            <ul className="text-yellow-700 text-sm list-disc list-inside">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <UploadZone onFileUpload={handleFileUpload} acceptedTypes={ALLOWED_TYPES}>
          <div className="flex flex-col items-center">
            <PlusIcon className="h-8 w-8 text-blue-400 mb-2" />
            <span className="text-blue-700 font-semibold">
              Drag & drop PDF/DOCX here or <span className="underline">browse</span>
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
            </span>
          </div>
        </UploadZone>

        {/* Filters/Search */}
        <div className="flex flex-wrap gap-2 items-center mt-6 mb-4">
          <input
            type="text"
            placeholder="Search by name or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select 
            className="border rounded px-2 py-1" 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            {docTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <select 
            className="border rounded px-2 py-1" 
            value={filterTransfer} 
            onChange={e => setFilterTransfer(e.target.value)}
          >
            <option value="All">All Transfers</option>
            {transferOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex gap-1 items-center ml-auto">
            <span className="text-xs text-gray-500">Sort by:</span>
            <button 
              className={`text-xs px-2 py-1 rounded ${sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`} 
              onClick={() => setSortBy('name')}
            >
              Name
            </button>
            <button 
              className={`text-xs px-2 py-1 rounded ${sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`} 
              onClick={() => setSortBy('date')}
            >
              Date
            </button>
            <button 
              className={`text-xs px-2 py-1 rounded ${sortBy === 'type' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`} 
              onClick={() => setSortBy('type')}
            >
              Type
            </button>
            <button 
              className="text-xs px-2 py-1 rounded" 
              onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
            >
              {sortDir === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Table or Empty State */}
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg width="80" height="80" fill="none" viewBox="0 0 80 80">
              <rect width="80" height="80" rx="16" fill="#F3F4F6"/>
              <path d="M24 56h32M28 32h24M32 40h16" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="mt-4 text-gray-400 text-lg">No documents found.</p>
          </div>
        ) : (
          <>
            <DocumentTable
              documents={pagedDocs}
              onView={handleViewDocument}
              onDownload={handleDownloadDocument}
              onDelete={handleDeleteDocument}
              rowClassNameFn={i => i % 2 === 0 ? 'bg-gray-50 hover:bg-blue-50 transition' : 'bg-white hover:bg-blue-50 transition'}
              linkTransfer
            />
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)} 
                  className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 disabled:hover:bg-gray-100"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-500 px-3 py-1">Page {page} of {totalPages}</span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(page + 1)} 
                  className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 disabled:hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Advanced Upload Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload Document</h3>
                <button 
                  onClick={closeModal}
                  disabled={isUploading}
                  className="disabled:opacity-50"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Uploading...</span>
                    <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">File Name</label>
                <input 
                  className="w-full border rounded px-2 py-1" 
                  value={uploadName} 
                  onChange={e => setUploadName(e.target.value)} 
                  placeholder="Enter custom name (optional)"
                  disabled={isUploading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Document Type</label>
                <select 
                  className="w-full border rounded px-2 py-1" 
                  value={uploadType} 
                  onChange={e => setUploadType(e.target.value)}
                  disabled={isUploading}
                >
                  {docTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Link to Transfer (optional)</label>
                <input 
                  className="w-full border rounded px-2 py-1" 
                  value={uploadTransfer} 
                  onChange={e => setUploadTransfer(e.target.value)} 
                  placeholder="e.g. EZT1001"
                  disabled={isUploading}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50" 
                  onClick={closeModal}
                  disabled={isUploading}
                >
                  {isUploading ? 'Cancel' : 'Close'}
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50" 
                  onClick={isUploading ? handleCancelUpload : handleUpload}
                  disabled={!uploadFile}
                >
                  {isUploading ? 'Cancel Upload' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
};

export default Upload; 