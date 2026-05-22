/**
 * Global TypeScript Types and Interfaces
 * Defines all data structures used throughout the application
 */

// ============================================================
// Authentication Types
// ============================================================

/**
 * Staff member information
 */
export interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  staffId: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * JWT Token response from backend
 */
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Login response from backend
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  token: AuthToken;
  staff: Staff;
}

/**
 * Authentication state context
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Staff | null;
  token: string | null;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/**
 * Device information for binding
 */
export interface Device {
  id: string;
  deviceId: string;
  staffId: string;
  publicKey: string;
  deviceName: string;
  enrolledAt: string;
  isActive: boolean;
}

/**
 * Network metadata
 */
export interface NetworkMetadata {
  ssid: string;
  bssid: string;
  rssi: number;
  ipAddress?: string;
  gatewayMac?: string;
  isConnected: boolean;
}

/**
 * Attendance payload
 */
export interface AttendancePayload {
  staffId: string;
  deviceId: string;
  timestamp: number;
  nonce: string;
  sessionId: string;
  networkMetadata?: NetworkMetadata;
}

/**
 * Signed attendance request
 */
export interface SignedAttendanceRequest {
  payload: AttendancePayload;
  signature: string;
  publicKeyId: string;
}

/**
 * Attendance response from backend
 */
export interface AttendanceResponse {
  success: boolean;
  message: string;
  attendanceId: string;
  timestamp: string;
}

/**
 * API Error response
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

/**
 * Validated login form state
 */
export interface LoginFormState {
  email: string;
  password: string;
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
}
