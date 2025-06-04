import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ width = 200, height = 200 }) {
  const data = {
    labels: ['Lodged', 'Prep', 'Signed'],
    datasets: [
      {
        data: [4, 2, 3],
        backgroundColor: ['#6366f1', '#facc15', '#10b981'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 h-full flex flex-col justify-between">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Transfer Status</h3>
      <div className="flex-1 flex items-center justify-center">
        <div style={{ width, height }}>
          <Pie data={data} options={options} width={width} height={height} />
        </div>
      </div>
    </div>
  );
} 