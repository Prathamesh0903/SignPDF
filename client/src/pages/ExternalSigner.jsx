import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { DndContext, useDraggable } from '@dnd-kit/core';

const DraggableSignature = ({ signatureData, position }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'signature' });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: 'absolute',
        zIndex: 100,
        cursor: 'grabbing',
        border: '2px dashed #5f6fff',
      }
    : {
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 100,
        cursor: 'grab',
        border: '2px solid transparent',
      };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <img src={signatureData} alt="Signature" style={{ width: 180, height: 56, background: 'rgba(255,255,255,0.8)', borderRadius: 8 }} />
    </div>
  );
};

function ExternalSigner() {
  const location = useLocation();
  const [documentId, setDocumentId] = useState(null);
  const [pdfDetails, setPdfDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [signatureData, setSignatureData] = useState(null);
  const [signaturePlaced, setSignaturePlaced] = useState(false);
  const [fullName, setFullName] = useState('');
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      axios.get(`http://localhost:5000/share/validate-link?token=${token}`)
        .then(res => {
          if (res.data.valid) {
            setDocumentId(res.data.documentId);
            setMessage('Token validated. You can now sign the document.');
          } else {
            setMessage('Invalid or expired token.');
          }
        })
        .catch(err => {
          console.error(err);
          setMessage('Error validating token.');
        });
    } else {
      setMessage('No token provided.');
    }
  }, [location.search]);

  useEffect(() => {
    if (documentId) {
      axios.get(`http://localhost:5000/pdfs/${documentId}`)
        .then(res => setPdfDetails(res.data))
        .catch(err => console.log(err));
    }
  }, [documentId]);

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

    ctx.font = `50px 'Dancing Script', cursive`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fullName, canvas.width / 2, canvas.height / 2);

    setSignatureData(canvas.toDataURL('image/png'));
    setSignaturePlaced(false);
    setMessage('Signature generated. Drag it to the desired position.');
  };

  const handleDragEnd = (event) => {
    const { delta } = event;
    const pdfRect = pdfContainerRef.current.getBoundingClientRect();

    setSignaturePosition(prev => {
      const newX = Math.max(0, Math.min(prev.x + delta.x, pdfRect.width - 180)); // 180 is signature width
      const newY = Math.max(0, Math.min(prev.y + delta.y, pdfRect.height - 56)); // 56 is signature height
      return { x: newX, y: newY };
    });
    setSignaturePlaced(true);
  };

  const handleFinalizeAndDownload = async () => {
    if (!signaturePlaced) {
      setMessage('Please place the signature on the document before finalizing.');
      return;
    }
    setMessage('Finalizing and generating signed PDF...');
    try {
      // For external signers, we might not have a Firebase UID. 
      // You'll need a way to identify them, e.g., from the JWT or a temporary ID.
      const userId = 'external_signer'; 

      const response = await axios.post('http://localhost:5000/signatures/finalize-and-embed', {
        documentId: pdfDetails._id,
        signatureImage: signatureData,
        x: signaturePosition.x,
        y: signaturePosition.y,
        page: 1, // Assuming page 1 for now
      });

      if (response.data && response.data.newFilePath) {
        setMessage('PDF signed successfully! You can now download your document.');
        window.open(`http://localhost:5000${response.data.newFilePath}`, '_blank');
      } else {
        throw new Error(response.data.message || 'Failed to finalize PDF.');
      }
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="main-content p-4">
        <h2 className="mb-4">Sign Document</h2>
        <p>{message}</p>

        {documentId && pdfDetails && (
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="full-name" className="form-label">Enter Your Full Name:</label>
              <input 
                type="text"
                id="full-name"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button className="btn btn-primary w-100" onClick={generateSignature} disabled={!fullName}>
                Generate Signature
              </button>
            </div>
          </div>
        )}

        {documentId && pdfDetails && (
          <div className="mt-4">
            <div 
              ref={pdfContainerRef} 
              className="pdf-container mx-auto shadow-lg" 
              style={{ position: 'relative', width: '600px', height: '800px', border: '1px solid #ddd' }}
            >
              <iframe
                src={`http://localhost:5000/${pdfDetails.filepath}`}
                title="PDF Preview"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
              {signatureData && (
                <DraggableSignature signatureData={signatureData} position={signaturePosition} />
              )}
            </div>

            {signatureData && (
              <div className="d-flex flex-column align-items-center mt-4 gap-3">
                <button 
                  className="btn btn-lg btn-success px-5 py-2 fw-bold shadow-sm" 
                  onClick={handleFinalizeAndDownload} 
                  disabled={!signaturePlaced}
                >
                  Finalize & Download
                </button>
                {!signaturePlaced && <small className='text-muted'>Drag the signature to your desired location first.</small>}
              </div>
            )}
          </div>
        )}
      </div>
    </DndContext>
  );
}

export default ExternalSigner;