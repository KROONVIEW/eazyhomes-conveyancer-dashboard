import React, { useState, useEffect } from 'react';

const RealTimeIndicator = ({ isConnected = true, lastUpdate = null }) => {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (lastUpdate) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-1">
        <div 
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isConnected 
              ? showPulse 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-green-500'
              : 'bg-red-500'
          }`}
        />
        <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>
      {lastUpdate && (
        <span className="text-xs text-gray-500">
          Updated {new Date(lastUpdate).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default RealTimeIndicator;