import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { AuthService } from '../services/authService'
import { GoogleAuthService } from '../services/googleAuthService'
import { UserRepository } from '../repositories/userRepository'
import { prisma } from '../config/database'
import { authMiddleware } from '../middleware/auth'
import { validateRequest } from '../middleware/errorHandler'
import { loginSchema } from '../validators/authValidator'

const router = Router()

const userRepository = new UserRepository(prisma)
const googleAuthService = new GoogleAuthService()
const authService = new AuthService(userRepository, googleAuthService)
const authController = new AuthController(authService)

// Middleware para agregar header de ngrok en todas las rutas
router.use((req, res, next) => {
  console.log('🔄 [AUTH ROUTE]', req.method, req.path);
  console.log('📋 Query params:', req.query);
  console.log('🔍 Headers:', {
    'user-agent': req.headers['user-agent'],
    'referer': req.headers.referer,
    'origin': req.headers.origin
  });
  
  // Agregar header para evitar warning de ngrok
  res.set('ngrok-skip-browser-warning', 'true');
  
  next();
});


router.post('/login', 
  validateRequest(loginSchema, 'body'),
  authController.login
)

// Rutas de Google OAuth para WEB
router.get('/google', authController.googleAuth)
router.get('/google/callback', authController.googleCallback)

// Rutas de Google OAuth para MÓVIL
router.get('/google/mobile', authController.googleMobileAuth)
router.get('/google/mobile/callback', authController.googleMobileCallback)

router.post('/google/mobile/exchange', authController.googleMobileExchange)

// Nueva ruta para intercambio directo desde móvil
router.post('/exchange', authController.exchange);


// Autenticación nativa (Google Sign-In SDK)
router.post('/google/native', authController.googleNativeAuth)

// Configuración
router.get('/config/google', authController.getGoogleConfig)

// Rutas protegidas
router.post('/logout', authMiddleware, authController.logout)
router.get('/profile', authMiddleware, authController.getProfile) // ← ESTA LÍNEA ES CRUCIAL


// Asegurar que existe la ruta /auth/verify
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    // El middleware ya verificó el token
    res.json({
      success: true,
      data: {
        valid: true,
        user: req.user
      }
    });
  } catch {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

export { router as authRoutes }