import AsyncStorage from '@react-native-async-storage/async-storage';

export const setToken = async (token: string) => {
  await AsyncStorage.setItem('userToken', token);
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem('userToken');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('userToken');
};