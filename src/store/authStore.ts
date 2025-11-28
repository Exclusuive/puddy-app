import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    photo?: string;
  } | null;
  login: (userData: { id: string; email: string; name: string; photo?: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AUTH_STORAGE_KEY = '@auth_user';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,

  login: async (userData) => {
    try {
      // AsyncStorage에 사용자 정보 저장
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      set({ isAuthenticated: true, user: userData });
    } catch (error) {
      console.error('로그인 저장 실패:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  },

  checkAuth: async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        set({ isAuthenticated: true, user: userData, isLoading: false });
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch (error) {
      console.error('인증 확인 실패:', error);
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },
}));

