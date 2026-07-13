import api from '@/shared/infrastructure/api';
import type { DoctorAppointment, DoctorStats, ConsultationPayload, DiagnosticoCIE11, SistemaExamenUI} from '../domain/DoctorAppointment';
import type { PatientHistoryResponse, DetalleConsultaModal } from '../domain/PatientHistory';
import type { DashboardAppointment } from '@/modules/appointments/domain/Appointment';

  interface DashboardAppointmentDTO {
    CitaID: string;
    FechaHora: string;
    Motivo: string;
    Sintomas: string | null;
    Paciente: string;
    Edad: number | null;
    Genero: string | null;
    Telefono: string;
    EmailPaciente: string;
    Alergias: string | null;
    MedicamentosActuales: string | null;
    EmailDoctor: string;
    EstadoCita: string;
  }
  export interface PacienteCatalogoDTO {
    PacienteID: number;
    Nombre: string;
    Identidad: string;
    Edad: number;
    Genero: string;
    UltimaConsulta: string | null;
  }
  export interface FilaRecetaSQL {
  NombreMedicamento: string;
  Dosis: string;
  Indicaciones: string;
  CodigoCanje?: string;
  }

  export interface HallazgoCatalogo {
  HallazgoID: number;
  NombreHallazgo: string;
  }

  export interface SistemaCatalogo {
    SistemaID: number;
    NombreSistema: string;
    Hallazgos: string;
  }

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
    const response = await api.get(`/doctor/paciente/${pacienteId}/historial-completo`);
    return response.data;
  }

  async getDashboardAppointments(doctorId: number, fecha: string): Promise<DashboardAppointment[]> {
    try {
      const response = await api.get<DashboardAppointmentDTO[]>(`/doctor/citas/${doctorId}?fecha=${fecha}`);
      const data = response.data;
      if (!data || !Array.isArray(data)) return [];

      return data.map((item: DashboardAppointmentDTO): DashboardAppointment => {
        const raw = item.FechaHora || '';
        const partes = raw.split(' ');

        return {
          id: Number(item.CitaID),
          nombrePaciente: item.Paciente || 'Sin Nombre',
          fecha: String(partes[0] || ''),
          hora: String(partes[1] || '00:00'),
          motivo: item.Motivo || '',
          estado: item.EstadoCita || '',
          genero: item.Genero || 'N/A',
          edad: Number(item.Edad || 0)
        };
      });
    } catch {
      return [];
    }
  }
  async getMyPatients(): Promise<PacienteCatalogoDTO[]> {
    const response = await api.get('/doctor/mis-pacientes');
    return response.data.datos || [];
  }

  async grantGlobalAccess(pacienteId: number, pin: string): Promise<{ estado: string; mensaje: string }> {
    const response = await api.post('/doctor/paciente/conceder-autorizacion', {
      paciente_id: pacienteId,
      pin_autorizacion: pin
    });
    return response.data;
  }
  async getDetalleConsulta(consultaId: number): Promise<{ estado: string; datos: DetalleConsultaModal }> {
    const response = await api.get<{ estado: string; datos: DetalleConsultaModal }>('/doctor/consulta/detalle', {
      params: { consulta_id: consultaId }
    });
    return response.data;
  }
  async getRecetaPorConsulta(consultaId: number): Promise<{ estado: string; datos: FilaRecetaSQL[] }> {
    const response = await api.get('/medico/consulta/receta', {
      params: { consulta_id: consultaId }
    });
    return response.data;
  }
  async buscarDiagnosticosCIE11(query: string): Promise<DiagnosticoCIE11[]> {
    if (!query || query.trim().length < 3) return [];
    try {
      const response = await api.get<{ datos: DiagnosticoCIE11[] }>('/doctor/diagnosticos/buscar', {
        params: { q: query }
      });
      return response.data.datos || [];
    } catch (error) {
      console.error("Error al consultar catálogo de diagnósticos:", error);
      return [];
    }
  }

  async getCatalogoExamenFisico(): Promise<SistemaExamenUI[]> {
    interface ApiItem {
      SistemaID?: number | string;
      id?: number | string;
      NombreSistema?: string;
      nombre?: string;
      Hallazgos?: string | { NombreHallazgo?: string }[];
    }

    const response = await api.get<ApiItem[]>('/doctor/catalogo-examen-fisico');

    return response.data.map((item): SistemaExamenUI => {
      let hallazgosArray: { NombreHallazgo?: string }[] = [];

      if (typeof item.Hallazgos === 'string') {
        hallazgosArray = JSON.parse(item.Hallazgos || '[]') as { NombreHallazgo?: string }[];
      } else if (Array.isArray(item.Hallazgos)) {
        hallazgosArray = item.Hallazgos as { NombreHallazgo?: string }[];
      }

      return {
        id: String(item.SistemaID ?? item.id ?? ''),
        nombre: String(item.NombreSistema ?? item.nombre ?? ''),
        open: false,
        isNormal: false,
        opciones: hallazgosArray.map((h) => h.NombreHallazgo ? String(h.NombreHallazgo) : String(h))
      };
    });
  }
}
