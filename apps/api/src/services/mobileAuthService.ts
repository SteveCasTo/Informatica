import axios from 'axios';
import { GoogleUserInfo } from '../types/auth';
import { createError } from '../middleware/errorHandler';

export class MobileAuthService {
  
  async verifyGoogleIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      
      if (!response.data.email_verified) {
        throw createError('Email no verificado', 400);
      }

      return {
        id: response.data.sub,
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture
      };
    } catch {
      throw createError('Token de Google inválido', 401);
    }
  }
  
  generateDeepLink(token: string, error?: string): string {
    const baseUrl = `informaticapp://auth/callback`;
    if (error) {
      return `${baseUrl}?error=${encodeURIComponent(error)}`;
    }
    return `${baseUrl}?token=${encodeURIComponent(token)}`;
  }

  generateMobileAuthUrl(): string {
    const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/google/mobile/callback`;
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account'
    });
    
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }
}