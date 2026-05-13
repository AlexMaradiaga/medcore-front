import type { Doctor } from '../entities/Doctor';
export interface DoctorFilters {
  search?: string;
  especialidad?: string;
  geolocalizacion?: boolean;
  inmediata?: boolean;
  ingles?: boolean;
  ordenar?: string;
}

export interface DirectoryRepository {
  getDoctors(filters?: DoctorFilters): Promise<Doctor[]>;
}
