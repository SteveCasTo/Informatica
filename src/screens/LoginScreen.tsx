import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'react-native-linear-gradient';
import {
  styles,
  fadeAnim,
  slideAnim,
  scaleAnim,
  pulseAnim,
  float1,
  float2,
  float3,
} from './LoginScreen.styles';

export default function LoginScreen() {
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(float1, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(float2, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float3, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(float3, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    await loginWithGoogle();
  };

  const float1Y = float1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const float2Y = float2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  const float3Y = float3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle1,
          {
            transform: [{ translateY: float1Y }, { scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle2,
          {
            transform: [{ translateY: float2Y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle3,
          {
            transform: [{ translateY: float3Y }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>💻</Text>
          </View>
        </Animated.View>

        {/* Título */}
        <Text style={styles.title}>Informática</Text>
        <Text style={styles.subtitle}>Tu plataforma educativa</Text>

        {/* Características */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureText}>Aprende a tu ritmo</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🚀</Text>
            <Text style={styles.featureText}>Contenido actualizado</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Ejercicios prácticos</Text>
          </View>
        </View>

        {/* Botón de Google */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleLogin}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.googleButtonGradient}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          Al continuar, aceptas nuestros términos y condiciones
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}