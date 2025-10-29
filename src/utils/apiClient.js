import axios from 'axios';

import { logout } from '../redux/auth/auth.actions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if backend requires credentials
  timeout: 30000, // 30 second timeout
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

export const setupResponseInterceptor = (store) => {
  apiClient.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      // Log detailed error information
      console.error('API Error Details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      });

      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized - logging out');
        store.dispatch(logout());
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;
