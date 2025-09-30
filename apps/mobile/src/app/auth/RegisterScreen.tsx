import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { isLoading, loginWithGoogle } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'El correo electrónico es requerido');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (!password) {
      Alert.alert('Error', 'La contraseña es requerida');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleEmailRegister = async () => {
    if (!validateForm()) return;

    setIsEmailLoading(true);
    try {
      // Por ahora, como no tienes registro por email, mostrar mensaje
      Alert.alert(
        'Información', 
        'El registro por email estará disponible próximamente. Por favor usa Google para registrarte.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error durante el registro');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsGoogleLoading(true);
      
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('✅ Registro con Google exitoso');
      } else {
        Alert.alert('Error', result.error || 'Error durante el registro con Google');
      }
      
    } catch (error: any) {
      console.error('❌ Error en registro con Google:', error);
      
      let errorMessage = 'Error durante el registro con Google';
      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.goBack(); // Regresar al login
  };

  const isFormValid = () => {
    const { name, email, password, confirmPassword } = formData;
    return name.trim() && email.trim() && password && confirmPassword;
  };

  const isAnyLoading = isLoading || isEmailLoading || isGoogleLoading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Únete a nuestra comunidad</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={[styles.inputContainer, isAnyLoading && styles.inputDisabled]}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isAnyLoading}
                placeholderTextColor="#999"
              />
            </View>

            {/* Email Input */}
            <View style={[styles.inputContainer, isAnyLoading && styles.inputDisabled]}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isAnyLoading}
                placeholderTextColor="#999"
              />
            </View>

            {/* Password Input */}
            <View style={[styles.inputContainer, isAnyLoading && styles.inputDisabled]}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Contraseña (mín. 8 caracteres)"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isAnyLoading}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
                disabled={isAnyLoading}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={[styles.inputContainer, isAnyLoading && styles.inputDisabled]}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isAnyLoading}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.passwordToggle}
                disabled={isAnyLoading}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton, 
                (!isFormValid() || isAnyLoading) && styles.registerButtonDisabled
              ]}
              onPress={handleEmailRegister}
              disabled={!isFormValid() || isAnyLoading}
            >
              {isEmailLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O regístrate con</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Register */}
            <TouchableOpacity
              style={[styles.googleButton, isAnyLoading && styles.googleButtonDisabled]}
              onPress={handleGoogleRegister}
              disabled={isAnyLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#4285F4" size="small" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#4285F4" style={styles.googleIcon} />
                  <Text style={styles.googleButton}>Continuar con Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity
              onPress={navigateToLogin}
              disabled={isAnyLoading}
            >
              <Text style={[styles.footerLink, isAnyLoading && styles.footerLinkDisabled]}>
                Inicia Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 40,
    fontSize: 16,
    color: '#333',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    top: 14,
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButtonDisabled: {
    backgroundColor: '#007bff',
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#666',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    marginRight: 8,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  footerLinkDisabled: {
    opacity: 0.6,
  },
  inputDisabled: {
    opacity: 0.6,
  },
});