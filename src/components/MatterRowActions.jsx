import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiUpload } from 'react-icons/fi';

const MatterRowActions = () => {
  return (
    <div className="flex items-center gap-2 justify-end">
      <button className="p-2 rounded hover:bg-gray-100 text-blue-600" title="View" onClick={() => {}}>
        <FiEye className="w-5 h-5" />
      </button>
      <button className="p-2 rounded hover:bg-gray-100 text-green-600" title="Edit" onClick={() => {}}>
        <FiEdit className="w-5 h-5" />
      </button>
      <button className="p-2 rounded hover:bg-gray-100 text-yellow-600" title="Upload Docs" onClick={() => {}}>
        <FiUpload className="w-5 h-5" />
      </button>
      <button className="p-2 rounded hover:bg-gray-100 text-red-600" title="Delete" onClick={() => {}}>
        <FiTrash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MatterRowActions; 