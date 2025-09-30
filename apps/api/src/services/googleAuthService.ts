import axios from 'axios'
import { googleConfig } from '../config/google'
import { GoogleUserInfo } from '../types/auth'
import { createError } from '../middleware/errorHandler'

export class GoogleAuthService {
  
  generateAuthUrl(redirectUri?: string, platform: 'web' | 'android' | 'ios' = 'web'): string {
    const clientId = googleConfig.getClientIdForPlatform(platform);
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri || googleConfig.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account'
    })
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return authUrl;
  }

  async exchangeCodeForTokens(code: string, redirectUri?: string, platform: 'web' | 'android' | 'ios' = 'web'): Promise<string> {
    try {
      const clientId = googleConfig.getClientIdForPlatform(platform || 'web');
      
      const tokenData = {
        client_id: clientId,
        client_secret: googleConfig.clientSecret, // Siempre usar client_secret (sin PKCE)
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code
      };

      const response = await axios.post('https://oauth2.googleapis.com/token', tokenData);

      return response.data.access_token;
    } catch {
      throw createError('Error obteniendo tokens de Google', 500);
    }
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      
      const response = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const userInfo: GoogleUserInfo = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture
      };

      return userInfo;
    } catch {
      throw createError('Error obteniendo información del usuario de Google', 500);
    }
  }
}