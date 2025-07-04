import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setSuccess(null);
    
    // Validate file type
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      setFile(null);
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      console.log('Uploading to:', API_ENDPOINTS.UPLOAD_PDF);
      console.log('File:', file.name, 'Size:', file.size);
      
      const res = await axios.post(API_ENDPOINTS.UPLOAD_PDF, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('Upload response:', res.data);

      if (res.data.success) {
        setSuccess('PDF uploaded successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(res.data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || `Upload failed: ${err.response.status}`);
      } else if (err.request) {
        // Network error
        setError('Network error: Unable to connect to server. Please check your internet connection.');
      } else {
        // Other error
        setError('Upload failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 500, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Upload PDF</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="pdf-upload" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Select PDF File:
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
              style={{ fontSize: '1rem', width: '100%' }}
            />
            {file && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <button 
            type="submit" 
            style={{ 
              fontSize: '1rem', 
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }} 
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>
        {error && (
          <div style={{ 
            color: 'red', 
            marginTop: '1rem', 
            textAlign: 'center',
            padding: '0.75rem',
            backgroundColor: '#ffe6e6',
            borderRadius: '4px',
            border: '1px solid #ffcccc'
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ 
            color: 'green', 
            marginTop: '1rem', 
            textAlign: 'center',
            padding: '0.75rem',
            backgroundColor: '#e6ffe6',
            borderRadius: '4px',
            border: '1px solid #ccffcc'
          }}>
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;