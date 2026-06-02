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
  codigo: string;       // Ej: "1B12" o "DA01.1"
  descripcion: string;  // Ej: "Faringitis Aguda"
  sugerido?: boolean;   // Para identificar los destacados de tu captura
}
