import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { BACKEND_URL } from '../../utils/constants';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen = () => {
  const { logout, token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" color="#6750A4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyMedium" style={{ marginBottom: 16, color: 'red' }}>
          {error}
        </Text>
        <Button mode="contained" onPress={fetchProfile} style={{ backgroundColor: '#6750A4' }}>
          Reintentar
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Image size={100} source={{ uri: profile?.profile_picture }} />
          <Text variant="titleLarge" style={styles.username}>
            {profile?.username}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {profile?.email}
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.logoutButton}
        onPress={logout}
        icon="logout"
        contentStyle={{ paddingVertical: 8 }}
      >
        Cerrar sesión
      </Button>
    </ScrollView>
  );
};