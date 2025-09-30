import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AuthLoadingScreen } from '../components/auth/AuthLoadingScreen';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log('🧭 Navigation state:', {
      isLoading,
      isAuthenticated,
      segments,
    });

    if (isLoading) return; // Esperar hasta que termine la carga

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Usuario no autenticado, redirigir a login
      console.log('🔐 Redirigiendo a auth...');
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Usuario autenticado en pantallas de auth, redirigir a app
      console.log('🏠 Redirigiendo a app...');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}