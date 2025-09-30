// apps/mobile/src/config/api.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { BASE_URL } from '../utils/constants/constants';

const getApiUrl = (): string => {
  console.log('🔍 Configurando API URL...');
  console.log('📱 Platform:', Platform.OS);
  console.log('🛠️ __DEV__:', __DEV__);
  console.log('🔧 Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
  
  // En desarrollo, usar ngrok
  if (__DEV__) {
    const ngrokUrl = Constants.expoConfig?.extra?.apiUrl || 
                     process.env.EXPO_PUBLIC_API_URL ||
                     BASE_URL;
    
    console.log('🔗 Usando ngrok URL:', ngrokUrl);
    return ngrokUrl;
  }
  
  // En producción
  console.log('🌐 Usando URL de producción');
  return 'https://tu-servidor-produccion.com/api';
};

export const API_BASE_URL = getApiUrl();

export const config = {
  apiUrl: API_BASE_URL,
  environment: __DEV__ ? 'development' : 'production',
  google: {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
  },
  mobileScheme: 'informaticapp',
};

export const getEnvironmentInfo = () => {
  const isDevelopment = __DEV__;
  const isExpoGo = Constants.appOwnership === 'expo';
  
  return {
    isDevelopment,
    isExpoGo,
    apiUrl: API_BASE_URL,
    platform: Platform.OS,
    shouldUseNative: !isExpoGo, // Usar nativo solo si NO es Expo Go
  };
};

console.log('🌐 Environment configurado:', {
  apiUrl: API_BASE_URL,
  isDev: __DEV__,
  platform: Platform.OS
});

export const API_CONFIG = {
  // Asegúrate de que esta URL sea correcta
  BASE_URL: 'https://unplunderous-tolerative-trinh.ngrok-free.dev/api',
  // NO debe tener barra al final
  
  // Si tienes otros endpoints o configuración, manténlos
};

// Log para verificar configuración
console.log('🔧 API_CONFIG cargado:', API_CONFIG);