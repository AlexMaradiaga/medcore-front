<template>
  <div class="space-y-6 animate-fade-in">

    <div v-if="subTab === 'ind-seguridad'">
      <div class="border-b pb-3 mb-6">
        <h3 class="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
          <v-icon name="bi-shield-fill-check" class="text-[#005596]" scale="1.1" />
          Indicadores de Seguridad Clínica
        </h3>
        <p class="text-xs text-slate-400 font-bold">Monitoreo de incidencias metabólicas, tasas críticas y gestión del riesgo del paciente</p>
      </div>

      <div v-if="loading" class="py-12 text-center">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-[#005596] border-t-transparent rounded-full"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white border border-slate-100 shadow-2xs p-5 rounded-3xl text-left space-y-2">
          <span class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Número de errores</span>
          <span class="text-3xl font-mono font-black text-[#005596] block">
            {{ dataCalidad?.ErroresMedicos !== undefined ? String(dataCalidad.ErroresMedicos).padStart(2, '0') : '00' }}
          </span>
          <span class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <v-icon name="bi-check-circle-fill" scale="0.75"/> Por debajo del límite crítico
          </span>
        </div>

        <div class="bg-white border border-slate-100 shadow-2xs p-5 rounded-3xl text-left space-y-2">
          <span class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Tasa de complicaciones</span>
          <span class="text-3xl font-mono font-black text-purple-600 block">{{ dataCalidad?.TasaComplicaciones }}%</span>
          <span class="text-[10px] text-slate-400 font-bold">Ventana de auditoría mensual</span>
        </div>

        <div class="bg-white border border-slate-100 shadow-2xs p-5 rounded-3xl text-left space-y-2">
          <span class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">% Abandono Asesoramiento</span>
          <span class="text-3xl font-mono font-black text-amber-600 block">{{ dataCalidad?.AbandonoAsesoramiento }}%</span>
          <span class="text-[10px] text-amber-600 font-bold flex items-center gap-1">
            <v-icon name="bi-exclamation-triangle-fill" scale="0.75"/> Monitoreo preventivo activo
          </span>
        </div>

        <div class="bg-white border border-slate-100 shadow-2xs p-5 rounded-3xl text-left space-y-2">
          <span class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Tasa Mortalidad Post-Procedimiento</span>
          <span class="text-3xl font-mono font-black text-rose-600 block">{{ dataCalidad?.TasaMortalidad }}%</span>
          <span class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <v-icon name="bi-check-circle-fill" scale="0.75"/> Estándar internacional ISO
          </span>
        </div>
      </div>
    </div>

    <div v-if="subTab === 'ind-eficiencia'">
      <div class="border-b pb-3 mb-6">
        <h3 class="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
          <v-icon name="bi-clock-history" class="text-emerald-600" scale="1.1" />
          Eficiencia, Eficacia y Puntualidad
        </h3>
        <p class="text-xs text-slate-400 font-bold">Auditoría del rendimiento operativo en salas de espera y ocupación física</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white border border-slate-100 shadow-2xs p-6 rounded-3xl flex justify-between items-center">
          <div>
            <span class="block text-[10px] font-black text-slate-400 uppercase">Tasa de readmisión</span>
            <h5 class="text-2xl font-black text-slate-800 mt-1">{{ dataCalidad?.TasaReadmision }}%</h5>
          </div>
          <div class="text-purple-600 bg-purple-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide">Hospitalario</div>
        </div>

        <div class="bg-white border border-slate-100 shadow-2xs p-6 rounded-3xl flex justify-between items-center">
          <div>
            <span class="block text-[10px] font-black text-slate-400 uppercase">Enfermedades intrahospitalarias</span>
            <h5 class="text-2xl font-black text-rose-600 mt-1">{{ dataCalidad?.EnfermedadesIntrahospitalarias }} casos</h5>
          </div>
          <div class="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide">Inocuo</div>
        </div>

        <div class="bg-white border border-slate-100 shadow-2xs p-6 rounded-3xl flex justify-between items-center">
          <div>
            <span class="block text-[10px] font-black text-slate-400 uppercase">Tiempos de espera promedio</span>
            <h5 class="text-2xl font-black text-blue-600 mt-1">{{ dataCalidad?.TiempoEsperaPromedio }} minutos</h5>
          </div>
          <div class="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide">Optimizado</div>
        </div>
      </div>
    </div>

    <div v-if="subTab === 'ind-paciente'">
      <div class="border-b pb-3 mb-6">
        <h3 class="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
          <v-icon name="bi-heart-fill" class="text-rose-600" scale="1.1" />
          Relación con el Paciente y Concurrencia
        </h3>
        <p class="text-xs text-slate-400 font-bold">Frecuencia de comunicación institucional, remisiones e índice de quejas</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-5 border border-slate-100 shadow-2xs rounded-3xl text-left space-y-1">
          <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Frecuencia Comunicación Médico/Paciente</span>
          <p class="text-xl font-black text-slate-800 uppercase tracking-tight">Canal Digital Activo</p>
        </div>

        <div class="bg-white p-5 border border-slate-100 shadow-2xs rounded-3xl text-left space-y-1">
          <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Número de quejas registradas</span>
          <p class="text-2xl font-black text-rose-600 font-mono">{{ dataCalidad?.TotalQuejas }}</p>
        </div>

        <div class="bg-white p-5 border border-slate-100 shadow-2xs rounded-3xl text-left space-y-1">
          <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Satisfacción general del paciente</span>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-black text-emerald-600 font-mono">{{ dataCalidad?.SatisfaccionGeneral }}%</span>
            <v-icon name="bi-star-fill" class="text-amber-400" scale="0.95" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ReportRepository } from '../../admin/infrastructure/ReportRepository';
import type { IndicadoresCalidadContract } from '../../admin/domain/Analytics';
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiShieldFillCheck, BiClockHistory, BiHeartFill, BiCheckCircleFill,
  BiExclamationTriangleFill, BiStarFill
} from 'oh-vue-icons/icons';

addIcons(BiShieldFillCheck, BiClockHistory, BiHeartFill, BiCheckCircleFill, BiExclamationTriangleFill, BiStarFill);

defineProps<{ subTab: string }>();

const repo = new ReportRepository();
const dataCalidad = ref<IndicadoresCalidadContract | null>(null);
const loading = ref<boolean>(true);

onMounted(async () => {
  try {
    dataCalidad.value = await repo.obtenerIndicadoresCalidad();
  } catch (error) {
    console.error("Error al sincronizar indicadores de auditoría clínica:", error);
  } finally {
    loading.value = false;
  }
});
</script>
