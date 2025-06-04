import React, { useRef, useState } from 'react';

type UploadZoneProps = {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string[];
  children?: React.ReactNode;
};

const UploadZone: React.FC<UploadZoneProps> = ({ onFileUpload, acceptedTypes = ['.pdf', '.docx'], children }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition bg-blue-50 hover:bg-blue-100 cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-100' : 'border-blue-300'}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        className="hidden"
        onChange={handleChange}
      />
      {children || (
        <>
          <span className="text-blue-700 font-semibold">Drag & drop files here or <span className="underline">browse</span></span>
        </>
      )}
    </div>
  );
};

export default UploadZone; 