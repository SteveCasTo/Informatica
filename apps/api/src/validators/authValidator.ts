import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Password requerido')
})

export const googleCallbackSchema = z.object({
  code: z.string().min(1, 'Código de autorización requerido'),
  redirectUri: z.string().optional()
})

export const validateLogin = (data: unknown) => {
  return loginSchema.parse(data)
}

export const validateGoogleCallback = (data: unknown) => {
  return googleCallbackSchema.parse(data)
}