export interface FilaMedicamentoConsulta {
  NombreMedicamento: string;
  Dosis: string;
  Indicaciones: string;
}

export interface SignosVitalesPayload {
  PresionArterial?: string | null;
  FrecuenciaCardiaca?: number | null;
  FrecuenciaRespiratoria?: number | null;
  Temperatura?: number | null;
}

export interface DoctorAppointment {
  CitaID: number;
  ConsultaID?: number;
  PacienteID?: string | number;
  Paciente: string;
  FechaHora: string;
  Motivo: string;
  Sintomas: string;
  EnfermedadesCronicas?: string;
  EstadoCita: string;
  Edad?: number;
  Genero?: string;
  Telefono?: string;
  EmailPaciente?: string;
  Alergias?: string;
  TipoSangre?: string;
  MedicamentosActuales?: string;
  EspecialidadID?: number;
}

export interface DoctorStats {
  citas_hoy: number;
  atendidos: number;
  pendientes: number;
}

export interface SignosVitales {
  presion: string;
  pulso: string;
  temp: string;
  respiracion: string;
}

export interface HallazgosSistema {
  [sistemaId: string]: Record<string, boolean>;
}

export interface DentalExamData {
  encias: 'Normal' | 'Inflamadas' | 'Sangrantes';
  condiciones: {
    placa: boolean;
    calculo: boolean;
    sensibilidad: boolean;
    movilidad: boolean;
  };
  oclusion: 'Normal' | 'Alterada';
  notas: string;
}

export interface OdontologyPayload {
  totalPresupuesto: number;
  odontograma: Record<number, Record<string, string>>;
  examenesBase: DentalExamData;
}

export interface ConsultationPayload {
  cita_id: number;
  diagnostico: string;
  notas_medicas?: string;
  detalle_medicamentos: FilaMedicamentoConsulta[];
  signos_vitales: SignosVitalesPayload;
  examen_fisico_opciones: HallazgosSistema;
  examen_fisico_notas: Record<string, string>;
  presupuesto_total?: number;
  odontograma_json?: Record<number, Record<string, string>>;
  examenes_odontologicos_json?: DentalExamData | DentalExamData[] | Record<string, unknown>;
  crear_seguimiento?: boolean;
  seguimiento_fecha_hora?: string | null;
}

export interface DiagnosticoCIE11 {
  codigo: string;
  descripcion: string;
  sugerido?: boolean;
}

export interface HallazgoCatalogo {
  HallazgoID: number;
  NombreHallazgo: string;
}

export interface SistemaCatalogo {
  SistemaID: number;
  NombreSistema: string;
  Hallazgos: HallazgoCatalogo[];
}

export interface SistemaExamenUI {
  id: string;
  nombre: string;
  open: boolean;
  isNormal: boolean;
  opciones: string[];
}
