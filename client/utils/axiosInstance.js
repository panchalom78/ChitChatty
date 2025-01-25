import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:3000', // Replace with your backend URL
    withCredentials: true, // Send cookies with requests
    timeout: 10000, // Optional: timeout in milliseconds
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Modify request config if needed
        console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses
        console.log('[Response]', response);
        return response;
    },
    (error) => {
        // Handle errors globally
        console.error('[Response Error]', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
