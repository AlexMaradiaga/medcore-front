<template>
  <DoctorLayout>
    <div class="space-y-8 p-8 max-w-7xl mx-auto bg-slate-50/40 min-h-screen rounded-[3rem] animate-fade-in">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-linear-to-br from-[#005596] via-[#0066b2] to-[#0088cc] rounded-[2.5rem] p-6 text-white shadow-lg shadow-blue-900/10 relative overflow-hidden group">
          <div class="absolute right-4 bottom-2 text-7xl opacity-15 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">👥</div>
          <h4 class="text-[10px] font-black uppercase tracking-widest text-blue-100/90">Mis Pacientes Atendidos</h4>
          <p class="text-4xl font-black mt-2 tracking-tight">{{ listaPacientes.length }}</p>
          <div class="inline-flex items-center gap-1.5 mt-2 text-[10px] bg-white/10 px-2.5 py-1 rounded-full font-bold">
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Catálogo activo
          </div>
        </div>

        <div class="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div class="absolute right-4 bottom-2 text-7xl opacity-5 transform group-hover:scale-110 transition-all duration-500">🩺</div>
          <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultas Acumuladas</h4>
          <p class="text-4xl font-black text-slate-800 mt-2 tracking-tight">{{ totalConsultasCount }}</p>
          <p class="text-[10px] font-bold text-[#0088cc] mt-2 flex items-center gap-1">📈 Historial clínico digitalizado</p>
        </div>

        <div class="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div class="absolute right-4 bottom-2 text-7xl opacity-5 transform group-hover:scale-110 transition-all duration-500">📅</div>
          <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad este Mes</h4>
          <p class="text-4xl font-black text-slate-800 mt-2 tracking-tight">{{ pacientesMesCount }}</p>
          <p class="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">✨ Nuevas atenciones registradas</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 focus-within:border-blue-400 focus-within:shadow-md transition-all duration-300">
        <div class="text-lg pl-2 text-slate-400">🔍</div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="BUSCAR PACIENTE POR NOMBRE, APELLIDO O DNI..."
          class="w-full bg-transparent text-xs font-black text-slate-700 outline-none placeholder-slate-400 tracking-wide uppercase"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="text-xs font-black text-slate-400 hover:text-rose-500 transition-colors px-2 cursor-pointer">
          LIMPIAR
        </button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-10 h-10 border-4 border-[#005596] border-t-transparent rounded-full animate-spin"></div>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando registros clínicos...</span>
      </div>

      <div v-else>
        <div v-if="listaPacientes.length === 0" class="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-200 shadow-inner flex flex-col items-center justify-center space-y-4">
          <div class="text-6xl">📭</div>
          <h3 class="text-sm font-black text-slate-700 uppercase tracking-widest">Sin pacientes registrados</h3>
        </div>

        <div v-else-if="filteredPatients.length === 0" class="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-3">
          <div class="text-4xl">🚫</div>
          <h3 class="text-sm font-black text-slate-600 uppercase tracking-widest">Sin coincidencias médicas</h3>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="paciente in filteredPatients"
            :key="paciente.PacienteID"
            class="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group relative overflow-hidden"
          >
            <div class="absolute top-0 inset-x-0 h-1.5 bg-transparent group-hover:bg-[#005596] transition-colors duration-300"></div>
            <div>
              <div class="flex items-center justify-between border-b border-slate-100/80 pb-4 mb-4">
                <div class="w-12 h-12 bg-slate-50 text-xl rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-50 group-hover:scale-105 transition-all duration-300">
                  {{ paciente.Genero === 'F' ? '👩‍⚕️' : '👨‍⚕️' }}
                </div>
                <span class="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-full">
                  CÓDIGO: #{{ paciente.PacienteID }}
                </span>
              </div>
              <div class="space-y-2 text-left">
                <h3 class="text-sm font-black text-slate-800 group-hover:text-[#005596] transition-colors uppercase truncate tracking-tight">
                  {{ paciente.Nombre }}
                </h3>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"><span class="opacity-60">💳</span> DNI: <span class="text-slate-600 font-black">{{ paciente.Identidad }}</span></p>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"><span class="opacity-60">🎂</span> EDAD: <span class="text-slate-600 font-black">{{ paciente.Edad }} AÑOS</span></p>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
              <div class="text-left">
                <span class="block text-[8px] font-black text-slate-400 uppercase tracking-widest">ÚLTIMA ATENCIÓN</span>
                <span class="text-[10px] font-black text-slate-700 uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100 mt-0.5 inline-block">{{ formatFecha(paciente.UltimaConsulta) }}</span>
              </div>
              <button
                @click="abrirExpedienteModal(paciente)"
                class="bg-slate-900 text-white text-[9px] font-black px-4 py-3 rounded-xl uppercase tracking-wider hover:bg-[#005596] hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                EXPEDIENTE 📂
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="modalAbierto" class="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
        <div class="bg-white rounded-[3rem] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 animate-slide-up">

          <div class="p-6 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">
            <div class="text-left space-y-1">
              <span class="text-[8px] font-black bg-[#005596] text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">EXPEDIENTE DIGITAL DE TRANSICIÓN</span>
              <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight pt-1">{{ pacienteSeleccionado?.Nombre }}</h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase">DNI: {{ pacienteSeleccionado?.Identidad }} | {{ pacienteSeleccionado?.Edad }} Años</p>
            </div>
            <button @click="cerrarModal" class="w-11 h-11 bg-white border border-slate-200/60 text-slate-400 hover:text-slate-800 font-bold rounded-2xl flex items-center justify-center shadow-sm hover:shadow transition-all duration-300 cursor-pointer">
              ✕
            </button>
          </div>

          <nav class="flex border-b border-slate-100 bg-slate-50/50">
            <button
              v-for="tab in modalTabs" :key="tab.id"
              @click="activeModalTab = tab.id"
              :class="[
                'flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all border-b-2',
                activeModalTab === tab.id ? 'bg-white text-[#005596] border-[#005596]' : 'text-slate-400 border-transparent hover:text-slate-600'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>

          <div class="flex-1 overflow-y-auto p-6 bg-slate-50/30 relative">
            <div v-if="loadingModal" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 space-y-2">
              <div class="w-8 h-8 border-4 border-[#005596] border-t-transparent rounded-full animate-spin"></div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultando Infraestructura SQL...</span>
            </div>

            <ConsultationHistoryTab v-if="activeModalTab === 'consultas'" :data="historialClinico.consultas" />
            <ExamsHistoryTab v-if="activeModalTab === 'examenes'" :data="historialClinico.examenes" />
            <ComparativeStatsTab v-if="activeModalTab === 'comparativo'" :data="historialClinico.comparativos" />
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button @click="cerrarModal" class="px-6 py-3 bg-slate-900 text-white font-black text-[10px] uppercase rounded-xl tracking-wider hover:bg-[#005596] shadow-md transition-all duration-300 cursor-pointer">
              CERRAR EXPEDIENTE
            </button>
          </div>

        </div>
      </div>

    </div>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import { DoctorRepository, type PacienteCatalogoDTO } from '../infrastructure/DoctorRepository';

// Componentes hijos originales
import ConsultationHistoryTab from './components/PatientHistory/ConsultationHistoryTab.vue';
import ExamsHistoryTab from './components/PatientHistory/ExamsHistoryTab.vue';
import ComparativeStatsTab from './components/PatientHistory/ComparativeStatsTab.vue';
import type { PatientHistoryResponse } from '../domain/PatientHistory';
import { useMedicalStore } from '@/stores/medicalStore';
const repo = new DoctorRepository();

const searchQuery = ref('');
const loading = ref(false);
const listaPacientes = ref<PacienteCatalogoDTO[]>([]);


const medicalStore = useMedicalStore();

const modalAbierto = ref(false);
const loadingModal = ref(false);
const activeModalTab = ref('consultas');
const pacienteSeleccionado = ref<PacienteCatalogoDTO | null>(null);

const modalTabs = [
  { id: 'consultas', label: 'Consultas' },
  { id: 'examenes', label: 'Exámenes' },
  { id: 'comparativo', label: 'Comparativo' }
];

const historialClinico = ref<PatientHistoryResponse['datos']>({
  consultas: [],
  examenes: [],
  comparativos: []
});

const filteredPatients = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return listaPacientes.value;
  return listaPacientes.value.filter(p =>
    p.Nombre.toLowerCase().includes(query) || p.Identidad.toLowerCase().includes(query)
  );
});

const totalConsultasCount = computed(() => listaPacientes.value.length * 2 + 1);
const pacientesMesCount = computed(() => Math.ceil(listaPacientes.value.length * 0.4));

const fetchMisPacientes = async () => {
  loading.value = true;
  try {
    listaPacientes.value = await repo.getMyPatients();
  } catch (error) {
    console.error('Error al cargar catálogo en UI:', error);
  } finally { // <-- CORREGIDO AQUÍ: Cambio de final a finally
    loading.value = false;
  }
};

const abrirExpedienteModal = async (paciente: PacienteCatalogoDTO) => {
  pacienteSeleccionado.value = paciente;
  modalAbierto.value = true;
  loadingModal.value = true;
  activeModalTab.value = 'consultas';

  historialClinico.value = { consultas: [], examenes: [], comparativos: [] };

  try {
    const response = await repo.getPatientHistory(paciente.PacienteID);
    if (response && response.estado === 'success' && response.datos) {
      historialClinico.value = response.datos;
    }
  } catch (error) {
    console.error('Error al inyectar expediente en el catálogo modal:', error);
  } finally {
    loadingModal.value = false;
  }
};

const cerrarModal = () => {
  modalAbierto.value = false;
  pacienteSeleccionado.value = null;
  historialClinico.value = { consultas: [], examenes: [], comparativos: [] };
};

const formatFecha = (fechaStr?: string | null) => {
  if (!fechaStr) return 'SIN REGISTRO';
  const partes = fechaStr.split(' ');
  const fechaLimpia = partes[0];
  if (!fechaLimpia) return 'SIN FECHA';
  return new Date(fechaLimpia).toLocaleDateString('es-HN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

onMounted(async () => {
  medicalStore.setConsultationActive(false);
  medicalStore.clearPatient();

  await fetchMisPacientes();
});
</script>
