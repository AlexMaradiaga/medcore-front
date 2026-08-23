<!-- ui/ClinicAdminView.vue -->
<template>
  <div class="min-h-screen bg-[#f4f7f9] flex text-left font-sans select-none">

    <!-- SIDEBAR IZQUIERDO -->
    <aside class="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 p-6">
      <div class="space-y-8">
        <!-- Logo MedGo+ -->
        <div class="flex items-center gap-4 px-2 cursor-pointer group/logo" @click="activeTab = 'dashboard'">
          <div class="contenedor-mini-logo-3d relative shrink-0">
            <div class="mini-logo-cuerpo-3d">
              <img
                src="/logo-medgo.jpg"
                alt="MedGo+ Logo"
                class="w-full h-full object-cover rounded-[11px] shadow-xs"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-black tracking-tighter leading-none bg-linear-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent group-hover/logo:opacity-90 transition-opacity">MedGo+</span>
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestión Médica Digital</span>
          </div>
        </div>

        <!-- Opciones Sidebar -->
        <nav class="space-y-1.5">
          <button
            @click="activeTab = 'dashboard'"
            :class="activeTab === 'dashboard' ? 'bg-[#50e9a2] text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'"
            class="w-full px-4 py-3 rounded-xl text-xs transition-all flex items-center gap-3 cursor-pointer"
          >
            <v-icon name="bi-grid-1x2-fill" scale="0.9" />
            <span>Dashboard</span>
          </button>

          <button
            @click="activeTab = 'doctores'"
            :class="activeTab === 'doctores' ? 'bg-[#50e9a2] text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'"
            class="w-full px-4 py-3 rounded-xl text-xs transition-all flex items-center gap-3 cursor-pointer"
          >
            <v-icon name="bi-people-fill" scale="0.9" />
            <span>Personal Médico</span>
          </button>

          <button
            @click="activeTab = 'registrar-especialista'"
            :class="activeTab === 'registrar-especialista' ? 'bg-[#50e9a2] text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'"
            class="w-full px-4 py-3 rounded-xl text-xs transition-all flex items-center gap-3 cursor-pointer"
          >
            <v-icon name="bi-person-plus-fill" scale="0.9" />
            <span>Registrar Especialista</span>
          </button>

          <button
            @click="activeTab = 'crear-expediente'"
            :class="activeTab === 'crear-expediente' ? 'bg-[#50e9a2] text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'"
            class="w-full px-4 py-3 rounded-xl text-xs transition-all flex items-center gap-3 cursor-pointer"
          >
            <v-icon name="bi-file-earmark-medical-fill" scale="0.9" />
            <span>Crear Expediente</span>
          </button>

          <button
            @click="activeTab = 'especialidades'"
            :class="activeTab === 'especialidades' ? 'bg-[#50e9a2] text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'"
            class="w-full px-4 py-3 rounded-xl text-xs transition-all flex items-center gap-3 cursor-pointer"
          >
            <v-icon name="bi-intersect" scale="0.9" />
            <span>Especialidades</span>
          </button>
        </nav>
      </div>

      <!-- Footer Sidebar -->
      <div class="space-y-1.5 border-t border-slate-100 pt-4">
        <button class="w-full px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-3 cursor-pointer">
          <v-icon name="bi-gear-fill" scale="0.9" />
          <span>Ajustes</span>
        </button>
        <button @click="showLogoutModal = true" class="w-full px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-3 cursor-pointer">
          <v-icon name="bi-box-arrow-right" scale="0.9" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- ÁREA DE CONTENIDO -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
      <header class="bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <h2 class="text-lg font-bold text-[#0a52be]">Clínica Central</h2>

        <div class="flex items-center gap-6">
          <div class="relative w-72">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar pacientes, citas..."
              class="w-full h-9 pl-9 pr-4 rounded-xl text-xs bg-slate-100/70 border-none outline-none font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
            <v-icon name="bi-search" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div class="flex items-center gap-4">
            <button class="text-slate-400 hover:text-slate-600 cursor-pointer">
              <v-icon name="bi-bell" scale="1" />
            </button>
            <button class="text-slate-400 hover:text-slate-600 cursor-pointer">
              <v-icon name="bi-question-circle" scale="1" />
            </button>

            <!-- Usuario dinámico desde AuthStore/localStorage -->
            <div class="flex items-center gap-3 pl-2">
              <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-xs">
                {{ userInitials }}
              </div>
              <div class="text-left">
                <p class="text-xs font-bold text-slate-800 leading-tight">{{ adminName }}</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase">{{ adminRole }}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Vistas Secundarias -->
      <main class="p-8 flex-1 overflow-y-auto">
        <ClinicDashboard v-if="activeTab === 'dashboard'" :search-query="searchQuery" />
        <PersonalMedico v-else-if="activeTab === 'doctores'" @navegar="(r: string) => activeTab = r" />
        <RegistrarEspecialista
          v-else-if="activeTab === 'registrar-especialista'"
          @guardar="activeTab = 'doctores'"
          @cancelar="activeTab = 'doctores'"
        />
        <CrearExpediente v-else-if="activeTab === 'crear-expediente'" />
        <ClinicSpecialties v-else-if="activeTab === 'especialidades'" />
      </main>
    </div>

    <!-- Modal Logout -->
    <Transition enter-active-class="transition duration-200" leave-active-class="transition duration-150">
      <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" @click="showLogoutModal = false"></div>
        <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 text-center space-y-4">
          <h3 class="text-base font-bold text-slate-900">¿Cerrar Sesión Activa?</h3>
          <p class="text-xs text-slate-500">Deberá introducir de nuevo sus credenciales de acceso.</p>
          <div class="grid grid-cols-2 gap-3 pt-2">
            <button @click="showLogoutModal = false" class="py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Cancelar</button>
            <button @click="confirmarLogout" class="py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer">Sí, Salir</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ClinicDashboard from './components/ClinicDashboard.vue';
import PersonalMedico from './components/PersonalMedico.vue';
import RegistrarEspecialista from './components/RegistrarEspecialista.vue';
import CrearExpediente from './components/CrearExpediente.vue';
import ClinicSpecialties from './components/ClinicSpecialties.vue';

const router = useRouter();
const authStore = useAuthStore();
const activeTab = ref('dashboard');
const showLogoutModal = ref(false);
const searchQuery = ref('');

const currentUser = computed<Record<string, unknown> | null>(() => {
  if (authStore.user) {
    return authStore.user as unknown as Record<string, unknown>;
  }
  const raw = localStorage.getItem('user');
  if (raw) {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  return null;
});

const adminName = computed(() => {
  const u = currentUser.value;
  if (!u) return 'Administrador';
  const val = (u['nombre'] ?? u['Nombre'] ?? u['username'] ?? u['email']) as string | undefined;
  return typeof val === 'string' && val.trim() ? val : 'Administrador';
});

const adminRole = computed(() => {
  const u = currentUser.value;
  if (!u) return 'ADMINISTRADOR';
  const val = (u['tipo_entidad'] ?? u['rol'] ?? u['role']) as string | undefined;
  return typeof val === 'string' && val.trim() ? val.toUpperCase() : 'ADMINISTRADOR';
});

const userInitials = computed(() => {
  const name = adminName.value.trim();
  if (!name) return 'A';
  const parts = name.split(' ');
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
});

const confirmarLogout = () => {
  localStorage.clear();
  router.push('/');
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* Mini Logo 3D */
.contenedor-mini-logo-3d {
  width: 46px;
  height: 46px;
  perspective: 600px;
  animation: miniFlotarImagen 4.5s ease-in-out infinite;
}

.mini-logo-cuerpo-3d {
  width: 100%;
  height: 100%;
  border-radius: 13px;
  padding: 1.5px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.15) 100%);
  box-shadow:
    0 8px 16px rgba(0, 120, 160, 0.22),
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1.5px 3px rgba(255, 255, 255, 0.8);
  transform: rotateX(8deg) rotateY(-5deg);
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.group\/logo:hover .mini-logo-cuerpo-3d {
  transform: rotateX(0deg) rotateY(0deg) scale(1.06);
  box-shadow:
    0 10px 20px rgba(0, 150, 190, 0.32),
    0 3px 6px rgba(0, 0, 0, 0.1);
}

@keyframes miniFlotarImagen {
  0% { transform: translateY(0px) rotateX(8deg) rotateY(-5deg); }
  50% { transform: translateY(-4px) rotateX(11deg) rotateY(2deg); }
  100% { transform: translateY(0px) rotateX(8deg) rotateY(-5deg); }
}
</style>
