<template>
  <div class="max-w-4xl mx-auto p-8 animate-fade-in text-left font-sans text-slate-800">
    <div class="mb-8 border-b border-slate-200 pb-4">
      <h2 class="text-2xl font-black text-[#005596] uppercase tracking-tight flex items-center gap-3">
        <v-icon name="bi-cash-coin" scale="1.2" />
        Catálogo de Honorarios
      </h2>
      <p class="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
        Gestione el costo de sus consultas y servicios médicos
      </p>
    </div>

    <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <form @submit.prevent="guardarTarifa" class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8">
        <div class="space-y-2 text-left">
          <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Servicio / Consulta</label>
          <input
            v-model="formulario.NombreServicio"
            type="text"
            placeholder="Ej. Consulta General"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-[#005596] outline-none transition-colors"
            required
          />
        </div>

        <div class="space-y-2 text-left">
          <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Tarifa (USD/HNL)</label>
          <div class="relative">
            <span class="absolute left-4 top-3 text-slate-400 font-black">$</span>
            <input
              v-model="formulario.Precio"
              type="number"
              step="0.01"
              min="0"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-8 text-sm font-bold text-slate-700 focus:border-[#005596] outline-none transition-colors font-mono"
              required
            />
          </div>
        </div>

        <!-- BOTÓN PROTEGIDO CON LA DIRECTIVA V-LOCKED Y LA COMPUTADA -->
        <button
          type="submit"
          :disabled="cargando"
          v-locked="{ isLocked: esPlanRestringido, message: 'Requiere Plan Ejecutivo o Superior para gestionar tarifas' }"
          class="bg-[#005596] hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <v-icon name="bi-save-fill" scale="0.9" />
          {{ cargando ? 'Guardando...' : 'Guardar Tarifa' }}
        </button>
      </form>

      <div class="overflow-hidden border border-slate-100 rounded-2xl">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-wider">
            <tr>
              <th class="p-4">Servicio</th>
              <th class="p-4">Precio Estipulado</th>
              <th class="p-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm font-bold text-slate-700">
            <tr v-for="servicio in servicios" :key="servicio.ServicioID" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4">{{ servicio.NombreServicio }}</td>
              <td class="p-4 font-mono text-emerald-600">${{ servicio.Precio.toFixed(2) }}</td>
              <td class="p-4 text-center">
                <span
                  :class="servicio.Estado ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'"
                  class="px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest"
                >
                  {{ servicio.Estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
            <tr v-if="servicios.length === 0">
              <td colspan="3" class="p-8 text-center text-slate-400 text-xs uppercase tracking-widest">
                No hay tarifas configuradas
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { SaaSRepository } from '../../saas/infrastructure/SaaSRepository';
import type { ServicioMedico } from '../../saas/domain/SaaSModels';
import { useAuthStore } from '@/stores/auth';
import { useMedicalStore } from '@/stores/medicalStore';
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import { BiCashCoin, BiSaveFill } from 'oh-vue-icons/icons';

addIcons(BiCashCoin, BiSaveFill);

const repo = new SaaSRepository();
const toast = useToast();
const authStore = useAuthStore();
const medicalStore = useMedicalStore();

const servicios = ref<ServicioMedico[]>([]);
const cargando = ref(false);
const formulario = ref<ServicioMedico>({
  DoctorID: authStore.user?.id || 0,
  NombreServicio: '',
  Precio: 0,
  Estado: true
});

// Propiedad computada segura para verificar si el plan del doctor está restringido
const esPlanRestringido = computed(() => {
  const doctorInfo = medicalStore.doctor as Record<string, unknown> | null;
  const userAuth = authStore.user as Record<string, unknown> | null;

  // Prioriza el plan de la sesión activa en authStore y luego en medicalStore
  const planBruto =
    userAuth?.plan ||
    doctorInfo?.plan ||
    doctorInfo?.nivel ||
    doctorInfo?.suscripcion ||
    'basico';

  // Convertimos a minúsculas para evitar fallos por mayúsculas ("Gratis", "BASIC", "Ejecutivo")
  const plan = String(planBruto).toLowerCase().trim();

  // Se considera restringido solo si es uno de los planes gratuitos/básicos
  return ['basico', 'free', 'gratis', 'unassigned', 'undefined'].includes(plan) || !plan;
});

const cargarServicios = async () => {
  try {
    servicios.value = await repo.obtenerPreciosDoctor();
  } catch {
    toast.error('Error al sincronizar el catálogo de tarifas.');
  }
};

const guardarTarifa = async () => {
  if (formulario.value.DoctorID === 0) {
    toast.error('Error de sesión: DoctorID inválido.');
    return;
  }
  cargando.value = true;
  try {
    await repo.guardarPrecioServicio(formulario.value);
    toast.success('Tarifa médica actualizada con éxito.');
    formulario.value.NombreServicio = '';
    formulario.value.Precio = 0;
    await cargarServicios();
  } catch {
    toast.error('Ocurrió un error al guardar la tarifa.');
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarServicios();
});
</script>
