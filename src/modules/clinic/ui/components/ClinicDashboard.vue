<!-- ui/components/ClinicDashboard.vue -->
<template>
  <div class="text-left font-premium animate-fade-in select-none space-y-6">
    <!-- Encabezado con selector de pestañas -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          {{ tabActual === 'resumen' ? 'Resumen Operativo' : 'Horarios de Atención Comercial' }}
        </h1>
        <p class="text-xs font-bold text-slate-400 mt-0.5">
          {{ tabActual === 'resumen' ? 'Métricas clave del día y control de agenda' : 'Configure la disponibilidad pública de la clínica' }}
        </p>
      </div>

      <!-- Selector de pestañas -->
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto shrink-0">
        <button
          @click="tabActual = 'resumen'"
          :class="[
            'px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2',
            tabActual === 'resumen'
              ? 'bg-white text-[#0a52be] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          ]"
        >
          <span>📊 Resumen</span>
        </button>
        <button
          @click="tabActual = 'horarios'"
          :class="[
            'px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2',
            tabActual === 'horarios'
              ? 'bg-white text-[#0a52be] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          ]"
        >
          <span>⏰ Horarios</span>
        </button>
      </div>
    </div>

    <!-- PESTAÑA 1: RESUMEN OPERATIVO -->
    <div v-if="tabActual === 'resumen'" class="space-y-6">
      <!-- TARJETAS DE KPIS PRINCIPALES -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <!-- Total Citas -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">TOTAL CITAS</span>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {{ dashboardData.kpis?.TotalCitas ?? 0 }}
            </div>
            <p v-if="variacionCitasText" :class="isVariacionCitasPositiva ? 'text-emerald-600' : 'text-rose-600'" class="text-[10px] font-bold flex items-center gap-1 pt-1">
              <span>{{ isVariacionCitasPositiva ? '▲' : '▼' }} {{ variacionCitasText }}</span>
            </p>
            <p v-else class="text-[10px] font-bold text-slate-400 pt-1">
              Total histórico registrado
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-[#0a52be] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <v-icon name="bi-calendar-event" scale="1.2" />
          </div>
        </div>

        <!-- Citas Pendientes -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">CITAS PENDIENTES</span>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {{ dashboardData.kpis?.CitasPendientes ?? 0 }}
            </div>
            <p class="text-[10px] font-bold text-slate-400 pt-1">Para el día de hoy</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-[#fedec5] text-[#b35912] flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" />
              <g class="agujas-reloj">
                <line x1="12" y1="12" x2="12" y2="7" />
                <line x1="12" y1="12" x2="15.5" y2="12" />
              </g>
            </svg>
          </div>
        </div>

        <!-- Cuerpo Médico -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">CUERPO MÉDICO</span>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {{ dashboardData.kpis?.TotalDoctoresActivos ?? 0 }}
            </div>
            <p class="text-[10px] font-bold text-teal-600 pt-1">Especialistas activos</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <v-icon name="gi-stethoscope" scale="1.2" />
          </div>
        </div>

        <!-- Ingreso Total -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">INGRESO TOTAL</span>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              L. {{ dashboardData.kpis?.IngresosTotales ?? '0.00' }}
            </div>
            <p v-if="variacionIngresosText" :class="isVariacionIngresosPositiva ? 'text-emerald-600' : 'text-rose-600'" class="text-[10px] font-bold flex items-center gap-1 pt-1">
              <span>{{ isVariacionIngresosPositiva ? '▲' : '▼' }} {{ variacionIngresosText }}</span>
            </p>
            <p v-else class="text-[10px] font-bold text-slate-400 pt-1">
              Monto acumulado general
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-[#50e9a2] text-slate-900 flex items-center justify-center shrink-0 font-black">
            <v-icon name="bi-cash-stack" scale="1.2" />
          </div>
        </div>
      </div>

      <!-- SECCIÓN AGENDA Y CITAS RECIENTES RESPONSIVA -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-base font-black text-slate-900">Agenda y Citas Recientes</h2>
            <p class="text-xs font-bold text-slate-400 mt-0.5">Control de flujo de pacientes y asignación de consultorios</p>
          </div>
        </div>

        <!-- VISTA 1: TARJETAS EN MÓVIL (< 768px) -->
        <div class="block md:hidden divide-y divide-slate-100">
          <div v-for="cita in citasFiltradas" :key="cita.CitaID" class="p-4 space-y-3 bg-white">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Paciente</span>
                <p class="text-xs font-black text-slate-900 uppercase leading-tight mt-0.5">{{ cita.Paciente }}</p>
              </div>
              <span :class="getEstadoClass(cita.EstadoCita)" class="px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full border shrink-0">
                {{ cita.EstadoCita }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div>
                <span class="text-[10px] font-bold uppercase text-slate-400 block">Médico</span>
                <span class="font-bold text-slate-700 truncate block">Dr. {{ cita.Doctor }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold uppercase text-slate-400 block">Fecha y Hora</span>
                <span class="font-mono text-[11px] text-slate-600 block">{{ formatDate(cita.FechaHora) }}</span>
              </div>
            </div>
          </div>

          <div v-if="citasFiltradas.length === 0" class="p-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
            No se encontraron citas o pacientes que coincidan.
          </div>
        </div>

        <!-- VISTA 2: TABLA EN ESCRITORIO (>= 768px) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b border-slate-100">
              <tr>
                <th class="py-3.5 px-6 whitespace-nowrap">PACIENTE</th>
                <th class="py-3.5 px-6 whitespace-nowrap">MÉDICO</th>
                <th class="py-3.5 px-6 whitespace-nowrap">FECHA Y HORA</th>
                <th class="py-3.5 px-6 whitespace-nowrap">ESTADO</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-for="cita in citasFiltradas" :key="cita.CitaID" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-4 px-6 font-bold text-slate-900 text-xs uppercase whitespace-nowrap">{{ cita.Paciente }}</td>
                <td class="py-4 px-6 font-bold text-slate-700 text-xs whitespace-nowrap">Dr. {{ cita.Doctor }}</td>
                <td class="py-4 px-6 text-xs font-mono text-slate-500 whitespace-nowrap">{{ formatDate(cita.FechaHora) }}</td>
                <td class="py-4 px-6 whitespace-nowrap">
                  <span :class="getEstadoClass(cita.EstadoCita)" class="px-3 py-1 text-[10px] font-black uppercase rounded-full border inline-block">
                    {{ cita.EstadoCita }}
                  </span>
                </td>
              </tr>
              <tr v-if="citasFiltradas.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                  No se encontraron citas o pacientes que coincidan con los criterios.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PESTAÑA 2: CONFIGURACIÓN DE HORARIOS -->
    <div v-else-if="tabActual === 'horarios'" class="max-w-4xl mx-auto">
      <EntityScheduleConfigurator :entityId="clinicId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { SessionUser } from '../../../../shared/Domain/dashboard.interface';
import type { ClinicDashboardData } from '../../Domain/Clinic';
import { ClinicRepository } from '../../infrastructure/ClinicRepository';
import EntityScheduleConfigurator from '@/modules/entitySchedule/ui/EntityScheduleConfigurator.vue';
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import { BiCalendarEvent, BiCashStack } from 'oh-vue-icons/icons';
import { GiStethoscope } from 'oh-vue-icons/icons';

addIcons(BiCalendarEvent, BiCashStack, GiStethoscope);

interface Props {
  searchQuery?: string;
}
const props = withDefaults(defineProps<Props>(), {
  searchQuery: ''
});

const authStore = useAuthStore();
const repo = new ClinicRepository();

// Pestaña activa ('resumen' | 'horarios')
const tabActual = ref<'resumen' | 'horarios'>('resumen');

const clinicId = computed<number>(() => {
  const user = authStore.user as SessionUser | null;
  let idRaw = user?.EntidadID;
  if (!idRaw) {
    const localUserRaw = localStorage.getItem('user');
    if (localUserRaw) {
      const localUser = JSON.parse(localUserRaw) as Record<string, unknown>;
      idRaw = (localUser.entidadId ?? localUser.EntidadID ?? localUser.entidad_id) as number | string;
    }
  }
  const parsedId = Number(idRaw);
  return isNaN(parsedId) ? 0 : parsedId;
});

const dashboardData = ref<ClinicDashboardData>({ kpis: null, citas_recientes: [] });

const getKpiExtra = (key: string): unknown => {
  if (!dashboardData.value.kpis) return undefined;
  return (dashboardData.value.kpis as Record<string, unknown>)[key];
};

const variacionCitas = computed<number | null>(() => {
  const val = getKpiExtra('VariacionCitas') ?? getKpiExtra('PorcentajeCitas');
  return typeof val === 'number' ? val : null;
});
const isVariacionCitasPositiva = computed(() => (variacionCitas.value ?? 0) >= 0);
const variacionCitasText = computed(() => {
  if (variacionCitas.value === null) return null;
  const sign = variacionCitas.value > 0 ? '+' : '';
  return `${sign}${variacionCitas.value}% vs mes anterior`;
});

const variacionIngresos = computed<number | null>(() => {
  const val = getKpiExtra('VariacionIngresos') ?? getKpiExtra('PorcentajeIngresos');
  return typeof val === 'number' ? val : null;
});
const isVariacionIngresosPositiva = computed(() => (variacionIngresos.value ?? 0) >= 0);
const variacionIngresosText = computed(() => {
  if (variacionIngresos.value === null) return null;
  const sign = variacionIngresos.value > 0 ? '+' : '';
  return `${sign}${variacionIngresos.value}% vs mes anterior`;
});

const citasFiltradas = computed(() => {
  const query = props.searchQuery.toLowerCase().trim();
  if (!query) return dashboardData.value.citas_recientes;
  return dashboardData.value.citas_recientes.filter((cita) => {
    const paciente = cita.Paciente.toLowerCase();
    const doctor = cita.Doctor.toLowerCase();
    const estado = cita.EstadoCita.toLowerCase();
    return paciente.includes(query) || doctor.includes(query) || estado.includes(query);
  });
});

const loadDashboard = async (): Promise<void> => {
  if (!clinicId.value || clinicId.value === 0) return;
  try {
    dashboardData.value = await repo.getDashboardData(clinicId.value);
  } catch (error) {
    console.error("Error cargando dashboard", error);
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('es-HN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const getEstadoClass = (estado: string) => {
  const e = estado.toLowerCase();
  if (e.includes('pendiente')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (e.includes('completada') || e.includes('finalizada')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (e.includes('cancelada')) return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-blue-50 text-blue-700 border-blue-200';
};

watch(
  () => authStore.user,
  () => {
    if (clinicId.value && clinicId.value !== 0) {
      void loadDashboard();
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (clinicId.value && clinicId.value !== 0) {
    void loadDashboard();
  }
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.agujas-reloj {
  transform-origin: 12px 12px;
  animation: girarAgujas 6s linear infinite;
}
@keyframes girarAgujas {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>