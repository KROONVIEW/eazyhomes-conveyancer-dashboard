import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MobileLayout from "./components/MobileLayout";
import DashboardPage from "./pages/DashboardPage";
import MattersPage from "./pages/MattersPage";
import MessagesPage from "./pages/MessagesPage";
import Documents from "./pages/Documents.jsx";
import TransfersPage from "./pages/TransfersPage";
import ClientsPage from "./pages/ClientsPage";
import SettingsPage from "./pages/SettingsPage";
import ArchivePage from "./pages/ArchivePage";
import InvoicePage from "./pages/InvoicePage";
import CalendarPage from "./pages/CalendarPage";
import SchedulingPage from "./pages/SchedulingPage";
import TasksPage from "./pages/TasksPage";
import Upload from './pages/documents/Upload.jsx';
import Download from './pages/documents/Download.jsx';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import AuditTrailPage from './pages/AuditTrailPage';
import ClientPortalPage from './pages/ClientPortalPage';
import MobilePortalPage from './pages/MobilePortalPage';
import TestHooks from './pages/TestHooks';

// Import advanced memory management system
import advancedMemoryManager from './utils/advancedMemoryManager';
import { useMemoryOptimization } from './utils/advancedMemoryManager';

// Legacy optimizers for fallback
import performanceBooster from './utils/performanceBooster';
import memoryOptimizer from './utils/memoryOptimizer';
import emergencyPerformanceBoost from './utils/emergencyPerformanceBoost';

function App() {
  const { registerComponent, unregisterComponent, getMemoryStats } = useMemoryOptimization();

  // Initialize advanced memory management system
  useEffect(() => {
    console.log('🚀 Initializing EasyHomes Dashboard with Advanced Memory Management');
    
    // Register the main App component
    registerComponent(App, {
      type: 'root-app',
      timestamp: Date.now(),
      version: '2.0.0'
    });

    // Initialize legacy optimizers as fallback
    try {
      performanceBooster.boostPerformance();
      memoryOptimizer.optimizeMemory();
      emergencyPerformanceBoost.runEmergencyBoost();
    } catch (error) {
      console.warn('Legacy optimizers failed, relying on advanced memory manager:', error);
    }

    // Log initial memory stats
    const initialStats = getMemoryStats();
    console.log('📊 Initial Memory Stats:', initialStats);

    // Setup periodic memory reporting
    const memoryReportInterval = setInterval(() => {
      const stats = getMemoryStats();
      console.log('📊 Memory Stats Update:', {
        memoryUsage: `${stats.memoryInfo.percentage}% (${stats.memoryInfo.used}MB/${stats.memoryInfo.total}MB)`,
        cacheCount: stats.cacheCount,
        eventListeners: stats.eventListenerCount,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 30000); // Every 30 seconds

    // Cleanup function
    return () => {
      clearInterval(memoryReportInterval);
      unregisterComponent(App);
      console.log('🧹 App component cleanup completed');
    };
  }, [registerComponent, unregisterComponent, getMemoryStats]);

  // Handle critical memory situations
  useEffect(() => {
    const handleMemoryWarning = () => {
      console.warn('⚠️ Memory warning detected, triggering cleanup');
      const stats = getMemoryStats();
      if (stats.memoryInfo.percentage > 90) {
        // Force aggressive cleanup
        advancedMemoryManager.triggerEmergencyCleanup();
      }
    };

    // Listen for memory pressure events
    if ('memory' in navigator) {
      navigator.memory?.addEventListener?.('memorywarning', handleMemoryWarning);
    }

    // Listen for page visibility changes to optimize memory
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📱 Page hidden, optimizing memory usage');
        advancedMemoryManager.triggerWarningCleanup();
      } else {
        console.log('📱 Page visible, resuming normal operation');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if ('memory' in navigator) {
        navigator.memory?.removeEventListener?.('memorywarning', handleMemoryWarning);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <Routes>
      {/* Mobile Portal Route - Separate Layout */}
      <Route path="/portal" element={
        <MobileLayout>
          <MobilePortalPage />
        </MobileLayout>
      } />
      
      {/* Conveyancer Dashboard Routes - Main Layout */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/matters" element={<MattersPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/documents/upload" element={<Upload />} />
            <Route path="/documents/download" element={<Download />} />
            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/scheduling" element={<SchedulingPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="/audit-trail" element={<AuditTrailPage />} />
            <Route path="/client-portal" element={<ClientPortalPage />} />
            <Route path="/test-hooks" element={<TestHooks />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
}

export default App;
