import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Dashboard from './pages/Dashboard';
import Auth from './components/Auth';
import AuthWrapper from './components/AuthWrapper';
import PdfEditor from './components/PdfEditor';
import SignaturePad from './components/SignaturePad';
import FinalizeSignature from './components/FinalizeSignature';
import ExternalSigner from './pages/ExternalSigner';
import Home from './pages/Home';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar({ user }) {
  const handleSignOut = async () => {
    await signOut(auth);
    // Optionally, you can add more logic here (e.g., redirect)
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow" style={{width: '100vw', left: 0, top: 0, zIndex: 1000}}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">SignPDF</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upload">Upload PDF</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item"> 
              <Link className="nav-link" to="/sign-pdf">Sign PDF</Link>
            </li>
            <li className="nav-item">
              {/* <Link className="nav-link" to="/share-document">Share Document</Link> */}
            </li>
          </ul>
          {/* User info and signout */}
          {user && (
            <div className="d-flex align-items-center" style={{gap: '1rem'}}>
              <span style={{color: '#fff', fontWeight: 500}}>{user.email}</span>
              <button className="btn btn-outline-light btn-sm" onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Show only Auth page if not logged in
  if (!user) {
    return (
      <div className="App">
        <Routes>
          <Route path="/*" element={<Auth />} />
        </Routes>
      </div>
    );
  }

  // Determine if current route is login page
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="App">
      {/* Show navbar only if not on login page */}
      {!isLoginPage && <Navbar user={user} />}
      {/* Placeholder for navbar height if navbar is shown */}
      {!isLoginPage && <div style={{height: '64px'}}></div>}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/sign-external" element={<ExternalSigner />} />
          <Route element={<AuthWrapper />}>
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-pdf" element={<PdfEditor />} />
            <Route path="/sign-pdf" element={<SignaturePad />} />
            <Route path="/finalize-signature" element={<FinalizeSignature />} />
            {/* <Route path="/share-document" element={<ShareDocument />} /> */}
          </Route>
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;