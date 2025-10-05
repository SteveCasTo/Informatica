import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BottomTabs } from './src/navigation/BottomTabs';
import  LoginScreen from './src/screens/LoginScreen';
import { paperTheme } from './src/theme/paperTheme';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { token } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabs}
          options={{ animationTypeForReplace: token ? 'push' : 'pop' }}
        />
      ) : (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
        />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}