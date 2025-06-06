import { useState, useEffect, useCallback } from 'react';
import financialAnalyticsService from '../services/financialAnalyticsService';

export const useFinancialAnalytics = (dataType = 'all', autoRefresh = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load data function
  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await financialAnalyticsService.getData(dataType, forceRefresh);
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading financial analytics data:', err);
      setError(err.message || 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  }, [dataType]);

  // Refresh data manually
  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData(true);
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = financialAnalyticsService.subscribe((updateData) => {
      if (updateData.type === 'metrics_update' && dataType === 'metrics') {
        setData(updateData.data);
        setLastUpdated(new Date());
      }
    });

    return unsubscribe;
  }, [dataType]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isStale: lastUpdated && (Date.now() - lastUpdated.getTime()) > 300000 // 5 minutes
  };
};

// Specialized hooks for different chart types
export const useRevenueByMatterType = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await financialAnalyticsService.getRevenueByMatterType();
        setChartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  return { chartData, loading, error };
};

export const usePaymentTrends = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await financialAnalyticsService.getPaymentTrendData();
        setChartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  return { chartData, loading, error };
};

export const useInvoiceAging = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await financialAnalyticsService.getInvoiceAgingData();
        setChartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  return { chartData, loading, error };
};

export const useKeyMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await financialAnalyticsService.getKeyMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();

    // Subscribe to real-time updates
    const unsubscribe = financialAnalyticsService.subscribe((updateData) => {
      if (updateData.type === 'metrics_update') {
        setMetrics(updateData.data);
      }
    });

    return unsubscribe;
  }, []);

  return { metrics, loading, error };
}; 