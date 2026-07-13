export interface Patient {
  PacienteID?: string;
  UsuarioID?: string;
  DNI: string;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  email?: string;
  Estado?: string;
  password?: string;
  entidad_id?: number;
  es_dependiente?: boolean;
  TutorID?: number;
  parentesco?: string;


  tutor_dni?: string;
  tutor_nombre?: string;
  tutor_telefono?: string;
  tutor_email?: string;
  documento_identidad_url?: string;
}

export interface PatientExtendedProfile {
  id: number;
  nombre: string;
  email: string;
  PacienteID: string;
  UsuarioID: string;
  DNI: string;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  Genero: string;
  Edad: string | number;
  Estado: string;
  Aseguradora: string | null;
  NumeroPoliza: string | null;
  NombreContactoEmergencia: string | null;
  TelefonoContactoEmergencia: string | null;

  
  es_dependiente?: boolean;
  TutorID?: number;
  parentesco?: string;
  tutor_dni?: string;
  tutor_nombre?: string;
  tutor_telefono?: string;
  tutor_email?: string;
  tutor_estado_verificacion?: 'Pendiente' | 'Aprobado' | 'Rechazado';
  tutor_documento_url?: string;
}
