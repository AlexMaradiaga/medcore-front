import api from '@/shared/infrastructure/api';

export interface DashboardStats {
  citas_pendientes: string;
  total_pacientes: string;
  total_doctores: string;
}

export class DashboardRepositoryImpl {
  async getStats(): Promise<DashboardStats> {
  const response = await api.get('/reports/dashboard');
  return response.data.data;
}
}
