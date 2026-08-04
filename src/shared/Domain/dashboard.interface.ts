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
  es_founder?: boolean;
  nivel_founder?: number;
  fecha_founder?: string;
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
