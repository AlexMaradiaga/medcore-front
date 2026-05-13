import api from '@/shared/infrastructure/api';
import type { Patient } from '../domain/entities/Patient';

interface PatientDto {
  email: string;
  password?: string;
  DNI: string;
  Nombre: string;
  Apellido: string;
  Telefono: string;
}

export class PatientRepositoryImpl {
  async getAll(): Promise<Patient[]> {
    const response = await api.get('/pacientes');
    // Laravel devuelve { status: 'success', data: [...] }
    return response.data.data;
  }

  async create(patient: PatientDto): Promise<void> {
    await api.post('/pacientes', {
      email: patient.email,
      password: patient.password,
      dni: patient.DNI,
      nombre: patient.Nombre,
      apellido: patient.Apellido,
      telefono: patient.Telefono,
      entidad_id: 1
    });
  }
  async update(id: string, patient: PatientDto): Promise<void> {
    await api.put(`/pacientes/${id}`, {
      email: patient.email,
      nombre: patient.Nombre,
      apellido: patient.Apellido,
      telefono: patient.Telefono,
      entidad_id: 1
    });
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/pacientes/${id}`);
  }
}
