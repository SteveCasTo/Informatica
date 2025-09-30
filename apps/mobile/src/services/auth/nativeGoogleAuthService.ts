import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import type { SignInResponse } from '@react-native-google-signin/google-signin';
import { httpClient } from './httpClient';
import { AuthResult } from '../../types/auth';


type ExtendedSignInResponse = SignInResponse & {
  idToken?: string;
};

export class NativeGoogleAuthService {
  private configured = false;

  async ensureConfigured() {
    if (this.configured) return;

    try {
      const { data } = await httpClient.get('/api/auth/config/google');
      const { webClientId } = data.data;

      GoogleSignin.configure({
        webClientId,
        offlineAccess: false,
        hostedDomain: '',
        forceCodeForRefreshToken: false,
      });

      this.configured = true;
      console.log('✅ Google Sign-In configurado');
    } catch (error) {
      console.error('❌ Error configurando Google Sign-In:', error);
      throw new Error('No se pudo configurar autenticación con Google');
    }
  }

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      console.log('🔄 Iniciando autenticación nativa...');
      await this.ensureConfigured();

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { idToken } = await GoogleSignin.signIn() as ExtendedSignInResponse;

      if (!idToken) {
        throw new Error('No se obtuvo ID token de Google');
      }

      console.log('📤 Enviando ID token al backend...');
      const { data } = await httpClient.post('/api/auth/google/native', {
        idToken
      });

      console.log('Autenticación nativa exitosa');
      return {
        user: data.data.user,
        token: data.data.token
      };

    } catch (error) {
      console.error('Error en Google Sign-In:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Autenticación cancelada');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Autenticación en progreso');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services no disponible');
      }
      
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.ensureConfigured();
      await GoogleSignin.signOut();
      console.log('👋 Sign out nativo exitoso');
    } catch (error) {
      console.error('❌ Error en sign out:', error);
    }
  }
}