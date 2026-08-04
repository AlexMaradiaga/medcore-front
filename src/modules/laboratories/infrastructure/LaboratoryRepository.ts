import api from '@/shared/infrastructure/api';
import type {
  OrdenLaboratorio,
  ResultadoLaboratorio,
  CatalogoExamen,
  LaboratoryOrderDTO
} from '../domain/LaboratoryModels';

export class LaboratoryRepository {
  /**
   * Obtiene el historial de órdenes pertenecientes a un paciente.
   */
  async getOrdenesPaciente(pacienteId: number): Promise<OrdenLaboratorio[]> {
    const response = await api.get(`/laboratorio/paciente/${pacienteId}/ordenes`);
    return response.data.datos || [];
  }

  /**
   * Obtiene los resultados de exámenes de una orden específica.
   */
  async getResultadosOrden(ordenId: number): Promise<ResultadoLaboratorio[]> {
    const response = await api.get(`/laboratorio/orden/${ordenId}/resultados`);
    return response.data.datos || [];
  }

  /**
   * Carga el catálogo global de exámenes analíticos disponibles.
   */
  async getCatalogo(): Promise<CatalogoExamen[]> {
    const response = await api.get('/laboratorio/catalogo');
    return response.data.datos || [];
  }

  /**
   * Obtiene las órdenes operativas del laboratorio con filtro opcional por estado.
   */
  async getOrdenes(laboratorioId: number, estado?: string): Promise<LaboratoryOrderDTO[]> {
    const response = await api.get('/laboratorio/ordenes', {
      params: { laboratorio_id: laboratorioId, estado }
    });
    return response.data.datos || [];
  }

  /**
   * Transición 1: Cambia el estado de una orden a 'Aceptada'.
   */
  async aceptarOrden(ordenId: number): Promise<void> {
    await api.put(`/laboratorio/ordenes/${ordenId}/aceptar`);
  }

  /**
   * Transición 2: Valida el código QR y actualiza a 'Paciente Recibido'.
   */
  async validarCodigoQR(codigoOrden: string, laboratorioId: number): Promise<LaboratoryOrderDTO> {
    const response = await api.post('/laboratorio/ordenes/escanear-qr', {
      codigo_orden: codigoOrden,
      laboratorio_id: laboratorioId
    });
    return response.data.orden as LaboratoryOrderDTO;
  }

  /**
   * Transición 3: Carga el informe final en PDF, marca como 'Completada' y calcula la comisión.
   */
  async subirResultadosPDF(ordenId: number, archivoPdf: File): Promise<{ comision_generada: number }> {
    const formData = new FormData();
    formData.append('archivo_pdf', archivoPdf);

    const response = await api.post(`/laboratorio/ordenes/${ordenId}/subir-resultados`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data as { comision_generada: number };
  }
}
