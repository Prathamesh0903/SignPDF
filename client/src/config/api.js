// API Configuration for different environments
export const API_ENDPOINTS = {
  // PDF endpoints
  UPLOAD_PDF: `${import.meta.env.VITE_API_BASE_URL}/api/pdfs/upload`,
  GET_PDFS: `${import.meta.env.VITE_API_BASE_URL}/api/pdfs`,
  GET_PDF: (id) => `${import.meta.env.VITE_API_BASE_URL}/api/pdfs/${id}`,
  ADD_TEXT: `${import.meta.env.VITE_API_BASE_URL}/api/pdfs/add-text`,
  
  // Signature endpoints
  GET_SIGNATURES: (pdfId) => `${import.meta.env.VITE_API_BASE_URL}/api/signatures/${pdfId}`,
  FINALIZE_SIGNATURE: `${import.meta.env.VITE_API_BASE_URL}/api/signatures/finalize`,
  FINALIZE_AND_EMBED: `${import.meta.env.VITE_API_BASE_URL}/api/signatures/finalize-and-embed`,
  
  // Auth endpoints
  AUTH: `${import.meta.env.VITE_API_BASE_URL}/api/auth`,
  
  // External signer endpoints
  VALIDATE_LINK: (token) => `${import.meta.env.VITE_API_BASE_URL}/api/share/validate-link?token=${token}`,
  
  // File serving
  UPLOADS: `${import.meta.env.VITE_API_BASE_URL}/api/uploads`,
  FILE_PATH: (path) => `${import.meta.env.VITE_API_BASE_URL}/api${path}`,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export default API_BASE_URL; 