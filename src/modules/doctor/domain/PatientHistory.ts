export interface ConsultaPrevia {
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
    oxigeno: number;
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
