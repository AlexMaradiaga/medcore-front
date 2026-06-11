<template>
  <DoctorLayout>
    <div class="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in">

      <div class="mb-8 flex justify-between items-end">
        <div class="text-left">
          <h1 class="text-3xl font-black text-[#005596] uppercase tracking-tighter">
            Agenda Semanal
          </h1>
          <p class="text-slate-400 text-[11px] font-bold uppercase mt-1 tracking-widest">
            Citas para el {{ fechaFormateada }}
          </p>
        </div>

        <div class="flex gap-2">
           <button @click="navegar(-7)" class="bg-white border border-slate-200 p-2 px-4 rounded-xl text-[10px] font-black uppercase shadow-sm hover:bg-slate-50 transition-colors">
             &lt;&lt; Sem
           </button>
           <button @click="navegar(-1)" class="bg-white border border-slate-200 p-2 px-4 rounded-xl text-[10px] font-black uppercase shadow-sm hover:bg-slate-50 transition-colors">
             &lt;
           </button>
           <button @click="irAHoy" class="bg-white border border-slate-200 p-2 px-6 rounded-xl text-[10px] font-black uppercase shadow-sm hover:bg-slate-50 transition-colors">
             Hoy
           </button>
           <button @click="navegar(1)" class="bg-white border border-slate-200 p-2 px-4 rounded-xl text-[10px] font-black uppercase shadow-sm hover:bg-slate-50 transition-colors">
             &gt;
           </button>
           <button @click="navegar(7)" class="bg-white border border-slate-200 p-2 px-4 rounded-xl text-[10px] font-black uppercase shadow-sm hover:bg-slate-50 transition-colors">
             Sem &gt;&gt;
           </button>
        </div>
      </div>

      <div v-if="citasPendientes > 0" class="bg-orange-50 border border-orange-100 p-4 rounded-3xl mb-8 flex items-center gap-4">
        <span class="text-orange-500 text-lg">⚠️</span>
        <p class="text-orange-800 text-[11px] font-bold uppercase">
          Alertas Activas: {{ citasPendientes }} citas pendientes de atención hoy
        </p>
      </div>

      <div class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden mb-10 min-h-125">
        <WeeklyCalendar
          :key="calendarKey"
          :appointments="misCitas"
          :selected-date="fechaSeleccionada"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label"
          class="bg-white p-6 rounded-4xl border border-slate-100 text-center shadow-sm hover:shadow-md transition-all">
          <h3 class="text-2xl font-black text-[#005596]">{{ stat.value }}</h3>
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">{{ stat.label }}</p>
        </div>
      </div>

    </div>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useToast } from 'vue-toastification';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import WeeklyCalendar from './components/calendar/WeeklyCalendar.vue';
import { useMedicalStore } from '@/stores/medicalStore';
import { DoctorRepository } from '../infrastructure/DoctorRepository';
import type { DashboardAppointment } from '@/modules/appointments/domain/Appointment';

const medicalStore = useMedicalStore();
const repo = new DoctorRepository();
const toast = useToast();

const fechaSeleccionada = ref(new Date());
const misCitas = ref<DashboardAppointment[]>([]);
const calendarKey = ref(0);

const fechaFormateada = computed(() => {
  return fechaSeleccionada.value.toLocaleDateString('es-HN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
});

const stats = computed(() => {
  const total = misCitas.value.length;
  const completadas = misCitas.value.filter(c => c.estado === 'Confirmada' || c.estado === 'Completada').length;
  const pendientes = misCitas.value.filter(c => c.estado === 'Pendiente').length;

  return [
    { value: total.toString(), label: 'Citas propias' },
    { value: completadas.toString(), label: 'Confirmadas' },
    { value: pendientes.toString(), label: 'Pendientes' },
    { value: '8h', label: 'Jornada' }
  ];
});

const citasPendientes = computed(() => misCitas.value.filter(c => c.estado === 'Pendiente').length);

const cargarCitas = async () => {
  try {
    const doctorFromStore = medicalStore.doctor as { id?: number };
    const doctorFromLocal = JSON.parse(localStorage.getItem('user') || '{}');

    const doctorId = doctorFromStore?.id || doctorFromLocal?.id;

    if (!doctorId) return;

    const d = fechaSeleccionada.value;
    const año = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    const fechaQuery = `${año}-${mes}-${dia}`;

    const data = await repo.getDashboardAppointments(Number(doctorId), fechaQuery);

    const filtradas = data.filter(cita =>
      cita.estado !== 'Cancelada' &&
      cita.estado !== 'Anulada'
    );

    misCitas.value = [...filtradas];
    calendarKey.value++;

  } catch {
    toast.error('No se pudo sincronizar la agenda médica semanal.');
  }
};

watch(fechaSeleccionada, () => {
  cargarCitas();
});

const navegar = (dias: number) => {
  const nuevaFecha = new Date(fechaSeleccionada.value);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  fechaSeleccionada.value = nuevaFecha;
};

const irAHoy = () => {
  fechaSeleccionada.value = new Date();
};

onMounted(async () => {
  medicalStore.setConsultationActive(false);
  medicalStore.clearPatient();

  if (!(medicalStore.doctor as { id?: number }).id) {
    await nextTick();
  }
  await cargarCitas();
});
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', sans-serif; }
.rounded-4xl { border-radius: 2rem; }
</style>
