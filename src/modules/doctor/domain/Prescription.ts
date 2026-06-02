// src/modules/doctor/domain/Prescription.ts

export interface MedicamentoPrescrito {
    id: number;
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
}

export interface DetalleRecetaResponse {
    estado: string;
    datos: {
        medico: string;
        especialidad: string;
        colegioMedico: string;
        paciente: string;
        medicamentos: MedicamentoPrescrito[];
    };
}
