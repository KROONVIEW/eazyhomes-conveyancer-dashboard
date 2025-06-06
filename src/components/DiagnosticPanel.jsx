import React, { useState, useEffect } from 'react';

const DiagnosticPanel = ({ matters, loading, error }) => {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Capture console logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      if (args[0] && typeof args[0] === 'string' && (
        args[0].includes('📡') || 
        args[0].includes('✅') || 
        args[0].includes('📎') || 
        args[0].includes('🔌') ||
        args[0].includes('📝')
      )) {
        setLogs(prev => [...prev.slice(-9), {
          type: 'log',
          message: args.join(' '),
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    };

    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev.slice(-9), {
        type: 'error',
        message: args.join(' '),
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-700 transition z-50"
      >
        🔍 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-96 max-h-96 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Real-Time Sync Diagnostics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Status */}
      <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={loading ? 'text-yellow-600' : error ? 'text-red-600' : 'text-green-600'}>
            {loading ? 'Loading...' : error ? 'Error' : 'Connected'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Matters:</span>
          <span className="text-blue-600">{matters.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Update:</span>
          <span className="text-gray-600">
            {matters.length > 0 ? new Date(matters[0]?.updatedAt).toLocaleTimeString() : 'None'}
          </span>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-1">
        <h4 className="font-medium text-xs text-gray-700">Recent Activity:</h4>
        {logs.length === 0 ? (
          <div className="text-xs text-gray-500 italic">No activity yet...</div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`text-xs p-1 rounded ${
                log.type === 'error' 
                  ? 'bg-red-50 text-red-700' 
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              <span className="text-gray-500">{log.timestamp}</span> {log.message}
            </div>
          ))
        )}
      </div>

      {/* Test Actions */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <h4 className="font-medium text-xs text-gray-700 mb-2">Test Actions:</h4>
        <button
          onClick={() => {
            setLogs(prev => [...prev, {
              type: 'log',
              message: '🧪 Manual test triggered',
              timestamp: new Date().toLocaleTimeString()
            }]);
          }}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
        >
          Test Log
        </button>
      </div>
    </div>
  );
};

export default DiagnosticPanel; 