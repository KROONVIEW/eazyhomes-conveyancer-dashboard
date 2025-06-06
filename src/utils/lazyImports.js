// Lazy Import Utilities for Code Splitting
import { lazy } from 'react';

// Lazy load heavy components to reduce initial bundle size
export const LazyFinancialChart = lazy(() => import('../components/FinancialChart'));
export const LazyFinancialMetrics = lazy(() => import('../components/FinancialMetrics'));
export const LazyInvoicePage = lazy(() => import('../pages/InvoicePage'));
export const LazyMattersPage = lazy(() => import('../pages/MattersPage'));
export const LazyClientsPage = lazy(() => import('../pages/ClientsPage'));
export const LazyCalendarPage = lazy(() => import('../pages/CalendarPage'));
export const LazyTasksPage = lazy(() => import('../pages/TasksPage'));
export const LazyMessagesPage = lazy(() => import('../pages/MessagesPage'));
export const LazySettingsPage = lazy(() => import('../pages/SettingsPage'));
export const LazyKnowledgeBasePage = lazy(() => import('../pages/KnowledgeBasePage'));

// Lazy load chart libraries only when needed
export const LazyChartJS = lazy(() => import('chart.js/auto'));

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components likely to be used soon
  import('../components/FinancialChart');
  import('../components/FinancialMetrics');
}; 