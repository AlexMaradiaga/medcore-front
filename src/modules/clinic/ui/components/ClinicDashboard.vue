<template>
  <div class="text-left font-premium animate-fade-in select-none">

    <div class="flex flex-wrap bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 shadow-inner mb-8 w-fit gap-1">
      <button
        @click="activeTab = 'resumen'"
        :class="activeTab === 'resumen' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'"
        class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2"
      >
        <v-icon name="bi-bar-chart-fill" scale="0.85" /> Resumen Operativo
      </button>

      <button
        @click="activeTab = 'doctores'"
        :class="activeTab === 'doctores' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'"
        class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2"
      >
        <v-icon name="gi-stethoscope" scale="0.85" /> Personal Médico
      </button>

      <button
        @click="activeTab = 'calidad'"
        :class="activeTab === 'calidad' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'"
        class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2"
      >
        <v-icon name="bi-shield-fill-check" scale="0.85" /> Auditoría y Calidad
      </button>

      <button
        @click="activeTab = 'especialidades'"
        :class="activeTab === 'especialidades' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'"
        class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2"
      >
        <v-icon name="bi-folder-fill" scale="0.85" /> Especialidades
      </button>
    </div>

    <div v-if="activeTab === 'resumen'" class="space-y-8 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Citas</p>
          <h3 class="text-3xl font-black text-white mt-2">{{ dashboardData.kpis?.TotalCitas ?? 0 }}</h3>
          <v-icon name="bi-calendar-event" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Citas Pendientes</p>
          <h3 class="text-3xl font-black text-amber-400 mt-2">{{ dashboardData.kpis?.CitasPendientes ?? 0 }}</h3>
          <v-icon name="bi-clock-history" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuerpo Médico</p>
          <h3 class="text-3xl font-black text-teal-400 mt-2">{{ dashboardData.kpis?.TotalDoctoresActivos ?? 0 }}</h3>
          <v-icon name="gi-stethoscope" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingresos Totales</p>
          <h3 class="text-3xl font-black text-emerald-400 mt-2">L. {{ dashboardData.kpis?.IngresosTotales ?? 0 }}</h3>
          <v-icon name="bi-cash-stack" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>
      </div>

      <div class="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-xs p-8 text-left">
        <h3 class="text-xl font-black text-white uppercase tracking-tight mb-6">Agenda y Citas Recientes</h3>
        <div class="overflow-x-auto border border-slate-800 rounded-2xl">
          <table class="w-full text-sm text-left text-slate-300">
            <thead class="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th class="px-6 py-4">Paciente</th>
                <th class="px-6 py-4">Médico</th>
                <th class="px-6 py-4">Fecha y Hora</th>
                <th class="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cita in dashboardData.citas_recientes" :key="cita.CitaID" class="border-b border-slate-800/60 bg-slate-900 hover:bg-slate-800/40 transition-colors">
                <td class="px-6 py-4 font-black text-white uppercase text-xs">{{ cita.Paciente }}</td>
                <td class="px-6 py-4 font-bold text-slate-300 text-xs">Dr. {{ cita.Doctor }}</td>
                <td class="px-6 py-4 text-xs font-mono text-slate-400">{{ formatDate(cita.FechaHora) }}</td>
                <td class="px-6 py-4">
                  <span :class="getEstadoClass(cita.EstadoCita)" class="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border shadow-3xs">
                    {{ cita.EstadoCita }}
                  </span>
                </td>
              </tr>
              <tr v-if="dashboardData.citas_recientes.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                  No se registran movimientos recientes de agenda.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'doctores'" class="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">

      <div class="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-xs p-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-xl font-black text-white uppercase tracking-tight">Cuerpo Médico Activo</h3>
            <p class="text-xs text-slate-400 font-bold mt-1">Especialistas asignados a su entidad</p>
          </div>
          <button @click="cargarDoctoresClinica" class="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer border-none">
            <v-icon name="bi-arrow-clockwise" scale="1.2" :class="{'animate-spin': loadingDoctores}" />
          </button>
        </div>

        <div v-if="loadingDoctores" class="py-12 text-center">
          <div class="animate-spin inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
          <div v-for="doc in doctoresClinica" :key="doc.UsuarioID" class="p-5 border border-slate-800 rounded-2xl bg-slate-800/50 hover:bg-slate-800 hover:shadow-md transition-all flex justify-between items-center">
            <div>
              <p class="text-sm font-black text-white uppercase tracking-tight">{{ doc.NombreCompleto }}</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                {{ doc.Especialidad || 'Médico' }} • Reg: <span class="font-mono text-slate-500">{{ doc.NumeroColegiado || 'N/A' }}</span>
              </p>
            </div>
            <span :class="doc.Estado === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'" class="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg shadow-3xs">
              {{ doc.Estado === 1 ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

          <div v-if="doctoresClinica.length === 0" class="py-8 text-center text-slate-500 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-800 rounded-2xl">
            No hay médicos registrados en esta clínica.
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <RegisterPatientForm @success="loadDashboard" />

        <RegisterDoctorForm :entidadId="clinicId" @success="cargarDoctoresClinica" />
      </div>

    </div>

    <div v-if="activeTab === 'calidad'" class="animate-fade-in">
      <QualityAuditModule entityType="Clinica" :entityId="clinicId" />
    </div>

    <div v-if="activeTab === 'especialidades'" class="animate-fade-in">
      <ClinicSpecialties />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import api from '@/shared/infrastructure/api';
import RegisterPatientForm from '@/shared/ui/components/RegisterPatientForm.vue';
import type { SessionUser } from '../../../../shared/Domain/dashboard.interface';
import type { ClinicDashboardData, DoctorClinica } from '../../Domain/Clinic';

// Componentes Reutilizables
import QualityAuditModule from '../../../../shared/ui/components/QualityAuditModule.vue';
import RegisterDoctorForm from '../../../../shared/ui/components/RegisterDoctorForm.vue';
import ClinicSpecialties from './ClinicSpecialties.vue';
import { ClinicRepository } from '../../infrastructure/ClinicRepository';

// Iconos
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiCalendarEvent,
  BiClockHistory,
  BiCashStack,
  BiShieldFillCheck,
  BiBarChartFill,
  BiArrowClockwise,
  BiFolderFill
} from 'oh-vue-icons/icons';
import { GiStethoscope } from 'oh-vue-icons/icons';

addIcons(BiCalendarEvent, BiClockHistory, BiCashStack, GiStethoscope, BiShieldFillCheck, BiBarChartFill, BiArrowClockwise, BiFolderFill);

const toast = useToast();
const authStore = useAuthStore();
const repo = new ClinicRepository();

const activeTab = ref<'resumen' | 'doctores' | 'calidad' | 'especialidades'>('resumen');
const loadingDoctores = ref(false);

const clinicId = computed<number>(() => {
  const user = authStore.user as SessionUser | null;
  let idRaw = user?.EntidadID;

  if (!idRaw) {
    const localUserRaw = localStorage.getItem('user');
    if (localUserRaw) {
      const localUser = JSON.parse(localUserRaw);
      idRaw = localUser.entidadId ?? localUser.EntidadID ?? localUser.entidad_id;
    }
  }

  const parsedId = Number(idRaw);
  return isNaN(parsedId) ? 0 : parsedId;
});

const dashboardData = ref<ClinicDashboardData>({ kpis: null, citas_recientes: [] });
const doctoresClinica = ref<DoctorClinica[]>([]);

const loadDashboard = async (): Promise<void> => {
  if (!clinicId.value || clinicId.value === 0) return;
  try {
    dashboardData.value = await repo.getDashboardData(clinicId.value);
  } catch (error) {
    console.error("Error cargando dashboard", error);
  }
};

const cargarDoctoresClinica = async (): Promise<void> => {
  if (!clinicId.value || clinicId.value === 0) return;
  loadingDoctores.value = true;
  try {
    const response = await api.get('/admin/doctores/entidad', {
      params: { entidad_id: clinicId.value }
    });
    doctoresClinica.value = response.data.data || [];
  } catch (error) {
    console.error("Error al cargar doctores de la clínica", error);
    toast.error("No se pudo cargar la lista de médicos activos.");
  } finally {
    loadingDoctores.value = false;
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('es-HN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const getEstadoClass = (estado: string) => {
  const e = estado.toLowerCase();
  if (e.includes('pendiente')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  if (e.includes('completada') || e.includes('finalizada')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (e.includes('cancelada')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
};

watch(
  () => authStore.user,
  (newUser) => {
    console.log("[ClinicDashboard] Sincronizando estado Pinia:", newUser);
    if (clinicId.value && clinicId.value !== 0) {
      void loadDashboard();
      void cargarDoctoresClinica();
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (clinicId.value && clinicId.value !== 0) {
    void loadDashboard();
    void cargarDoctoresClinica();
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
