import React, { useState, useRef, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { FiSearch, FiFileText, FiUser, FiFolder, FiCheckCircle, FiLoader } from 'react-icons/fi';
import debounce from 'lodash.debounce';
import globalSearchService from '../services/globalSearchService';

const ICONS = {
  matters: <FiFolder className="text-blue-500 w-5 h-5 mr-2" />,
  clients: <FiUser className="text-green-500 w-5 h-5 mr-2" />,
  tasks: <FiCheckCircle className="text-yellow-500 w-5 h-5 mr-2" />,
  documents: <FiFileText className="text-purple-500 w-5 h-5 mr-2" />,
};

// Enhanced global search function using the new service
const performGlobalSearch = async (query, options = {}) => {
  try {
    console.log('🔍 SearchBar: Performing search for:', query);
    const results = await globalSearchService.search(query, {
      limit: 20,
      categories: ['matters', 'clients', 'documents', 'tasks'],
      includeRecent: true,
      ...options
    });
    
    console.log('✅ SearchBar: Search results:', results);
    return results;
  } catch (error) {
    console.error('❌ SearchBar: Search error:', error);
    return { matters: [], clients: [], documents: [], tasks: [], messages: [] };
  }
};

function highlightMatch(text, match) {
  if (!match) return text;
  const idx = text.toLowerCase().indexOf(match.toLowerCase());
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<span className="bg-yellow-200 font-bold">{text.slice(idx, idx + match.length)}</span>{text.slice(idx + match.length)}</>;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ matters: [], clients: [], tasks: [], documents: [], messages: [] });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const inputRef = useRef();
  const wrapperRef = useRef();

  // Initialize global search service
  useEffect(() => {
    const initializeSearch = async () => {
      try {
        console.log('🚀 SearchBar: Initializing global search...');
        await globalSearchService.initialize();
        setInitialized(true);
        console.log('✅ SearchBar: Global search initialized');
      } catch (error) {
        console.error('❌ SearchBar: Failed to initialize search:', error);
        setInitialized(true); // Still allow search to work with fallback
      }
    };
    
    initializeSearch();
  }, []);

  // Optimized debounced search with abort controller
  const abortControllerRef = useRef();
  const doSearch = debounce(async (q) => {
    // Don't search if not initialized
    if (!initialized) {
      console.log('⏳ SearchBar: Waiting for initialization...');
      return;
    }
    
    // Cancel previous search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      const res = await performGlobalSearch(q, { signal: abortControllerRef.current.signal });
      setResults(res);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error);
        setResults({ matters: [], clients: [], tasks: [], documents: [], messages: [] });
      }
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    if (query.length >= 2) {
      setOpen(true);
      doSearch(query);
    } else {
      setOpen(false);
      setResults({ matters: [], clients: [], tasks: [], documents: [], messages: [] });
    }
    return () => doSearch.cancel();
  }, [query]);

  // Keyboard shortcut (Ctrl/Cmd+K)
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Collapse on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setExpanded(false);
      }
    }
    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  // Collapse on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setExpanded(false);
    }
    if (expanded) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  // Enhanced navigation on select
  const handleSelect = (item) => {
    setSelected(item);
    setOpen(false);
    setExpanded(false);
    
    if (!item) return;
    
    console.log('🎯 SearchBar: Navigating to:', item);
    
    // Handle navigation based on item type and data
    switch (item.type) {
      case 'matters':
        // Navigate to matters page with filter or specific matter
        if (item.data && item.data.id) {
          window.location.href = `/matters?highlight=${item.data.id}`;
        } else {
          window.location.href = '/matters';
        }
        break;
        
      case 'clients':
        // Navigate to matters page filtered by client
        if (item.data && item.data.name) {
          window.location.href = `/matters?client=${encodeURIComponent(item.data.name)}`;
        } else {
          window.location.href = '/matters';
        }
        break;
        
      case 'documents':
        // Navigate to matters page with document filter
        if (item.data && item.data.matterId) {
          window.location.href = `/matters?highlight=${item.data.matterId}&tab=documents`;
        } else {
          window.location.href = '/matters';
        }
        break;
        
      case 'tasks':
        // Navigate to matters page with task filter
        if (item.data && item.data.matterId) {
          window.location.href = `/matters?highlight=${item.data.matterId}&tab=tasks`;
        } else {
          window.location.href = '/matters';
        }
        break;
        
      case 'messages':
        // Navigate to messages page
        window.location.href = '/messages';
        break;
        
      default:
        console.warn('Unknown item type:', item.type);
        break;
    }
  };

  // Flatten results for keyboard navigation
  const flatResults = [
    ...results.matters.slice(0, 5),
    ...results.clients.slice(0, 5),
    ...results.tasks.slice(0, 5),
    ...results.documents.slice(0, 5),
  ];

  return (
    <div ref={wrapperRef} className="relative flex items-center" style={{ minWidth: expanded ? 240 : 44, transition: 'min-width 0.2s' }}>
      {!expanded && (
        <button
          className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition"
          aria-label="Open search"
          onClick={() => { setExpanded(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        >
          <FiSearch className="text-gray-400 w-6 h-6" />
        </button>
      )}
      {expanded && (
        <Combobox value={selected} onChange={handleSelect}>
          <div className="relative w-72 md:w-96" style={{ transition: 'width 0.2s' }}>
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <FiSearch className="text-gray-400 mr-2 w-5 h-5" />
              <Combobox.Input
                ref={inputRef}
                className="dashboard-search-input w-full bg-transparent text-base font-normal border-0 !border-none !shadow-none !outline-none ring-0 focus:ring-0 appearance-none"
                placeholder={initialized ? "Search matters, clients, tasks, documents... (Ctrl+K)" : "Initializing search..."}
                style={{ fontFamily: 'Poppins, sans-serif', boxShadow: 'none', border: 'none', outline: 'none' }}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setOpen(true)}
                displayValue={item => item?.title || ''}
                disabled={!initialized}
              />
              {(loading || !initialized) && <FiLoader className="animate-spin text-blue-500 ml-2 w-5 h-5" />}
            </div>
            {open && (
              <Combobox.Options static className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
                {flatResults.length === 0 && !loading && (
                  <div className="p-4 text-gray-400 text-sm">No results found.</div>
                )}
                {/* Grouped Results */}
                {['matters', 'clients', 'tasks', 'documents'].map((group) =>
                  results[group].length > 0 && (
                    <div key={group}>
                      <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.charAt(0).toUpperCase() + group.slice(1)}</div>
                      {results[group].slice(0, 5).map((item, idx) => (
                        <Combobox.Option
                          key={item.id}
                          value={item}
                          className={({ active }) =>
                            `flex items-center px-4 py-2 cursor-pointer transition-colors ${active ? 'bg-blue-50' : ''}`
                          }
                        >
                          {ICONS[group]}
                          <span className="truncate">
                            {highlightMatch(item.title, item.highlight)}
                          </span>
                        </Combobox.Option>
                      ))}
                      {results[group].length > 5 && (
                        <div className="px-4 py-2 text-xs text-blue-600 cursor-pointer hover:underline" onMouseDown={e => { e.preventDefault(); window.location.href = `/${group}`; }}>
                          View more {group}
                        </div>
                      )}
                    </div>
                  )
                )}
              </Combobox.Options>
            )}
          </div>
        </Combobox>
      )}
    </div>
  );
} 