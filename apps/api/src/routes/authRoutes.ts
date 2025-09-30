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


router.use((req, res, next) => {
  res.set('ngrok-skip-browser-warning', 'true');
  next();
});

router.post('/login', 
  validateRequest(loginSchema, 'body'),
  authController.login
)


router.get('/google', authController.googleAuth)
router.get('/google/callback', authController.googleCallback)

router.get('/google/mobile', authController.googleMobileAuth)
router.get('/google/mobile/callback', authController.googleMobileCallback)

router.post('/google/mobile/exchange', authController.googleMobileExchange)

router.post('/exchange', authController.exchange);

router.post('/google/native', authController.googleNativeAuth)

router.get('/config/google', authController.getGoogleConfig)

router.post('/logout', authMiddleware, authController.logout)
router.get('/profile', authMiddleware, authController.getProfile)

export { router as authRoutes }