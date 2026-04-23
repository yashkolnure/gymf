import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useSuperAdminStore = create(
  persist(
    (set, get) => ({
      superAdmin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API}/super-admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          set({ superAdmin: data.data, token: data.token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.message };
        }
      },

      logout: () => {
        set({ superAdmin: null, token: null, isAuthenticated: false });
      },

      getHeaders: () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${get().token}`
      })
    }),
    {
      name: 'super-admin-auth',
      partialize: (s) => ({ superAdmin: s.superAdmin, token: s.token, isAuthenticated: s.isAuthenticated })
    }
  )
);
