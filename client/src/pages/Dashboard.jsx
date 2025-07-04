import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import SignaturePlaceholder from '../components/SignaturePlaceholder';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function Dashboard() {
  const [pdfs, setPdfs] = useState([]);
  const [signatures, setSignatures] = useState({});
  const [loadingPdf, setLoadingPdf] = useState({});
  const [pdfLoadError, setPdfLoadError] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/pdfs')
      .then(res => setPdfs(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    pdfs.forEach(pdf => {
      axios.get(`http://localhost:5000/signatures/${pdf._id}`)
        .then(res => {
          setSignatures(prevSignatures => ({
            ...prevSignatures,
            [pdf._id]: res.data,
          }));
        })
        .catch(err => console.log(err));
    });
  }, [pdfs]);

  const onDocumentLoadSuccess = (pdfId) => () => {
    setLoadingPdf(prev => ({ ...prev, [pdfId]: false }));
    setPdfLoadError(prev => ({ ...prev, [pdfId]: false }));
  };

  const onDocumentLoadError = (pdfId) => (error) => { 
    console.error('Error loading PDF:', error);
    setLoadingPdf(prev => ({ ...prev, [pdfId]: false }));
    setPdfLoadError(prev => ({ ...prev, [pdfId]: true }));
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: '2rem', textAlign: 'center', fontWeight: 700, fontSize: '2rem' }}>Your Uploaded PDFs</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem',
      }}>
        {pdfs.map(pdf => (
          <div key={pdf._id} className="card" style={{
            borderRadius: 'var(--border-radius)',
            boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.15s',
            background: 'var(--color-surface)',
            position: 'relative',
            minHeight: 120,
            justifyContent: 'center',
          }}>
            <h3 style={{
              color: 'var(--color-text)',
              fontWeight: 600,
              fontSize: '1.1rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }} title={pdf.filename}>{pdf.filename}</h3>
            <a
              href={`http://localhost:5000/${pdf.filepath}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                padding: '0.5rem 1.2rem',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                marginTop: '0.5rem',
                boxShadow: '0 2px 8px rgba(79,70,229,0.08)',
                transition: 'background var(--transition), box-shadow var(--transition)',
                display: 'inline-block',
              }}
            >
              View PDF
            </a>
          </div>
        ))}
      </div>
      {/* Floating Upload Button */}
      <button
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: '2.5rem',
          background: 'var(--color-accent)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 60,
          height: 60,
          fontSize: '2rem',
          boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.18)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background var(--transition), box-shadow var(--transition)',
        }}
        title="Upload PDF"
        onClick={() => window.location.href = '/upload'}
      >
        +
      </button>
    </div>
  );
}

export default Dashboard;