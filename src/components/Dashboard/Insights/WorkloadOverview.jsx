import React, { useEffect, useRef, useState } from 'react';
import { FiUsers, FiBarChart2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const staffWorkload = [
  { name: 'Thuli M.', matters: 8, color: 'bg-blue-500' },
  { name: 'Kabelo S.', matters: 5, color: 'bg-green-500' },
];
const maxMatters = Math.max(...staffWorkload.map(s => s.matters));

const distributionData = {
  labels: ['Transfers', 'Bonds', 'Estates'],
  datasets: [
    {
      label: 'Matters',
      data: [12, 7, 4],
      backgroundColor: ['#6366f1', '#10b981', '#facc15'],
      borderRadius: 6,
    },
  ],
};

const distributionOptions = {
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

// For animated total
function useAnimatedCount(target, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = (timestamp) => {
      if (!start) {start = timestamp;}
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
    return () => setCount(target);
  }, [target, duration]);
  return count;
}

export default function WorkloadOverview() {
  const [open, setOpen] = useState(false);
  const totalMatters = distributionData.datasets[0].data.reduce((a, b) => a + b, 0);
  const animatedTotal = useAnimatedCount(totalMatters, 1200);

  const donutData = {
    labels: distributionData.labels,
    datasets: [
      {
        data: distributionData.datasets[0].data,
        backgroundColor: distributionData.datasets[0].backgroundColor,
        borderWidth: 0,
      },
    ],
  };
  const donutOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  const modernBarData = {
    labels: distributionData.labels,
    datasets: [
      {
        label: 'Matters',
        data: distributionData.datasets[0].data,
        backgroundColor: distributionData.datasets[0].backgroundColor,
        borderRadius: 12,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  };
  const modernBarOptions = {
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

  return (
    <>
      <hr className="border-t border-gray-200 my-2" />
      <div className="workload-overview-section flex flex-col gap-6">
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
            Workload Overview
          </span>
          {open ? <FiChevronDown className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
        </button>
        {open && (
          <>
            <div className="workload-per-staff-member-widget">
              <div className="bg-white rounded-xl shadow p-6 mb-0">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><FiUsers className="w-5 h-5 text-blue-500" /> Workload per Staff Member</h3>
                <ul className="space-y-4">
                  {staffWorkload.map((staff, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <span className={`inline-block w-9 h-9 rounded-full ${staff.color} bg-opacity-20 flex items-center justify-center font-bold text-lg text-gray-800`}>{staff.name.split(' ').map(n => n[0]).join('')}</span>
                      <span className="font-medium text-gray-800 w-32">{staff.name}</span>
                      <div className="flex-1">
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className={`${staff.color} h-3 rounded-full`} style={{ width: `${(staff.matters / maxMatters) * 100}%` }}></div>
                        </div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">{staff.matters} matters</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="distribution-chart-widget flex justify-start">
              <div className="bg-white rounded-xl shadow p-4 w-1/2">
                <h3 className="font-semibold text-lg mb-2">Distribution Chart</h3>
                <div className="h-32 w-full">
                  <Bar data={modernBarData} options={{ ...modernBarOptions, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
} 