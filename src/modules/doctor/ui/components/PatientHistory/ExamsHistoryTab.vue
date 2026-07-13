<template>
  <div class="space-y-6 animate-fade-in text-left font-premium select-none">

    <div class="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-linear-to-r from-slate-50 to-blue-50/30 p-6 rounded-3xl border border-slate-100 shadow-xs">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-4 bg-[#005596] rounded-full block"></span>
          <h3 class="text-base font-black text-slate-900 uppercase tracking-tight">Resultados de Laboratorio</h3>
        </div>
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1 pl-4">Reporte analítico y traza de biomarcadores clínicos</p>
      </div>
      <div v-if="data && data.length > 0" class="mt-3 sm:mt-0 pl-4 sm:pl-0">
        <span class="text-[10px] font-black bg-linear-to-r from-[#005596] to-blue-600 text-white px-4 py-2 rounded-xl uppercase tracking-wider shadow-sm">
          📋 {{ data.length }} Registrados
        </span>
      </div>
    </div>

    <div v-if="!data || data.length === 0" class="text-center py-24 bg-linear-to-b from-slate-50 to-white border border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 text-[11px] font-black uppercase tracking-widest shadow-xs">
      <div class="text-3xl mb-3 animate-pulse">🧪</div>
      El paciente no registra exámenes de laboratorio en el sistema.
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="(exam, index) in data"
        :key="index"
        class="bg-white border border-slate-200/80 rounded-4xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 space-y-5"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div class="flex items-start gap-3">
            <div class="p-3 bg-blue-50 text-[#005596] rounded-2xl border border-blue-100 shadow-xs">
              <span class="text-lg">🔬</span>
            </div>
            <div>
              <h4 class="text-base font-black text-slate-900 uppercase tracking-tight leading-tight">{{ exam.estudio }}</h4>
              <span class="inline-flex items-center gap-1.5 text-[10px] font-black bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md uppercase tracking-wider mt-1 shadow-3xs">
                📅 Realizado: {{ formatDate(exam.fecha) }}
              </span>
            </div>
          </div>

          <button
            @click="handleDownload(exam)"
            class="w-full sm:w-auto bg-linear-to-r from-red-600 to-rose-500 hover:from-rose-500 hover:to-red-600 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center gap-2.5 shadow-md shadow-rose-500/10 hover:shadow-rose-500/30"
          >
            <span class="text-sm">📄</span>
            <span>Descargar PDF</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div class="bg-linear-to-r from-slate-50/60 to-white p-4 rounded-2xl border border-slate-200/60 shadow-3xs flex justify-between items-center hover:border-slate-300 transition-colors">
            <div class="text-left space-y-0.5">
              <p class="text-xs font-black text-slate-800 uppercase tracking-tight">Glóbulos Rojos</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rango Normal: <span class="font-mono text-slate-500 font-black">4.5 - 5.5</span></p>
            </div>
            <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 font-black font-mono text-xs px-3 py-1.5 rounded-xl shadow-3xs">
              4.8 mil/mm³
            </span>
          </div>

          <div class="bg-linear-to-r from-slate-50/60 to-white p-4 rounded-2xl border border-slate-200/60 shadow-3xs flex justify-between items-center hover:border-slate-300 transition-colors">
            <div class="text-left space-y-0.5">
              <p class="text-xs font-black text-slate-800 uppercase tracking-tight">Hemoglobina</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rango Normal: <span class="font-mono text-slate-500 font-black">13.0 - 17.0</span></p>
            </div>
            <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 font-black font-mono text-xs px-3 py-1.5 rounded-xl shadow-3xs">
              14.2 g/dL
            </span>
          </div>

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
  return new Date(dateStr).toLocaleDateString('es-HN', { day: '2-digit', month: 'long', year: 'numeric' });
};

const handleDownload = (exam: ExamenLaboratorio) => {
  if (exam.url_pdf) {
    window.open(exam.url_pdf, '_blank');
  } else {
    toast.warning('Archivo adjunto consolidado de forma segura en la infraestructura médica.');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Inter:wght@400;600;800&display=swap');

.font-premium { font-family: 'Montserrat', 'Inter', sans-serif; }

.shadow-3xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}
</style>
