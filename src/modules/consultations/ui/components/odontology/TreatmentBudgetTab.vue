<template>
  <div class="space-y-4 animate-fade-in text-left">
    <div class="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
      <span class="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Presupuesto Acumulado Automático</span>
      <span class="text-xl font-black text-emerald-600">L. {{ totalCalculado }}.00</span>
    </div>
    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-2">
      * Los montos se cargan de forma automática al marcar piezas patológicas en el Odontograma Interactiva.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalCalculado: number;
}>();
</script>
