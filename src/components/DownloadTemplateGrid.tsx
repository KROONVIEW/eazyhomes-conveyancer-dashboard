import React, { useState } from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

type Template = {
  name: string;
  type: string;
  format: 'PDF' | 'DOCX';
};

type DownloadTemplateGridProps = {
  templates: Template[];
  onDownload?: (template: Template) => void;
};

const formatIcon = (format: 'PDF' | 'DOCX') => (
  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${format === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{format}</span>
);

const DownloadTemplateGrid: React.FC<DownloadTemplateGridProps> = ({ templates, onDownload }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const types = Array.from(new Set(templates.map(t => t.type)));

  const filtered = templates.filter(t =>
    (filter === 'All' || t.type === filter) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-64"
        />
        <select className="border rounded px-2 py-1" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Types</option>
          {types.map(type => <option key={type}>{type}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((t, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 items-start">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-400" />
              <span className="font-semibold text-gray-800">{t.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{t.type}</span>
              {formatIcon(t.format)}
            </div>
            <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold flex items-center gap-1" onClick={() => onDownload?.(t)}>
              <ArrowDownTrayIcon className="h-4 w-4" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadTemplateGrid; 