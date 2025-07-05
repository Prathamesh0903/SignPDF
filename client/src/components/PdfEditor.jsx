import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function PdfEditor() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState('');
  const [text, setText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(API_ENDPOINTS.GET_PDFS)
      .then(res => setPdfs(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleAddText = async () => {
    try {
      const res = await axios.post(API_ENDPOINTS.ADD_TEXT, {
        filepath: selectedPdf,
        pageNumber,
        text,
        x,
        y,
      });
      setMessage(res.data.message + '. New PDF path: ' + res.data.newFilePath);
    } catch (err) {
      console.error(err);
      setMessage('Error adding text to PDF');
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 520, padding: '2rem 1.5rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.5rem' }}>PDF Editor</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="pdf-select" style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Select PDF:</label>
          <select
            id="pdf-select"
            value={selectedPdf}
            onChange={(e) => setSelectedPdf(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--color-muted)',
              fontSize: '1rem',
              marginTop: 4,
              marginBottom: 8,
            }}
          >
            <option value="">--Please choose an option--</option>
            {pdfs.map(pdf => (
              <option key={pdf._id} value={pdf.filepath}>{pdf.filename}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 2, minWidth: 160 }}>
            <label htmlFor="text-input" style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Text to add:</label>
            <input
              type="text"
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--color-muted)',
                fontSize: '1rem',
                marginTop: 4,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 70 }}>
            <label htmlFor="page-number-input" style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Page #</label>
            <input
              type="number"
              id="page-number-input"
              value={pageNumber}
              onChange={(e) => setPageNumber(parseInt(e.target.value))}
              min={1}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--color-muted)',
                fontSize: '1rem',
                marginTop: 4,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 70 }}>
            <label htmlFor="x-coord-input" style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>X</label>
            <input
              type="number"
              id="x-coord-input"
              value={x}
              onChange={(e) => setX(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--color-muted)',
                fontSize: '1rem',
                marginTop: 4,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 70 }}>
            <label htmlFor="y-coord-input" style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Y</label>
            <input
              type="number"
              id="y-coord-input"
              value={y}
              onChange={(e) => setY(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--color-muted)',
                fontSize: '1rem',
                marginTop: 4,
              }}
            />
          </div>
        </div>
        <button
          onClick={handleAddText}
          style={{
            width: '100%',
            padding: '0.75rem 0',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(79,70,229,0.08)',
            marginBottom: '1rem',
            cursor: 'pointer',
            transition: 'background var(--transition), box-shadow var(--transition)',
          }}
        >
          Add Text to PDF
        </button>
        {message && <div style={{ background: 'var(--color-accent)', color: '#fff', borderRadius: 'var(--border-radius)', padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 500, marginTop: '1rem', boxShadow: '0 2px 8px rgba(245,158,66,0.08)' }}>{message}</div>}
      </div>
    </div>
  );
}

export default PdfEditor;