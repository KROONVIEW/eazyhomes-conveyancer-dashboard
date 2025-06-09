import React, { useEffect, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

// Lazy load heavy components to improve initial load time
const MattersPage = React.lazy(() => import("./pages/MattersPage"));
const MessagesPage = React.lazy(() => import("./pages/MessagesPage"));
const Documents = React.lazy(() => import("./pages/Documents.jsx"));
const TransfersPage = React.lazy(() => import("./pages/TransfersPage"));
const ClientsPage = React.lazy(() => import("./pages/ClientsPage"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));
const ArchivePage = React.lazy(() => import("./pages/ArchivePage"));
const InvoicePage = React.lazy(() => import("./pages/InvoicePage"));
const CalendarPage = React.lazy(() => import("./pages/CalendarPage"));
const SchedulingPage = React.lazy(() => import("./pages/SchedulingPage"));
const TasksPage = React.lazy(() => import("./pages/TasksPage"));
const Upload = React.lazy(() => import('./pages/documents/Upload.jsx'));
const Download = React.lazy(() => import('./pages/documents/Download.jsx'));
const KnowledgeBasePage = React.lazy(() => import('./pages/KnowledgeBasePage'));
const AuditTrailPage = React.lazy(() => import('./pages/AuditTrailPage'));
const ClientPortalPage = React.lazy(() => import('./pages/ClientPortalPage'));
const TestHooks = React.lazy(() => import('./pages/TestHooks'));

// Import authentication service
import authService from './services/authService';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

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
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
