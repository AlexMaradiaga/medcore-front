<template>
  <div class="flex flex-col items-center p-1 border border-slate-100 rounded-xl bg-white shadow-3xs select-none min-w-11">
    <span class="text-[9px] font-black text-slate-400 mb-1 font-mono">#{{ id }}</span>

    <div class="relative w-8 h-8 bg-slate-100 rounded-md overflow-hidden border border-slate-300">
      <div
        @click="seleccionarCara('vestibular')"
        :class="['absolute top-0 left-0 right-0 h-2.5 border-b border-slate-200 cursor-pointer transition-colors', obtenerColor('vestibular')]"
        title="Vestibular"
      ></div>
      <div
        @click="seleccionarCara('mesial')"
        :class="['absolute top-0 bottom-0 left-0 w-2.5 border-r border-slate-200 cursor-pointer transition-colors', obtenerColor('mesial')]"
        title="Mesial"
      ></div>
      <div
        @click="seleccionarCara('oclusal')"
        :class="['absolute inset-2 border rounded-xs border-slate-300 cursor-pointer transition-colors', obtenerColor('oclusal')]"
        title="Oclusal"
      ></div>
      <div
        @click="seleccionarCara('distal')"
        :class="['absolute top-0 bottom-0 right-0 w-2.5 border-l border-slate-200 cursor-pointer transition-colors', obtenerColor('distal')]"
        title="Distal"
      ></div>
      <div
        @click="seleccionarCara('lingual')"
        :class="['absolute bottom-0 left-0 right-0 h-2.5 border-t border-slate-200 cursor-pointer transition-colors', obtenerColor('lingual')]"
        title="Lingual"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number;
  modelValue: Record<string, string>;
  selectedDiagnostic: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string>): void;
}>();

const seleccionarCara = (cara: string): void => {
  const copiaCaras = { ...props.modelValue };
  copiaCaras[cara] = copiaCaras[cara] === props.selectedDiagnostic ? 'Sano' : props.selectedDiagnostic;
  emit('update:modelValue', copiaCaras);
};

const obtenerColor = (cara: string): string => {
  const estado = props.modelValue ? props.modelValue[cara] : 'Sano';
  if (estado === 'Caries') return 'bg-rose-500 hover:bg-rose-600';
  if (estado === 'Corona') return 'bg-amber-400 hover:bg-amber-500';
  if (estado === 'Ausente') return 'bg-slate-400 hover:bg-slate-500';
  return 'bg-white hover:bg-blue-50';
};
</script>
