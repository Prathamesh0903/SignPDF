import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { auth } from "../services/firebase";
import { onAuthStateChanged } from 'firebase/auth';

function AuthWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once auth state is determined
      if (!currentUser) {
        navigate('/');
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  return user ? <Outlet /> : null;
}

export default AuthWrapper;
