export interface DashboardKPIs {
  TotalCitas: number;
  CitasPendientes: number;
  TotalDoctoresActivos: number;
  IngresosTotales: number;
}

export interface CitaReciente {
  CitaID: number;
  FechaHora: string;
  EstadoCita: string;
  Paciente: string;
  Doctor: string;
  Motivo: string | null;
}

export interface ClinicDashboardData {
  kpis: DashboardKPIs | null;
  citas_recientes: CitaReciente[];
}

export interface Specialty {
  EspecialidadID: number;
  NombreEspecialidad: string;
}

export interface DoctorRegistrationForm {
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  numero_colegiado: string;
  especialidad_id: number | null;
  entidad_id: number;
}
export interface DoctorClinica {
  UsuarioID: number;
  NombreCompleto: string;
  Especialidad?: string;
  NumeroColegiado?: string;
  Estado: number;
  EntidadID?: number | string;
}
