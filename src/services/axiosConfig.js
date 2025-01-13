import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
});



// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request
    console.log('Request:', config.method?.toUpperCase(), config.url);


    // Add token to header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 