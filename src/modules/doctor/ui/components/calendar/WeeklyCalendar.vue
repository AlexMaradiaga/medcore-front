<template>
  <div class="flex flex-col bg-white overflow-hidden h-full">
    <div class="grid grid-cols-8 border-b border-slate-100 bg-slate-50/50">
      <div class="p-4 text-[10px] font-black text-slate-400 uppercase border-r border-slate-100">Hora</div>
      <div v-for="day in weekDays" :key="day.date"
        :class="['p-4 text-center border-r border-slate-100 last:border-0', isToday(day.date) ? 'bg-blue-50/50' : '']">
        <p :class="['text-[11px] font-black uppercase tracking-tighter', isToday(day.date) ? 'text-[#005596]' : 'text-slate-500']">
          {{ day.name }}
        </p>
        <p :class="['text-[14px] font-black', isToday(day.date) ? 'text-[#005596]' : 'text-slate-400']">
          {{ day.dayNumber }}
        </p>
      </div>
    </div>

    <div ref="scrollContainer" class="flex-1 overflow-y-auto max-h-150 relative scroll-smooth">
      <div v-for="hour in hours" :key="hour" class="grid grid-cols-8 border-b border-slate-50 min-h-20">
        <div class="p-4 border-r border-slate-100 text-[11px] font-black text-slate-400 bg-slate-50/20">
          {{ hour }}
        </div>

        <div v-for="day in weekDays" :key="day.date + hour"
          @click="handleCellClick()"
          class="border-r border-slate-50 last:border-0 p-1 relative hover:bg-slate-50 transition-colors cursor-pointer group">

          <div v-for="app in appointments" :key="app.id">
            <div v-if="shouldShow(app, day.date, hour)"
              @click.stop="goToPatient(app)"
              class="absolute inset-0 m-1 bg-[#005596] rounded-xl p-2 shadow-lg z-50 hover:scale-[1.02] transition-all cursor-pointer">
              <p class="text-white text-[9px] font-black leading-tight truncate">{{ app.nombrePaciente }}</p>
              <p class="text-blue-100 text-[8px] font-bold uppercase truncate">{{ app.motivo }}</p>
            </div>
          </div>

          <button class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span class="bg-[#005596] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md">+</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useMedicalStore } from '@/stores/medicalStore';
import type { Patient } from '@/modules/patients/domain/entities/Patient';
import type { DashboardAppointment } from '@/modules/appointments/domain/Appointment';

interface CalendarDay {
  name: string;
  dayNumber: number;
  date: string;
}

const props = defineProps<{
  appointments: DashboardAppointment[],
  selectedDate: Date
}>();

const medicalStore = useMedicalStore();
const scrollContainer = ref<HTMLElement | null>(null);

const hours = computed(() => {
  return Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
});

const weekDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = [];
  const startOfWeek = new Date(props.selectedDate);
  const dayIndex = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  const names = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    days.push({
      name: names[i] || '',
      dayNumber: date.getDate(),
      date: `${y}-${m}-${d}`
    });
  }
  return days;
});

const shouldShow = (app: DashboardAppointment, cellDate: string, cellHour: string): boolean => {
  if (!app?.fecha || !app?.hora) return false;

  const fCita = (app.fecha as unknown as string).split(' ')[0] || '';
  const hCita = (app.hora as unknown as string).substring(0, 2);
  const hCelda = cellHour.substring(0, 2);

  return fCita === cellDate && parseInt(hCita) === parseInt(hCelda);
};

const isToday = (dateString: string) => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return dateString === today;
};

const handleCellClick = () => {
  

};

const goToPatient = (app: DashboardAppointment) => {
  const patientData: Patient = {
    Nombre: app.nombrePaciente.split(' ')[0] || '',
    Apellido: app.nombrePaciente.split(' ')[1] || '',
    DNI: '',
    Telefono: '',
    email: '',
    Edad: app.edad,
    Genero: app.genero,
    Disponible: true,
    Estado: app.estado
  } as Patient;

  medicalStore.setPatient(patientData);
};

const scrollToCurrentHour = () => {
  if (scrollContainer.value) {
    const now = new Date();
    const currentHour = now.getHours();
    const rowHeight = 80;
    const offset = 2;
    scrollContainer.value.scrollTop = (currentHour > offset ? currentHour - offset : 0) * rowHeight;
  }
};

onMounted(() => {
  setTimeout(scrollToCurrentHour, 300);
});
</script>
