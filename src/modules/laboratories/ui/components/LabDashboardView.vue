<template>
  <div class="min-h-screen bg-[#f1f5f9] text-left font-premium p-8 animate-fade-in select-none">

    <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-8 gap-6">
      <div class="space-y-1">
        <span class="bg-linear-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-xs">
          Panel de Control de Laboratorio
        </span>
        <h2 class="text-4xl font-black text-slate-800 uppercase tracking-tight mt-3">
          Bienvenido, <span class="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-600">{{ authStore.user?.nombre || 'Administrador' }}</span>
        </h2>
        <p class="text-slate-500 text-xs font-bold flex items-center gap-2 mt-1">
          <v-icon name="si-flask" scale="0.75" class="text-cyan-500" />
          Gestión analítica, control de reactivos y procesamiento de exámenes de la entidad
        </p>
      </div>

      <div class="flex items-center gap-4">
        <button @click="handleLogout" title="Cerrar Sesión" class="p-4 bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl shadow-sm border border-slate-200 transition-all cursor-pointer flex items-center justify-center">
          <v-icon name="bi-box-arrow-right" scale="1.1" />
        </button>
      </div>
    </header>

    <div class="flex flex-wrap bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 shadow-inner mb-8 w-fit gap-1">
      <button @click="activeTab = 'resumen'" :class="activeTab === 'resumen' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
        <v-icon name="bi-bar-chart-fill" scale="0.85" /> Resumen Operativo
      </button>
      <button @click="activeTab = 'ordenes'" :class="activeTab === 'ordenes' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
        <v-icon name="bi-file-earmark-medical-fill" scale="0.85" /> Órdenes y Muestras
      </button>
      <button @click="activeTab = 'calidad'" :class="activeTab === 'calidad' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
        <v-icon name="bi-shield-fill-check" scale="0.85" /> Auditoría y Calidad
      </button>
      <button @click="activeTab = 'catalogo'" :class="activeTab === 'catalogo' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
        <v-icon name="bi-folder-fill" scale="0.85" /> Catálogo Pruebas
      </button>
    </div>

    <div v-if="activeTab === 'resumen'" class="space-y-8 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Órdenes Totales</p>
          <h3 class="text-3xl font-black text-white mt-2">{{ dashboardData.kpis?.TotalOrdenes ?? 0 }}</h3>
          <v-icon name="bi-file-earmark-medical" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Procesamiento</p>
          <h3 class="text-3xl font-black text-cyan-400 mt-2">{{ dashboardData.kpis?.OrdenesPendientes ?? 0 }}</h3>
          <v-icon name="bi-hourglass-split" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reactivos Críticos</p>
          <h3 class="text-3xl font-black text-rose-400 mt-2">{{ dashboardData.kpis?.AlertasStock ?? 0 }}</h3>
          <v-icon name="bi-exclamation-triangle" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facturación Total</p>
          <h3 class="text-3xl font-black text-emerald-400 mt-2">L. {{ dashboardData.kpis?.IngresosTotales ?? 0 }}</h3>
          <v-icon name="bi-cash-stack" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>
      </div>

      <div class="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 shadow-xs">
        <h3 class="text-xl font-black text-white uppercase tracking-tight mb-6">Últimas Muestras Recibidas</h3>
        <div class="overflow-x-auto border border-slate-800 rounded-2xl">
          <table class="w-full text-sm text-left text-slate-300">
            <thead class="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th class="px-6 py-4">Código Muestra</th>
                <th class="px-6 py-4">Paciente</th>
                <th class="px-6 py-4">Estudio</th>
                <th class="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="orden in dashboardData.ordenes_recientes" :key="orden.OrdenID" class="border-b border-slate-800/60 bg-slate-900 hover:bg-slate-800/40 transition-colors">
                <td class="px-6 py-4 font-mono font-black text-cyan-400 uppercase text-xs">#{{ orden.CodigoOrden || orden.OrdenID }}</td>
                <td class="px-6 py-4 font-bold text-white text-xs uppercase">{{ orden.Paciente }}</td>
                <td class="px-6 py-4 text-xs text-slate-300">{{ orden.Examen }}</td>
                <td class="px-6 py-4">
                  <span :class="getEstadoClass(orden.Estado)" class="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border shadow-3xs">
                    {{ orden.Estado }}
                  </span>
                </td>
              </tr>
              <tr v-if="dashboardData.ordenes_recientes.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                  No se registran órdenes pendientes en el sistema.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'ordenes'" class="animate-fade-in">
      <div class="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8">
        <h3 class="text-xl font-black text-white uppercase tracking-tight mb-2">Procesamiento Analítico</h3>
        <p class="text-xs text-slate-400 font-bold mb-6">Módulo para subir resultados, ingresar valores de referencia y firmar bioquímicamente.</p>
        <div class="py-12 text-center text-slate-500 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-800 rounded-2xl">
          Área de carga de análisis clínicos.
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'calidad'" class="animate-fade-in">
      <QualityAuditModule entityType="Laboratorio" :entityId="labId" />
    </div>

    <div v-if="activeTab === 'catalogo'" class="space-y-8 animate-fade-in">

      <div class="relative max-w-xl">
        <input
          v-model="busquedaExamen"
          type="text"
          placeholder="Buscar exámenes dentro del catálogo..."
          class="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 pl-12 outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#005596] transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
        />
        <v-icon name="bi-search" class="absolute left-4 top-4.5 text-slate-400" scale="0.9" />
      </div>

      <div class="space-y-3">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Categorías de Exámenes</h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categoriasCatalogo"
            :key="cat"
            @click="categoriaSeleccionada = cat"
            :class="categoriaSeleccionada === cat ? 'bg-[#005596] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
            class="px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Lote de Exámenes Analíticos</h4>

        <div v-if="loadingCatalogo" class="py-12 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
          Sincronizando catálogo con base de datos...
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="examen in examenesFiltradosPorCategoria"
            :key="examen.ExamID"
            class="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs flex items-center justify-between gap-4 hover:border-blue-200 transition-all group"
          >
            <div class="text-left">
              <h5 class="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-[#005596] transition-colors">
                {{ examen.NombreExamen }}
              </h5>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <!-- Etiqueta de Categoría (Gris) -->
                <span class="bg-slate-100 text-slate-500 font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {{ examen.Categoria }}
                </span>
                <!-- Etiqueta de Condiciones (Amarilla) -->
                <span v-if="examen.CondicionesPaciente" class="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <v-icon name="bi-exclamation-triangle-fill" scale="0.7" class="text-amber-500" />
                  {{ examen.CondicionesPaciente }}
                </span>
              </div>
            </div>
            <span class="text-lg font-black text-blue-600">${{ obtenerPrecioSimulado(examen.ExamID) }}</span>
          </div>

          <div v-if="examenesFiltradosPorCategoria.length === 0" class="py-12 bg-white rounded-2xl border border-slate-100 text-center text-slate-400 font-bold text-xs uppercase tracking-widest shadow-2xs">
            No hay estudios registrados bajo la categoría "{{ categoriaSeleccionada }}" o criterios de búsqueda.
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { addIcons } from 'oh-vue-icons';
import api from '@/shared/infrastructure/api';

import {
  BiBarChartFill, BiFileEarmarkMedicalFill, BiShieldFillCheck, BiFolderFill,
  BiCalendarEvent, BiClockHistory, BiCashStack, BiHourglassSplit,
  BiExclamationTriangle, BiFileEarmarkMedical, SiFlask, BiBoxArrowRight,
  BiSearch, BiClock, BiExclamationTriangleFill
} from 'oh-vue-icons/icons';
import { GiStethoscope } from 'oh-vue-icons/icons';

import QualityAuditModule from '@/shared/ui/components/QualityAuditModule.vue';
import type { SessionUser } from '@/shared/Domain/dashboard.interface';

addIcons(
  BiBarChartFill, BiFileEarmarkMedicalFill, BiShieldFillCheck, BiFolderFill,
  BiCalendarEvent, BiClockHistory, BiCashStack, GiStethoscope,
  BiHourglassSplit, BiExclamationTriangle, BiFileEarmarkMedical, SiFlask, BiBoxArrowRight,
  BiSearch, BiClock, BiExclamationTriangleFill
);

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const activeTab = ref<'resumen' | 'ordenes' | 'calidad' | 'catalogo'>('resumen');
const busquedaExamen = ref<string>('');
const categoriaSeleccionada = ref<string>('Todos');
const loadingCatalogo = ref<boolean>(false);

const labId = computed<number>(() => {
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

interface LaboratoryKpis {
  TotalOrdenes: number;
  OrdenesPendientes: number;
  AlertasStock: number;
  IngresosTotales: number;
}

interface RecentOrder {
  OrdenID: number;
  CodigoOrden?: string;
  Paciente: string;
  Examen: string;
  Estado: string;
}

interface LaboratoryDashboardData {
  kpis: LaboratoryKpis | null;
  ordenes_recientes: RecentOrder[];
}

interface ExamenCatalogo {
  ExamID: number;
  NombreExamen: string;
  Categoria: string;
  CondicionesPaciente?: string;
}

const dashboardData = ref<LaboratoryDashboardData>({ kpis: null, ordenes_recientes: [] });
const listaExamenes = ref<ExamenCatalogo[]>([]);

const categoriasCatalogo = computed<string[]>(() => {
  const categoriasUnicas = new Set(listaExamenes.value.map(ex => ex.Categoria));
  return ['Todos', ...Array.from(categoriasUnicas)];
});

const loadDashboardData = async (): Promise<void> => {
  if (!labId.value || labId.value === 0) return;
  try {
    const response = await api.get('/laboratorio/dashboard-metrics', {
      params: { laboratorio_id: labId.value }
    });
    if (response.data && response.data.status === 'success') {
      dashboardData.value = response.data.data as LaboratoryDashboardData;
    }
  } catch  {
    console.error("[LabDashboard] Error cargando KPIs:");
  }
};

const loadCatalogoExamenes = async (): Promise<void> => {
  loadingCatalogo.value = true;
  try {
    const response = await api.get('/laboratorio/catalogo');
    listaExamenes.value = response.data.datos || [];
  } catch  {
    toast.error("Error al cargar el catálogo de exámenes.");
  } finally {
    loadingCatalogo.value = false;
  }
};

const examenesFiltradosPorCategoria = computed<ExamenCatalogo[]>(() => {
  let resultado = listaExamenes.value;

  if (categoriaSeleccionada.value !== 'Todos') {
    resultado = resultado.filter((ex: ExamenCatalogo) =>
      ex.Categoria.toLowerCase() === categoriaSeleccionada.value.toLowerCase()
    );
  }

  const query = busquedaExamen.value.toLowerCase().trim();
  if (query) {
    resultado = resultado.filter((ex: ExamenCatalogo) =>
      ex.NombreExamen.toLowerCase().includes(query) ||
      (ex.CondicionesPaciente && ex.CondicionesPaciente.toLowerCase().includes(query))
    );
  }

  return resultado;
});

const obtenerPrecioSimulado = (id: number): number => {
  const precios: Record<number, number> = { 1: 25, 2: 15, 3: 20, 4: 10, 5: 45, 6: 15 };
  return precios[id] || 35;
};

const getEstadoClass = (estado: string) => {
  const e = estado.toLowerCase();
  if (e.includes('pendiente') || e.includes('espera')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  if (e.includes('listo') || e.includes('completado') || e.includes('entregado') || e.includes('finalizado')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
};

const handleLogout = () => {
  if (!confirm('¿Está seguro que desea cerrar la sesión del panel de laboratorio?')) return;
  localStorage.clear();
  router.push('/');
};

watch(
  () => authStore.user,
  () => {
    if (labId.value && labId.value !== 0) {
      void loadDashboardData();
      void loadCatalogoExamenes();
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (labId.value && labId.value !== 0) {
    void loadDashboardData();
    void loadCatalogoExamenes();
  }
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>
