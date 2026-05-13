<template>
  <div class="space-y-8 animate-fade-in">
    <div v-if="data.length === 0" class="text-center py-10 text-slate-400 text-[10px] font-black uppercase">
      No hay suficientes datos para generar comparativos.
    </div>

    <div v-else class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h6 class="text-xs font-black text-slate-700 uppercase tracking-[0.2em]">Presión Arterial (Sistólica)</h6>
          <p class="text-[9px] font-bold text-slate-400 uppercase mt-1">Evolución en las últimas 6 consultas</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 bg-[#0088cc] rounded-full animate-pulse"></span>
          <span class="text-[#0088cc] text-[9px] font-black uppercase tracking-widest">Historial</span>
        </div>
      </div>

      <div class="flex justify-between items-end gap-5 h-48 px-4">
        <div v-for="(val, i) in data" :key="i" class="flex-1 flex flex-col items-center gap-4 group">
          <div class="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 bg-slate-800 text-white text-[9px] font-black p-2 px-3 rounded-xl mb-1 shadow-xl whitespace-nowrap">
            {{ val.presion || '0/0' }} mmHg
          </div>

          <div
            class="w-full bg-[#0088cc] rounded-t-3xl transition-all duration-1000 ease-out shadow-lg shadow-blue-50 hover:bg-blue-600 cursor-pointer"
            :style="{ height: calculateBarHeight(val.presion) + '%' }">
          </div>

          <span class="text-[8px] font-black text-slate-400 uppercase -rotate-45 mt-6 whitespace-nowrap">
            {{ formatShortDate(val.periodo) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SignoVitalHistorico } from '../../../domain/PatientHistory';

defineProps<{
  data: SignoVitalHistorico[]
}>();

const formatShortDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-HN', {
    month: 'short',
    day: 'numeric'
  });
};

const calculateBarHeight = (presionValue: string | null | undefined): number => {
  if (!presionValue || typeof presionValue !== 'string') return 10;

  const partes = presionValue.split('/');
  const sistolicaStr = partes[0];

  if (!sistolicaStr) return 10;
  const num = parseInt(sistolicaStr, 10);
  if (isNaN(num)) return 10;
  const porcentaje = (num / 200) * 100;
  return Math.min(Math.max(porcentaje, 10), 100);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
