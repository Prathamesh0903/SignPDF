import React, { useState, useEffect, useRef } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import axios from 'axios';
import { auth } from '../services/firebase';

const DraggableSignature = ({ signatureData, position, isFixed }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'signature',
    disabled: isFixed, // Disable dragging if fixed
  });

  const style = {
    position: 'absolute',
    zIndex: 100,
    left: position.x,
    top: position.y,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
    cursor: isFixed ? 'default' : (isDragging ? 'grabbing' : 'grab'), // Change cursor based on fixed state
    border: isDragging ? '2px dashed #5f6fff' : '2px solid transparent',
  };

  return (
    <div ref={setNodeRef} style={style} {...(isFixed ? {} : listeners)} {...attributes}>
      <img src={signatureData} alt="Signature" style={{ width: 180, height: 56, background: 'rgba(255,255,255,0.8)', borderRadius: 8 }} />
    </div>
  );
};

function SignaturePad() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [message, setMessage] = useState('');
  const [signaturePlaced, setSignaturePlaced] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [finalizedPdfUrl, setFinalizedPdfUrl] = useState(null);
  const [finalizing, setFinalizing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isSignatureFixed, setIsSignatureFixed] = useState(false);
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/pdfs')
      .then(res => setPdfs(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDragEnd = (event) => {
    const { delta } = event;
    const pdfRect = pdfContainerRef.current.getBoundingClientRect();

    setSignaturePosition(prev => {
      const newX = Math.max(0, Math.min(prev.x + delta.x, pdfContainerRef.current.clientWidth - 180)); // 180 is signature width
      const newY = Math.max(0, Math.min(prev.y + delta.y, pdfContainerRef.current.clientHeight - 56)); // 56 is signature height
      return { x: newX, y: newY };
    });
    setSignaturePlaced(true);
  };

  const generateSignature = () => {
    if (!fullName.trim()) {
      setMessage('Please enter your full name to generate a signature.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 112;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "50px 'Dancing Script', cursive";
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fullName, canvas.width / 2, canvas.height / 2);

    setSignatureData(canvas.toDataURL('image/png'));
    setSignaturePlaced(false);
    setFinalizedPdfUrl(null);
    setMessage('Signature generated. Drag it to the desired position.');
  };

  const handleFinalizeAndDownload = async () => {
    if (!signaturePlaced) {
      setMessage('Please place the signature on the document before finalizing.');
      return;
    }
    setFinalizing(true);
    setMessage('Finalizing and generating signed PDF...');
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await axios.post('http://localhost:5000/signatures/finalize-and-embed', {
        documentId: selectedPdf._id,
        signatureImage: signatureData,
        x: signaturePosition.x,
        y: signaturePosition.y + 280, // Add a small offset to push the signature down
        page: 1, // Assuming page 1 for now
        renderedPdfWidth: 600, // Fixed width of the PDF container
        renderedPdfHeight: 800, // Fixed height of the PDF container,
      }, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (response.data && response.data.newFilePath) {
        setFinalizedPdfUrl(`http://localhost:5000${response.data.newFilePath}`);
        setMessage('PDF signed successfully! You can now download your document.');
        setIsSignatureFixed(true); // Fix signature position after successful finalization
      } else {
        throw new Error(response.data.message || 'Failed to finalize PDF.');
      }
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    }
    setFinalizing(false);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: 700, padding: '2rem 1.5rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '2rem' }}>Sign PDF Document</h2>
          {/* Stepper */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: selectedPdf ? 'var(--color-primary)' : 'var(--color-muted)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, margin: '0 auto', marginBottom: 4 }}>1</div>
              <div style={{ color: selectedPdf ? 'var(--color-primary)' : 'var(--color-muted)', fontWeight: 600 }}>Select PDF</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: signatureData ? 'var(--color-primary)' : 'var(--color-muted)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, margin: '0 auto', marginBottom: 4 }}>2</div>
              <div style={{ color: signatureData ? 'var(--color-primary)' : 'var(--color-muted)', fontWeight: 600 }}>Signature</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: finalizedPdfUrl ? 'var(--color-primary)' : 'var(--color-muted)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, margin: '0 auto', marginBottom: 4 }}>3</div>
              <div style={{ color: finalizedPdfUrl ? 'var(--color-primary)' : 'var(--color-muted)', fontWeight: 600 }}>Download</div>
            </div>
          </div>
          {/* Step 1: Select PDF */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: 180 }}>
              <label htmlFor="pdf-select" style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>1. Select PDF:</label>
              <select
                id="pdf-select"
                value={selectedPdf ? selectedPdf._id : ''}
                onChange={(e) => {
                  const pdf = pdfs.find(p => p._id === e.target.value);
                  setSelectedPdf(pdf);
                  setSignatureData(null);
                  setSignaturePlaced(false);
                  setFinalizedPdfUrl(null);
                  setMessage(pdf ? 'PDF loaded. You can now generate your signature.' : '');
                }}
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
                <option value="">-- Choose a document --</option>
                {pdfs.map(pdf => (
                  <option key={pdf._id} value={pdf._id}>{pdf.filename}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 3, minWidth: 200 }}>
              <label htmlFor="full-name" style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>2. Enter Your Full Name:</label>
              <input
                type="text"
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!selectedPdf}
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
            <div style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'end' }}>
              <button
                onClick={generateSignature}
                disabled={!selectedPdf || !fullName}
                style={{
                  width: '100%',
                  padding: '0.6rem 0',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(79,70,229,0.08)',
                  cursor: 'pointer',
                  transition: 'background var(--transition), box-shadow var(--transition)',
                }}
              >
                Generate Signature
              </button>
            </div>
          </div>
          {message && <div style={{ background: finalizedPdfUrl ? 'var(--color-accent)' : 'var(--color-primary)', color: '#fff', borderRadius: 'var(--border-radius)', padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 500, marginTop: '1rem', boxShadow: '0 2px 8px rgba(245,158,66,0.08)', marginBottom: '1.5rem' }}>{message}</div>}
          {/* Step 2: PDF Preview and Signature Drag */}
          {selectedPdf && (
            <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                ref={pdfContainerRef}
                style={{ position: 'relative', width: 600, height: 800, border: '2px solid var(--color-muted)', borderRadius: 'var(--border-radius)', overflow: 'hidden', boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)', background: '#fff' }}
              >
                <iframe
                  src={`http://localhost:5000/uploads/${encodeURIComponent(selectedPdf.filename)}`}
                  title="PDF Preview"
                  width="100%"
                  height="100%"
                  style={{ border: 'none', borderRadius: 'var(--border-radius)' }}
                />
                {signatureData && (
                  <DraggableSignature signatureData={signatureData} position={signaturePosition} isFixed={isSignatureFixed} />
                )}
              </div>
              {signatureData && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', width: '100%' }}>
                  <button
                    onClick={handleFinalizeAndDownload}
                    disabled={finalizing || !signaturePlaced}
                    style={{
                      width: 260,
                      padding: '0.75rem 0',
                      background: 'var(--color-accent)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--border-radius)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      boxShadow: '0 2px 8px rgba(245,158,66,0.08)',
                      marginBottom: '1rem',
                      cursor: finalizing || !signaturePlaced ? 'not-allowed' : 'pointer',
                      transition: 'background var(--transition), box-shadow var(--transition)',
                    }}
                  >
                    {finalizing ? 'Finalizing...' : '3. Finalize & Download'}
                  </button>
                  {!signaturePlaced && <small style={{ color: 'var(--color-muted)' }}>Drag the signature to your desired location first.</small>}
                </div>
              )}
              {finalizedPdfUrl && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <a
                    href={finalizedPdfUrl}
                    style={{
                      background: 'var(--color-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--border-radius)',
                      padding: '0.75rem 2rem',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(79,70,229,0.08)',
                      transition: 'background var(--transition), box-shadow var(--transition)',
                    }}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Your Signed PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default SignaturePad;
