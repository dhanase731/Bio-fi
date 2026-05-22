/**
 * Root Layout
 * Sets up authentication and app navigation
 */

import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore, initializeAuth } from '../context/AuthContext';
import { LoadingIndicator } from '../components/LoadingIndicator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const [appReady, setAppReady] = useState(false);
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize authentication from stored data
        await initializeAuth();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  if (!appReady || !fontsLoaded) {
    return <LoadingIndicator visible={true} message="Initializing..." />;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          // App Screens - Shown when authenticated
          <Stack.Screen
            name="(app)"
            options={{
              headerShown: false,
            }}
          />
        ) : (
          // Auth Screens - Shown when not authenticated
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}
