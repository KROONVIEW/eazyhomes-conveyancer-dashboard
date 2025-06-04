import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FiUsers, FiPieChart, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const topClientsData = {
  labels: [
    'Lindiwe Nkosi',
    'Sipho Dlamini',
    'Thabo Mokoena',
    'Fatima Patel',
    'John Smith',
  ],
  datasets: [
    {
      label: 'Matters',
      data: [12, 10, 8, 7, 6],
      backgroundColor: '#10b981',
      borderRadius: 6,
    },
  ],
};

const topClientsOptions = {
  indexAxis: 'y',
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { grid: { display: false } },
  },
};

const contributionTypes = [
  { label: 'Matters', key: 'matters' },
  { label: 'Revenue', key: 'revenue' },
];

const contributionDataMap = {
  matters: {
    labels: ['Lindiwe Nkosi', 'Sipho Dlamini', 'Thabo Mokoena', 'Fatima Patel', 'John Smith'],
    datasets: [
      {
        label: 'Matters',
        data: [12, 10, 8, 7, 6],
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#facc15',
          '#f59e42',
          '#ef4444',
        ],
        borderWidth: 0,
      },
    ],
  },
  revenue: {
    labels: ['Lindiwe Nkosi', 'Sipho Dlamini', 'Thabo Mokoena', 'Fatima Patel', 'John Smith'],
    datasets: [
      {
        label: 'Revenue (R)',
        data: [120000, 95000, 80000, 70000, 60000],
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#facc15',
          '#f59e42',
          '#ef4444',
        ],
        borderWidth: 0,
      },
    ],
  },
};

const contributionOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

const legendLabels = [
  { color: '#6366f1', label: 'Lindiwe Nkosi' },
  { color: '#10b981', label: 'Sipho Dlamini' },
  { color: '#facc15', label: 'Thabo Mokoena' },
  { color: '#f59e42', label: 'Fatima Patel' },
  { color: '#ef4444', label: 'John Smith' },
];

export default function ClientInsights() {
  const [contributionType, setContributionType] = useState('matters');
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <button
        className={`flex items-center justify-between w-full mb-4 px-2 py-4 rounded-lg transition-colors ${open ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{ cursor: 'pointer' }}
      >
        <h2 className="text-xl font-bold text-left">Client Insights</h2>
        {open ? <FiChevronDown className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
      </button>
      {open && (
        <div className="flex gap-6">
          {/* Top 5 Clients by Volume */}
          <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><FiUsers className="w-5 h-5 text-green-500" /> Top 5 Clients by Volume</h3>
            <div className="h-56">
              <Bar data={topClientsData} options={topClientsOptions} />
            </div>
          </div>
          {/* Client Contribution */}
          <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2"><FiPieChart className="w-5 h-5 text-blue-500" /> Client Contribution</h3>
              <div className="flex space-x-2">
                {contributionTypes.map((type) => (
                  <button
                    key={type.key}
                    className={`px-3 py-1 rounded text-sm font-medium border transition-colors focus:outline-none ${
                      contributionType === type.key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setContributionType(type.key)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-72">
              <div className="h-48 w-48 flex items-center justify-center">
                <Doughnut data={contributionDataMap[contributionType]} options={contributionOptions} />
              </div>
              <div className="flex flex-wrap justify-center mt-4 space-x-4">
                {legendLabels.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1 mb-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-xs text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 