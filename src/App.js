import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
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
import TestHooks from './pages/TestHooks';

// Import authentication service
import authService from './services/authService';

function App() {
  // Simplified initialization without complex memory management
  useEffect(() => {
    console.log('🚀 Initializing EasyHomes Dashboard');
    
    // Initialize authentication service
    authService.init().then(() => {
      console.log('🔐 Authentication service initialized');
    }).catch(error => {
      console.error('❌ Authentication initialization failed:', error);
    });

    // Cleanup function
    return () => {
      authService.cleanup();
      console.log('🧹 App component cleanup completed');
    };
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Conveyancer Dashboard Routes - Main Layout (Protected) */}
      <Route path="/*" element={
        <ProtectedRoute>
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
              <Route path="/audit-trail" element={
                <ProtectedRoute requiredPermission="view_reports">
                  <AuditTrailPage />
                </ProtectedRoute>
              } />
              <Route path="/client-portal" element={<ClientPortalPage />} />
              <Route path="/test-hooks" element={<TestHooks />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
