<template>
  <div class="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-left animate-fade-in">
    <!-- CABECERA DE FARMACIA -->
    <header class="mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
          Módulo de Dispensación
        </span>
        <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tight mt-2">
          Farmacia Dashboard
        </h2>
        <p class="text-xs font-bold text-slate-400 mt-1">Recepción, verificación de stock y monetización por comisión (3% MedGo+)</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-black text-slate-600 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
          Sede ID: #{{ farmaciaId }}
        </span>
      </div>
    </header>

    <!-- BARRA DE BÚSQUEDA -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 max-w-3xl">
      <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
        Buscar Receta Médica (Código de Canje o DNI del Paciente)
      </label>
      <div class="flex gap-3">
        <input
          v-model="criterioBusqueda"
          @keyup.enter="buscarRecetas"
          type="text"
          placeholder="Ej. RX-984210 o 0801199512345"
          class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 font-bold text-sm text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all font-mono"
        />
        <button
          @click="buscarRecetas"
          :disabled="cargando"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {{ cargando ? 'Buscando...' : 'Buscar Receta' }}
        </button>
      </div>
    </div>

    <!-- LISTADO DE RECETAS ENCONTRADAS -->
    <div v-if="recetas.length > 0" class="space-y-4 max-w-5xl">
      <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Recetas Encontradas ({{ recetas.length }})</h3>
      <div
        v-for="receta in recetas"
        :key="receta.RecetaID"
        class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div class="space-y-2 flex-1">
          <div class="flex items-center gap-3">
            <span class="font-mono font-black text-sm text-[#005596] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
              #{{ receta.CodigoCanje }}
            </span>
            <span :class="getBadgeClass(receta.EstadoReceta)" class="text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-2xs">
              {{ receta.EstadoReceta }}
            </span>
          </div>
          <div>
            <h4 class="text-lg font-black text-slate-800 uppercase">{{ receta.NombreMedicamento }}</h4>
            <p class="text-xs font-bold text-slate-500 mt-0.5">Dosis: <span class="text-slate-800">{{ receta.Dosis }}</span> | Indicaciones: <span class="text-slate-600 italic">{{ receta.Indicaciones }}</span></p>
          </div>
          <div class="text-[11px] font-semibold text-slate-400 flex flex-wrap gap-4 pt-1">
            <span>Paciente: <strong class="text-slate-700 uppercase">{{ receta.Paciente }}</strong> (DNI: {{ receta.PacienteDNI }})</span>
            <span>Dr. Tratante: <strong class="text-slate-700">{{ receta.MedicoTratante }}</strong></span>
          </div>
        </div>

        <!-- PANEL DE ACCIONES Y TRANSICIÓN DE ESTADOS -->
        <div class="w-full md:w-auto bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3 min-w-64">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Flujo Operativo</span>

          <!-- Paso 1: Recibir -->
          <button
            v-if="receta.EstadoReceta === 'Emitida'"
            @click="actualizarEstado(receta, 'Recibida por Farmacia')"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all shadow-xs"
          >
            Marcar Recibida
          </button>

          <!-- Paso 2: Reservar Stock -->
          <button
            v-else-if="receta.EstadoReceta === 'Recibida por Farmacia'"
            @click="actualizarEstado(receta, 'Reservada')"
            class="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all shadow-xs"
          >
            Confirmar Stock (Reservar)
          </button>

          <!-- Paso 3: Surtir & Facturar -->
          <button
            v-else-if="receta.EstadoReceta === 'Reservada'"
            @click="abrirModalSurtido(receta)"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md"
          >
            Surtir & Calcular Comisión
          </button>

          <div v-else-if="receta.EstadoReceta === 'Surtida'" class="text-center py-2">
            <span class="text-xs font-black text-emerald-600 uppercase"> Receta Completada</span>
            <span class="block text-[10px] font-bold text-slate-400 font-mono mt-0.5">Comisión 3%: ${{ (receta.PrecioTotal * 0.03).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE CONFIRMACIÓN DE SURTIDO -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 text-left">
        <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">Confirmar Surtido de Medicamento</h3>
        <p class="text-xs text-slate-500 font-medium">Ingrese el costo total del despacho para registrar la comisión del 3% a favor del ecosistema MedGo+:</p>

        <div class="space-y-1">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Monto Total de Medicamentos ($)</label>
          <input
            v-model.number="precioTotalInput"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-base font-black font-mono text-slate-800 focus:border-emerald-600 outline-none"
          />
        </div>

        <div class="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex justify-between items-center text-xs font-bold text-emerald-900">
          <span>Comisión MedGo+ (3%):</span>
          <span class="text-sm font-black font-mono">${{ comisionCalculada.toFixed(2) }}</span>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button @click="showModal = false" class="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Cancelar</button>
          <button
            @click="ejecutarSurtido"
            :disabled="surtiendo || precioTotalInput <= 0"
            class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            {{ surtiendo ? 'Procesando...' : 'Confirmar & Surtir' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { PharmacyRepository } from '../infrastructure/PharmacyRepository';
import type { RecetaFarmaciaDTO, EstadoReceta } from '../domain/PharmacyModels';
import { useAuthStore } from '@/stores/auth';

const repo = new PharmacyRepository();
const toast = useToast();
const authStore = useAuthStore();

const criterioBusqueda = ref('');
const cargando = ref(false);
const recetas = ref<RecetaFarmaciaDTO[]>([]);

// Modal
const showModal = ref(false);
const recetaSeleccionada = ref<RecetaFarmaciaDTO | null>(null);
const precioTotalInput = ref<number>(0);
const surtiendo = ref(false);

const farmaciaId = computed<number>(() => {
  const id = authStore.user?.entidadId;
  return id ? Number(id) : 1;
});

const comisionCalculada = computed<number>(() => {
  return (precioTotalInput.value || 0) * 0.03;
});

const buscarRecetas = async () => {
  if (!criterioBusqueda.value.trim()) {
    toast.warning("Ingrese un código de canje o DNI válido.");
    return;
  }
  cargando.value = true;
  try {
    recetas.value = await repo.buscarReceta(criterioBusqueda.value.trim());
    toast.success("Búsqueda completada.");
  } catch  {
    recetas.value = [];
    toast.error("No se encontraron recetas con ese criterio.");
  } finally {
    cargando.value = false;
  }
};

const actualizarEstado = async (receta: RecetaFarmaciaDTO, nuevoEstado: EstadoReceta) => {
  try {
    await repo.cambiarEstado(receta.RecetaID, nuevoEstado, farmaciaId.value);
    receta.EstadoReceta = nuevoEstado;
    toast.success(`Estado de receta actualizado a '${nuevoEstado}'`);
  } catch  {
    toast.error( "No se pudo actualizar el estado de la receta.");
  }
};

const abrirModalSurtido = (receta: RecetaFarmaciaDTO) => {
  recetaSeleccionada.value = receta;
  precioTotalInput.value = 0;
  showModal.value = true;
};

const ejecutarSurtido = async () => {
  if (!recetaSeleccionada.value || precioTotalInput.value <= 0) return;
  surtiendo.value = true;
  try {
    const res = await repo.surtirReceta(recetaSeleccionada.value.RecetaID, precioTotalInput.value, farmaciaId.value);
    recetaSeleccionada.value.EstadoReceta = 'Surtida';
    recetaSeleccionada.value.YaCanjeada = 1;
    recetaSeleccionada.value.PrecioTotal = precioTotalInput.value;
    toast.success(`¡Receta Surtida! Comisión registrada: $${res.comision_medgo.toFixed(2)}`);
    showModal.value = false;
  } catch  {
    toast.error( "Ocurrió un error al procesar el surtido.");
  } finally {
    surtiendo.value = false;
  }
};

const getBadgeClass = (estado: EstadoReceta) => {
  switch (estado) {
    case 'Emitida': return 'bg-blue-100 text-blue-700';
    case 'Recibida por Farmacia': return 'bg-indigo-100 text-indigo-700';
    case 'Reservada': return 'bg-amber-100 text-amber-800';
    case 'Surtida': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-slate-100 text-slate-600';
  }
};
</script>
