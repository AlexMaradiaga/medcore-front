<template>
  <DoctorLayout>
    <main class="min-h-screen bg-slate-50 pb-32">
      <div class="bg-[#005596] text-white px-12 py-6 flex justify-between items-center shadow-inner">
        <div class="flex items-center gap-8">
          <button @click="router.back()" class="flex items-center gap-2 text-xs font-black hover:bg-white/10 p-2 rounded-lg transition-all uppercase tracking-widest cursor-pointer">
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

      <nav class="bg-white border-b border-slate-200 px-12 flex gap-12 shadow-sm sticky top-0 z-10">
        <button
          v-for="tab in ['Subjetivo', 'Objetivo', 'Evaluación', 'Plan']"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'py-5 text-xs font-black uppercase tracking-widest transition-all border-b-4 cursor-pointer',
            activeTab === tab ? 'border-[#005596] text-[#005596]' : 'border-transparent text-slate-400 hover:text-slate-600'
          ]"
        >
          <span class="mr-2">{{ getTabIcon(tab) }}</span> {{ tab }}
        </button>
      </nav>

      <div class="p-12 max-w-7xl mx-auto">
        <div class="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm min-h-125">

          <div v-if="activeTab === 'Subjetivo'" class="space-y-10 animate-fade-in text-left">
            <h3 class="text-xl font-black text-slate-800">Datos Subjetivos</h3>
            <div class="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100 space-y-6 relative transition-all text-left">
              <div class="flex justify-between items-center">
                <h4 class="text-sm font-black text-slate-700 uppercase tracking-tight">Motivo de Consulta y Síntomas</h4>
                <div class="flex gap-2">
                  <span class="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Pre-llenado</span>
                  <button v-if="!isEditingSubjetivo" @click="startEditingSubjetivo" class="text-slate-400 hover:text-blue-500 transition-all text-sm p-1 cursor-pointer">✎</button>
                </div>
              </div>
              <div v-if="!isEditingSubjetivo" class="animate-fade-in">
                <p class="text-slate-500 font-bold leading-relaxed">
                  {{ editableSubjetivo || (appointment?.Motivo + ' - ' + (appointment?.Sintomas || 'Sin síntomas registrados')) }}
                </p>
              </div>
              <div class="space-y-6 animate-fade-in" v-else>
                <textarea v-model="tempSubjetivo" class="w-full bg-white border-2 border-blue-50 rounded-2xl p-6 outline-none focus:border-blue-200 transition-all font-bold text-slate-600 min-h-30 shadow-inner"></textarea>
                <div class="flex gap-3">
                  <button @click="saveSubjetivo" class="bg-[#10b981] text-white px-6 py-2 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 shadow-lg shadow-green-100 transition-all hover:scale-105 cursor-pointer">✓ Guardar</button>
                  <button @click="isEditingSubjetivo = false" class="bg-white text-slate-400 px-6 py-2 rounded-xl font-black uppercase text-[10px] border border-slate-200 transition-all hover:bg-slate-50 cursor-pointer">✕ Cancelar</button>
                </div>
              </div>
            </div>
          </div>

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
                  <button @click="toggleSistema(Number(index))" class="w-full flex justify-between items-center p-6 hover:bg-slate-50 transition-all cursor-pointer">
                    <div class="flex items-center gap-4">
                      <span class="font-black text-slate-700 text-sm uppercase">{{ sistema.nombre }}</span>
                      <span v-if="countHallazgos(Number(index)) > 0 && !sistema.isNormal" class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[8px] font-black uppercase">
                        {{ countHallazgos(Number(index)) }} hallazgos
                      </span>
                      <span v-else-if="sistema.isNormal" class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[8px] font-black uppercase">Normal</span>
                    </div>
                    <span class="text-slate-300">{{ sistema.open ? '▲' : '▼' }}</span>
                  </button>

                  <div v-if="sistema.open" class="p-8 bg-white border-t border-slate-50 animate-fade-in space-y-6 text-left">
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" v-model="sistema.isNormal" @change="handleNormalChange(Number(index))" class="w-5 h-5 rounded border-slate-300 text-[#005596]">
                      <span class="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Normal / Sin hallazgos</span>
                    </label>

                    <div v-if="!sistema.isNormal" class="space-y-4 animate-fade-in">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hallazgos:</p>
                      <div class="grid grid-cols-2 gap-4">
                        <label v-for="opcion in sistema.opciones" :key="opcion" class="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            v-model="(form.examen_fisico_opciones[sistema.id] as Record<string, boolean>)[opcion]"
                            class="w-4 h-4 rounded border-slate-300 text-[#005596]"
                          >
                          <span class="text-sm font-medium text-slate-500">{{ opcion }}</span>
                        </label>
                      </div>
                    </div>
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

          <div v-if="activeTab === 'Evaluación'" class="space-y-8 animate-fade-in text-left">
            <div class="border-b border-slate-100 pb-2">
              <h3 class="text-xl font-black text-slate-800">Diagnóstico Clínico</h3>
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Búsqueda automatizada bajo el estándar internacional OMS CIE-11 (ICD-11)</p>
            </div>

            <div class="relative max-w-3xl">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 block mb-2">Buscar diagnóstico</label>

              <div class="relative flex items-center">
                <span class="absolute left-6 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  v-model="busquedaDiag"
                  @input="onBusquedaInput"
                  @focus="mostrarDropdown = true"
                  placeholder="Escriba para buscar un diagnóstico en la OMS (Mínimo 3 letras)..."
                  class="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 focus:bg-white focus:border-blue-100 outline-none font-bold text-slate-700 transition-all shadow-inner"
                />
                <span v-if="buscandoAPI" class="absolute right-6 flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              </div>

              <div
                v-if="mostrarDropdown && resultadosDiagnosticos.length > 0"
                v-click-outside="cerrarDropdown"
                class="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-fade-in custom-scrollbar"
              >
                <ul class="divide-y divide-slate-50">
                  <li
                    v-for="diag in resultadosDiagnosticos"
                    :key="diag.codigo"
                    @click="seleccionarDiagnostico(diag)"
                    class="flex justify-between items-center px-6 py-4 hover:bg-slate-50/80 transition-all cursor-pointer group"
                  >
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                        {{ diag.descripcion }}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="form.diagnostico.length > 0" class="space-y-3 max-w-3xl">
              <div
                v-for="(diagEstablecido, idx) in form.diagnostico"
                :key="idx"
                class="bg-blue-50/40 border border-blue-100/60 rounded-2xl p-6 flex justify-between items-center animate-fade-in"
              >
                <div class="text-left space-y-1">
                  <p class="text-[9px] font-black text-[#005596] uppercase tracking-widest">Diagnóstico Establecido #{{ Number(idx) + 1 }}</p>
                  <p class="text-sm font-black text-slate-800">{{ diagEstablecido }}</p>
                </div>
                <button type="button" @click="removerDiagnostico(Number(idx))" class="text-xs font-bold text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
                  Quitar ✕
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'Plan'" class="space-y-8 animate-fade-in text-left font-premium">
            <div class="border-b border-slate-100 pb-2">
              <h3 class="text-xl font-black text-slate-800">Plan de Tratamiento</h3>
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Prescripción estructurada de fármacos para la receta electrónica</p>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
              <div class="xl:col-span-1 bg-slate-50/60 border border-slate-100 rounded-4xl p-6 space-y-4">
                <h4 class="text-[11px] font-black text-slate-700 uppercase tracking-wider border-b pb-1">💊 Dosificación del Fármaco</h4>

                <div class="space-y-3 text-xs font-bold text-slate-600">
                  <div class="space-y-1">
                    <label class="uppercase text-[9px] text-slate-400 tracking-wider">Medicamento</label>
                    <input v-model="nuevoMedPlan.NombreMedicamento" type="text" class="w-full bg-white border border-slate-200/80 p-3.5 rounded-xl focus:outline-blue-200 uppercase text-[11px] font-black text-slate-800" placeholder="Ej. Acetaminofén 500mg" />
                  </div>

                  <div class="space-y-1">
                    <label class="uppercase text-[9px] text-slate-400 tracking-wider">Dosis</label>
                    <input v-model="nuevoMedPlan.Dosis" type="text" class="w-full bg-white border border-slate-200/80 p-3.5 rounded-xl focus:outline-blue-200 text-[11px]" placeholder="Ej. 1 tableta cada 6 horas" />
                  </div>

                  <div class="space-y-1">
                    <label class="uppercase text-[9px] text-slate-400 tracking-wider">Indicaciones</label>
                    <textarea v-model="nuevoMedPlan.Indicaciones" rows="3" class="w-full bg-white border border-slate-200/80 p-3.5 rounded-xl focus:outline-blue-200 text-[11px] resize-none font-medium" placeholder="Ej. Tomar por 3 días si presenta fiebre."></textarea>
                  </div>

                  <button @click="agregarMedicamentoAlPlan" class="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl uppercase tracking-widest text-[9px] font-black mt-2 transition-all cursor-pointer active:scale-98 shadow-sm">
                    ➕ Agregar Medicamento
                  </button>
                </div>
              </div>

              <div class="xl:col-span-2 bg-white border border-slate-100 rounded-4xl p-6 min-h-87.5 flex flex-col justify-between">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse min-w-112.5">
                    <thead>
                      <tr class="border-b border-slate-100 text-slate-400 font-black text-[9px] uppercase tracking-wider">
                        <th class="py-2 px-2 w-10 text-center">#</th>
                        <th class="py-2 px-3">Medicamento</th>
                        <th class="py-2 px-3 w-1/4">Dosis</th>
                        <th class="py-2 px-3 w-1/3">Indicaciones</th>
                        <th class="py-2 px-2 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="form.detalle_medicamentos.length === 0">
                        <td colspan="5" class="text-center py-16 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/40 rounded-2xl border border-dashed border-slate-100">
                          📭 Ningún medicamento registrado en la consulta actual.
                        </td>
                      </tr>
                      <tr v-else v-for="(med, index) in form.detalle_medicamentos" :key="index" class="border-b border-slate-50 hover:bg-slate-50/40 transition-all font-bold text-slate-700 text-xs animate-fade-in">
                        <td class="py-3.5 px-2 text-center text-slate-400 font-black">{{ Number(index) + 1 }}</td>
                        <td class="py-3.5 px-3 text-slate-900 font-black uppercase text-[11px]">{{ med.NombreMedicamento }}</td>
                        <td class="py-3.5 px-3 text-slate-600 font-semibold">{{ med.Dosis }}</td>
                        <td class="py-3.5 px-3 text-slate-500 font-medium italic leading-relaxed">{{ med.Indicaciones }}</td>
                        <td class="py-3.5 px-2 text-center">
                          <button @click="removerMedicamentoDelPlan(Number(index))" class="text-slate-300 hover:text-rose-600 font-black p-1 rounded-md hover:bg-rose-50 transition-all cursor-pointer">✕</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 flex justify-center gap-4 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div class="max-w-7xl w-full flex justify-end gap-4">
          <button @click="handleSaveDraft" class="flex items-center gap-2 px-10 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black uppercase text-xs hover:bg-slate-50 transition-all cursor-pointer">💾 Guardar Borrador</button>
          <button @click="handleSubmit" :disabled="loading" class="flex items-center gap-2 px-12 py-4 bg-linear-to-r from-[#005596] to-[#00345c] text-white rounded-2xl font-black uppercase text-xs shadow-xl hover:scale-105 transition-all disabled:opacity-50 cursor-pointer">
            🚀 {{ loading ? 'Procesando...' : 'Finalizar Consulta' }}
          </button>
        </div>
      </footer>
    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import { useMedicalStore } from '@/stores/medicalStore';
import { DoctorRepository } from '../infrastructure/DoctorRepository';
import type { DoctorAppointment, DiagnosticoCIE11 } from '../domain/DoctorAppointment';
import type { DirectiveBinding } from 'vue';

interface HTMLElementWithClickOutside extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void;
}

interface SignosVitales {
  presion: string;
  pulso: string;
  temp: string;
  respiracion: string;
}

interface HallazgosSistema {
  [key: string]: Record<string, boolean>;
}

interface FilaMedicamentoConsulta {
  NombreMedicamento: string;
  Dosis: string;
  Indicaciones: string;
}

const router = useRouter();
const toast = useToast();
const medicalStore = useMedicalStore();
const repo = new DoctorRepository();
const appointment = ref<DoctorAppointment | null>(null);
const loading = ref(false);
const activeTab = ref('Subjetivo');
const isEditingSubjetivo = ref(false);
const editableSubjetivo = ref('');
const tempSubjetivo = ref('');

const busquedaDiag = ref('');
const buscandoAPI = ref(false);
const mostrarDropdown = ref(false);
const resultadosDiagnosticos = ref<DiagnosticoCIE11[]>([]);
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const nuevoMedPlan = ref<FilaMedicamentoConsulta>({
  NombreMedicamento: '',
  Dosis: '',
  Indicaciones: ''
});

const obtenerBorradorInicial = () => {
  const borradorGuardado = localStorage.getItem('draft_consulta_actual');
  if (borradorGuardado) {
    try {
      return JSON.parse(borradorGuardado);
    } catch (e) {
      console.error("Error al parsear el borrador clínico local:", e);
    }
  }
  return {
    cita_id: 0,
    signos_vitales: { presion: '', pulso: '', temp: '', respiracion: '' } as SignosVitales,
    examen_fisico_opciones: {
      general: {}, cardiovascular: {}, respiratorio: {}, abdomen: {}, neurologico: {}
    } as HallazgosSistema,
    examen_fisico_notas: {
      general: '', cardiovascular: '', respiratorio: '', abdomen: '', neurologico: ''
    } as Record<string, string>,
    diagnostico: [] as string[],
    notas_medicas: '',
    detalle_medicamentos: [] as FilaMedicamentoConsulta[]
  };
};

const form = ref(obtenerBorradorInicial());

watch(
  form,
  (nuevoEstado) => {
    localStorage.setItem('draft_consulta_actual', JSON.stringify(nuevoEstado));
  },
  { deep: true }
);

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

const onBusquedaInput = () => {
  mostrarDropdown.value = true;
  if (debounceTimeout) clearTimeout(debounceTimeout);

  const query = busquedaDiag.value.trim();
  if (query.length < 3) {
    resultadosDiagnosticos.value = [];
    return;
  }

  buscandoAPI.value = true;
  debounceTimeout = setTimeout(async () => {
    try {
      resultadosDiagnosticos.value = await repo.buscarDiagnosticosCIE11(query);
    } catch (err) {
      console.error(err);
    } finally {
      buscandoAPI.value = false;
    }
  }, 380);
};

const seleccionarDiagnostico = (diag: DiagnosticoCIE11) => {
  if (!form.value.diagnostico.includes(diag.descripcion)) {
    form.value.diagnostico.push(diag.descripcion);
  }
  busquedaDiag.value = '';
  mostrarDropdown.value = false;
};

const removerDiagnostico = (index: number) => {
  form.value.diagnostico.splice(index, 1);
};

const cerrarDropdown = () => {
  setTimeout(() => { mostrarDropdown.value = false; }, 250);
};

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
  const tabs = ['Subjetivo', 'Objective', 'Evaluación', 'Plan'];
  const index = tabs.indexOf(activeTab.value) !== -1 ? tabs.indexOf(activeTab.value) : 1;
  return ((index + 1) / tabs.length) * 100;
});

const getTabIcon = (tab: string) => {
  const icons: Record<string, string> = { 'Subjetivo': '📄', 'Objetivo': '🩺', 'Objective': '🩺', 'Evaluación': '⚖️', 'Plan': '🗒️' };
  return icons[tab] || '';
};

onMounted(() => {
  const saved = localStorage.getItem('current_appointment');
  if (!saved) {
    router.push('/medico/dashboard');
    return;
  }
  appointment.value = JSON.parse(saved);

  if (appointment.value) {
    form.value.cita_id = appointment.value.CitaID;

    if (form.value.notas_medicas) {
      editableSubjetivo.value = form.value.notas_medicas;
      tempSubjetivo.value = form.value.notas_medicas;
    }
  }

  if (!medicalStore.isConsultationActive) {
    medicalStore.setConsultationActive(true);
  }
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

const agregarMedicamentoAlPlan = (): void => {
  if (!nuevoMedPlan.value.NombreMedicamento || !nuevoMedPlan.value.NombreMedicamento.trim()) {
    toast.error("El campo 'Medicamento' es obligatorio para poder anexarlo al plan.");
    return;
  }

  form.value.detalle_medicamentos.push({
    NombreMedicamento: nuevoMedPlan.value.NombreMedicamento.trim(),
    Dosis: nuevoMedPlan.value.Dosis ? nuevoMedPlan.value.Dosis.trim() : 'Según criterio clínico',
    Indicaciones: nuevoMedPlan.value.Indicaciones ? nuevoMedPlan.value.Indicaciones.trim() : 'Sin indicaciones especiales registradas.'
  });

  nuevoMedPlan.value = { NombreMedicamento: '', Dosis: '', Indicaciones: '' };
};

const removerMedicamentoDelPlan = (index: number) => {
  form.value.detalle_medicamentos.splice(index, 1);
};

const handleSaveDraft = () => {
  localStorage.setItem('draft_consulta_actual', JSON.stringify(form.value));
  toast.success('Borrador clínico respaldado de forma segura en el almacenamiento local.');
};

const handleSubmit = async () => {
  if (form.value.diagnostico.length === 0 || form.value.detalle_medicamentos.length === 0) {
    toast.error('Por favor complete el diagnóstico y agregue al menos un medicamento en la pestaña de Plan antes de finalizar.');
    return;
  }

  loading.value = true;
  try {
    const payload = JSON.parse(JSON.stringify(form.value));
    payload.cita_id = Number(payload.cita_id);
    payload.diagnostico = form.value.diagnostico.join(', ');

    await repo.completeConsultation(payload);
    toast.success('¡Consulta finalizada con éxito!');

    // 🌟 SEMBRAMOS EL RESUMEN EN LOCALSTORAGE ELIMINANDO VOLATILIDAD DE HISTORIAL
    const objetoResumen = {
      paciente: appointment.value?.Paciente || 'Paciente',
      telefono: appointment.value?.Telefono || '',
      email: appointment.value?.EmailPaciente || '',
      edad: appointment.value?.Edad,
      genero: appointment.value?.Genero,
      diagnostico: payload.diagnostico,
      detalle_medicamentos: form.value.detalle_medicamentos
    };

    localStorage.setItem('medcore_resumen_compartir', JSON.stringify(objetoResumen));
    localStorage.removeItem('draft_consulta_actual');

    medicalStore.setConsultationActive(false);
    medicalStore.clearPatient();
    localStorage.removeItem('current_appointment');

    // Navegación directa hacia el resumen final
    router.push(`/medico/consulta/${payload.cita_id}/resumen`);
  } catch (err) {
    toast.error('Error crítico al intentar finalizar la consulta médica.');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const vClickOutside = {
  mounted(el: HTMLElementWithClickOutside, binding: DirectiveBinding<(event: Event) => void>) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: HTMLElementWithClickOutside) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent);
    }
  }
};
</script>

