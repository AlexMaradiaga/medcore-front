export interface DoctorAppointment {
    CitaID: number;
    ConsultaID?: number;
    PacienteID?: string | number;
    Paciente: string;
    FechaHora: string;
    Motivo: string;
    Sintomas: string;
    EstadoCita: string;
    Edad?: number;
    Genero?: string;
    Telefono?: string;
    EmailPaciente?: string;
    Alergias?: string;
    MedicamentosActuales?: string;
    EspecialidadID?: number;
}

export interface DoctorStats {
    citas_hoy: number;
    atendidos: number;
    pendientes: number;
}
interface SignosVitales {
  presion: string;
  pulso: string;
  temp: string;
  respiracion: string;
}

interface HallazgosSistema {
  [sistemaId: string]: Record<string, boolean>;
}
export interface ConsultationPayload {
    cita_id: number;
    diagnostico: string;
    notas_medicas?: string;
    detalle_medicamentos: string;
    signos_vitales: SignosVitales;
    examen_fisico_opciones: HallazgosSistema;
    examen_fisico_notas: Record<string, string>;
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
