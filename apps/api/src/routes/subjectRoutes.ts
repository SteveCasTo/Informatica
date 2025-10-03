// src/routes/subjectRoutes.ts
import { Router, Request, Response, NextFunction } from 'express'
import { SubjectController } from '../controllers/subjectController'
import { authMiddleware } from '../middleware/auth'
import { validateRequest } from '../middleware/errorHandler'
import { createSubjectSchema } from '../validators/subjectValidator'
import { TokenPayload } from '../types/auth'

const router = Router()
const subjectController = new SubjectController()

/**
 * adminOnly middleware — usa el TokenPayload real definido en ../types/auth
 */
function adminOnly(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as TokenPayload | undefined
  if (!user) {
    res.status(401).json({ success: false, error: 'No autenticado' })
    return
  }
  if (user.role !== 'administrator') {
    res.status(403).json({ success: false, error: 'Acceso restringido: solo administradores' })
    return
  }
  next()
}

router.post(
  '/new-subject',
  authMiddleware,
  adminOnly,
  validateRequest(createSubjectSchema, 'body'),
  (req: Request, res: Response, next: NextFunction) => subjectController.create(req, res, next)
)

export { router as subjectRoutes }
