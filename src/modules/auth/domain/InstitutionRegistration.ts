export interface InstitutionRegistrationPayload {
  // Paso 1: Cuenta Institucional
  email_usuario: string;
  password_usuario: string;
  telefono_principal: string;

  // Paso 2: Información General
  nombre_comercial: string;
  razon_social: string;
  rtn: string;
  numero_constitucion?: string;
  fecha_constitucion?: string;
  tipo_entidad: 'Clinica' | 'Farmacia' | 'Laboratorio';
  sitio_web?: string;
  email_institucional: string;
  telefono_institucional: string;
  whatsapp_institucional?: string;

  // Paso 3: Representante Legal
  rep_nombre: string;
  rep_dni: string;
  rep_email: string;
  rep_telefono: string;
  rep_cargo: string;
  rep_foto_dni?: File | null;

  // Paso 4: Responsable Sanitario
  san_nombre: string;
  san_profesion: string;
  san_colegiacion: string;
  san_colegio: string;
  san_email: string;
  san_telefono: string;
  san_doc_colegiacion?: File | null;

  // Paso 5: Ubicación
  nombre_sucursal?: string;
  direccion_completa: string;
  departamento: string;
  municipio: string;
  zona?: string;
  latitud?: number;
  longitud?: number;
}

// 👈 Contrato de repositorio agregado en el mismo archivo
export interface InstitutionRepository {
  registerInstitution(
    payload: InstitutionRegistrationPayload
  ): Promise<{ status: string; message: string; entidad_id?: number }>;
}
