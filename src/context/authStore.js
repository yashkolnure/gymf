import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      tenant: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authAPI.login({ email, password });
          localStorage.setItem('token', res.token);
          localStorage.setItem('refreshToken', res.refreshToken);
          set({
            user: res.data,
            token: res.token,
            refreshToken: res.refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
          // Fetch full profile with tenant
          get().fetchMe();
          toast.success(`Welcome back, ${res.data.name}! 💪`);
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.message };
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authAPI.register(data);
          localStorage.setItem('token', res.token);
          localStorage.setItem('refreshToken', res.refreshToken);
          set({
            user: res.data,
            token: res.token,
            isAuthenticated: true,
            isLoading: false
          });
          get().fetchMe();
          toast.success('Gym registered successfully! 🎉');
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.message };
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        try { await authAPI.logout(refreshToken); } catch {}
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ user: null, token: null, refreshToken: null, tenant: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      fetchMe: async () => {
        try {
          const res = await authAPI.me();
          set({ user: res.data, tenant: res.data.tenant, isAuthenticated: true });
        } catch {
          set({ isAuthenticated: false });
        }
      },

      updateUser: (updates) => set(state => ({ user: { ...state.user, ...updates } })),
      setTenant: (tenant) => set({ tenant }),

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'super_admin' || user.role === 'gym_owner') return true;
        return user.permissions?.includes(permission) || false;
      },

      hasRole: (...roles) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      }
    }),
    {
      name: 'gym-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
