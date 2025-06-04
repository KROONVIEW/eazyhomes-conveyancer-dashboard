import React, { useState } from 'react';
import { FiTrendingUp, FiUserCheck, FiAlertCircle, FiChevronDown, FiChevronRight } from 'react-icons/fi';

export default function PerformanceInsights() {
  const [open, setOpen] = useState(false);
  return (
    <div className="performance-insights-section">
      <button
        className={`flex items-center justify-between w-full mb-4 px-2 py-4 rounded-lg transition-colors ${open ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{ cursor: 'pointer' }}
      >
        <h2 className="text-xl font-bold text-left">Performance Insights</h2>
        {open ? <FiChevronDown className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
      </button>
      {open && (
        <div className="performance-widgets-layout flex flex-col gap-5">
          {/* Average Time to Close Matter - full width */}
          <div className="average-time-to-close-matter-widget">
            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 mb-0">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3">
                <FiTrendingUp className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Average Time to Close Matter</h3>
                <div className="text-3xl font-bold text-blue-700">14 days</div>
                <div className="text-xs text-gray-500">(Mock data: Replace with real metric)</div>
              </div>
            </div>
          </div>
          {/* Bottom row: Top-Performing Staff & Workflow Bottleneck Detection */}
          <div className="bottom-widgets-row flex gap-5">
            <div className="top-performing-staff-widget flex-1 min-w-0">
              <div className="bg-white rounded-xl shadow p-6 h-full">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><FiUserCheck className="w-5 h-5 text-green-500" /> Top-Performing Staff</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="inline-block w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">TM</span>
                    <span className="font-medium text-gray-800">Thuli M.</span>
                    <span className="ml-auto text-xs text-gray-500">8 matters</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-block w-9 h-9 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-700">KS</span>
                    <span className="font-medium text-gray-800">Kabelo S.</span>
                    <span className="ml-auto text-xs text-gray-500">5 matters</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="workflow-bottleneck-detection-widget flex-1 min-w-0">
              <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 h-full">
                <div className="bg-yellow-100 text-yellow-600 rounded-full p-3">
                  <FiAlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Workflow Bottleneck Detection</h3>
                  <div className="text-gray-700">Lodgement stage (5 matters delayed)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 