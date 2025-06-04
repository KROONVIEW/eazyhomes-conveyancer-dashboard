import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FiShield, FiAlertTriangle, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ficaData = {
  labels: ['Complete', 'Pending', 'Expired'],
  datasets: [
    {
      data: [70, 25, 5],
      backgroundColor: ['#10b981', '#facc15', '#ef4444'],
      borderWidth: 0,
    },
  ],
};

const ficaOptions = {
  cutout: '75%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

const complianceAlerts = [
  { type: 'warning', message: '3 matters require urgent FICA action.' },
  { type: 'info', message: '1 FICA document expired this week.' },
];

const legendItems = [
  { color: '#10b981', label: 'Complete', value: 70 },
  { color: '#facc15', label: 'Pending', value: 25 },
  { color: '#ef4444', label: 'Expired', value: 5 },
];

export default function ComplianceSnapshot() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <button
        className={`flex items-center justify-between w-full mb-4 px-2 py-4 rounded-lg transition-colors ${open ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{ cursor: 'pointer' }}
      >
        <h2 className="text-xl font-bold text-left">Compliance Snapshot</h2>
        {open ? <FiChevronDown className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
      </button>
      {open && (
        <>
          {/* FICA Progress */}
          <div className="bg-white rounded-xl shadow p-6 mb-4 flex items-center gap-4">
            <div className="bg-green-100 text-green-600 rounded-full p-3">
              <FiShield className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">FICA Progress</h3>
              <div className="flex flex-col items-center justify-center h-56">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <Doughnut data={ficaData} options={ficaOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-green-600">70%</span>
                    <span className="text-xs text-gray-500">FICA Complete</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center mt-4 space-x-6">
                  {legendItems.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-1 mb-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-xs text-gray-700">{item.label}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Compliance Alerts */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="bg-yellow-100 text-yellow-600 rounded-full p-3">
              <FiAlertTriangle className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Compliance Alerts</h3>
              <ul className="space-y-2">
                {complianceAlerts.map((alert, idx) => (
                  <li key={idx} className={`flex items-center text-sm ${
                    alert.type === 'warning'
                      ? 'text-yellow-700'
                      : alert.type === 'info'
                      ? 'text-blue-700'
                      : 'text-gray-700'
                  }`}>
                    {alert.type === 'warning' && (
                      <span className="w-4 h-4 mr-2 rounded-full bg-yellow-400 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </span>
                    )}
                    {alert.type === 'info' && (
                      <span className="w-4 h-4 mr-2 rounded-full bg-blue-400 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                      </span>
                    )}
                    {alert.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 