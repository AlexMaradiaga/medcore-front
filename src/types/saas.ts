export interface SaaSStatusResponse {
  plan_actual: string;
  pacientes_activos: number;
  permitido_nuevo_paciente: boolean;
  advertencia_limite: boolean;
  mensaje: string;
  es_founder: boolean;
  founder_nivel: string | number | null;
  beneficios_founder_globales: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
