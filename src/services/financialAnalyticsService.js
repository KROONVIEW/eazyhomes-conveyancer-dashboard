// Financial Analytics Service - Real Data for Dashboard
class FinancialAnalyticsService {
  constructor() {
    this.listeners = new Set();
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    
    // Initialize with realistic mock data
    this.initializeMockData();
  }

  initializeMockData() {
    // Generate realistic financial data based on conveyancing business
    this.mockData = {
      payments: this.generatePaymentTrendData(),
      invoices: this.generateInvoiceData(),
      profitability: this.generateProfitabilityData(),
      cashFlow: this.generateCashFlowData(),
      matterTypes: this.generateMatterTypeRevenue(),
      monthlyMetrics: this.generateMonthlyMetrics()
    };
  }

  // Generate realistic revenue data by matter type
  generateMatterTypeRevenue() {
    const matterTypes = [
      { type: 'Transfer', baseRevenue: 120000, volume: 45, avgFee: 2667 },
      { type: 'Bond Registration', baseRevenue: 95000, volume: 38, avgFee: 2500 },
      { type: 'Deceased Estate', baseRevenue: 60000, volume: 12, avgFee: 5000 },
      { type: 'Sectional Title', baseRevenue: 55000, volume: 22, avgFee: 2500 },
      { type: 'Commercial', baseRevenue: 85000, volume: 8, avgFee: 10625 },
      { type: 'Auction', baseRevenue: 30000, volume: 15, avgFee: 2000 },
      { type: 'Trust', baseRevenue: 45000, volume: 9, avgFee: 5000 },
      { type: 'Divorce', baseRevenue: 25000, volume: 10, avgFee: 2500 },
      { type: 'Donation', baseRevenue: 15000, volume: 6, avgFee: 2500 },
      { type: 'Other', baseRevenue: 20000, volume: 8, avgFee: 2500 }
    ];

    return matterTypes.map(matter => ({
      ...matter,
      revenue: matter.baseRevenue + (Math.random() * 20000 - 10000), // ±10k variance
      growth: (Math.random() * 30 - 15), // ±15% growth
      margin: 0.65 + (Math.random() * 0.2 - 0.1) // 55-75% margin
    }));
  }

  // Generate payment trend data for the last 24 months
  generatePaymentTrendData() {
    const months = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 23);

    for (let i = 0; i < 24; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      const basePayments = 80000 + (i * 2000); // Growing trend
      const seasonality = Math.sin((i % 12) * Math.PI / 6) * 10000; // Seasonal variation
      const randomVariation = (Math.random() * 20000 - 10000);
      
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        fullDate: date.toISOString(),
        paymentsReceived: Math.max(0, basePayments + seasonality + randomVariation),
        refunds: Math.random() * 5000 + 1000,
        chargebacks: Math.random() * 2000 + 500,
        netPayments: 0 // Will be calculated
      });
    }

    // Calculate net payments
    months.forEach(month => {
      month.netPayments = month.paymentsReceived - month.refunds - month.chargebacks;
    });

    return months;
  }

  // Generate invoice aging data
  generateInvoiceData() {
    const agingBuckets = [
      { range: '0-30 days', count: 12, amount: 45000, color: '#10b981' },
      { range: '31-60 days', count: 8, amount: 28000, color: '#facc15' },
      { range: '61-90 days', count: 5, amount: 18000, color: '#f59e42' },
      { range: '91-120 days', count: 3, amount: 12000, color: '#ef4444' },
      { range: '121-180 days', count: 2, amount: 8000, color: '#6366f1' },
      { range: '180+ days', count: 1, amount: 3000, color: '#a21caf' }
    ];

    const totalAmount = agingBuckets.reduce((sum, bucket) => sum + bucket.amount, 0);
    
    return agingBuckets.map(bucket => ({
      ...bucket,
      percentage: ((bucket.amount / totalAmount) * 100).toFixed(1)
    }));
  }

  // Generate profitability data
  generateProfitabilityData() {
    const months = this.generatePaymentTrendData();
    
    return months.map(month => ({
      month: month.month,
      revenue: month.paymentsReceived,
      expenses: month.paymentsReceived * (0.35 + Math.random() * 0.1), // 35-45% expenses
      profit: 0, // Will be calculated
      margin: 0 // Will be calculated
    })).map(month => {
      month.profit = month.revenue - month.expenses;
      month.margin = ((month.profit / month.revenue) * 100).toFixed(1);
      return month;
    });
  }

  // Generate cash flow data
  generateCashFlowData() {
    let runningBalance = 150000; // Starting balance
    const months = this.generatePaymentTrendData();
    
    return months.map(month => {
      const inflow = month.paymentsReceived;
      const outflow = inflow * 0.4 + (Math.random() * 10000); // Operating expenses
      const netFlow = inflow - outflow;
      runningBalance += netFlow;
      
      return {
        month: month.month,
        inflow,
        outflow,
        netFlow,
        balance: runningBalance
      };
    });
  }

  // Generate monthly key metrics
  generateMonthlyMetrics() {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthName = lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return {
      currentMonth: {
        totalRevenue: 125000,
        totalMatters: 48,
        averageValue: 2604,
        collectionRate: 94.2,
        outstandingAmount: 67000
      },
      lastMonth: {
        totalRevenue: 118000,
        totalMatters: 45,
        averageValue: 2622,
        collectionRate: 91.8,
        outstandingAmount: 72000
      },
      growth: {
        revenue: 5.9,
        matters: 6.7,
        averageValue: -0.7,
        collectionRate: 2.6,
        outstanding: -6.9
      }
    };
  }

  // Get cached data or fetch new data
  async getData(type, forceRefresh = false) {
    const cacheKey = `financial_${type}`;
    const cached = this.cache.get(cacheKey);
    
    if (!forceRefresh && cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.data;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let data;
    switch (type) {
      case 'revenue':
        data = this.mockData.revenue;
        break;
      case 'payments':
        data = this.mockData.payments;
        break;
      case 'invoices':
        data = this.mockData.invoices;
        break;
      case 'profitability':
        data = this.mockData.profitability;
        break;
      case 'cashflow':
        data = this.mockData.cashFlow;
        break;
      case 'matter-types':
        data = this.mockData.matterTypes;
        break;
      case 'metrics':
        data = this.mockData.monthlyMetrics;
        break;
      case 'all':
        data = this.mockData;
        break;
      default:
        throw new Error(`Unknown data type: ${type}`);
    }

    // Cache the data
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  // Get revenue by matter type (for bar chart)
  async getRevenueByMatterType() {
    const data = await this.getData('matter-types');
    return {
      labels: data.map(item => item.type),
      datasets: [{
        label: 'Revenue (R)',
        data: data.map(item => item.revenue),
        backgroundColor: [
          '#6366f1', '#10b981', '#facc15', '#f59e42', '#ef4444',
          '#3b82f6', '#a21caf', '#eab308', '#14b8a6', '#f472b6'
        ],
        borderRadius: 6,
        borderWidth: 0
      }]
    };
  }

  // Get payment trend data (for line chart)
  async getPaymentTrendData() {
    const data = await this.getData('payments');
    return {
      labels: data.map(item => item.month),
      datasets: [
        {
          label: 'Payments Received',
          data: data.map(item => item.paymentsReceived),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Net Payments',
          data: data.map(item => item.netPayments),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  }

  // Get invoice aging data (for doughnut chart)
  async getInvoiceAgingData() {
    const data = await this.getData('invoices');
    return {
      labels: data.map(item => item.range),
      datasets: [{
        data: data.map(item => item.amount),
        backgroundColor: data.map(item => item.color),
        borderWidth: 0,
        hoverOffset: 4
      }]
    };
  }

  // Get profitability data
  async getProfitabilityData() {
    const data = await this.getData('profitability');
    return {
      labels: data.map(item => item.month),
      datasets: [
        {
          label: 'Revenue',
          data: data.map(item => item.revenue),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Expenses',
          data: data.map(item => item.expenses),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Profit',
          data: data.map(item => item.profit),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }

  // Get key financial metrics
  async getKeyMetrics() {
    return await this.getData('metrics');
  }

  // Subscribe to data updates
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of data changes
  notifyListeners(data) {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in financial analytics listener:', error);
      }
    });
  }

  // Simulate real-time updates (for demo)
  startRealTimeUpdates() {
    const interval = setInterval(() => {
      // Simulate small changes in current month data
      this.mockData.monthlyMetrics.currentMonth.totalRevenue += Math.random() * 2000 - 1000;
      this.mockData.monthlyMetrics.currentMonth.totalMatters += Math.random() > 0.8 ? 1 : 0;
      
      // Clear cache to force refresh
      this.cache.clear();
      
      // Notify listeners
      this.notifyListeners({
        type: 'metrics_update',
        data: this.mockData.monthlyMetrics
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }

  // Format currency for display
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Format percentage for display
  formatPercentage(value) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  // Calculate growth rate
  calculateGrowth(current, previous) {
    if (previous === 0) {return 0;}
    return ((current - previous) / previous) * 100;
  }
}

export default new FinancialAnalyticsService(); 