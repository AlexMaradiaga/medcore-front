import api from '@/shared/infrastructure/api';
import type { DirectoryRepository, DoctorFilters } from '../domain/repository/DirectoryRepository';
import type { Doctor } from '../domain/entities/Doctor';

export class DirectoryRepositoryImpl implements DirectoryRepository {
  async getDoctors(filters?: DoctorFilters): Promise<Doctor[]> {
  const response = await api.get('/doctores', { params: filters });
  return response.data.data || response.data || [];
}
}
