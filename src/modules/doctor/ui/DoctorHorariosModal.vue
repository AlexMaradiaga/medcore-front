<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 text-left">
      
      <!-- ENCABEZADO CON PESTAÑAS -->
      <div class="flex justify-between items-center border-b border-slate-100 pb-4">
        <div class="flex items-center gap-2">
          <button
            @click="pestanaActiva = 'horarios'"
            :class="[
              'px-4 py-2 text-xs font-black uppercase rounded-xl transition-all cursor-pointer',
              pestanaActiva === 'horarios' ? 'bg-[#005596] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'
            ]"
          >
            Horarios Semanales
          </button>
          <button
            @click="pestanaActiva = 'bloqueos'"
            :class="[
              'px-4 py-2 text-xs font-black uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5',
              pestanaActiva === 'bloqueos' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'
            ]"
          >
            Bloqueos / Permisos
            <span v-if="listaBloqueos.length > 0" class="bg-rose-200 text-rose-900 text-[10px] px-1.5 py-0.5 rounded-full font-black">
              {{ listaBloqueos.length }}
            </span>
          </button>
        </div>

        <button 
          @click="$emit('close')" 
          :disabled="cargando"
          class="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >✕</button>
      </div>

      <!-- PESTAÑA 1: CONFIGURACIÓN DE HORARIOS -->
      <div v-if="pestanaActiva === 'horarios'" class="space-y-4">
        <!-- SELECTOR DE DURACIÓN DE CONSULTA -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">Duración por Consulta</label>
            <p class="text-[11px] text-slate-400 font-semibold">Tiempo asignado a cada espacio de cita</p>
          </div>
          <select
            v-model="duracionCitaMinutos"
            :disabled="cargando"
            class="bg-white border border-slate-200 text-xs font-black text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#005596] cursor-pointer disabled:opacity-50"
          >
            <option :value="15">15 Minutos</option>
            <option :value="20">20 Minutos</option>
            <option :value="30">30 Minutos (Default)</option>
            <option :value="45">45 Minutos</option>
            <option :value="60">60 Minutos (1 Hora)</option>
          </select>
        </div>

        <!-- CONFIGURACIÓN SEMANAL -->
        <div class="space-y-3 max-h-64 overflow-y-auto pr-2">
          <div 
            v-for="dia in agenda" 
            :key="dia.dia_semana" 
            class="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100"
          >
            <label class="flex items-center gap-3 cursor-pointer select-none">
              <input 
                type="checkbox" 
                v-model="dia.activo" 
                :disabled="cargando"
                class="rounded text-[#005596] focus:ring-[#005596] w-4 h-4 cursor-pointer disabled:opacity-50" 
              />
              <span class="font-bold text-xs text-slate-700 uppercase w-20">{{ dia.nombre }}</span>
            </label>

            <div v-if="dia.activo" class="flex items-center gap-2">
              <input 
                type="time" 
                v-model="dia.hora_inicio" 
                :disabled="cargando"
                class="bg-white border border-slate-200 rounded-xl p-1.5 text-xs font-mono outline-none focus:ring-2 focus:ring-[#005596] disabled:opacity-50" 
              />
              <span class="text-xs text-slate-400 font-bold">a</span>
              <input 
                type="time" 
                v-model="dia.hora_fin" 
                :disabled="cargando"
                class="bg-white border border-slate-200 rounded-xl p-1.5 text-xs font-mono outline-none focus:ring-2 focus:ring-[#005596] disabled:opacity-50" 
              />
            </div>
            <span v-else class="text-[11px] font-bold text-slate-400 italic">No laborable</span>
          </div>
        </div>

        <!-- BOTONES DE ACCIÓN HORARIOS -->
        <div class="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button 
            @click="$emit('close')" 
            :disabled="cargando"
            class="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            @click="guardarHorarios" 
            :disabled="cargando"
            class="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#005596] hover:bg-[#004070] cursor-pointer flex items-center gap-2"
          >
            <span>{{ cargando ? 'Guardando...' : 'Guardar Horarios' }}</span>
          </button>
        </div>
      </div>

      <!-- PESTAÑA 2: BLOQUEOS / TIEMPO FUERA DE SERVICIO -->
      <div v-else-if="pestanaActiva === 'bloqueos'" class="space-y-4">
        <!-- FORMULARIO DE REGISTRO DE BLOQUEO -->
        <div class="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl space-y-3">
          <h4 class="text-xs font-black text-rose-800 uppercase tracking-wider">Registrar Nuevo Período Fuera de Servicio</h4>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Fecha y Hora Inicio</label>
              <input 
                v-model="formBloqueo.fecha_inicio" 
                type="datetime-local" 
                class="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Fecha y Hora Fin</label>
              <input 
                v-model="formBloqueo.fecha_fin" 
                type="datetime-local" 
                class="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Motivo (Ej. Vacaciones, Cirugía, Personal)</label>
            <input 
              v-model="formBloqueo.motivo" 
              type="text" 
              placeholder="Vacaciones / Cirugía / Permiso Personal"
              class="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            @click="guardarBloqueo"
            :disabled="cargando"
            class="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-xs disabled:opacity-50"
          >
            {{ cargando ? 'Procesando...' : 'Bloquear Agenda' }}
          </button>
        </div>

        <!-- LISTADO DE BLOQUEOS ACTIVOS -->
        <div class="space-y-2">
          <h4 class="text-xs font-black text-slate-700 uppercase">Bloqueos Activos y Programados</h4>

          <div v-if="listaBloqueos.length === 0" class="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs font-bold">
            No tienes períodos fuera de servicio registrados.
          </div>

          <div v-else class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div 
              v-for="b in listaBloqueos" 
              :key="b.BloqueoID"
              class="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl shadow-2xs"
            >
              <div>
                <span class="inline-block px-2 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-black uppercase rounded-md mb-1">
                  {{ b.Motivo || 'No disponible' }}
                </span>
                <p class="text-xs font-mono text-slate-600">
                  {{ formatearFecha(b.FechaInicio) }} ➔ {{ formatearFecha(b.FechaFin) }}
                </p>
              </div>

              <button 
                @click="eliminarBloqueo(b.BloqueoID)"
                class="text-rose-500 hover:text-rose-700 font-black text-xs px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/shared/infrastructure/api';

interface DiaAgenda {
  dia_semana: number;
  nombre: string;
  activo: boolean;
  hora_inicio: string;
  hora_fin: string;
}

interface BaseDiaSemana {
  dia_semana: number;
  nombre: string;
}

interface HorarioExistenteBackend {
  DiaSemana: number | string;
  HoraInicio: string;
  HoraFin: string;
  DuracionCitaMinutos?: number;
}

interface BloqueoBackend {
  BloqueoID: number;
  FechaInicio: string;
  FechaFin: string;
  Motivo?: string;
}

const props = defineProps<{ 
  isOpen: boolean; 
  doctorId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', payload: unknown): void;
}>();

const toast = useToast();
const cargando = ref(false);
const pestanaActiva = ref<'horarios' | 'bloqueos'>('horarios');
const duracionCitaMinutos = ref(30);
const listaBloqueos = ref<BloqueoBackend[]>([]);

const formBloqueo = ref({
  fecha_inicio: '',
  fecha_fin: '',
  motivo: ''
});

const DIAS_SEMANA: BaseDiaSemana[] = [
  { dia_semana: 1, nombre: 'Lunes' },
  { dia_semana: 2, nombre: 'Martes' },
  { dia_semana: 3, nombre: 'Miércoles' },
  { dia_semana: 4, nombre: 'Jueves' },
  { dia_semana: 5, nombre: 'Viernes' },
  { dia_semana: 6, nombre: 'Sábado' },
  { dia_semana: 7, nombre: 'Domingo' },
];

const agenda = ref<DiaAgenda[]>(DIAS_SEMANA.map(d => ({
  ...d, activo: true, hora_inicio: '08:00', hora_fin: '17:00'
})));

const cargarDisponibilidad = async () => {
  if (!props.doctorId) return;
  cargando.value = true;

  try {
    const res = await api.get(`/doctores/${props.doctorId}/disponibilidad`);
    const horarios: HorarioExistenteBackend[] = res.data?.horarios || [];
    listaBloqueos.value = res.data?.bloqueos || [];

    duracionCitaMinutos.value = horarios[0]?.DuracionCitaMinutos ?? 30;

    agenda.value = DIAS_SEMANA.map((dia: BaseDiaSemana): DiaAgenda => {
      const coincidencia = horarios.find(h => Number(h.DiaSemana) === dia.dia_semana);
      if (coincidencia) {
        return {
          ...dia,
          activo: true,
          hora_inicio: String(coincidencia.HoraInicio).substring(0, 5),
          hora_fin: String(coincidencia.HoraFin).substring(0, 5)
        };
      }
      return { ...dia, activo: false, hora_inicio: '08:00', hora_fin: '17:00' };
    });
  } catch (error) {
    console.warn('Error cargando disponibilidad:', error);
  } finally {
    cargando.value = false;
  }
};

watch(() => props.isOpen, (val) => {
  if (val) cargarDisponibilidad();
});

const guardarHorarios = async () => {
  cargando.value = true;
  const payload = agenda.value
    .filter(d => d.activo)
    .map(d => ({
      dia_semana: d.dia_semana,
      hora_inicio: d.hora_inicio,
      hora_fin: d.hora_fin,
      duracion_minutos: duracionCitaMinutos.value
    }));

  try {
    await api.post(`/doctores/${props.doctorId}/horarios`, { horarios: payload });
    toast.success('Horarios de atención guardados exitosamente.');
    emit('saved', payload);
    emit('close');
  } catch (error) {
    console.error('Error guardando horarios:', error);
    toast.error('No se pudieron guardar los horarios.');
  } finally {
    cargando.value = false;
  }
};

const guardarBloqueo = async () => {
  if (!formBloqueo.value.fecha_inicio || !formBloqueo.value.fecha_fin) {
    toast.warning('Ingresa las fechas de inicio y fin del bloqueo.');
    return;
  }

  if (formBloqueo.value.fecha_inicio >= formBloqueo.value.fecha_fin) {
    toast.warning('La fecha inicial debe ser previa a la fecha final.');
    return;
  }

  cargando.value = true;
  try {
    await api.post(`/doctores/${props.doctorId}/bloqueos`, {
      fecha_inicio: formBloqueo.value.fecha_inicio.replace('T', ' '),
      fecha_fin: formBloqueo.value.fecha_fin.replace('T', ' '),
      motivo: formBloqueo.value.motivo || 'No disponible'
    });

    toast.success('Agenda bloqueada para el período seleccionado.');
    formBloqueo.value = { fecha_inicio: '', fecha_fin: '', motivo: '' };
    await cargarDisponibilidad();
    emit('saved', null);
  } catch (error) {
    console.error('Error al registrar bloqueo:', error);
    toast.error('Ocurrió un error al registrar el bloqueo.');
  } finally {
    cargando.value = false;
  }
};

const eliminarBloqueo = async (bloqueoId: number) => {
  try {
    await api.delete(`/doctor/bloqueos/${bloqueoId}`);
    toast.success('Bloqueo retirado correctamente.');
    await cargarDisponibilidad();
    emit('saved', null);
  } catch (error) {
    console.error('Error eliminando bloqueo:', error);
    toast.error('No se pudo eliminar el bloqueo.');
  }
};

const formatearFecha = (str: string) => {
  if (!str) return '';
  return str.replace('T', ' ').substring(0, 16);
};
</script>