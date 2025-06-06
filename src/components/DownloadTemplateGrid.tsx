import React, { useState, useCallback, useMemo } from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type Template = {
  name: string;
  type: string;
  format: 'PDF' | 'DOCX';
  downloadStatus?: {
    status: 'downloading' | 'completed';
    progress: number;
  } | null;
};

type DownloadTemplateGridProps = {
  templates: Template[];
  onDownload?: (template: Template) => void;
};

const formatIcon = (format: 'PDF' | 'DOCX') => (
  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${format === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
    {format}
  </span>
);

const DownloadTemplateGrid: React.FC<DownloadTemplateGridProps> = ({ templates, onDownload }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Memory-optimized type extraction
  const types = useMemo(() => 
    Array.from(new Set(templates.map(t => t.type))),
    [templates]
  );

  // Memory-optimized filtering
  const filtered = useMemo(() => 
    templates.filter(t =>
      (filter === 'All' || t.type === filter) &&
      t.name.toLowerCase().includes(search.toLowerCase())
    ),
    [templates, filter, search]
  );

  // Memory-optimized download handler
  const handleDownloadClick = useCallback((template: Template) => {
    if (template.downloadStatus?.status === 'downloading') {
      return; // Prevent multiple downloads
    }
    onDownload?.(template);
  }, [onDownload]);

  // Memory-optimized search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  // Memory-optimized filter handler
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select 
          className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          value={filter} 
          onChange={handleFilterChange}
        >
          <option value="All">All Types</option>
          {types.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((template, i) => {
          const isDownloading = template.downloadStatus?.status === 'downloading';
          const isCompleted = template.downloadStatus?.status === 'completed';
          const progress = template.downloadStatus?.progress || 0;

          return (
            <div key={`${template.name}-${i}`} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 items-start relative overflow-hidden">
              {/* Download Progress Overlay */}
              {isDownloading && (
                <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex flex-col items-center justify-center z-10">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
                  <span className="text-blue-700 text-sm font-medium">{Math.round(progress)}%</span>
                  <div className="w-20 bg-blue-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Completion Indicator */}
              {isCompleted && (
                <div className="absolute top-2 right-2 z-10">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
              )}

              <div className="flex items-center gap-2 w-full">
                <DocumentTextIcon className="h-6 w-6 text-blue-400 flex-shrink-0" />
                <span className="font-semibold text-gray-800 truncate flex-1" title={template.name}>
                  {template.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-gray-500 flex-1">{template.type}</span>
                {formatIcon(template.format)}
              </div>
              
              <button 
                className={`mt-2 px-3 py-1 rounded text-sm font-semibold flex items-center gap-1 w-full justify-center transition-all duration-200 ${
                  isDownloading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : isCompleted
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                }`}
                onClick={() => handleDownloadClick(template)}
                disabled={isDownloading}
                title={isDownloading ? 'Download in progress...' : isCompleted ? 'Download completed' : 'Download template'}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Downloading...
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircleIcon className="h-4 w-4" /> 
                    Downloaded
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4" /> 
                    Download
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <svg width="80" height="80" fill="none" viewBox="0 0 80 80">
            <rect width="80" height="80" rx="16" fill="#F3F4F6"/>
            <path d="M24 56h32M28 32h24M32 40h16" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p className="mt-4 text-gray-400 text-lg">
            {search || filter !== 'All' ? 'No templates match your search criteria.' : 'No templates available.'}
          </p>
          {(search || filter !== 'All') && (
            <button 
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => {
                setSearch('');
                setFilter('All');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloadTemplateGrid; 