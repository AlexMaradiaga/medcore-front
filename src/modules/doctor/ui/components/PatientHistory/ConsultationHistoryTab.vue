<template>
  <div class="space-y-6 animate-fade-in text-left font-premium select-none">

    <div class="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-linear-to-r from-slate-50 to-blue-50/30 p-6 rounded-3xl border border-slate-100 shadow-xs">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-4 bg-blue-700 rounded-full block"></span>
          <h3 class="text-base font-black text-slate-900 uppercase tracking-tight">Historial de Consultas Previas</h3>
        </div>
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1 pl-4">Expediente cronológico e historial de atenciones</p>
      </div>
      <div v-if="data && data.length > 0" class="mt-3 sm:mt-0 pl-4 sm:pl-0">
        <span class="text-[10px] font-black bg-linear-to-r from-blue-700 to-blue-600 text-white px-4 py-2 rounded-xl uppercase tracking-wider shadow-sm flex items-center gap-1.5">
          <v-icon name="bi-bar-chart-fill" scale="0.85" /> Total: {{ data.length }} registros
        </span>
      </div>
    </div>

    <div v-if="!data || data.length === 0" class="text-center py-24 bg-linear-to-b from-slate-50 to-white border border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 text-[11px] font-black uppercase tracking-widest shadow-xs">
      <div class="mb-3 animate-bounce">
        <v-icon name="bi-file-earmark-text-fill" scale="2.0" class="text-slate-300" />
      </div>
      El paciente no registra consultas previas en el sistema.
    </div>

    <div v-else class="space-y-5">
      <div
        v-for="consulta in data"
        :key="consulta.id"
        class="bg-white border border-slate-200/80 rounded-4xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-blue-300/70 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group relative overflow-hidden"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-200 group-hover:bg-blue-700 transition-colors duration-300"></div>

        <div class="space-y-4 flex-1 pl-2">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="text-[10px] font-black bg-blue-50/80 text-blue-700 px-3.5 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-2 border border-blue-100 shadow-xs group-hover:bg-blue-700 group-hover:text-white group-hover:border-blue-700 transition-colors duration-300">
              <v-icon name="bi-calendar-event" scale="0.85" /> {{ formatFechaRenglon(consulta.fecha) }}
            </span>
            <span class="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-2 border border-emerald-100 shadow-xs">
              <v-icon name="bi-activity" scale="0.85" /> {{ consulta.especialidad }}
            </span>
          </div>

          <div class="space-y-2.5">
            <p class="text-slate-400 font-bold text-xs uppercase tracking-tight flex items-center gap-1.5">
              <span>Médico Responsable:</span>
              <span class="text-slate-800 font-black tracking-normal uppercase bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">{{ consulta.medico }}</span>
            </p>

            <div class="bg-linear-to-r from-slate-50/50 to-white p-4 rounded-2xl border-l-4 border-l-blue-700 border-y border-r border-slate-100 shadow-xs">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Diagnóstico Clínico Conclusivo</span>
              <p class="text-slate-900 font-black text-sm uppercase tracking-tight line-clamp-2 mt-1 leading-snug">
                {{ consulta.diagnostico }}
              </p>
            </div>

            <!-- Sección Dental -->
            <div
              v-if="obtenerCamposDentales(consulta).EspecialidadID === 8 || obtenerCamposDentales(consulta).PresupuestoTotal"
              class="bg-blue-50/40 border border-blue-100/60 p-4 rounded-2xl space-y-3 animate-fade-in mt-3"
            >
              <div class="flex justify-between items-center">
                <span class="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-1.5">
                  <v-icon name="bi-shield-shaded" scale="0.85" class="text-blue-700" /> Detalle Dental y Tratamiento
                </span>
                <span v-if="obtenerCamposDentales(consulta).PresupuestoTotal" class="text-[11px] font-mono font-black text-emerald-700 bg-white border border-emerald-200 px-3 py-1 rounded-xl shadow-3xs">
                  Presupuesto: L. {{ obtenerCamposDentales(consulta).PresupuestoTotal }}.00
                </span>
              </div>
              <p v-if="obtenerCamposDentales(consulta).DetalleTratamiento" class="text-[11px] font-semibold text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-3xs">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Evolución Bucal:</span>
                {{ obtenerCamposDentales(consulta).DetalleTratamiento }}
              </p>
              <button
                @click="auditarOdontograma(consulta)"
                class="bg-white hover:bg-blue-700 text-blue-700 hover:text-white border border-blue-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-200 shadow-3xs cursor-pointer flex items-center gap-1.5"
              >
                <v-icon name="bi-activity" scale="0.8" /> Consultar Mapa Odontograma
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center lg:justify-center pl-2 lg:pl-0">
          <button
            @click="abrirExamenModal(consulta)"
            class="w-full lg:w-auto bg-linear-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-7 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center gap-3 shadow-md shadow-blue-500/20"
          >
            <v-icon name="bi-search" scale="0.9" />
            <span>Ver Expediente</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="modalAbierto"
      class="fixed inset-0 z-9999 flex justify-center items-start bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in overflow-y-auto pt-32 pb-10"
    >
      <div
        class="bg-white rounded-[2.5rem] max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl flex flex-col relative animate-scale-up"
      >
        <div class="flex justify-between items-center border-b border-slate-100 pb-4 shrink-0">
          <div class="text-left">
            <span class="bg-linear-to-r from-blue-700 to-blue-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-md tracking-widest shadow-xs">Auditoría Clínica Digital</span>
            <h3 class="text-lg font-black text-slate-900 uppercase tracking-tight mt-1.5">Detalle Estructurado de Consulta</h3>
          </div>
          <button @click="modalAbierto = false" class="text-slate-400 hover:text-slate-900 text-lg p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer">✕</button>
        </div>

        <div v-if="cargandoDetalle" class="flex-1 flex flex-col items-center justify-center py-24">
          <div class="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Consultando Core de Datos Médicos...</span>
        </div>

        <div v-else-if="detalle" class="space-y-6 text-left">

          <div v-if="obtenerCamposDentales(consultaSeleccionadaActual).EspecialidadID === 8" class="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl space-y-2 mb-2">
            <span class="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-1">🦷 Evolución de Odontología</span>
            <p class="text-xs text-slate-700 font-medium bg-white p-3 rounded-xl border border-slate-100 shadow-3xs">
              {{ obtenerCamposDentales(consultaSeleccionadaActual).DetalleTratamiento || 'Sin evolución descriptiva registrada.' }}
            </p>
          </div>

          <div class="space-y-4">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <v-icon name="bi-search" scale="0.8" class="text-blue-700" /> Hallazgos por Órganos y Sistemas:
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="item in detalle.examenFisico"
                :key="item.examenSistemaID"
                class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-slate-400 transition-colors"
              >
                <div :class="['px-4 py-2.5 flex justify-between items-center border-b border-slate-200/60', item.condicion === 'Normal' ? 'bg-emerald-50/50' : 'bg-rose-50/50']">
                  <span class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <v-icon name="bi-folder-fill" scale="0.85" class="text-slate-400" /> {{ item.sistema }}
                  </span>
                  <span :class="['text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider border shadow-xs', item.condicion === 'Normal' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200']">
                    {{ item.condicion }}
                  </span>
                </div>
                <div class="p-4">
                  <p class="text-[11px] text-slate-600 font-medium leading-relaxed italic">
                    "{{ item.detalle || 'Sin observaciones registradas.' }}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2 border-t border-slate-100 pt-5">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnóstico Clínico del Evento:</h4>
            <div class="bg-linear-to-r from-blue-50 to-sky-50/40 p-4 rounded-xl border border-blue-100 shadow-inner flex items-start gap-3">
              <v-icon name="bi-pin-angle-fill" class="text-blue-700 shrink-0 mt-0.5" />
              <p class="text-xs font-black text-blue-700 uppercase tracking-wide leading-normal">
                {{ detalle.diagnostico || 'Pendiente de diagnóstico conclusivo.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-4 flex justify-end shrink-0">
          <button @click="modalAbierto = false" class="bg-linear-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md active:scale-95">
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="odontogramaModalAbierto"
      class="fixed inset-0 z-10000 flex justify-center items-start bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in overflow-y-auto pt-32 pb-10"
    >
      <div class="bg-white rounded-[2.5rem] max-w-2xl w-full p-8 space-y-6 border border-slate-200 shadow-2xl flex flex-col animate-scale-up">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
          <div class="text-left">
            <span class="bg-blue-100 text-blue-800 text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">Histórico Dental</span>
            <h3 class="text-base font-black text-slate-900 uppercase tracking-tight mt-1">Mapa de Piezas Odontológicas Auditadas</h3>
          </div>
          <button @click="odontogramaModalAbierto = false" class="text-slate-400 hover:text-slate-900 text-sm font-black p-2 rounded-xl hover:bg-slate-100 cursor-pointer">✕</button>
        </div>

        <div class="space-y-4 text-left">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Piezas dentales con hallazgos patológicos en esta sesión:</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="(caras, toothId) in odontogramaHistorialData"
              :key="toothId"
              class="border border-slate-200 p-3 rounded-2xl bg-slate-50 flex flex-col space-y-1.5"
            >
              <span class="text-xs font-black text-blue-700 font-mono">Pieza Dental #{{ toothId }}</span>
              <div class="text-[10px] font-bold text-slate-600 space-y-0.5">
                <p v-for="(estado, cara) in caras" :key="cara">
                  <span class="capitalize text-slate-400">{{ cara }}:</span>
                  <span :class="estado !== 'Sano' ? 'text-rose-600 font-black' : 'text-slate-500'">{{ estado }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-3 flex justify-end shrink-0">
          <button @click="odontogramaModalAbierto = false" class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95">
            Cerrar Mapa
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { DoctorRepository } from '../../../infrastructure/DoctorRepository';
import type { ConsultaPrevia, DetalleConsultaModal } from '../../../domain/PatientHistory';

import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiBarChartFill, BiFileEarmarkTextFill, BiCalendarEvent,
  BiActivity, BiSearch, BiFolderFill, BiExclamationTriangleFill, BiPinAngleFill, BiShieldShaded
} from 'oh-vue-icons/icons';

addIcons(
  BiBarChartFill, BiFileEarmarkTextFill, BiCalendarEvent,
  BiActivity, BiSearch, BiFolderFill, BiExclamationTriangleFill, BiPinAngleFill, BiShieldShaded
);

defineProps<{ data: ConsultaPrevia[] }>();

interface ExtensionOdonto {
  EspecialidadID?: number;
  PresupuestoTotal?: number;
  OdontogramaAdultoJson?: string | Record<string, Record<string, string>>;
  ExamenesOdontologicosJson?: string | Record<string, unknown>[];
  DetalleTratamiento?: string;
}

const repo = new DoctorRepository();
const toast = useToast();

const modalAbierto = ref<boolean>(false);
const cargandoDetalle = ref<boolean>(false);
const detalle = ref<DetalleConsultaModal | null>(null);

const odontogramaModalAbierto = ref<boolean>(false);
const odontogramaHistorialData = ref<Record<string, Record<string, string>>>({});

const consultaSeleccionadaActual = ref<ConsultaPrevia>({
  id: 0,
  fecha: '',
  medico: '',
  especialidad: '',
  diagnostico: '',
  tratamiento: ''
});

watch([modalAbierto, odontogramaModalAbierto], ([val1, val2]) => {
  if (val1 || val2) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const obtenerCamposDentales = (consulta: ConsultaPrevia): ConsultaPrevia & ExtensionOdonto => {
  return consulta as unknown as (ConsultaPrevia & ExtensionOdonto);
};

const formatFechaRenglon = (dateStr: string | undefined | null) => {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const auditarOdontograma = (consulta: ConsultaPrevia): void => {
  const dentalData = obtenerCamposDentales(consulta);
  if (dentalData.OdontogramaAdultoJson) {
    try {
      const mapaDental = typeof dentalData.OdontogramaAdultoJson === 'string'
        ? (JSON.parse(dentalData.OdontogramaAdultoJson) as Record<string, Record<string, string>>)
        : (dentalData.OdontogramaAdultoJson as Record<string, Record<string, string>>);

      const piezasConHallazgos: Record<string, Record<string, string>> = {};

      Object.entries(mapaDental).forEach(([toothId, carasObj]: [string, Record<string, string>]) => {
        const tieneProblema = Object.values(carasObj).some((estado: string) => estado !== 'Sano');
        if (tieneProblema) {
          piezasConHallazgos[toothId] = carasObj;
        }
      });

      odontogramaHistorialData.value = piezasConHallazgos;
      odontogramaModalAbierto.value = true;
      toast.success(`Cargando mapa anatómico de la consulta #${consulta.id}`);
    } catch {
      toast.error('Ocurrió un error al procesar el mapeo del odontograma.');
    }
  } else {
    toast.warning('No se encontraron trazas gráficas de odontograma en este evento.');
  }
};

const abrirExamenModal = async (consultaObj: ConsultaPrevia) => {
  if (!consultaObj.id || consultaObj.id <= 0) return;

  consultaSeleccionadaActual.value = consultaObj;
  modalAbierto.value = true;
  cargandoDetalle.value = true;

  try {
    const res = await repo.getDetalleConsulta(consultaObj.id);
    if (res && res.estado === 'success') {
      detalle.value = res.datos;
    }
  } catch (error: unknown) {
    console.error("[MedCore Error]", error);
    toast.error('No se pudo recuperar el expediente detallado de la consulta.');
  } finally {
    cargandoDetalle.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Inter:wght@400;600;800&display=swap');

.font-premium { font-family: 'Montserrat', 'Inter', sans-serif; }

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 640px) {
  .pt-32 {
    padding-top: 5rem;
  }
}
</style>
