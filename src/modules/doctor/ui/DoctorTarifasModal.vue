<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans text-left">
      <!-- FONDO OSCURO DE CONTEXTO -->
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md" @click="$emit('close')"></div>

      <!-- CONTENEDOR MODAL -->
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative z-10 space-y-6 max-h-[90vh] overflow-y-auto">

        <!-- CABECERA -->
        <div class="flex justify-between items-center border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-50 text-[#005596] rounded-xl flex items-center justify-center font-black">
              <v-icon name="bi-cash-stack" scale="1.1" />
            </div>
            <div>
              <h4 class="text-base font-black text-slate-800 tracking-tight">Configuración del Consultorio</h4>
              <p class="text-[11px] text-slate-400 font-bold">
                {{ nombreDoctor ? `Médico: ${nombreDoctor}` : 'Configure honorarios y ubicación' }}
              </p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
            <v-icon name="bi-x-lg" scale="1.1" />
          </button>
        </div>

        <div v-if="cargando" class="py-8 text-center text-xs font-bold text-slate-400 animate-pulse">
          Cargando catálogo y ubicación desde la base de datos...
        </div>

        <div v-else class="space-y-6">
          <!-- 1. CATÁLOGO DINÁMICO DE SERVICIOS MÉDICOS -->
          <div class="space-y-3">
            <h5 class="text-xs font-black text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1">
              Catálogo de Servicios Médicos
            </h5>

            <div v-if="servicios.length === 0" class="text-xs text-slate-400 italic">
              No se encontraron servicios asignados a este médico.
            </div>

            <div v-for="serv in servicios" :key="serv.ServicioID" class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {{ serv.NombreServicio }} (US$)
              </label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">$</span>
                <input
                  v-model.number="serv.Precio"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-xs font-black text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#005596] transition-all"
                />
              </div>
            </div>
          </div>

          <hr class="border-slate-100" />

          <!-- 2. UBICACIÓN Y COORDENADAS DEL CONSULTORIO -->
          <div class="space-y-3">
            <h5 class="text-xs font-black text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1">
              Ubicación del Consultorio
            </h5>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Dirección Físico-Clínica</label>
              <input
                v-model="perfilDoctor.direccion_consultorio"
                type="text"
                placeholder="Ej. Colonia Palmira, Edificio Medico #102"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-[#005596]"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Latitud</label>
                <input
                  v-model.number="perfilDoctor.latitud"
                  type="number"
                  step="0.00000001"
                  placeholder="14.081800"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 outline-none focus:bg-white focus:border-[#005596]"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Longitud</label>
                <input
                  v-model.number="perfilDoctor.longitud"
                  type="number"
                  step="0.00000001"
                  placeholder="-87.206810"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 outline-none focus:bg-white focus:border-[#005596]"
                />
              </div>
            </div>
          </div>

          <hr class="border-slate-100" />

          <!-- 3. CONFIGURACIONES ADICIONALES -->
          <div class="flex items-center gap-6 pt-1">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input type="checkbox" v-model="perfilDoctor.habla_ingles" class="rounded border-slate-300 text-[#005596]" />
              <span>Habla Inglés</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input type="checkbox" v-model="perfilDoctor.disponible_domicilio" class="rounded border-slate-300 text-[#005596]" />
              <span>Atención a Domicilio</span>
            </label>
          </div>
        </div>

        <!-- ACCIONES -->
        <div class="flex justify-end gap-3 pt-2">
          <button @click="$emit('close')" class="px-5 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">
            Cancelar
          </button>
          <button
            @click="guardarConfiguracion"
            :disabled="guardando || cargando"
            class="bg-[#005596] hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/shared/infrastructure/api';

interface ServicioMedico {
  ServicioID: number;
  NombreServicio: string;
  Precio: number;
}

const props = defineProps<{
  show: boolean;
  doctorId?: number | null;
  nombreDoctor?: string;
}>();

const emit = defineEmits(['close']);

const toast = useToast();
const cargando = ref(false);
const guardando = ref(false);

const servicios = ref<ServicioMedico[]>([]);

const perfilDoctor = reactive({
  direccion_consultorio: '',
  latitud: null as number | null,
  longitud: null as number | null,
  habla_ingles: false,
  disponible_domicilio: false
});

const cargarDatos = async () => {
  cargando.value = true;
  try {
    const [resPrecios, resDoctor] = await Promise.allSettled([
      api.get<ServicioMedico[]>('/doctor/catalogo-precios', {
        params: { doctor_id: props.doctorId }
      }),
      api.get('/doctor/perfil-ubicacion', {
        params: { doctor_id: props.doctorId }
      })
    ]);

    if (resPrecios.status === 'fulfilled' && resPrecios.value.data) {
      servicios.value = resPrecios.value.data;
    }

    if (resDoctor.status === 'fulfilled' && resDoctor.value.data) {
      const data = resDoctor.value.data;
      perfilDoctor.direccion_consultorio = data.DireccionConsultorio || '';
      perfilDoctor.latitud = data.Latitud ? Number(data.Latitud) : null;
      perfilDoctor.longitud = data.Longitud ? Number(data.Longitud) : null;
      perfilDoctor.habla_ingles = Boolean(data.HablaIngles);
      perfilDoctor.disponible_domicilio = Boolean(data.DisponibleDomicilio);
    }
  } catch (err) {
    console.error("Error al cargar la información del doctor:", err);
  } finally {
    cargando.value = false;
  }
};

const guardarConfiguracion = async () => {
  try {
    guardando.value = true;

    // Guardar precios del catálogo y la configuración del consultorio
    await api.post('/doctor/catalogo-precios', {
      doctor_id: props.doctorId,
      servicios: servicios.value,
      ...perfilDoctor
    });

    toast.success(`Configuración del Dr. ${props.nombreDoctor || ''} guardada con éxito.`);
    emit('close');
  } catch (err) {
    console.error(err);
    toast.error("Error al actualizar la información.");
  } finally {
    guardando.value = false;
  }
};

watch(
  () => props.show,
  (isShown) => {
    if (isShown) {
      void cargarDatos();
    }
  }
);
</script>
