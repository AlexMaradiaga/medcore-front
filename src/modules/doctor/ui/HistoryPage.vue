  <template>
    <DoctorLayout>
      <div class="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in">

        <div class="mb-8 flex justify-between items-end">
          <div class="text-left">
            <h1 class="text-3xl font-black text-[#005596] uppercase tracking-tighter">
              Historial del Paciente
            </h1>
            <p class="text-slate-400 text-[11px] font-bold uppercase mt-1 tracking-widest">
              Expediente clínico unificado del paciente en consulta
            </p>
          </div>
          <button @click="router.back()" class="text-[10px] font-black text-slate-400 uppercase hover:text-[#005596] transition-colors flex items-center gap-2 cursor-pointer">
            <span>←</span> Volver
          </button>
        </div>

        <PatientHistoryMain
          v-if="pacienteId > 0"
          :key="pacienteId"
          :pacienteId="pacienteId"
        />

        <div v-else class="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-3 min-h-125">
          <div class="text-4xl">📂</div>
          <h3 class="text-xs font-black text-slate-700 uppercase tracking-widest">Esperando Paciente Activo</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase">No se pudo asociar el identificador del paciente de la cita actual.</p>
        </div>

      </div>
    </DoctorLayout>
  </template>


  <script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
  import PatientHistoryMain from './components/PatientHistory/PatientHistoryMain.vue';
  import { useMedicalStore } from '@/stores/medicalStore';

  const router = useRouter();
  const medicalStore = useMedicalStore();

  const pacienteId = computed(() => {
    if (medicalStore.selectedPatient && medicalStore.selectedPatient.PacienteID) {
      return Number(medicalStore.selectedPatient.PacienteID);
    }

    const selected = JSON.parse(localStorage.getItem('selectedPatient') || '{}');
    return Number(selected.PacienteID || selected.id || 0);
  });
  </script>
