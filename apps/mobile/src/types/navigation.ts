import { User } from './auth';

export type RootStackParamList = {
  Login: undefined;
  Profile: { user: User };
};