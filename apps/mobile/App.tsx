import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    const handleDeepLink = async (url: string) => {      
      try {
        const urlObj = new URL(url);
        const token = urlObj.searchParams.get('token');
        const userStr = urlObj.searchParams.get('user');
        const error = urlObj.searchParams.get('error');

        if (error) {
          return;
        }

        if (token && userStr) {          
          await AsyncStorage.setItem('authToken', token);
          
          const savedToken = await AsyncStorage.getItem('authToken');
          console.log('Token guardado correctamente:', savedToken ? 'SÍ' : 'NO');
          
          const user = JSON.parse(decodeURIComponent(userStr));
          await AsyncStorage.setItem('userData', JSON.stringify(user));
        }
      } catch (error) {
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    const subscription = Linking.addEventListener('url', (event) => {
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