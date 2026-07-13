<template>
  <DoctorLayout>
    <div class="min-h-screen bg-[#f1f5f9] p-8 -m-8 animate-fade-in text-left select-none font-sans">
      <div class="max-w-350 mx-auto space-y-8">

        <div class="flex justify-between items-end mb-4">
          <div class="text-left">
            <h2 class="text-4xl font-black text-[#005596] tracking-tighter">Perfil del Paciente</h2>
            <p class="text-slate-400 font-bold text-sm">Información completa y formulario de registro</p>
          </div>
          <button @click="startConsultation" class="bg-linear-to-r from-[#005596] to-[#00345c] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:brightness-110 transition-all cursor-pointer">
            Iniciar Consulta
          </button>
        </div>

        <section class="overflow-hidden rounded-[3rem] shadow-2xl border border-blue-200/50 bg-white">
          <div class="bg-linear-to-r from-[#005596] to-[#00345c] p-6 text-left">
            <h4 class="text-white font-black text-lg">Perfil del Paciente</h4>
            <p class="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Información completa del paciente citado</p>
          </div>

          <div class="bg-white p-10 flex items-center gap-10">
            <div class="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-lg text-white">👤</div>
            <div class="space-y-6 flex-1 text-left">
              <h3 class="text-4xl font-black text-slate-800">{{ appointment?.Paciente || 'Cargando...' }}</h3>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <span class="text-blue-500">📅</span>
                  <span class="text-slate-600 font-black text-sm uppercase">
                    {{ appointment?.Edad ? `${appointment.Edad} Años` : 'Edad no registrada' }}
                  </span>
                </div>
                <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                  <span v-if="appointment?.Genero" class="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">
                    {{ appointment.Genero === 'M' || appointment.Genero === 'Masculino' ? 'Masculino' : 'Femenino' }}
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
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Motivo de Consulta:</label>
              <div class="bg-slate-50 text-slate-700 border border-slate-100 p-6 rounded-3xl font-bold min-h-17.5 flex items-center">{{ appointment?.Motivo || 'No especificado' }}</div>
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Síntomas:</label>
              <div class="bg-slate-50 text-slate-700 border border-slate-100 p-6 rounded-3xl font-bold min-h-17.5 flex items-center">{{ appointment?.Sintomas || 'No reportados' }}</div>
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Alergias:</label>
              <div class="bg-red-50 text-red-700 border border-red-100 p-6 rounded-3xl font-bold min-h-17.5 flex items-center">{{ appointment?.Alergias || 'No reportado' }}</div>
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Medicamentos Actuales:</label>
              <div class="bg-slate-50 text-slate-700 border border-slate-100 p-6 rounded-3xl font-bold min-h-17.5 flex items-center">{{ appointment?.MedicamentosActuales || 'No reportado' }}</div>
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Seguro Médico:</label>
              <div class="bg-slate-50 text-slate-700 border border-slate-100 p-6 rounded-3xl font-bold min-h-17.5 flex items-center">{{ appointment?.SeguroMedico || 'No se cuenta con seguro' }}</div>
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contacto de Emergencia:</label>
              <div class="bg-slate-50 text-slate-700 border border-slate-100 p-6 rounded-3xl font-bold min-h-17.5 flex items-center">
                {{ contactoEmergenciaDisplay }}
              </div>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm space-y-8 text-left">
          <h4 class="text-xl font-black text-slate-800 border-l-8 border-blue-600 pl-6 uppercase">Exámenes Adjuntos</h4>
          <div v-if="exams.length > 0" class="grid gap-4">
            <div v-for="exam in exams" :key="exam.id" class="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <div class="flex items-center gap-4">
                 <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold">📄</div>
                 <div><p class="font-bold text-slate-700">{{ exam.nombre }}</p><p class="text-[10px] font-bold text-slate-400 font-mono">{{ exam.fecha }}</p></div>
               </div>
               <a :href="exam.url" target="_blank" class="text-blue-500 font-black">📥</a>
            </div>
          </div>
          <div v-else class="p-10 text-center border border-slate-100 rounded-2xl text-slate-400 font-bold text-xs bg-slate-50/30">No hay exámenes registrados.</div>
        </section>
      </div>
    </div>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import { useMedicalStore } from '@/stores/medicalStore';
import type { DoctorAppointment } from '../domain/DoctorAppointment';

interface ComponentAppointment extends Omit<DoctorAppointment, 'Paciente'> {
  Paciente: string;
  SeguroMedico?: string;
  NombreContactoEmergencia?: string;
  TelefonoContactoEmergencia?: string;
}

const router = useRouter();
const medicalStore = useMedicalStore();
const appointment = ref<ComponentAppointment | null>(null);
const exams = ref<Array<{id: number, nombre: string, fecha: string, url: string}>>([]);

const contactoEmergenciaDisplay = computed(() => {
  if (!appointment.value) return 'No registrado';

  const nombre = appointment.value.NombreContactoEmergencia;
  const tel = appointment.value.TelefonoContactoEmergencia;

  return (nombre || tel) ? `${nombre || 'Sin nombre'} - ${tel || 'Sin teléfono'}` : 'No registrado';
});

const startConsultation = () => {
  medicalStore.setConsultationActive(true);
  router.push('/medico/consulta');
};

onMounted(() => {
  const saved = localStorage.getItem('current_appointment');
  if (saved) {
    try {
      appointment.value = JSON.parse(saved) as ComponentAppointment;
    } catch{
      localStorage.removeItem('current_appointment');
    }
  }
});
</script>
