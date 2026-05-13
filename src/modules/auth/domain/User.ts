export interface User {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
}

export interface AuthState {
  user: User | null;
  token: string | null; 
  isAuthenticated: boolean;
  loading: boolean;
}
