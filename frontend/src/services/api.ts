/**
 * API Service Layer
 * Handles all HTTP requests to the backend
 * Uses Axios for HTTP client
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { LoginCredentials, LoginResponse, ApiError } from '../types';
import { getToken, storeToken, storeRefreshToken, storeUserData } from '../utils/storage';

/**
 * API Base Configuration
 * UPDATE THIS WITH YOUR BACKEND URL
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT token to headers
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error adding token to request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    let apiError: ApiError;

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      apiError = {
        code: data?.code || 'UNKNOWN_ERROR',
        message: data?.message || error.message,
        statusCode: status,
        timestamp: new Date().toISOString(),
      };

      // Handle specific HTTP errors
      if (status === 401) {
        apiError.message = 'Unauthorized. Please login again.';
      } else if (status === 403) {
        apiError.message = 'Access forbidden.';
      } else if (status === 404) {
        apiError.message = 'Resource not found.';
      } else if (status === 500) {
        apiError.message = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      apiError = {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
        statusCode: 0,
        timestamp: new Date().toISOString(),
      };
    } else {
      apiError = {
        code: 'REQUEST_ERROR',
        message: error.message || 'An error occurred',
        statusCode: 0,
        timestamp: new Date().toISOString(),
      };
    }

    return Promise.reject(apiError);
  }
);

/**
 * Auth API endpoints
 */
export const authAPI = {
  /**
   * Login with email and password
   * @param credentials - Email and password
   * @returns Login response with JWT token
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      // Store tokens securely
      if (response.data.token.accessToken) {
        await storeToken(response.data.token.accessToken);
      }
      if (response.data.token.refreshToken) {
        await storeRefreshToken(response.data.token.refreshToken);
      }

      // Store user data
      await storeUserData(response.data.staff);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Verify JWT token validity
   */
  verifyToken: async (): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ valid: boolean }>('/auth/verify');
      return response.data.valid;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },
};

/**
 * Device API endpoints (for future use)
 */
export const deviceAPI = {
  /**
   * Register device for attendance
   */
  registerDevice: async (deviceData: any) => {
    try {
      const response = await apiClient.post('/device/register', deviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Attendance API endpoints (for future use)
 */
export const attendanceAPI = {
  /**
   * Mark attendance
   */
  markAttendance: async (attendanceData: any) => {
    try {
      const response = await apiClient.post('/attendance/mark', attendanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get attendance history
   */
  getHistory: async (params?: any) => {
    try {
      const response = await apiClient.get('/attendance/history', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
