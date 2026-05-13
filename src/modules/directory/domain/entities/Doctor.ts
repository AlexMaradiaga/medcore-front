export interface Doctor {
  DoctorID: number;
  Nombre: string;
  Apellido: string;
  Especialidad: string;
  Telefono: string;
  Email: string;
  Foto?: string;
  Disponible: boolean;
  Estado: string;
  EsVerificado: string
}
