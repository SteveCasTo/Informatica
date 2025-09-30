import { 
  makeRedirectUri, 
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { API_BASE_URL } from '../../config/environment';
import { httpClient } from './httpClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

// Servicio de autenticación con mejor manejo de errores
export class AuthService {
  private authUrl = `${API_BASE_URL}/auth/google/mobile`;

    static async getProfile() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      console.log('🔍 Verificando perfil con token...');
      
      // VERIFICAR que esta URL sea correcta - debe coincidir con la que funciona en Postman
      const apiUrl = 'https://unplunderous-tolerative-trinh.ngrok-free.dev/api';
      console.log('🌐 API URL completa:', `${apiUrl}/auth/profile`);
      console.log('🔐 Token (primeros 20 chars):', token.substring(0, 20) + '...');
      
      const response = await axios.get(`${apiUrl}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          // Agregar header para evitar warning de ngrok
          'ngrok-skip-browser-warning': 'true'
        },
        timeout: 15000 // 15 segundos de timeout
      });

      console.log('✅ Perfil obtenido exitosamente:', response.data);
      return { success: true, data: response.data.data };
      
    } catch (error: any) {
      console.error('❌ Error obteniendo perfil completo:', error);
      console.error('❌ Error config:', error.config);
      console.error('❌ Error request:', error.request);
      console.error('❌ Error response:', error.response);
      
      if (error.response?.status === 401) {
        // Token inválido o expirado
        console.log('🔐 Token inválido, removiendo...');
        await AsyncStorage.removeItem('authToken');
        return { success: false, error: 'Token expired' };
      }
      
      // Si es un error de red, mostrar más detalles
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network request failed') {
        console.error('🌐 Error de red detectado');
        console.error('🌐 URL intentada:', `${apiUrl}/auth/profile`);
        return { success: false, error: 'Network connection failed' };
      }
      
      return { success: false, error: error.message };
    }
  }
  
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      console.log('🔐 Iniciando autenticación con Expo Auth Session...');
      console.log('🔗 Backend URL:', API_BASE_URL);
      
      const redirectUri = makeRedirectUri({
        scheme: 'informaticapp',
        path: 'auth/callback'
      });
      
      console.log('📍 Redirect URI:', redirectUri);
      
      // Construir URL de autenticación con parámetros
      const authParams = new URLSearchParams({
        redirectUri: redirectUri,
        platform: 'mobile',
        source: 'expo'
      });
      
      const authUrlWithParams = `${this.authUrl}?${authParams.toString()}`;
      
      console.log('🔗 Auth URL completa:', authUrlWithParams);
      
      const result = await WebBrowser.openAuthSessionAsync(
        authUrlWithParams,
        redirectUri,
        {
          showInRecents: true,
        }
      );
      
      console.log('📱 WebBrowser result:', result);
      
      if (result.type === 'success') {
        const { url } = result;
        console.log('✅ URL de respuesta:', url);
        
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
          throw new Error(`Error de Google: ${error}`);
        }
        
        if (!code) {
          throw new Error('No se recibió código de autorización de Google');
        }
        
        console.log('✅ Código recibido, intercambiando por token...');
        
        // Intercambiar código por token
        const response = await httpClient.post('/auth/google/mobile/exchange', {
          code,
          redirectUri
        });
        
        console.log('✅ Respuesta del intercambio:', response.data);
        
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
      console.error('❌ Error en autenticación:', error);
      throw error;
    }
  }

  // Nuevo método para intercambiar código de Google
  static async exchangeGoogleCode(code: string, redirectUri: string): Promise<AuthResponse> {
    try {
      console.log('🔄 Intercambiando código de Google...');
      console.log('📋 Código:', code);
      console.log('📍 Redirect URI:', redirectUri);
      
      const response = await httpClient.post<AuthResponse>('/auth/exchange', {
        code,
        redirectUri
      });
      
      console.log('✅ Código intercambiado exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error intercambiando código:', error.response?.data || error.message);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    console.log('🚪 Cerrando sesión...');
    // La lógica de logout se maneja en el AuthContext
  }
}