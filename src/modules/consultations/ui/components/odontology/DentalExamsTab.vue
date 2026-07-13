<template>
  <div class="space-y-8 animate-fade-in text-left">

    <section class="space-y-3">
      <div class="flex items-center gap-2 mb-1">
        <v-icon name="bi-heart-pulse" class="text-blue-500" scale="0.8" />
        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encías (Gingiva)</h4>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="opcion in opcionesEncias" :key="opcion"
          @click="form.encias = opcion"
          :class="form.encias === opcion ? 'bg-[#009688] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60'"
          class="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer active:scale-95"
        >
          {{ opcion }}
        </button>
      </div>
    </section>

    <section class="space-y-3">
      <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Condición Dental</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label
          v-for="item in listaCondiciones" :key="item.key"
          class="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all cursor-pointer group shadow-3xs"
        >
          <div class="relative flex items-center justify-center">
            <input
              type="checkbox"
              v-model="form.condiciones[item.key]"
              class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-[#005596] checked:bg-[#005596]"
            />
            <v-icon name="bi-check" class="absolute text-white opacity-0 peer-checked:opacity-100" scale="0.8" />
          </div>
          <span class="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tight">{{ item.label }}</span>
        </label>
      </div>
    </section>

    <section class="space-y-3">
      <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Oclusión</h4>
      <div class="flex gap-2">
        <button
          v-for="opcion in (['Normal', 'Alterada'] as const)" :key="opcion"
          @click="form.oclusion = opcion"
          :class="form.oclusion === opcion ? 'bg-[#009688] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60'"
          class="px-6 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer"
        >
          {{ opcion }}
        </button>
      </div>
    </section>

    <section class="space-y-2">
      <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Notas Adicionales</h4>
      <textarea v-model="form.notas" class="w-full bg-slate-50/50 border border-slate-200 rounded-3xl p-5 outline-none focus:bg-white focus:border-blue-300 transition-all font-medium text-slate-600 min-h-32 shadow-inner text-sm"></textarea>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { DentalExamData } from '../../../../doctor/domain/DoctorAppointment';

const emit = defineEmits<{
  (e: 'update:examenes', value: DentalExamData): void
}>();

const opcionesEncias: DentalExamData['encias'][] = ['Normal', 'Inflamadas', 'Sangrantes'];

const listaCondiciones: { key: keyof DentalExamData['condiciones']; label: string }[] = [
  { key: 'placa', label: 'Presencia de Placa' },
  { key: 'calculo', label: 'Presencia de Cálculo (Sarro)' },
  { key: 'sensibilidad', label: 'Sensibilidad Dentinaria' },
  { key: 'movilidad', label: 'Movilidad Dental' }
];

const form = ref<DentalExamData>({
  encias: 'Normal',
  condiciones: { placa: false, calculo: false, sensibilidad: false, movilidad: false },
  oclusion: 'Normal',
  notas: ''
});

watch(form, (val) => { emit('update:examenes', val); }, { deep: true });
</script>
