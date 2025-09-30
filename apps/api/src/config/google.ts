export const googleConfig = {
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID!,

  androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID!,
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID!,

  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback',
  authUrl: process.env.FRONTEND_URL || 'https://accounts.google.com/o/oauth2/v2/auth',

  getClientIdForPlatform: (platform?: 'web' | 'android' | 'ios') => {
    switch (platform) {
      case 'android':
        return process.env.GOOGLE_ANDROID_CLIENT_ID!;
      case 'ios':
        return process.env.GOOGLE_IOS_CLIENT_ID!;
      case 'web':
      default:
        return process.env.GOOGLE_WEB_CLIENT_ID!;
    }
  }
}