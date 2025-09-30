import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Avatar, Button, Divider, List } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

const ProfileScreen: React.FC<Props> = ({ route }) => {
  const { user } = route.params;
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Card de perfil */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          {user.profile_picture ? (
            <Avatar.Image 
              size={100} 
              source={{ uri: user.profile_picture }} 
              style={styles.avatar}
            />
          ) : (
            <Avatar.Icon 
              size={100} 
              icon="account" 
              style={styles.avatar}
            />
          )}
          
          <Text variant="headlineSmall" style={styles.name}>
            {user.username}
          </Text>
          <Text variant="bodyLarge" style={styles.email}>
            {user.email}
          </Text>
          {user.email.includes('@fcyt.umss.edu.bo') && (
            <Text variant="bodyMedium" style={styles.university}>
              Universidad Mayor de San Simón
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Card de información */}
      <Card style={styles.infoCard}>
        <Card.Title title="Información del Usuario" />
        <Card.Content>
          <List.Item
            title="ID de Google"
            description={user.google_id || 'No disponible'}
            left={(props) => <List.Icon {...props} icon="google" />}
          />
          <Divider />
          
          <List.Item
            title="Rol"
            description={user.user_role === 'student' ? 'Estudiante' : 'Administrador'}
            left={(props) => <List.Icon {...props} icon="account-group" />}
          />
          <Divider />
          
          <List.Item
            title="Estado"
            description={user.status === 'active' ? 'Activo' : user.status}
            left={(props) => <List.Icon {...props} icon="check-circle" />}
          />
          <Divider />
          
          <List.Item
            title="Fecha de Registro"
            description={new Date(user.registration_date).toLocaleDateString('es-ES')}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
        </Card.Content>
      </Card>

      {/* Botón de cerrar sesión */}
      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
        icon="logout"
        textColor="#d32f2f"
      >
        Cerrar Sesión
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#666',
    marginBottom: 4,
  },
  university: {
    color: '#1976d2',
    fontStyle: 'italic',
  },
  infoCard: {
    margin: 16,
    elevation: 4,
  },
  signOutButton: {
    margin: 16,
    borderColor: '#d32f2f',
  },
});

export default ProfileScreen;