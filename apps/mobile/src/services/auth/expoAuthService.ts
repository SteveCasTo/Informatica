import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { httpClient } from './httpClient';

WebBrowser.maybeCompleteAuthSession();

export class ExpoAuthService {
  
  async signInWithGoogle(): Promise<unknown> {
    try {
      console.log('🔄 Iniciando autenticación...');
      
      const { data } = await httpClient.get('/api/auth/google/mobile');
      const authUrl = data.data.authUrl;

      console.log('🌐 Abriendo Google Auth...');

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        'informaticapp://auth/callback'
      );

      console.log('📥 Resultado del browser:', result);

      if (result.type === 'success' && result.url) {
        const url = Linking.parse(result.url);
        const token = url.queryParams?.token as string;
        const error = url.queryParams?.error as string;

        if (error) {
          throw new Error(error);
        }

        if (!token) {
          throw new Error('No se recibió token');
        }

        console.log('✅ Token recibido');
        return { token };
      } else if (result.type === 'cancel') {
        throw new Error('Autenticación cancelada');
      } else {
        throw new Error('Error desconocido en autenticación');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    console.log('👋 Sign out');
  }
}