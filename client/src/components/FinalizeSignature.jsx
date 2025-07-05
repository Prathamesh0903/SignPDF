import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function FinalizeSignature() {
  const [pdfs, setPdfs] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState('');
  const [selectedSignature, setSelectedSignature] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(API_ENDPOINTS.GET_PDFS)
      .then(res => setPdfs(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedPdf) {
      axios.get(API_ENDPOINTS.GET_SIGNATURES(selectedPdf))
        .then(res => setSignatures(res.data))
        .catch(err => console.log(err));
    }
  }, [selectedPdf]);

  const handleFinalize = async () => {
    try {
      const res = await axios.post(API_ENDPOINTS.FINALIZE_SIGNATURE, {
        documentId: selectedPdf,
        signatureId: selectedSignature,
      });
      setMessage(res.data.message + '. New PDF path: ' + res.data.newFilePath);
    } catch (err) {
      console.error(err);
      setMessage('Error finalizing PDF');
    }
  };

  return (
    <div className="main-content p-4">
      <h2 className="mb-4">Finalize Signature</h2>
      <div className="mb-3">
        <label htmlFor="pdf-select" className="form-label">Select PDF:</label>
        <select
          id="pdf-select"
          className="form-select"
          value={selectedPdf}
          onChange={(e) => setSelectedPdf(e.target.value)}
        >
          <option value="">--Please choose an option--</option>
          {pdfs.map(pdf => (
            <option key={pdf._id} value={pdf._id}>{pdf.filename}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="signature-select" className="form-label">Select Signature:</label>
        <select
          id="signature-select"
          className="form-select"
          value={selectedSignature}
          onChange={(e) => setSelectedSignature(e.target.value)}
        >
          <option value="">--Please choose an option--</option>
          {signatures.map(sig => (
            <option key={sig._id} value={sig._id}>Signature at ({sig.x}, {sig.y}) on page {sig.page}</option>
          ))}
        </select>
      </div>

      <button onClick={handleFinalize} className="btn btn-primary">Finalize PDF</button>
      {message && <p className="text-success mt-4">{message}</p>}
    </div>
  );
}

export default FinalizeSignature;