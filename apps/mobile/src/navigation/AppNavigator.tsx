import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { User } from '../types/auth';

// Usar archivos de src/screens/ (no src/app/)
import LoginScreen from '../app/auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../app/tabs/ProfileScreen';
import { useAuth } from '../contexts/AuthContext';

// Definir tipos de navegación
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: { user: User };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        {...({ id: "MainStack" } as any)}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
        initialRouteName={isAuthenticated ? 'Home' : 'Login'}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: 'Perfil',
                headerBackVisible: true,
                headerBackTitle: '',
              }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;