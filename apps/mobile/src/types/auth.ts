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
export interface AuthResponse {
  success: boolean
  data?: {
    user: unknown
    token: string
  }
  error?: string
}

export interface AuthData {
  user: {
    user_id: number;
    username: string;
    email: string;
    google_id?: string;
    profile_picture?: string;
    user_role: string;
    status: string;
    registration_date: string;
  };
  token: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}