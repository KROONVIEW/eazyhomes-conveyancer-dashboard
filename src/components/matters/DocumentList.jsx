import React, { useState } from "react";
import { FiUpload, FiFileText, FiDownload, FiTrash2 } from "react-icons/fi";

const initialDocs = [
  { id: 1, name: "FICA.pdf", size: "120KB", date: "2025-05-29", type: "pdf" },
  { id: 2, name: "Mandate.docx", size: "80KB", date: "2025-05-28", type: "docx" },
  { id: 3, name: "PowerOfAttorney.pdf", size: "95KB", date: "2025-05-27", type: "pdf" },
];

const DocumentList = () => {
  const [docs, setDocs] = useState(initialDocs);

  // Simulate upload
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocs(docs => [
        ...docs,
        { id: Date.now(), name: file.name, size: `${Math.round(file.size/1024)}KB`, date: new Date().toISOString().slice(0,10), type: file.name.split('.').pop() }
      ]);
    }
  };

  const removeDoc = (id) => setDocs(docs => docs.filter(d => d.id !== id));

  return (
    <div>
      <label className="flex items-center gap-2 cursor-pointer mb-4 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
        <FiUpload className="w-5 h-5 text-blue-600" />
        <span className="text-sm text-blue-700 font-semibold">Upload Document</span>
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>
      <ul className="space-y-3">
        {docs.map(doc => (
          <li key={doc.id} className="flex items-center gap-3 bg-gray-50 rounded p-3">
            <FiFileText className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-800 flex-1">{doc.name}</span>
            <span className="text-xs text-gray-500">{doc.size}</span>
            <span className="text-xs text-gray-400">{doc.date}</span>
            <button className="p-1 hover:text-blue-600" title="Download"><FiDownload /></button>
            <button className="p-1 hover:text-red-600" title="Remove" onClick={() => removeDoc(doc.id)}><FiTrash2 /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList; 