import React, { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const revenueData = {
  labels: ['Transfer', 'Bond', 'Deceased Estate', 'Sectional Title', 'Other', 'Commercial', 'Auction', 'Trust', 'Divorce', 'Donation'],
  datasets: [
    {
      label: 'Revenue (R)',
      data: [120000, 95000, 40000, 60000, 20000, 85000, 30000, 45000, 25000, 15000],
      backgroundColor: [
        '#6366f1', '#10b981', '#facc15', '#f59e42', '#ef4444', '#3b82f6', '#a21caf', '#eab308', '#14b8a6', '#f472b6'
      ],
      borderRadius: 6,
    },
  ],
};

const revenueOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
  },
};

const invoiceAgingData = {
  labels: ['0-30d', '31-60d', '61-90d', '91-120d', '121-180d', '180+d'],
  datasets: [
    {
      label: 'Invoices',
      data: [12, 8, 5, 3, 2, 1],
      backgroundColor: ['#10b981', '#facc15', '#f59e42', '#ef4444', '#6366f1', '#a21caf'],
      borderWidth: 0,
    },
  ],
};

const invoiceAgingOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

const paymentTrendData = {
  labels: [
    'Jan 23', 'Feb 23', 'Mar 23', 'Apr 23', 'May 23', 'Jun 23', 'Jul 23', 'Aug 23', 'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23',
    'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24'
  ],
  datasets: [
    {
      label: 'Payments Received (R)',
      data: [30000, 42000, 35000, 50000, 60000, 55000, 70000, 68000, 72000, 69000, 75000, 80000, 82000, 85000, 87000, 90000, 95000, 98000, 100000, 102000, 105000, 108000, 110000, 115000],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.15)',
      tension: 0.4,
      fill: true,
      pointRadius: 3,
    },
    {
      label: 'Refunds (R)',
      data: [2000, 1500, 1800, 2200, 2100, 1700, 2500, 2300, 2100, 1900, 2000, 2200, 2100, 2000, 2300, 2500, 2400, 2600, 2700, 2500, 2300, 2200, 2100, 2000],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239,68,68,0.10)',
      tension: 0.4,
      fill: true,
      pointRadius: 3,
    },
    {
      label: 'Chargebacks (R)',
      data: [500, 700, 600, 800, 900, 1000, 950, 1100, 1200, 1150, 1300, 1400, 1350, 1200, 1100, 1000, 950, 900, 850, 800, 750, 700, 650, 600],
      borderColor: '#facc15',
      backgroundColor: 'rgba(250,204,21,0.10)',
      tension: 0.4,
      fill: true,
      pointRadius: 3,
    },
  ],
};

const paymentTrendOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
  },
};

export default function FinancialInsights() {
  const [open, setOpen] = useState(false);
  return (
    <div className="financial-insights-section">
      <button
        className={`flex items-center justify-between w-full mb-4 px-2 py-4 rounded-lg transition-colors ${open ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{ cursor: 'pointer' }}
      >
        <h2 className="text-xl font-bold text-left">Financial Insights</h2>
        {open ? <FiChevronDown className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
      </button>
      {open && (
        <div className="financial-charts-layout flex flex-col gap-5">
          {/* Payment Trend Graph - full width */}
          <div className="payment-trend-graph-widget w-full">
            <div className="bg-white rounded shadow p-4 mb-0">
              <h3 className="font-semibold text-lg mb-2">Payment Trend Graph</h3>
              <div className="h-80 w-full p-0 m-0" style={{margin:0,padding:0}}>
                <Line data={paymentTrendData} options={{ ...paymentTrendOptions, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
          {/* Bottom row: Revenue by Matter Type & Invoice Aging Chart */}
          <div className="bottom-financial-charts-row flex gap-5">
            <div className="revenue-by-matter-type-chart-widget flex-1 min-w-0">
              <div className="bg-white rounded shadow p-4 h-full">
                <h3 className="font-semibold text-lg mb-2">Revenue by Matter Type</h3>
                <div className="h-56">
                  <Bar data={revenueData} options={revenueOptions} />
                </div>
              </div>
            </div>
            <div className="invoice-aging-chart-widget flex-1 min-w-0">
              <div className="bg-white rounded shadow p-4 h-full">
                <h3 className="font-semibold text-lg mb-2">Invoice Aging Chart</h3>
                <div className="h-56 flex items-center justify-center">
                  <Doughnut data={invoiceAgingData} options={invoiceAgingOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 