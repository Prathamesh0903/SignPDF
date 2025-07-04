import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../services/firebase';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>{isSignup ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={isSignup ? handleSignup : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ fontSize: '1rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ fontSize: '1rem' }}
          />
          <button type="submit" style={{ fontSize: '1rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? (isSignup ? 'Signing Up...' : 'Signing In...') : (isSignup ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        <button
          onClick={handleGoogleSignIn}
          style={{
            marginTop: '1rem',
            background: '#fff',
            color: 'var(--color-text)',
            border: '1px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius)',
            boxShadow: '0 2px 8px rgba(79,70,229,0.08)'
          }}
          disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 22, height: 22 }} />
          {loading ? 'Please wait...' : (isSignup ? 'Sign up with Google' : 'Sign in with Google')}
        </button>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--color-muted)' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontWeight: 600,
              marginLeft: 8,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '1rem'
            }}
            disabled={loading}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
        {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Auth;