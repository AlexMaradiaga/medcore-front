import api from '@/shared/infrastructure/api';

export interface Entidad {
  EntidadID: number;
  NombreEntidad: string;
  TipoEntidad: string;
  Direccion?: string;
  Telefono?: string;
  Estado: number;
}

export class EntityRepository {
  async getEntidades(tipo?: string): Promise<Entidad[]> {
    const response = await api.get('/instituciones', {
      params: { tipo }
    });
    return response.data.data || response.data || [];
  }
}