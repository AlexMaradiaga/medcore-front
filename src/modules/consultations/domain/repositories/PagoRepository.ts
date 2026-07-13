import type { PagoPayload, DetalleFacturaResponse } from '../Pago';

export interface PagoRepository {
  procesarPago(pago: PagoPayload): Promise<void>;
  obtenerDetalleFacturacion(citaId: string): Promise<DetalleFacturaResponse>; 
}
