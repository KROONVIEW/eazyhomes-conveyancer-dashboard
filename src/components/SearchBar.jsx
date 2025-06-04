import React, { useState, useRef, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { FiSearch, FiFileText, FiUser, FiFolder, FiCheckCircle, FiLoader } from 'react-icons/fi';
import debounce from 'lodash.debounce';

const ICONS = {
  matters: <FiFolder className="text-blue-500 w-5 h-5 mr-2" />,
  clients: <FiUser className="text-green-500 w-5 h-5 mr-2" />,
  tasks: <FiCheckCircle className="text-yellow-500 w-5 h-5 mr-2" />,
  documents: <FiFileText className="text-purple-500 w-5 h-5 mr-2" />,
};

// Mock search function (replace with API call)
const mockSearch = async (q) => {
  if (!q || q.length < 2) return { matters: [], clients: [], tasks: [], documents: [] };
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400));
  return {
    matters: [
      { id: 'EZT1001', title: '12 Oak Ave', type: 'matters', highlight: '12 Oak' },
      { id: 'EZT1002', title: '78 Pine Rd', type: 'matters', highlight: 'Pine' },
    ],
    clients: [
      { id: 'C001', title: 'Alice Smith', type: 'clients', highlight: 'Alice' },
      { id: 'C002', title: 'John Doe', type: 'clients', highlight: 'John' },
    ],
    tasks: [
      { id: 'T001', title: 'Send FICA Request', type: 'tasks', highlight: 'FICA' },
    ],
    documents: [
      { id: 'D001', title: 'FICA.pdf', type: 'documents', highlight: 'FICA' },
    ],
  };
};

function highlightMatch(text, match) {
  if (!match) return text;
  const idx = text.toLowerCase().indexOf(match.toLowerCase());
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<span className="bg-yellow-200 font-bold">{text.slice(idx, idx + match.length)}</span>{text.slice(idx + match.length)}</>;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ matters: [], clients: [], tasks: [], documents: [] });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef();
  const wrapperRef = useRef();

  // Debounced search
  const doSearch = debounce(async (q) => {
    setLoading(true);
    const res = await mockSearch(q);
    setResults(res);
    setLoading(false);
  }, 300);

  useEffect(() => {
    if (query.length >= 2) {
      setOpen(true);
      doSearch(query);
    } else {
      setOpen(false);
      setResults({ matters: [], clients: [], tasks: [], documents: [] });
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

  // Navigation on select
  const handleSelect = (item) => {
    setSelected(item);
    setOpen(false);
    if (!item) return;
    if (item.type === 'matters') window.location.href = `/matters/${item.id}`;
    if (item.type === 'clients') window.location.href = `/clients/${item.id}`;
    if (item.type === 'tasks') window.location.href = `/tasks/${item.id}`;
    if (item.type === 'documents') window.location.href = `/documents/${item.id}`;
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
                placeholder="Search matters, clients, tasks, documents... (Ctrl+K)"
                style={{ fontFamily: 'Poppins, sans-serif', boxShadow: 'none', border: 'none', outline: 'none' }}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setOpen(true)}
                displayValue={item => item?.title || ''}
              />
              {loading && <FiLoader className="animate-spin text-blue-500 ml-2 w-5 h-5" />}
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