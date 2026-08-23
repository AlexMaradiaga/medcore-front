<!-- ui/components/PersonalMedico.vue -->
<template>
  <div class="space-y-6 text-left select-none font-sans animate-fade-in">
    <!-- Header principal -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Personal Médico</h1>
        <p class="text-xs font-medium text-slate-400 mt-0.5">
          Gestión y directorio clínico de todos los profesionales de la salud registrados en la institución.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <select
          v-model="filtroEspecialidad"
          class="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs"
        >
          <option value="todas">Todas las Especialidades ({{ especialidadesList.length }})</option>
          <option v-for="esp in especialidadesList" :key="esp.EspecialidadID" :value="esp.EspecialidadID">
            {{ esp.NombreEspecialidad }}
          </option>
        </select>

        <button
          type="button"
          @click="$emit('navegar', 'registrar-especialista')"
          class="h-10 px-5 bg-[#0a52be] hover:bg-[#084298] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>+ NUEVO MÉDICO</span>
        </button>
      </div>
    </div>

    <!-- Buscador y pills de estado -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div class="flex-1 relative w-full">
        <input
          v-model="busquedaTexto"
          type="text"
          placeholder="Filtrar por nombre, CMH o consultorio..."
          class="w-full h-9 pl-9 pr-4 rounded-xl text-xs bg-slate-50 border-none outline-none font-medium text-slate-700 focus:bg-white"
        />
        <v-icon name="bi-search" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
      </div>

      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
        <button
          @click="filtroEstado = 'todos'"
          :class="filtroEstado === 'todos' ? 'bg-[#00a884] text-white' : 'text-slate-600 hover:text-slate-900'"
          class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          Todos
        </button>
        <button
          @click="filtroEstado = 'activos'"
          :class="filtroEstado === 'activos' ? 'bg-[#00a884] text-white' : 'text-slate-600 hover:text-slate-900'"
          class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          Activos
        </button>
        <button
          @click="filtroEstado = 'permiso'"
          :class="filtroEstado === 'permiso' ? 'bg-[#00a884] text-white' : 'text-slate-600 hover:text-slate-900'"
          class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          En Permiso
        </button>
      </div>
    </div>

    <!-- Grid de tarjetas de especialistas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="doc in doctoresFiltrados"
        :key="doc.UsuarioID"
        class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-center relative group"
      >
        <button class="absolute top-4 right-4 text-slate-300 hover:text-slate-500 font-bold cursor-pointer">⋮</button>

        <div class="py-2">
          <!-- Logo MedGo+ en lugar de imagen externa -->
          <div class="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mx-auto mb-3 shadow-xs flex items-center justify-center p-1">
            <img
              :src="doc.FotoUrl || '/logo-medgo.jpg'"
              :alt="doc.NombreCompleto"
              class="w-full h-full object-cover rounded-xl"
            />
          </div>

          <!-- Nombre y Especialidad -->
          <h3 class="text-base font-bold text-slate-900">{{ doc.NombreCompleto }}</h3>
          <p class="text-xs font-semibold text-[#0a52be] mt-0.5">{{ doc.Especialidad || 'Medicina General' }}</p>

          <!-- Pill de estado -->
          <div class="mt-3">
            <span
              :class="isDoctorActive(doc) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'"
              class="px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 border"
            >
              <span :class="isDoctorActive(doc) ? 'bg-emerald-500' : 'bg-amber-500'" class="w-1.5 h-1.5 rounded-full"></span>
              {{ isDoctorActive(doc) ? 'Active' : 'On Leave' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Vacío -->
    <div v-if="doctoresFiltrados.length === 0" class="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-2">
      <h4 class="text-sm font-bold text-slate-700">No se encontraron médicos</h4>
      <p class="text-xs">Intente cambiando los parámetros de búsqueda o especialidad.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { SessionUser } from '../../../../shared/Domain/dashboard.interface';
import type { DoctorClinica, Specialty } from '../../Domain/Clinic';
import { ClinicRepository } from '../../infrastructure/ClinicRepository';

interface Props {
  doctores?: DoctorClinica[];
  especialidades?: Specialty[];
}

const props = withDefaults(defineProps<Props>(), {
  doctores: () => [],
  especialidades: () => []
});

defineEmits<{
  (e: 'navegar', ruta: string): void;
}>();

const repo = new ClinicRepository();
const authStore = useAuthStore();

const filtroEspecialidad = ref<string | number>('todas');
const filtroEstado = ref<'todos' | 'activos' | 'permiso'>('todos');
const busquedaTexto = ref<string>('');

const localDoctores = ref<DoctorClinica[]>([]);
const especialidadesList = ref<Specialty[]>([]);

const clinicId = computed<number>(() => {
  const user = authStore.user as SessionUser | null;
  let idRaw = user?.EntidadID;

  if (!idRaw) {
    const localUserRaw = localStorage.getItem('user');
    if (localUserRaw) {
      try {
        const localUser = JSON.parse(localUserRaw) as Record<string, unknown>;
        idRaw = (localUser.entidadId ?? localUser.EntidadID ?? localUser.entidad_id) as number | string;
      } catch {
        idRaw = 0;
      }
    }
  }

  const parsedId = Number(idRaw);
  return isNaN(parsedId) ? 0 : parsedId;
});

const isDoctorActive = (doc: DoctorClinica): boolean => {
  const val = doc.Estado as unknown;
  if (typeof val === 'number') return val === 1;
  if (typeof val === 'boolean') return val === true;
  if (typeof val === 'string') return val === '1' || val.toLowerCase() === 'activo';
  return false;
};

const cargarDatos = async () => {
  try {
    if (props.doctores.length > 0) {
      localDoctores.value = props.doctores;
    } else {
      const entId = clinicId.value !== 0 ? clinicId.value : 1;
      const docs = await repo.getDoctoresPorEntidad(entId);
      localDoctores.value = docs || [];
    }

    if (props.especialidades.length > 0) {
      especialidadesList.value = props.especialidades;
    } else {
      especialidadesList.value = await repo.getSpecialties();
    }
  } catch {
    localDoctores.value = props.doctores;
  }
};

const doctoresFiltrados = computed<DoctorClinica[]>(() => {
  const lista = localDoctores.value.length > 0 ? localDoctores.value : props.doctores;
  return lista.filter((doc) => {
    const coincideEsp =
      filtroEspecialidad.value === 'todas' ||
      doc.EspecialidadID === Number(filtroEspecialidad.value);

    const activo = isDoctorActive(doc);
    const coincideEstado =
      filtroEstado.value === 'todos' ||
      (filtroEstado.value === 'activos' && activo) ||
      (filtroEstado.value === 'permiso' && !activo);

    const query = busquedaTexto.value.toLowerCase().trim();
    const coincideTexto =
      !query ||
      doc.NombreCompleto.toLowerCase().includes(query) ||
      (doc.NumeroColegiado && doc.NumeroColegiado.toLowerCase().includes(query));

    return coincideEsp && coincideEstado && coincideTexto;
  });
});

onMounted(() => {
  void cargarDatos();
});
</script>
