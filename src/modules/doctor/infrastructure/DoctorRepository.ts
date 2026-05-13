import api from '@/shared/infrastructure/api';
import type { DoctorAppointment, DoctorStats, ConsultationPayload } from '../domain/DoctorAppointment';
import type { PatientHistoryResponse } from '../domain/PatientHistory';

export class DoctorRepository {
    async getAppointments(doctorId: number): Promise<DoctorAppointment[]> {
        const response = await api.get(`/doctor/citas/${doctorId}`);
        return response.data;
    }

    async getStats(doctorId: number): Promise<DoctorStats> {
        const response = await api.get(`/doctor/stats/${doctorId}`);
        return response.data;
    }

    async completeConsultation(data: ConsultationPayload): Promise<void> {
        await api.post('/doctor/consulta/finalizar', data);
    }
    async approveAppointment(citaId: number): Promise<void> {
    await api.post(`/doctor/cita/aprobar/${citaId}`);
  }

  async rejectAppointment(citaId: number, motivo: string): Promise<void> {
      await api.post(`/doctor/cita/rechazar/${citaId}`, { motivo });
  }
  async getPatientHistory(pacienteId: number): Promise<PatientHistoryResponse> {
    const response = await api.get(`doctor/paciente/${pacienteId}/historial-completo`);
    return response.data;
  }
}
