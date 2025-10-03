// src/validators/subjectValidator.ts
import { z } from 'zod'

export const createSubjectSchema = z.object({
  subject_name: z
    .string()
    .min(1, 'El nombre de la materia es obligatorio')
    .max(30, 'El nombre de materia no puede exceder 30 caracteres')
    .regex(/^[A-Za-z0-9 ]+$/u, 'El nombre de materia solo admite letras, números y espacios'),
  description: z.string().max(500, 'La descripción es muy larga').optional().nullable(),
  semester: z
    .number()
    .int('El semestre debe ser un número entero')
    .min(1, 'El semestre mínimo es 1')
    .max(12, 'El semestre máximo es 12')
})

export const validateCreateSubject = (data: unknown) => {
  return createSubjectSchema.parse(data)
}
