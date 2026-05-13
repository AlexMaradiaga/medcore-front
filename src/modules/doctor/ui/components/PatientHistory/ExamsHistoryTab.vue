<template>
  <div class="grid grid-cols-1 gap-4 animate-fade-in">
    <div v-if="data.length === 0" class="text-center py-10 text-slate-400 text-[10px] font-black uppercase">
      No hay exámenes de laboratorio registrados.
    </div>

    <div v-for="(exam, index) in data" :key="index"
      class="flex items-center justify-between p-6 bg-white rounded-4xl border border-slate-100 hover:border-[#0088cc] transition-all shadow-sm group">

      <div class="flex items-center gap-5">
        <div class="bg-blue-50 p-4 rounded-2xl text-[#0088cc] group-hover:bg-[#0088cc] group-hover:text-white transition-colors">
          <span class="text-xl">📄</span>
        </div>
        <div>
          <h6 class="text-xs font-black text-slate-700 uppercase tracking-wide">{{ exam.estudio }}</h6>
          <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">
            Cargado el: {{ formatDate(exam.fecha) }}
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <button @click="handleDownload(exam)"
          class="bg-slate-900 p-3 px-6 rounded-2xl text-[9px] font-black text-white uppercase hover:bg-[#0088cc] transition-all shadow-lg active:scale-95">
          Ver / Descargar PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExamenLaboratorio } from '../../../domain/PatientHistory';

defineProps<{
  data: ExamenLaboratorio[]
}>();

const formatDate = (dateStr: string) => {
  if (!dateStr) return '---';
  // Usamos el locale de Honduras para consistencia
  return new Date(dateStr).toLocaleDateString('es-HN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const handleDownload = (exam: ExamenLaboratorio) => {
  if (exam.url_pdf) {
    window.open(exam.url_pdf, '_blank');
  } else {
    alert('Este examen no tiene un archivo digital adjunto.');
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
