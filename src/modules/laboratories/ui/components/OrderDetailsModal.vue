<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
    <div class="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 text-left border border-slate-100">

      <!-- Cabecera -->
      <div class="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Selección y Detalle de Exámenes</span>
          <h3 class="text-xl font-black text-slate-900 font-mono">{{ orden?.CodigoOrden || `ORD-2026-${orden?.OrdenID}` }}</h3>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <v-icon name="bi-x-lg" scale="1.1" />
        </button>
      </div>

      <!-- Informacion General del Paciente -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-200/60 text-xs">
        <div>
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Paciente</p>
          <p class="font-bold text-slate-800 text-sm mt-0.5">{{ orden?.Paciente }}</p>
        </div>
        <div>
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Médico Remitente</p>
          <p class="font-bold text-slate-800 text-sm mt-0.5">{{ orden?.Doctor || 'Solicitud Directa' }}</p>
        </div>
      </div>

      <!-- Lista de Exámenes Selección Checkbox -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <v-icon name="si-flask" class="text-[#008ba3]" /> Marcar Exámenes a Realizar en este Laboratorio
          </h4>
          <span class="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
            {{ seleccionadosIds.length }} de {{ orden?.examenes?.length || 0 }} Seleccionados
          </span>
        </div>

        <ul v-if="orden?.examenes && orden.examenes.length > 0" class="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <li
            v-for="item in orden.examenes"
            :key="item.ExamID"
            class="p-3.5 flex justify-between items-center text-xs font-bold text-slate-800 hover:bg-slate-50/50 transition-colors"
          >
            <label class="flex items-center gap-3 cursor-pointer select-none flex-1">
              <input
                type="checkbox"
                :value="item.ExamID"
                v-model="seleccionadosIds"
                class="w-4 h-4 rounded border-slate-300 text-[#008ba3] focus:ring-[#008ba3] cursor-pointer"
              />
              <span :class="{'line-through text-slate-400': !seleccionadosIds.includes(item.ExamID)}">
                {{ item.NombreExamen }}
              </span>
            </label>
            <span class="text-slate-500 font-mono font-black">
              ${{ Number(item.Precio || 0).toFixed(2) }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Pie del Modal con Total Recalculado y Guardar -->
      <div class="flex justify-between items-center pt-4 border-t border-slate-100">
        <div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Ajustado:</span>
          <span class="text-2xl font-black text-emerald-600">${{ totalRecalculado.toFixed(2) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button @click="$emit('close')" class="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">
            Cancelar
          </button>
          <button
            @click="guardarCambios"
            :disabled="guardando || seleccionadosIds.length === 0"
            class="px-6 py-2.5 bg-[#008ba3] hover:bg-[#00748a] disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            {{ guardando ? 'Guardando...' : 'Confirmar Selección' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { LaboratoryRepository } from '../../infrastructure/LaboratoryRepository';
import type { LaboratoryOrderDTO } from '../../domain/LaboratoryModels';

const props = defineProps<{
  isOpen: boolean;
  orden: LaboratoryOrderDTO | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated'): void;
}>();

const repo = new LaboratoryRepository();
const toast = useToast();
const guardando = ref(false);
const seleccionadosIds = ref<number[]>([]);

// Cargar únicamente los exámenes que NO estén cancelados en la base de datos
watch(
  () => props.orden,
  (nuevaOrden) => {
    if (nuevaOrden && nuevaOrden.examenes) {
      seleccionadosIds.value = nuevaOrden.examenes
        .filter(e => e.Estado !== 'Cancelado')
        .map(e => e.ExamID);
    }
  },
  { immediate: true, deep: true }
);

// Calcular en tiempo real el monto acumulado en pantalla
const totalRecalculado = computed(() => {
  if (!props.orden?.examenes) return 0;
  return props.orden.examenes
    .filter(e => seleccionadosIds.value.includes(e.ExamID))
    .reduce((sum, e) => sum + Number(e.Precio || 0), 0);
});

const guardarCambios = async () => {
  if (!props.orden) return;
  guardando.value = true;
  try {
    await repo.actualizarExamenesOrden(props.orden.OrdenID, seleccionadosIds.value);
    toast.success("Exámenes de la orden actualizados con éxito.");
    emit('updated');
    emit('close');
  } catch {
    toast.error("No se pudo actualizar la selección de exámenes.");
  } finally {
    guardando.value = false;
  }
};
</script>
