<template>
  <div class="space-y-6 animate-fade-in text-left">

    <div class="bg-white rounded-4xl p-8 border border-slate-100 shadow-xs space-y-6">
      <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
        Información General del Paciente
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold text-slate-700">
        <div class="space-y-1">
          <p class="text-slate-400 font-medium">Nombre Completo:</p>
          <p class="text-sm font-black text-slate-800 uppercase">{{ patientData.nombre || 'Cargando...' }}</p>
          <p class="text-slate-400 font-medium pt-2">Alergias Clínicas:</p>
          <p class="font-black text-rose-600 uppercase">{{ patientData.alergias }}</p>
        </div>

        <div class="space-y-1">
          <p class="text-slate-400 font-medium">Edad / Género:</p>
          <p class="text-slate-800 font-black uppercase">{{ patientData.edad_genero }}</p>
          <p class="text-slate-400 font-medium pt-2">Condiciones / Medicación:</p>
          <p class="text-slate-700 font-medium uppercase">{{ patientData.cronico }}</p>
        </div>

        <div class="space-y-1">
          <p class="text-slate-400 font-medium">Factor Clínico / Sangre:</p>
          <p class="text-emerald-600 font-black text-sm uppercase">🩸 {{ patientData.sangre }}</p>
          <p class="text-slate-400 font-medium pt-2">Cobertura Médica:</p>
          <p class="text-slate-800 font-black uppercase">{{ patientData.seguro }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col min-h-125">

      <div :class="[
        'p-4 px-6 flex items-center justify-between text-[10px] font-black uppercase tracking-wider border-b transition-colors',
        tieneAccesoGlobal ? 'bg-emerald-50/60 border-emerald-100 text-emerald-800' : 'bg-amber-50/60 border-amber-100 text-amber-800'
      ]">
        <div class="flex items-center gap-2">
          <span>{{ tieneAccesoGlobal ? '🔒 Autorización Global Activa' : '⚠️ Autorización Limitada' }}</span>
          <span class="font-bold normal-case text-slate-400/90">— {{ tieneAccesoGlobal ? 'Historial unificado completo desbloqueado.' : 'Solo estás visualizando tus propias consultas.' }}</span>
        </div>

        <button
          v-if="!tieneAccesoGlobal"
          @click="solicitarAccesoGlobal"
          class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 text-[9px] font-black uppercase tracking-widest"
        >
          🔑 Autorizar Historial Externo
        </button>
      </div>

      <nav class="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
        <button
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all',
            activeTab === tab.id ? 'bg-white text-[#005596] shadow-xs' : 'text-slate-400 hover:text-slate-600'
          ]"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </nav>

      <div class="flex-1 overflow-y-auto p-8 bg-white relative min-h-100">
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <span class="text-[10px] font-black text-slate-400 animate-pulse uppercase tracking-widest">Sincronizando Expediente Digital...</span>
        </div>

        <ConsultationHistoryTab v-if="activeTab === 'consultas'" :data="history.consultas" />
        <ExamsHistoryTab v-if="activeTab === 'examenes'" :data="history.examenes" />
        <ComparativeStatsTab v-if="activeTab === 'comparativo'" :data="history.comparativos" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { DoctorRepository } from '../../../infrastructure/DoctorRepository';
import ConsultationHistoryTab from './ConsultationHistoryTab.vue';
import ExamsHistoryTab from './ExamsHistoryTab.vue';
import ComparativeStatsTab from './ComparativeStatsTab.vue';

import type { HistorialClinicoData } from '../../../domain/PatientHistory';

const props = defineProps<{ pacienteId: number }>();
const repo = new DoctorRepository();

const activeTab = ref('consultas');
const loading = ref(false);
const tieneAccesoGlobal = ref(false);

const tabs = [
  { id: 'consultas', label: 'Consultas Previas', icon: '📄' },
  { id: 'examenes', label: 'Exámenes', icon: '🔬' },
  { id: 'comparativo', label: 'Comparativo', icon: '📈' }
];

const patientData = ref({
  nombre: '', edad_genero: '', alergias: '', cronico: '', sangre: '', seguro: ''
});

const history = ref<HistorialClinicoData>({
  paciente: null,
  consultas: [],
  examenes: [],
  comparativos: []
});

const ejecutarCargaHistorial = async (id: number) => {
  if (!id || id <= 0) return;
  loading.value = true;
  try {
    const response = await repo.getPatientHistory(id) as unknown as {
      estado: string;
      autorizacionGlobal: boolean;
      datos: HistorialClinicoData
    };

    if (response && response.estado === 'success') {
      history.value = response.datos;
      tieneAccesoGlobal.value = response.autorizacionGlobal;

      if (response.datos.paciente) {
        const p = response.datos.paciente;
        patientData.value = {
          nombre: p.nombre,
          edad_genero: `${p.Edad || '---'} Años / ${p.Genero === 'M' ? 'Masculino' : 'Femenino'}`,
          alergias: p.alergias,
          cronico: p.cronico,
          sangre: p.sangre,
          seguro: p.seguro
        };
      }
    }
  } catch (error) {
    console.error('Error inyectando expediente:', error);
  } finally {
    loading.value = false;
  }
};

const solicitarAccesoGlobal = async () => {
  const pinPaciente = window.prompt("SEGURIDAD CLÍNICA: El sistema requiere el PIN de confirmación del paciente para liberar el expediente unificado. Por favor, ingrese el código de 4 dígitos dictado por el paciente:");

  if (pinPaciente) {
    try {
      loading.value = true;

      await repo.grantGlobalAccess(props.pacienteId, pinPaciente);

      alert("¡Código Verificado! Autorización registrada en el sistema con éxito.");
      await ejecutarCargaHistorial(props.pacienteId);
    } catch (error: unknown) {
      let msg = "Error al guardar la autorización clínica.";

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { mensaje?: string } } };
        msg = axiosError.response?.data?.mensaje || msg;
      }

      alert(msg);
    } finally {
      loading.value = false;
    }
  }
};

watch(() => props.pacienteId, async (newId) => { await ejecutarCargaHistorial(newId); });
onMounted(async () => { await ejecutarCargaHistorial(props.pacienteId); });
</script>
