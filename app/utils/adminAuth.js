import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

// Function to check if user is authenticated
export function checkAdminAuth() {
  const isAuth = Cookies.get('adminAuthenticated');
  const authExpiry = localStorage.getItem('adminAuthExpires');
  
  return (
    isAuth === 'true' && 
    authExpiry && 
    new Date().getTime() < parseInt(authExpiry)
  );
}

// Custom hook for admin authentication with auth modal
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    if (checkAdminAuth()) {
      setIsAuthenticated(true);
    } else {
      setShowAuthModal(true);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  return {
    isAuthenticated,
    showAuthModal,
    isLoading,
    handleAuthSuccess
  };
}
