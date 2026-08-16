import api from '@/shared/infrastructure/api';
import type { LaboratoryDashboardData } from '../domain/LaboratoryDashboard';

export class LaboratoryDashboardRepository {
  // async getDashboardMetrics() {
  //   const response = await api.get('/laboratorio/dashboard-metrics');
  //   return response.data;
  // }

  async getDashboardMetrics(laboratorioId: number): Promise<LaboratoryDashboardData> {
    const response = await api.get<{ status: string; data: LaboratoryDashboardData }>('/laboratorio/dashboard-metrics', {
      params: { laboratorio_id: laboratorioId }
    });
    return response.data.data;
  }
}
