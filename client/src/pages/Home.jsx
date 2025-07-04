import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Upload PDF',
    description: 'Easily upload your PDF documents to the platform for signing or editing.',
    link: '/upload',
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16V4m0 12-4-4m4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="18" width="16" height="2" rx="1" fill="currentColor" opacity=".2"/></svg>
    ),
  },
  {
    title: 'Dashboard',
    description: 'View and manage all your uploaded PDF documents in one place.',
    link: '/dashboard',
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" opacity=".2"/><rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity=".2"/><rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" opacity=".2"/><rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor"/></svg>
    ),
  },
  {
    title: 'Sign PDF',
    description: 'Digitally sign your PDF by generating and placing your signature on the document.',
    link: '/sign-pdf',
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path d="M3 17c2.5-2.5 6.5-2.5 9 0s6.5 2.5 9 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 12v-2a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="7" r="4" fill="currentColor" opacity=".2"/></svg>
    ),
  },
];

const steps = [
  {
    title: '1. Upload',
    text: 'Start by uploading your PDF document securely to our platform.'
  },
  {
    title: '2. Edit or Sign',
    text: 'Add text or your digital signature to the document as needed.'
  },
  {
    title: '3. Finalize & Download',
    text: 'Finalize your changes and download your completed PDF instantly.'
  }
];

function Home() {
  return (
    <div className="container" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      {/* Hero Section */}
      <section style={{ width: '100%', maxWidth: 1100, textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '2.8rem', marginBottom: '1rem' }}>Welcome to SignPDF Lite</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1.3rem', marginBottom: '2rem', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
          Your all-in-one solution for uploading, editing, and digitally signing PDF documents. Fast, secure, and beautifully simple.
        </p>
       
      </section>

      {/* Features Section */}
      <section style={{ width: '100%', maxWidth: 1100, marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Features</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          width: '100%',
        }}>
          {features.map((feature, idx) => (
            <div key={feature.title} className="card" style={{
              borderRadius: 'var(--border-radius)',
              boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'var(--color-surface)',
              transition: 'transform 0.15s',
              minHeight: 260,
              justifyContent: 'center',
            }}>
              <div style={{ marginBottom: 18, color: 'var(--color-primary)' }}>{feature.icon}</div>
              <h3 style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 10, textAlign: 'center' }}>{feature.title}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginBottom: 18, textAlign: 'center' }}>{feature.description}</p>
              <Link to={feature.link} style={{
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                padding: '0.5rem 1.2rem',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                marginTop: 'auto',
                boxShadow: '0 2px 8px rgba(79,70,229,0.08)',
                transition: 'background var(--transition), box-shadow var(--transition)',
                display: 'inline-block',
              }}>
                Go to {feature.title}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ width: '100%', maxWidth: 900, marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>How it Works</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          {steps.map((step, idx) => (
            <div key={step.title} style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--border-radius)',
              boxShadow: '0 2px 8px rgba(31, 38, 135, 0.08)',
              padding: '1.5rem 1.2rem',
              minWidth: 220,
              maxWidth: 300,
              textAlign: 'center',
              flex: 1,
            }}>
              <div style={{ fontSize: '2rem', color: 'var(--color-accent)', fontWeight: 700, marginBottom: 8 }}>{step.title}</div>
              <div style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>{step.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ width: '100%', maxWidth: 1100, textAlign: 'center', color: 'var(--color-muted)', fontSize: '1rem', padding: '2rem 0 1rem 0', borderTop: '1px solid #e5e7eb', marginTop: '2rem' }}>
        &copy; {new Date().getFullYear()} SignPDF Lite. All rights reserved.
      </footer>
    </div>
  );
}

export default Home; 