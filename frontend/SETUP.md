# Bio-Fi Attendance System - Frontend

## Overview

This is the React Native Expo frontend for the **Bio-Fi Secure Smart Staff Attendance System**. This phase implements the authentication screens with login flow, form validation, and secure JWT token management.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Expo CLI**: `npm install -g eas-cli`
- **Android Emulator** or **iOS Simulator** (or use **Expo Go** app)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

3. **Start development server**
```bash
npm start
```

4. **Run on device**

**Option A: Emulator/Simulator**
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios
```

**Option B: Expo Go App**
- Download Expo Go from App Store / Play Store
- Scan the QR code shown in terminal
- App runs directly in Expo Go

## 📱 Features - Phase 1 (Current)

- ✅ **Staff Login** - Email and password authentication
- ✅ **Form Validation** - Real-time email and password validation
- ✅ **JWT Authentication** - Secure token generation and storage
- ✅ **Secure Storage** - Encrypted token persistence with Expo Secure Store
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Dashboard** - Post-login home screen
- ✅ **Logout** - Secure session termination

## 🏗️ Project Structure

```
src/
├── app/                    # Expo Router screens
├── screens/               # Screen components (Login, Dashboard)
├── components/            # Reusable UI components
├── context/              # Zustand state management
├── services/             # API layer (Axios)
├── types/                # TypeScript interfaces
├── utils/                # Helper functions
├── styles/               # Theme & styling
└── navigation/           # Navigation config
```

See `ARCHITECTURE.md` for detailed structure.

## 🔐 Security Features

1. **Secure Token Storage**
   - JWT tokens stored in encrypted Expo Secure Store
   - Not exposed to filesystem or other apps

2. **Form Validation**
   - Email format validation
   - Password strength requirements (8+ chars, uppercase, lowercase, number)
   - Real-time validation feedback

3. **API Security**
   - HTTPS communication
   - Automatic JWT injection in headers
   - Error handling for auth failures

4. **Session Management**
   - Automatic session restoration on app restart
   - Logout clears all stored data

## 📝 Usage

### Login Flow

1. **Launch app** → Login screen displayed
2. **Enter credentials** → Email and password validated in real-time
3. **Tap Login** → Credentials sent securely to backend
4. **On success** → JWT token stored, navigate to Dashboard
5. **On error** → Error message displayed, user can retry

### Test Account (Backend dependent)

```
Email: staff@college.edu
Password: TestPass123
```

## 🧪 Development

### Hot Reload
Changes are automatically reflected in the app during development.

### Debug
- React DevTools available in dev menu
- Console logs visible in terminal
- Network requests visible in Axios interceptor

### Clean Rebuild
```bash
npm start -- --clear
```

### Run on Web (testing only)
```bash
npm run web
```

## 📱 Available Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start dev server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run on web browser |
| `npm run reset-project` | Reset to template |

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:

```env
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# App settings
EXPO_PUBLIC_APP_NAME=Bio-Fi Attendance System
EXPO_PUBLIC_APP_VERSION=1.0.0

# Feature flags
EXPO_PUBLIC_ENABLE_CERTIFICATE_PINNING=false
EXPO_PUBLIC_ENABLE_PLAY_INTEGRITY=false
```

### Backend URL

Update `EXPO_PUBLIC_API_URL` in `.env.local`:

- **Local**: `http://localhost:3000/api`
- **LAN**: `http://192.168.x.x:3000/api`
- **Production**: `https://api.example.com/api`

## 🚨 Troubleshooting

### App won't start
```bash
# Clear cache and rebuild
npm start -- --clear
```

### Can't connect to backend
- Ensure backend is running: `http://localhost:3000`
- Check firewall settings
- For Android emulator: Use `10.0.2.2` instead of `localhost`
- For LAN: Use device IP address

### Token not saving
- Ensure Secure Store permissions (Android: AndroidManifest.xml)
- Check device storage isn't full
- Verify AsyncStorage is installed

### Login fails
- Check backend is running
- Verify API URL in `.env.local`
- Check credentials are correct
- Review backend logs for errors

## 📚 Component Documentation

### TextInput Component
Reusable input field with validation styling:
```tsx
<TextInput
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  error={error}
  keyboardType="email-address"
/>
```

### Button Component
Customizable button with loading state:
```tsx
<Button
  title="Login"
  onPress={handleLogin}
  isLoading={isLoading}
  variant="primary"
  size="medium"
/>
```

### ErrorMessage Component
Display error alerts:
```tsx
<ErrorMessage message={error} visible={!!error} />
```

### LoadingIndicator Component
Full-screen loader overlay:
```tsx
<LoadingIndicator visible={isLoading} message="Logging in..." />
```

## 🔄 State Management

Uses **Zustand** for global auth state:

```tsx
import { useAuthStore } from '@/context/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  
  return (
    // Use auth state and methods
  );
}
```

## 🌐 API Integration

All API calls go through `src/services/api.ts`:

```typescript
import { authAPI } from '@/services/api';

// Login
const response = await authAPI.login({ email, password });

// Token is automatically stored and added to future requests
```

## 📊 Form Validation

Real-time validation for login form:

- **Email**: Must be valid email format
- **Password**: Min 8 chars, uppercase, lowercase, number

Validation happens as user types with immediate feedback.

## 🎨 UI/UX

### Design System
- **Color**: Blue (#007AFF) primary, gray secondary
- **Typography**: Clear hierarchy with appropriate sizes
- **Spacing**: Consistent 4px grid
- **Shadows**: Subtle elevation for depth

### Responsive Design
- Optimized for all phone sizes
- Portrait orientation
- Safe area support (notches, gestures)

## 🔐 Security Best Practices

1. ✅ Never log sensitive data
2. ✅ Always use HTTPS in production
3. ✅ Validate all user input
4. ✅ Store tokens securely
5. ✅ Clear data on logout
6. ✅ Implement certificate pinning (future)

## 📦 Dependencies

Key packages:
- `react-native` - Mobile framework
- `expo` - Development environment
- `typescript` - Type safety
- `zustand` - State management
- `axios` - HTTP client
- `expo-secure-store` - Secure storage
- `expo-router` - File-based routing
- `react-navigation` - Navigation

See `package.json` for complete list.

## 🚀 Next Steps

**Phase 2**: Backend API Setup
- Create Express.js server
- Implement authentication endpoints
- Set up PostgreSQL database
- Test login end-to-end

**Phase 3**: Device Enrollment
- RSA key generation
- Device registration
- Android Keystore integration

**Phase 4**: Biometric Auth
- Fingerprint authentication
- Secure signing

**Phase 5**: Attendance Features
- WiFi trust validation
- Attendance marking
- History tracking

## 📖 Documentation

- `ARCHITECTURE.md` - Detailed architecture and design
- `src/types/index.ts` - Type definitions
- `src/services/api.ts` - API configuration
- `src/components/` - Component documentation

## 🤝 Contributing

- Use TypeScript for all code
- Follow existing component patterns
- Add comments for complex logic
- Test locally before committing

## 📄 License

This project is part of the Bio-Fi Attendance System.

## 🆘 Support

For issues and questions:
1. Check Troubleshooting section
2. Review ARCHITECTURE.md
3. Check backend logs
4. Review console output

---

**Status**: ✅ Phase 1 Complete - Authentication Screens with Login Flow

**Ready for**: Phase 2 - Backend Express.js Setup
