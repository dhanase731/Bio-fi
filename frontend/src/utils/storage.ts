/**
 * Secure storage utilities using Expo SecureStore
 * Handles sensitive data storage like JWT tokens
 */

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const SESSION_ID_KEY = 'session_id';

/**
 * Stores JWT access token securely
 * @param token - JWT token to store
 */
export const storeToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw new Error('Failed to store authentication token');
  }
};

/**
 * Retrieves stored JWT access token
 * @returns JWT token or null if not found
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Stores JWT refresh token securely
 * @param token - Refresh token to store
 */
export const storeRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw new Error('Failed to store refresh token');
  }
};

/**
 * Retrieves stored refresh token
 * @returns Refresh token or null if not found
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Stores user data securely
 * @param userData - User object to store
 */
export const storeUserData = async (userData: Record<string, any>): Promise<void> => {
  try {
    const data = JSON.stringify(userData);
    await SecureStore.setItemAsync(USER_KEY, data);
  } catch (error) {
    console.error('Error storing user data:', error);
    throw new Error('Failed to store user data');
  }
};

/**
 * Retrieves stored user data
 * @returns User data or null if not found
 */
export const getUserData = async (): Promise<Record<string, any> | null> => {
  try {
    const data = await SecureStore.getItemAsync(USER_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Stores session ID
 * @param sessionId - Session ID to store
 */
export const storeSessionId = async (sessionId: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(SESSION_ID_KEY, sessionId);
  } catch (error) {
    console.error('Error storing session ID:', error);
    throw new Error('Failed to store session ID');
  }
};

/**
 * Retrieves stored session ID
 * @returns Session ID or null if not found
 */
export const getSessionId = async (): Promise<string | null> => {
  try {
    const sessionId = await SecureStore.getItemAsync(SESSION_ID_KEY);
    return sessionId;
  } catch (error) {
    console.error('Error retrieving session ID:', error);
    return null;
  }
};

/**
 * Clears all stored authentication data
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(SESSION_ID_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw new Error('Failed to clear authentication data');
  }
};
