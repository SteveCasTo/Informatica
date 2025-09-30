import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../services/auth/authService';
import { httpClient } from '../services/auth/httpClient';
import { User } from '../types/auth';
import { AuthError, makeRedirectUri, AuthRequestConfig, DiscoveryDocument, useAuthRequest } from 'expo-auth-session';

const config: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
}

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${process.env.BACKEND_URL}/api/auth/authorize`,
  tokenEndpoint: `${process.env.BACKEND_URL}/api/auth/token`,
}

export const useAuthService = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [setAuthError] = useState<AuthError | null>(null);
  const [response] = useAuthRequest(config, discovery);

  useEffect(() => {
    handleAuthResponse();
  }, [response]);

  const handleAuthResponse = async () => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log(code);
    } else if (response?.type === 'error') {
      setAuthError(response.error as AuthError);
      console.error('Error de autenticación:', response.error);
    }
  }

  const [authService] = useState(() => {
    console.log('🔥 Instanciando AuthService desde useAuth');
    return new AuthService();
  });

  useEffect(() => {
    console.log('🧪 useAuth montado');
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        const { data } = await httpClient.get('/api/auth/profile');
        setUser(data.data);
        console.log('✅ Usuario recuperado:', data.data.email);
      }
    } catch {
      console.log('No hay sesión activa');
      await SecureStore.deleteItemAsync('auth_token');
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const result = await authService.signInWithGoogle();

      await SecureStore.setItemAsync('auth_token', result.token);

      const { data } = await httpClient.get('/api/auth/profile');
      setUser(data.data);

      console.log('Usuario logueado:', data.data.email);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      await SecureStore.deleteItemAsync('auth_token');
      setUser(null);
      console.log('👋 Usuario deslogueado');
    } catch (error) {
      console.error('❌ Error en logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
};