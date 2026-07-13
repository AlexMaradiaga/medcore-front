import api from '@/shared/infrastructure/api';
import type { ClinicDashboardData, DoctorClinica, Specialty } from '../../clinic/Domain/Clinic';

export class ClinicRepository {
  async getDashboardData(entidadId: number): Promise<ClinicDashboardData> {
    const response = await api.get('/clinica/dashboard', {
      params: { entidad_id: entidadId }
    });
    return response.data.data;
  }

  async registerDoctor(doctorData: FormData): Promise<void> {
    const response = await api.post('/admin/doctores', doctorData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getDoctoresPorEntidad(entidadId: number): Promise<DoctorClinica[]> {
    const response = await api.get('/admin/doctores/entidad', {
      params: { entidad_id: entidadId }
    });
    return response.data.data;
  }

  async getSpecialties(): Promise<Specialty[]> {
    const response = await api.get('/especialidades');
    return response.data;
  }

  async addSpecialty(nombre: string): Promise<void> {
    const response = await api.post('/especialidades', { nombre });
    return response.data;
  }
}
