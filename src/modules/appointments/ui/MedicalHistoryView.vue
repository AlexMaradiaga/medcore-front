<template>
  <div class="space-y-8 animate-fade-in text-left">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-4xl font-black text-slate-800 uppercase tracking-tight">Historial Médico</h2>
        <p class="text-slate-500 font-medium italic mt-1">Consulte su expediente digital, exámenes y recetas</p>
      </div>
    </div>

    <div class="flex gap-4 border-b border-slate-200 pb-1">
      <button
        v-for="subTab in subTabs" :key="subTab.id"
        @click="activeSubTab = subTab.id"
        :class="activeSubTab === subTab.id ? 'text-blue-600 border-b-4 border-blue-600 pb-4' : 'text-slate-400 pb-4'"
        class="px-6 font-black uppercase text-xs tracking-widest transition-all"
      >
        {{ subTab.label }}
      </button>
    </div>

    <div v-if="loading" class="py-20 text-center">
        <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>

    <div v-else class="mt-8">
        <div v-if="activeSubTab === 'consultas'" class="space-y-6">
            <div v-for="item in history" :key="item.ConsultaID"
                class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
                <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🩺</div>
                    <div>
                        <h4 class="text-xl font-black text-slate-800">{{ item.Doctor }}</h4>
                        <p class="text-blue-600 font-bold text-xs uppercase">{{ item.Especialidad }} • {{ item.Clinica }}</p>
                        <p class="text-slate-400 text-xs mt-1 font-bold">{{ item.FechaHora }}</p>
                    </div>
                </div>
                <button @click="showDetail(item)" class="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase hover:bg-slate-200">
                    Ver Diagnóstico
                </button>
            </div>
        </div>

        <div v-if="activeSubTab === 'examenes'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="exam in exams" :key="exam.ExamenID" class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl">🧪</div>
                    <div>
                        <p class="text-lg font-black text-slate-800 leading-none">{{ exam.Titulo }}</p>
                        <p class="text-xs text-slate-400 font-bold mt-1 uppercase">{{ exam.Fecha }}</p>
                    </div>
                </div>
                <button @click="downloadFile(exam.ArchivoUrl)" class="p-3 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-100">
                    ⬇️
                </button>
            </div>
        </div>

        <div v-if="activeSubTab === 'recetas'" class="space-y-6">
            <div v-for="receta in prescriptions" :key="receta.RecetaID" class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
                <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl">💊</div>
                    <div>
                        <p class="text-lg font-black text-slate-800 leading-none">Receta Médica #{{ receta.RecetaID }}</p>
                        <p class="text-xs text-slate-400 font-bold mt-1 uppercase">Doctor: {{ receta.Doctor }} • {{ receta.Fecha }}</p>
                    </div>
                </div>
                <button @click="downloadPrescription(receta)" class="px-6 py-3 bg-purple-600 text-white rounded-xl text-xs font-black uppercase shadow-lg">
                    Descargar PDF
                </button>
            </div>
        </div>
    </div>

    <div v-if="selectedItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white w-full max-w-2xl rounded-[3rem] p-10 animate-fade-in shadow-2xl">
            <h3 class="text-3xl font-black text-slate-800 uppercase tracking-tight mb-6">Diagnóstico Médico</h3>
            <div class="bg-slate-50 p-8 rounded-3xl space-y-6 text-left">
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultado de la Evaluación</p>
                    <p class="text-slate-700 font-bold text-xl mt-2 leading-relaxed">{{ selectedItem.Diagnostico }}</p>
                </div>
                <div v-if="selectedItem.NotasMedicas">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notas del Especialista</p>
                    <p class="text-slate-600 font-medium mt-2">{{ selectedItem.NotasMedicas }}</p>
                </div>
            </div>
            <button @click="selectedItem = null" class="w-full mt-8 py-5 bg-medgo-gradient text-white rounded-2xl font-black uppercase">Cerrar Historial</button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { AppointmentRepository } from '../infrastructure/AppointmentRepo';
import type { MedicalRecord, Exam, Prescription } from '../domain/Appointment';
import api from '@/shared/infrastructure/api';

const props = defineProps<{ usuarioId: number }>();

const repo = new AppointmentRepository();
const history = ref<MedicalRecord[]>([]);
const exams = ref<Exam[]>([]);
const prescriptions = ref<Prescription[]>([]);
const selectedItem = ref<MedicalRecord | null>(null);

const activeSubTab = ref('consultas');
const loading = ref(false);

const subTabs = [
  { id: 'consultas', label: 'Consultas' },
  { id: 'examenes', label: 'Exámenes' },
  { id: 'recetas', label: 'Recetas' }
];

const loadData = async () => {
  if (props.usuarioId === 0) return;
  loading.value = true;

  try {
    if (activeSubTab.value === 'consultas') {
      history.value = await repo.getMedicalHistory(props.usuarioId);
    } else if (activeSubTab.value === 'examenes') {
      exams.value = await repo.getExams(props.usuarioId);
    } else if (activeSubTab.value === 'recetas') {
      prescriptions.value = await repo.getPrescriptions(props.usuarioId);
    }
  } catch (error) {
    console.error("Error cargando historial:", error);
  } finally {
    loading.value = false;
  }
};

watch(activeSubTab, () => {
  loadData();
});

const showDetail = (item: MedicalRecord) => {
  selectedItem.value = item;
};

const downloadFile = (url: string) => {
  window.open(url, '_blank');
};

const downloadPrescription = async (receta: Prescription) => {
  try {
    const response = await api.get(`/recetas/pdf/${receta.RecetaID}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', `Receta_${receta.RecetaID}.pdf`);

    document.body.appendChild(link);
    link.click();

    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error al descargar la receta:", error);
    alert("No se pudo generar el archivo de la receta en este momento.");
  }
};

onMounted(loadData);
</script>
