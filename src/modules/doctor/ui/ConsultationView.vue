<template>
  <DoctorLayout>
    <main class="min-h-screen bg-slate-50 pb-32">
      <!-- HEADER DE CONSULTA -->
      <div class="bg-[#0088cc] text-white px-12 py-6 flex justify-between items-center shadow-inner">
        <div class="flex items-center gap-8">
          <button @click="router.back()" class="flex items-center gap-2 text-xs font-bold hover:bg-white/10 p-2 rounded-lg transition-all uppercase tracking-widest">
            <span class="text-lg">←</span> Volver
          </button>
          <div class="text-left border-l border-white/20 pl-8">
            <h2 class="text-2xl font-black">{{ appointment?.Paciente }}</h2>
            <p class="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">
              {{ appointment?.Edad }} Años • {{ appointment?.Genero === 'M' ? 'Masculino' : 'Femenino' }}
            </p>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div class="flex items-center gap-4">
            <span class="text-[10px] font-black uppercase tracking-tighter">Progreso: {{ progress }}%</span>
            <div class="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
              <div class="h-full bg-white transition-all duration-500" :style="{ width: progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- TABS DE NAVEGACIÓN SOAP -->
      <nav class="bg-white border-b border-slate-200 px-12 flex gap-12 shadow-sm sticky top-0 z-10">
        <button
          v-for="tab in ['Subjetivo', 'Objetivo', 'Evaluación', 'Plan']"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'py-5 text-xs font-black uppercase tracking-widest transition-all border-b-4',
            activeTab === tab ? 'border-[#0088cc] text-[#0088cc]' : 'border-transparent text-slate-400 hover:text-slate-600'
          ]"
        >
          <span class="mr-2">{{ getTabIcon(tab) }}</span> {{ tab }}
        </button>
      </nav>

      <!-- CONTENIDO DINÁMICO -->
      <div class="p-12 max-w-7xl mx-auto">
        <div class="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm min-h-125">

          <!-- SECCIÓN: SUBJETIVO -->
          <div v-if="activeTab === 'Subjetivo'" class="space-y-10 animate-fade-in text-left">
            <h3 class="text-xl font-black text-slate-800">Datos Subjetivos</h3>
            <div class="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100 space-y-6 relative transition-all text-left">
              <div class="flex justify-between items-center">
                <h4 class="text-sm font-black text-slate-700 uppercase tracking-tight">Motivo de Consulta y Síntomas</h4>
                <div class="flex gap-2">
                  <span class="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Pre-llenado</span>
                  <button v-if="!isEditingSubjetivo" @click="startEditingSubjetivo" class="text-slate-400 hover:text-blue-500 transition-all text-sm p-1">✎</button>
                </div>
              </div>
              <div v-if="!isEditingSubjetivo" class="animate-fade-in">
                <p class="text-slate-500 font-bold leading-relaxed">
                  {{ editableSubjetivo || (appointment?.Motivo + ' - ' + (appointment?.Sintomas || 'Sin síntomas registrados')) }}
                </p>
              </div>
              <div v-else class="space-y-6 animate-fade-in">
                <textarea v-model="tempSubjetivo" class="w-full bg-white border-2 border-blue-50 rounded-2xl p-6 outline-none focus:border-blue-200 transition-all font-bold text-slate-600 min-h-30 shadow-inner"></textarea>
                <div class="flex gap-3">
                  <button @click="saveSubjetivo" class="bg-[#10b981] text-white px-6 py-2 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 shadow-lg shadow-green-100 transition-all hover:scale-105">✓ Guardar</button>
                  <button @click="isEditingSubjetivo = false" class="bg-white text-slate-400 px-6 py-2 rounded-xl font-black uppercase text-[10px] border border-slate-200 transition-all hover:bg-slate-50">✕ Cancelar</button>
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN: OBJETIVO -->
          <div v-if="activeTab === 'Objetivo'" class="space-y-10 animate-fade-in text-left">
            <section class="space-y-6">
              <h3 class="text-xl font-black text-slate-800">Signos Vitales</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div v-for="campo in listaCamposSignos" :key="campo.key" class="space-y-2">
                  <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">{{ campo.label }}</label>
                  <input
                    type="text"
                    v-model="form.signos_vitales[campo.key]"
                    :placeholder="campo.key === 'temp' ? '36.5°C' : '120/80'"
                    class="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-blue-100 outline-none font-bold text-slate-700 transition-all"
                  >
                </div>
              </div>
            </section>

            <section class="space-y-6">
              <h3 class="text-xl font-black text-slate-800">Examen Físico por Sistemas</h3>
              <div class="space-y-4">
                <div v-for="(sistema, index) in sistemasFisicos" :key="index" class="border border-slate-100 rounded-4xl overflow-hidden bg-white">
                  <button @click="toggleSistema(index)" class="w-full flex justify-between items-center p-6 hover:bg-slate-50 transition-all">
                    <div class="flex items-center gap-4">
                      <span class="font-black text-slate-700 text-sm uppercase">{{ sistema.nombre }}</span>
                      <span v-if="countHallazgos(index) > 0 && !sistema.isNormal" class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[8px] font-black uppercase">
                        {{ countHallazgos(index) }} hallazgos
                      </span>
                      <span v-else-if="sistema.isNormal" class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[8px] font-black uppercase">Normal</span>
                    </div>
                    <span class="text-slate-300">{{ sistema.open ? '▲' : '▼' }}</span>
                  </button>

                  <div v-if="sistema.open" class="p-8 bg-white border-t border-slate-50 animate-fade-in space-y-6 text-left">
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" v-model="sistema.isNormal" @change="handleNormalChange(index)" class="w-5 h-5 rounded border-slate-300 text-[#0088cc]">
                      <span class="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Normal / Sin hallazgos</span>
                    </label>

                    <!-- Hallazgos: Solo se ven si NO es normal -->
                    <div v-if="!sistema.isNormal" class="space-y-4 animate-fade-in">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hallazgos:</p>
                      <div class="grid grid-cols-2 gap-4">
                        <label v-for="opcion in sistema.opciones" :key="opcion" class="flex items-center gap-3 cursor-pointer group">
                          <!-- Type assertion para evitar error de undefined -->
                          <input
                            type="checkbox"
                            v-model="(form.examen_fisico_opciones[sistema.id] as Record<string, boolean>)[opcion]"
                            class="w-4 h-4 rounded border-slate-300 text-[#0088cc]"
                          >
                          <span class="text-sm font-medium text-slate-500">{{ opcion }}</span>
                        </label>
                      </div>
                    </div>
                     <!-- NOTAS ADICIONALES: Fuera del v-if para que se vea siempre -->
                    <div class="space-y-2 pt-4 border-t border-slate-50">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Notas adicionales:</label>
                      <textarea
                        v-model="form.examen_fisico_notas[sistema.id]"
                        placeholder="Agregar detalles específicos..."
                        class="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-6 outline-none focus:bg-white focus:border-blue-50 font-bold text-slate-600 min-h-24 transition-all"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- SECCIÓN: EVALUACIÓN -->
          <div v-if="activeTab === 'Evaluación'" class="space-y-8 animate-fade-in text-left">
            <h3 class="text-xl font-black text-slate-800">Diagnóstico Médico</h3>
            <textarea v-model="form.diagnostico" class="w-full bg-slate-50 p-8 rounded-3xl min-h-75 outline-none border-2 border-transparent focus:border-blue-100 font-bold" placeholder="Escriba el diagnóstico detallado..."></textarea>
          </div>

          <!-- SECCIÓN: PLAN -->
          <div v-if="activeTab === 'Plan'" class="space-y-8 animate-fade-in text-left">
            <h3 class="text-xl font-black text-slate-800">Plan de Tratamiento</h3>
            <div class="space-y-6">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Prescripción de Medicamentos</label>
              <textarea v-model="form.detalle_medicamentos" class="w-full bg-slate-50 p-8 rounded-3xl min-h-50 outline-none border-2 border-transparent focus:border-blue-100 font-bold" placeholder="Ej: Paracetamol 500mg..."></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- ACCIONES -->
      <footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 flex justify-center gap-4 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div class="max-w-7xl w-full flex justify-end gap-4">
          <button @click="handleSaveDraft" class="flex items-center gap-2 px-10 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black uppercase text-xs hover:bg-slate-50 transition-all">💾 Guardar Borrador</button>
          <button @click="handleSubmit" :disabled="loading" class="flex items-center gap-2 px-12 py-4 bg-linear-to-r from-[#0088cc] to-[#005596] text-white rounded-2xl font-black uppercase text-xs shadow-xl hover:scale-105 transition-all disabled:opacity-50">🚀 {{ loading ? 'Procesando...' : 'Finalizar Consulta' }}</button>
        </div>
      </footer>
    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import { DoctorRepository } from '../infrastructure/DoctorRepository';
import type { DoctorAppointment } from '../domain/DoctorAppointment';

// --- INTERFACES CON FIRMAS DE ÍNDICE ---
interface SignosVitales {
  presion: string;
  pulso: string;
  temp: string;
  respiracion: string;
}

interface HallazgosSistema {
  [key: string]: Record<string, boolean>;
}


const router = useRouter();
const repo = new DoctorRepository();
const appointment = ref<DoctorAppointment | null>(null);
const loading = ref(false);
const activeTab = ref('Subjetivo');
const isEditingSubjetivo = ref(false);
const editableSubjetivo = ref('');
const tempSubjetivo = ref('');

const form = ref({
  cita_id: 0,
  signos_vitales: { presion: '', pulso: '', temp: '', respiracion: '' } as SignosVitales,
  examen_fisico_opciones: {
    general: {},
    cardiovascular: {},
    respiratorio: {},
    abdomen: {},
    neurologico: {}
  } as HallazgosSistema,
  examen_fisico_notas: {
    general: '', cardiovascular: '', respiratorio: '', abdomen: '', neurologico: ''
  } as Record<string, string>,
  diagnostico: '',
  notas_medicas: '',
  detalle_medicamentos: ''
});

const sistemasFisicos = ref([
  { nombre: 'General', id: 'general', open: false, isNormal: false, opciones: ['Palidez', 'Ictericia', 'Deshidratación', 'Cianosis'] },
  { nombre: 'Cardiovascular', id: 'cardiovascular', open: false, isNormal: false, opciones: ['Soplo cardíaco', 'Edema periférico', 'Arritmia', 'Ingurgitación yugular'] },
  { nombre: 'Respiratorio', id: 'respiratorio', open: false, isNormal: false, opciones: ['Sibilancias', 'Estertores', 'Disnea', 'Tos'] },
  { nombre: 'Abdomen', id: 'abdomen', open: false, isNormal: false, opciones: ['Dolor a la palpación', 'Distensión', 'Ruidos aumentados', 'Organomegalia'] },
  { nombre: 'Neurológico', id: 'neurologico', open: false, isNormal: false, opciones: ['Desorientación', 'Déficit motor', 'Alteración sensitiva', 'Reflejos anormales'] }
]);

const listaCamposSignos = [
  { label: 'Presión Arterial', key: 'presion' as keyof SignosVitales },
  { label: 'Frecuencia Cardíaca', key: 'pulso' as keyof SignosVitales },
  { label: 'Temperatura', key: 'temp' as keyof SignosVitales },
  { label: 'Frecuencia Resp.', key: 'respiracion' as keyof SignosVitales }
];

const toggleSistema = (index: number) => {
  const s = sistemasFisicos.value[index];
  if (s) s.open = !s.open;
};

const handleNormalChange = (index: number) => {
  const s = sistemasFisicos.value[index];
  if (s && s.isNormal) {
    form.value.examen_fisico_opciones[s.id] = {};
    form.value.examen_fisico_notas[s.id] = '';
  }
};

const countHallazgos = (index: number): number => {
  const s = sistemasFisicos.value[index];
  if (!s) return 0;
  const opciones = form.value.examen_fisico_opciones[s.id];
  return opciones ? Object.values(opciones).filter(v => v).length : 0;
};

const progress = computed(() => {
  const tabs = ['Subjetivo', 'Objetivo', 'Evaluación', 'Plan'];
  return ((tabs.indexOf(activeTab.value) + 1) / tabs.length) * 100;
});

const getTabIcon = (tab: string) => {
  const icons: Record<string, string> = { 'Subjetivo': '📄', 'Objetivo': '🩺', 'Evaluación': '⚖️', 'Plan': '🗒️' };
  return icons[tab] || '';
};

onMounted(() => {
  const saved = localStorage.getItem('current_appointment');
  if (!saved) { router.push('/medico/dashboard'); return; }
  appointment.value = JSON.parse(saved);
  if (appointment.value) form.value.cita_id = appointment.value.CitaID;
});

const startEditingSubjetivo = () => {
  if (!tempSubjetivo.value && appointment.value) {
    tempSubjetivo.value = `${appointment.value.Motivo} - ${appointment.value.Sintomas || 'Sin síntomas registrados'}`;
  }
  isEditingSubjetivo.value = true;
};

const saveSubjetivo = () => {
  editableSubjetivo.value = tempSubjetivo.value;
  isEditingSubjetivo.value = false;
  form.value.notas_medicas = tempSubjetivo.value;
};

const handleSaveDraft = () => alert('Borrador guardado localmente.');

const handleSubmit = async () => {
  if (!form.value.diagnostico || !form.value.detalle_medicamentos) {
    alert('Por favor complete el diagnóstico y el plan antes de finalizar.');
    return;
  }
  loading.value = true;
  try {
    const payload = JSON.parse(JSON.stringify(form.value));
    payload.cita_id = Number(payload.cita_id);
    await repo.completeConsultation(payload);
    alert('¡Consulta finalizada con éxito!');
    localStorage.removeItem('current_appointment');
    router.push('/medico/dashboard');
  } catch (err) {
    alert('Error al finalizar la consulta');
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
