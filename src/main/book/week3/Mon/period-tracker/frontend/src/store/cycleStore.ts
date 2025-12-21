import { create } from 'zustand';
import api from '@/lib/api';
import type { Cycle, CreateCycleRequest, UpdateCycleRequest, CycleStats } from '@/types';

interface CycleState {
  cycles: Cycle[];
  stats: CycleStats | null;
  isLoading: boolean;
  error: string | null;
  fetchCycles: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createCycle: (data: CreateCycleRequest) => Promise<void>;
  updateCycle: (id: number, data: UpdateCycleRequest) => Promise<void>;
  deleteCycle: (id: number) => Promise<void>;
}

export const useCycleStore = create<CycleState>((set) => ({
  cycles: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchCycles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Cycle[]>('/cycles');
      set({ cycles: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<CycleStats>('/cycles/stats');
      set({ stats: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createCycle: async (data: CreateCycleRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<Cycle>('/cycles', data);
      set((state) => ({
        cycles: [response.data, ...state.cycles],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCycle: async (id: number, data: UpdateCycleRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<Cycle>(`/cycles/${id}`, data);
      set((state) => ({
        cycles: state.cycles.map((cycle) =>
          cycle.id === id ? response.data : cycle
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCycle: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/cycles/${id}`);
      set((state) => ({
        cycles: state.cycles.filter((cycle) => cycle.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
