import Constants from 'expo-constants';
import * as Application from 'expo-application';
import { AUTH_URL } from '../utils/constants/constants';

export const isExpoGo = Constants.executionEnvironment === 'storeClient';
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

export const shouldUseNativeAuth = (): boolean => {
  return !isExpoGo && (isProduction || Application.nativeApplicationVersion !== null);
};

export const getEnvironmentInfo = () => ({
  isExpoGo,
  isDevelopment,
  isProduction,
  shouldUseNative: shouldUseNativeAuth(),
  executionEnvironment: Constants.executionEnvironment,
  appVersion: Application.nativeApplicationVersion
});

export const environment = {
  apiUrl: AUTH_URL,
};