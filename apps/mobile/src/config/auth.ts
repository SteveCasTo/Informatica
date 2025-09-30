import Constants from 'expo-constants';

const getDevServerUrl = () => {
  if (Constants.expoConfig?.hostUri) {
    const host = Constants.expoConfig.hostUri.split(':')[0];
    return `http://${host}:3001`;
  }
  return 'http://10.0.2.2:3001';
};

export const AUTH_CONFIG = {
  backendUrl: __DEV__ ? getDevServerUrl() : 'https://tu-backend-produccion.com',
  scheme: 'informaticapp',
  redirectPath: '/auth/callback'
};