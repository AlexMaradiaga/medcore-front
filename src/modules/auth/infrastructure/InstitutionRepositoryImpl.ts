import api from '@/shared/infrastructure/api';
import type {
  InstitutionRepository,
  InstitutionRegistrationPayload
} from '../domain/InstitutionRegistration';

export class InstitutionRepositoryImpl implements InstitutionRepository {
  async registerInstitution(
    payload: InstitutionRegistrationPayload
  ): Promise<{ status: string; message: string; entidad_id?: number }> {
    const formData = new FormData();

    // 👈 Casteo seguro 'as unknown as Record<string, unknown>' para TS
    const rawPayload = payload as unknown as Record<string, unknown>;

    Object.keys(rawPayload).forEach((key) => {
      const value = rawPayload[key];
      if (value !== null && value !== undefined && !(value instanceof File)) {
        formData.append(key, String(value));
      }
    });

    // Adjuntar archivos de expediente
    if (payload.rep_foto_dni instanceof File) {
      formData.append('rep_foto_dni', payload.rep_foto_dni);
    }
    if (payload.san_doc_colegiacion instanceof File) {
      formData.append('san_doc_colegiacion', payload.san_doc_colegiacion);
    }

    const response = await api.post('/register-institution', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  }
}
