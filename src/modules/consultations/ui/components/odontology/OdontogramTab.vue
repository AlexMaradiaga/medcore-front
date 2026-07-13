<template>
  <div class="space-y-6 animate-fade-in text-left">

    <div class="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
      <div class="flex bg-slate-200/70 p-1 rounded-xl border border-slate-300/40">
        <button @click="tipo = 'adulto'" :class="tipo === 'adulto' ? 'bg-white text-[#005596] shadow-xs' : 'text-slate-500'" class="px-4 py-1.5 text-xs font-black uppercase rounded-lg transition-all cursor-pointer">Adulto</button>
        <button @click="tipo = 'pediatrico'" :class="tipo === 'pediatrico' ? 'bg-white text-[#005596] shadow-xs' : 'text-slate-500'" class="px-4 py-1.5 text-xs font-black uppercase rounded-lg transition-all cursor-pointer">Pediátrico</button>
      </div>

      <div class="flex gap-2">
        <button
          v-for="opcion in paleta"
          :key="opcion.id"
          @click="diagnosticoSeleccionado = opcion.id"
          :class="[
            'px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border',
            diagnosticoSeleccionado === opcion.id ? opcion.activeClass : 'bg-white text-slate-600 border-slate-200'
          ]"
        >
          <span :class="['w-2 h-2 rounded-full', opcion.colorClass]"></span>
          {{ opcion.label }}
        </button>
      </div>
    </div>

    <div class="bg-white border border-slate-200/80 p-6 rounded-4xl shadow-3xs space-y-6">

      <div class="space-y-2 border-b border-dashed border-slate-200 pb-4">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center">Arcada Maxilar (Superior)</span>
        <div class="flex justify-center gap-1 overflow-x-auto py-1">

            <ToothItem
              v-for="id in (tipo === 'adulto' ? cuadrante1Adulto : cuadrante1Ped)"
              :key="id"
              :id="id"
              :modelValue="odontogramaData[id] || { vestibular: 'Sano', mesial: 'Sano', oclusal: 'Sano', distal: 'Sano', lingual: 'Sano' }"
              @update:modelValue="actualizarPieza(id, $event)"
              :selectedDiagnostic="diagnosticoSeleccionado"
            />
          <div class="w-0.5 bg-slate-300 mx-2 self-stretch"></div>
          <ToothItem
            v-for="id in (tipo === 'adulto' ? cuadrante2Adulto : cuadrante2Ped)"
            :key="id"
            :id="id"
            :modelValue="odontogramaData[id] || { vestibular: 'Sano', mesial: 'Sano', oclusal: 'Sano', distal: 'Sano', lingual: 'Sano' }"
            @update:modelValue="actualizarPieza(id, $event)"
            :selectedDiagnostic="diagnosticoSeleccionado"
          />
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-center gap-1 overflow-x-auto py-1">
          <ToothItem
            v-for="id in (tipo === 'adulto' ? cuadrante3Adulto : cuadrante3Ped)"
            :key="id"
            :id="id"
            :modelValue="odontogramaData[id] || { vestibular: 'Sano', mesial: 'Sano', oclusal: 'Sano', distal: 'Sano', lingual: 'Sano' }"
            @update:modelValue="actualizarPieza(id, $event)"
            :selectedDiagnostic="diagnosticoSeleccionado"
          />
          <div class="w-0.5 bg-slate-300 mx-2 self-stretch"></div>
          <ToothItem
            v-for="id in (tipo === 'adulto' ? cuadrante4Adulto : cuadrante4Ped)"
            :key="id"
            :id="id"
            :modelValue="odontogramaData[id] || { vestibular: 'Sano', mesial: 'Sano', oclusal: 'Sano', distal: 'Sano', lingual: 'Sano' }"
            @update:modelValue="actualizarPieza(id, $event)"
            :selectedDiagnostic="diagnosticoSeleccionado"
          />
        </div>
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center">Arcada Mandibular (Inferior)</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ToothItem from './ToothItem.vue';

const emit = defineEmits(['update:odontograma']);

const tipo = ref<'adulto' | 'pediatrico'>('adulto');
const diagnosticoSeleccionado = ref('Caries');

const cuadrante1Adulto = [18, 17, 16, 15, 14, 13, 12, 11];
const cuadrante2Adulto = [21, 22, 23, 24, 25, 26, 27, 28];
const cuadrante3Adulto = [31, 32, 33, 34, 35, 36, 37, 38];
const cuadrante4Adulto = [48, 47, 46, 45, 44, 43, 42, 41];

const cuadrante1Ped = [55, 54, 53, 52, 51];
const cuadrante2Ped = [61, 62, 63, 64, 65];
const cuadrante3Ped = [71, 72, 73, 74, 75];
const cuadrante4Ped = [85, 84, 83, 82, 81];

const paleta = [
  { id: 'Caries', label: 'Caries', colorClass: 'bg-rose-500', activeClass: 'bg-rose-50 text-rose-700 border-rose-300 shadow-3xs' },
  { id: 'Corona', label: 'Corona / Endodoncia', colorClass: 'bg-amber-400', activeClass: 'bg-amber-50 text-amber-700 border-amber-300 shadow-3xs' },
  { id: 'Ausente', label: 'Ausente', colorClass: 'bg-slate-400', activeClass: 'bg-slate-50 text-slate-700 border-slate-300 shadow-3xs' }
];

const odontogramaData = ref<Record<number, Record<string, string>>>({});

const actualizarPieza = (id: number, nuevasCaras: Record<string, string>) => {
  odontogramaData.value[id] = nuevasCaras;
  emit('update:odontograma', { tipo: tipo.value, datos: odontogramaData.value });
};

onMounted(() => {
  const todasLasPiezas = [
    ...cuadrante1Adulto, ...cuadrante2Adulto, ...cuadrante3Adulto, ...cuadrante4Adulto,
    ...cuadrante1Ped, ...cuadrante2Ped, ...cuadrante3Ped, ...cuadrante4Ped
  ];
  todasLasPiezas.forEach((id) => {
    odontogramaData.value[id] = { vestibular: 'Sano', mesial: 'Sano', oclusal: 'Sano', distal: 'Sano', lingual: 'Sano' };
  });
});
</script>
