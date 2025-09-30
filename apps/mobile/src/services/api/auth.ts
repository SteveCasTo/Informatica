import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthData {
  user: {
    user_id: number;
    username: string;
    email: string;
    google_id?: string;
    profile_picture?: string;
    user_role: string;
    status: string;
    registration_date: string;
  };
  token: string;
}

// Cliente HTTP básico
class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }
}

// Instancia global del cliente
const api = new APIClient();

// Servicio de autenticación
export class AuthService {
  // Método para intercambiar código de Google
  static async exchangeGoogleCode(code: string, redirectUri: string): Promise<ApiResponse<AuthData>> {
    return api.post<AuthData>('/auth/exchange', {
      code,
      redirectUri
    });
  }

  // Login con credenciales
  static async loginWithCredentials(email: string, password: string): Promise<ApiResponse<AuthData>> {
    return api.post<AuthData>('/auth/login', {
      email,
      password
    });
  }

  // Obtener perfil del usuario
  static async getProfile(): Promise<ApiResponse<any>> {
    try {
      const result = await api.get('/auth/profile');
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network request failed'
      };
    }
  }

  // Logout
  static async logout(): Promise<ApiResponse<any>> {
    return api.post('/auth/logout');
  }

  // Métodos para manejo de tokens
  static async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem('authToken', token);
  }

  static async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('authToken');
  }

  static async removeToken(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
  }
}

export { api };