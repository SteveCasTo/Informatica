import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/api/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface User {
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
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

  const redirectUri = 'https://unplunderous-tolerative-trinh.ngrok-free.dev/api/auth/google/callback';

  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: '252022146350-n6tkf8de9pmhf1kqbk1dva1635m8du59.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    usePKCE: false,
    // AGREGAR ESTO PARA FORZAR SELECCIÓN DE CUENTA
    extraParams: {
      prompt: 'select_account' // Esto fuerza a Google a mostrar la selección de cuenta
    }
  }, {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  });

  // Manejar respuesta de Google
  useEffect(() => {
    if (response?.type === 'success') {
      setIsLoading(false);
    } else if (response?.type === 'error') {
      setError('Error en autenticación con Google');
      setIsLoading(false);
    }
  }, [response]);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        try {
          const profile = await AuthService.getProfile();
          
          if (profile.success) {
            setUser(profile.data);
          } else {
            await AuthService.removeToken();
            setUser(null);
          }
        } catch (error) {
          await AuthService.removeToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      await checkAuthStatus();
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await promptAsync();
      await checkAuthStatus();
      
      return { success: true };
      
    } catch (error) {
      const errorMessage = error.message || 'Error de conexión con Google';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await AuthService.loginWithCredentials(email, password);
      
      if (response.success && response.data) {
        await AuthService.saveToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';
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
    loginWithCredentials,
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