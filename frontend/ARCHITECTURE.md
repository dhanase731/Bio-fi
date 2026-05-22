# Bio-Fi Attendance System - Frontend Architecture

## Project Overview

Bio-Fi is a production-grade secure smart staff attendance system built with React Native Expo and Node.js backend. This document covers the frontend architecture for **Step 1**: React Native Expo authentication screens with login flow.

## Technology Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **Zustand** for state management
- **Axios** for API communication
- **Expo Secure Store** for secure token storage
- **Expo Router** for navigation
- **React Navigation** for screen management

### Current Phase: Authentication Flow
This phase implements:
1. Staff login with email and password
2. JWT token generation and secure storage
3. Form validation
4. Error handling
5. Secure API communication
6. Authentication state management

## Project Structure

```
frontend/
├── src/
│   ├── app/                          # Expo Router screens
│   │   ├── (auth)/                   # Authentication stack
│   │   │   ├── _layout.tsx          # Auth layout
│   │   │   └── login.tsx            # Login page
│   │   ├── (app)/                    # App stack (after auth)
│   │   │   ├── _layout.tsx          # App layout
│   │   │   └── index.tsx            # Dashboard page
│   │   ├── _layout.tsx              # Root layout
│   │   ├── index.tsx                # Expo default
│   │   └── explore.tsx              # Expo default
│   │
│   ├── screens/                      # Screen components
│   │   ├── LoginScreen.tsx          # Login UI and logic
│   │   └── DashboardScreen.tsx      # Dashboard UI and logic
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── TextInput.tsx            # Custom text input
│   │   ├── Button.tsx               # Custom button
│   │   ├── ErrorMessage.tsx         # Error display
│   │   └── LoadingIndicator.tsx     # Loading overlay
│   │
│   ├── context/                      # State management
│   │   └── AuthContext.tsx          # Zustand auth store
│   │
│   ├── services/                     # API services
│   │   └── api.ts                   # Axios instance & endpoints
│   │
│   ├── types/                        # TypeScript types
│   │   └── index.ts                 # Global type definitions
│   │
│   ├── utils/                        # Utility functions
│   │   ├── validation.ts            # Form validation
│   │   └── storage.ts               # Secure storage helpers
│   │
│   ├── styles/                       # Theme and styles
│   │   └── theme.ts                 # Color schemes, dimensions
│   │
│   └── navigation/                   # Navigation config
│       └── RootNavigator.tsx        # Navigation structure
│
├── assets/                           # Images, fonts
├── app.json                         # Expo configuration
├── tsconfig.json                    # TypeScript config
├── .env.example                     # Environment variables
├── package.json                     # Dependencies
└── README.md                        # This file
```

## Component Architecture

### Core Components

#### 1. **TextInput Component**
- Reusable text input with validation styling
- Supports labels, error messages, and icons
- Props: label, error, icon, disabled state

#### 2. **Button Component**
- Customizable button with multiple variants
- Supports loading state and disabled state
- Variants: primary, secondary, danger
- Sizes: small, medium, large

#### 3. **ErrorMessage Component**
- Display API and validation errors
- Styled alert box with consistent styling

#### 4. **LoadingIndicator Component**
- Full-screen loader overlay
- Modal with optional message
- Prevents user interaction during loading

### Screen Components

#### 1. **LoginScreen**
Primary authentication interface with:
- Email input with validation
- Password input with show/hide toggle
- Form validation on every keystroke
- Error message display
- Login button with loading state
- Security notice banner
- Welcome information section

Features:
- Client-side email validation
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- Real-time validation feedback
- Secure API communication
- JWT token storage
- User data persistence

#### 2. **DashboardScreen**
Post-login home screen with:
- Welcome message with user name
- User information card
- Available features (placeholder for future phases)
- Security features banner
- Logout button

## State Management

### Zustand Auth Store

**Location**: `src/context/AuthContext.tsx`

**State Properties**:
```typescript
{
  isAuthenticated: boolean;    // Login status
  isLoading: boolean;          // Request loading state
  user: Staff | null;          // Logged-in user data
  token: string | null;        // JWT access token
  error: string | null;        // Error message
}
```

**Actions**:
- `login(credentials)` - Authenticate user
- `logout()` - Clear auth state
- `clearError()` - Reset error message

**Persistence**:
- Uses AsyncStorage for offline support
- Automatically restores auth state on app launch
- Only persists: isAuthenticated, user, token

## API Service Layer

### Configuration

**Location**: `src/services/api.ts`

**Base URL**: Set via `EXPO_PUBLIC_API_URL` environment variable
- Default: `http://localhost:3000/api`

### Interceptors

**Request Interceptor**:
- Automatically adds JWT token to Authorization header
- Format: `Bearer {token}`

**Response Interceptor**:
- Standardized error handling
- Specific HTTP status code messages
- Returns structured ApiError object

### Endpoints (Step 1)

#### Authentication Endpoints
```
POST   /auth/login        - Login with email/password
POST   /auth/logout       - Logout user
POST   /auth/verify       - Verify JWT token
```

**Login Request**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Login Response**:
```json
{
  "success": true,
  "message": "string",
  "token": {
    "accessToken": "string",
    "refreshToken": "string (optional)",
    "expiresIn": number
  },
  "staff": {
    "id": "string",
    "name": "string",
    "email": "string",
    "department": "string",
    "role": "string",
    "staffId": "string"
  }
}
```

## Data Validation

### Validation Rules

**Email Validation**:
- Must contain @ symbol
- Must have domain (.)
- Must be non-empty

**Password Validation**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Validation Implementation

**Location**: `src/utils/validation.ts`

**Functions**:
- `isValidEmail(email)` - Check email format
- `isValidPassword(password)` - Check password strength
- `getEmailError(email)` - Get email error message
- `getPasswordError(password)` - Get password error message
- `validateLoginForm(email, password)` - Validate entire form

## Secure Storage

### Storage Implementation

**Location**: `src/utils/storage.ts`

Uses **Expo Secure Store** for encrypted storage:
- JWT access token
- JWT refresh token
- User data
- Session ID (for future use)

### Storage Functions**
```typescript
storeToken(token)              // Store JWT
getToken()                     // Retrieve JWT
storeRefreshToken(token)       // Store refresh token
getRefreshToken()              // Retrieve refresh token
storeUserData(userData)        // Store user object
getUserData()                  // Retrieve user object
storeSessionId(sessionId)      // Store session ID
getSessionId()                 // Retrieve session ID
clearAuthData()                // Clear all auth data (logout)
```

## Authentication Flow

### Step-by-Step Flow

1. **App Launch**
   - Root layout initializes app
   - `initializeAuth()` restores previous session from storage
   - Navigation determined by `isAuthenticated` flag

2. **Login Screen Load**
   - User opens app (not authenticated)
   - LoginScreen component renders
   - Form state initialized (empty)

3. **User Input**
   - User enters email → validation runs → error display updates
   - User enters password → validation runs → error display updates
   - Errors cleared when user starts typing after failed login

4. **Submit Login**
   - Form validation performed
   - If invalid → validation errors displayed
   - If valid → API login call initiated

5. **API Request**
   - Axios interceptor adds headers
   - POST request to `/auth/login`
   - Loading indicator displayed

6. **Success Response**
   - JWT token received and stored securely
   - User data stored
   - Zustand store updated
   - Navigation switches to authenticated screens

7. **Error Handling**
   - Error message displayed to user
   - User can retry login
   - Error cleared on next input

8. **Dashboard Load**
   - User sees welcome screen
   - User information displayed
   - Features and security info shown

9. **Logout**
   - User taps logout button
   - API logout call made
   - Auth data cleared
   - Navigation returns to login screen

## TypeScript Types

### Core Types

```typescript
// Staff member information
interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  staffId: string;
}

// Login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// JWT token response
interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

// Login API response
interface LoginResponse {
  success: boolean;
  message: string;
  token: AuthToken;
  staff: Staff;
}

// Auth store context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Staff | null;
  token: string | null;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Validation state
interface LoginFormState {
  email: string;
  password: string;
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
}
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Expo CLI: `npm install -g eas-cli`
- Android Emulator or iOS Simulator (or Expo Go app)

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
# Edit .env.local and set EXPO_PUBLIC_API_URL to your backend
```

4. **Start the development server**
```bash
npm start
```

5. **Run on device/emulator**
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web

# Using Expo Go app
# Scan QR code with Expo Go app (Android/iOS)
```

### Development Workflow

```bash
# Watch mode with hot reload
npm start

# Clean rebuild
npm start -- --clear

# Debug in browser
npm start -- --web

# Run tests
npm test
```

## Code Splitting and Import Paths

### Path Aliases

The project uses path aliases for cleaner imports:
- `@/*` → `src/*`

Example:
```typescript
// Instead of:
import { TextInput } from '../../../components/TextInput';

// Use:
import { TextInput } from '@/components/TextInput';
```

## Error Handling Strategy

### Error Types Handled

1. **Validation Errors**
   - Email format invalid
   - Password weak
   - Fields empty

2. **Network Errors**
   - Connection failed
   - Timeout
   - Server unreachable

3. **API Errors**
   - 401 Unauthorized
   - 403 Forbidden
   - 500 Server Error

4. **Storage Errors**
   - Token storage failed
   - Data retrieval failed

### Error Display

- Inline field errors below input fields
- Global error banner for API errors
- Toast notifications for sensitive operations
- Loading indicators during requests

## Security Considerations

### Implemented Security Features

1. **JWT Token Management**
   - Tokens stored in Expo Secure Store
   - Automatic header injection
   - Secure transmission over HTTPS

2. **Form Validation**
   - Client-side input validation
   - Password strength enforcement
   - XSS prevention through React

3. **Secure Storage**
   - Encrypted token storage
   - No plaintext credentials in memory
   - Auto-clear on logout

4. **API Security**
   - HTTPS communication
   - Authorization header validation
   - Request interceptors for token refresh

### Security TODO (Future Phases)

- [ ] Certificate pinning
- [ ] Biometric authentication
- [ ] Android Keystore integration
- [ ] Device binding
- [ ] Replay attack prevention
- [ ] Play Integrity API

## Performance Optimization

### Current Optimizations

1. **Code Splitting**
   - Auth screens separate from app screens
   - Lazy loading via Expo Router

2. **State Management**
   - Zustand for minimal re-renders
   - Selective persistence

3. **Image Optimization**
   - Compressed assets
   - Responsive sizes

### Future Optimizations

- Image caching
- Code profiling
- Memory leak detection
- Network request optimization

## Testing Strategy

### Testing Structure

(To be implemented in Phase 2)

```
__tests__/
├── utils/
│   ├── validation.test.ts
│   └── storage.test.ts
├── components/
│   ├── Button.test.tsx
│   └── TextInput.test.tsx
├── screens/
│   └── LoginScreen.test.tsx
└── services/
    └── api.test.ts
```

### Test Coverage

- Unit tests for validation functions
- Component tests for UI elements
- Integration tests for auth flow
- API mock tests for service layer

## Deployment

### Development Environment

```bash
npm start
```

### Production Build

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### Environment Variables for Production

Update `.env.local` before production build:
```
EXPO_PUBLIC_API_URL=https://your-production-api.com/api
EXPO_PUBLIC_ENABLE_CERTIFICATE_PINNING=true
```

## Next Steps (Phase 2)

After completing authentication:

1. **Backend API Setup**
   - Create Express.js server
   - Implement authentication endpoints
   - Set up JWT generation
   - Create PostgreSQL schema

2. **Connection Testing**
   - Connect frontend to backend
   - Test login flow end-to-end
   - Verify token storage and retrieval

3. **Device Enrollment**
   - Generate RSA key pairs
   - Implement device registration
   - Store public keys

4. **Biometric Authentication**
   - Implement fingerprint API
   - Secure key unlocking
   - Attendance marking

5. **WiFi Verification**
   - Network detection
   - Trusted network validation
   - Attendance submission

## Troubleshooting

### Common Issues

**1. EXPO_PUBLIC_API_URL not loading**
- Ensure .env.local file exists
- Prefix must be `EXPO_PUBLIC_`
- Restart dev server after changes

**2. Token not persisting**
- Check Secure Store permissions
- Verify AsyncStorage is installed
- Check device storage settings

**3. Login fails with network error**
- Ensure backend is running
- Check API_BASE_URL is correct
- Verify CORS settings on backend

**4. Navigation not switching after login**
- Check useAuthStore updates state
- Verify initializeAuth() is called
- Check for console errors

## Contributing Guidelines

- Use TypeScript for all code
- Follow existing component patterns
- Add comments for complex logic
- Update types when adding features
- Test locally before committing

## Documentation Files

- `src/types/index.ts` - Type definitions
- `src/services/api.ts` - API configuration
- `src/context/AuthContext.tsx` - State management
- `src/components/*.tsx` - Component documentation
- `src/screens/*.tsx` - Screen documentation

## Support and Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/)

---

**Step 1 Complete**: React Native Expo authentication screens with TypeScript and login flow

**Ready for Step 2**: Express.js JWT authentication backend
