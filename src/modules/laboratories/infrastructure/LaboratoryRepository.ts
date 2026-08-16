// src/modules/laboratories/infrastructure/LaboratoryRepository.ts
import api from '@/shared/infrastructure/api';
import type {
  OrdenLaboratorio,
  ResultadoLaboratorio,
  CatalogoExamen,
  LaboratoryOrderDTO,
  EntidadLaboratorio,
  CrearSolicitudPayload,
  RespuestaSolicitudDigital,
  ExamenItemDTO
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
    const response = await api.get<{ datos: CatalogoExamen[] }>('/laboratorio/catalogo');
    return response.data.datos || [];
  }

  /**
   * Actualiza la tarifa de un examen.
   */
  async actualizarPrecioExamen(examId: number, precio: number, laboratorioId: number): Promise<void> {
    await api.put(`/laboratorio/tarifario/${examId}`, {
      precio,
      laboratorio_id: laboratorioId
    });
  }

  /**
   * Obtiene las órdenes operativas del laboratorio con filtro opcional por estado.
   */
  async getOrdenes(laboratorioId: number, estado?: string): Promise<LaboratoryOrderDTO[]> {
    const response = await api.get('/laboratorio/ordenes', {
      params: { laboratorio_id: laboratorioId, estado }
    });
    return response.data.datos || response.data || [];
  }

  /**
   * Obtiene el detalle de exámenes/pruebas asociadas a una orden.
   */
  async getDetalleExamenesOrden(ordenId: number): Promise<ExamenItemDTO[]> {
    const response = await api.get(`/laboratorio/ordenes/${ordenId}/examenes`);
    return response.data.datos || response.data || [];
  }

  /**
   * Transición 1: Cambia el estado de una orden a 'Aceptada'.
   */
  async aceptarOrden(ordenId: number): Promise<void> {
    await api.put(`/laboratorio/ordenes/${ordenId}/aceptar`);
  }

  /**
   * Transición 2: Valida el código QR y actualiza estado a 'Paciente Recibido'.
   */
  async validarCodigoQR(codigoOrden: string, laboratorioId: number): Promise<LaboratoryOrderDTO> {
    const response = await api.post<{ orden: LaboratoryOrderDTO }>('/laboratorio/ordenes/escanear-qr', {
      codigo_orden: codigoOrden,
      laboratorio_id: laboratorioId
    });
    return response.data.orden;
  }

  /**
   * Transición 3: Carga el informe final en PDF, marca como 'Completada' y calcula la comisión.
   */
  async subirResultadosPDF(ordenId: number, archivoPdf: File): Promise<{ comision_generada: number }> {
    const formData = new FormData();
    formData.append('archivo_pdf', archivoPdf);
    const response = await api.post<{ comision_generada: number }>(
      `/laboratorio/ordenes/${ordenId}/subir-resultados`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Obtiene las entidades de laboratorios públicos habilitados.
   */
  async getEntidadesPublicas(): Promise<EntidadLaboratorio[]> {
    const response = await api.get<EntidadLaboratorio[]>('/entidades');
    return response.data || [];
  }

  /**
   * Genera una solicitud digital de laboratorio.
   */
  async crearSolicitudDigital(payload: CrearSolicitudPayload): Promise<RespuestaSolicitudDigital> {
    const response = await api.post<RespuestaSolicitudDigital>('/laboratorio/ordenes', payload);
    return response.data;
  }

  /**
   * Actualiza la selección de exámenes de una orden y recalcula el monto.
   */
  async actualizarExamenesOrden(ordenId: number, examenesIds: number[]): Promise<{ status: string; monto_total: number }> {
    const response = await api.put<{ status: string; monto_total: number }>(
      `/laboratorio/ordenes/${ordenId}/actualizar-examenes`,
      { examenes_ids: examenesIds }
    );
    return response.data;
  }
}
