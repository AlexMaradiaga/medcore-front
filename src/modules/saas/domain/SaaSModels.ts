export interface KpiSaaS {
    MRR: number;
    PremiumActivos: number;
    PlanesGratis: number;
    PorVencer: number;
}

export interface SuscripcionSaaS {
    UsuarioID: number;
    RazonSocial: string;
    TipoEntidad: 'Médico Independiente' | 'Farmacia' | 'Laboratorio' | 'Enfermería' | 'Otro Profesional';
    PlanAsignado: string;
    MontoLicencia: number;
    DiasRestantes: number;
    EstadoSaaS: number;
}

export interface TransaccionSaaS {
    TransaccionID: string;
    RazonSocial: string;
    PlanPagado: string;
    MontoFacturado: number;
    FechaPago: string;
}

export interface MonitoreoResponse {
    kpis: KpiSaaS;
    suscripciones: SuscripcionSaaS[];
    transacciones: TransaccionSaaS[];
}

export interface ServicioMedico {
    ServicioID?: number;
    DoctorID: number;
    NombreServicio: string;
    Precio: number;
    Estado: boolean;
}
