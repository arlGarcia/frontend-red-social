import { create } from 'zustand';
import { usersApi } from '../api/config';

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchMyProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await usersApi.get('/api/users/me');
      set({ profile: data, loading: false });
    } catch (err) {
      set({ error: 'Error al cargar perfil', loading: false });
    }
  },

  updateProfile: async (name, bio, avatarUrl) => {
    set({ loading: true, error: null });
    try {
      const { data } = await usersApi.put('/api/users/me', { name, bio, avatarUrl });
      set({ profile: data, loading: false });
      return true;
    } catch (err) {
      set({ error: 'Error al actualizar perfil', loading: false });
      return false;
    }
  }
}));
