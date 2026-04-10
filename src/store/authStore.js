import { create } from 'zustand';
import { authApi } from '../api/config';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authApi.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ 
        user: { id: data.id, email: data.email }, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Error al iniciar sesión', 
        loading: false 
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      await authApi.post('/api/auth/register', { name, email, password });
      set({ loading: false });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Error al registrar usuario', 
        loading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  clearError: () => set({ error: null })
}));
