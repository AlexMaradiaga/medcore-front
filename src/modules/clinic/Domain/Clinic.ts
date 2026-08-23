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
  Descripcion?: string;
  doctorCount?: number;
}

export interface DoctorClinica {
  UsuarioID: number;
  NombreCompleto: string;
  Nombre?: string;
  Apellido?: string;
  Email?: string;
  Telefono?: string;
  DNI?: string;
  EspecialidadID: number;
  Especialidad: string;
  NumeroColegiado: string;
  Consultorio: string;
  DiasAtencion: string[];
  Estado: 1 | 0; // 1 = Activo, 0 = Inactivo / En Permiso
  FotoUrl?: string;
  Tarifas: {
    consultaGeneral: number;
    primeraVez: number;
    controlReevaluacion: number;
    emergencia: number;
  };
  ExperienciaAnios?: number;
  Calificacion?: number;
  CitasAtendidas?: number;
  Biografia?: string;
}

export interface DoctorRegistrationForm {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  password?: string;
  numero_colegiado: string;
  especialidad_id: number | null;
  consultorio: string;
  dias_atencion: string[];
  tarifa_consulta: number;
  entidad_id?: number;
}

export interface UserCreateForm {
  username: string;
  email: string;
  nombreCompleto: string;
  role: 'doctor' | 'admin' | 'receptionist' | 'nurse';
  password: string;
  confirm_password: string;
  staffId?: number | null;
  avatarUrl?: string;
}

export interface Appointment {
  id: number;
  paciente: string;
  pacienteDni: string;
  doctor: string;
  doctorId: number;
  especialidad: string;
  fechaHora: string;
  estado: 'Confirmada' | 'Pendiente' | 'Completada' | 'Cancelada';
  motivo: string;
  monto: number;
}
