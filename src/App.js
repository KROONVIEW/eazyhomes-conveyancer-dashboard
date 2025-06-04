import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
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

function App() {
  return (
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
  );
}

export default App;
