import React, { useState, useEffect } from 'react';
import { useFinancialAnalytics } from '../hooks/useFinancialAnalytics';
import financialAnalyticsService from '../services/financialAnalyticsService';

const FinancialAnalyticsDiagnostic = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const { data: metrics, loading, error, lastUpdated } = useFinancialAnalytics('metrics', true);

  useEffect(() => {
    const addLog = (message) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
    };

    addLog('Financial Analytics Diagnostic initialized');

    // Subscribe to service updates
    const unsubscribe = financialAnalyticsService.subscribe((updateData) => {
      addLog(`Service update: ${updateData.type}`);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (lastUpdated) {
      const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
      };
      addLog(`Data updated: ${lastUpdated.toLocaleTimeString()}`);
    }
  }, [lastUpdated]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        🔍 Financial Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-auto z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Financial Analytics Debug</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Status */}
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Status</h4>
          <div className="space-y-1 text-xs">
            <div className={`flex items-center ${loading ? 'text-yellow-600' : 'text-green-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              {loading ? 'Loading...' : 'Ready'}
            </div>
            {error && (
              <div className="flex items-center text-red-600">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                Error: {error}
              </div>
            )}
            {lastUpdated && (
              <div className="text-gray-600">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Current Data */}
        {metrics && (
          <div className="bg-blue-50 p-3 rounded">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Current Metrics</h4>
            <div className="space-y-1 text-xs">
              <div>Revenue: {financialAnalyticsService.formatCurrency(metrics.currentMonth.totalRevenue)}</div>
              <div>Matters: {metrics.currentMonth.totalMatters}</div>
              <div>Collection Rate: {metrics.currentMonth.collectionRate.toFixed(1)}%</div>
              <div>Growth: {financialAnalyticsService.formatPercentage(metrics.growth.revenue)}</div>
            </div>
          </div>
        )}

        {/* Activity Log */}
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Activity Log</h4>
          <div className="space-y-1 text-xs text-gray-600 max-h-32 overflow-auto">
            {logs.length === 0 ? (
              <div>No activity yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="font-mono">{log}</div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const addLog = (message) => {
                const timestamp = new Date().toLocaleTimeString();
                setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
              };
              addLog('Manual refresh triggered');
              window.location.reload();
            }}
            className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={() => setLogs([])}
            className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
          >
            Clear Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalyticsDiagnostic; 