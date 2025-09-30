// apps/mobile/src/config/api.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { AUTH_URL, BASE_URL } from '../utils/constants/constants';

const getApiUrl = (): string => {

  if (__DEV__) {
    const ngrokUrl = Constants.expoConfig?.extra?.apiUrl || 
                     process.env.EXPO_PUBLIC_API_URL ||
                     BASE_URL;
    return ngrokUrl;
  }
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
    shouldUseNative: !isExpoGo,
  };
};

export const API_CONFIG = {
  BASE_URL: AUTH_URL,
};