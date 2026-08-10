import api from '@/shared/infrastructure/api';
import type { Patient } from '../domain/entities/Patient';

export interface PatientDto {
  DNI: string;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  nacionalidad?: string | null;
  tipo_sangre?: string | null;
  email?: string | null;
  password?: string | null;
  es_dependiente?: boolean;
  tutor_dni?: string | null;
  tutor_nombre?: string | null;
  parentesco?: string | null;     
  tutor_email?: string | null;
  tutor_telefono?: string | null;
  documento_identidad_url?: string | null;
}

export class PatientRepositoryImpl {
  async getAll(): Promise<Patient[]> {
    const response = await api.get('/pacientes');
    return response.data.data;
  }

  async create(patient: PatientDto): Promise<void> {
    await api.post('/pacientes', this.mapDtoToPayload(patient));
  }

  async registerPublic(patient: PatientDto): Promise<void> {
    await api.post('/register-patient', this.mapDtoToPayload(patient));
  }

  async update(id: string, patient: PatientDto): Promise<void> {
    await api.put(`/pacientes/${id}`, this.mapDtoToPayload(patient));
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/pacientes/${id}`);
  }

  private mapDtoToPayload(patient: PatientDto) {
    const isPed = !!patient.es_dependiente;
    return {
      dni: patient.DNI,
      nombre: patient.Nombre,
      apellido: patient.Apellido,
      telefono: patient.Telefono,
      nacionalidad: patient.nacionalidad || 'Hondureña',
      tipo_sangre: patient.tipo_sangre || null,
      email: isPed ? patient.tutor_email : patient.email,
      password: patient.password,

      es_dependiente: isPed ? 1 : 0,
      tutor_dni: isPed ? patient.tutor_dni : null,
      tutor_nombre: isPed ? patient.tutor_nombre : null,
      tutor_email: isPed ? patient.tutor_email : null,
      tutor_telefono: isPed ? patient.Telefono : null,
      parentesco: isPed ? patient.parentesco : null,
      documento_identidad_url: isPed ? patient.documento_identidad_url : null,
      entidad_id: 1
    };
  }
}
