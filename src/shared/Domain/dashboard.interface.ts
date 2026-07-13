export interface SessionUser {
  clinica_id?: number | string;
  EntidadID?: number | string;
  name?: string;
  NombreEntidad?: string;
  tipo_entidad?: 'Clinica' | 'Laboratorio' | 'General';
  TipoEntidad?: 'Clinica' | 'Laboratorio' | 'General';
  email?: string;
  rol_id?: number;
  RolID?: number;
}

export interface AuditLog {
  id: number;
  fecha: string;
  aspecto: string;
  detalles: string;
  evaluador: string;
  score: number;
}

export interface Doctor {
  id: number;
  nombre: string;
  especialidad: string;
  registro: string;
}

export interface NewDoctorForm {
  nombre: string;
  especialidad: string;
  registro: string;
}
