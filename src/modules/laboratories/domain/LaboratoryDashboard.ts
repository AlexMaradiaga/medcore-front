export interface LaboratoryKpis {
  TotalOrdenes: number;
  OrdenesPendientes: number;
  DoctoresRemitentes: number;
  IngresosTotales: number;
}

export interface RecentOrder {
  OrdenID: number;
  Paciente: string;
  Doctor: string;
  FechaOrden: string;
  EstadoOrden: string;
}

export interface LaboratoryDashboardData {
  kpis: LaboratoryKpis;
  ordenes_recientes: RecentOrder[];
}

export interface LaboratoryDashboardResponse {
  status: string;
  data: LaboratoryDashboardData;
}
