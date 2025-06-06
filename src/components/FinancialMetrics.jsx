import React, { useState } from 'react';
import { useKeyMetrics } from '../hooks/useFinancialAnalytics';
import financialAnalyticsService from '../services/financialAnalyticsService';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

const MetricCard = ({ title, value, previousValue, growth, icon, format = 'currency' }) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return financialAnalyticsService.formatCurrency(val);
    } else if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    } else if (format === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else if (growth < 0) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          </div>
        </div>
        <div className={`flex items-center ${getGrowthColor(growth)}`}>
          {getGrowthIcon(growth)}
          <span className="ml-1 text-sm font-medium">
            {financialAnalyticsService.formatPercentage(growth)}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm text-gray-500">
          <span>Previous: {formatValue(previousValue)}</span>
        </div>
      </div>
    </div>
  );
};

const FinancialMetrics = () => {
  const { metrics, loading, error } = useKeyMetrics();
  const [open, setOpen] = useState(false);

  return (
    <>
      <hr className="border-t border-gray-200 my-2" />
      <div className="financial-insights-section">
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
            Financial Overview
          </span>
          {open ? <FiChevronDown className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
        </button>
        {open && (
          <div className="flex flex-col gap-5">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="w-12 h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="mt-4">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading financial metrics</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : !metrics ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">No financial metrics available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-4">
                <MetricCard
                  title="Total Revenue"
                  value={metrics.currentMonth.totalRevenue}
                  previousValue={metrics.lastMonth.totalRevenue}
                  growth={metrics.growth.revenue}
                  format="currency"
                  icon={
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <MetricCard
                  title="Active Matters"
                  value={metrics.currentMonth.totalMatters}
                  previousValue={metrics.lastMonth.totalMatters}
                  growth={metrics.growth.matters}
                  format="number"
                  icon={
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                      <path d="M6 8h8v2H6V8zm0 4h8v2H6v-2z" />
                    </svg>
                  }
                />
                <MetricCard
                  title="Average Value"
                  value={metrics.currentMonth.averageValue}
                  previousValue={metrics.lastMonth.averageValue}
                  growth={metrics.growth.averageValue}
                  format="currency"
                  icon={
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  }
                />
                <MetricCard
                  title="Collection Rate"
                  value={metrics.currentMonth.collectionRate}
                  previousValue={metrics.lastMonth.collectionRate}
                  growth={metrics.growth.collectionRate}
                  format="percentage"
                  icon={
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <MetricCard
                  title="Outstanding"
                  value={metrics.currentMonth.outstandingAmount}
                  previousValue={metrics.lastMonth.outstandingAmount}
                  growth={metrics.growth.outstanding}
                  format="currency"
                  icon={
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FinancialMetrics; 