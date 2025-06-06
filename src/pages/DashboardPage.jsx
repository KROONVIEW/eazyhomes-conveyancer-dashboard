import React, { useMemo, useCallback } from "react";
// import Layout from "../components/Layout"; // Remove Layout import
import StatCard from "../components/StatCard";
import DashboardCard from "../components/DashboardCard";
import stats from "../data/mockStats";
import * as Icons from "react-icons/fi";
import LineGraph from "../components/LineGraph";
import PieChart from "../components/PieChart";
import QuickActions from "../components/QuickActions";
import RecentTransactions from "../components/RecentTransactions";
import FinancialMetrics from '../components/FinancialMetrics';
import FinancialChart from '../components/FinancialChart';
import { 
  usePaymentTrends, 
  useRevenueByMatterType, 
  useInvoiceAging,
  useFinancialAnalytics 
} from '../hooks/useFinancialAnalytics';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Filler,
} from 'chart.js';
import TeamBroadcastCard from '../components/TeamBroadcastCard';
import PerformanceInsights from '../components/Dashboard/Insights/PerformanceInsights';
import WorkloadOverview from '../components/Dashboard/Insights/WorkloadOverview';
import FinancialInsightsFAB from '../components/FinancialInsightsFAB';
import ClientInsights from '../components/Dashboard/Insights/ClientInsights';
import ComplianceSnapshot from '../components/Dashboard/Insights/ComplianceSnapshot';
import NotificationBell from '../components/Notifications/NotificationBell';
import NotificationDrawer from '../components/Notifications/NotificationDrawer';
import NotificationToast from '../components/Notifications/NotificationToast';
import { FiMoreHorizontal, FiBell, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Legend, PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import HamburgerMenu from '../components/HamburgerMenu';
import { useState } from 'react';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Filler
);

// Placeholder imports for new widgets
// import FicaStatusCard from "../components/FicaStatusCard";
// import UpcomingDeadlinesCard from "../components/UpcomingDeadlinesCard";
// import AiInsightsCard from "../components/AiInsightsCard";
// import RecentMessagesCard from "../components/RecentMessagesCard";
// import TeamActivityCard from "../components/TeamActivityCard";

const sidebarIcons = [
  { icon: "FiGrid", label: "Dashboard" },
  { icon: "FiFileText", label: "Matters" },
  { icon: "FiCalendar", label: "Calendar" },
  { icon: "FiUsers", label: "Clients" },
  { icon: "FiUpload", label: "Documents" },
  { icon: "FiSettings", label: "Settings" },
];

const dashboardData = {
  activeTransfers: 12,
  dealsClosed: 87,
  docsOutstanding: 6,
  awaitingBank: 4,
  recentTransactions: [
    { client: 'Alice Smith', property: '12 Oak Ave', status: 'Lodged', dateInitiated: '2024-05-01', assignedTo: 'John Doe' },
    { client: 'Bob Johnson', property: '34 Pine Ln', status: 'Prep', dateInitiated: '2024-04-20', assignedTo: 'Jane Doe' },
  ],
  ficaStatus: {
    allDocsVerified: true,
    awaitingUploads: 3,
    expiredDocs: 1,
  },
  upcomingDeadlines: [
    { date: 'June 5', description: 'Offer Expiry - 123 Main St' },
    { date: 'June 10', description: 'Lodgement Date - 456 Oak Ave' },
  ],
  aiInsights: [
    'Potential bottleneck in Transfer #1015 (Waiting for bond approval).',
    'Suggest contacting Seller for 789 Pine Ln; offer response overdue.',
  ]
};

const lineData = {
  labels: ['May 1', 'May 2', 'May 3', 'May 4', 'May 5'],
  datasets: [
    {
      label: 'Transfers',
      data: [3, 7, 5, 6, 4],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
    },
  ],
};

const lineOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1A202C',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#A0AEC0' },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { color: '#A0AEC0' },
      beginAtZero: true,
    },
  },
};

const donutData = {
  labels: ['Lodged', 'Prep', 'Signed'],
  datasets: [
    {
      data: [4, 2, 3],
      backgroundColor: ['#6366f1', '#facc15', '#10b981'],
      borderWidth: 0,
    },
  ],
};

const donutOptions = {
  cutout: '75%',
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#6B7280',
        usePointStyle: true,
        boxWidth: 10,
        boxHeight: 10,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: '#1A202C',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderRadius: 8,
    },
  },
};

// Mock data for Transfer Volume
const transferVolumeData = [
  { name: 'May 1', Transfers: 3 },
  { name: 'May 2', Transfers: 5 },
  { name: 'May 3', Transfers: 4 },
  { name: 'May 4', Transfers: 6 },
  { name: 'May 5', Transfers: 4.5 },
  { name: 'May 6', Transfers: 5.5 },
  { name: 'May 7', Transfers: 7 },
  { name: 'May 8', Transfers: 6.2 },
  { name: 'May 9', Transfers: 7.5 },
  { name: 'May 10', Transfers: 8 }
];

// Mock data for Transfer Status Donut Chart
const transferStatusData = [
  { name: 'Lodged', value: 80, color: '#6A5ACD' },
  { name: 'Prep', value: 10, color: '#FFD700' },
  { name: 'Signed', value: 10, color: '#32CD32' }
];

// Custom Tooltip for Donut Chart
const DonutCustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, color: '#374151', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ fontWeight: 600, color: '#6366f1', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{value}%</div>
      </div>
    );
  }
  return null;
};

function OtherAnalyticsSection() {
  const [open, setOpen] = useState(false);
  const { chartData: paymentTrendData, loading: paymentLoading, error: paymentError } = usePaymentTrends();
  const { chartData: revenueData, loading: revenueLoading, error: revenueError } = useRevenueByMatterType();
  const { chartData: invoiceData, loading: invoiceLoading, error: invoiceError } = useInvoiceAging();
  const { data: profitabilityData, loading: profitLoading } = useFinancialAnalytics('profitability');

  return (
    <>
      <hr className="border-t border-gray-200 my-2" />
      <div className="other-analytics-section">
        <button
          className={`flex items-center justify-between w-full mb-4 px-2 py-4 rounded-lg transition-colors ${open ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          style={{ cursor: 'pointer' }}
        >
          <span
            className="font-semibold"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '20px', color: '#222' }}
          >
            Other
          </span>
          {open ? <FiChevronDown className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
        </button>
        {open && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FinancialChart
              type="line"
              data={paymentTrendData?.labels ? paymentTrendData.labels.map((label, index) => ({
                month: label,
                paymentsReceived: paymentTrendData.datasets[0]?.data[index] || 0,
                netPayments: paymentTrendData.datasets[1]?.data[index] || 0
              })) : []}
              loading={paymentLoading}
              error={paymentError}
              title="Payment Trends"
              height={350}
            />
            <FinancialChart
              type="bar"
              data={revenueData?.labels ? revenueData.labels.map((label, index) => ({
                type: label,
                revenue: revenueData.datasets[0]?.data[index] || 0
              })) : []}
              loading={revenueLoading}
              error={revenueError}
              title="Revenue by Matter Type"
              height={350}
            />
            <FinancialChart
              type="pie"
              data={invoiceData?.labels ? invoiceData.labels.map((label, index) => ({
                range: label,
                amount: invoiceData.datasets[0]?.data[index] || 0,
                color: invoiceData.datasets[0]?.backgroundColor[index]
              })) : []}
              loading={invoiceLoading}
              error={invoiceError}
              title="Invoice Aging Analysis"
              height={350}
            />
            <FinancialChart
              type="multiline"
              data={profitabilityData || []}
              loading={profitLoading}
              error={null}
              title="Profitability Analysis"
              height={350}
            />
          </div>
        )}
      </div>
    </>
  );
}

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [unreadCount, setUnreadCount] = React.useState(2); // mock
  const [showTransferModal, setShowTransferModal] = React.useState(false);
  const [showUploadModal, setShowUploadModal] = React.useState(false);

  // Financial analytics hooks
  const { chartData: paymentTrendData, loading: paymentLoading, error: paymentError } = usePaymentTrends();
  const { chartData: revenueData, loading: revenueLoading, error: revenueError } = useRevenueByMatterType();
  const { chartData: invoiceData, loading: invoiceLoading, error: invoiceError } = useInvoiceAging();
  const { data: profitabilityData, loading: profitLoading } = useFinancialAnalytics('profitability');
  const [transferForm, setTransferForm] = React.useState({ client: '', property: '', type: '' });
  const [transferLoading, setTransferLoading] = React.useState(false);
  const [transferError, setTransferError] = React.useState('');
  const [transferSuccess, setTransferSuccess] = React.useState(false);
  const [uploadForm, setUploadForm] = React.useState({ file: null, description: '' });
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const navigate = useNavigate();
  
  // Memoized calculations and data
  const memoizedDashboardData = useMemo(() => dashboardData, []);
  const memoizedTransferVolumeData = useMemo(() => transferVolumeData, []);
  const memoizedTransferStatusData = useMemo(() => transferStatusData, []);
  
  // Hybrid donut center state
  const [activeIndex, setActiveIndex] = React.useState(null);
  const total = useMemo(() => memoizedTransferStatusData.reduce((sum, d) => sum + d.value, 0), [memoizedTransferStatusData]);

  // Optimized handler for marking notification as read (simulate toast)
  const handleMarkAsRead = useCallback((msg) => {
    setToast({ message: msg, type: 'info' });
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col bg-gray-50 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 w-full">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex-grow mx-4">
            <SearchBar />
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
                 <input type="text" className="date-picker-input bg-white border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="Start Date" />
                 <input type="text" className="date-picker-input bg-white border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="End Date" />
            </div>
            <div className="header-icon-button ellipsis-icon relative">
              <HamburgerMenu triggerIcon={<FiMoreHorizontal className="w-6 h-6 text-gray-600" />} />
            </div>
            <div className="header-icon-button notification-icon relative cursor-pointer p-2 rounded-full hover:bg-gray-100" onClick={() => setDrawerOpen(true)}>
              <FiBell className="w-6 h-6 text-gray-600"/>
              {unreadCount > 0 && <span className="notification-badge absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>}
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full'>
          <DashboardCard
            data-tooltip-id="active-transfers-tooltip"
            data-tooltip-html="<div style='margin-bottom:6px;'>Total active transfers...</div><a href='/matters' ...>View Details</a>"
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className='p-3 rounded-full bg-blue-50 text-blue-600'>
                <Icons.FiActivity className='w-6 h-6' data-tooltip-id="icon-tooltip" data-tooltip-content="Active transfers" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-1">{memoizedDashboardData.activeTransfers}</p>
            <p className="text-sm text-gray-500">Active Transfers</p>
          </DashboardCard>
          <DashboardCard
            data-tooltip-id="deals-closed-tooltip"
            data-tooltip-html="<div style='margin-bottom:6px;'>Total deals successfully completed...</div><a href='/matters?filter=closed' ...>View Details</a>"
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className='p-3 rounded-full bg-green-50 text-green-600'>
                <Icons.FiCheckCircle className='w-6 h-6' />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-1">{memoizedDashboardData.dealsClosed}</p>
            <p className="text-sm text-gray-500">Deals Closed</p>
          </DashboardCard>
          <DashboardCard
            data-tooltip-id="docs-outstanding-tooltip"
            data-tooltip-html="<div style='margin-bottom:6px;'>Critical documents required...</div><a href='/matters?filter=docs' ...>View Details</a>"
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className='p-3 rounded-full bg-yellow-50 text-yellow-600'>
                <Icons.FiFileText className='w-6 h-6' />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-1">{memoizedDashboardData.docsOutstanding}</p>
            <p className="text-sm text-gray-500">Docs Outstanding</p>
          </DashboardCard>
          <DashboardCard
            data-tooltip-id="awaiting-bank-tooltip"
            data-tooltip-html="<div style='margin-bottom:6px;'>Transfers pending approval...</div><a href='/matters?filter=bank' ...>View Details</a>"
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className='p-3 rounded-full bg-red-50 text-red-600'>
                <Icons.FiClock className='w-6 h-6' />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-1">{memoizedDashboardData.awaitingBank}</p>
            <p className="text-sm text-gray-500">Awaiting Bank</p>
          </DashboardCard>

          <DashboardCard title="Team Broadcast" className="sm:col-span-1">
            <TeamBroadcastCard />
          </DashboardCard>

          <DashboardCard title="Transfer Volume" className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={memoizedTransferVolumeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTransfers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', color: '#374151' }} labelStyle={{ color: '#6366f1' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#6366f1', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="Transfers" stroke="#6366f1" fillOpacity={1} fill="url(#colorTransfers)" />
                  <Line type="monotone" dataKey="Transfers" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard title="Transfer Status">
            <div className="h-64 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={memoizedTransferStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    onMouseEnter={(_, idx) => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {memoizedTransferStatusData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutCustomTooltip />} position={{ x: 220, y: 80 }} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                {activeIndex === null ? (
                  <span className="text-2xl font-bold text-gray-800">{total}%</span>
                ) : (
                  <>
                    <span className="text-xl font-bold text-gray-800">{memoizedTransferStatusData[activeIndex].value}%</span>
                    <span className="text-xs text-gray-500">{memoizedTransferStatusData[activeIndex].name}</span>
                  </>
                )}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Transactions" className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Initiated</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {memoizedDashboardData.recentTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900" data-tooltip-id="client-tooltip" data-tooltip-content={`Client: ${transaction.client}`}>{transaction.client}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{transaction.property}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'Lodged' ? 'bg-blue-100 text-blue-800' :
                          transaction.status === 'Prep' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{transaction.dateInitiated}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{transaction.assignedTo}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>

          <DashboardCard title="Quick Actions">
            <div className="flex flex-col space-y-4">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md"
                onClick={() => setShowTransferModal(true)}
                data-tooltip-id="quick-action-tooltip"
                data-tooltip-content="Start a new property transfer process for a client."
              >
                Start New Transfer
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                onClick={() => setShowUploadModal(true)}>
                Upload General Document
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                onClick={() => navigate('/messages')}>
                Initiate Secure Chat
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                onClick={() => navigate('/documents')}>
                View All FICA Submissions
              </button>
            </div>
          </DashboardCard>

          <DashboardCard title="FICA Compliance Overview">
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-700">
                <Icons.FiCheckCircle className="w-5 h-5 text-green-500 mr-2" /> All Required FICA Docs Verified
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Icons.FiClock className="w-5 h-5 text-yellow-500 mr-2" /> {memoizedDashboardData.ficaStatus.awaitingUploads} Transfers Awaiting FICA Uploads
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Icons.FiActivity className="w-5 h-5 text-red-500 mr-2" /> {memoizedDashboardData.ficaStatus.expiredDocs} FICA Document Expired (Action Needed)
              </li>
            </ul>
          </DashboardCard>

          <DashboardCard title="Upcoming Deadlines">
            <ul className="space-y-3">
              {memoizedDashboardData.upcomingDeadlines.map((item, index) => (
                <li key={index} className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-600">{item.date}:</span> {item.description}
                </li>
              ))}
            </ul>
          </DashboardCard>

          <DashboardCard title="AI Insights">
            <ul className="space-y-3">
              {memoizedDashboardData.aiInsights.map((insight, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <Icons.FiActivity className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-1" /> {insight}
                </li>
              ))}
            </ul>
          </DashboardCard>

          <div className="col-span-full space-y-8">
            <PerformanceInsights />
            <WorkloadOverview />
            <ClientInsights />
            <ComplianceSnapshot />
          </div>

          {/* New Financial Analytics Section */}
          <div className="col-span-full space-y-8">
            <FinancialMetrics />
            <OtherAnalyticsSection />
          </div>
        </div>
      </div>
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowTransferModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Start New Transfer</h2>
            {transferSuccess ? (
              <div className="text-green-600 font-semibold mb-4">Transfer created successfully!</div>
            ) : (
              <form onSubmit={async e => {
                e.preventDefault();
                setTransferError('');
                if (!transferForm.client || !transferForm.property || !transferForm.type) {
                  setTransferError('All fields are required.');
                  return;
                }
                setTransferLoading(true);
                try {
                  // --- REAL API CALL ---
                  const res = await fetch('/api/transfers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transferForm),
                  });
                  if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.message || 'Failed to create transfer.');
                  }
                  setTransferSuccess(true);
                  setTransferForm({ client: '', property: '', type: '' });
                } catch (err) {
                  setTransferError(err.message || 'Failed to create transfer.');
                } finally {
                  setTransferLoading(false);
                }
              }}>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Client Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={transferForm.client} onChange={e => setTransferForm(f => ({ ...f, client: e.target.value }))} />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Property</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={transferForm.property} onChange={e => setTransferForm(f => ({ ...f, property: e.target.value }))} />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md" value={transferForm.type} onChange={e => setTransferForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="">Select type</option>
                    <option value="Freehold">Freehold</option>
                    <option value="Sectional">Sectional</option>
                    <option value="Estate">Estate</option>
                  </select>
                </div>
                {transferError && <div className="text-red-600 text-sm mb-2">{transferError}</div>}
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowTransferModal(false)} disabled={transferLoading}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold" disabled={transferLoading}>{transferLoading ? 'Saving...' : 'Save Transfer'}</button>
                </div>
              </form>
            )}
            {transferSuccess && <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setShowTransferModal(false); setTransferSuccess(false); }}>Close</button>}
          </div>
        </div>
      )}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Upload General Document</h2>
            {uploadSuccess ? (
              <div className="text-green-600 font-semibold mb-4">Document uploaded successfully!</div>
            ) : (
              <form onSubmit={async e => {
                e.preventDefault();
                setUploadError('');
                if (!uploadForm.file || !uploadForm.description) {
                  setUploadError('All fields are required.');
                  return;
                }
                setUploadLoading(true);
                try {
                  // --- REAL API CALL ---
                  const formData = new FormData();
                  formData.append('file', uploadForm.file);
                  formData.append('description', uploadForm.description);
                  const res = await fetch('/api/documents/upload', {
                    method: 'POST',
                    body: formData,
                  });
                  if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.message || 'Failed to upload document.');
                  }
                  setUploadSuccess(true);
                  setUploadForm({ file: null, description: '' });
                } catch (err) {
                  setUploadError(err.message || 'Failed to upload document.');
                } finally {
                  setUploadLoading(false);
                }
              }}>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">File</label>
                  <input type="file" className="w-full" onChange={e => setUploadForm(f => ({ ...f, file: e.target.files[0] }))} />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                {uploadError && <div className="text-red-600 text-sm mb-2">{uploadError}</div>}
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowUploadModal(false)} disabled={uploadLoading}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold" disabled={uploadLoading}>{uploadLoading ? 'Uploading...' : 'Upload'}</button>
                </div>
              </form>
            )}
            {uploadSuccess && <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setShowUploadModal(false); setUploadSuccess(false); }}>Close</button>}
          </div>
        </div>
      )}
      <Tooltip
        id="active-transfers-tooltip"
        place="top"
        effect="solid"
        html={true}
        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 15, fontSize: '0.9em', color: '#333', maxWidth: 250, zIndex: 9999 }}
        arrowColor="#fff"
      />
      <Tooltip
        id="deals-closed-tooltip"
        place="top"
        effect="solid"
        html={true}
        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 15, fontSize: '0.9em', color: '#333', maxWidth: 250, zIndex: 9999 }}
        arrowColor="#fff"
      />
      <Tooltip
        id="docs-outstanding-tooltip"
        place="top"
        effect="solid"
        html={true}
        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 15, fontSize: '0.9em', color: '#333', maxWidth: 250, zIndex: 9999 }}
        arrowColor="#fff"
      />
      <Tooltip
        id="awaiting-bank-tooltip"
        place="top"
        effect="solid"
        html={true}
        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 15, fontSize: '0.9em', color: '#333', maxWidth: 250, zIndex: 9999 }}
        arrowColor="#fff"
      />
      <Tooltip
        id="icon-tooltip"
        place="right"
        effect="solid"
        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 15, fontSize: '0.9em', color: '#333', maxWidth: 250, zIndex: 9999 }}
        arrowColor="#fff"
      />
      <Tooltip
        id="quick-action-tooltip"
        place="top"
        effect="solid"
        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 15, fontSize: '0.9em', color: '#333', maxWidth: 250, zIndex: 9999 }}
        arrowColor="#fff"
      />
      <Tooltip
        id="client-tooltip"
        place="top"
        effect="solid"
        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 15, fontSize: '0.9em', color: '#333', maxWidth: 250, zIndex: 9999 }}
        arrowColor="#fff"
      />
      
      {/* Financial Analytics Diagnostic - Removed as requested */}
      
      {/* Financial Insights FAB */}
      <FinancialInsightsFAB />
    </>
  );
};

export default Dashboard; 