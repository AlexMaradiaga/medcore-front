<template>
  <div class="space-y-6 animate-fade-in text-left font-premium">

    <div class="mb-4">
      <h3 class="text-sm font-black text-slate-800 uppercase tracking-tight">Historial de Consultas Previas</h3>
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Listado cronológico de atenciones médicas</p>
    </div>

    <div v-if="!data || data.length === 0" class="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-4xl text-slate-400 text-[11px] font-black uppercase tracking-widest">
      📄 El paciente no registra consultas previas en el sistema.
    </div>

    <div v-else class="space-y-4">
      <div v-for="consulta in data" :key="consulta.id" class="bg-white border border-slate-100 rounded-4xl p-8 shadow-2xs hover:border-blue-200 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
        <div class="space-y-3 flex-1">
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-black bg-blue-50 text-[#005596] px-4 py-1.5 rounded-xl uppercase tracking-wider">📅 {{ formatFechaRenglon(consulta.fecha) }}</span>
            <span class="text-[10px] font-black bg-slate-50 text-slate-600 px-4 py-1.5 rounded-xl uppercase tracking-wider">🩺 {{ consulta.especialidad }}</span>
          </div>
          <div class="text-xs font-bold text-slate-700 space-y-1.5">
            <p class="text-slate-400 font-semibold text-[11px]">Médico Tratante: <span class="text-slate-800 font-black uppercase">{{ consulta.medico }}</span></p>
            <p class="text-slate-400 font-semibold text-[11px] line-clamp-1">Diagnóstico: <span class="text-[#005596] font-black uppercase tracking-tight">{{ consulta.diagnostico }}</span></p>
          </div>
        </div>
        <button @click="abrirExamenModal(consulta.id)" class="bg-slate-50 hover:bg-[#005596] hover:text-white border border-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 flex items-center gap-2 group-hover:border-blue-300 font-premium">
          <span>👁️‍🗨️</span> Ver Detalles
        </button>
      </div>
    </div>

    <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
      <div class="bg-white rounded-[2.5rem] max-w-3xl w-full p-8 space-y-6 overflow-hidden border border-slate-100 shadow-2xl flex flex-col max-h-[90vh]">

        <div class="flex justify-between items-center border-b border-slate-100 pb-4">
          <div class="text-left">
            <span class="bg-[#005596] text-white text-[9px] font-black uppercase px-3 py-1 rounded-md tracking-widest">Auditoría Clínica Externa</span>
            <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight mt-1">Detalle General de Consulta</h3>
          </div>
          <button @click="modalAbierto = false" class="text-slate-400 hover:text-slate-600 text-lg p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">✕</button>
        </div>

        <div v-if="cargandoDetalle" class="flex-1 flex flex-col items-center justify-center py-20">
          <span class="text-[10px] font-black text-slate-400 animate-pulse uppercase tracking-widest">Abriendo Expediente de Consulta...</span>
        </div>

        <div v-else-if="detalle" class="flex-1 overflow-y-auto pr-2 space-y-6 text-left">
          <div class="space-y-2">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evolución Subjetiva / Notas Médicas:</h4>
            <div class="bg-slate-50/60 p-5 rounded-3xl border border-slate-100 text-xs font-bold text-slate-700 italic leading-relaxed">
              "{{ detalle.notasEvolucionSubjetiva || 'No se registraron notas subjetivas o evoluciones basales.' }}"
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Examen Físico de Sistemas (Data SQL Real):</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="item in detalle.examenFisico" :key="item.examenSistemaID" class="p-5 bg-slate-50/40 border border-slate-100/80 rounded-3xl space-y-2 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span class="text-xs font-black text-slate-800 uppercase tracking-wider">📁 {{ item.sistema }}</span>
                    <span :class="['text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider', item.condicion === 'Normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600']">{{ item.condicion }}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium leading-relaxed pt-1.5">{{ item.detalle || 'Sin observaciones registradas.' }}</p>
                </div>

                <div v-if="item.hallazgos && item.hallazgos.length > 0" class="pt-2 flex flex-wrap gap-1.5">
                  <span v-for="h in item.hallazgos" :key="h.hallazgo" class="bg-amber-50 text-amber-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border border-amber-100/70">
                    ⚠️ {{ h.hallazgo }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-1.5 border-t border-slate-100 pt-4">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnóstico Conclusivo:</h4>
            <p class="text-xs font-black text-[#005596] uppercase bg-blue-50/40 p-4 rounded-2xl border border-blue-100/50">📌 {{ detalle.diagnostico || 'Pendiente de diagnóstico.' }}</p>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-4 flex justify-end">
          <button @click="modalAbierto = false" class="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm active:scale-95">Cerrar Detalle</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DoctorRepository } from '../../../infrastructure/DoctorRepository';
import type { ConsultaPrevia, DetalleConsultaModal } from '../../../domain/PatientHistory';

defineProps<{ data: ConsultaPrevia[] }>();
const repo = new DoctorRepository();

const modalAbierto = ref<boolean>(false);
const cargandoDetalle = ref<boolean>(false);
const detalle = ref<DetalleConsultaModal | null>(null);

const formatFechaRenglon = (dateStr: string | undefined | null) => {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const abrirExamenModal = async (consultaId: number) => {
  if (!consultaId || consultaId <= 0) return;
  modalAbierto.value = true;
  cargandoDetalle.value = true;
  try {
    const res = await repo.getDetalleConsulta(consultaId);
    if (res.estado === 'success') {
      detalle.value = res.datos;
    }
  } catch (error) {
    console.error(error);
  } finally {
    cargandoDetalle.value = false;
  }
};
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', sans-serif; }
.rounded-\[2rem\] { border-radius: 2rem; }
.backdrop-blur-xs { backdrop-filter: blur(2px); }
</style>
