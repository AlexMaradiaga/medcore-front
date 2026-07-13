import api from '@/shared/infrastructure/api';
import type { Appointment, AppointmentRequest, Exam, MedicalRecord, Prescription, AppointmentResponse } from '../domain/Appointment';

export class AppointmentRepository {
  async create(data: AppointmentRequest): Promise<AppointmentResponse> {
    const response = await api.post<AppointmentResponse>('citas', data);
    return response.data;
  }
  async getHistory(usuarioId: number): Promise<Appointment[]> {
    const response = await api.get(`citas/historial/${usuarioId}`);
    return response.data;
  }
  async cancel(citaId: number): Promise<void> {
    await api.delete(`citas/${citaId}`);
  }
  async getMedicalHistory(usuarioId: number): Promise<MedicalRecord[]> {
    const response = await api.get(`historial/consultas/${usuarioId}`);
    return response.data;
  }
  async getExams(usuarioId: number): Promise<Exam[]> {
    const response = await api.get(`historial/examenes/${usuarioId}`);
    return response.data;
  }
  async getPrescriptions(usuarioId: number): Promise<Prescription[]> {
    const response = await api.get(`historial/recetas/${usuarioId}`);
    return response.data;
  }
}
