// 1. Importamos la instancia centralizada, NO axios directamente
import api from '@/shared/infrastructure/api';
import type { DirectoryRepository, DoctorFilters } from '../domain/repository/DirectoryRepository';
import type { Doctor } from '../domain/entities/Doctor';

export class DirectoryRepositoryImpl implements DirectoryRepository {
  async getDoctors(filters?: DoctorFilters): Promise<Doctor[]> {
  const response = await api.get('/doctores', { params: filters });
  // Si la consola muestra el array [...] directamente, devuelve response.data
  return response.data.data || response.data || [];
}
}
