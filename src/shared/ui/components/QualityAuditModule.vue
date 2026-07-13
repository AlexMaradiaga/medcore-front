<template>
  <div class="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-xl p-8 text-left animate-fade-in">

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-800 pb-5">
      <div>
        <h3 class="text-xl font-black text-white uppercase tracking-tight">Indicadores de Calidad y Cumplimiento</h3>
        <p class="text-xs text-slate-400 font-bold mt-1">Métricas de rendimiento e incidencias extraídas de auditoría clínica de la entidad.</p>
      </div>
      <button
        @click="printAuditReport"
        class="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-md cursor-pointer print:hidden"
      >
        <v-icon name="bi-printer-fill" scale="1.1" />
        Imprimir Reporte
      </button>
    </div>

    <div v-if="loading" class="py-12 text-center">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
    </div>

    <div v-else-if="auditData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div class="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xs">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satisfacción General</p>
        <h3 class="text-3xl font-black text-emerald-400 mt-2">{{ auditData.SatisfaccionGeneral }}%</h3>
        <p class="text-[10px] text-slate-500 font-bold mt-1">Evaluación de experiencia del paciente</p>
      </div>

      <div class="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xs">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiempo de Espera</p>
        <h3 class="text-3xl font-black text-white mt-2">{{ auditData.TiempoEsperaPromedio }} min</h3>
        <p class="text-[10px] text-slate-500 font-bold mt-1">Promedio en sala de atención médica</p>
      </div>

      <div class="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xs">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Quejas</p>
        <h3 class="text-3xl font-black text-amber-400 mt-2">{{ Number(auditData.TotalQuejas).toFixed(0) }}</h3>
        <p class="text-[10px] text-slate-500 font-bold mt-1">Incidencias reportadas este período</p>
      </div>

      <div class="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xs">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Errores Médicos</p>
        <h3 :class="Number(auditData.ErroresMedicos) > 0 ? 'text-rose-400' : 'text-slate-300'" class="text-3xl font-black mt-2">
          {{ Number(auditData.ErroresMedicos).toFixed(0) }}
        </h3>
        <p class="text-[10px] text-slate-500 font-bold mt-1">Desviaciones en expedientes o praxis</p>
      </div>

      <div class="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xs">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasa de Readmisión</p>
        <h3 class="text-3xl font-black text-blue-400 mt-2">{{ auditData.TasaReadmision }}%</h3>
        <p class="text-[10px] text-slate-500 font-bold mt-1">Retornos hospitalarios antes de 30 días</p>
      </div>

      <div class="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xs">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasa Complicaciones</p>
        <h3 class="text-3xl font-black text-orange-400 mt-2">{{ Number(auditData.TasaComplicaciones).toFixed(2) }}%</h3>
        <p class="text-[10px] text-slate-500 font-bold mt-1">Eventos adversos registrados</p>
      </div>

    </div>

    <div v-else class="py-12 text-center text-slate-500 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-800 rounded-2xl">
      No se pudieron recuperar las métricas de calidad de la base de datos.
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '@/shared/infrastructure/api';
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import { BiPrinterFill } from 'oh-vue-icons/icons';

addIcons(BiPrinterFill);

const props = defineProps<{
  entityType: 'Clinica' | 'Laboratorio' | 'General';
  entityId: number | string;
}>();

// Estructura tipada basada de forma exacta en tu JSON real
interface AuditIndicators {
  ErroresMedicos: string;
  TasaComplicaciones: string;
  AbandonoAsesoramiento: string;
  TasaMortalidad: string;
  TasaReadmision: string;
  EnfermedadesIntrahospitalarias: string;
  TiempoEsperaPromedio: string;
  TotalQuejas: string;
  SatisfaccionGeneral: string;
}

const auditData = ref<AuditIndicators | null>(null);
const loading = ref<boolean>(false);

const fetchAuditData = async (): Promise<void> => {
  if (!props.entityId || props.entityId === 0) return;

  loading.value = true;
  try {
    const response = await api.get(`/audit/quality`, {
      params: { type: props.entityType.toLowerCase(), id: props.entityId }
    });

    auditData.value = response.data.data || null;
  } catch (error) {
    console.error("[QualityAuditModule] Error consultando auditoría:", error);
    auditData.value = null;
  } finally {
    loading.value = false;
  }
};

watch(() => props.entityId, () => { void fetchAuditData(); });
onMounted(() => { void fetchAuditData(); });

const printAuditReport = (): void => { window.print(); };
</script>
