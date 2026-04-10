import { create } from 'zustand';
import { postsApi, likesApi } from '../api/config';

export const usePostsStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  page: 0,
  hasMore: true,

  fetchPosts: async (page = 0, append = false) => {
    set({ loading: true, error: null });
    try {
      const { data } = await postsApi.get(`/api/posts?page=${page}&size=10`);
      set((state) => ({ 
        posts: append ? [...state.posts, ...data.content] : data.content,
        page: data.number,
        hasMore: !data.last,
        loading: false 
      }));
    } catch (err) {
      set({ error: 'Error al cargar publicaciones', loading: false });
    }
  },

  createPost: async (content) => {
    try {
      const { data } = await postsApi.post('/api/posts', { content });
      set((state) => ({ posts: [data, ...state.posts] }));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  deletePost: async (id) => {
    try {
      await postsApi.delete(`/api/posts/${id}`);
      set((state) => ({ posts: state.posts.filter(p => p.id !== id) }));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  toggleLike: async (postId) => {
    try {
      // Optimistic update
      const prevPosts = get().posts;
      set({
        posts: prevPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likedByMe: !p.likedByMe,
              likesCount: p.likedByMe ? p.likesCount - 1 : p.likesCount + 1
            };
          }
          return p;
        })
      });

      const { data } = await likesApi.post(`/api/likes/post/${postId}`);
      
      // Update with server truth
      set({
        posts: get().posts.map(p => 
          p.id === postId 
            ? { ...p, likedByMe: data.liked, likesCount: data.likesCount }
            : p
        )
      });
    } catch (err) {
      console.error(err);
      // Revert optimism if needed (simple reload)
      get().fetchPosts(0, false);
    }
  },

  updatePostLikes: (postId, increment, actionType) => {
    // Utility for WebSocket incoming updates
    set({
      posts: get().posts.map(p => {
        if (p.id === postId) {
          // Si el evento es provocado por nosotros mismos (likedByMe matches el actionType),
          // el optimismo ya lo manejó o lo manejará. Pero por consistencia, actualizamos el contador globalmente.
          return { ...p, likesCount: p.likesCount + increment };
        }
        return p;
      })
    });
  }
}));
