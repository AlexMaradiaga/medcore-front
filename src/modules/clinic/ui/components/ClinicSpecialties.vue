<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 h-fit relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-cyan-400"></div>
      <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Agregar Especialidad</h2>
      <p class="text-xs text-slate-400 font-bold mb-6">Registra nuevas áreas de atención para tu clínica</p>

      <form @submit.prevent="submitSpecialty" class="flex flex-col gap-4">
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de la Especialidad</label>
          <input v-model="newSpecialtyName" type="text" placeholder="Ej. Cardiología Pediátrica" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700" />
        </div>
        <button type="submit" class="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-200" :disabled="isSaving">
          <v-icon name="bi-plus-circle-fill" /> {{ isSaving ? 'Guardando...' : 'Agregar Especialidad' }}
        </button>
      </form>
    </div>

    <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-teal-400"></div>
      <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Especialidades Registradas</h2>
      <p class="text-xs text-slate-400 font-bold mb-6">Catálogo global de especialidades disponibles</p>

      <div class="bg-slate-50 rounded-2xl border border-slate-100 p-2">
        <ul class="divide-y divide-slate-200 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          <li v-for="esp in specialties" :key="esp.EspecialidadID" class="py-3.5 px-4 flex items-center gap-3 hover:bg-white rounded-xl transition-colors">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-3xs">
              <v-icon name="ri-stethoscope-line" scale="0.9" />
            </div>
            <span class="text-sm font-bold text-slate-700">{{ esp.NombreEspecialidad }}</span>
          </li>
          <li v-if="specialties.length === 0" class="py-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
            No hay especialidades registradas
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { ClinicRepository } from '../../infrastructure/ClinicRepository';
import type { Specialty } from '../../Domain/Clinic';

const repo = new ClinicRepository();
const toast = useToast();

const specialties = ref<Specialty[]>([]);
const newSpecialtyName = ref<string>('');
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
</style>
