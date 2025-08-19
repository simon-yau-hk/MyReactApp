import axios from 'axios';
// Add these utility functions for token management
const API_BASE_URL = '';
const setToken = (token) => localStorage.setItem('token', token);
const getToken = () => localStorage.getItem('token');
const removeToken = () => localStorage.removeItem('token');

export const login = async (accessToken) => {
    try {
      console.log("accessToken :",accessToken);
      const {data} = await axios.post(`api/home/googleLogin`,{accessToken});
        console.log("data :",data);
      // Store the JWT token
      if (data) {
        setToken(data);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Add logout function
export const logout = () => {
    removeToken();
    window.location.href = '/login';
  };