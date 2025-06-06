import React, { useState } from 'react';
import FiltersBar from '../components/matters/FiltersBar';
import MatterList from '../components/matters/MatterList';
import MatterDetailsDrawer from '../components/matters/MatterDetailsDrawer';
import NewMatterDrawer from '../components/matters/NewMatterDrawer';
import RealTimeIndicator from '../components/RealTimeIndicator';
import DiagnosticPanel from '../components/DiagnosticPanel';
import { useMatterWorkflow } from '../hooks/useMatterWorkflow';

const MattersPage = () => {
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newMatterOpen, setNewMatterOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Debug log to check initial state
  console.log('🔍 MattersPage - newMatterOpen state:', newMatterOpen);
  
  // Backend integration - preserves existing UI behavior
  const { matters, loading, error, createMatter, updateMatterStatus } = useMatterWorkflow();

  const handleRowClick = (matter) => {
    setSelectedMatter(matter);
    setDrawerOpen(true);
  };

  const handleNewMatterClick = () => {
    console.log('🔍 New Matter button clicked - opening drawer');
    setNewMatterOpen(true);
  };

  const handleNewMatterClose = () => {
    console.log('🔍 New Matter drawer closing');
    setNewMatterOpen(false);
  };

  return (
      <div className="max-w-7xl mx-auto px-2 md:px-0 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-800">Matters</h1>
              <RealTimeIndicator 
                isConnected={!error} 
                lastUpdate={matters.length > 0 ? matters[0]?.updatedAt : null} 
              />
            </div>
            <div className="text-gray-500 text-sm mt-1">
              All active transfers, sorted by status and progress
              {matters.length > 0 && (
                <span className="ml-2 text-blue-600">• {matters.length} matters loaded</span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-lg font-semibold shadow transition text-sm ${
                isUpdating 
                  ? 'bg-yellow-500 text-white cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              disabled={isUpdating}
              onClick={async () => {
                try {
                  setIsUpdating(true);
                  // Test real-time sync by updating a matter
                  if (matters.length > 0) {
                    const firstMatter = matters[0];
                    const newProgress = Math.min(100, (firstMatter.progress || 0) + 10);
                    console.log('🧪 Test Sync clicked - updating progress from', firstMatter.progress, 'to', newProgress);
                    await updateMatterStatus(
                      firstMatter.id || firstMatter.firebaseId, 
                      firstMatter.status, 
                      firstMatter.stage, 
                      newProgress
                    );
                    console.log('🧪 Test update completed - check real-time sync!');
                  }
                } catch (err) {
                  console.error('Test update failed:', err);
                } finally {
                  setTimeout(() => setIsUpdating(false), 1000); // Reset after 1 second
                }
              }}
            >
              {isUpdating ? '⏳ Updating...' : '🧪 Test Sync'}
            </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition" onClick={handleNewMatterClick}>
              + New Matter
            </button>
          </div>
        </div>
        {/* Filters */}
        <FiltersBar />
        {/* Matter List */}
        <MatterList matters={matters} onRowClick={handleRowClick} loading={loading} />
        {/* Drawers */}
        <MatterDetailsDrawer 
          open={drawerOpen} 
          onClose={() => setDrawerOpen(false)} 
          matter={selectedMatter}
          onUpdateStatus={updateMatterStatus}
        />
        <NewMatterDrawer 
          open={newMatterOpen} 
        onClose={handleNewMatterClose} 
          onNext={() => setNewMatterOpen(false)}
          onCreateMatter={createMatter}
        />
        
        {/* Diagnostic Panel */}
        <DiagnosticPanel matters={matters} loading={loading} error={error} />
      </div>
  );
};

export default MattersPage; 