<template>
  <div class="min-h-screen bg-[#f8fafc] p-8 font-premium space-y-10 select-none">

    <header>
      <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tight">Gestión de Catálogos</h2>
      <p class="text-slate-400 text-xs font-bold mt-0.5">Administración de Especialidades Médicas y Entidades/Clínicas</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xs p-6 space-y-6">
        <div>
          <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">Especialidades Médicas</h3>
          <p class="text-[10px] text-slate-400 font-bold uppercase">Catálogo actual de servicios</p>
        </div>

        <form @submit.prevent="crearEspecialidad" class="flex gap-3">
          <input
            v-model="nuevaEspecialidad"
            type="text"
            placeholder="Nombre de la nueva especialidad"
            class="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-[#005596] transition-all text-slate-700"
            required
          />
          <button type="submit" class="px-5 bg-linear-to-r from-[#005596] to-[#00345c] text-white font-black text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer">
            ➕ Agregar
          </button>
        </form>

        <div class="overflow-x-auto rounded-xl border border-slate-100">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-400 font-black text-[9px] uppercase tracking-wider">
                <th class="p-3 text-center">ID</th>
                <th class="p-3">Especialidad</th>
                <th class="p-3 text-center">Estado</th>
                <th class="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-xs font-medium text-slate-600">
              <tr v-for="esp in especialidades" :key="esp.EspecialidadID ?? 0">
                <td class="p-3 text-center font-mono font-bold text-slate-400">{{ esp.EspecialidadID }}</td>
                <td class="p-3 font-bold text-slate-700 uppercase tracking-tight">{{ esp.NombreEspecialidad }}</td>
                <td class="p-3 text-center">
                  <span :class="Number(esp.Estado) === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-wider">
                    {{ Number(esp.Estado) === 1 ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td class="p-3 text-center">
                  <button @click="deshabilitarEspecialidad(esp.EspecialidadID ?? 0)" class="text-amber-500 hover:text-amber-700 font-bold text-[10px] uppercase cursor-pointer">Deshabilitar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xs p-6 space-y-6">
        <div>
          <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">Entidades / Clínicas</h3>
          <p class="text-[10px] text-slate-400 font-bold uppercase">Centros médicos adscritos a la red</p>
        </div>

        <form @submit.prevent="crearEntidad" class="flex gap-3">
          <input
            v-model="nuevaEntidad.NombreEntidad"
            type="text"
            placeholder="Nombre de la clínica o entidad"
            class="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-[#005596] transition-all text-slate-700"
            required
          />
          <button type="submit" class="px-5 bg-linear-to-r from-teal-600 to-teal-800 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer">
            ➕ Agregar
          </button>
        </form>

        <div class="overflow-x-auto rounded-xl border border-slate-100">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-400 font-black text-[9px] uppercase tracking-wider">
                <th class="p-3 text-center">ID</th>
                <th class="p-3">Nombre Entidad</th>
                <th class="p-3 text-center">Tipo</th>
                <th class="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-xs font-medium text-slate-600">
              <tr v-for="ent in entidades" :key="ent.id">
                <td class="p-3 text-center font-mono font-bold text-slate-400">{{ ent.id }}</td>
                <td class="p-3 font-bold text-slate-700 uppercase tracking-tight">
                  {{ ent.nombre }}
                </td>
                <td class="p-3 text-center">
                  <span class="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border border-slate-200">
                    Clínica
                  </span>
                </td>
                <td class="p-3 text-center">
                  <button @click="deshabilitarEntidad(Number(ent.id))" class="text-amber-500 hover:text-amber-700 font-bold text-[10px] uppercase cursor-pointer">Deshabilitar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/shared/infrastructure/api';
import type { Specialty } from '../infrastructure/SpecialtyRepositoryImpl';

interface Entidad {
  id: string;
  nombre: string;
  RTN: string | null;
  Direccion: string | null;
  Telefono: string | null;
}

const toast = useToast();

const especialidades = ref<Specialty[]>([]);
const entidades = ref<Entidad[]>([]);

const nuevaEspecialidad = ref('');
const nuevaEntidad = reactive({
  NombreEntidad: '',
  TipoEntidad: 'Clinica',
  Estado: 1
});

const cargarEspecialidades = async () => {
  try {
    const res = await api.get('/especialidades');
    especialidades.value = res.data;
  } catch {
    toast.error("Error al cargar especialidades.");
  }
};

const cargarEntidades = async () => {
  try {
    const res = await api.get('/clinicas');
    entidades.value = res.data;
  } catch {
    toast.error("Error al cargar entidades.");
  }
};

const crearEspecialidad = async () => {
  try {
    await api.post('/especialidades', { nombre: nuevaEspecialidad.value, Estado: 1 });
    toast.success("Especialidad registrada correctamente.");
    nuevaEspecialidad.value = '';
    await cargarEspecialidades();
  } catch (error) {
    console.error(error);
    toast.error("No se pudo agregar la especialidad.");
  }
};

const crearEntidad = async () => {
  try {
    await api.post('/clinicas', {
      nombre: nuevaEntidad.NombreEntidad,
      tipo_entidad: nuevaEntidad.TipoEntidad,
      estado: 1
    });
    toast.success("Entidad registrada correctamente.");
    nuevaEntidad.NombreEntidad = '';
    await cargarEntidades();
  } catch (error) {
    console.error(error);
    toast.error("No se pudo agregar la entidad.");
  }
};

const deshabilitarEspecialidad = async (id: number | undefined) => {
  if (id === undefined) return;
  if (!confirm('¿Desea deshabilitar esta especialidad médica?')) return;
  try {
    await api.put(`/especialidades/${id}/desactivar`, { Estado: 0 });
    toast.success("Especialidad dada de baja correctamente.");
    await cargarEspecialidades();
  } catch (error) {
    console.error(error);
    toast.error("Error al actualizar estado de especialidad.");
  }
};

const deshabilitarEntidad = async (id: number | undefined) => {
  if (id === undefined) return;
  if (!confirm('¿Estás seguro de dar de baja esta entidad?')) return;
  try {
    await api.put(`/clinicas/${id}/desactivar`, { Estado: 0 });
    toast.success("Entidad dada de baja correctamente.");
    await cargarEntidades();
  } catch (error) {
    console.error(error);
    toast.error("Error al actualizar estado de la entidad.");
  }
};

onMounted(() => {
  cargarEspecialidades();
  cargarEntidades();
});
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; }
</style>
