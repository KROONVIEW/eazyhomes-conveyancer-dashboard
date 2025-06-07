import React, { useState, useEffect } from 'react';
import auditService from '../services/auditService';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}

export default function AuditTrailPage() {
  const [filters, setFilters] = useState({
    user: 'All',
    action: 'All',
    category: 'All',
    severity: 'All',
    search: '',
    startDate: '',
    endDate: ''
  });
  
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState(['All']);
  const [actions, setActions] = useState(['All']);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadAuditData();
    // Log page access
    auditService.logSystemAccess('Audit Trail');
  }, []);

  // Reload data when filters change
  useEffect(() => {
    loadAuditData();
  }, [filters]);

  const loadAuditData = () => {
    try {
      setLoading(true);
      const filteredLogs = auditService.getLogs(filters);
      setLogs(filteredLogs);
      
      // Update filter options
      setUsers(auditService.getUsers());
      setActions(auditService.getActions());
      setCategories(auditService.getCategories());
      
      setError('');
    } catch (err) {
      setError('Failed to load audit logs');
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      await auditService.exportToCSV(filters);
    } catch (err) {
      setError('Failed to export audit logs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      authentication: 'text-blue-600 bg-blue-50',
      document_management: 'text-purple-600 bg-purple-50',
      matter_management: 'text-indigo-600 bg-indigo-50',
      client_management: 'text-green-600 bg-green-50',
      user_management: 'text-orange-600 bg-orange-50',
      system: 'text-gray-600 bg-gray-50',
      general: 'text-slate-600 bg-slate-50'
    };
    return colors[category] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Trail</h1>
        <p className="text-gray-600">Track all user actions and system events for compliance and security</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
              value={filters.user} 
              onChange={e => handleFilterChange('user', e.target.value)}
            >
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
              value={filters.action} 
              onChange={e => handleFilterChange('action', e.target.value)}
            >
              {actions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
              value={filters.category} 
              onChange={e => handleFilterChange('category', e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
              value={filters.severity} 
              onChange={e => handleFilterChange('severity', e.target.value)}
            >
              <option value="All">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search actions, users, or details..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.startDate}
              onChange={e => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.endDate}
              onChange={e => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Summary and Export */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${logs.length} log entries found`}
        </div>
        <button 
          onClick={handleExport}
          disabled={loading || logs.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.user.name}</div>
                    <div className="text-sm text-gray-500">{log.user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(log.category)}`}>
                      {log.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">No audit logs found</p>
                      <p className="text-sm">Try adjusting your filters or check back later</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 