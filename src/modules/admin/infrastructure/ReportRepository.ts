import api from '@/shared/infrastructure/api';
import type { DashboardAnalyticsResponse, IndicadoresCalidadContract, ReporteGeneralContract, ReportePorPlanContract } from '../domain/Analytics';

export type TipoReporteSaaS = 'general' | 'por-plan' | 'seguridad' | 'eficiencia' | 'pacientes';

export interface CambiarPlanSaaSParams {
  tipo_plan: string;
  dias_vigencia: number;
  token_pasarela: string;
}

export interface CambiarPlanSaaSResponse {
  status: string;
  message: string;
}

export interface SubscriptionAuditLogDTO {
  AuditID: number;
  EventName: string;
  UsuarioID: number | null;
  EntidadID: number | null;
  Payload: string;
  IpAddress: string | null;
  UserAgent: string | null;
  CreatedAt: string;
}

export class ReportRepository {
  async obtenerMatrizAnalitica(): Promise<DashboardAnalyticsResponse> {
    const response = await api.get<{ status: string; data: DashboardAnalyticsResponse }>('admin/reports/analytics');
    return response.data.data;
  }

  async cambiarPlanSaaS(datos: CambiarPlanSaaSParams): Promise<CambiarPlanSaaSResponse> {
    const response = await api.post<CambiarPlanSaaSResponse>('/saas/actualizar-plan', datos);
    return response.data;
  }

  async obtenerIndicadoresCalidad(): Promise<IndicadoresCalidadContract> {
    const response = await api.get<{ status: string; data: IndicadoresCalidadContract }>('admin/indicadores-calidad');
    return response.data.data;
  }

  async actualizarEstadoUsuario(id: number, nuevoEstado: number): Promise<void> {
    await api.put<void>(`admin/usuarios/${id}/estado`, { estado: nuevoEstado });
  }

  async obtenerReporteSaaS(tipo: TipoReporteSaaS): Promise<ReporteGeneralContract[] | ReportePorPlanContract[] | Record<string, unknown>[]> {
    const response = await api.get<ReporteGeneralContract[] | ReportePorPlanContract[] | Record<string, unknown>[]>(`admin/reportes/exportar?tipo=${tipo}`);
    return response.data;
  }

  /**
   * Obtiene la bitácora auditada de los eventos de suscripción registrados.
   */
  async obtenerBitacoraSuscripciones(): Promise<SubscriptionAuditLogDTO[]> {
    const response = await api.get<{ status: string; datos: SubscriptionAuditLogDTO[] }>('admin/saas/audit-logs');
    return response.data.datos || [];
  }
}
