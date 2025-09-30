import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Log para debug
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  next();
});

// Ruta de prueba principal
app.get('/', (req, res) => {
  console.log('✅ Ejecutando GET /');
  res.json({ message: '🚀 InfoVault API funcionando' });
});

// Ruta de prueba adicional
app.get('/api/test', (req, res) => {
  console.log('✅ Ejecutando GET /api/test');
  res.json({ message: '✅ API Test funcionando', timestamp: new Date().toISOString() });
});

// Ruta de auth directa
app.post('/api/auth/google', (req, res) => {
  console.log('✅ Ejecutando POST /api/auth/google');
  console.log('Recibido:', req.body);
  
  res.json({
    success: true,
    message: 'Endpoint funcionando',
    user: {
      user_id: 1,
      google_id: 'test-id',
      email: 'test@fcyt.umss.edu.bo',
      username: 'Usuario de Prueba',
      password_hash: '',
      user_role: 'student',
      profile_picture: null,
      status: 'active',
      registration_date: new Date().toISOString(),
      active: true,
    },
    token: 'test-token-123'
  });
});

export default app;