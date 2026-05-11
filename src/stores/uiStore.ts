import { create } from 'zustand';

export type Tab = 'swap' | 'liquidity' | 'farm' | 'bridge' | 'tokens';

interface UIState {
  activeTab: Tab;
  isLoading: boolean;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  setActiveTab: (tab: Tab) => void;
  setLoading: (loading: boolean) => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'swap',
  isLoading: false,
  notification: null,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  showNotification: (type, message) => {
    set({ notification: { type, message } });
    // Auto-clear after 5 seconds
    setTimeout(() => {
      set({ notification: null });
    }, 5000);
  },
  
  clearNotification: () => set({ notification: null }),
}));
