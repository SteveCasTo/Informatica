import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/api';
import { ApiResponse, User, AuthResult } from '../../types/auth';

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
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
  }
}

const api = new APIClient();

export class AuthService {
  static async exchangeGoogleCode(code: string, redirectUri: string): Promise<ApiResponse<AuthResult>> {
    return api.post<AuthResult>('/auth/google/callback', {
      code,
      redirectUri
    });
  }

  static async getProfile(): Promise<ApiResponse<User>> {
    try {
      return await api.get<User>('/auth/profile');
    } catch (error: unknown) {
      return {
        success: false,
        error: (error as Error).message || 'Network request failed'
      };
    }
  }

  static async logout(): Promise<ApiResponse<void>> {
    return api.post('/auth/logout');
  }

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