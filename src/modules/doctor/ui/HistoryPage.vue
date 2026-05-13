<template>
  <DoctorLayout>
    <div class="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in">

      <div class="mb-8 flex justify-between items-end">
        <div class="text-left">
          <h1 class="text-3xl font-black text-[#005596] uppercase tracking-tighter">
            Historial del Paciente
          </h1>
          <p class="text-slate-400 text-[11px] font-bold uppercase mt-1 tracking-widest">
            Expediente clínico unificado y comparativo
          </p>
        </div>

        <button @click="router.back()" class="text-[10px] font-black text-slate-400 uppercase hover:text-[#005596] transition-colors flex items-center gap-2">
          <span>←</span> Volver
        </button>
      </div>

      <PatientHistoryMain :pacienteId="pacienteId" />

    </div>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue'; // Ajusta la ruta a tu layout
import PatientHistoryMain from './components/PatientHistory/PatientHistoryMain.vue';

const router = useRouter();
const pacienteId = computed(() => {
  const selected = JSON.parse(localStorage.getItem('selectedPatient') || '{}');
  return selected.id || 0;
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
