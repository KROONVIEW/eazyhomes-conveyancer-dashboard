import React, { useState, useRef } from 'react';
import DashboardCard from '../components/DashboardCard';
import {
  PlusIcon,
  CloudArrowUpIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Dummy data for uploaded documents
const initialDocuments = [
  { id: 'u1', name: 'FICA_Client_A.pdf', uploadDate: '01/06/2025', linkedTransfer: 'EZT1001', type: 'FICA', format: 'PDF', isUploading: false },
  { id: 'u2', name: 'OfferToPurchase_PropertyX.docx', uploadDate: '30/05/2025', linkedTransfer: 'EZT1002', type: 'Offer to Purchase', format: 'DOCX', isUploading: false },
  { id: 'u3', name: 'RatesClearance_HouseY.pdf', uploadDate: '28/05/2025', linkedTransfer: null, type: 'Rates Clearance', format: 'PDF', isUploading: false },
];
const matterOptions = ['EZT1001', 'EZT1002', 'EZT1003'];
const docTypes = ['FICA', 'Offer to Purchase', 'Rates Clearance', 'Title Deed', 'Compliance', 'Agreement', 'Other'];

// Dummy data for templates
const templateTypes = ['Legal', 'Tax', 'Municipal', 'Compliance', 'Agreement'];
const initialTemplates = [
  { id: 't1', name: 'Clearance Certificate Template', type: 'Municipal', format: 'PDF', description: 'Standard template for municipal clearance.' },
  { id: 't2', name: 'FICA Checklist (Individual)', type: 'Compliance', format: 'DOCX', description: 'Comprehensive checklist for FICA compliance for individuals.' },
  { id: 't3', name: 'Offer to Purchase Agreement', type: 'Agreement', format: 'PDF', description: 'Standard offer to purchase document for residential properties.' },
  { id: 't4', name: 'Tax Invoice Template', type: 'Tax', format: 'XLSX', description: 'Template for tax invoices.' },
  { id: 't5', name: 'Special Conditions Addendum', type: 'Legal', format: 'DOCX', description: 'Addendum for special conditions in sale agreements.' },
  { id: 't6', name: 'Power of Attorney', type: 'Legal', format: 'PDF', description: 'Standard power of attorney template.' },
  { id: 't7', name: 'Municipal Rates Query', type: 'Municipal', format: 'PDF', description: 'Query form for municipal rates.' },
  { id: 't8', name: 'Compliance Certificate', type: 'Compliance', format: 'PDF', description: 'Certificate for compliance requirements.' },
  { id: 't9', name: 'Bond Registration Form', type: 'Legal', format: 'DOCX', description: 'Form for bond registration.' },
  { id: 't10', name: 'Deeds Office Lodgement Sheet', type: 'Legal', format: 'PDF', description: 'Sheet for deeds office lodgement.' },
  { id: 't11', name: 'Transfer Duty Receipt', type: 'Tax', format: 'PDF', description: 'Receipt template for transfer duty.' },
  { id: 't12', name: 'Estate Agent Mandate', type: 'Agreement', format: 'DOCX', description: 'Mandate agreement for estate agents.' },
  { id: 't13', name: 'Sectional Title Rules', type: 'Legal', format: 'PDF', description: 'Rules for sectional title properties.' },
  { id: 't14', name: 'Municipal Valuation Appeal', type: 'Municipal', format: 'PDF', description: 'Appeal form for municipal valuation.' },
  { id: 't15', name: 'FICA Checklist (Company)', type: 'Compliance', format: 'DOCX', description: 'Checklist for FICA compliance for companies.' },
  { id: 't16', name: 'Sale Agreement Addendum', type: 'Agreement', format: 'PDF', description: 'Addendum for sale agreements.' },
  { id: 't17', name: 'VAT Invoice Template', type: 'Tax', format: 'XLSX', description: 'VAT invoice template.' },
  { id: 't18', name: 'Trust Account Declaration', type: 'Legal', format: 'PDF', description: 'Declaration for trust accounts.' },
  { id: 't19', name: 'Municipal Clearance Request', type: 'Municipal', format: 'DOCX', description: 'Request form for municipal clearance.' },
  { id: 't20', name: 'Special Conditions Addendum', type: 'Legal', format: 'DOCX', description: 'Addendum for special conditions in sale agreements.' },
];

function formatIcon(format) {
  if (format === 'PDF') return <DocumentTextIcon className="h-6 w-6 text-red-500" />;
  if (format === 'DOCX') return <DocumentTextIcon className="h-6 w-6 text-blue-500" />;
  if (format === 'XLSX') return <DocumentTextIcon className="h-6 w-6 text-green-500" />;
  return <DocumentTextIcon className="h-6 w-6 text-gray-400" />;
}

const tagColors = {
  'FICA': 'bg-blue-100 text-blue-800',
  'Offer to Purchase': 'bg-yellow-100 text-yellow-800',
  'Rates Clearance': 'bg-green-100 text-green-800',
  'Title Deed': 'bg-purple-100 text-purple-800',
  'Compliance': 'bg-pink-100 text-pink-800',
  'Agreement': 'bg-orange-100 text-orange-800',
  'Legal': 'bg-indigo-100 text-indigo-800',
  'Tax': 'bg-teal-100 text-teal-800',
  'Municipal': 'bg-lime-100 text-lime-800',
  'Other': 'bg-gray-100 text-gray-800',
};

const Documents = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [documents, setDocuments] = useState(initialDocuments);
  const [templates] = useState(initialTemplates);
  const [searchDocs, setSearchDocs] = useState('');
  const [searchTemplates, setSearchTemplates] = useState('');
  const [templateType, setTemplateType] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState(docTypes[0]);
  const [uploadTransfer, setUploadTransfer] = useState('');
  const [uploadName, setUploadName] = useState('');
  const fileInputRef = useRef();

  // Filtering logic
  const filteredDocs = documents.filter(doc =>
    (searchDocs === '' || doc.name.toLowerCase().includes(searchDocs.toLowerCase()) || doc.type.toLowerCase().includes(searchDocs.toLowerCase()))
  );
  const filteredTemplates = templates.filter(t =>
    (searchTemplates === '' || t.name.toLowerCase().includes(searchTemplates.toLowerCase()) || t.type.toLowerCase().includes(searchTemplates.toLowerCase())) &&
    (templateType === 'All' || t.type === templateType)
  );

  // Drag and drop handlers
  const handleDragOver = e => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = e => { e.preventDefault(); setDragActive(false); };
  const handleDrop = e => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
      setUploadName(e.dataTransfer.files[0].name);
      setShowModal(true);
    }
  };
  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setUploadName(e.target.files[0].name);
      setShowModal(true);
    }
  };
  const handleUpload = () => {
    if (uploadFile) {
      setDocuments([
        ...documents,
        {
          id: 'u' + (documents.length + 1),
          name: uploadName,
          uploadDate: new Date().toLocaleDateString('en-GB'),
          linkedTransfer: uploadTransfer || null,
          type: uploadType,
          format: uploadFile.name.endsWith('.pdf') ? 'PDF' : uploadFile.name.endsWith('.docx') ? 'DOCX' : 'Other',
          isUploading: false,
        },
      ]);
    }
    setShowModal(false);
    setUploadFile(null);
    setUploadType(docTypes[0]);
    setUploadTransfer('');
    setUploadName('');
  };

  // Modal close
  const closeModal = () => {
    setShowModal(false);
    setUploadFile(null);
    setUploadType(docTypes[0]);
    setUploadTransfer('');
    setUploadName('');
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 overflow-auto h-screen">
      <DashboardCard>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Documents</h2>
        {/* Segmented Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
          <button
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'upload' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
            aria-selected={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
          >
            Upload Documents
          </button>
          <button
            className={`ml-2 px-5 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'templates' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
            aria-selected={activeTab === 'templates'}
            onClick={() => setActiveTab('templates')}
          >
            Download Templates
          </button>
        </div>
        {/* Tab Content */}
        <div className={`transition-opacity duration-300 ${activeTab === 'upload' ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {activeTab === 'upload' && (
            <>
              {/* Drag & Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 transition-colors duration-200 ${dragActive ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <CloudArrowUpIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="mb-2">Drag and drop files here, or</p>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition"
                  onClick={e => { e.stopPropagation(); fileInputRef.current && fileInputRef.current.click(); }}
                >
                  <PlusIcon className="h-5 w-5" /> Upload Document
                </button>
                <input
                  type="file"
                  accept=".pdf,.docx,.xlsx"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              {/* Search Bar */}
              <div className="relative mb-4 max-w-lg">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search documents by file name or type..."
                  value={searchDocs}
                  onChange={e => setSearchDocs(e.target.value)}
                />
              </div>
              {/* Document Table */}
              <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="min-w-full bg-white rounded-lg">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 text-sm font-medium">
                      <th className="py-2 px-4 text-left">File Name</th>
                      <th className="py-2 px-4 text-left">Upload Date</th>
                      <th className="py-2 px-4 text-left">Linked Transfer</th>
                      <th className="py-2 px-4 text-left">Type</th>
                      <th className="py-2 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-500">
                          <CloudArrowUpIcon className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                          No documents uploaded yet. Start by dragging files here or clicking 'Upload Document'.
                        </td>
                      </tr>
                    ) : (
                      filteredDocs.map((doc, i) => (
                        <tr key={doc.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-2 px-4 font-medium text-gray-800 flex items-center gap-2">
                            {formatIcon(doc.format)} {doc.name}
                          </td>
                          <td className="py-2 px-4">{doc.uploadDate}</td>
                          <td className="py-2 px-4">
                            {doc.linkedTransfer ? (
                              <span
                                className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200 transition"
                                title={`Go to matter ${doc.linkedTransfer}`}
                                tabIndex={0}
                                onClick={() => alert('Navigate to matter: ' + doc.linkedTransfer)}
                              >
                                {doc.linkedTransfer}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-400">Unlinked</span>
                            )}
                          </td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${tagColors[doc.type] || 'bg-gray-100 text-gray-800'}`}>{doc.type}</span>
                          </td>
                          <td className="py-2 px-4 text-right flex gap-2 justify-end">
                            <button className="p-1 rounded hover:bg-blue-50 focus:bg-blue-100 text-blue-600" title="View" aria-label={`View ${doc.name}`}><EyeIcon className="h-5 w-5" /></button>
                            <button className="p-1 rounded hover:bg-blue-50 focus:bg-blue-100 text-blue-600" title="Download" aria-label={`Download ${doc.name}`}><ArrowDownTrayIcon className="h-5 w-5" /></button>
                            <button className="p-1 rounded hover:bg-red-50 focus:bg-red-100 text-red-600" title="Delete" aria-label={`Delete ${doc.name}`} onClick={() => setDocuments(docs => docs.filter(d => d.id !== doc.id))}><TrashIcon className="h-5 w-5" /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Advanced Upload Modal */}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                    <button className="absolute top-3 right-3 p-1" onClick={closeModal}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
                    <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">File Name</label>
                      <input className="w-full border rounded px-2 py-1" value={uploadName} onChange={e => setUploadName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Document Type</label>
                      <select className="w-full border rounded px-2 py-1" value={uploadType} onChange={e => setUploadType(e.target.value)}>
                        {docTypes.map(type => <option key={type}>{type}</option>)}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Link to Transfer (optional)</label>
                      <select className="w-full border rounded px-2 py-1" value={uploadTransfer} onChange={e => setUploadTransfer(e.target.value)}>
                        <option value="">Unlinked</option>
                        {matterOptions.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button className="px-4 py-2 bg-gray-100 rounded" onClick={closeModal}>Cancel</button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold" onClick={handleUpload}>Upload</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className={`transition-opacity duration-300 ${activeTab === 'templates' ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {activeTab === 'templates' && (
            <>
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-lg">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search templates by name..."
                    value={searchTemplates}
                    onChange={e => setSearchTemplates(e.target.value)}
                  />
                </div>
                <select
                  className="border rounded px-2 py-2 min-w-[160px]"
                  value={templateType}
                  onChange={e => setTemplateType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  {templateTypes.map(type => <option key={type}>{type}</option>)}
                </select>
              </div>
              {/* Templates Grid */}
              {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <CloudArrowUpIcon className="h-10 w-10 mb-2 text-gray-300" />
                  <p className="mt-4 text-gray-400 text-lg">No templates found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTemplates.map(t => (
                    <div
                      key={t.id}
                      className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-start relative overflow-hidden hover:shadow-lg hover:scale-103 transition-all duration-200 ease-in-out"
                    >
                      <div className="absolute top-3 right-3">{formatIcon(t.format)}</div>
                      <h3 className="font-semibold text-gray-800 mb-1">{t.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full mb-2 ${tagColors[t.type] || 'bg-gray-100 text-gray-800'}`}>{t.type}</span>
                      <p className="text-gray-500 text-sm mb-4">{t.description}</p>
                      <button
                        className="mt-auto ml-auto px-3 py-1 bg-blue-600 text-white rounded-md font-semibold flex items-center gap-1 shadow hover:bg-blue-700 transition"
                        onClick={() => alert('Download: ' + t.name)}
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" /> Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};

export default Documents; 