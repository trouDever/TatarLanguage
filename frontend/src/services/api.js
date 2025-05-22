import axios from 'axios';

const api = axios.create({ baseURL: 'https://your-backend.com/api/v1' });

export function loginRequest(data) { return api.post('/jwt/create/', data); }
export function registerRequest(data) { return api.post('/users/', data); }
export function refreshToken(refresh) { return api.post('/jwt/refresh/', { refresh }); }
export function getUserMe(access) {
    return api.get('/users/me/', { headers: { Authorization: `Bearer ${access}` } });
}
