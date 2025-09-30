// Importar el User del AuthContext (no del types/auth)
import { User } from '../contexts/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: { user: User };
};