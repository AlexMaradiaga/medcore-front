import type { Doctor } from '../entities/Doctor';

// Definimos exactamente qué filtros permite tu negocio
export interface DoctorFilters {
  search?: string;
  especialidad?: string;
  geolocalizacion?: boolean;
  inmediata?: boolean;
  ingles?: boolean;
  ordenar?: string;
}

export interface DirectoryRepository {
  // Ahora el repositorio es estricto y claro
  getDoctors(filters?: DoctorFilters): Promise<Doctor[]>;
}
