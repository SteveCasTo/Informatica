import { setToken } from '../../utils/storage';
import { BACKEND_URL } from '../../utils/constants';
import axios from 'axios';

export const sendFirebaseTokenToBackend = async (firebaseIdToken: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/google`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firebaseIdToken}`
      }
    });

    if (response.data.data?.token) {
      await setToken(response.data.data.token);
    }

    return response.data;
  } catch (error: any) {
    console.error('Error del backend:', error);
    throw new Error(`Backend respondió con error: ${(error?.response?.status) ?? 'Unknown error'}`);
  }
};