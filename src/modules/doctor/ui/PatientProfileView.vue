<template>
  <DoctorLayout>
    <main class="p-8 max-w-350 mx-auto space-y-8">
      <div class="flex justify-between items-end mb-4">
        <div class="text-left">
          <h2 class="text-4xl font-black text-[#005596] tracking-tighter">Perfil del Paciente</h2>
          <p class="text-slate-400 font-bold text-sm">Información completa y formulario de registro</p>
        </div>
        <button
          @click="startConsultation"
          class="bg-linear-to-r from-[#005596] to-[#00345c] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:brightness-110 transition-all"
        >
          Iniciar Consulta
        </button>
      </div>

      <section class="overflow-hidden rounded-[3rem] shadow-2xl border border-blue-200/50">

        <div class="bg-linear-to-r from-[#005596] to-[#00345c] p-6 text-left">
          <h4 class="text-white font-black text-lg">Perfil del Paciente</h4>
          <p class="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Información completa del paciente citado</p>
        </div>

        <div class="bg-white p-10 flex items-center gap-10">
          <div class="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-lg text-white">
            👤
          </div>
          <div class="space-y-6 flex-1 text-left">
            <h3 class="text-4xl font-black text-slate-800">{{ appointment?.Paciente }}</h3>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <span class="text-blue-500">📅</span>
                <span class="text-slate-600 font-black text-sm uppercase">{{ appointment?.Edad }} Años</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                <span class="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">
                  {{ appointment?.Genero === 'M' ? 'Masculino' : 'Femenino' }}
                </span>
              </div>
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <span class="text-blue-500">📞</span>
                <span class="text-slate-600 font-black text-sm uppercase">{{ appointment?.Telefono || 'No registrado' }}</span>
              </div>
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <span class="text-blue-500">✉️</span>
                <span class="text-slate-600 font-black text-sm">{{ appointment?.EmailPaciente || 'No registrado' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm space-y-10 text-left">
        <h4 class="text-xl font-black text-slate-800 border-l-8 border-blue-600 pl-6 uppercase">Formulario de Registro</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div v-for="(val, label) in {
            'Motivo de Consulta': appointment?.Motivo,
            'Síntomas': appointment?.Sintomas,
            'Alergias': appointment?.Alergias,
            'Medicamentos Actuales': appointment?.MedicamentosActuales
          }" :key="label" class="space-y-3">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">{{ label }}</label>
            <div :class="label === 'Alergias' && val ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-700 border-slate-100'"
                 class="p-6 rounded-3xl font-bold border min-h-17.5">
              {{ val || 'No reportado' }}
            </div>
          </div>
        </div>
      </section>

      <!-- Exámenes Adjuntos -->
      <section class="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm space-y-8 text-left">
        <h4 class="text-xl font-black text-slate-800 border-l-8 border-blue-600 pl-6 uppercase">Exámenes Adjuntos</h4>
        <div v-if="exams.length > 0" class="grid gap-4">
          <div v-for="exam in exams" :key="exam.id" class="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100 group cursor-pointer hover:bg-slate-100 transition-all">
             <div class="flex items-center gap-4">
               <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold">📄</div>
               <p class="font-bold text-slate-700">{{ exam.nombre }}</p>
             </div>
             <span class="text-blue-500 font-black group-hover:scale-125 transition-all">📥</span>
          </div>
        </div>
        <div v-else class="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 font-bold">
          El paciente no tiene exámenes adjuntos previos.
        </div>
      </section>
    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import { useMedicalStore } from '@/stores/medicalStore';
import type { DoctorAppointment } from '../domain/DoctorAppointment';

interface PatientExam {
  id: number;
  nombre: string;
  fecha: string;
  url: string;
}

const router = useRouter();
const medicalStore = useMedicalStore();
const appointment = ref<DoctorAppointment | null>(null);
const exams = ref<PatientExam[]>([]);

const startConsultation = () => {
  medicalStore.setConsultationActive(true);
  router.push('/medico/consulta');
};

onMounted(async () => {
  const saved = localStorage.getItem('current_appointment');
  if (saved) {
    appointment.value = JSON.parse(saved) as DoctorAppointment;

    if (!medicalStore.isConsultationActive) {
      medicalStore.setConsultationActive(false);
    }
  }
});
</script>
