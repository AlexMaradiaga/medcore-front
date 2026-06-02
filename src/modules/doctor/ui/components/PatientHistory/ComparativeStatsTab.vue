<template>
  <div class="space-y-6 animate-fade-in text-left">

    <div v-if="parametrosEvolucion.length === 0" class="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-4xl text-slate-400 text-[11px] font-black uppercase tracking-widest">
      📊 El paciente no cuenta con registros históricos de signos vitales en sus consultas previas.
    </div>

    <template v-else>
      <div class="mb-2">
        <h3 class="text-sm font-black text-slate-700 uppercase tracking-tight">Comparativo Últimos Meses</h3>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Evolución de parámetros clave del paciente</p>
      </div>

      <div v-for="param in parametrosEvolucion" :key="param.titulo"
        class="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs space-y-4 hover:border-slate-200 transition-all">

        <div class="flex justify-between items-center">
          <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            {{ param.titulo }} <span class="text-emerald-500 text-xs">📈</span>
          </h4>
          <span :class="['text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider', param.estado === 'Mejorando' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600']">
            {{ param.estado }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="(bloque, bIdx) in param.bloques" :key="bIdx"
            :class="['p-4 rounded-2xl border text-center transition-all', bloque.enfoque ? 'bg-blue-50/40 border-blue-100 shadow-2xs' : 'bg-slate-50/30 border-slate-100/70']">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ bloque.periodo }}</p>
            <p :class="['text-sm font-black mt-1', bloque.enfoque ? 'text-[#005596]' : 'text-slate-700']">
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

const parametrosEvolucion = computed(() => {
  console.log("🔍 PROPS.DATA EN COMPARATIVOTAB:", props.data);
  if (!props.data || props.data.length === 0) return [];

  const registrosReal = [...props.data].slice(0, 3).reverse();
  console.log("🔬 REGISTRO PROCESADO PARA HISTÓRICO:", registrosReal[0]);
  const indexMasNuevo = registrosReal.length - 1;

  return [
    {
      titulo: 'Presión Arterial',
      estado: 'Monitoreo',
      bloques: registrosReal.map((reg, idx) => ({
        periodo: idx === indexMasNuevo ? 'Más Reciente' : `Control ${formatFechaBloque(reg.periodo)}`,
        valor: `${reg.presion || '0/0'} mmHg`,
        enfoque: idx === indexMasNuevo
      }))
    },
    {
      titulo: 'Pulso / Frecuencia',
      estado: 'Monitoreo',
      bloques: registrosReal.map((reg, idx) => ({
        periodo: idx === indexMasNuevo ? 'Más Reciente' : `Control ${formatFechaBloque(reg.periodo)}`,
        valor: reg.pulso ? `${reg.pulso} lpm` : '---',
        enfoque: idx === indexMasNuevo
      }))
    },
    {
      titulo: 'Saturación de Oxígeno',
      estado: 'Monitoreo',
      bloques: registrosReal.map((reg, idx) => ({
        periodo: idx === indexMasNuevo ? 'Más Reciente' : `Control ${formatFechaBloque(reg.periodo)}`,
        valor: reg.saturacion ? `${reg.saturacion}%` : '---',
        enfoque: idx === indexMasNuevo
      }))
    },
    {
      titulo: 'Temperatura Corporal',
      estado: 'Monitoreo',
      bloques: registrosReal.map((reg, idx) => ({
        periodo: idx === indexMasNuevo ? 'Más Reciente' : `Control ${formatFechaBloque(reg.periodo)}`,
        valor: reg.temperatura ? `${reg.temperatura} °C` : '---',
        enfoque: idx === indexMasNuevo
      }))
    }
  ];
});
</script>
