import api from '@/shared/infrastructure/api';

export class LaboratoryDashboardRepository {
  async getDashboardMetrics() {
    const response = await api.get('/laboratorio/dashboard-metrics');
    return response.data;
  }
}
