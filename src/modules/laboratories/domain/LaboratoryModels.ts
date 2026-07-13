export interface CatalogoExamen {
  ExamID: number;
  Categoria: string;
  NombreExamen: string;
  CondicionesPaciente: string;
}

export interface OrdenLaboratorio {
  OrdenID: number;
  FechaOrden: string;
  Estado: string;
  MedicoTratante: string;
  NotasClinicas: string | null;
}

export interface ResultadoLaboratorio {
  NombreExamen: string;
  Categoria: string;
  EstadoExamen: string;
  ValorResultado: string | null;
  RangoReferencia: string | null;
  UnidadMedida: string | null;
  BanderaAlerta: string | null;
  ArchivoPdfPath: string | null;
}
