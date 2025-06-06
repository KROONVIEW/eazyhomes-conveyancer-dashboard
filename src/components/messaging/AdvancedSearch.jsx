import React, { useState, useCallback, useMemo } from 'react';
import { FiSearch, FiFilter, FiX, FiCalendar, FiUser, FiFileText, FiClock } from 'react-icons/fi';

const AdvancedSearch = ({ 
  isOpen, 
  onClose, 
  chatData, 
  onSelectMessage, 
  onSelectConversation 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sender: '',
    dateRange: 'all', // all, today, week, month, custom
    messageType: 'all', // all, text, broadcast, attachment
    conversation: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  // Get all unique senders for filter dropdown
  const allSenders = useMemo(() => {
    const senders = new Set();
    Object.values(chatData).forEach(chat => {
      chat.messages?.forEach(message => {
        if (message.sender) senders.add(message.sender);
      });
    });
    return Array.from(senders).sort();
  }, [chatData]);

  // Get all conversations for filter dropdown
  const allConversations = useMemo(() => {
    return Object.values(chatData).map(chat => ({
      id: chat.id,
      name: chat.name
    }));
  }, [chatData]);

  // Search and filter messages
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && filters.sender === '' && filters.dateRange === 'all' && filters.messageType === 'all' && filters.conversation === 'all') {
      return [];
    }

    const results = [];
    const query = searchQuery.toLowerCase();

    Object.values(chatData).forEach(chat => {
      chat.messages?.forEach(message => {
        let matches = true;

        // Text search
        if (searchQuery.trim()) {
          const textMatch = message.text?.toLowerCase().includes(query) ||
                           message.subject?.toLowerCase().includes(query) ||
                           message.sender?.toLowerCase().includes(query);
          if (!textMatch) matches = false;
        }

        // Sender filter
        if (filters.sender && message.sender !== filters.sender) {
          matches = false;
        }

        // Message type filter
        if (filters.messageType !== 'all') {
          if (filters.messageType === 'broadcast' && !message.isBroadcast) matches = false;
          if (filters.messageType === 'text' && message.isBroadcast) matches = false;
          if (filters.messageType === 'attachment' && !message.hasAttachment) matches = false;
        }

        // Conversation filter
        if (filters.conversation !== 'all' && chat.id.toString() !== filters.conversation) {
          matches = false;
        }

        // Date range filter
        if (filters.dateRange !== 'all') {
          const messageDate = new Date(); // In real app, parse message.timestamp
          const now = new Date();
          
          switch (filters.dateRange) {
            case 'today':
              if (messageDate.toDateString() !== now.toDateString()) matches = false;
              break;
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              if (messageDate < weekAgo) matches = false;
              break;
            case 'month':
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              if (messageDate < monthAgo) matches = false;
              break;
            case 'custom':
              if (customDateRange.start && messageDate < new Date(customDateRange.start)) matches = false;
              if (customDateRange.end && messageDate > new Date(customDateRange.end)) matches = false;
              break;
          }
        }

        if (matches) {
          results.push({
            ...message,
            conversationId: chat.id,
            conversationName: chat.name,
            conversationAvatar: chat.avatarUrl
          });
        }
      });
    });

    // Sort by relevance and recency
    return results.sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.text?.toLowerCase() === query;
      const bExact = b.text?.toLowerCase() === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then by timestamp (most recent first)
      return b.id - a.id;
    });
  }, [searchQuery, filters, customDateRange, chatData]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      sender: '',
      dateRange: 'all',
      messageType: 'all',
      conversation: 'all'
    });
    setCustomDateRange({ start: '', end: '' });
    setSearchQuery('');
  }, []);

  const handleMessageClick = useCallback((result) => {
    onSelectConversation?.(result.conversationId);
    onSelectMessage?.(result);
    onClose();
  }, [onSelectConversation, onSelectMessage, onClose]);

  const highlightText = useCallback((text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <FiSearch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Advanced Search</h2>
              <p className="text-sm text-gray-600">Search across all conversations and messages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-full transition-all duration-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages, people, or content..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg"
              autoFocus
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <FiFilter className="w-4 h-4" />
              Advanced Filters
              {Object.values(filters).some(f => f !== 'all' && f !== '') && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
            
            {(searchQuery || Object.values(filters).some(f => f !== 'all' && f !== '')) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="w-4 h-4 inline mr-1" />
                    Sender
                  </label>
                  <select
                    value={filters.sender}
                    onChange={(e) => handleFilterChange('sender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  >
                    <option value="">All senders</option>
                    {allSenders.map(sender => (
                      <option key={sender} value={sender}>{sender}</option>
                    ))}
                  </select>
                </div>

                {/* Message Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiFileText className="w-4 h-4 inline mr-1" />
                    Type
                  </label>
                  <select
                    value={filters.messageType}
                    onChange={(e) => handleFilterChange('messageType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All types</option>
                    <option value="text">Text messages</option>
                    <option value="broadcast">Broadcasts</option>
                    <option value="attachment">With attachments</option>
                  </select>
                </div>

                {/* Conversation Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conversation
                  </label>
                  <select
                    value={filters.conversation}
                    onChange={(e) => handleFilterChange('conversation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All conversations</option>
                    {allConversations.map(conv => (
                      <option key={conv.id} value={conv.id.toString()}>{conv.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiCalendar className="w-4 h-4 inline mr-1" />
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">Past week</option>
                    <option value="month">Past month</option>
                    <option value="custom">Custom range</option>
                  </select>
                </div>
              </div>

              {/* Custom Date Range */}
              {filters.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-4">
              <div className="mb-4 text-sm text-gray-600">
                Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              </div>
              
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div
                    key={`${result.conversationId}-${result.id}`}
                    onClick={() => handleMessageClick(result)}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={result.conversationAvatar}
                        alt={result.conversationName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{result.conversationName}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{result.sender}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {result.timestamp}
                          </span>
                        </div>
                        
                        {result.subject && (
                          <div className="text-sm font-medium text-gray-800 mb-1">
                            {highlightText(result.subject, searchQuery)}
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-700 line-clamp-2">
                          {result.isBroadcast && <span className="text-purple-600 mr-1">📢</span>}
                          {highlightText(result.text, searchQuery)}
                        </div>
                        
                        {result.hasAttachment && (
                          <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                            <FiFileText className="w-3 h-3" />
                            Has attachment
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery || Object.values(filters).some(f => f !== 'all' && f !== '') ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FiSearch className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No results found</p>
              <p className="text-sm text-center">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FiSearch className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Start searching</p>
              <p className="text-sm text-center">Enter keywords to search across all your conversations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch; 