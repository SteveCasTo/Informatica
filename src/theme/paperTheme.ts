import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1e88e5',
    secondary: '#03dac6',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#212121',
    outline: '#e0e0e0',
  },
  roundness: 10,
};