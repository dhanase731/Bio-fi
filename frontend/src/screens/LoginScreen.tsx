/**
 * Login Screen
 * First screen where users authenticate with email and password
 * Implements:
 * - Form validation
 * - Secure API communication
 * - Error handling
 * - JWT token storage
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useAuthStore } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';
import { LoginFormState } from '../types';

interface LoginScreenProps {
  navigation?: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login, isLoading, error, clearError } = useAuthStore();

  // Form state
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    isValid: false,
    errors: {},
  });

  // Local error for form validation
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Update email field
   */
  const handleEmailChange = (text: string) => {
    const newFormState = {
      ...formState,
      email: text,
    };
    validateForm(newFormState);
  };

  /**
   * Update password field
   */
  const handlePasswordChange = (text: string) => {
    const newFormState = {
      ...formState,
      password: text,
    };
    validateForm(newFormState);
  };

  /**
   * Validate form and update state
   */
  const validateForm = (state: LoginFormState) => {
    const validation = validateLoginForm(state.email, state.password);
    setFormState({
      ...state,
      isValid: validation.isValid,
      errors: validation.errors,
    });
  };

  /**
   * Handle login button press
   */
  const handleLogin = async () => {
    // Validate form before submission
    const validation = validateLoginForm(formState.email, formState.password);
    if (!validation.isValid) {
      setFormState({
        ...formState,
        errors: validation.errors,
      });
      return;
    }

    try {
      // Clear previous errors
      clearError();

      // Attempt login
      await login({
        email: formState.email,
        password: formState.password,
      });

      // Login successful - navigation handled by app navigation logic
    } catch (err) {
      // Error is handled by the store and displayed in UI
      console.error('Login error:', err);
    }
  };

  /**
   * Clear error when user starts typing
   */
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formState.email, formState.password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
            {
              paddingTop: insets.top + 40,
              paddingBottom: insets.bottom + 20,
            },
          ]}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Bio-Fi</Text>
            <Text style={styles.subtitle}>
              Secure Staff Attendance System
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Error Alert */}
            {error && <ErrorMessage message={error} visible={!!error} />}

            {/* Email Input */}
            <TextInput
              label="College Email"
              placeholder="Enter your college email"
              value={formState.email}
              onChangeText={handleEmailChange}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
              error={formState.errors.email}
            />

            {/* Password Input */}
            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={formState.password}
              onChangeText={handlePasswordChange}
              editable={!isLoading}
              secureTextEntry={!showPassword}
              error={formState.errors.password}
            />

            {/* Show Password Toggle */}
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.togglePasswordContainer}
            >
              <Text style={styles.togglePasswordText}>
                {showPassword ? 'Hide' : 'Show'} Password
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
            />

            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <Text style={styles.securityText}>
                🔒 Your login credentials are encrypted and transmitted securely
                over HTTPS.
              </Text>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Welcome</Text>
            <Text style={styles.infoText}>
              This is a secure attendance system designed for college staff. Use
              your official college credentials to login and mark attendance
              from the campus.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Loading Indicator */}
      <LoadingIndicator
        visible={isLoading}
        message="Logging in..."
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    marginBottom: 40,
  },
  togglePasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  togglePasswordText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  securityNotice: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  securityText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  infoSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});
