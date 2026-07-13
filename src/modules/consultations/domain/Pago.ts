export interface PagoPayload {
  cita_id: number;
  servicio_id: number;
  monto: number;
  metodo: 'cash' | 'card' | 'transfer';
  referencia: string;
}

export interface DetalleFacturaResponse {
  ConsultaID: number;
  CitaID: number;
  NombrePaciente: string;
  NombreMedico: string;
  PrecioActual: number;
  ServicioID: number;
  CellularPaciente?: string;
  CelularPaciente?: string;
}
