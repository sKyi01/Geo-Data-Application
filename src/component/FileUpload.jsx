import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        onFileUpload(fileContent);
      };
      reader.readAsText(file);
    });
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div 
      {...getRootProps()} 
      style={{
        border: '2px dashed #007bff', 
        backgroundColor: '#f8f9fa',
        textAlign: 'center',
        width: '50%',
        maxWidth: '600px',
        margin: '20px auto',
        padding: '40px',
        borderRadius: '10px',
        transition: 'border-color 0.3s ease-in-out, background-color 0.3s ease-in-out',
        cursor: 'pointer',
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = '#0056b3';
        e.currentTarget.style.backgroundColor = '#e9ecef';
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = '#007bff';
        e.currentTarget.style.backgroundColor = '#f8f9fa';
      }}
    >
      <input {...getInputProps()} />
      <p style={{ color: '#555', fontSize: '16px', margin: 0 }}>Drag & drop geo JSON & KML files here</p>
    </div>
  );
};

export default FileUpload;
