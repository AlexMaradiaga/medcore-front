<template>
  <div class="min-h-screen bg-[#f8fafc] text-left font-premium p-8 animate-fade-in select-none">

    <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 gap-6">
      <div>
        <span class="bg-blue-50 text-[#005596] text-[10px] font-black px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
          Módulo de Control Central
        </span>
        <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tight mt-1.5">
          Bienvenido, {{ authStore.user?.nombre || 'Admin' }}
        </h2>
        <p class="text-slate-400 text-xs font-bold mt-0.5">Gestión de infraestructura y credenciales de MedCore Global</p>
      </div>

      <div class="flex flex-wrap items-center gap-4 self-end md:self-center">
        <div class="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 shadow-2xs overflow-x-auto max-w-full">
          <button
            v-for="tab in adminTabs" :key="tab.id"
            @click="activeAdminTab = tab.id"
            :class="activeAdminTab === tab.id ? 'bg-white text-[#005596] shadow-2xs font-black' : 'text-slate-400 hover:text-slate-600 font-bold'"
            class="px-4 py-2.5 text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            {{ tab.label }}
          </button>
        </div>

        <button
          @click="handleLogout"
          title="Cerrar Sesión"
          class="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-all cursor-pointer flex items-center justify-center border border-red-100/60 shadow-2xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>

    <div v-if="activeAdminTab === 'resumen'" class="space-y-8 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-4xl shadow-2xs border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
          <div class="space-y-1">
            <p class="text-slate-400 text-xs font-black uppercase tracking-wider">Total Pacientes</p>
            <p v-if="!loadingStats" class="text-4xl font-black text-medgo-teal">{{ stats.total_pacientes }}</p>
            <p v-else class="animate-pulse text-slate-200 text-4xl font-black">...</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-medgo-teal flex items-center justify-center text-xl font-bold">👤</div>
        </div>

        <div class="bg-white p-6 rounded-4xl shadow-2xs border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
          <div class="space-y-1">
            <p class="text-slate-400 text-xs font-black uppercase tracking-wider">Citas Pendientes</p>
            <p v-if="!loadingStats" class="text-4xl font-black text-medgo-blue">{{ stats.citas_pendientes }}</p>
            <p v-else class="animate-pulse text-slate-200 text-4xl font-black">...</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-medgo-blue flex items-center justify-center text-xl font-bold">📅</div>
        </div>

        <div class="bg-white p-6 rounded-4xl shadow-2xs border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
          <div class="space-y-1">
            <p class="text-slate-400 text-xs font-black uppercase tracking-wider">Total Doctores</p>
            <p v-if="!loadingStats" class="text-4xl font-black text-indigo-600">{{ stats.total_doctores }}</p>
            <p v-else class="animate-pulse text-slate-200 text-4xl font-black">...</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">🩺</div>
        </div>
      </div>

      <div class="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-blue-600/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <div class="space-y-2 z-10">
          <h3 class="text-2xl font-black uppercase tracking-tight text-blue-400">¿Qué desea gestionar hoy?</h3>
          <p class="text-slate-400 text-xs font-medium max-w-xl">Utilice el menú superior para auditar usuarios, dar de alta médicos especialistas o administrar los catálogos del sistema.</p>
        </div>
        <div class="flex gap-3 z-10 w-full sm:w-auto">
          <button @click="activeAdminTab = 'doctores'" class="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer">Registrar Doctor</button>
          <button @click="activeAdminTab = 'catalogos'" class="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-700">Catálogos</button>
        </div>
      </div>
    </div>

    <div v-if="activeAdminTab === 'usuarios'" class="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xs p-8 space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-4 gap-2">
        <div>
          <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Usuarios Registrados</h3>
          <p class="text-xs text-slate-400 font-bold">Tabla de control integral para auditorías de accesos y roles</p>
        </div>
        <button @click="cargarUsuarios" class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer">
          🔄 Refrescar Lista
        </button>
      </div>

      <div v-if="loadingUsuarios" class="py-12 text-center">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-[#005596] border-t-transparent rounded-full"></div>
      </div>

      <div v-else class="overflow-x-auto rounded-2xl border border-slate-100">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-wider border-b border-slate-100">
              <th class="p-4 text-center">ID</th>
              <th class="p-4">Identificación / Nombre</th>
              <th class="p-4">Correo Electrónico</th>
              <th class="p-4">Rol Asignado</th>
              <th class="p-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 text-sm font-medium text-slate-600">
            <tr v-for="user in listaUsuarios" :key="user.UsuarioID" class="hover:bg-slate-50/60 transition-colors">
              <td class="p-4 text-center font-mono font-bold text-slate-400">{{ user.UsuarioID }}</td>
              <td class="p-4 font-bold text-slate-800 uppercase tracking-tight">{{ user.NombreCompleto }}</td>
              <td class="p-4 font-mono text-xs text-slate-500">{{ user.Email }}</td>
              <td class="p-4">
                <span
                  :class="user.RolID === 1 ? 'bg-purple-50 text-purple-600 border-purple-100' : user.RolID === 2 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-teal-50 text-teal-600 border-teal-100'"
                  class="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border"
                >
                  {{ user.NombreRol }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span :class="user.Estado === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'" class="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-wider">
                  {{ user.Estado === 1 ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeAdminTab === 'doctores'" class="max-w-2xl mx-auto bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xs animate-fade-in relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-[#005596] to-cyan-500"></div>

      <div class="border-b border-slate-50 pb-4 mb-6">
        <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Registrar Especialista Médico</h3>
        <p class="text-xs text-slate-400 font-bold uppercase mt-0.5">El sistema creará las credenciales de usuario y el perfil clínico en una sola transacción</p>
      </div>

      <form @submit.prevent="ejecutarAltaDoctor" class="space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
            <input v-model="formDoctor.nombre" type="text" placeholder="Ej. Carlos" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-[#005596] outline-hidden transition-all text-slate-700" required />
          </div>
          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellidos</label>
            <input v-model="formDoctor.apellido" type="text" placeholder="Ej. Villeda" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-[#005596] outline-hidden transition-all text-slate-700" required />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de Colegiación</label>
            <input v-model="formDoctor.numero_colegiado" type="text" placeholder="Ej. CHM-2026-03" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-mono text-sm focus:bg-white focus:border-[#005596] outline-hidden transition-all text-slate-700 uppercase" required />
          </div>
          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Especialidad Asignada</label>
            <select v-model="formDoctor.especialidad_id" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-[#005596] outline-hidden transition-all text-slate-700 cursor-pointer" required>
              <option :value="0" disabled>Seleccione Especialidad...</option>
              <option :value="1">Medicina General</option>
              <option :value="2">Cardiología</option>
              <option :value="3">Pediatría</option>
            </select>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-5 space-y-4">
          <p class="text-[10px] font-black text-[#005596] uppercase tracking-wider">Credenciales de Acceso Institucional</p>

          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico Médico</label>
            <input v-model="formDoctor.email" type="email" placeholder="ejemplo.medico@medgo.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-[#005596] outline-hidden transition-all text-slate-700" required />
          </div>

          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña Temporal de Activación</label>
            <input v-model="formDoctor.password" type="password" placeholder="Mínimo 6 caracteres" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-[#005596] outline-hidden transition-all text-slate-700" required />
          </div>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            :disabled="guardando"
            class="w-full py-4 bg-linear-to-r from-[#005596] to-[#00345c] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.99] shadow-md transition-all cursor-pointer flex items-center justify-center"
          >
            {{ guardando ? 'Procesando Transacción en SQL Server...' : '🚀 Finalizar y Dar de Alta Especialista' }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="activeAdminTab === 'catalogos'" class="animate-fade-in">
      <SpecialtyClinicManager />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { DashboardRepositoryImpl, type DashboardStats } from '../infrastructure/DashboardRepositoryImpl';
import SpecialtyClinicManager from '@/modules/directory/ui/SpecialtyClinicManager.vue';
import api from '@/shared/infrastructure/api';

interface UsuarioAdmin {
  UsuarioID: number;
  Email: string;
  RolID: number;
  Estado: number;
  NombreRolNombre: string;
  NombreCompleto: string;
  NombreRol: string;
}

const authStore = useAuthStore();
const dashboardRepo = new DashboardRepositoryImpl();
const toast = useToast();
const router = useRouter();

const activeAdminTab = ref('resumen');
const loadingStats = ref(true);
const loadingUsuarios = ref(false);
const guardando = ref(false);

const listaUsuarios = ref<UsuarioAdmin[]>([]);

const adminTabs = [
  { id: 'resumen', label: 'Métricas' },
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'doctores', label: 'Alta Doctores' },
  { id: 'catalogos', label: 'Catálogos' }
];

const stats = ref<DashboardStats>({
  citas_pendientes: '0',
  total_pacientes: '0',
  total_doctores: '0'
});

const formDoctor = reactive({
  email: '',
  password: '',
  nombre: '',
  apellido: '',
  especialidad_id: 0,
  numero_colegiado: '',
  entidad_id: 2
});

const cargarEstadisticas = async () => {
  loadingStats.value = true;
  try {
    const data = await dashboardRepo.getStats();
    stats.value = data;
  } catch {
    toast.error("No se pudieron sincronizar las estadísticas del panel.");
  } finally {
    loadingStats.value = false;
  }
};

const cargarUsuarios = async () => {
  loadingUsuarios.value = true;
  try {
    const response = await api.get('admin/usuarios');
    if (response.data && response.data.status === 'success') {
      listaUsuarios.value = response.data.data;
    }
  } catch {
    toast.error("Error al auditar los registros de la base de datos.");
  } finally {
    loadingUsuarios.value = false;
  }
};

watch(activeAdminTab, (nuevaTab: string) => {
  if (nuevaTab === 'usuarios') cargarUsuarios();
  if (nuevaTab === 'resumen') cargarEstadisticas();
});

const ejecutarAltaDoctor = async () => {
  if (formDoctor.especialidad_id === 0) {
    toast.warning("Debe seleccionar una especialidad médica válida.");
    return;
  }

  guardando.value = true;
  try {
    const response = await api.post('admin/doctores', formDoctor);
    if (response.data && response.data.status === 'success') {
      toast.success("Especialista incorporado con éxito a MedCore Global.");
      formDoctor.email = '';
      formDoctor.password = '';
      formDoctor.nombre = '';
      formDoctor.apellido = '';
      formDoctor.especialidad_id = 0;
      formDoctor.numero_colegiado = '';

      activeAdminTab.value = 'resumen';
    }
  } catch (error) {
    console.error(error);
    toast.error("Error de consistencia. Verifique si el colegiado o correo ya existen.");
  } finally {
    guardando.value = false;
  }
};

const handleLogout = () => {
  if (!confirm('¿Está seguro que desea cerrar la sesión del panel administrativo?')) return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/');
};

onMounted(cargarEstadisticas);
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
</style>
