import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function FileUpload() {
  const [message, setMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('uploaderId', 'testUser'); // Replace with actual user ID

    try {
      const res = await axios.post('http://localhost:5000/pdfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Error uploading PDF');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: '2rem 1.5rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.5rem' }}>Upload PDF</h2>
        <div
          {...getRootProps()}
          style={{
            border: isDragActive ? '2px solid var(--color-primary)' : '2px dashed var(--color-muted)',
            borderRadius: 'var(--border-radius)',
            background: isDragActive
              ? 'linear-gradient(120deg, #e0e7ff 0%, #c7d2fe 100%)'
              : 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)',
            transition: 'background 0.3s, border 0.3s',
            cursor: 'pointer',
            minHeight: 160,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: isDragActive ? '0 4px 16px rgba(99,102,241,0.12)' : '0 2px 8px rgba(79,70,229,0.08)',
          }}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: 48, color: 'var(--color-primary)', marginBottom: 8 }}>
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16V4m0 12-4-4m4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="18" width="16" height="2" rx="1" fill="currentColor" opacity=".2"/></svg>
          </div>
          {
            isDragActive ?
              <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Drop the PDF here ...</p> :
              <p style={{ fontWeight: 600 }}>Drag & drop a PDF here, or <span style={{ color: 'var(--color-primary)' }}>click to select</span></p>
          }
        </div>
        {message && <div style={{ background: 'var(--color-accent)', color: '#fff', borderRadius: 'var(--border-radius)', padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 500, marginTop: '1rem', boxShadow: '0 2px 8px rgba(245,158,66,0.08)' }}>{message}</div>}
      </div>
    </div>
  );
}

export default FileUpload;