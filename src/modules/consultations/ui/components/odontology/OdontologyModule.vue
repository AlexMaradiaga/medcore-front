<template>
  <div class="bg-white border border-slate-200 rounded-4xl p-6 shadow-sm flex flex-col md:flex-row gap-6 text-left">

    <div class="w-full md:w-56 space-y-2 border-r border-slate-100 pr-4 shrink-0">
      <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 pl-2">Módulo Odontológico</h3>
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'bg-blue-50 text-blue-700 font-black border-blue-200' : 'text-slate-500 font-bold hover:bg-slate-50 border-transparent'"
        class="w-full text-left px-4 py-3 rounded-xl text-xs uppercase tracking-tight transition-all cursor-pointer flex items-center gap-3 border shadow-3xs"
      >
        <v-icon :name="tab.icon" :class="activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'" />
        {{ tab.name }}
      </button>
    </div>

    <div class="flex-1 min-w-0">
      <OdontogramTab v-if="activeTab === 'odontograma'" @update:odontograma="procesarCambiosOdontograma" />

      <DentalExamsTab v-if="activeTab === 'examenes'" @update:examenes="procesarCambiosExamenes" />

      <TreatmentBudgetTab v-if="activeTab === 'tratamiento'" :totalCalculado="montoTotalPresupuesto" />

      <div v-if="activeTab === 'fotos'" class="p-12 text-center space-y-4">
         <v-icon name="bi-camera-fill" scale="2" class="text-slate-200" />
         <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">Módulo de Galería y Consentimientos</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OdontogramTab from './OdontogramTab.vue';
import TreatmentBudgetTab from './TreatmentBudgetTab.vue';
import DentalExamsTab from './DentalExamsTab.vue';
import type { DentalExamData, OdontologyPayload } from '../../../../doctor/domain/DoctorAppointment';
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiClipboardPulse, BiShieldCheck, BiDice5, BiCameraFill, BiHeartPulse, BiCheck
} from 'oh-vue-icons/icons';

addIcons(BiClipboardPulse, BiShieldCheck, BiDice5, BiCameraFill, BiHeartPulse, BiCheck);

const emit = defineEmits<{
  (e: 'update:specialtyData', value: OdontologyPayload): void
}>();

const activeTab = ref('odontograma');
const montoTotalPresupuesto = ref<number>(0);

const datosOdontograma = ref<Record<number, Record<string, string>>>({});
const datosExamenesBase = ref<DentalExamData>({
  encias: 'Normal',
  condiciones: { placa: false, calculo: false, sensibilidad: false, movilidad: false },
  oclusion: 'Normal',
  notas: ''
});

const tabs = [
  { id: 'odontograma', name: 'Odontograma', icon: 'bi-dice-5' },
  { id: 'examenes', name: 'Exámenes Base', icon: 'bi-heart-pulse' },
  { id: 'tratamiento', name: 'Tratamiento', icon: 'bi-shield-check' },
  { id: 'fotos', name: 'Fotos / Consent', icon: 'bi-camera-fill' }
];

const procesarCambiosOdontograma = (payload: { tipo: string; datos: Record<number, Record<string, string>> }) => {
  let subtotal = 0;
  datosOdontograma.value = payload.datos;

  Object.values(payload.datos).forEach((diente) => {
    Object.values(diente).forEach((estado) => {
      if (estado === 'Caries') subtotal += 600;
      if (estado === 'Corona') subtotal += 2500;
    });
  });

  montoTotalPresupuesto.value = subtotal;
  sincronizarDatosConPadre();
};

const procesarCambiosExamenes = (data: DentalExamData) => {
  datosExamenesBase.value = data;
  sincronizarDatosConPadre();
};

const sincronizarDatosConPadre = () => {
  emit('update:specialtyData', {
    totalPresupuesto: montoTotalPresupuesto.value,
    odontograma: datosOdontograma.value,
    examenesBase: datosExamenesBase.value
  });
};
</script>
