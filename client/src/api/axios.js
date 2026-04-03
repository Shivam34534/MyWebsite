import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL
})

// Attach JWT Token for authentication
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global API Guardian: Detects 401 Unauthorized errors (expired/invalid tokens) 
// and resets the app state immediately to prevent infinite "ghost sessions"
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Correctly handle 401 status while excluding auth endpoints (login/register) to prevent false positives
        if (error.response?.status === 401 && error.config && !error.config.url.includes('/api/auth')) {
            console.warn("[Aura Guard] 401 Unauthorized detected. Resetting session...");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Use setTimeout to avoid UI glitches during immediate unmount
            setTimeout(() => {
                window.location.reload(); 
            }, 100);
        }
        return Promise.reject(error);
    }
);

export default api;