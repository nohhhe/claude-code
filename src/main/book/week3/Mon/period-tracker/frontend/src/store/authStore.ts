import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials: LoginRequest) => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      register: async (data: RegisterRequest) => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
