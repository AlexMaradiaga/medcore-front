export interface AppointmentRequest {
  UsuarioID: number;
  doctor_id: number;
  entidad_id: number;
  fecha_hora: string;
  motivo: string;
  sintomas: string;
  alergias?: string;
  edad: number;
  genero: string;
  aseguradora?: string;
  numero_poliza?: string;
  nombre_contacto_emergencia?: string;
  telefono_contacto_emergencia?: string;
  medicamentos_actuales?: string;
}
export interface Appointment {
  CitaID: number;
  FechaHora: string;
  EstadoCita: string;
  Doctor: string;
  Clinica: string;
  Motivo: string;
  Sintomas?: string;
  Alergias: string;
  MedicamentosActuales: string;
}

export interface MedicalRecord {
  CitaID: string;
  FechaHora: string;
  EstadoCita: string;
  Motivo: string;
  Sintomas: string;
  Doctor: string;
  Clinica: string;
  Especialidad?: string;
  Edad: string;
  Genero: string;
  Alergias: string;
  MedicamentosActuales: string;
}

export interface Exam {
  ExamenSistemaID: number;
  CitaID: string;
  ConsultaID: number;
  FechaHora: string;
  Doctor: string;
  SistemaID: string;
  EsNormal: number;
  NotasAdicionales: string | null;
}

export interface Prescription {
  RecetaID: number;
  ConsultaID: number;
  CodigoCanje: string;
  NombreMedicamento: string;
  Dosis: string;
  Indicaciones: string;
  YaCanjeada: number;
  Estado: number;
  FechaEmision: string;
  Doctor?: string;
}

export interface DashboardAppointment {
    id: number;
    nombrePaciente: string;
    fecha: string;
    hora: string;
    motivo: string;
    estado: string;
    genero: string;
    edad: number;
}
