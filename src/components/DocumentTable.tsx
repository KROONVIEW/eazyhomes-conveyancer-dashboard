import React from 'react';
import { ArrowDownTrayIcon, EyeIcon, TrashIcon, PaperClipIcon } from '@heroicons/react/24/outline';

type Document = {
  id: number;
  name: string;
  date: string;
  type: string;
  transfer?: string;
};

type DocumentTableProps = {
  documents: Document[];
  onView?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
  rowClassNameFn?: (index: number) => string;
  linkTransfer?: boolean;
};

const DocumentTable: React.FC<DocumentTableProps> = ({ documents, onView, onDownload, onDelete, rowClassNameFn, linkTransfer }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg shadow-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-700 text-sm">
          <th className="py-2 px-4 text-left">File Name</th>
          <th className="py-2 px-4 text-left">Upload Date</th>
          <th className="py-2 px-4 text-left">Type</th>
          <th className="py-2 px-4 text-left">Assigned Transfer</th>
          <th className="py-2 px-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc, i) => (
          <tr key={doc.id} className={rowClassNameFn ? rowClassNameFn(i) : 'hover:bg-blue-50 transition'}>
            <td className="py-2 px-4 font-medium text-blue-700 flex items-center gap-2">
              <PaperClipIcon className="h-4 w-4 text-blue-400" />
              <button
                className="text-blue-600 hover:underline focus:underline focus:outline-none"
                onClick={() => onView?.(doc)}
                title="View document"
                aria-label={`View ${doc.name}`}
              >
                {doc.name}
              </button>
            </td>
            <td className="py-2 px-4">{doc.date}</td>
            <td className="py-2 px-4">
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">{doc.type}</span>
            </td>
            <td className="py-2 px-4">
              {doc.transfer ? (
                linkTransfer ? (
                  <a href={`#/transfers/${doc.transfer}`} className="text-blue-600 underline hover:text-blue-800 text-xs font-semibold">{doc.transfer}</a>
                ) : (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{doc.transfer}</span>
                )
              ) : (
                <span className="text-gray-400 text-xs">None</span>
              )}
            </td>
            <td className="py-2 px-4 text-right flex gap-2 justify-end">
              <button
                className="p-1 rounded hover:bg-blue-50 focus:bg-blue-100 text-blue-600"
                title="View"
                aria-label={`View ${doc.name}`}
                onClick={() => onView?.(doc)}
              >
                <EyeIcon className="h-5 w-5" />
              </button>
              <button
                className="p-1 rounded hover:bg-blue-50 focus:bg-blue-100 text-blue-600"
                title="Download"
                aria-label={`Download ${doc.name}`}
                onClick={() => onDownload?.(doc)}
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                className="p-1 rounded hover:bg-red-50 focus:bg-red-100 text-red-600"
                title="Delete"
                aria-label={`Delete ${doc.name}`}
                onClick={() => onDelete?.(doc)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DocumentTable; 