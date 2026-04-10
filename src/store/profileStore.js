import { create } from 'zustand';
import { usersApi } from '../api/config';

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchMyProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await usersApi.get('/api/users/profile');
      set({ profile: data, loading: false });
    } catch (err) {
      set({ error: 'Error al cargar perfil', loading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await usersApi.put('/api/users/profile', profileData);
      set({ profile: data, loading: false });
      return true;
    } catch (err) {
      set({ error: 'Error al actualizar perfil', loading: false });
      return false;
    }
  }
}));
