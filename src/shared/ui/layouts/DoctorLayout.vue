<template>
  <div class="min-h-screen bg-slate-100 text-left font-sans relative pb-16">

    <header class="bg-linear-to-r from-[#005596] to-[#00345c] text-white px-8 py-3 flex justify-between items-center shadow-lg border-b border-white/5">
      <div class="flex items-center gap-4">
        <div class="contenedor-header-icono-3d relative shrink-0">
          <div class="header-icono-cuerpo-3d">
            <div class="header-texto-med">Med</div>
            <div class="header-texto-go">Go+</div>
          </div>
        </div>

        <div class="text-left">
          <h1 class="text-lg font-bold leading-tight tracking-tight bg-linear-to-r from-white via-slate-100 to-blue-100 bg-clip-text text-transparent">
            {{ obtenerRolUsuario === 3 ? 'Portal Paciente' : 'Panel Médico' }} - MedGo+
          </h1>
          <p class="text-cyan-200 text-[10px] font-black uppercase tracking-widest">
            {{ obtenerRolUsuario === 3 ? (authStore.user?.nombre || 'Paciente') : ('Dr. ' + (medicalStore.doctorFullName || authStore.user?.nombre || 'Especialista')) }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-500/30 flex items-center gap-2 tracking-wider uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <span class="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span> Verificado
        </div>
        <button @click="handleLogout" class="px-4 py-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 rounded-xl text-xs font-bold transition-all duration-300 border border-white/10 flex items-center gap-2 cursor-pointer active:scale-95">
          <VIcon name="bi-box-arrow-right" scale="0.95" /> Salir
        </button>
      </div>
    </header>

    <nav class="bg-white border-b border-slate-200/80 px-8 py-2.5 sticky top-0 z-20 shadow-sm backdrop-blur-md">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 w-full relative">

        <div class="flex gap-2 overflow-x-auto scrollbar-none py-2 relative items-center justify-between w-full">
          <div class="flex gap-2">
            <button
              v-for="item in menuFiltrado"
              :key="item.path"
              @click="handleNavigation(item.path)"
              :disabled="isItemDisabled(item.path)"
              :class="[
                'px-5 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap relative overflow-hidden group',
                currentPath === item.path ? 'bg-slate-50 border border-slate-100 shadow-2xs font-black scale-[1.01]' : 'border border-transparent',
                currentPath !== item.path && !isItemDisabled(item.path) ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50 cursor-pointer' : '',
                isItemDisabled(item.path) ? 'text-slate-300/40 bg-slate-50/10 cursor-not-allowed pointer-events-none' : ''
              ]"
            >
              <VIcon
                :name="item.icon"
                scale="1.1"
                :class="[
                  'transition-all duration-300 transform group-hover:scale-120 z-10',
                  currentPath === item.path ? item.colorClass : 'text-slate-400 ' + item.hoverColorClass
                ]"
              />
              <span :class="['relative z-10 transition-colors duration-300', currentPath === item.path ? item.colorClass : 'group-hover:text-slate-800']">
                {{ item.name }}
              </span>
              <span v-if="currentPath === item.path" :class="['absolute bottom-0 left-3 right-3 h-0.75 rounded-t-full shadow-xs', item.bgIndicatorClass]"></span>
            </button>
          </div>

          <div v-if="obtenerRolUsuario !== 3" class="flex gap-2 shrink-0">
            <button
              @click="showPlans = true"
              class="px-5 py-2.5 bg-linear-to-r from-[#b616e6] to-[#f30077] hover:brightness-110 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <VIcon name="fa-crown" scale="0.95" class="text-amber-300" />
              <span>Mi Plan</span>
            </button>
          </div>
        </div>

      </div>
    </nav>

    <main class="relative z-10">
      <slot />
    </main>

    <div v-if="obtenerRolUsuario !== 3" class="fixed bottom-6 right-6 z-40 flex flex-col items-center">
      <span class="bg-[#eab308] text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(234,179,8,0.3)] mb-1.5 uppercase tracking-widest border border-[#fef08a] animate-bounce-gentle">
        Gratis
      </span>

      <button
        @click="showPlans = true"
        title="Ver Mi Plan y Analytics"
        class="w-14 h-14 rounded-full bg-linear-to-tr from-[#8b5cf6] via-[#d946ef] to-[#ec4899] text-white shadow-[0_4px_20px_rgba(217,70,239,0.4)] flex items-center justify-center hover:scale-110 hover:rotate-6 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer border-2 border-white/30 relative group"
      >
        <VIcon name="bi-bar-chart-fill" scale="1.2" class="group-hover:animate-pulse text-yellow-200" />
        <span class="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 pointer-events-none"></span>
      </button>
    </div>

    <PlanesView v-if="showPlans" @close="showPlans = false" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMedicalStore } from '@/stores/medicalStore';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import PlanesView from '@/modules/plans/ui/PlanesView.vue';

import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiGrid1X2Fill, BiCalendarEvent, BiPersonFill, BiFileEarmarkTextFill,
  BiClipboardDataFill, BiFileEarmarkMedical, BiPeopleFill, BiBarChartFill, BiBoxArrowRight, FaCrown,
  BiDropletHalf
} from 'oh-vue-icons/icons';

addIcons(
  BiGrid1X2Fill, BiCalendarEvent, BiPersonFill, BiFileEarmarkTextFill,
  BiClipboardDataFill, BiFileEarmarkMedical, BiPeopleFill, BiBarChartFill, BiBoxArrowRight, FaCrown,
  BiDropletHalf
);

const router = useRouter();
const route = useRoute();
const medicalStore = useMedicalStore();
const authStore = useAuthStore();

const currentPath = computed(() => route.path);
const { isConsultationActive } = storeToRefs(medicalStore);

const showPlans = ref(false);

const obtenerRolUsuario = computed<number>(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return Number(user.rol_id || user.RolID || 0);
});

const menuItems = [
  {
    name: 'Panel',
    path: '/medico/dashboard',
    icon: 'bi-grid-1x2-fill',
    colorClass: 'text-sky-600',
    hoverColorClass: 'group-hover:text-sky-500',
    bgIndicatorClass: 'bg-sky-600',
    soloMedico: true
  },
  {
    name: 'Agenda',
    path: '/medico/agenda',
    icon: 'bi-calendar-event',
    colorClass: 'text-cyan-500',
    hoverColorClass: 'group-hover:text-cyan-400',
    bgIndicatorClass: 'bg-cyan-500',
    soloMedico: true
  },
  {
    name: 'Perfil',
    path: '/medico/perfil',
    icon: 'bi-person-fill',
    colorClass: 'text-purple-600',
    hoverColorClass: 'group-hover:text-purple-500',
    bgIndicatorClass: 'bg-purple-600',
    soloMedico: true
  },
  {
    name: 'Consulta',
    path: '/medico/consulta',
    icon: 'bi-file-earmark-text-fill',
    colorClass: 'text-emerald-600',
    hoverColorClass: 'group-hover:text-emerald-500',
    bgIndicatorClass: 'bg-emerald-600',
    soloMedico: true
  },
  {
    name: 'Historial',
    path: '/medico/historial',
    icon: 'bi-clipboard-data-fill',
    colorClass: 'text-amber-500',
    hoverColorClass: 'group-hover:text-amber-400',
    bgIndicatorClass: 'bg-amber-500',
    soloMedico: true
  },
  {
    name: 'Receta',
    path: '/medico/receta',
    icon: 'bi-file-earmark-medical',
    colorClass: 'text-rose-500',
    hoverColorClass: 'group-hover:text-rose-400',
    bgIndicatorClass: 'bg-rose-500',
    soloMedico: true
  },
  {
    name: 'Mis Pacientes',
    path: '/medico/pacientes',
    icon: 'bi-people-fill',
    colorClass: 'text-indigo-600',
    hoverColorClass: 'group-hover:text-indigo-500',
    bgIndicatorClass: 'bg-indigo-600',
    soloMedico: true
  },
  {
    name: 'Laboratorio',
    path: '/medico/laboratorio',
    icon: 'bi-droplet-half',
    colorClass: 'text-blue-500',
    hoverColorClass: 'group-hover:text-blue-400',
    bgIndicatorClass: 'bg-blue-500',
    soloMedico: true
  }
];

const menuFiltrado = computed(() => {
  if (obtenerRolUsuario.value === 3) {
    return menuItems.filter(item => !item.soloMedico);
  }
  return menuItems;
});

const isItemDisabled = (path: string): boolean => {
  if (obtenerRolUsuario.value === 3) return false;

  if (
    path === '/medico/dashboard' ||
    path === '/medico/agenda' ||
    path === '/medico/pacientes' ||
    path === '/medico/laboratorio'
  ) {
    return false;
  }

  return !isConsultationActive.value;
};

const handleNavigation = (path: string) => {
  if (!isItemDisabled(path)) {
    router.push(path);
  }
};

const handleLogout = () => {
  if (!confirm('¿Está seguro que desea cerrar la sesión de la plataforma clínica?')) return;
  localStorage.clear();
  router.push('/');
};
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

/* ========================================================
   ESTILOS DE ALTA GAMA PARA EL LOGO 3D EN EL HEADER
   ======================================================== */

.contenedor-header-icono-3d {
  width: 42px; /* Tamaño optimizado para la barra superior */
  height: 42px;
  perspective: 600px;
  animation: headerFlotar 4s ease-in-out infinite;
}

.header-icono-cuerpo-3d {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(135deg, #007bff 0%, #00c4cc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: sans-serif;

  /* Sombras ultra-nítidas para simular volumen y oclusión en espacios pequeños */
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.3),
    inset 0 1.5px 3px rgba(255, 255, 255, 0.5),
    inset 0 -2.5px 5px rgba(0, 0, 0, 0.2);

  transform: rotateX(8deg) rotateY(-4deg);
  transform-style: preserve-3d;
}

.header-texto-med {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: -0.3px;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0,0,0,0.15);
}

.header-texto-go {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: -0.3px;
  line-height: 1.1;
  text-shadow: 0 1px 2px rgba(0,0,0,0.15);
}

/* Micro-etiqueta "Nuevo" adaptada a la cabecera */
.etiqueta-header-nuevo {
  top: -4px;
  right: -5px;
  background-color: #002d54; /* Contraste profundo */
  color: white;
  font-size: 5.5px;
  font-weight: 950;
  text-transform: uppercase;
  padding: 1.5px 4.5px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  letter-spacing: 0.06em;
  z-index: 10;
  transform: rotateZ(6deg);
}

/* Oscilación balanceada para no irrumpir la lectura de los títulos de la cabecera */
@keyframes headerFlotar {
  0% {
    transform: translateY(0px) rotateX(8deg) rotateY(-4deg);
  }
  50% {
    transform: translateY(-3.5px) rotateX(10deg) rotateY(0deg);
  }
  100% {
    transform: translateY(0px) rotateX(8deg) rotateY(-4deg);
  }
}
</style>
