<template>
  <div class="space-y-6 animate-fade-in text-left">
    <h3 class="text-sm font-black text-slate-700 uppercase tracking-tight mb-4">
      Resultados de Laboratorio <span class="text-slate-400 font-medium text-xs font-mono">({{ data.length }} registrados)</span>
    </h3>

    <div v-for="(exam, index) in data" :key="index"
      class="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs space-y-4 hover:border-blue-100 transition-all">

      <div class="flex justify-between items-center border-b border-slate-50 pb-3">
        <div>
          <h4 class="text-sm font-black text-slate-800 uppercase tracking-tight">{{ exam.estudio }}</h4>
          <p class="text-[9px] font-bold text-slate-400 tracking-wide">{{ formatDate(exam.fecha) }}</p>
        </div>
        <button @click="handleDownload(exam)" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-black rounded-xl uppercase transition-all flex items-center gap-1">
          📥 Descargar PDF
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-50/60 p-4 rounded-2xl border border-slate-100/50 flex justify-between items-center">
          <div class="text-left">
            <p class="text-xs font-black text-slate-700">Glóbulos Rojos</p>
            <p class="text-[9px] text-slate-400 font-bold">Normal: 4.5 - 5.5</p>
          </div>
          <span class="bg-emerald-100 text-emerald-700 font-black font-mono text-[10px] px-2.5 py-1 rounded-full">4.8 mil/mm³</span>
        </div>

        <div class="bg-slate-50/60 p-4 rounded-2xl border border-slate-100/50 flex justify-between items-center">
          <div class="text-left">
            <p class="text-xs font-black text-slate-700">Hemoglobina</p>
            <p class="text-[9px] text-slate-400 font-bold">Normal: 13 - 17</p>
          </div>
          <span class="bg-emerald-100 text-emerald-700 font-black font-mono text-[10px] px-2.5 py-1 rounded-full">14.2 g/dL</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import type { ExamenLaboratorio } from '../../../domain/PatientHistory';

defineProps<{ data: ExamenLaboratorio[] }>();

const toast = useToast();

const formatDate = (dateStr: string) => {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const handleDownload = (exam: ExamenLaboratorio) => {
  if (exam.url_pdf) {
    window.open(exam.url_pdf, '_blank');
  } else {
    toast.warning('Archivo adjunto consolidado en la infraestructura de datos.');
  }
};
</script>
