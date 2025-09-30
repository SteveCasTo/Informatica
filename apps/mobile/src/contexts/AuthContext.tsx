import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/api/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { API_CONFIG } from '../config/api';
import { GOOGLE_AUTH_URL, GOOGLE_WEB_CLIENT_ID } from '../utils/constants/constants';

WebBrowser.maybeCompleteAuthSession();

export interface User {
  user_id: number;
  username: string;
  email: string;
  google_id?: string;
  profile_picture?: string;
  user_role: string;
  status: string;
  registration_date: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const discovery = {
    authorizationEndpoint: GOOGLE_AUTH_URL,
  };

  const redirectUri = `${API_CONFIG.BASE_URL}/auth/google/callback`;

  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    usePKCE: false,
    extraParams: {
      prompt: 'select_account'
    }
  }, discovery);

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
      setError(`Error en autenticación: ${response.error?.message || 'Error desconocido'}`);
      setIsLoading(false);
    } else if (response?.type === 'cancel') {
      console.log('Google Auth Cancelled');
      setError('Autenticación cancelada');
      setIsLoading(false);
    }
  }, [response]);

  const handleGoogleResponse = async (authResponse: AuthSession.AuthSessionResult) => {
    if (authResponse.type === 'success' && authResponse.params?.code) {
      try {
        setIsLoading(true);
        
        const result = await AuthService.exchangeGoogleCode(
          authResponse.params.code,
          redirectUri
        );

        if (result.success && result.data) {
          if (result.data.token) {
            await AuthService.saveToken(result.data.token);
          }
          
          if (result.data.user) {
            setUser(result.data.user);
          }
          
          setError(null);
        } else {
          throw new Error(result.error || 'Error al procesar respuesta de Google');
        }
      } catch (error: unknown) {
        console.error('Error processing Google response:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error procesando respuesta de Google';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await AuthService.getToken();
      
      if (token) {
        try {
          const profile = await AuthService.getProfile();
          
          if (profile.success && profile.data) {
            setUser(profile.data);
          } else {
            await AuthService.removeToken();
            setUser(null);
          }
        } catch {
          await AuthService.removeToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!request) {
        throw new Error('Configuración de autenticación no está lista');
      }
      
      // Ejecutar prompt
      const result = await promptAsync();
      
      if (result.type === 'cancel') {
        setError('Autenticación cancelada por el usuario');
        return { success: false, error: 'Cancelado por el usuario' };
      }
      checkAuthStatus();
      return { success: true };
      
    } catch (error: unknown) {
      console.error('Error en loginWithGoogle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión con Google';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      await AuthService.removeToken();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Forzar logout local aunque falle el servidor
      await AuthService.removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export { AuthContext };