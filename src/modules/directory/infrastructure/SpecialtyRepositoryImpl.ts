import api from '@/shared/infrastructure/api';

export interface Specialty {
  EspecialidadID: number;
  NombreEspecialidad: string;
  Estado: number;
}

export class SpecialtyRepositoryImpl {
  async getAll(): Promise<Specialty[]> {
    const response = await api.get('/especialidades');
    return response.data;
  }
}
