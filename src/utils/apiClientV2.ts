import axios from 'axios';

import { logout } from '../redux/auth/auth.actions';

const API_BASE_URL_V2 = import.meta.env.VITE_API_BASE_URL_V2 || '/api/v2/';

const apiClientV2 = axios.create({
  baseURL: API_BASE_URL_V2,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if backend requires credentials
  timeout: 30000, // 30 second timeout
});

apiClientV2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const setupResponseInterceptorV2 = (store: any) => {
  apiClientV2.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(logout());
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
};

export default apiClientV2;
