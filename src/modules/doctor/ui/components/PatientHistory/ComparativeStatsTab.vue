<template>
  <div class="space-y-6 animate-fade-in text-left font-premium select-none">

    <div class="mb-6">
      <h3 class="text-sm font-black text-slate-800 uppercase tracking-tight">Comparativo Últimos 3 Meses</h3>
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Evolución de parámetros clave del paciente</p>
    </div>

    <div v-if="parametrosEvolucion.length === 0" class="text-center py-24 bg-slate-50/50 border border-dashed border-slate-200 rounded-4xl text-slate-400 text-[11px] font-black uppercase tracking-widest shadow-xs">
      📊 El paciente no cuenta con registros históricos de signos vitales en sus consultas previas.
    </div>

    <template v-else>
      <div
        v-for="param in parametrosEvolucion"
        :key="param.titulo"
        class="bg-white border border-slate-200/80 rounded-4xl p-6 space-y-4 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-blue-300/70 transition-all duration-300"
      >
        <div class="flex justify-between items-center">
          <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            {{ param.titulo }}
            <span v-if="param.estado === 'Estabilizado'" class="text-emerald-500 font-bold text-xs">✔📈</span>
            <span v-else-if="param.estado === 'Alteración'" class="text-amber-500 font-bold text-xs">⚠️📉</span>
            <span v-else class="text-slate-400 font-bold text-xs">📋</span>
          </h4>

          <span
            :class="[
              'text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider border shadow-2xs',
              param.estado === 'Estabilizado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : '',
              param.estado === 'Alteración' ? 'bg-amber-50 text-amber-700 border-amber-200' : '',
              param.estado === 'Monitoreo' || param.estado === 'Sin Historial' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''
            ]"
          >
            {{ param.estado }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(bloque, bIdx) in param.bloques"
            :key="bIdx"
            :class="[
              'p-4 rounded-2xl border transition-all duration-300 text-center flex flex-col justify-center items-center',
              bloque.enfoque
                ? 'bg-blue-50/60 border-blue-200 text-blue-600 shadow-2xs'
                : 'bg-slate-50/30 border-transparent text-slate-700 hover:bg-slate-50'
            ]"
          >
            <p
              :class="[
                'text-[10px] font-black uppercase tracking-wider',
                bloque.enfoque ? 'text-blue-500' : 'text-slate-400'
              ]"
            >
              {{ bloque.periodo }}
            </p>

            <p
              :class="[
                'text-sm font-black mt-1.5 uppercase tracking-tight',
                bloque.enfoque ? 'text-blue-600' : 'text-slate-700'
              ]"
            >
              {{ bloque.valor }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SignoVitalHistorico } from '../../../domain/PatientHistory';

const props = defineProps<{ data: SignoVitalHistorico[] }>();

const formatFechaBloque = (dateStr: string | undefined | null) => {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleDateString('es-HN', {
    month: 'short',
    day: 'numeric'
  });
};

const calcularEstadoSigno = (titulo: string, actual: number, anterior: number): string => {
  if (!actual || !anterior) return 'Monitoreo';

  if (titulo === 'Presión Arterial') {
    return 'Monitoreo';
  }

  if (titulo === 'Pulso / Frecuencia') {
    if (actual >= 60 && actual <= 100) return 'Estabilizado';
    return 'Alteración';
  }

  if (titulo === 'Saturación de Oxígeno') {
    if (actual >= 95) return 'Estabilizado';
    return 'Alteración';
  }

  if (titulo === 'Temperatura Corporal') {
    if (actual >= 36.0 && actual <= 37.4) return 'Estabilizado';
    return 'Alteración';
  }

  return 'Monitoreo';
};

const parametrosEvolucion = computed(() => {
  if (!props.data || props.data.length === 0) return [];

  const registrosReal = [...props.data].slice(0, 3).reverse();
  const totalRegs = registrosReal.length;

  const obtenerEtiquetaPeriodo = (idx: number, fechaStr: string | undefined | null) => {
    if (idx === totalRegs - 1) return 'Más reciente';
    return `Control ${formatFechaBloque(fechaStr)}`;
  };

  const regActual = registrosReal[totalRegs - 1];
  const regAnterior = totalRegs > 1 ? registrosReal[totalRegs - 2] : null;

  const regActualUnknown = regActual as unknown;
  const regAnteriorUnknown = regAnterior as unknown;

  const actualObj = regActualUnknown as Record<string, string | number | null | undefined>;
  const anteriorObj = regAnteriorUnknown as Record<string, string | number | null | undefined>;

  const pActualPulso = actualObj?.pulso ? parseInt(String(actualObj.pulso), 10) : 0;
  const pAnteriorPulso = anteriorObj?.pulso ? parseInt(String(anteriorObj.pulso), 10) : 0;

  const pActualSat = actualObj?.saturacion ? parseInt(String(actualObj.saturacion), 10) : 0;
  const pAnteriorSat = anteriorObj?.saturacion ? parseInt(String(anteriorObj.saturacion), 10) : 0;

  const pActualTemp = actualObj?.temperatura ? parseFloat(String(actualObj.temperatura)) : 0;
  const pAnteriorTemp = anteriorObj?.temperatura ? parseFloat(String(anteriorObj.temperatura)) : 0;

  return [
    {
      titulo: 'Presión Arterial',
      estado: regActual?.presion ? 'Monitoreo' : 'Sin Historial',
      bloques: registrosReal.map((reg, idx) => ({
        periodo: obtenerEtiquetaPeriodo(idx, reg.periodo),
        valor: reg.presion ? `${reg.presion} mmHg` : '---',
        enfoque: idx === totalRegs - 1
      }))
    },
    {
      titulo: 'Pulso / Frecuencia',
      estado: regActual?.pulso ? calcularEstadoSigno('Pulso / Frecuencia', pActualPulso, pAnteriorPulso) : 'Sin Historial',
      bloques: registrosReal.map((reg, idx) => ({
        periodo: obtenerEtiquetaPeriodo(idx, reg.periodo),
        valor: reg.pulso ? `${reg.pulso} lpm` : '---',
        enfoque: idx === totalRegs - 1
      }))
    },
    {
      titulo: 'Saturación de Oxígeno',
      estado: regActual?.saturacion ? calcularEstadoSigno('Saturación de Oxígeno', pActualSat, pAnteriorSat) : 'Sin Historial',
      bloques: registrosReal.map((reg, idx) => ({
        periodo: obtenerEtiquetaPeriodo(idx, reg.periodo),
        valor: reg.saturacion ? `${reg.saturacion}%` : '---',
        enfoque: idx === totalRegs - 1
      }))
    },
    {
      titulo: 'Temperatura Corporal',
      estado: regActual?.temperatura ? calcularEstadoSigno('Temperatura Corporal', pActualTemp, pAnteriorTemp) : 'Sin Historial',
      bloques: registrosReal.map((reg, idx) => ({
        periodo: obtenerEtiquetaPeriodo(idx, reg.periodo),
        valor: reg.temperatura ? `${reg.temperatura} °C` : '---',
        enfoque: idx === totalRegs - 1
      }))
    }
  ];
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Inter:wght@400;600;800&display=swap');
.font-premium { font-family: 'Montserrat', 'Inter', sans-serif; }
</style>
