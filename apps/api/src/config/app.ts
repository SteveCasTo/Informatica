import dotenv from 'dotenv'

dotenv.config()

interface RedirectQuery {
  redirect?: string;
  source?: string;
  platform?: string;
}

const isMobileRequest = (userAgent?: string, referer?: string, query?: RedirectQuery): boolean => {
  if (!userAgent) return false;
  
  const mobileIndicators = [
    'okhttp',
    'Expo',
    'ReactNative', 
    'Android',
    'iPhone',
    'Mobile'
  ];
  
  const isMobileUserAgent = mobileIndicators.some(indicator => 
    userAgent.includes(indicator)
  );
  
  const isMobileReferer = referer?.includes('expo') || false;
  const isMobileQuery = query?.platform === 'mobile' || query?.source === 'mobile';

  return isMobileUserAgent || isMobileReferer || isMobileQuery;
};

const getEnvironmentUrls = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  if (nodeEnv === 'production') {
    return {
      frontendUrl: process.env.FRONTEND_URL || 'https://tu-frontend-produccion.com',
      backendUrl: process.env.BACKEND_URL || 'https://tu-backend-produccion.com',
      mobileBackendUrl: process.env.BACKEND_URL || 'https://tu-backend-produccion.com',
    };
  }
  
  // Desarrollo - Usar ngrok URLs
  return {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    backendUrl: process.env.BACKEND_URL || 'https://unplunderous-tolerative-trinh.ngrok-free.dev',
    mobileBackendUrl: process.env.MOBILE_BACKEND_URL || 'https://unplunderous-tolerative-trinh.ngrok-free.dev',
  };
};

const urls = getEnvironmentUrls();

export const appConfig = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',

  frontendUrl: urls.frontendUrl,
  backendUrl: urls.backendUrl,
  mobileBackendUrl: urls.mobileBackendUrl,

  getFrontendUrl: (userAgent?: string, referer?: string, query?: RedirectQuery): string => {
    if (isMobileRequest(userAgent, referer, query)) {
      console.log('📱 Request desde móvil');
      return urls.frontendUrl;
    }
    return urls.frontendUrl;
  },

  getBackendUrl: (userAgent?: string, referer?: string, query?: RedirectQuery): string => {
    if (isMobileRequest(userAgent, referer, query)) {
      console.log('📱 Usando backend móvil:', urls.mobileBackendUrl);
      return urls.mobileBackendUrl;
    }
    return urls.backendUrl;
  },

  google: {
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '',
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
    iosClientId: process.env.GOOGLE_IOS_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || `${urls.backendUrl}/api/auth/google/callback`
  },

  mobileScheme: process.env.MOBILE_SCHEME || 'informaticapp',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiration: process.env.JWT_EXPIRATION || '24h',
  },

  getRedirectUrl: (path: string, userAgent?: string, referer?: string, query?: RedirectQuery): string => {
    const baseUrl = appConfig.getFrontendUrl(userAgent, referer, query);
    return `${baseUrl}${path}`;
  },

  shouldRedirect: (userAgent?: string, referer?: string, query?: RedirectQuery): boolean => {
    if (isMobileRequest(userAgent, referer, query)) {
      console.log('📱 Request desde móvil - retornando JSON');
      return false;
    }
    
    if (query?.redirect === 'web') {
      console.log('🌐 Redirect explícito a web');
      return true;
    }
    
    console.log('📄 Retornando JSON por defecto');
    return false;
  }
};