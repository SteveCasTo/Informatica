import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from './SubjectsScreen.styles';

export const MateriasScreen = () => (
  <View style={styles.container}>
    <Text variant="headlineMedium">Materias</Text>
    <Text variant="bodyMedium" style={{ marginTop: 8 }}>
      Aquí se mostrarán tus materias asignadas.
    </Text>
  </View>
);