import React, { useState } from 'react';
import DashboardCard from '../../components/DashboardCard';
import UploadZone from '../../components/UploadZone.tsx';
import DocumentTable from '../../components/DocumentTable.tsx';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const initialDocs = [
  { id: 1, name: 'FICA.pdf', date: '2024-06-01', type: 'FICA', transfer: 'EZT1001' },
  { id: 2, name: 'TitleDeed.pdf', date: '2024-06-02', type: 'Title Deed', transfer: 'EZT1002' },
  { id: 3, name: 'RatesClearance.pdf', date: '2024-06-03', type: 'Rates', transfer: '' },
];
const docTypes = ['FICA', 'Title Deed', 'Rates', 'OTP', 'Bond Grant'];

const Upload = () => {
  const [documents, setDocuments] = useState(initialDocs);
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState(docTypes[0]);
  const [uploadTransfer, setUploadTransfer] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterTransfer, setFilterTransfer] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Upload logic (mock)
  const handleFileUpload = (file) => {
    setUploadFile(file);
    setShowModal(true);
  };
  const handleUpload = () => {
    if (uploadFile) {
      setDocuments([
        ...documents,
        {
          id: documents.length + 1,
          name: uploadFile.name,
          date: new Date().toISOString().slice(0, 10),
          type: uploadType,
          transfer: uploadTransfer,
        },
      ]);
    }
    setShowModal(false);
    setUploadFile(null);
    setUploadType(docTypes[0]);
    setUploadTransfer('');
  };

  // Filtering, sorting, pagination
  let filteredDocs = documents.filter(doc =>
    (search === '' || doc.name.toLowerCase().includes(search.toLowerCase()) || doc.type.toLowerCase().includes(search.toLowerCase())) &&
    (filterType === 'All' || doc.type === filterType) &&
    (filterTransfer === 'All' || doc.transfer === filterTransfer)
  );
  filteredDocs = filteredDocs.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === 'date') {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const totalPages = Math.ceil(filteredDocs.length / pageSize);
  const pagedDocs = filteredDocs.slice((page - 1) * pageSize, page * pageSize);
  const transferOptions = Array.from(new Set(documents.map(d => d.transfer).filter(Boolean)));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardCard title="Upload Documents">
        <UploadZone onFileUpload={handleFileUpload} acceptedTypes={['.pdf', '.docx']}>
          <div className="flex flex-col items-center">
            <PlusIcon className="h-8 w-8 text-blue-400 mb-2" />
            <span className="text-blue-700 font-semibold">Drag & drop PDF/DOCX here or <span className="underline">browse</span></span>
          </div>
        </UploadZone>
        {/* Filters/Search */}
        <div className="flex flex-wrap gap-2 items-center mt-6 mb-4">
          <input
            type="text"
            placeholder="Search by name or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select className="border rounded px-2 py-1" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            {docTypes.map(type => <option key={type}>{type}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={filterTransfer} onChange={e => setFilterTransfer(e.target.value)}>
            <option value="All">All Transfers</option>
            {transferOptions.map(t => <option key={t}>{t}</option>)}
          </select>
          <div className="flex gap-1 items-center ml-auto">
            <span className="text-xs text-gray-500">Sort by:</span>
            <button className={`text-xs px-2 py-1 rounded ${sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setSortBy('name')}>Name</button>
            <button className={`text-xs px-2 py-1 rounded ${sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setSortBy('date')}>Date</button>
            <button className={`text-xs px-2 py-1 rounded ${sortBy === 'type' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setSortBy('type')}>Type</button>
            <button className="text-xs px-2 py-1 rounded" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? '↑' : '↓'}</button>
          </div>
        </div>
        {/* Table or Empty State */}
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#F3F4F6"/><path d="M24 56h32M28 32h24M32 40h16" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/></svg>
            <p className="mt-4 text-gray-400 text-lg">No documents found.</p>
          </div>
        ) : (
          <>
            <DocumentTable
              documents={pagedDocs}
              onView={doc => alert('View: ' + doc.name)}
              onDownload={doc => alert('Download: ' + doc.name)}
              onDelete={doc => setDocuments(docs => docs.filter(d => d.id !== doc.id))}
              rowClassNameFn={i => i % 2 === 0 ? 'bg-gray-50 hover:bg-blue-50 transition' : 'bg-white hover:bg-blue-50 transition'}
              linkTransfer
            />
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end gap-2 mt-4">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Prev</button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Next</button>
              </div>
            )}
          </>
        )}
        {/* Advanced Upload Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload Document</h3>
                <button onClick={() => setShowModal(false)}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Document Type</label>
                <select className="w-full border rounded px-2 py-1" value={uploadType} onChange={e => setUploadType(e.target.value)}>
                  {docTypes.map(type => <option key={type}>{type}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Link to Transfer (optional)</label>
                <input className="w-full border rounded px-2 py-1" value={uploadTransfer} onChange={e => setUploadTransfer(e.target.value)} placeholder="e.g. EZT1001" />
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold" onClick={handleUpload}>Upload</button>
              </div>
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
};

export default Upload; 