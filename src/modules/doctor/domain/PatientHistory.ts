export interface ConsultaPrevia {
    id: number;
    fecha: string;
    medico: string;
    especialidad: string;
    diagnostico: string;
    tratamiento: string;
}

export interface ExamenLaboratorio {
    estudio: string;
    fecha: string;
    url_pdf?: string;
}

export interface SignoVitalHistorico {
    periodo: string;
    presion: string;
    pulso: number;
    temperatura: number;
    saturacion: number;
}

export interface PatientHistoryResponse {
    estado: string;
    autorizacionGlobal: boolean;
    datos: {
        consultas: ConsultaPrevia[];
        examenes: ExamenLaboratorio[];
        comparativos: SignoVitalHistorico[];
    };
}

export interface PacienteBasal {
    nombre: string;
    Edad: number;
    Genero: string;
    sangre: string;
    alergias: string;
    cronico: string;
    seguro: string;
    poliza: string | null;
}

export interface HistorialClinicoData {
    paciente: PacienteBasal | null;
    consultas: ConsultaPrevia[];
    examenes: ExamenLaboratorio[];
    comparativos: SignoVitalHistorico[];
}

export interface DetalleConsultaModal {
    consultaID: number;
    citaID: number;
    diagnostico: string;
    notasEvolucionSubjetiva: string;
    estado: string;
    examenFisico: {
        examenSistemaID: number;
        sistema: string;
        condicion: string;
        detalle: string;
        hallazgos: {            
            hallazgo: string;
            estadoHallazgo: string;
        }[];
    }[];
}
