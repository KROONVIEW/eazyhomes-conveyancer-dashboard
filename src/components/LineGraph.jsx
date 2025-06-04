import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineGraph = () => {
  const data = {
    labels: ["May 1", "May 2", "May 3", "May 4", "May 5"],
    datasets: [
      {
        label: "Transfers",
        data: [3, 7, 5, 6, 4],
        fill: false,
        borderColor: "#6366f1",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-md font-semibold mb-2 text-gray-700">Transfer Volume</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph; 