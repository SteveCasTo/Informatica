// apps/mobile/src/config/google.ts
import Constants from 'expo-constants'
import { Platform } from 'react-native'

interface GoogleConfig {
  webClientId: string
  androidClientId?: string
  iosClientId?: string
  scopes: string[]
  scheme: string
}

// Configuración base de Google
export const googleConfig: GoogleConfig = {
  // Client ID para autenticación web (usado como fallback)
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  
  // Client IDs específicos por plataforma (para SDK nativo)
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
  
  // Permisos solicitados
  scopes: ['openid', 'email', 'profile'],
  
  // Scheme para deep links
  scheme: Constants.expoConfig?.scheme || 'tuapp'
}

/**
 * Obtiene la configuración específica para Google Sign-In SDK
 */
export function getGoogleSignInConfig() {
  return {
    webClientId: googleConfig.webClientId,
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    scopes: googleConfig.scopes,
    offlineAccess: false,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
    accountName: '',
    googleServicePlistPath: '',
  }
}

/**
 * Obtiene el client ID apropiado para la plataforma actual
 */
export function getClientIdForPlatform(): string {
  if (Platform.OS === 'android' && googleConfig.androidClientId) {
    return googleConfig.androidClientId
  }
  
  if (Platform.OS === 'ios' && googleConfig.iosClientId) {
    return googleConfig.iosClientId
  }
  
  // Fallback a web client ID
  return googleConfig.webClientId
}

/**
 * Genera URL de deep link para el callback
 */
export function getCallbackUrl(): string {
  return `${googleConfig.scheme}://auth/google/callback`
}

/**
 * Genera URL de autenticación web para WebBrowser
 */
export function getWebAuthUrl(backendUrl: string): string {
  const params = new URLSearchParams({
    platform: 'mobile',
    scheme: googleConfig.scheme
  })
  
  return `${backendUrl}/auth/google?${params.toString()}`
}

/**
 * Valida que la configuración esté completa
 */
export function validateGoogleConfig(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Verificar client ID web (mínimo requerido)
  if (!googleConfig.webClientId) {
    errors.push('EXPO_PUBLIC_GOOGLE_CLIENT_ID no configurado')
  }

  // Verificar client IDs por plataforma
  if (!googleConfig.androidClientId) {
    warnings.push('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID no configurado - no funcionará SDK nativo en Android')
  }

  if (!googleConfig.iosClientId) {
    warnings.push('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID no configurado - no funcionará SDK nativo en iOS')
  }

  // Verificar scheme
  if (!googleConfig.scheme) {
    errors.push('Scheme no configurado en app.json')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Log de configuración (sin mostrar secrets completos)
 */
export function logGoogleConfig(): void {
  const validation = validateGoogleConfig()
  
  console.log('🔧 Google Configuration:')
  console.log(`   Platform: ${Platform.OS}`)
  console.log(`   Scheme: ${googleConfig.scheme}`)
  console.log(`   Web Client ID: ${googleConfig.webClientId ? '✅ Configurado' : '❌ Falta'}`)
  console.log(`   Android Client ID: ${googleConfig.androidClientId ? '✅ Configurado' : '⚠️ Falta'}`)
  console.log(`   iOS Client ID: ${googleConfig.iosClientId ? '✅ Configurado' : '⚠️ Falta'}`)
  console.log(`   Scopes: ${googleConfig.scopes.join(', ')}`)
  
  if (validation.errors.length > 0) {
    console.error('❌ Errores de configuración:')
    validation.errors.forEach(error => console.error(`   - ${error}`))
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Advertencias:')
    validation.warnings.forEach(warning => console.warn(`   - ${warning}`))
  }
  
  if (validation.isValid) {
    console.log('✅ Configuración básica válida')
  }
}