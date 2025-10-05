import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleSignin } from '../services/firebaseConfig';
import { getAuth, onAuthStateChanged, signInWithCredential, signOut, GoogleAuthProvider, getIdToken } from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { sendFirebaseTokenToBackend } from '../services/api/auth';
import { removeToken } from '../utils/storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface AuthContextProps {
  user: FirebaseAuthTypes.User | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loginWithGoogle: async () => {},
  logout: async () => {},
  token: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      try {
        setUser(usr);
        if (usr) {
          const idToken = await getIdToken(usr);
          const backendData = await sendFirebaseTokenToBackend(idToken);
          setTokenState(backendData.data?.token || null);
        } else {
          setTokenState(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setTokenState(null);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      
      await GoogleSignin.signOut();
      
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error('Google Sign-In failed: idToken not found');
      
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const auth = getAuth();
      await signInWithCredential(auth, googleCredential);
    } catch (error: any) {
      if (error.code === 'SIGN_IN_CANCELLED' || error.code === '-5') {
        console.log('Login cancelled by user');
      } else {
        console.error('Error occurred during login:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      await signOut(auth);
      await removeToken();
      setUser(null);
      setTokenState(null);
    } catch (error) {
      console.error('Error logout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});