export interface OdontogramaPieza {
  numero: number;
  estado: 'Sano' | 'Caries' | 'Amalgama' | 'Extraccion' | 'Corona';
  notas?: string;
}

export interface ExamenOdontologico {
  nombreExamen: string;
  requerido: boolean;
  observaciones: string;
}

export interface TratamientoPresupuesto {
  procedimiento: string;
  costoUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface ConsultaOdontologia {
  consultaId: number;
  odontogramaAdulto: OdontogramaPieza[];
  odontogramaPediatrico: OdontogramaPieza[];
  examenes: ExamenOdontologico[];
  tratamientos: TratamientoPresupuesto[];
  presupuestoTotal: number;
  consentimientoFirmado: boolean;
}

export interface ArchivoClinico {
  archivoId?: number;
  consultaId: number;
  tipoArchivo: 'Radiografia' | 'FotografiaClinica' | 'ConsentimientoPDF';
  archivoFisico: File | null;
  rutaArchivo?: string;
  notas: string;
}
