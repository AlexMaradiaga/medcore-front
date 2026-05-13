import api from '@/shared/infrastructure/api';

export interface DashboardStats {
  citas_pendientes: string; 
  total_pacientes: string;
  total_doctores: string;
}

export class DashboardRepositoryImpl {
  async getStats(): Promise<DashboardStats> {
  const response = await api.get('/reports/dashboard'); // <--- Debe coincidir con Laravel
  console.log("Datos recibidos:", response.data); // <--- AGREGA ESTO para debuggear
  return response.data.data;
}
}
