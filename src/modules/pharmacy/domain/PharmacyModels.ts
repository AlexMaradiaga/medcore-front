export type EstadoReceta = 'Emitida' | 'Recibida por Farmacia' | 'Reservada' | 'Surtida';

export interface RecetaFarmaciaDTO {
  RecetaID: number;
  ConsultaID: number; // <-- AGREGADO
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

export interface ConsultaAgrupadaDTO {
  ConsultaID: number;
  CodigoCanje: string;
  Paciente: string;
  PacienteDNI: string;
  MedicoTratante?: string;
  FechaEmision: string;
  Medicamentos: RecetaFarmaciaDTO[];
}

export interface PharmacyMetricsDTO {
  inventario_activo: number;
  recetas_pendientes: number;
  alertas_stock: number;
  facturacion_diaria: number;
}

export interface PaginationDTO {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DashboardMetricsResponse {
  metricas: PharmacyMetricsDTO;
  pedidos: RecetaFarmaciaDTO[];
  pagination: PaginationDTO;
}

export interface ScanOrderResultDTO {
  id: string;
  patient: string;
  status: string;
  medications: string[];
  barcode?: string;
}
