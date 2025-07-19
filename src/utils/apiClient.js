// src/utils/apiClient.js
import axios from 'axios';

// Assuming your API base URL
const API_BASE_URL = 'http://34.228.209.174:9000/api/v1/';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add the authentication token to every request
apiClient.interceptors.request.use(
    (config) => {
        // Get the token from localStorage (or wherever you store it)
        const token = localStorage.getItem('accessToken'); // Assuming you store your JWT as 'accessToken'

        if (token) {
            // If a token exists, add it to the Authorization header
            // Assuming JWT (Bearer token)
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => 
        // Do something with request error
         Promise.reject(error)
    
);

// Optional: Response Interceptor for handling token expiration, etc.
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Example: If 401 Unauthorized, maybe redirect to login
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized request. Token might be invalid or expired.');
            // You might want to dispatch a logout action here
            // store.dispatch(logoutUser()); // Requires importing store or dispatching globally
            window.location.href = '/sign-in'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default apiClient;