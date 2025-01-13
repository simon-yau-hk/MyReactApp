import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Check token on mount and token change
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = async () => {
    if(location.pathname==="/version"){
        return true;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found");
      setIsAuthenticated(false);
      navigate('/login');
      return false;
    }

    // Verify token 

  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}; 