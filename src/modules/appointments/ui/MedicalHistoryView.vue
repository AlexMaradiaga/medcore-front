<template>
  <div class="space-y-8 animate-fade-in text-left font-premium select-none">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-4xl font-black text-[#005596] uppercase tracking-tight">Mi Historial Clínico</h2>
        <p class="text-slate-500 font-medium italic mt-1">Consulte sus consultas previas, exámenes físicos y recetas prescritas</p>
      </div>
    </div>

    <div class="flex gap-4 border-b border-slate-200 pb-1">
      <button
        v-for="subTab in subTabs" :key="subTab.id"
        @click="activeSubTab = subTab.id"
        :class="activeSubTab === subTab.id ? 'text-[#005596] border-b-4 border-[#005596] pb-4' : 'text-slate-400 pb-4'"
        class="px-6 font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
      >
        {{ subTab.label }}
      </button>
    </div>

    <div v-if="loading" class="py-20 text-center">
      <div class="animate-spin inline-block w-10 h-10 border-4 border-[#005596] border-t-transparent rounded-full"></div>
    </div>

    <div v-else class="mt-8">

      <div v-if="activeSubTab === 'consultas'" class="space-y-6">
        <div v-if="history.length === 0" class="text-center py-16 bg-white border border-slate-100 rounded-[2.5rem] text-slate-400 font-black uppercase text-xs tracking-widest">
          📭 No cuenta con consultas médicas registradas en su expediente.
        </div>
        <div v-else v-for="item in history" :key="item.CitaID"
          class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center"
        >
          <div class="flex items-center gap-6">
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🩺</div>
            <div>
              <h4 class="text-xl font-black text-slate-800">Dr. {{ item.Doctor }}</h4>
              <p class="text-blue-600 font-bold text-xs uppercase">{{ item.Especialidad || 'Especialista' }} • {{ item.Clinica }}</p>
              <p class="text-slate-400 text-xs mt-1 font-bold">{{ item.FechaHora }}</p>
            </div>
          </div>
          <button @click="showDetail(item)" class="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase hover:bg-slate-200 cursor-pointer">
            Ver Diagnóstico
          </button>
        </div>
      </div>

      <div v-if="activeSubTab === 'examenes'" class="space-y-8">
        <div v-if="exams.length === 0" class="text-center py-16 bg-white border border-slate-100 rounded-[2.5rem] text-slate-400 font-black uppercase text-xs tracking-widest">
          📭 No se registran evaluaciones de examen físico por sistemas.
        </div>

        <div v-else class="space-y-8">
          <section class="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl space-y-6">
            <div class="border-b border-slate-800 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 class="text-lg font-black text-blue-400 uppercase tracking-tight flex items-center gap-2">
                  Análisis de Evolución Médica
                  <div class="group relative inline-block text-slate-400 hover:text-white cursor-help normal-case">
                    <span class="text-sm">❓</span>
                    <div class="pointer-events-none opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 text-slate-200 text-[11px] font-bold p-4 rounded-xl shadow-2xl border border-slate-700 transition-all duration-300 z-50 space-y-2 leading-relaxed">
                      <p class="text-blue-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-700 pb-1">Leyenda del Historial</p>
                      <p>• <span class="text-green-400 font-black">N</span> = Estado <span class="text-green-400">Normal / Saludable</span>.</p>
                      <p>• <span class="text-red-400 font-black">A</span> = <span class="text-red-400">Anormal / Hallazgo Clínico</span>.</p>
                      <p class="pt-1 text-slate-400 font-medium border-t border-slate-700/50 mt-1">El sistema evalúa de izquierda a derecha el progreso de sus últimas 3 consultas médicas.</p>
                    </div>
                  </div>
                </h3>
                <p class="text-slate-400 text-xs font-bold">Métrica comparativa automática basada en sus últimas 3 evaluaciones</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="sistema in metricasEvolutivas" :key="sistema.nombre" class="bg-slate-800/50 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <p class="text-xs font-black uppercase text-slate-400 tracking-wider">Sistema {{ sistema.nombre }}</p>
                  <p class="text-[10px] text-slate-500 font-bold mt-1">Tendencia de salud actual</p>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <span :class="sistema.status === 'mejora' ? 'bg-green-500/10 text-green-400 border-green-500/20' : sistema.status === 'empeoro' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'" class="px-3 py-1 rounded-lg text-xs font-black border uppercase tracking-widest">
                    {{ sistema.status === 'mejora' ? '🟢 Mejoró' : sistema.status === 'empeoro' ? '🔴 Empeoró' : '🔵 Estable' }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">Historial: {{ sistema.recorrido }}</span>
                </div>
              </div>
            </div>
          </section>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="exam in examenesPaginados" :key="exam.ExamenSistemaID" class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center animate-fade-in">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl">📋</div>
                  <div>
                    <p class="text-base font-black text-slate-800 leading-none uppercase tracking-tight">Sistema {{ exam.SistemaID }}</p>
                    <p class="text-[10px] text-slate-400 font-bold mt-1.5 uppercase">Dr. {{ exam.Doctor }} • {{ exam.FechaHora }}</p>
                    <span :class="exam.EsNormal === 1 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'" class="inline-block text-[9px] font-black px-2 py-0.5 rounded-md border mt-2 uppercase tracking-wider">
                      {{ exam.EsNormal === 1 ? '✅ Normal' : '⚠️ Hallazgo Clínico' }}
                    </span>
                  </div>
                </div>
                <button @click="verDetalleSistema(exam)" class="p-3 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-xl transition-all cursor-pointer text-sm font-bold">
                  👁️ Ver Notas
                </button>
              </div>
            </div>

            <div v-if="totalPaginasExams > 1" class="flex justify-center items-center gap-4 pt-4">
              <button @click="paginaExams--" :disabled="paginaExams === 1" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer">Anterior</button>
              <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Página {{ paginaExams }} de {{ totalPaginasExams }}</span>
              <button @click="paginaExams++" :disabled="paginaExams === totalPaginasExams" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer">Siguiente</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeSubTab === 'recetas'" class="space-y-8">
        <div v-if="prescriptions.length === 0" class="text-center py-16 bg-white border border-slate-100 rounded-[2.5rem] text-slate-400 font-black uppercase text-xs tracking-widest">
          📭 No cuenta con folios de recetas emitidos en sus atenciones.
        </div>

        <div v-else class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              v-for="receta in recetasPaginadas"
              :key="receta.RecetaID"
              class="bg-linear-to-b from-white to-slate-50/40 border border-slate-100 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-200/60 transition-all duration-300 relative overflow-hidden"
            >
              <div class="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-[#005596] to-cyan-500"></div>

              <div class="space-y-5">
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-linear-to-br from-blue-50 to-indigo-50/50 text-[#005596] rounded-xl flex items-center justify-center text-xl shadow-xs border border-blue-100/40">💊</div>
                    <div>
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">Prescripción</span>
                      <h3 class="text-lg font-black text-slate-800 mt-1">Folio Digital #{{ receta.RecetaID }}</h3>
                    </div>
                  </div>
                  <span :class="receta.YaCanjeada === 1 ? 'bg-slate-100 text-slate-400 border-slate-200/50' : 'bg-emerald-50 text-emerald-600 border-emerald-100/70'" class="text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider shadow-2xs">
                    {{ receta.YaCanjeada === 1 ? '💊 Entregada' : '✅ Disponible' }}
                  </span>
                </div>

                <div class="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-2xs text-left space-y-2">
                  <h4 class="text-base font-black text-slate-800 tracking-tight uppercase">{{ receta.NombreMedicamento }}</h4>
                  <div class="flex flex-col gap-1 text-xs">
                    <p class="text-blue-600 font-bold flex items-center gap-1.5">
                      <span class="text-slate-400 font-medium">⏱️ Dosis indicada:</span> {{ receta.Dosis }}
                    </p>
                    <p class="text-slate-400 font-medium">
                      📅 Emisión: <span class="text-slate-600 font-bold">{{ receta.FechaEmision }}</span>
                    </p>
                  </div>
                </div>

                <div class="text-left bg-slate-100/60 p-4 rounded-2xl border border-slate-200/30 min-h-19 flex flex-col justify-center">
                  <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Indicaciones del Doctor:</p>
                  <p class="text-xs text-slate-600 font-medium italic leading-relaxed line-clamp-2">
                    "{{ receta.Indicaciones || 'Consulte la posología completa abriendo el visor institucional.' }}"
                  </p>
                </div>
              </div>

              <div class="mt-6">
                <button
                  @click="abrirVisualizadorPDF(receta.RecetaID)"
                  class="w-full py-3.5 bg-linear-to-r from-[#005596] to-[#00345c] text-white rounded-xl text-xs font-black uppercase shadow-xs hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer tracking-widest flex items-center justify-center gap-2"
                >
                  👁️ Abrir Receta Médica
                </button>
              </div>
            </div>
          </div>

          <div v-if="totalPaginasRecetas > 1" class="flex justify-center items-center gap-4 pt-6">
            <button
              @click="paginaRecetas--"
              :disabled="paginaRecetas === 1"
              class="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
            >
              Anterior
            </button>
            <span class="text-xs font-black text-slate-500 uppercase tracking-widest">
              Página {{ paginaRecetas }} de {{ totalPaginasRecetas }}
            </span>
            <button
              @click="paginaRecetas++"
              :disabled="paginaRecetas === totalPaginasRecetas"
              class="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

    </div>

    <div v-if="selectedItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl rounded-[3rem] p-10 animate-fade-in shadow-2xl">
        <h3 class="text-3xl font-black text-slate-800 uppercase tracking-tight mb-6">Diagnóstico Clínico</h3>
        <div class="bg-slate-50 p-8 rounded-3xl space-y-6 text-left">
          <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conclusión Médica</p><p class="text-slate-700 font-bold text-xl mt-2 leading-relaxed uppercase">🩺 {{ selectedItem.Motivo }}</p></div>
          <div v-if="selectedItem.Sintomas"><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Síntomas Reportados</p><p class="text-slate-600 font-semibold mt-1 text-base italic leading-relaxed">"{{ selectedItem.Sintomas }}"</p></div>
        </div>
        <button @click="selectedItem = null" class="w-full mt-8 py-5 bg-linear-to-r from-[#005596] to-[#00345c] text-white rounded-2xl font-black uppercase cursor-pointer">Cerrar Expediente</button>
      </div>
    </div>

    <div v-if="selectedSistema" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white w-full max-w-xl rounded-[3rem] p-10 animate-fade-in shadow-2xl">
        <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Evaluación de Sistema</h3>
        <div class="bg-slate-50 p-6 rounded-3xl text-left space-y-4">
          <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Área Analizada</p><p class="text-xl font-black text-[#005596] uppercase mt-1">Sistema {{ selectedSistema.SistemaID }}</p></div>
          <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado de Condición</p><span :class="selectedSistema.EsNormal === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-3 py-1 text-xs font-black rounded-lg uppercase tracking-wider inline-block">{{ selectedSistema.EsNormal === 1 ? 'Sistema Saludable / Normal' : 'Anormalidad / Hallazgo Clínico' }}</span></div>
          <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notas Clínicas del Especialista</p><p class="text-slate-700 font-medium italic text-sm mt-1 bg-white p-4 rounded-xl border border-slate-100 leading-relaxed">{{ selectedSistema.NotasAdicionales || 'El especialista no registró anotaciones adicionales específicas para este sistema.' }}</p></div>
        </div>
        <button @click="selectedSistema = null" class="w-full mt-6 py-4 bg-slate-800 text-white rounded-xl font-black uppercase cursor-pointer text-xs">Cerrar Detalle</button>
      </div>
    </div>

    <div v-if="pdfUrl" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div class="bg-white w-full max-w-4xl h-[85vh] rounded-[2.5rem] p-6 animate-fade-in shadow-2xl flex flex-col justify-between">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div class="text-left">
            <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Prescripción Médica Digital</h3>
            <p class="text-xs text-slate-400 font-bold uppercase">MedCore Global • Visor de Documentos Oficiales</p>
          </div>
          <button @click="cerrarVisualizador" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-xs flex items-center justify-center cursor-pointer">✕</button>
        </div>

        <div class="flex-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
          <iframe :src="pdfUrl" class="w-full h-full border-none" @load="pdfLoading = false"></iframe>
          <div v-if="pdfLoading" class="absolute inset-0 bg-white flex items-center justify-center">
            <div class="animate-spin inline-block w-8 h-8 border-4 border-[#005596] border-t-transparent rounded-full"></div>
          </div>
        </div>

        <div class="flex gap-4 mt-4">
          <button @click="cerrarVisualizador" class="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer">
            Cerrar Visor
          </button>
          <a :href="pdfUrl" :download="'Receta_MedCore_' + recetaSeleccionadaId + '.pdf'" class="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center block shadow-sm">
            📥 Descargar Copia Física
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { AppointmentRepository } from '../infrastructure/AppointmentRepo';
import type { MedicalRecord, Exam, Prescription } from '../domain/Appointment';
import api from '@/shared/infrastructure/api';

const props = defineProps<{ usuarioId: number }>();
const repo = new AppointmentRepository();
const toast = useToast();

const history = ref<MedicalRecord[]>([]);
const exams = ref<Exam[]>([]);
const prescriptions = ref<Prescription[]>([]);
const selectedItem = ref<MedicalRecord | null>(null);
const selectedSistema = ref<Exam | null>(null);

const activeSubTab = ref('consultas');
const loading = ref(false);

// 🧠 Paginación Separada e Independiente para cada sección
const paginaExams = ref(1);
const paginaRecetas = ref(1);
const tarjetasPorPagina = 4;

const pdfUrl = ref<string | null>(null);
const pdfLoading = ref(false);
const recetaSeleccionadaId = ref<number>(0);

const subTabs = [
  { id: 'consultas', label: 'Consultas' },
  { id: 'examenes', label: 'Examen Físico' },
  { id: 'recetas', label: 'Recetas' }
];

// Resetear contadores al alternar subpestañas
watch(activeSubTab, () => {
  paginaExams.value = 1;
  paginaRecetas.value = 1;
  loadData();
});

// 📋 LÓGICA DE PAGINACIÓN DE EXÁMENES FÍSICOS
const totalPaginasExams = computed(() => Math.ceil(exams.value.length / tarjetasPorPagina));
const examenesPaginados = computed(() => {
  const inicio = (paginaExams.value - 1) * tarjetasPorPagina;
  return exams.value.slice(inicio, inicio + tarjetasPorPagina);
});

// 📋 LÓGICA DE PAGINACIÓN DE RECETAS MÉDICAS (Evita el crecimiento infinito del scroll)
const totalPaginasRecetas = computed(() => Math.ceil(prescriptions.value.length / tarjetasPorPagina));
const recetasPaginadas = computed(() => {
  const inicio = (paginaRecetas.value - 1) * tarjetasPorPagina;
  return prescriptions.value.slice(inicio, inicio + tarjetasPorPagina);
});

// MOTOR DE TENDENCIA CLÍNICA (Examen Físico)
const metricasEvolutivas = computed(() => {
  const sistemasUnicos = ['general', 'cardiovascular', 'respiratorio', 'abdomen', 'neurológico'];

  return sistemasUnicos.map(nombreSistema => {
    const muestras = exams.value
      .filter(e => e.SistemaID.toLowerCase().trim() === nombreSistema)
      .slice(0, 3);

    let status = 'estable';
    let recorrido = '---';

    if (muestras.length >= 2) {
      const ultima = muestras[0]?.EsNormal ?? 1;
      const anterior = muestras[1]?.EsNormal ?? 1;
      recorrido = muestras.map(m => m?.EsNormal === 1 ? 'N' : 'A').reverse().join(' ➔ ');
      if (anterior === 0 && ultima === 1) status = 'mejora';
      if (anterior === 1 && ultima === 0) status = 'empeoro';
    } else if (muestras.length === 1) {
      const unica = muestras[0]?.EsNormal ?? 1;
      recorrido = unica === 1 ? 'N' : 'A';
    }

    return { nombre: nombreSistema, status, recorrido };
  });
});

const abrirVisualizadorPDF = async (recetaId: number) => {
  if (!recetaId) {
    toast.error("El identificador de la receta digital no es válido.");
    return;
  }

  recetaSeleccionadaId.value = recetaId;
  pdfLoading.value = true;

  try {
    const response = await api.get(`recetas/pdf/${recetaId}`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    pdfUrl.value = window.URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error al renderizar la receta:", error);
    toast.error("No se pudo previsualizar la receta médica.");
    pdfUrl.value = null;
  } finally {
    pdfLoading.value = false;
  }
};

const cerrarVisualizador = () => {
  if (pdfUrl.value) window.URL.revokeObjectURL(pdfUrl.value);
  pdfUrl.value = null;
  recetaSeleccionadaId.value = 0;
};

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
    console.error("Error cargando historial clínico:", error);
    toast.error("Error de sincronización con los servicios de MedCore Global.");
  } finally {
    loading.value = false;
  }
};

const showDetail = (item: MedicalRecord) => { selectedItem.value = item; };
const verDetalleSistema = (sistema: Exam) => { selectedSistema.value = sistema; };

onMounted(loadData);
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; }
.animate-fade-in { animation: fadeIn 0.35s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
