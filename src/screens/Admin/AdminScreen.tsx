import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from './AdminScreen.styles';

export const AdminScreen = () => (
  <View style={styles.container}>
    <Text variant="headlineMedium">Administración</Text>
    <Text variant="bodyMedium" style={{ marginTop: 8 }}>
      Configuraciones y gestión del sistema.
    </Text>
  </View>
);