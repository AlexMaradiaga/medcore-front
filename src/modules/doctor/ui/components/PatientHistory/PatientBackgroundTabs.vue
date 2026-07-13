<template>
  <div class="bg-white border border-slate-200 rounded-4xl p-6 shadow-xs text-left font-premium">

    <div class="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
      <v-icon name="bi-person-lines-fill" class="text-[#005596]" scale="1" />
      <h3 class="text-xs font-black text-slate-800 uppercase tracking-wider">
        Antecedentes Clínicos Declarados por el Paciente
      </h3>
    </div>

    <div class="flex bg-slate-100 p-1 rounded-xl mb-5 w-fit border border-slate-200/60 gap-1">
      <button
        type="button"
        @click="activeSubTab = 'cronicas'"
        :class="activeSubTab === 'cronicas' ? 'bg-white text-slate-900 font-black shadow-3xs' : 'text-slate-500 font-bold hover:text-slate-800'"
        class="px-4 py-2 text-[11px] uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
      >
        <v-icon name="bi-activity" scale="0.8" /> Crónicas
      </button>

      <button
        type="button"
        @click="activeSubTab = 'alergias'"
        :class="activeSubTab === 'alergias' ? 'bg-white text-slate-900 font-black shadow-3xs' : 'text-slate-500 font-bold hover:text-slate-800'"
        class="px-4 py-2 text-[11px] uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
      >
        <v-icon name="bi-exclamation-triangle-fill" scale="0.8" class="text-amber-500" /> Alergias
      </button>

      <button
        type="button"
        @click="activeSubTab = 'medicamentos'"
        :class="activeSubTab === 'medicamentos' ? 'bg-white text-slate-900 font-black shadow-3xs' : 'text-slate-500 font-bold hover:text-slate-800'"
        class="px-4 py-2 text-[11px] uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
      >
        <v-icon name="bi-capsule" scale="0.8" class="text-purple-500" /> Medicación Actual
      </button>
    </div>

    <div class="animate-fade-in text-xs leading-relaxed">

      <div v-if="activeSubTab === 'cronicas'" class="space-y-2">
        <p class="text-[10px] uppercase font-black text-slate-400 tracking-wider">Patologías Preexistentes:</p>
        <div v-if="enfermedadesText && enfermedadesText !== 'NULL' && enfermedadesText !== 'Ninguna'" class="p-4 bg-rose-50/50 border border-rose-100 rounded-xl text-rose-900 font-medium">
          {{ enfermedadesText }}
        </div>
        <div v-else class="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-bold uppercase tracking-wide text-center">
          Sin patologías crónicas reportadas.
        </div>
      </div>

      <div v-if="activeSubTab === 'alergias'" class="space-y-2">
        <p class="text-[10px] uppercase font-black text-slate-400 tracking-wider">Reacciones o Alérgenos Detectados:</p>
        <div v-if="alergiasText && alergiasText !== 'NULL' && alergiasText !== 'ninguna' && alergiasText !== 'Ninguna'" class="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-amber-900 font-bold">
          ⚠️ {{ alergiasText }}
        </div>
        <div v-else class="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-bold uppercase tracking-wide text-center">
          No registra reacciones alérgicas conocidas.
        </div>
      </div>

      <div v-if="activeSubTab === 'medicamentos'" class="space-y-2">
        <p class="text-[10px] uppercase font-black text-slate-400 tracking-wider">Tratamientos en Curso:</p>
        <div v-if="medicamentosText && medicamentosText !== 'NULL' && medicamentosText !== 'ninguno' && medicamentosText !== 'Ninguno'" class="p-4 bg-purple-50/50 border border-purple-100 rounded-xl text-purple-900 font-medium">
          <span class="font-mono">{{ medicamentosText }}</span>
        </div>
        <div v-else class="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-bold uppercase tracking-wide text-center">
          No consume medicamentos declarados actualmente.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  enfermedadesText: string | null;
  alergiasText: string | null;
  medicamentosText: string | null;
}>();

const activeSubTab = ref<'cronicas' | 'alergias' | 'medicamentos'>('cronicas');
</script>
