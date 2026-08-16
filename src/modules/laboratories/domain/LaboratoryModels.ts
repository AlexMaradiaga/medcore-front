// src/modules/laboratories/domain/LaboratoryModels.ts

export type EstadoOrdenLaboratorio = 'Emitida' | 'Aceptada' | 'Paciente Recibido' | 'Completada';

export interface CatalogoExamen {
  ExamID: number;
  Categoria: string;
  NombreExamen: string;
  CondicionesPaciente?: string | null;
  Estado: number;
  Precio: number;
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

export interface ExamenItemDTO {
  ExamID: number;
  NombreExamen: string;
  Categoria: string;
  Precio?: number;
  Estado?: string; // 'Pendiente' | 'Cancelado' | 'Realizado'
}

export interface LaboratoryOrderDTO {
  OrdenID: number;
  CodigoOrden?: string;
  Paciente: string;
  PacienteDNI?: string;
  PacienteTelefono?: string;
  Doctor?: string;
  Examen?: string;
  Estado: EstadoOrdenLaboratorio;
  MontoTotal: number;
  ComisionMonto: number;
  ArchivoPdfPath?: string | null;
  FechaOrden?: string;
  FechaCompletado?: string | null;
  NotasClinicas?: string | null;
  examenes?: ExamenItemDTO[];

  LaboratorioID?: number;
  LaboratorioId?: number;
  EntidadID?: number;
  Laboratorio?: string;
  NombreLaboratorio?: string;
}

export interface EntidadLaboratorio {
  EntidadID: number;
  NombreEntidad: string;
  Direccion?: string;
  Telefono?: string;
  TipoEntidad: string;
}

export interface SolicitudDigitalProcesada {
  paciente: string;
  codigoExpediente: string;
  fecha: string;
  items: CatalogoExamen[];
  total: number;
}

export interface CrearSolicitudPayload {
  laboratorio_id: number;
  paciente_id?: number;
  doctor_id?: number;
  consulta_id?: number;
  notas_clinicas?: string;
  nombre_paciente?: string;
  codigo_expediente?: string;
  examenes: number[];
  monto_total: number;
}

export interface RespuestaSolicitudDigital {
  status: string;
  message: string;
  codigo_orden: string;
  orden_id: number;
}
