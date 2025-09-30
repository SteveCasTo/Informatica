export default ({ config }) => {
  const environment = process.env.APP_ENV || 'development';
  
  let apiUrl;
  
  switch (environment) {
    case 'production':
      apiUrl = 'https://tu-dominio-produccion.com/api';
      break;
    case 'development':
    default:
      // Usar ngrok en desarrollo
      apiUrl = 'https://unplunderous-tolerative-trinh.ngrok-free.dev/api';
      break;
  }

  return {
    ...config,
    extra: {
      ...config.extra,
      apiUrl: apiUrl,
      environment: environment,
    },
  };
};