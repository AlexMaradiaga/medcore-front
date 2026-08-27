import api from '@/shared/infrastructure/api';
import type {
  RecetaFarmaciaDTO,
  EstadoReceta,
  ScanOrderResultDTO,
  DashboardMetricsResponse
} from '../domain/PharmacyModels';

export class PharmacyRepository {
 async getMetrics(
    farmaciaId: number,
    page: number = 1,
    yaCanjeada: number = 0
  ): Promise<DashboardMetricsResponse> {
    const { data } = await api.get('/farmacia/metrics', {
      params: {
        farmacia_id: farmaciaId,
        page: page,
        ya_canjeada: yaCanjeada
      }
    });

    const responseData = data.datos || data;

    return {
      metricas: {
        inventario_activo: responseData.inventario_activo ?? 0,
        recetas_pendientes: responseData.recetas_pendientes ?? 0,
        alertas_stock: responseData.alertas_stock ?? 0,
        facturacion_diaria: Number(responseData.facturacion_diaria ?? 0)
      },
      pedidos: responseData.pedidos_pendientes || [],
      pagination: responseData.pagination || {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      }
    };
  }

  async scanBarcode(code: string): Promise<ScanOrderResultDTO> {
    const response = await api.post('/farmacia/scan', { code });
    return response.data.datos;
  }

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

  async surtirReceta(recetaId: number, precioTotal: number, farmaciaId: number): Promise<{ comision_medgo: number; monto_facturado: number }> {
    const response = await api.post(`/farmacia/recetas/${recetaId}/surtir`, {
      precio_total: precioTotal,
      farmacia_id: farmaciaId
    });
    return response.data;
  }

  async surtirRecetasLote(recetaIds: number[], precioTotal: number, farmaciaId: number): Promise<{ comision_medgo: number; mensaje: string }> {
    const response = await api.post(`/farmacia/recetas/surtir-lote`, {
      receta_ids: recetaIds,
      precio_total: precioTotal,
      farmacia_id: farmaciaId
    });
    return response.data;
  }
}
