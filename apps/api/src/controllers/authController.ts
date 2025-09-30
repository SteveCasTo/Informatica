import { Request, Response } from 'express'
import { AuthService } from '../services/authService'
import { GoogleAuthService } from '../services/googleAuthService'
import { prisma } from '../config/database' // ← Si tienes prisma configurado
import { validateLogin } from '../validators/authValidator'
import { AuthResponse } from '../types/auth'
import { googleConfig } from '../config/google'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { MobileAuthService } from '../services/mobileAuthService'

export class AuthController {
  constructor(private authService: AuthService) {}

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = validateLogin(req.body)
    
    const result = await this.authService.loginWithCredentials(email, password)
    
    const response: AuthResponse = {
      success: true,
      data: result
    }
    
    res.json(response)
  })

  // Ruta para web
  googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const googleAuthService = new GoogleAuthService()
    const authUrl = googleAuthService.generateAuthUrl()
    console.log('🔗 [Web] authUrl generado:', authUrl)

    res.json({
      success: true,
      data: { authUrl }
    })
  })

  googleMobileAuth = asyncHandler(async (req: Request, res: Response) => {
    const redirectUri = (req.query.redirectUri as string) || req.body.redirectUri;
    if (!redirectUri) throw createError('redirectUri es requerido', 400);

    const statePayload = encodeURIComponent(JSON.stringify({ redirectUri }));

    const googleClientId = googleConfig.webClientId;
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: googleConfig.redirectUri,
      scope: 'openid profile email',
      state: statePayload,
      prompt: 'select_account',
      access_type: 'offline',
    });

    const googleUrl = `${googleConfig.authUrl}?${params.toString()}`;

    return res.redirect(googleUrl);
  });

  // Nuevo endpoint para intercambiar código
  googleMobileExchange = asyncHandler(async (req: Request, res: Response) => {
    const { code, redirectUri } = req.body;

    if (!code || !redirectUri) {
      throw createError('code y redirectUri son requeridos', 400);
    }

    console.log('Intercambiando código por token...');
    console.log('Redirect URI recibido:', redirectUri);

    // Usar el redirectUri que viene del cliente
    const result = await this.authService.processGoogleAuth(code, redirectUri);

    res.json({
      success: true,
      data: result
    });
  })

  // Callback específico para móvil con logs detallados
  googleMobileCallback = asyncHandler(async (req: Request, res: Response) => {
    console.log('🔄 [MOBILE CALLBACK] Iniciando callback móvil');
    console.log('📋 [MOBILE CALLBACK] Query completo:', req.query);
    console.log('🔍 [MOBILE CALLBACK] Headers:', req.headers);
    
    const code = req.query.code as string;
    const state = req.query.state as string;
    const error = req.query.error as string;

    // Crear función helper para páginas de redirección
    const createRedirectPage = (deepLink: string, message: string = '¡Autenticación exitosa!') => {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${message}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
              background: #f5f5f5;
            }
            .container { 
              max-width: 400px; 
              margin: 0 auto; 
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .success { color: #4CAF50; margin-bottom: 20px; }
            .error { color: #f44336; margin-bottom: 20px; }
            .loading { color: #2196F3; margin: 20px 0; }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background: #4285F4;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px;
            }
            .countdown { font-size: 18px; font-weight: bold; color: #2196F3; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="${message.includes('Error') ? 'error' : 'success'}">${message}</h2>
            <p class="loading">Redirigiendo a la aplicación en <span id="countdown">3</span> segundos...</p>
            <a href="${deepLink}" class="btn" onclick="redirectNow()">Abrir App Ahora</a>
            <p><small>Si no se abre automáticamente, usa el botón de arriba</small></p>
          </div>
          <script>
            let countdown = 3;
            const countdownEl = document.getElementById('countdown');
            
            function redirectNow() {
              console.log('Redirigiendo a:', '${deepLink}');
              window.location.href = '${deepLink}';
            }
            
            function updateCountdown() {
              countdownEl.textContent = countdown;
              if (countdown <= 0) {
                redirectNow();
                return;
              }
              countdown--;
              setTimeout(updateCountdown, 1000);
            }
            
            setTimeout(updateCountdown, 1000);
            setTimeout(redirectNow, 100);
          </script>
        </body>
        </html>
      `;
    };

    // Verificar si hay error de Google
    if (error) {
      console.error('❌ [MOBILE CALLBACK] Error de Google:', error);
      const errorPage = createRedirectPage(
        `exp://192.168.0.27:8081?error=${error}`,
        `Error de Google: ${error}`
      );
      return res.send(errorPage);
    }

    if (!code) {
      console.error('❌ [MOBILE CALLBACK] No se recibió código');
      const errorPage = createRedirectPage(
        'exp://192.168.0.27:8081?error=no_code',
        'Error: No se recibió código'
      );
      return res.send(errorPage);
    }

    console.log('✅ [MOBILE CALLBACK] Código recibido:', code);

    try {
      console.log('🔄 [MOBILE CALLBACK] Procesando autenticación...');
      
      // CORREGIR: Usar el redirect URI correcto para móvil
      const result = await this.authService.processGoogleAuth(
        code, 
        'https://unplunderous-tolerative-trinh.ngrok-free.dev/api/auth/google/mobile/callback'
      );

      console.log('✅ [MOBILE CALLBACK] Autenticación exitosa para:', (result.user as any)?.email);

      const deepLink = `exp://192.168.0.27:8081?token=${encodeURIComponent(result.token)}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
      
      console.log('🔀 [MOBILE CALLBACK] Generando deep link:', deepLink);
      
      const successPage = createRedirectPage(deepLink, '¡Autenticación exitosa!');
      return res.send(successPage);

    } catch (error) {
      console.error('❌ [MOBILE CALLBACK] Error procesando:', error);
      const errorPage = createRedirectPage(
        'exp://192.168.0.27:8081?error=auth_failed',
        'Error en autenticación'
      );
      return res.send(errorPage);
    }
  });

  googleCallback = asyncHandler(async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const stateRaw = req.query.state as string | undefined;
    console.log('🔄 [CALLBACK] Callback de Google recibido');
    console.log('📋 [CALLBACK] Código:', code);
    console.log('🔍 [CALLBACK] User-Agent:', req.headers['user-agent']);
    console.log('🔍 [CALLBACK] Referer:', req.headers.referer);
    console.log('🔍 [CALLBACK] Query completo:', req.query);

    if (!code) throw createError('Código de autorización no proporcionado', 400);

    // Función para crear página de redirección
    const createRedirectPage = (deepLink: string, message: string = '¡Autenticación exitosa!') => {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${message}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
              background: #f5f5f5;
            }
            .container { 
              max-width: 400px; 
              margin: 0 auto; 
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .success { color: #4CAF50; margin-bottom: 20px; }
            .error { color: #f44336; margin-bottom: 20px; }
            .loading { color: #2196F3; margin: 20px 0; }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background: #4285F4;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="${message.includes('Error') ? 'error' : 'success'}">${message}</h2>
            <p class="loading">Redirigiendo a la aplicación en <span id="countdown">3</span> segundos...</p>
            <a href="${deepLink}" class="btn" onclick="redirectNow()">Abrir App Ahora</a>
            <p><small>Si no se abre automáticamente, usa el botón de arriba</small></p>
          </div>
          <script>
            let countdown = 3;
            const countdownEl = document.getElementById('countdown');
            
            function redirectNow() {
              console.log('Redirigiendo a:', '${deepLink}');
              window.location.href = '${deepLink}';
            }
            
            function updateCountdown() {
              countdownEl.textContent = countdown;
              if (countdown <= 0) {
                redirectNow();
                return;
              }
              countdown--;
              setTimeout(updateCountdown, 1000);
            }
            
            setTimeout(updateCountdown, 1000);
            setTimeout(redirectNow, 100);
          </script>
        </body>
        </html>
      `;
    };

    try {
      // Procesar autenticación
      const result = await this.authService.processGoogleAuth(
        code, 
        'https://unplunderous-tolerative-trinh.ngrok-free.dev/api/auth/google/callback'
      );

      const user = result.user as any;
      console.log('✅ [CALLBACK] Autenticación exitosa para:', user?.email);

      // Detectar si es móvil usando múltiples indicadores
      const userAgent = req.headers['user-agent'] || '';
      const referer = req.headers.referer || '';
      
      // Mejorar la detección de móvil
      const isMobileUA = userAgent.includes('Mobile') || 
                        userAgent.includes('Android') || 
                        userAgent.includes('iPhone') ||
                        userAgent.includes('Expo') || 
                        userAgent.includes('React Native');
      
      const isMobileReferer = referer && (
                             referer.includes('expo') || 
                             referer.includes('192.168.0.27') ||
                             referer.includes('localhost:8081')
                           );

      // También revisar si viene de un WebView (común en apps móviles)
      const isWebView = userAgent.includes('wv') || userAgent.includes('WebView');

      const isMobile = isMobileUA || isMobileReferer || isWebView;

      console.log('📱 [CALLBACK] Detección de plataforma:');
      console.log('  - User-Agent móvil:', isMobileUA);
      console.log('  - Referer móvil:', isMobileReferer);
      console.log('  - Es WebView:', isWebView);
      console.log('  - Resultado final:', isMobile ? 'MÓVIL' : 'WEB');

      if (isMobile) {
        // Para móvil: crear deep link
        const deepLink = `exp://192.168.0.27:8081?token=${encodeURIComponent(result.token)}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
        console.log('🔀 [CALLBACK] Redirigiendo a app móvil:', deepLink);
        
        const mobilePage = createRedirectPage(deepLink, '¡Autenticación exitosa!');
        return res.send(mobilePage);
      } else {
        // Para web: redirigir al frontend web
        const webRedirect = `https://unplunderous-tolerative-trinh.ngrok-free.dev?token=${encodeURIComponent(result.token)}`;
        console.log('🔀 [CALLBACK] Redirigiendo a web:', webRedirect);
        return res.redirect(webRedirect);
      }

    } catch (error) {
      console.error('❌ [CALLBACK] Error en callback:', error);
      
      // Para móvil: página de error
      const userAgent = req.headers['user-agent'] || '';
      const isMobile = userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone');
      
      if (isMobile) {
        const errorPage = createRedirectPage(
          'exp://192.168.0.27:8081?error=auth_failed',
          'Error en autenticación'
        );
        return res.send(errorPage);
      }
      
      throw createError('Error en autenticación con Google', 500);
    }
  });

  // Para autenticación nativa (Google Sign-In SDK)
  googleNativeAuth = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      throw createError('Token de Google requerido', 400);
    }

    const result = await this.authService.processGoogleNativeAuth(idToken);
    
    res.json({
      success: true,
      data: result
    });
  })

  // Endpoint para obtener configuración de Google
  getGoogleConfig = asyncHandler(async (req: Request, res: Response) => {
    const response = {
      success: true,
      data: {
        clientId: process.env.GOOGLE_CLIENT_ID,
      }
    };
    
    res.json(response);
  })

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    if (!user) {
      throw createError('Usuario no autenticado', 401);
    }

    try {
      const userProfile = await prisma.user.findUnique({
        where: {
          user_id: user.userId
        }
      });
      
      if (!userProfile) {
        throw createError('Usuario no encontrado', 404);
      }

      if (!userProfile.active || userProfile.status !== 'active') {
        throw createError('Usuario suspendido o inactivo', 403);
      }
      
      const response = {
        success: true,
        data: {
          user_id: userProfile.user_id,
          username: userProfile.username,
          email: userProfile.email,
          google_id: userProfile.google_id,
          profile_picture: userProfile.profile_picture,
          user_role: userProfile.user_role,
          status: userProfile.status,
          registration_date: userProfile.registration_date,
          active: userProfile.active
        }
      };
      
      res.json(response);
      
    } catch (error) {
      throw error;
    }
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Logout exitoso'
    })
  })

  // Corrige el método exchange
  exchange = asyncHandler(async (req: Request, res: Response) => {
    const { code, redirectUri } = req.body;
    
    console.log('🔄 Intercambiando código:', code);
    console.log('🔗 Redirect URI:', redirectUri);
    
    if (!code || !redirectUri) {
      throw createError('code y redirectUri son requeridos', 400);
    }
    
    try {
      // Usar el servicio de autenticación para procesar Google Auth
      const result = await this.authService.processGoogleAuth(code, redirectUri);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('❌ Error intercambiando código:', error);
      throw createError('Error intercambiando código por token', 500);
    }
  });

}