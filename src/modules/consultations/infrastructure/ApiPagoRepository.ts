import api from '@/shared/infrastructure/api';
import type { PagoRepository } from '../../consultations/domain/repositories/PagoRepository';
import type { PagoPayload, DetalleFacturaResponse } from '../../consultations/domain/Pago';

export class ApiPagoRepository implements PagoRepository {
  async procesarPago(pago: PagoPayload): Promise<void> {
    await api.post('pagos/procesar', pago);
  }

  async obtenerDetalleFacturacion(citaId: string): Promise<DetalleFacturaResponse> {
    const response = await api.get<DetalleFacturaResponse>(`doctor/consulta/facturacion-detalle?cita_id=${citaId}`);
    return response.data;
  }
}
