import api from '@/shared/infrastructure/api';
import type { RecetaFarmaciaDTO, EstadoReceta } from '../domain/PharmacyModels';

export class PharmacyRepository {
  async buscarReceta(criterio: string): Promise<RecetaFarmaciaDTO[]> {
    const response = await api.get('/farmacia/recetas/buscar', {
      params: { criterio }
    });
    return response.data.datos || [];
  }

  async cambiarEstado(recetaId: number, nuevoEstado: EstadoReceta, farmaciaId: number): Promise<void> {
    await api.put(`/farmacia/recetas/${recetaId}/estado`, {
      nuevo_estado: nuevoEstado,
      farmacia_id: farmaciaId
    });
  }

  async surtirReceta(recetaId: number, precioTotal: number, farmaciaId: number): Promise<{ comision_medgo: number }> {
    const response = await api.post(`/farmacia/recetas/${recetaId}/surtir`, {
      precio_total: precioTotal,
      farmacia_id: farmaciaId
    });
    return response.data;
  }
}
