<template>
  <div class="space-y-6 font-sans text-left animate-fade-in">
    <!-- TARJETA PRINCIPAL DEL PACIENTE -->
    <div class="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
        <div>
          <span
            :class="paciente.es_dependiente ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
            class="text-[10px] font-black uppercase px-3 py-1 rounded-xl border tracking-widest"
          >
            {{ paciente.es_dependiente ? 'Paciente Dependiente' : 'Titular / Tutor' }}
          </span>
          <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight mt-2">
            {{ paciente.nombre }} {{ paciente.apellido }}
          </h2>
          <p class="text-xs font-bold text-slate-400 mt-1">
            DNI: <span class="font-mono text-slate-700">{{ paciente.dni }}</span> | Teléfono: <span class="font-mono text-slate-700">{{ paciente.telefono || 'Sin registro' }}</span>
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span class="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-black text-slate-600">
            {{ paciente.genero === 'M' ? 'Masculino' : 'Femenino' }} ({{ paciente.fecha_nacimiento }} años)
          </span>
          <span v-if="paciente.tipo_sangre" class="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-2xl text-xs font-black">
            Sangre: {{ paciente.tipo_sangre }}
          </span>
        </div>
      </div>

      <!-- VISTA DE INFORMACIÓN DEL TUTOR LEGAL (SI ES PACIENTE DEPENDIENTE) -->
      <div v-if="paciente.es_dependiente" class="bg-sky-50/60 border border-sky-100 rounded-3xl p-6 space-y-3 mb-6">
        <h4 class="text-xs font-black text-sky-800 uppercase tracking-wider flex items-center gap-2">
          <v-icon name="bi-shield-check" class="text-sky-600" /> Datos del Tutor Responsable
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-700 pt-1">
          <div>
            <span class="text-[9px] font-black uppercase text-sky-600 block">Nombre Tutor:</span>
            <p class="text-slate-800 font-extrabold uppercase mt-0.5">{{ paciente.tutor_nombre || 'No registrado' }}</p>
          </div>
          <div>
            <span class="text-[9px] font-black uppercase text-sky-600 block">Identidad (DNI):</span>
            <p class="font-mono text-slate-800 mt-0.5">{{ paciente.tutor_dni || 'N/A' }}</p>
          </div>
          <div>
            <span class="text-[9px] font-black uppercase text-sky-600 block">Parentesco / Vínculo:</span>
            <p class="text-slate-800 uppercase mt-0.5">{{ paciente.parentesco || 'Tutor Legal' }}</p>
          </div>
        </div>
      </div>

      <!-- VISTA DE DEPENDIENTES ASOCIADOS (SI EL PACIENTE ES TUTOR/TITULAR) -->
      <div v-if="dependientes.length > 0" class="space-y-4">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">
          Pacientes Dependientes a Cargo ({{ dependientes.length }})
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="dep in dependientes"
            :key="dep.id"
            class="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-all text-left"
          >
            <div class="flex justify-between items-start">
              <div>
                <h5 class="font-black text-slate-800 text-sm uppercase">{{ dep.nombre }} {{ dep.apellido }}</h5>
                <p class="text-[10px] font-bold text-slate-400 font-mono mt-0.5">DNI: {{ dep.dni }}</p>
              </div>
              <span class="bg-blue-100 text-[#005596] text-[9px] font-black px-2.5 py-1 rounded-lg uppercase">
                {{ dep.parentesco || 'Dependiente' }}
              </span>
            </div>
            <div class="flex justify-between items-center text-[11px] font-semibold text-slate-500 pt-3 border-t border-slate-200/60 mt-3">
              <span>Edad: <strong class="text-slate-700">{{ dep.fecha_nacimiento }} años</strong></span>
              <span>Sangre: <strong class="text-rose-600 font-black">{{ dep.tipo_sangre || 'N/A' }}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/shared/infrastructure/api';
import { useToast } from 'vue-toastification';

// 1. Definimos la interfaz para los Pacientes Dependientes
interface Dependiente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  parentesco: string | null;
  fecha_nacimiento: number | string | null;
  tipo_sangre: string | null;
}

// 2. Definimos la interfaz para el Paciente Principal (Titular o Dependiente)
interface Paciente {
  id?: number;
  usuario_id?: number;
  nombre?: string;
  apellido?: string;
  dni?: string;
  telefono?: string | null;
  fecha_nacimiento?: number | string | null;
  genero?: string | null;
  tipo_sangre?: string | null;
  es_dependiente?: boolean | number;
  tutor_id?: number | null;
  parentesco?: string | null;
  tutor_dni?: string | null;
  tutor_nombre?: string | null;
  tutor_telefono?: string | null;
}

// 3. Tipamos los Props
const props = defineProps<{
  usuarioId: number | string;
}>();

const toast = useToast();

// 4. Asignamos las interfaces a las variables reactivas (¡Adiós any!)
const paciente = ref<Paciente>({});
const dependientes = ref<Dependiente[]>([]);
const esTutor = ref<boolean>(false);

const cargarPerfilPaciente = async (): Promise<void> => {
  try {
    const res = await api.get(`/pacientes/usuario/${props.usuarioId}`);
    if (res.data && res.data.status === 'success') {
      paciente.value = res.data.data || {};
      dependientes.value = res.data.dependientes || [];
      esTutor.value = res.data.es_tutor || false;
    }
  } catch {
    toast.error("No se pudieron cargar los datos clínicos del paciente.");
  }
};

onMounted(() => {
  if (props.usuarioId) {
    cargarPerfilPaciente();
  }
});
</script>