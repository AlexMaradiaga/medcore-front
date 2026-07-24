export interface User {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
  entidadId?: number | string;
  tipo_entidad?: string;
  plan?: string;

}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
