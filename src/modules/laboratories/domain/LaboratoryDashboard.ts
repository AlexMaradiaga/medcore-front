export interface LaboratoryKpis {
  TotalOrdenes: number;
  OrdenesPendientes: number;
  AlertasStock: number; 
  IngresosTotales: number | string;
  DoctoresRemitentes?: number;
}

export interface RecentOrder {
  OrdenID: number;
  CodigoOrden?: string;
  Paciente: string;
  Doctor?: string;
  Examen: string;
  FechaOrden?: string;
  Estado: string;
  EstadoOrden?: string;
}

export interface LaboratoryDashboardData {
  kpis: LaboratoryKpis | null;
  ordenes_recientes: RecentOrder[];
}

export interface LaboratoryDashboardResponse {
  status: string;
  data: LaboratoryDashboardData;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
