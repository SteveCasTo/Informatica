import Constants from 'expo-constants'

export const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'https://infobackend-5hw3.onrender.com'

export const API_URL = Constants.expoConfig?.extra?.apiUrl 
  || process.env.EXPO_PUBLIC_API_URL 
  || 'https://infobackend-5hw3.onrender.com'

export const FIREBASE_HOSTING_URL = process.env.EXPO_PUBLIC_FIREBASE_HOSTING_URL
  || 'https://bobrito-bandito.web.app'

export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID 
  || '42355698539-949qe588mkh2vtr9hb8deft79tessplf.apps.googleusercontent.com'

export const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID 
  || '42355698539-949qe588mkh2vtr9hb8deft79tessplf.apps.googleusercontent.com'

export const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID 
  || '42355698539-8drp205l9dbduo45k8cephm50ao5s73f.apps.googleusercontent.com'

export const IS_DEV = process.env.EXPO_PUBLIC_ENVIRONMENT === 'development'

export const ENDPOINTS = {
  LOGIN: `${API_URL}/api/auth/login`,
  GOOGLE_AUTH: `${API_URL}/api/auth/google`,
  POLL_SESSION: `${API_URL}/api/auth/google/poll-session`,
  PROFILE: `${API_URL}/api/auth/profile`,
  LOGOUT: `${API_URL}/api/auth/logout`
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@informatica:auth_token',
  USER_DATA: '@informatica:user_data'
} as const

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6
} as const

export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
}