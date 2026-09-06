<template>
  <div class="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6 text-left font-sans">
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <div>
        <h3 class="text-base font-black text-slate-800 uppercase tracking-tight">Horarios de Atención Comercial</h3>
        <p class="text-[11px] font-bold text-slate-400">Configure los rangos de apertura y disponibilidad pública</p>
      </div>
      <button 
        @click="guardarHorarios" 
        :disabled="guardando || cargando"
        class="px-5 py-2.5 bg-[#005596] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50"
      >
        {{ guardando ? 'Guardando...' : 'Guardar Horarios' }}
      </button>
    </div>

    <div v-if="cargando" class="py-8 text-center text-xs font-black text-slate-400 animate-pulse uppercase">
      Sincronizando horarios con el servidor...
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="dia in DIAS_SEMANA" 
        :key="dia.id"
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 gap-4"
      >
        <div class="flex items-center gap-3 w-36">
          <input 
            type="checkbox" 
            :id="`check-dia-${dia.id}`"
            :checked="!getHorarioDia(dia.id).es_inactivo"
            @change="toggleDia(dia.id)"
            class="w-4 h-4 rounded border-slate-300 text-[#005596] focus:ring-0 cursor-pointer"
          />
          <label :for="`check-dia-${dia.id}`" class="text-xs font-black text-slate-800 uppercase cursor-pointer">
            {{ dia.nombre }}
          </label>
        </div>

        <div v-if="!getHorarioDia(dia.id).es_inactivo" class="flex items-center gap-3 w-full sm:w-auto">
          <div class="space-y-1">
            <span class="text-[9px] font-black uppercase text-slate-400 block">Apertura</span>
            <input 
              type="time" 
              v-model="getHorarioDia(dia.id).hora_apertura"
              class="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-[#005596]"
            />
          </div>
          <span class="text-slate-300 font-bold self-end pb-2">-</span>
          <div class="space-y-1">
            <span class="text-[9px] font-black uppercase text-slate-400 block">Cierre</span>
            <input 
              type="time" 
              v-model="getHorarioDia(dia.id).hora_cierre"
              class="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-[#005596]"
            />
          </div>
        </div>

        <div v-else class="text-xs font-bold text-rose-500 uppercase bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
          Cerrado / Inactivo
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { EntityScheduleRepository } from '../infrastructure/EntityScheduleRepository';
import { DIAS_SEMANA, type ScheduleItem } from '../domain/EntitySchedule';

const props = defineProps<{ entityId: number }>();
const repo = new EntityScheduleRepository();
const toast = useToast();

const cargando = ref(true);
const guardando = ref(false);
const horariosMap = ref<Record<number, ScheduleItem>>({});

const inicializarEstructura = () => {
  DIAS_SEMANA.forEach(dia => {
    if (!horariosMap.value[dia.id]) {
      horariosMap.value[dia.id] = {
        dia_semana: dia.id,
        hora_apertura: '08:00',
        hora_cierre: '17:00',
        es_inactivo: false
      };
    }
  });
};

const getHorarioDia = (diaId: number): ScheduleItem => {
  return horariosMap.value[diaId]!;
};

const toggleDia = (diaId: number) => {
  const item = getHorarioDia(diaId);
  item.es_inactivo = !item.es_inactivo;
};

const cargarHorarios = async () => {
  if (!props.entityId) {
    cargando.value = false;
    inicializarEstructura();
    return;
  }
  
  cargando.value = true;
  try {
    const data = await repo.getSchedules(props.entityId);
    data.forEach(item => {
      horariosMap.value[item.dia_semana] = {
        dia_semana: item.dia_semana,
        hora_apertura: item.hora_apertura || '08:00',
        hora_cierre: item.hora_cierre || '17:00',
        es_inactivo: Boolean(item.es_inactivo)
      };
    });
    inicializarEstructura();
  } catch {
    toast.error("Error al obtener los horarios de la entidad.");
    inicializarEstructura(); // Inicializa por defecto si falla la API
  } finally {
    cargando.value = false;
  }
};

const guardarHorarios = async () => {
  if (!props.entityId) return;
  guardando.value = true;
  try {
    const list = Object.values(horariosMap.value);
    await repo.saveSchedules(props.entityId, list);
    toast.success("Horarios de atención actualizados correctamente.");
  } catch {
    toast.error("No se pudieron guardar los horarios.");
  } finally {
    guardando.value = false;
  }
};

// Reemplazamos onMounted por watch con immediate: true
watch(
  () => props.entityId,
  (newId) => {
    if (newId && newId !== 0) {
      void cargarHorarios();
    } else {
      cargando.value = false;
      inicializarEstructura();
    }
  },
  { immediate: true }
);
</script>