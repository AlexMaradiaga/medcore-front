export type EstadoOrdenLaboratorio = 'Emitida' | 'Aceptada' | 'Paciente Recibido' | 'Completada';

export interface CatalogoExamen {
  ExamID: number;
  Categoria: string;
  NombreExamen: string;
  CondicionesPaciente?: string | null;
  Precio?: number;
}

export interface OrdenLaboratorio {
  OrdenID: number;
  FechaOrden: string;
  Estado: string;
  MedicoTratante: string;
  NotasClinicas: string | null;
}

export interface ResultadoLaboratorio {
  NombreExamen: string;
  Categoria: string;
  EstadoExamen: string;
  ValorResultado: string | null;
  RangoReferencia: string | null;
  UnidadMedida: string | null;
  BanderaAlerta: string | null;
  ArchivoPdfPath: string | null;
}

export interface LaboratoryOrderDTO {
  OrdenID: number;
  CodigoOrden?: string;
  Paciente: string;
  PacienteDNI?: string;
  PacienteTelefono?: string;
  Doctor?: string;
  Estado: EstadoOrdenLaboratorio;
  MontoTotal: number;
  ComisionMonto: number;
  ArchivoPdfPath?: string | null;
  FechaOrden?: string;
  FechaCompletado?: string | null;
}
