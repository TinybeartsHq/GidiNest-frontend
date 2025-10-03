// src/utils/apiClient.js
import axios from 'axios';

import {
    logout
} from '../redux/auth/auth.actions';

const API_BASE_URL = 'https://api.gidinest.com/api/v1/';

// const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/';


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add the authentication token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// We'll export a new function to configure the response interceptor
export const setupResponseInterceptor = (store) => {
    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            // If 401 Unauthorized, dispatch the logout action
            if (error.response && error.response.status === 401) {
                console.warn('Unauthorized request. Token might be invalid or expired.');
                store.dispatch(logout());
                // Redirect to sign-in page after logout
                window.location.href = '/';
            }
            return Promise.reject(error);
        }
    );
};

export default apiClient;