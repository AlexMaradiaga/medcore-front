export interface User {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
}

export interface AuthState {
  user: User | null;
  token: string | null; // El token debe estar al mismo nivel que el usuario en el estado
  isAuthenticated: boolean;
  loading: boolean;
}
