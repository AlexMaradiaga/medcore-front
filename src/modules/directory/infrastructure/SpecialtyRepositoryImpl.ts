import api from '@/shared/infrastructure/api';

export interface Specialty {
  EspecialidadID: number;
  NombreEspecialidad: string;
}

export class SpecialtyRepositoryImpl {
  async getAll(): Promise<Specialty[]> {
    const response = await api.get('/specialties');
    return response.data.data;
  }
}
