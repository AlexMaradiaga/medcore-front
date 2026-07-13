import api from '@/shared/infrastructure/api';
import type { DashboardAnalyticsResponse, IndicadoresCalidadContract, ReporteGeneralContract, ReportePorPlanContract } from '../domain/Analytics';
export type TipoReporteSaaS = 'general' | 'por-plan' | 'seguridad' | 'eficiencia' | 'pacientes';
export class ReportRepository {
  async obtenerMatrizAnalitica(): Promise<DashboardAnalyticsResponse> {
    const response = await api.get<{ status: string; data: DashboardAnalyticsResponse }>('admin/reports/analytics');
    return response.data.data;
  }

  async cambiarPlanSaaS(payload: { tipo_plan: string; dias_vigencia: number; token_pasarela: string }) {
    return await api.post('admin/saas/actualizar-plan', payload);
  }

  async obtenerIndicadoresCalidad(): Promise<IndicadoresCalidadContract> {
    const response = await api.get('admin/indicadores-calidad');
    return response.data.data;
  }

  async actualizarEstadoUsuario(id: number, nuevoEstado: number): Promise<void> {
    await api.put(`admin/usuarios/${id}/estado`, { estado: nuevoEstado });
  }

  async obtenerReporteSaaS(tipo: TipoReporteSaaS): Promise<ReporteGeneralContract[] | ReportePorPlanContract[] | Record<string, unknown>[]> {
        const response = await api.get(`admin/reportes/exportar?tipo=${tipo}`);
        return response.data as ReporteGeneralContract[] | ReportePorPlanContract[] | Record<string, unknown>[];
    }
}
