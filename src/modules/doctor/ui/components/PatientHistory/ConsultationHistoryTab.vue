<template>
  <div class="space-y-6 animate-fade-in">
    <div v-if="data.length === 0" class="text-center py-10 text-slate-400 text-[10px] font-black uppercase tracking-widest">
      No hay consultas registradas en el historial.
    </div>

    <div v-for="(item, index) in data" :key="index"
      class="border border-slate-100 rounded-[2.5rem] p-8 hover:bg-slate-50 transition-all group bg-white shadow-sm">

      <div class="flex justify-between items-start mb-6">
        <div>
          <span class="text-[10px] font-black text-[#0088cc] bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-tighter">
            {{ formatDate(item.fecha) }}
          </span>
          <h5 class="text-sm font-black text-slate-700 uppercase mt-4">
            Dr. {{ item.medico }} • <span class="text-slate-400 font-bold">{{ item.especialidad }}</span>
          </h5>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-slate-50/50 p-6 rounded-4xl border border-slate-100 group-hover:bg-white transition-colors">
          <p class="text-[9px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-blue-400 rounded-full"></span> Diagnóstico
          </p>
          <p class="text-xs font-bold text-slate-600 leading-relaxed italic">
            "{{ item.diagnostico }}"
          </p>
        </div>

        <div class="bg-slate-50/50 p-6 rounded-4xl border border-slate-100 group-hover:bg-white transition-colors">
          <p class="text-[9px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-green-400 rounded-full"></span> Plan / Tratamiento
          </p>
          <p class="text-xs font-bold text-slate-600 leading-relaxed">{{ item.tratamiento }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConsultaPrevia } from '../../../domain/PatientHistory';

defineProps<{
  data: ConsultaPrevia[]
}>();

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Fecha no disponible';

  try {
    const fecha = new Date(dateStr);
    return fecha.toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch{
    return 'Formato de fecha inválido';
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
