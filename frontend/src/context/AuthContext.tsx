/**
 * Authentication Context and Store
 * Uses Zustand for global state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, Staff, LoginCredentials } from '../types';
import { authAPI } from '../services/api';
import {
  storeToken,
  storeUserData,
  clearAuthData,
  getToken,
  getUserData,
} from '../utils/storage';

/**
 * Authentication store with Zustand
 * Handles login, logout, and auth state management
 */
export const useAuthStore = create<AuthContextType>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      error: null,

      /**
       * Login with email and password
       */
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);

          // Store auth state
          await storeToken(response.token.accessToken);
          if (response.token.refreshToken) {
            // Store refresh token
          }
          await storeUserData(response.staff);

          set({
            isAuthenticated: true,
            user: response.staff,
            token: response.token.accessToken,
            error: null,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage =
            error.message || 'Login failed. Please try again.';
          set({
            isAuthenticated: false,
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      /**
       * Logout user and clear data
       */
      logout: async () => {
        set({ isLoading: true });
        try {
          await authAPI.logout();
          await clearAuthData();

          set({
            isAuthenticated: false,
            user: null,
            token: null,
            error: null,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Logout error:', error);
          // Clear local state even if logout fails
          await clearAuthData();
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            error: null,
            isLoading: false,
          });
        }
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist authentication state, not loading state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

/**
 * Hook to initialize auth state from storage on app startup
 */
export const initializeAuth = async () => {
  try {
    const token = await getToken();
    const userData = await getUserData();

    if (token && userData) {
      useAuthStore.setState({
        isAuthenticated: true,
        token,
        user: userData as Staff,
      });
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
  }
};
