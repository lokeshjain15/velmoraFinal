import axios from 'axios';

// In production or when frontend and backend share an origin, use /api.
// If hosted on a separate domain, set VITE_API_BASE_URL (e.g. https://velmorafinal-3.onrender.com/api).
const baseURL =
    import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
    baseURL,
    withCredentials: true,
});

export async function register({email, fullName, password}){
    const response = await api.post('/auth/register', {email, fullName, password});
    return response.data;
}

export async function login({email, password}){
    const response = await api.post('/auth/login', {email, password});
    return response.data;
}

export async function getMe(){
    const response = await api.get('/auth/getMe');
    return response.data;
}

export async function createProduct(formData) {
    const response = await api.post('/products', formData);
    return response.data;
}

export async function logout(){
    const response = await api.post('/auth/logout');
    return response.data;
}

export function getGoogleLoginUrl() {
    const apiBase = (baseURL || '/api').replace(/\/+$/, '');
    return `${apiBase}/auth/google`;
}

export function getApiError(error, fallback = 'Something went wrong. Please try again.') {
    return error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        (error.request ? 'Cannot reach the server. Make sure the backend is running.' : error.message) ||
        fallback;
}
