const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const AUTH_URL = process.env.EXPO_PUBLIC_API_URL;

export default ({ config }) => {
  const environment = process.env.APP_ENV || 'development';
  
  let apiUrl;
  
  switch (environment) {
    case 'production':
      apiUrl = 'https://tu-dominio-produccion.com/api';
      break;
    case 'development':
    default:
      apiUrl = AUTH_URL;
      break;
  }

  return {
    ...config,
    extra: {
      ...config.extra,
      apiUrl: apiUrl,
      environment: environment,
      googleWebClientId: GOOGLE_WEB_CLIENT_ID
    },
  };
};