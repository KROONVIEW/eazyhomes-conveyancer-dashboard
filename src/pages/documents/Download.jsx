import React, { useState, useCallback, useMemo } from 'react';
import DashboardCard from '../../components/DashboardCard';
import DownloadTemplateGrid from '../../components/DownloadTemplateGrid.tsx';
import templatesData from '../../mock/templatesData.ts';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Download = () => {
  const [downloadStatus, setDownloadStatus] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Memory-optimized download handler with progress tracking
  const handleDownload = useCallback(async (template) => {
    const downloadId = `${template.name}-${Date.now()}`;
    
    try {
      setError('');
      setDownloadStatus(prev => ({
        ...prev,
        [downloadId]: { status: 'downloading', progress: 0 }
      }));

      // Simulate download progress
      const simulateDownload = () => {
        return new Promise((resolve, reject) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 25;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              setDownloadStatus(prev => ({
                ...prev,
                [downloadId]: { status: 'completed', progress: 100 }
              }));
              
              // Clean up status after 3 seconds
              setTimeout(() => {
                setDownloadStatus(prev => {
                  const newStatus = { ...prev };
                  delete newStatus[downloadId];
                  return newStatus;
                });
              }, 3000);
              
              resolve();
            } else {
              setDownloadStatus(prev => ({
                ...prev,
                [downloadId]: { status: 'downloading', progress: Math.min(progress, 95) }
              }));
            }
          }, 150);
        });
      };

      await simulateDownload();
      
      // In a real app, this would trigger the actual file download
      const blob = new Blob(['Mock template content'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.name}.${template.format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccessMessage(`Successfully downloaded: ${template.name}`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setError(`Failed to download ${template.name}. Please try again.`);
      setDownloadStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[downloadId];
        return newStatus;
      });
      
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  }, []);

  // Memory-optimized templates with download status
  const templatesWithStatus = useMemo(() => {
    return templatesData.map(template => {
      const activeDownload = Object.entries(downloadStatus).find(
        ([id, status]) => id.startsWith(template.name)
      );
      
      return {
        ...template,
        downloadStatus: activeDownload ? activeDownload[1] : null
      };
    });
  }, [templatesData, downloadStatus]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardCard title="Download Templates">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span className="text-green-700 text-sm">{successMessage}</span>
          </div>
        )}

        <DownloadTemplateGrid
          templates={templatesWithStatus}
          onDownload={handleDownload}
        />
        
        {/* Empty State for templates */}
        {templatesData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg width="80" height="80" fill="none" viewBox="0 0 80 80">
              <rect width="80" height="80" rx="16" fill="#F3F4F6"/>
              <path d="M24 56h32M28 32h24M32 40h16" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="mt-4 text-gray-400 text-lg">No templates found.</p>
          </div>
        )}
      </DashboardCard>
    </div>
  );
};

export default Download; 