import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiX, FiDollarSign, FiTrendingUp, FiPieChart, FiBarChart } from 'react-icons/fi';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
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

// Chart data (same as original FinancialInsights)
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

const FinancialInsightsFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const fabRef = useRef(null);

  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key to close the menu
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(!isOpen);
      
      // Reset animation state after transition
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div ref={fabRef} className="fixed bottom-24 right-6 z-50 group">
      {/* Main FAB Button */}
      <button
        onClick={toggleMenu}
        className={`w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-xl flex items-center justify-center transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 ${
          isOpen 
            ? 'rotate-45 scale-110 shadow-2xl' 
            : 'hover:scale-110 hover:shadow-2xl'
        } ${isAnimating ? 'animate-pulse' : ''}`}
        title={isOpen ? 'Close financial insights' : 'View financial insights'}
      >
        {/* Icon with smooth transition */}
        <div className="relative w-6 h-6">
          <FiPlus 
            className={`absolute inset-0 w-6 h-6 transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'
            }`} 
          />
          <FiX 
            className={`absolute inset-0 w-6 h-6 transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'
            }`} 
          />
        </div>
      </button>

      {/* Financial insights overlay - shows on hover when menu is closed */}
      {!isOpen && (
        <div className="absolute bottom-20 left-0 transform -translate-x-full translate-y-4 bg-white rounded-lg shadow-xl p-4 min-w-48 border border-gray-200 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 pointer-events-none">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Financial Insights</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Monthly Revenue:</span>
              <span className="font-medium text-green-600">R115 000</span>
            </div>
            <div className="flex justify-between">
              <span>Outstanding Invoices:</span>
              <span className="font-medium text-orange-600">31</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Success Rate:</span>
              <span className="font-medium text-blue-600">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Collection Time:</span>
              <span className="font-medium text-purple-600">18 days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialInsightsFAB; 