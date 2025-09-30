// Tipos compartidos entre backend y frontend para autenticación

export interface User {
  id: string
  email: string
  name?: string
  picture?: string
  provider: 'google' | 'credentials'
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  token: string        // JWT de nuestra aplicación
  refreshToken?: string
  expiresAt: Date
}

export interface AuthResult {
  user: User
  token: string
  refreshToken?: string
  expiresAt: Date
}

// Respuesta estándar de la API
export interface AuthResponse {
  success: true
  data: AuthResult
}

export interface AuthErrorResponse {
  success: false
  message: string
  errors?: any[]
}

// Tipos para el flujo híbrido de Google
export interface GoogleWebAuthData {
  code: string
  state?: string
}

export interface GoogleNativeAuthData {
  idToken: string
  accessToken?: string
  platform: 'android' | 'ios'
}

export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
  locale?: string
}

// Tipos para detección de entorno
export type AuthMethod = 'native' | 'webview' | 'fallback'

export interface AuthEnvironment {
  method: AuthMethod
  platform: 'android' | 'ios' | 'web'
  isExpoGo: boolean
  hasPlayServices?: boolean
  supportsNativeAuth: boolean
}

// Request types para el backend
export interface LoginRequest {
  email: string
  password: string
}

export interface GoogleCallbackRequest {
  code: string
  state?: string
}

export interface GoogleIdTokenRequest {
  idToken: string
  platform: 'android' | 'ios'
}

// Response types específicos
export interface GoogleAuthUrlResponse {
  success: true
  data: {
    authUrl: string
    state: string
  }
}

export interface ProfileResponse {
  success: true
  data: User
}

// Error types
export type AuthErrorCode = 
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'GOOGLE_AUTH_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export interface AuthError {
  code: AuthErrorCode
  message: string
  details?: any
}