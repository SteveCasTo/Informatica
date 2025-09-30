import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text, 
  Button, 
  ActivityIndicator, 
  useTheme,
  Surface,
  Avatar,
} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { isLoading, loginWithGoogle } = useAuth();
  const theme = useTheme();

  // Valores animados
  const logoScale = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const centerScale = useSharedValue(0);
  const centerGlow = useSharedValue(0);
  const buttonTranslateY = useSharedValue(100);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Secuencia de animaciones al cargar
    const startAnimations = () => {
      // 1. Logo aparece con bounce
      logoScale.value = withSpring(1, {
        damping: 8,
        stiffness: 100,
      });

      // 2. Logo rota suavemente
      logoRotation.value = withSequence(
        withTiming(360, { duration: 1000 }),
        withRepeat(
          withTiming(370, { duration: 2000 }),
          -1,
          true
        )
      );

      // 3. Título aparece con delay
      setTimeout(() => {
        titleOpacity.value = withTiming(1, { duration: 800 });
      }, 300);

      // 4. Centro aparece con escala
      setTimeout(() => {
        centerScale.value = withSpring(1, {
          damping: 6,
          stiffness: 80,
        });
      }, 600);

      // 5. Efecto glow en centro
      setTimeout(() => {
        centerGlow.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1500 }),
            withTiming(0, { duration: 1500 })
          ),
          -1,
          false
        );
      }, 1000);

      // 6. Botón sube desde abajo
      setTimeout(() => {
        buttonTranslateY.value = withSpring(0, {
          damping: 8,
          stiffness: 100,
        });
        buttonOpacity.value = withTiming(1, { duration: 600 });
      }, 900);
    };

    startAnimations();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      
      // Animación de botón presionado
      buttonTranslateY.value = withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('✅ Login con Google exitoso');
        // Animación de éxito
        centerScale.value = withSequence(
          withTiming(1.2, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
      } else {
        Alert.alert('Error', result.error || 'Error durante el login con Google');
      }
      
    } catch (error: any) {
      console.error('❌ Error en login con Google:', error);
      
      let errorMessage = 'Error durante el login con Google';
      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isAnyLoading = isLoading || isGoogleLoading;

  // Estilos animados
  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` }
    ],
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [
      { 
        translateY: interpolate(
          titleOpacity.value,
          [0, 1],
          [20, 0]
        )
      }
    ],
  }));

  const animatedCenterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: centerScale.value }],
    shadowOpacity: interpolate(
      centerGlow.value,
      [0, 1],
      [0.1, 0.4]
    ),
    elevation: interpolate(
      centerGlow.value,
      [0, 1],
      [1, 8]
    ),
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value }],
    opacity: buttonOpacity.value,
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          
          {/* Logo/Brand Section - Top */}
          <View style={styles.brandSection}>
            <Animated.View style={animatedLogoStyle}>
              <Surface style={styles.logoSurface} elevation={2}>
                <Avatar.Icon 
                  size={80} 
                  icon="file-document-outline" 
                  style={[styles.logoAvatar, { backgroundColor: theme.colors.primary }]}
                />
              </Surface>
            </Animated.View>
            
            <Animated.View style={animatedTitleStyle}>
              <Text variant="headlineLarge" style={[styles.appName, { color: theme.colors.onBackground }]}>
                InfoVault
              </Text>
              <Text variant="bodyLarge" style={[styles.appSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Gestión de Documentos
              </Text>
            </Animated.View>
          </View>

          {/* Center Text */}
          <View style={styles.centerSection}>
            <Animated.View style={animatedCenterStyle}>
              <Surface style={styles.centerSurface} elevation={1}>
                <Text 
                  variant="headlineLarge" 
                  style={[
                    styles.centerText, 
                    { color: theme.colors.primary }
                  ]}
                >
                  Informática
                </Text>
              </Surface>
            </Animated.View>
          </View>

          {/* Google Button - Bottom */}
          <Animated.View style={[styles.bottomSection, animatedButtonStyle]}>
            <Button
              mode="outlined"
              onPress={handleGoogleLogin}
              disabled={isAnyLoading}
              loading={isGoogleLoading}
              icon="google"
              contentStyle={styles.buttonContent}
              style={[styles.googleButton, { borderColor: theme.colors.primary }]}
              labelStyle={[styles.buttonLabel, { color: theme.colors.primary }]}
            >
              {isGoogleLoading ? 'Iniciando sesión...' : 'Continuar con Google'}
            </Button>
            
            {isAnyLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text variant="bodySmall" style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
                  Conectando con Google...
                </Text>
              </View>
            )}
          </Animated.View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  
  // Brand Section (Top)
  brandSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoSurface: {
    borderRadius: 50,
    marginBottom: 24,
    padding: 8,
  },
  logoAvatar: {
    marginBottom: 0,
  },
  appName: {
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  appSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },

  // Center Section
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSurface: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Bottom Section
  bottomSection: {
    marginBottom: 40,
    gap: 16,
  },
  googleButton: {
    borderRadius: 28,
    borderWidth: 2,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    opacity: 0.7,
  },
});