import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    // Listener para deep links
    const handleDeepLink = async (url: string) => {
      console.log('🔗 Deep link recibido:', url);
      
      try {
        const urlObj = new URL(url);
        const token = urlObj.searchParams.get('token');
        const userStr = urlObj.searchParams.get('user');
        const error = urlObj.searchParams.get('error');

        if (error) {
          console.error('❌ Error en deep link:', error);
          return;
        }

        if (token && userStr) {
          console.log('✅ Token recibido via deep link');
          console.log('🔐 Token (primeros 20 chars):', token.substring(0, 20) + '...');
          
          await AsyncStorage.setItem('authToken', token);
          
          // Verificar que se guardó correctamente
          const savedToken = await AsyncStorage.getItem('authToken');
          console.log('💾 Token guardado correctamente:', savedToken ? 'SÍ' : 'NO');
          
          // También guardar datos del usuario
          const user = JSON.parse(decodeURIComponent(userStr));
          await AsyncStorage.setItem('userData', JSON.stringify(user));
          
          console.log('💾 Datos guardados en AsyncStorage');
          console.log('👤 Usuario:', user.email);
        }
      } catch (error) {
        console.error('❌ Error procesando deep link:', error);
      }
    };

    // Manejar deep link cuando la app se abre desde cerrada
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('🚀 App abierta con URL inicial:', url);
        handleDeepLink(url);
      }
    });

    // Manejar deep links cuando la app ya está abierta
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('📱 Deep link recibido con app abierta:', event.url);
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}