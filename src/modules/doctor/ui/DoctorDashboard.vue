<template>
  <DoctorLayout>
    <main class="p-8 max-w-350 mx-auto space-y-12 animate-fade-in">

      <div class="flex justify-between items-center">
        <div class="text-left">
          <h2 class="text-4xl font-black text-[#005596] tracking-tighter">Agenda del Día</h2>
          <p class="text-slate-400 font-bold capitalize">{{ new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
        </div>
        <button
          @click="router.push('/medico/agenda')"
          class="flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
        >
          <v-icon name="bi-calendar-event" scale="0.9" /> Ver Calendario
        </button>
      </div>

      <section class="bg-red-50/20 border border-red-100/50 rounded-[3rem] p-10 text-left">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <v-icon name="bi-exclamation-octagon-fill" scale="1.1" />
          </div>
          <div class="text-left">
            <h3 class="text-xl font-black text-red-900">Consulta Inmediata ({{ citasUrgentes.length }})</h3>
            <p class="text-red-500/70 text-[10px] font-black uppercase tracking-[0.2em]">Solicitudes de atención urgente</p>
          </div>
        </div>

        <div v-if="citasUrgentes.length === 0" class="p-10 text-center border-2 border-dashed border-red-100 rounded-4xl text-slate-400 font-bold bg-white">
          No hay consultas urgentes pendientes
        </div>

        <div v-else class="space-y-6">
          <div v-for="cita in citasUrgentes" :key="cita.CitaID"
               class="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-xl transition-all group">
            <div class="text-left space-y-3">
              <div class="flex items-center gap-3">
                <span class="bg-red-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">Prioridad</span>
                <span class="text-slate-400 text-[10px] font-bold flex items-center gap-1.5">
                  <v-icon name="bi-clock-history" scale="0.75" /> {{ formatHora(cita.FechaHora) }}
                </span>
              </div>
              <h4 class="text-2xl font-black text-slate-800">{{ cita.Paciente }}</h4>
              <p class="text-sm font-bold text-slate-500">{{ cita.Motivo }}</p>
            </div>
            <div class="flex gap-4">
              <button @click="handleApprove(cita.CitaID)" class="px-8 py-4 bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-green-600 transition-all cursor-pointer">Aprobar</button>
              <button @click="handleReject(cita.CitaID)" class="px-8 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-red-600 transition-all cursor-pointer">Rechazar</button>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-blue-50/30 border border-blue-100 rounded-[3rem] p-10 text-left">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <v-icon name="bi-clock-history" scale="1.1" />
          </div>
          <h3 class="text-xl font-black text-blue-900">Citas Confirmadas del Día ({{ citasConfirmadas.length }})</h3>
        </div>

        <div v-if="citasConfirmadas.length === 0" class="p-10 text-center border-2 border-dashed border-blue-100 rounded-4xl text-slate-400 font-bold bg-white">
          No hay citas confirmadas para hoy
        </div>

        <div v-else class="space-y-6">
          <div v-for="cita in citasConfirmadas" :key="cita.CitaID"
               class="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center gap-6">
              <div class="bg-blue-600 text-white p-4 rounded-2xl text-center min-w-22.5 shadow-lg flex flex-col items-center justify-center">
                <p class="text-lg font-black">{{ formatHora(cita.FechaHora) }}</p>
                <p class="text-[9px] font-bold uppercase opacity-80 tracking-widest">Confirmada</p>
              </div>
              <div class="text-left">
                <p class="text-xl font-black text-slate-800">{{ cita.Paciente }}</p>
                <p class="text-xs font-bold text-slate-400">{{ cita.Motivo }}</p>
              </div>
            </div>
            <button @click="startConsultation(cita)" class="px-10 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Atender Ahora
            </button>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div v-for="(stat, index) in statsCards" :key="index"
             class="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-50 flex flex-col items-center justify-center gap-6 hover:-translate-y-1.25 transition-all">
          <div :class="stat.color" class="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl border border-current/10">
            <v-icon :name="stat.icon" scale="1.3" />
          </div>
          <div class="text-center space-y-1">
            <p class="text-6xl font-black text-slate-800 tracking-tighter">{{ stat.value }}</p>
            <p class="text-slate-400 font-black uppercase text-[11px] tracking-[0.2em]">{{ stat.label }}</p>
          </div>
        </div>
      </div>

    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import { DoctorRepository } from '../infrastructure/DoctorRepository';
import type { DoctorAppointment } from '../domain/DoctorAppointment';
import { useMedicalStore } from '@/stores/medicalStore';
import type { Patient } from '@/modules/patients/domain/entities/Patient';
import api from '@/shared/infrastructure/api';
import type { Doctor } from '@/modules/directory/domain/entities/Doctor';

const router = useRouter();
const repo = new DoctorRepository();
const medicalStore = useMedicalStore();
const toast = useToast();

const appointments = ref<DoctorAppointment[]>([]);

const citasUrgentes = computed(() => appointments.value.filter(c => !c.EstadoCita || c.EstadoCita === 'Pendiente'));
const citasConfirmadas = computed(() => appointments.value.filter(c => c.EstadoCita === 'Confirmada'));

const statsCards = computed(() => [
  { label: 'Citas del Día', value: appointments.value.length, icon: 'bi-calendar-event', color: 'bg-blue-50 text-blue-500' },
  { label: 'Confirmadas', value: citasConfirmadas.value.length, icon: 'bi-check-circle-fill', color: 'bg-green-50 text-green-500' },
  { label: 'Pendientes', value: citasUrgentes.value.length, icon: 'bi-exclamation-circle-fill', color: 'bg-red-50 text-red-500' }
]);

const sincronizarPerfilDetalladoMedico = async (userId: number): Promise<void> => {
  try {
    const resDoctores = await api.get('doctores');
    let listaDoctores: Record<string, unknown>[] = [];

    if (resDoctores.data) {
      if (Array.isArray(resDoctores.data)) {
        listaDoctores = resDoctores.data as Record<string, unknown>[];
      } else if (resDoctores.data.data && Array.isArray(resDoctores.data.data)) {
        listaDoctores = resDoctores.data.data as Record<string, unknown>[];
      }
    }

    const doctorEncontrado = listaDoctores.find((d: Record<string, unknown>) => {
      const dbUsuarioId = Number(d.UsuarioID ?? d.usuario_id ?? d.UsuarioId ?? 0);
      return dbUsuarioId === userId;
    });

    if (doctorEncontrado) {

      const doctorFormateado: Doctor = {
        EntidadID: Number(doctorEncontrado.EntidadID ?? doctorEncontrado.entidad_id ?? 0),
        FotoPath: doctorEncontrado.RutaFoto ?? doctorEncontrado.FotoPath ?? doctorEncontrado.foto_path,
        DoctorID: Number(doctorEncontrado.DoctorID ?? doctorEncontrado.doctor_id ?? 0),
        Nombre: String(doctorEncontrado.Nombre ?? doctorEncontrado.nombre ?? ''),
        Apellido: String(doctorEncontrado.Apellido ?? doctorEncontrado.apellido ?? ''),
        Especialidad: String(doctorEncontrado.Especialidad ?? doctorEncontrado.especialidad ?? ''),
        Telefono: String(doctorEncontrado.Telefono ?? doctorEncontrado.telefono ?? ''),
        Email: String(doctorEncontrado.Email ?? doctorEncontrado.email ?? ''),
        Disponible: Boolean(doctorEncontrado.Disponible ?? doctorEncontrado.disponible ?? true),
        Estado: String(doctorEncontrado.Estado ?? doctorEncontrado.estado ?? '1'),
        EsVerificado: String(doctorEncontrado.EsVerificado ?? doctorEncontrado.es_verificado ?? '1'),

        EspecialidadID: Number(doctorEncontrado.EspecialidadID ?? doctorEncontrado.especialidad_id ?? 0),
        especialidad_id: Number(doctorEncontrado.EspecialidadID ?? doctorEncontrado.especialidad_id ?? 0)
      };

      medicalStore.setDoctor(doctorFormateado);
    } else {
      console.warn(`[Dashboard] No se halló ningún doctor con UsuarioID equivalente a ${userId} en la respuesta de la API.`);
    }
  } catch (error) {
    console.error("[DoctorDashboard] Error de red al enlazar el perfil del médico:", error);
  }
};

const loadDoctorData = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || 0;

  if (userId) {
    await sincronizarPerfilDetalladoMedico(userId);
    try {
      appointments.value = await repo.getAppointments(userId);
    } catch {
      toast.error('No se pudieron actualizar las consultas de la agenda del día.');
    }
  }
};

const startConsultation = async (cita: DoctorAppointment) => {
  localStorage.setItem('current_appointment', JSON.stringify(cita));
  try {
    const misPacientes = await repo.getMyPatients();
    const pacienteReal = misPacientes.find(p => p.Nombre.toLowerCase().trim() === cita.Paciente.toLowerCase().trim());

    if (pacienteReal) {
      medicalStore.setPatient({
        PacienteID: String(pacienteReal.PacienteID),
        Nombre: pacienteReal.Nombre
      } as Partial<Patient> as Patient);
    } else {
      medicalStore.setPatient({
        PacienteID: String(cita.CitaID),
        Nombre: cita.Paciente
      } as Partial<Patient> as Patient);
    }
  } catch {
    medicalStore.setPatient({
      PacienteID: String(cita.CitaID),
      Nombre: cita.Paciente
    } as Partial<Patient> as Patient);
  } finally {
    router.push('/medico/perfil');
  }
};

const formatHora = (fechaStr: string | undefined | null) => {
  if (!fechaStr) return '00:00';
  const partes = fechaStr.split(' ');
  const horaConMilisegundos = partes[1];
  return horaConMilisegundos ? horaConMilisegundos.substring(0, 5) : '00:00';
};

const handleApprove = async (citaId: number) => {
  try {
    await repo.approveAppointment(citaId);
    await loadDoctorData();
    toast.success('Consulta prioritaria aprobada correctamente.');
  } catch {
    toast.error('Ocurrió un error al intentar autorizar la consulta médica.');
  }
};

const handleReject = async (citaId: number) => {
  const motivo = window.prompt("Ingrese el motivo del rechazo:");
  if (motivo) {
    try {
      await repo.rejectAppointment(citaId, motivo);
      await loadDoctorData();
      toast.success('Solicitud rechazada con éxito.');
    } catch {
      toast.error('No se pudo procesar la cancelación de la consulta.');
    }
  }
};

onMounted(async () => {
  medicalStore.setConsultationActive(false);
  medicalStore.clearPatient();
  await loadDoctorData();
});
</script>
