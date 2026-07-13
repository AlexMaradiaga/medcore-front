import api from '@/shared/infrastructure/api';
import type { OrdenLaboratorio, ResultadoLaboratorio, CatalogoExamen } from '../domain/LaboratoryModels';

export class LaboratoryRepository {
  async getOrdenesPaciente(pacienteId: number): Promise<OrdenLaboratorio[]> {
    const response = await api.get(`/laboratorio/paciente/${pacienteId}/ordenes`);
    return response.data.datos;
  }

  async getResultadosOrden(ordenId: number): Promise<ResultadoLaboratorio[]> {
    const response = await api.get(`/laboratorio/orden/${ordenId}/resultados`);
    return response.data.datos;
  }

  async getCatalogo(): Promise<CatalogoExamen[]> {
    const response = await api.get('/laboratorio/catalogo');
    return response.data.datos;
  }
}
