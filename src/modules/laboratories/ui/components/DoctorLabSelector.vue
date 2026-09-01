<template>
  <div class="space-y-6 text-left font-sans animate-fade-in">
    <!-- Header Informativo -->
    <div class="bg-blue-50/60 border border-blue-100 p-6 rounded-3xl flex items-center justify-between shadow-2xs">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-[#005596] text-white rounded-2xl flex items-center justify-center text-xl shadow-xs">
          <v-icon name="si-flask" scale="1.1" />
        </div>
        <div>
          <h3 class="text-base font-black text-slate-900 tracking-tight">Indicación de Exámenes de Laboratorio</h3>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Seleccione los estudios analíticos requeridos para el paciente
          </p>
        </div>
      </div>
      <div class="bg-white border border-blue-200/80 px-4 py-2 rounded-2xl shadow-3xs text-right">
        <span class="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Monto Estimado</span>
        <span class="text-lg font-black text-[#005596]">${{ montoTotalEstimado.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Buscador y Categorías -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <div class="md:col-span-2 relative">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar examen por nombre o condición..."
          class="w-full bg-slate-50/80 border border-slate-200 rounded-2xl py-3.5 px-5 pl-11 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-[#005596] transition-all"
        />
        <v-icon name="bi-search" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" scale="0.85" />
      </div>

      <!-- Selección de Laboratorio Destino -->
      <div class="space-y-1">
        <select
          v-model="laboratorioSeleccionadoId"
          class="w-full bg-slate-50/80 border border-slate-200 rounded-2xl p-3.5 text-xs font-black text-slate-800 outline-none focus:bg-white focus:border-[#005596]"
        >
          <option :value="0" disabled>Seleccionar Laboratorio Habilitado</option>
          <option v-for="lab in laboratorios" :key="lab.EntidadID" :value="lab.EntidadID">
            {{ lab.NombreEntidad }} ({{ lab.Direccion || 'Sede Principal' }})
          </option>
        </select>
      </div>
    </div>

    <!-- Categorías -->
    <div class="space-y-2">
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Filtrar por Categoría</span>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          v-for="cat in categoriasCalculadas"
          :key="cat"
          @click="categoriaSeleccionada = cat"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer shadow-3xs',
            categoriaSeleccionada === cat
              ? 'bg-[#005596] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Rejilla de Selección de Exámenes y Lista Seleccionada -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Catálogo de Exámenes -->
      <div class="lg:col-span-2 space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
        <div v-if="cargando" class="py-12 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
          Sincronizando catálogo de laboratorio...
        </div>
        <div v-else-if="examenesFiltrados.length === 0" class="py-12 text-center text-xs font-bold text-slate-400 uppercase border border-dashed border-slate-200 rounded-2xl">
          No existen estudios coincidentes con los criterios de búsqueda.
        </div>
        <div v-else class="space-y-2.5">
          <div
            v-for="examen in examenesFiltrados"
            :key="examen.ExamID"
            @click="toggleExamen(examen)"
            :class="[
              'p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none',
              estaSeleccionado(examen.ExamID)
                ? 'bg-blue-50/50 border-[#005596] shadow-xs'
                : 'bg-white border-slate-200/80 hover:border-blue-300'
            ]"
          >
            <div class="flex items-center gap-3.5">
              <input
                type="checkbox"
                :checked="estaSeleccionado(examen.ExamID)"
                class="w-4 h-4 rounded border-slate-300 text-[#005596] focus:ring-0 cursor-pointer"
                @click.stop="toggleExamen(examen)"
              />
              <div>
                <h5 class="text-xs font-black text-slate-800 uppercase tracking-tight">
                  {{ examen.NombreExamen }}
                </h5>
                <div class="flex items-center gap-2 mt-1">
                  <span class="bg-slate-100 text-slate-500 font-black text-[9px] px-2 py-0.5 rounded-md uppercase">
                    {{ examen.Categoria }}
                  </span>
                  <span v-if="examen.CondicionesPaciente" class="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                    {{ examen.CondicionesPaciente }}
                  </span>
                </div>
              </div>
            </div>
            <span class="text-sm font-black text-[#005596]">${{ Number(examen.Precio || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Resumen de Exámenes Asignados a la Consulta -->
      <div class="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <v-icon name="bi-file-earmark-medical" class="text-blue-500" /> Exámenes a Agendar
          </h4>
          <span class="bg-blue-50 text-[#005596] font-black text-[10px] px-2.5 py-0.5 rounded-md">
            {{ examenesSeleccionados.length }} seleccionados
          </span>
        </div>

        <div v-if="examenesSeleccionados.length === 0" class="py-8 text-center text-xs text-slate-400 font-bold italic">
          No se han asignado exámenes de laboratorio a la presente consulta.
        </div>
        <div v-else class="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
          <div
            v-for="item in examenesSeleccionados"
            :key="item.ExamID"
            class="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
          >
            <div class="overflow-hidden pr-2">
              <p class="font-bold text-slate-800 uppercase truncate">{{ item.NombreExamen }}</p>
              <span class="text-[9px] text-slate-400 font-semibold uppercase">{{ item.Categoria }}</span>
            </div>
            <button
              type="button"
              @click="toggleExamen(item)"
              class="text-rose-500 hover:bg-rose-50 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <v-icon name="bi-trash-fill" scale="0.8" />
            </button>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-3 flex items-center justify-between">
          <span class="text-xs font-black text-slate-700 uppercase">Total Estimado:</span>
          <span class="text-xl font-black text-[#005596]">${{ montoTotalEstimado.toFixed(2) }}</span>
        </div>

        <p class="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-xl leading-relaxed">
          <strong>Aviso:</strong> Los exámenes se agendarán formalmente en el laboratorio al presionar <u>Finalizar Consulta</u>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { LaboratoryRepository } from '../../infrastructure/LaboratoryRepository';
import type { CatalogoExamen, EntidadLaboratorio } from '../../domain/LaboratoryModels';

const props = defineProps<{
  selectedExams: CatalogoExamen[];
  selectedLabId: number;
}>();

const emit = defineEmits<{
  (e: 'update:selectedExams', value: CatalogoExamen[]): void;
  (e: 'update:selectedLabId', value: number): void;
}>();

const repo = new LaboratoryRepository();
const catalogos = ref<CatalogoExamen[]>([]);
const laboratorios = ref<EntidadLaboratorio[]>([]);
const cargando = ref<boolean>(true);
const busqueda = ref<string>('');
const categoriaSeleccionada = ref<string>('Todos');

const examenesSeleccionados = ref<CatalogoExamen[]>([...props.selectedExams]);
const laboratorioSeleccionadoId = ref<number>(props.selectedLabId || 0);

watch(() => props.selectedExams, (newVal) => {
  examenesSeleccionados.value = [...newVal];
}, { deep: true });

watch(examenesSeleccionados, (newVal) => {
  emit('update:selectedExams', newVal);
}, { deep: true });

watch(laboratorioSeleccionadoId, (newVal) => {
  emit('update:selectedLabId', newVal);
});

const categoriasCalculadas = computed<string[]>(() => {
  const cats = new Set(catalogos.value.map(item => item.Categoria));
  return ['Todos', ...Array.from(cats)];
});

const examenesFiltrados = computed<CatalogoExamen[]>(() => {
  return catalogos.value.filter(ex => {
    const cumpleCat = categoriaSeleccionada.value === 'Todos' || ex.Categoria.toLowerCase() === categoriaSeleccionada.value.toLowerCase();
    const query = busqueda.value.toLowerCase().trim();
    const cumpleBusqueda = !query || ex.NombreExamen.toLowerCase().includes(query) || (ex.CondicionesPaciente && ex.CondicionesPaciente.toLowerCase().includes(query));
    return cumpleCat && cumpleBusqueda;
  });
});

const montoTotalEstimado = computed<number>(() => {
  return examenesSeleccionados.value.reduce((acc, item) => acc + Number(item.Precio || 0), 0);
});

const estaSeleccionado = (examId: number): boolean => {
  return examenesSeleccionados.value.some(item => item.ExamID === examId);
};

const toggleExamen = (examen: CatalogoExamen): void => {
  const index = examenesSeleccionados.value.findIndex(i => i.ExamID === examen.ExamID);
  if (index >= 0) {
    examenesSeleccionados.value.splice(index, 1);
  } else {
    examenesSeleccionados.value.push(examen);
  }
};

const cargarDatosIniciales = async (): Promise<void> => {
  cargando.value = true;
  try {
    const [catData, labData] = await Promise.all([
      repo.getCatalogo(),
      repo.getEntidadesPublicas()
    ]);

    catalogos.value = catData;

    laboratorios.value = labData.filter(
      (e: EntidadLaboratorio) => e.TipoEntidad?.trim().toLowerCase() === 'laboratorio'
    );

    const primerLaboratorio = laboratorios.value[0];
    if (primerLaboratorio && laboratorioSeleccionadoId.value === 0) {
      laboratorioSeleccionadoId.value = primerLaboratorio.EntidadID;
    } else if (laboratorios.value.length === 0) {
      laboratorioSeleccionadoId.value = 0;
    }
  } catch (err) {
    console.error("Error al cargar laboratorios de la BD:", err);
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  void cargarDatosIniciales();
});
</script>