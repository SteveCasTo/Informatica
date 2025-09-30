import Constants from 'expo-constants';
import * as Application from 'expo-application';

export const isExpoGo = Constants.executionEnvironment === 'storeClient';
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

export const shouldUseNativeAuth = (): boolean => {
  return !isExpoGo && (isProduction || Application.nativeApplicationVersion !== null);
};

export const getEnvironmentInfo = () => ({
  isExpoGo,
  isDevelopment,
  isProduction,
  shouldUseNative: shouldUseNativeAuth(),
  executionEnvironment: Constants.executionEnvironment,
  appVersion: Application.nativeApplicationVersion
});

export const environment = {
  // VERIFICAR que esta URL sea correcta
  apiUrl: 'https://unplunderous-tolerative-trinh.ngrok-free.dev/api',
  // NO debería tener '/api' al final si ya lo agregas en el service
};