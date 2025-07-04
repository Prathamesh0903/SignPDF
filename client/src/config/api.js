// API Configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // PDF endpoints
  UPLOAD_PDF: `${API_BASE_URL}/pdfs/upload`,
  GET_PDFS: `${API_BASE_URL}/pdfs`,
  GET_PDF: (id) => `${API_BASE_URL}/pdfs/${id}`,
  ADD_TEXT: `${API_BASE_URL}/pdfs/add-text`,
  
  // Signature endpoints
  GET_SIGNATURES: (pdfId) => `${API_BASE_URL}/signatures/${pdfId}`,
  FINALIZE_SIGNATURE: `${API_BASE_URL}/signatures/finalize`,
  FINALIZE_AND_EMBED: `${API_BASE_URL}/signatures/finalize-and-embed`,
  
  // Auth endpoints
  AUTH: `${API_BASE_URL}/auth`,
  
  // External signer endpoints
  VALIDATE_LINK: (token) => `${API_BASE_URL}/share/validate-link?token=${token}`,
  
  // File serving
  UPLOADS: `${API_BASE_URL}/uploads`,
  FILE_PATH: (path) => `${API_BASE_URL}${path}`,
};

export default API_BASE_URL; 