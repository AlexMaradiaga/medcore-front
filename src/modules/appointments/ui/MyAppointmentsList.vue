<template>
  <div class="space-y-6">
    <div v-if="loading" class="bg-white p-24 rounded-[3.5rem] border border-slate-100 shadow-sm text-center">
      <div class="animate-spin inline-block w-12 h-12 border-[6px] border-blue-600 border-t-transparent rounded-full mb-6"></div>
      <p class="text-slate-400 font-black uppercase tracking-[0.2em] text-sm">Consultando agenda médica...</p>
    </div>

    <div v-else-if="appointments.length > 0" class="grid grid-cols-1 gap-6">
      <div v-for="cita in appointments" :key="cita.CitaID"
           class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-center gap-8 group">

        <div class="flex items-center gap-8 w-full text-left">
          <div class="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl group-hover:bg-blue-50 transition-colors">
            📅
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="text-2xl font-black text-slate-800 leading-tight">{{ cita.Doctor }}</h3>
              <span :class="statusClass(cita.EstadoCita)" class="px-4 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest">
                {{ cita.EstadoCita }}
              </span>
            </div>
            <p class="text-blue-600 font-black text-xs uppercase tracking-widest mt-1">{{ cita.Clinica }}</p>

            <div class="flex items-center gap-2 mt-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-bold capitalize">{{ formatDate(cita.FechaHora) }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-3 w-full md:w-auto">
          <button
            @click="openModal(cita)"
            class="flex-1 md:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
          >
            Detalles
          </button>
          <button
            v-if="cita.EstadoCita === 'Pendiente' || cita.EstadoCita === 'Aceptada'"
            @click="handleCancel(cita.CitaID)"
            class="flex-1 md:flex-none px-8 py-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase hover:bg-red-100 transition-all active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-20 rounded-[4rem] border-2 border-dashed border-slate-100 text-center">
      <div class="text-9xl mb-8 grayscale opacity-20">📋</div>
      <h3 class="text-3xl font-black text-slate-800 uppercase tracking-tight">No tienes citas agendadas</h3>
      <p class="text-slate-400 font-medium text-xl mt-4 max-w-lg mx-auto italic">
        "Tu agenda está libre. Cuando realices una cita con nuestros especialistas, aparecerá en esta sección."
      </p>
      <button
        @click="$emit('goToDirectory')"
        class="mt-12 bg-medgo-gradient text-white px-12 py-5 rounded-3xl font-black uppercase text-sm shadow-2xl shadow-blue-200 hover:scale-105 transition-all"
      >
        Explorar Directorio
      </button>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl">
        <div class="p-10 space-y-8">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-3xl font-black text-slate-800 uppercase tracking-tight">Resumen de Cita</h3>
              <p class="text-blue-600 font-bold mt-1 uppercase text-xs tracking-widest">Información proporcionada por el paciente</p>
            </div>
            <button @click="showModal = false" class="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="bg-slate-50 rounded-4xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div class="space-y-1">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialista</p>
              <p class="text-slate-700 font-bold">Dr. {{ selectedCita?.Doctor }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motivo de Consulta</p>
              <p class="text-slate-700 font-bold">{{ selectedCita?.Motivo }}</p>
            </div>
            <div class="md:col-span-2 border-t border-slate-200 pt-4">
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Síntomas Reportados</p>
               <p class="text-slate-700 font-bold mt-1">{{ selectedCita?.Sintomas || 'No se describieron síntomas.' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alergias</p>
              <p class="text-slate-700 font-bold">{{ selectedCita?.Alergias || 'Ninguna reportada' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medicamentos</p>
              <p class="text-slate-700 font-bold">{{ selectedCita?.MedicamentosActuales || 'Ninguno reportado' }}</p>
            </div>
          </div>

          <button @click="showModal = false" class="w-full py-5 bg-medgo-gradient text-white rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all">
            Cerrar Detalles
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AppointmentRepository } from '../infrastructure/AppointmentRepo';
import type { Appointment } from '../domain/Appointment';

const props = defineProps<{
  usuarioId: number;
}>();

defineEmits(['goToDirectory']);

const appointmentRepo = new AppointmentRepository();
const appointments = ref<Appointment[]>([]);
const loading = ref(false);

// Estado para el Modal
const showModal = ref(false);
const selectedCita = ref<Appointment | null>(null);

const loadCitas = async () => {
  if (props.usuarioId === 0) return;
  loading.value = true;
  try {
    appointments.value = await appointmentRepo.getHistory(props.usuarioId);
  } catch (error) {
    console.error("Error al cargar:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadCitas);

const openModal = (cita: Appointment) => {
  selectedCita.value = cita;
  showModal.value = true;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(' ', 'T'));
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  }).format(date);
};

const statusClass = (status: string) => {
  switch (status) {
    case 'Pendiente': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Aceptada': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Completada': return 'bg-green-50 text-green-600 border-green-100';
    case 'Cancelada': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const handleCancel = async (citaId: number) => {
  if (confirm('¿Está seguro de que desea cancelar esta cita?')) {
    try {
      await appointmentRepo.cancel(citaId);
      alert('Cita cancelada exitosamente');
      loadCitas();
    } catch {
      alert('Error al cancelar la cita');
    }
  }
};
</script>
