// API Configuration for different environments
export const API_ENDPOINTS = {
  // PDF endpoints
  UPLOAD_PDF: `${import.meta.env.VITE_API_BASE_URL}/pdfs/upload`,
  GET_PDFS: `${import.meta.env.VITE_API_BASE_URL}/pdfs`,
  GET_PDF: (id) => `${import.meta.env.VITE_API_BASE_URL}/pdfs/${id}`,
  ADD_TEXT: `${import.meta.env.VITE_API_BASE_URL}/pdfs/add-text`,
  
  // Signature endpoints
  GET_SIGNATURES: (pdfId) => `${import.meta.env.VITE_API_BASE_URL}/signatures/${pdfId}`,
  FINALIZE_SIGNATURE: `${import.meta.env.VITE_API_BASE_URL}/signatures/finalize`,
  FINALIZE_AND_EMBED: `${import.meta.env.VITE_API_BASE_URL}/signatures/finalize-and-embed`,
  
  // Auth endpoints
  AUTH: `${import.meta.env.VITE_API_BASE_URL}/auth`,
  
  // External signer endpoints
  VALIDATE_LINK: (token) => `${import.meta.env.VITE_API_BASE_URL}/share/validate-link?token=${token}`,
  
  // File serving
  UPLOADS: `${import.meta.env.VITE_API_BASE_URL}/uploads`,
  FILE_PATH: (path) => `${import.meta.env.VITE_API_BASE_URL}${path}`,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export default API_BASE_URL; 