<template>
  <div class="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-full animate-fade-in min-h-125">

    <template v-if="!accesoDenegado">
      <div :class="[
        'p-6 flex items-center gap-4 border-b transition-colors',
        tieneAccesoGlobal ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'
      ]">
        <div :class="[
          'p-2 rounded-xl text-white text-xs shadow-sm',
          tieneAccesoGlobal ? 'bg-green-500' : 'bg-slate-400'
        ]">
          {{ tieneAccesoGlobal ? '🔒' : '🔓' }}
        </div>
        <div class="text-left">
          <h4 :class="[
            'font-black text-[10px] uppercase tracking-wider',
            tieneAccesoGlobal ? 'text-green-800' : 'text-slate-600'
          ]">
            {{ tieneAccesoGlobal ? 'Autorización Activa' : 'Autorización Parcial' }}
          </h4>
          <p :class="[
            'text-[9px] font-bold',
            tieneAccesoGlobal ? 'text-green-600' : 'text-slate-400'
          ]">
            {{ tieneAccesoGlobal ? 'Acceso completo al historial clínico.' : 'Visualizando únicamente sus consultas propias.' }}
          </p>
        </div>
      </div>

      <nav class="flex border-b border-slate-100 bg-slate-50/50">
        <button
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all border-b-2',
            activeTab === tab.id ? 'bg-white text-[#0088cc] border-[#0088cc]' : 'text-slate-400 border-transparent'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="flex-1 overflow-y-auto p-6 min-h-125 relative">
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <span class="text-[10px] font-black text-slate-400 animate-pulse uppercase tracking-widest">Cargando Historial...</span>
        </div>

        <ConsultationHistoryTab v-if="activeTab === 'consultas'" :data="history.consultas" />
        <ExamsHistoryTab v-if="activeTab === 'examenes'" :data="history.examenes" />
        <ComparativeStatsTab v-if="activeTab === 'comparativo'" :data="history.comparativos" />
      </div>
    </template>

    <div v-else class="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 animate-fade-in">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl shadow-inner">
        🔐
      </div>
      <div class="max-w-70">
        <h3 class="text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Acceso Restringido</h3>
        <p class="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">
          No tiene historial previo con este paciente ni autorización global para ver historial externo.
        </p>
      </div>
      <button class="bg-slate-900 text-white text-[9px] font-black px-8 py-3 rounded-2xl uppercase hover:bg-[#0088cc] transition-all shadow-lg active:scale-95">
        Solicitar Autorización al Paciente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DoctorRepository } from '../../../infrastructure/DoctorRepository';
import ConsultationHistoryTab from './ConsultationHistoryTab.vue';
import ExamsHistoryTab from './ExamsHistoryTab.vue';
import ComparativeStatsTab from './ComparativeStatsTab.vue';
import type { PatientHistoryResponse } from '../../../domain/PatientHistory';

const props = defineProps<{ pacienteId: number }>();

const repo = new DoctorRepository();
const activeTab = ref('consultas');
const loading = ref(false);
const accesoDenegado = ref(false);
const tieneAccesoGlobal = ref(false); 

const tabs = [
  { id: 'consultas', label: 'Consultas' },
  { id: 'examenes', label: 'Exámenes' },
  { id: 'comparativo', label: 'Comparativo' }
];

const history = ref<PatientHistoryResponse['datos']>({
  consultas: [],
  examenes: [],
  comparativos: []
});

const fetchHistory = async () => {
  loading.value = true;
  accesoDenegado.value = false;
  try {
    const response: PatientHistoryResponse = await repo.getPatientHistory(props.pacienteId);

    if (response.estado === 'success') {
      history.value = response.datos;

      tieneAccesoGlobal.value = response.autorizacionGlobal;
    }
  } catch (error) {
    console.error('Error al cargar el historial:', error);
    accesoDenegado.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (props.pacienteId) {
    await fetchHistory();
  }
});
</script>
