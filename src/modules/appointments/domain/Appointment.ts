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
  ConsultaID: number;
  FechaHora: string;
  Doctor: string;
  Clinica: string;
  Especialidad: string;
  Diagnostico: string;
  NotasMedicas?: string;
}

export interface Exam {
  ExamenID: number;
  Titulo: string;
  Fecha: string;
  ArchivoUrl: string;
  Doctor: string;
}

export interface Prescription {
  RecetaID: number;
  Fecha: string;
  Doctor: string;
  DetalleMedicamentos: string;
  YaCanjeada: number;
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
