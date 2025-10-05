import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { initializeApp, getApps, getApp } from '@react-native-firebase/app';
import { FIREBASE_CONFIG, GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '../utils/constants';

if (getApps().length === 0) {
  initializeApp(FIREBASE_CONFIG);
}

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  offlineAccess: false,
  forceCodeForRefreshToken: true,
});

export const firebaseAuth = getApp();

export { GoogleSignin };