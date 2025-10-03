// src/controllers/subjectController.ts
import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { createError } from '../middleware/errorHandler'
import { TokenPayload } from '../types/auth'

type ReqWithToken = Request & { user?: TokenPayload }

export class SubjectController {
  async create(req: ReqWithToken, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subject_name, description = null, semester } = req.body as {
        subject_name: string
        description?: string | null
        semester: number
      }

      const user = req.user
      if (!user) {
        next(createError('No autenticado', 401))
        return
      }
      if (user.role !== 'administrator') {
        next(createError('Acceso restringido: solo administradores', 403))
        return
      }

      // Verificación case-insensitive: si tu Prisma soporta mode: 'insensitive'
      const existing = await prisma.subject.findFirst({
        where: {
          subject_name: {
            equals: subject_name,
            // mode solo existe en prisma >= 2.13+; si tu versión lo soporta, genial.
            mode: 'insensitive'
          },
          semester
        }
      })

      if (existing) {
        next(createError('Ya existe una materia con ese nombre de en este semestre', 409))
        return
      }

      const created = await prisma.subject.create({
        data: {
          subject_name,
          description,
          semester,
          active: true
        }
      })

      res.status(201).json({
        success: true,
        message: 'Materia creada satisfactoriamente',
        subject: created
      })
    } catch (err) {
      next(err as Error)
    }
  }
}
