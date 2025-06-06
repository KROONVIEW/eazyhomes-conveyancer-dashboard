import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const FinancialChart = ({ 
  type, 
  data, 
  loading, 
  error, 
  title, 
  height = 300,
  showLegend = true,
  colors = ['#6366f1', '#10b981', '#facc15', '#f59e42', '#ef4444']
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="text-red-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-red-500 text-center">
            <p className="font-medium">Failed to load chart</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-gray-500">No data available</div>
        </div>
      </div>
    );
  }

  // Custom tooltip formatter
  const formatTooltip = (value, name, props) => {
    if (typeof value === 'number') {
      if (name.toLowerCase().includes('revenue') || name.toLowerCase().includes('payment') || 
          name.toLowerCase().includes('amount') || name.toLowerCase().includes('profit') ||
          name.toLowerCase().includes('expense')) {
        return [`R ${value.toLocaleString()}`, name];
      }
      if (name.toLowerCase().includes('rate') || name.toLowerCase().includes('margin')) {
        return [`${value.toFixed(1)}%`, name];
      }
      return [value.toLocaleString(), name];
    }
    return [value, name];
  };

  // Render chart based on type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `R ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey="paymentsReceived" 
              stroke={colors[0]} 
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
              name="Payments Received"
            />
            <Line 
              type="monotone" 
              dataKey="netPayments" 
              stroke={colors[1]} 
              strokeWidth={3}
              dot={{ fill: colors[1], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[1], strokeWidth: 2 }}
              name="Net Payments"
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="type" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `R ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            {showLegend && <Legend />}
            <Bar 
              dataKey="revenue" 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ range, percentage }) => `${range}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`R ${value.toLocaleString()}`, 'Amount']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'multiline':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `R ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke={colors[0]} 
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke={colors[3]} 
              strokeWidth={3}
              dot={{ fill: colors[3], strokeWidth: 2, r: 4 }}
              name="Expenses"
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke={colors[1]} 
              strokeWidth={3}
              dot={{ fill: colors[1], strokeWidth: 2, r: 4 }}
              name="Profit"
            />
          </LineChart>
        );

      default:
        return (
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="text-gray-500">Unsupported chart type: {type}</div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialChart; 