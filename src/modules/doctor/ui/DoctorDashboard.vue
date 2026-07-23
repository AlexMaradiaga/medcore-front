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

      <!-- SECCIÓN: CONSULTAS URGENTES / PENDIENTES -->
      <section class="bg-red-50/20 border border-red-100/50 rounded-[3rem] p-10 text-left">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 bg-blue-400 rounded-2xl flex items-center justify-center text-white shadow-md">
            <v-icon name="bi-exclamation-octagon-fill" scale="1.1" />
          </div>

          <div class="text-left">
            <h3 class="text-xl font-black text-slate-800">Consulta Pendiente ({{ citasUrgentes.length }})</h3>
            <p class="px-10 py-4 bg-blue-200 text-black border border-blue-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">Solicitudes de atención pendiente</p>
          </div>
        </div>

        <div v-if="citasUrgentes.length === 0" class="p-10 text-center border-2 border-dashed border-red-100 rounded-4xl text-slate-400 font-bold bg-white">
          No hay consultas urgentes pendientes
        </div>

        <div v-else class="space-y-6">
          <div v-for="cita in citasUrgentes" :key="obtenerIdCita(cita)"
               class="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-xl transition-all group">
            <div class="text-left space-y-3">
              <div class="flex items-center gap-3">
                <span class="bg-blue-200 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">Prioridad</span>
                <span class="px-2 py-1 bg-slate-100 border border-slate-200/60 text-slate-700 text-[10px] font-black uppercase rounded-lg flex items-center gap-1.5 shadow-sm">
                  <v-icon name="bi-clock-history" scale="0.75" class="text-slate-500" />
                  {{ formatHora(cita) }}
                </span>
              </div>
              <h4 class="text-2xl font-black text-slate-800">{{ obtenerNombrePaciente(cita) }}</h4>
              <p class="text-sm font-bold text-slate-500">{{ obtenerMotivo(cita) }}</p>
            </div>
            <div class="flex gap-4">
              <button
                @click="handleApprove(obtenerIdCita(cita))"
                class="px-10 py-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Aprobar
              </button>

              <button
                @click="handleReject(obtenerIdCita(cita))"
                class="px-10 py-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN: CITAS CONFIRMADAS DEL DÍA -->
      <section class="bg-blue-50/30 border border-blue-100 rounded-[3rem] p-10 text-left">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 bg-blue-400 rounded-2xl flex items-center justify-center text-white shadow-md">
            <v-icon name="bi-clock-history" scale="1.1" />
          </div>
          <h3 class="text-xl font-black text-blue-600">Citas Confirmadas del Día ({{ citasConfirmadas.length }})</h3>
        </div>

        <div v-if="citasConfirmadas.length === 0" class="p-10 text-center border-2 border-dashed border-blue-100 rounded-4xl text-slate-400 font-bold bg-white">
          No hay citas confirmadas para hoy
        </div>

        <div v-else class="space-y-6">
          <div v-for="cita in citasConfirmadas" :key="obtenerIdCita(cita)"
               class="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center gap-6">
              <div class="bg-blue-400 text-black p-4 rounded-2xl text-center min-w-22.5 shadow-lg flex flex-col items-center justify-center">
                <p class="text-lg font-black">{{ formatHora(cita) }}</p>
                <p class="text-[9px] font-bold uppercase opacity-80 tracking-widest">Confirmada</p>
              </div>
              <div class="text-left">
                <p class="text-xl font-black text-slate-800">{{ obtenerNombrePaciente(cita) }}</p>
                <p class="text-xs font-bold text-slate-600">{{ obtenerMotivo(cita) }}</p>
              </div>
            </div>
            <button
              @click="startConsultation(cita)"
              class="px-10 py-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Atender Ahora
            </button>
          </div>
        </div>
      </section>

      <!-- TARJETAS DE ESTADÍSTICAS -->
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

    <!-- MODAL PERSONALIZADO PARA RECHAZO DE CITA -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md" @click="cerrarModalRechazo"></div>

        <div class="bg-white rounded-3xl p-7 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 relative z-10 text-center space-y-5 transform transition-all">

          <div class="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-xs border border-red-100">
            <v-icon name="bi-exclamation-octagon-fill" scale="1.6" class="animate-pulse" />
          </div>

          <div class="space-y-2">
            <h3 class="text-xl font-black text-slate-800 tracking-tight uppercase">
              Rechazar Consulta Médica
            </h3>
            <p class="text-slate-500 text-xs font-medium leading-relaxed px-2">
              Por favor, especifique de manera clara la justificación médica o de agenda por la cual no se podrá atender esta solicitud de consulta.
            </p>
          </div>

          <div class="text-left space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Motivo del Rechazo</label>
            <textarea
              v-model="motivoRechazo"
              placeholder="Ej. Cambio de horario quirúrgico de emergencia / Especialista ausente..."
              rows="3"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <button
              @click="cerrarModalRechazo"
              class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Cancelar
            </button>
            <button
              @click="confirmarRechazo"
              class="px-5 py-3 bg-linear-to-r from-red-500 to-rose-600 hover:brightness-110 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-md shadow-red-500/20 transition-all cursor-pointer active:scale-95"
            >
              Confirmar Rechazo
            </button>
          </div>
        </div>
      </div>
    </Transition>
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

type RawAppointment = Record<string, unknown>;

const appointments = ref<RawAppointment[]>([]);

const showRejectModal = ref(false);
const motivoRechazo = ref('');
const selectedCitaId = ref<number | null>(null);

// ==========================================
// HELPERS TIPADOS Y TOLERANTES A PROPIEDADES
// ==========================================
const obtenerEstado = (c: RawAppointment): string => {
  return String(c.EstadoCita || c.estado || c.Estado || '').toLowerCase().trim();
};

const obtenerIdCita = (c: RawAppointment): number => {
  return Number(c.CitaID || c.cita_id || c.id || 0);
};

const obtenerNombrePaciente = (c: RawAppointment): string => {
  return String(c.Paciente || c.paciente || c.NombrePaciente || 'Paciente');
};

const obtenerMotivo = (c: RawAppointment): string => {
  return String(c.Motivo || c.motivo || 'Consulta de revisión');
};

const obtenerFechaCruda = (c: RawAppointment): string => {
  return String(c.FechaHora || c.fecha_hora || '');
};

const citasUrgentes = computed(() => {
  return appointments.value.filter((c: RawAppointment) => {
    const estado = obtenerEstado(c);
    return !estado || estado === 'pendiente' || estado === 'por aprobar';
  });
});

const citasConfirmadas = computed(() => {
  const hoy = new Date();
  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

  return appointments.value.filter((c: RawAppointment) => {
    const estado = obtenerEstado(c);
    const esConfirmada = estado === 'confirmada';

    const fechaCruda = obtenerFechaCruda(c);
    if (!fechaCruda) return false;

    const parteT = fechaCruda.split('T')[0] ?? '';
    const fechaSolo = parteT.split(' ')[0] ?? '';

    return esConfirmada && fechaSolo === hoyStr;
  });
});

const statsCards = computed(() => [
  { label: 'Citas del Día', value: appointments.value.length, icon: 'bi-calendar-event', color: 'bg-blue-50 text-blue-500' },
  { label: 'Confirmadas', value: citasConfirmadas.value.length, icon: 'bi-check-circle-fill', color: 'bg-green-50 text-green-500' },
  { label: 'Pendientes', value: citasUrgentes.value.length, icon: 'bi-exclamation-circle-fill', color: 'bg-red-50 text-red-500' }
]);

// ==========================================
// FORMATEADOR DE HORA
// ==========================================
const formatHora = (cita: RawAppointment): string => {
  const fechaStr = obtenerFechaCruda(cita);
  if (!fechaStr || fechaStr === 'undefined') return '00:00';

  try {
    if (fechaStr.includes('T')) {
      const partes = fechaStr.split('T');
      return partes[1] ? partes[1].substring(0, 5) : '00:00';
    }
    if (fechaStr.includes(' ')) {
      const partes = fechaStr.split(' ');
      return partes[1] ? partes[1].substring(0, 5) : '00:00';
    }
    return '00:00';
  } catch {
    return '00:00';
  }
};

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
      const data = await repo.getAppointments(userId);
      appointments.value = (data || []) as unknown as RawAppointment[];
    } catch {
      toast.error('No se pudieron actualizar las consultas de la agenda del día.');
    }
  }
};

const startConsultation = async (citaRaw: RawAppointment) => {
  const cita = citaRaw as unknown as DoctorAppointment;
  localStorage.setItem('current_appointment', JSON.stringify(cita));

  try {
    const misPacientes = await repo.getMyPatients();
    const nombrePac = obtenerNombrePaciente(citaRaw);
    const pacienteReal = misPacientes.find(p => p.Nombre.toLowerCase().trim() === nombrePac.toLowerCase().trim());

    if (pacienteReal) {
      medicalStore.setPatient({
        PacienteID: String(pacienteReal.PacienteID),
        Nombre: pacienteReal.Nombre
      } as Partial<Patient> as Patient);
    } else {
      medicalStore.setPatient({
        PacienteID: String(obtenerIdCita(citaRaw)),
        Nombre: nombrePac
      } as Partial<Patient> as Patient);
    }
  } catch {
    medicalStore.setPatient({
      PacienteID: String(obtenerIdCita(citaRaw)),
      Nombre: obtenerNombrePaciente(citaRaw)
    } as Partial<Patient> as Patient);
  } finally {
    router.push('/medico/perfil');
  }
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

const handleReject = (citaId: number) => {
  selectedCitaId.value = citaId;
  motivoRechazo.value = '';
  showRejectModal.value = true;
};

const cerrarModalRechazo = () => {
  showRejectModal.value = false;
  selectedCitaId.value = null;
  motivoRechazo.value = '';
};

const confirmarRechazo = async () => {
  if (!motivoRechazo.value.trim()) {
    toast.warning('Por favor, ingrese un motivo válido para rechazar la consulta.');
    return;
  }

  if (selectedCitaId.value !== null) {
    try {
      await repo.rejectAppointment(selectedCitaId.value, motivoRechazo.value.trim());
      cerrarModalRechazo();
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
