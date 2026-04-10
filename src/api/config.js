import axios from 'axios';

export const AUTH_URL = 'http://localhost:8081';
export const USERS_URL = 'http://localhost:8082';
export const POSTS_URL = 'http://localhost:8083';
export const LIKES_URL = 'http://localhost:8084';
export const WS_URL = 'http://localhost:8084/ws';

export const createApiClient = (baseURL) => {
  const api = axios.create({ baseURL });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export const authApi = createApiClient(AUTH_URL);
export const usersApi = createApiClient(USERS_URL);
export const postsApi = createApiClient(POSTS_URL);
export const likesApi = createApiClient(LIKES_URL);
