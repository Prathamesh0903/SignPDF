import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function Dashboard() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_PDFS);
      const pdfsWithSignatures = await Promise.all(
        response.data.map(async (pdf) => {
          try {
            const signatureResponse = await axios.get(API_ENDPOINTS.GET_SIGNATURES(pdf._id));
            return { ...pdf, signatures: signatureResponse.data };
          } catch (err) {
            return { ...pdf, signatures: [] };
          }
        })
      );
      setPdfs(pdfsWithSignatures);
    } catch (err) {
      setError('Failed to fetch PDFs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container" style={{ minHeight: '90vh', padding: '2rem 0', background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)' }}>
      <h1 style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Dashboard</h1>
      
      {pdfs.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '1.2rem' }}>
          No PDFs uploaded yet. <a href="/upload" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Upload your first PDF</a>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          width: '100%',
        }}>
          {pdfs.map((pdf) => (
            <div key={pdf._id} className="card" style={{
              borderRadius: 'var(--border-radius)',
              boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
              padding: '1.5rem',
              background: 'var(--color-surface)',
              transition: 'transform 0.15s',
            }}>
              <h3 style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 10 }}>{pdf.filename}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: 15 }}>
                Uploaded: {new Date(pdf.uploadDate).toLocaleDateString()}
              </p>
              
              <div style={{ marginBottom: 15 }}>
                <strong>Signatures:</strong> {pdf.signatures?.length || 0}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <a
                  href={API_ENDPOINTS.FILE_PATH(pdf.filepath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(79,70,229,0.08)',
                  }}
                >
                  View PDF
                </a>
                <a
                  href="/sign-pdf"
                  style={{
                    background: 'var(--color-accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(245,158,66,0.08)',
                  }}
                >
                  Sign PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;