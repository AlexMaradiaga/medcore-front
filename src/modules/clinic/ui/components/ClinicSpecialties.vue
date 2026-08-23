<!-- src/views/clinica/ClinicSpecialties.vue -->
<template>
  <div class="space-y-6 text-left select-none animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span>📂</span> Especialidades Médicas
        </h1>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
          Gestión y configuración de departamentos clínicos activos en la institución.
        </p>
      </div>

      <button
        @click="showModal = true"
        class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-2"
      >
        <span>+ Nueva Especialidad</span>
      </button>
    </div>

    <!-- Grid de Especialidades Existenties -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="esp in specialties"
        :key="esp.EspecialidadID"
        class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative space-y-4"
      >
        <div class="flex items-start justify-between">
          <div class="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <v-icon name="ri-stethoscope-line" scale="1.1" />
          </div>
          <span
            :class="esp.Activo !== false ? 'bg-teal-50 text-teal-700 border-teal-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'"
            class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border"
          >
            {{ esp.Activo !== false ? 'Activo' : 'En Revisión' }}
          </span>
        </div>

        <div>
          <h3 class="text-base font-black text-slate-800">{{ esp.NombreEspecialidad }}</h3>
          <p class="text-xs font-medium text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {{ esp.Descripcion || 'Atención médica integral y diagnóstico especializado para esta área clínica.' }}
          </p>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-slate-400">
          <span class="flex items-center gap-1.5">
            <v-icon name="bi-people-fill" scale="0.8" />
            {{ esp.doctorCount || 1 }} Especialistas
          </span>
          <button class="text-teal-600 hover:text-teal-800 font-black text-[11px] uppercase tracking-wider transition-colors cursor-pointer">
            Gestionar &gt;
          </button>
        </div>
      </div>

      <!-- Tarjeta para Añadir Especialidad (Dashed Card) -->
      <div
        @click="showModal = true"
        class="bg-slate-50/50 hover:bg-white rounded-3xl p-6 border-2 border-dashed border-slate-200 hover:border-teal-400 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-50 space-y-2 group"
      >
        <div class="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-teal-50 text-slate-400 group-hover:text-teal-600 flex items-center justify-center transition-colors">
          <v-icon name="bi-plus-lg" scale="1.2" />
        </div>
        <h4 class="text-sm font-black text-slate-700 group-hover:text-teal-700">Añadir Especialidad</h4>
        <p class="text-[11px] font-medium text-slate-400">Configurar nuevo departamento clínico</p>
      </div>
    </div>

    <!-- MODAL REGISTRO DE NUEVA ESPECIALIDAD -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" @click="showModal = false"></div>
        <div class="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-slate-100 relative z-10 text-left space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <span class="text-teal-600">📂</span> Agregar Especialidad
            </h3>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 cursor-pointer">
              <v-icon name="bi-x-lg" scale="0.9" />
            </button>
          </div>

          <form @submit.prevent="submitSpecialty" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nombre de la Especialidad *</label>
              <input v-model="newSpecialtyName" type="text" placeholder="Ej. Cardiología Pediátrica" required class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:border-teal-500 outline-none transition-all" />
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Descripción Clínica</label>
              <textarea v-model="newSpecialtyDesc" rows="3" placeholder="Alcance, tratamientos y patologías tratadas en este departamento..." class="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:border-teal-500 outline-none transition-all resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                @click="showModal = false"
                class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {{ isSaving ? 'Guardando...' : 'Agregar Especialidad' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { ClinicRepository } from '../../infrastructure/ClinicRepository';
import type { Specialty } from '../../Domain/Clinic';

const repo = new ClinicRepository();
const toast = useToast();

const specialties = ref<(Specialty & { Activo?: boolean })[]>([]);
const newSpecialtyName = ref('');
const newSpecialtyDesc = ref('');
const showModal = ref(false);
const isSaving = ref(false);

const loadSpecialties = async () => {
  try {
    specialties.value = await repo.getSpecialties();
  } catch {
    toast.error("Error cargando especialidades");
  }
};

const submitSpecialty = async () => {
  if (!newSpecialtyName.value) return;
  isSaving.value = true;
  try {
    await repo.addSpecialty(newSpecialtyName.value);
    toast.success("Especialidad agregada correctamente");
    newSpecialtyName.value = '';
    newSpecialtyDesc.value = '';
    showModal.value = false;
    await loadSpecialties();
  } catch {
    toast.error("Error al agregar especialidad");
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadSpecialties();
});
</script>
