import { 
  makeRedirectUri, 
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { API_BASE_URL } from '../../config/api';
import { httpClient } from './httpClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AUTH_URL } from '../../utils/constants/constants'
import { AuthResponse } from '../../types/auth'

WebBrowser.maybeCompleteAuthSession();

interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider: 'google' | 'email';
  };
}

export class AuthService {
  private authUrl = `${API_BASE_URL}/auth/google/mobile`;

    static async getProfile() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const apiUrl = AUTH_URL;
      
      const response = await axios.get(`${apiUrl}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        timeout: 15000
      });

      return { success: true, data: response.data.data };
      
    } catch (error) {
      
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('authToken');
        return { success: false, error: 'Token expired' };
      }
      
      const apiUrls = AUTH_URL;
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network request failed') {
        return { success: false, error: 'Network connection failed' };
      }
      
      return { success: false, error: error.message };
    }
  }
  
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      
      const redirectUri = makeRedirectUri({
        scheme: 'informaticapp',
        path: 'auth/callback'
      });
      
      const authParams = new URLSearchParams({
        redirectUri: redirectUri,
        platform: 'mobile',
        source: 'expo'
      });
      
      const authUrlWithParams = `${this.authUrl}?${authParams.toString()}`;
      
      console.log('Auth URL completa:', authUrlWithParams);
      
      const result = await WebBrowser.openAuthSessionAsync(
        authUrlWithParams,
        redirectUri,
        {
          showInRecents: true,
        }
      );
      
      console.log('WebBrowser result:', result);
      
      if (result.type === 'success') {
        const { url } = result;
        
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
          throw new Error(`Error de Google: ${error}`);
        }
        
        if (!code) {
          throw new Error('No se recibió código de autorización de Google');
        }

        const response = await httpClient.post('/auth/google/mobile/exchange', {
          code,
          redirectUri
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Error intercambiando código');
        }
        
        return response.data.data;
      } else if (result.type === 'cancel') {
        throw new Error('Autenticación cancelada por el usuario');
      } else {
        throw new Error('Error desconocido en la autenticación');
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      throw error;
    }
  }

  static async exchangeGoogleCode(code: string, redirectUri: string): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/exchange', {
        code,
        redirectUri
      });
      return response.data;
    } catch (error) {
      console.error('Error intercambiando código:', error.response?.data || error.message);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    console.log('Cerrando sesión...');
  }
}