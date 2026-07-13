export interface Doctor {
  EntidadID: number;
  FotoPath: unknown;
  DoctorID: number;
  Nombre: string;
  Apellido: string;
  Especialidad: string;
  Telefono: string;
  Email: string;
  Foto?: string;
  Disponible: boolean;
  Estado: string;
  EsVerificado: string;

  EspecialidadID?: number;
  especialidad_id?: number;
}
