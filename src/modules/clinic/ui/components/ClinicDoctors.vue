<template>
  <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-4xl mx-auto relative overflow-hidden">
    <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-indigo-500"></div>

    <div class="mb-8 border-b border-slate-100 pb-4">
      <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
        <v-icon name="ri-stethoscope-line" class="text-purple-600" scale="1.2" />
        Registrar Nuevo Especialista
      </h2>
      <p class="text-xs text-slate-400 font-bold mt-1">Añade un nuevo médico al directorio de tu institución clínica</p>
    </div>

    <form>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
          <input v-model="doctorForm.nombre" type="text" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700" placeholder="Ej. Carlos" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellido</label>
          <input v-model="doctorForm.apellido" type="text" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700" placeholder="Ej. Mendoza" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
          <input v-model="doctorForm.email" type="email" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700" placeholder="correo@clinica.com" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña Temporal</label>
          <input v-model="doctorForm.password" type="password" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700" placeholder="Mínimo 6 caracteres" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número Colegiado</label>
          <input v-model="doctorForm.numero_colegiado" type="text" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-mono text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700 uppercase" placeholder="CMH-12345" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Especialidad</label>
          <select v-model="doctorForm.especialidad_id" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700 cursor-pointer">
            <option :value="null" disabled>Seleccione una especialidad...</option>
            <option v-for="esp in specialties" :key="esp.EspecialidadID" :value="esp.EspecialidadID">
              {{ esp.NombreEspecialidad }}
            </option>
          </select>
        </div>
      </div>
      <div class="pt-4 border-t border-slate-100">
        <button type="submit" class="w-full md:w-auto ml-auto bg-purple-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-200" :disabled="isLoading">
          <v-icon v-if="!isLoading" name="bi-check-circle-fill" scale="1" />
          <v-icon v-else name="bi-arrow-repeat" class="animate-spin" scale="1" />
          {{ isLoading ? 'Procesando...' : 'Registrar Médico' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { ClinicRepository } from '../../infrastructure/ClinicRepository';
import type { Specialty, DoctorRegistrationForm } from '../../Domain/Clinic';

const repo = new ClinicRepository();
const toast = useToast();
const authStore = useAuthStore();

const isLoading = ref<boolean>(false);
const specialties = ref<Specialty[]>([]);

const userEntidadId = (authStore.user as unknown as { entidad_id?: number })?.entidad_id || 1;

const doctorForm = ref<DoctorRegistrationForm>({
  nombre: '', apellido: '', email: '', password: '', numero_colegiado: '', especialidad_id: null,
  entidad_id: userEntidadId
});

const loadSpecialties = async () => {
  try {
    specialties.value = await repo.getSpecialties();
  } catch {
    toast.error("Error cargando especialidades");
  }
};


onMounted(() => {
  loadSpecialties();
});
</script>
