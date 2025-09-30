import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UserRepository } from '../repositories/userRepository'
import { GoogleAuthService } from './googleAuthService'
import { TokenPayload, GoogleUserInfo } from '../types/auth'
import { UserRole, UserStatus } from '@prisma/client'
import { createError } from '../middleware/errorHandler'
import { MobileAuthService } from './mobileAuthService'
type StringValue = string

export class AuthService {
  private jwtSecret: Secret
  private jwtExpiration: StringValue = '1h' 
  

  constructor(
    private userRepository: UserRepository,
    private googleAuthService: GoogleAuthService
  ) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno')
    }
    if (!process.env.JWT_EXPIRATION) {
      throw new Error('JWT_EXPIRATION no está definido en las variables de entorno')
    }

    this.jwtSecret = process.env.JWT_SECRET
    this.jwtExpiration = process.env.JWT_EXPIRATION
  }

  generateToken(payload: TokenPayload): string {
    try {
      // Hacer cast explícito del tipo
      const options: SignOptions = { 
        expiresIn: this.jwtExpiration as jwt.SignOptions['expiresIn']
      };
      
      return jwt.sign(payload, this.jwtSecret, options)
    } catch (error) {
      throw createError('Error generando token', 500)
    }
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as TokenPayload
    } catch (error) {
      // Acceder a TokenExpiredError de manera diferente
      if (error && typeof error === 'object' && 'name' in error && error.name === 'TokenExpiredError') {
        throw createError('Token expirado', 401)
      }
      throw createError('Token inválido', 401)
    }
  }

  async loginWithCredentials(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)
    
    if (!user) {
      throw createError('Credenciales inválidas', 401)
    }

    if (!user.active) {
      throw createError('Usuario desactivado', 403)
    }

    if (user.status !== UserStatus.active) {
      throw createError('Usuario suspendido', 403)
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      throw createError('Credenciales inválidas', 401)
    }

    const token = this.generateToken({
      userId: user.user_id,
      email: user.email,
      role: user.user_role
    })

    return {
      user: this.sanitizeUser(user),
      token
    }
  }

  async processGoogleAuth(code: string, redirectUri?: string) {
    try {
      const platform = redirectUri?.includes('/mobile/') ? 'android' : 'web';

      const accessToken = await this.googleAuthService.exchangeCodeForTokens(
        code, 
        redirectUri, 
        platform as 'web' | 'android' | 'ios'
      );
      
      const googleUser = await this.googleAuthService.getUserInfo(accessToken);
      
      let user = await this.userRepository.findByGoogleId(googleUser.id);
      
      if (!user) {
        const existingUser = await this.userRepository.findByEmail(googleUser.email);
        
        if (existingUser) {
          user = await this.userRepository.update(existingUser.user_id, {
            google_id: googleUser.id,
            profile_picture: googleUser.picture
          });
        } else {
          user = await this.createUserFromGoogle(googleUser);
        }
      }

      if (!user.active || user.status !== UserStatus.active) {
        throw createError('Usuario suspendido o inactivo', 403);
      }

      const token = this.generateToken({
        userId: user.user_id,
        email: user.email,
        role: user.user_role
      });

      return {
        user: this.sanitizeUser(user),
        token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw createError(`Error en autenticación: ${error.message}`, 400);
      } else {
        throw createError('Error en autenticación', 400);
      }
    }
  }

  async processGoogleNativeAuth(idToken: string) {
    try {
      const mobileAuthService = new MobileAuthService();
      const googleUser = await mobileAuthService.verifyGoogleIdToken(idToken);
      
      let user = await this.userRepository.findByGoogleId(googleUser.id);
      
      if (!user) {
        user = await this.userRepository.findByEmail(googleUser.email);
        if (user) {
          user = await this.userRepository.update(user.user_id, {
            google_id: googleUser.id,
            profile_picture: googleUser.picture ?? (user.profile_picture ?? undefined)
          });
        } else {
          user = await this.createUserFromGoogle(googleUser);
        }
      }

      if (!user.active || user.status !== UserStatus.active) {
        throw createError('Usuario suspendido o inactivo', 403);
      }

      const token = this.generateToken({
        userId: user.user_id,
        email: user.email,
        role: user.user_role
      });

      return {
        user: this.sanitizeUser(user),
        token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw createError(`Error en autenticación nativa: ${error.message}`, 400);
      }
      throw createError('Error en autenticación nativa', 400);
    }
  }

  private async createUserFromGoogle(googleUser: GoogleUserInfo) {
    const baseUsername = googleUser.email.split('@')[0]
    const username = baseUsername

    return this.userRepository.create({
      google_id: googleUser.id,
      email: googleUser.email,
      username,
      password_hash: '',
      user_role: UserRole.student,
      profile_picture: googleUser.picture,
      status: UserStatus.active
    })
  }

  private sanitizeUser(user: unknown) {
    if (typeof user === 'object' && user !== null && 'password_hash' in user) {
      const { ...sanitizedUser } = user
      return sanitizedUser
    }
    return user
  }

  async getUserProfile(userId: number) {
    try {
      
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        throw createError('Usuario no encontrado', 404);
      }

      if (!user.active || user.status !== UserStatus.active) {
        throw createError('Usuario suspendido o inactivo', 403);
      }
      return this.sanitizeUser(user);
      
    } catch (error) {
      throw error;
    }
  }
}