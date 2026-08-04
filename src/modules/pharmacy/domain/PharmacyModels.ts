export type EstadoReceta = 'Emitida' | 'Recibida por Farmacia' | 'Reservada' | 'Surtida';

export interface RecetaFarmaciaDTO {
  RecetaID: number;
  CodigoCanje: string;
  NombreMedicamento: string;
  Dosis: string;
  Indicaciones: string;
  EstadoReceta: EstadoReceta;
  YaCanjeada: number;
  FechaEmision: string;
  PrecioTotal: number;
  Paciente: string;
  PacienteDNI: string;
  PacienteTelefono: string;
  MedicoTratante: string;
  DoctorID: number;
}
