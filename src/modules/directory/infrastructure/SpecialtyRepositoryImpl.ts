import api from '@/shared/infrastructure/api';

export interface Specialty {
  EspecialidadID: number;
  NombreEspecialidad: string;
}

export class SpecialtyRepositoryImpl {
  async getAll(): Promise<Specialty[]> {
    // Esto conecta con tu SpecialtyController.php
    const response = await api.get('/specialties');
    return response.data.data;
  }
}
