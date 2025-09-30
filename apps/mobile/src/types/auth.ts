export interface User {
  user_id: number;
  google_id: string | null;
  email: string;
  username: string;
  password_hash: string;
  user_role: 'student' | 'administrator';
  profile_picture: string | null;
  status: 'active' | 'suspended' | 'deleted';
  registration_date: string;
  active: boolean;
}

export interface GoogleSignInResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface AuthResult {
  token: string;
  user: User;
}