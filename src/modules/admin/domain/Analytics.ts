export interface FunnelMetric {
  estado: string;
  cantidad: number;
}

export interface ProfesionalMetric {
  Profesional: string;
  Inasistencias: number;
  Cancelaciones: number;
  TotalCitas: number;
}

export interface PacienteTipoMetric {
  TipoPaciente: string;
  Total: number;
}

export interface HeatmapMetric {
  DiaSemana: number;
  HoraDia: number;
  TotalCitas: number;
}

export interface EvolucionMetric {
  Anio: number;
  Mes: number;
  TotalCitas: number;
  FacturacionTotal: number;
}

export interface DashboardAnalyticsResponse {
  funnel: FunnelMetric[];
  profesionales: ProfesionalMetric[];
  pacientes: PacienteTipoMetric[];
  heatmap: HeatmapMetric[];
  evolucion: EvolucionMetric[];
}

export interface UsuarioAdminContract {
  UsuarioID: number;
  Email: string;
  RolID: number;
  Estado: number;
  NombreRol: string;
  NombreCompleto: string;
}

export interface DoctorPendienteContract {
  DoctorID: number;
  UsuarioID: number;
  EspecialidadID: number;
  Nombre: string;
  Apellido: string;
  NumeroColegiado: string;
  RutaDocumentoValidacion: string;
}

export interface IndicadoresCalidadContract {
  ErroresMedicos: number;
  TasaComplicaciones: number;
  AbandonoAsesoramiento: number;
  TasaMortalidad: number;
  TasaReadmision: number;
  EnfermedadesIntrahospitalarias: number;
  TiempoEsperaPromedio: number;
  TotalQuejas: number;
  SatisfaccionGeneral: number;
}

export interface ReporteGeneralContract {
    Categoria: string;
    Valor: string;
    [key: string]: string | number;
}

export interface ReportePorPlanContract {
    NombrePlan: string;
    CantidadUsuarios: number;
    IngresoGenerado: number;
    PorcentajeParticipacion: number;
    [key: string]: string | number;
}
