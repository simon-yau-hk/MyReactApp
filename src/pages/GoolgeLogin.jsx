import React, { useState, useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/AuthContext';
import { googleLoginApi } from '~/API';

const GoogleLoginComponent = () => {
  const [user, setUser] = useState(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useContext(AuthContext);


  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: '620540389061-idd7tqs4rrf4livtrpe81fo1ebqvin9a.apps.googleusercontent.com',
        callback: handleGoogleResponse
      });
      setIsGoogleLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      console.log("response",response);
      const googleUser = decodeJWT(response.credential);
      
      if (!googleUser) {
        console.error('Failed to decode Google token');
        return;
      }
      
      console.log('Google User Data:', googleUser);
      
     

      if (googleUser) {
         // Send to your auth system
        const data = await googleLoginApi.login(response.credential);
        await checkAuth(); // Update auth state
        navigate('/'); // Redirect to landing page
      }
      
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const renderGoogleButton = () => {
    if (isGoogleLoaded && window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with'
        }
      );
    }
  };

  useEffect(() => {
    if (isGoogleLoaded && !user) {
      renderGoogleButton();
    }
  }, [isGoogleLoaded, user]);

  return (
    <div>
      { 
        <div>
          <h3>Please sign in</h3>
          <div id="google-signin-button"></div>
          <br />
          
        </div>
      } 
    </div>
  );
};

export default GoogleLoginComponent;