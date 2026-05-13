<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <header class="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="bg-medgo-gradient p-2.5 rounded-xl shadow-lg shadow-blue-100">
          <span class="text-white font-black text-xl">M+</span>
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-black text-slate-800 tracking-tighter leading-none">MedGo+</span>
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Portal del Paciente</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <div class="w-10 h-10 bg-medgo-gradient rounded-full flex items-center justify-center text-white font-black shadow-md border-4 border-white uppercase">
            {{ userData.nombre.charAt(0) }}
          </div>
          <div class="text-left">
            <p class="text-sm font-black text-slate-700 leading-none">{{ userData.nombre }}</p>
            <p class="text-[10px] text-slate-400 font-medium">{{ userData.email }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="p-2 text-slate-300 hover:text-red-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>

    <nav class="bg-white border-b border-slate-100 px-8 py-4 shadow-sm">
      <div class="max-w-7xl mx-auto grid grid-cols-4 gap-6">
        <button
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="activeTab === tab.id ? 'bg-medgo-gradient text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'"
          class="flex flex-col items-center justify-center gap-2 p-5 rounded-4xl transition-all duration-300 active:scale-95"
        >
          <component :is="tab.icon" class="h-7 w-7" />
          <span class="text-[10px] font-black uppercase tracking-widest">{{ tab.label }}</span>
        </button>
      </div>
    </nav>

    <main class="p-10 max-w-7xl mx-auto">
      <section v-if="activeTab === 'directory'" class="space-y-10 animate-fade-in text-left">
        <div class="text-left">
          <h2 class="text-4xl font-black text-slate-800 tracking-tight uppercase">Directorio Médico</h2>
          <p class="text-slate-500 font-medium text-lg mt-1 italic">Encuentre al especialista ideal para su salud</p>
        </div>

        <div class="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div class="flex gap-4 mb-10">
            <div class="flex-1 relative group">
              <input
                v-model="filters.search"
                type="text"
                placeholder="Buscar por nombre o especialidad..."
                class="w-full bg-slate-50 border border-transparent rounded-2xl py-5 px-6 pl-14 outline-none focus:ring-4 focus:ring-blue-100 focus:border-medgo-blue focus:bg-white transition-all text-slate-700 font-bold placeholder:text-slate-300"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute left-5 top-1/2 -translate-y-1/2 text-medgo-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button @click="searchDoctors" class="bg-medgo-blue text-white px-12 rounded-2xl font-black uppercase tracking-widest hover:bg-medgo-teal shadow-lg shadow-blue-100 transition-all active:scale-95">
              Buscar
            </button>
          </div>

          <div class="flex justify-between items-center border-b border-slate-50 pb-4 mb-6">
            <h4 class="font-black text-slate-400 text-xs uppercase tracking-[0.2em]">Filtros Avanzados</h4>
            <button @click="clearFilters" class="text-medgo-blue font-black text-xs uppercase tracking-widest hover:text-medgo-teal transition-colors">
              Limpiar filtros
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="space-y-2 text-left">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Especialidad</label>
              <select v-model="filters.especialidad" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all">
                <option value="">Todas las especialidades</option>
                <option v-for="s in specialties" :key="s.EspecialidadID" :value="s.NombreEspecialidad">{{ s.NombreEspecialidad }}</option>
              </select>
            </div>

            <div class="space-y-2 text-left">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ordenar por</label>
              <select v-model="filters.ordenar" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all">
                <option value="cercania">Cercanía</option>
                <option value="puntuacion">Puntuación</option>
              </select>
            </div>

            <div
              @click="filters.inmediata = !filters.inmediata"
              :class="filters.inmediata ? 'bg-medgo-teal shadow-lg shadow-teal-100' : 'bg-slate-200'"
              class="p-4 rounded-4xl flex items-center justify-between cursor-pointer h-fit self-end transition-all duration-300 group active:scale-95"
            >
              <span class="text-[10px] font-black uppercase text-white leading-none tracking-wider">Consulta Inmediata</span>
              <div class="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300" :class="filters.inmediata ? 'translate-x-0' : '-translate-x-1 opacity-50'"></div>
            </div>

            <div
              @click="filters.ingles = !filters.ingles"
              :class="filters.ingles ? 'bg-medgo-blue shadow-lg shadow-blue-100' : 'bg-slate-200'"
              class="p-4 rounded-4xl flex items-center justify-between cursor-pointer h-fit self-end transition-all duration-300 group active:scale-95"
            >
              <span class="text-[10px] font-black uppercase text-white leading-none tracking-wider">Habla Inglés</span>
              <div class="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300" :class="filters.ingles ? 'translate-x-0' : '-translate-x-1 opacity-50'"></div>
            </div>
          </div>
        </div>

        <div v-if="doctors.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div v-for="doctor in doctors" :key="doctor.DoctorID" class="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
            <div class="flex flex-col items-center text-center space-y-6">
              <div class="w-28 h-28 bg-slate-100 rounded-4xl flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform relative">
                👨‍⚕️
                <div v-if="doctor.EsVerificado === '1'" class="absolute -top-2 -right-2 p-1.5 bg-medgo-teal rounded-full text-white shadow-md border-2 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-black text-slate-800 leading-tight">{{ doctor.Nombre }} {{ doctor.Apellido }}</h3>
                <p class="text-xs font-black text-medgo-teal uppercase tracking-[0.2em] mt-2 italic">{{ doctor.Especialidad }}</p>
              </div>
              <div class="flex gap-3">
                <span v-if="doctor.Estado === '1'" class="px-4 py-1.5 bg-blue-50 text-medgo-blue rounded-full text-[10px] font-black uppercase tracking-tighter border border-blue-100">Activo</span>
                <span class="px-4 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-tighter border border-slate-100">⭐ 4.9</span>
              </div>
              <button
                @click="startBooking(doctor)"
                class="w-full bg-medgo-gradient text-white py-5 rounded-2xl font-black uppercase shadow-lg"
              >
                Agendar Cita
              </button>
            </div>
          </div>
        </div>
        <div v-else class="p-32 text-center bg-white rounded-[3rem] shadow-inner border border-slate-50">
          <span class="text-7xl block mb-6 grayscale opacity-50"></span>
          <p class="text-slate-400 font-black uppercase tracking-widest text-lg">No se encontraron resultados</p>
          <button @click="clearFilters" class="mt-6 text-medgo-blue font-black uppercase text-sm hover:underline">Limpiar todos los filtros</button>
        </div>
      </section>

      <section v-if="activeTab === 'schedule'" class="animate-fade-in space-y-6">
        <div v-if="!selectedDoctor" class="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div class="text-8xl mb-6">🏥</div>
          <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tight">Agendar Cita</h2>
          <p class="text-slate-500 font-medium text-lg mt-4 max-w-md mx-auto italic">
            "Seleccione un médico del directorio para agendar una cita"
          </p>
          <button
            @click="activeTab = 'directory'"
            class="mt-10 bg-medgo-gradient text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            Ir al Directorio ahora
          </button>
        </div>

        <BookingView
          v-else
          :selectedDoctor="selectedDoctor"
          @cancel="resetBooking"
        />
      </section>

      <section v-if="activeTab === 'my-appointments'" class="animate-fade-in space-y-8">
        <MyAppointmentsList
          :usuarioId="userData.id"
          @goToDirectory="activeTab = 'directory'"
        />
      </section>

      <section v-if="activeTab === 'history'" class="animate-fade-in">
        <MedicalHistoryView :usuarioId="userData.id" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, markRaw, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/shared/infrastructure/api';
import { DirectoryRepositoryImpl } from '../infrastructure/DirectoryRepositoryImpl';
import type { Doctor } from '../domain/entities/Doctor';
import type { DoctorFilters } from '../domain/repository/DirectoryRepository';
import BookingView from '@/modules/appointments/ui/BookingView.vue';
import MyAppointmentsList from '@/modules/appointments/ui/MyAppointmentsList.vue';
import MedicalHistoryView from '@/modules/appointments/ui/MedicalHistoryView.vue';

import {
  UsersIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  FolderOpenIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const directoryRepo = new DirectoryRepositoryImpl();

// Estados del Directorio
const doctors = ref<Doctor[]>([]);
const specialties = ref<Specialty[]>([]);
const userData = ref({ id: 0, nombre: 'Usuario', email: '' });
const activeTab = ref('directory');
const selectedDoctor = ref<Doctor | null>(null);

interface Specialty {
  EspecialidadID: number;
  NombreEspecialidad: string;
}

const tabs = [
  { id: 'directory', label: 'Directorio', icon: markRaw(UsersIcon) },
  { id: 'schedule', label: 'Agendar', icon: markRaw(CalendarIcon) },
  { id: 'my-appointments', label: 'Mis Citas', icon: markRaw(ClipboardDocumentListIcon) },
  { id: 'history', label: 'Historial', icon: markRaw(FolderOpenIcon) },
];

const startBooking = (doctor: Doctor) => {
  selectedDoctor.value = doctor;
  activeTab.value = 'schedule';
};

const resetBooking = () => {
  selectedDoctor.value = null;
  activeTab.value = 'directory';
};

const filters = reactive<DoctorFilters>({
  search: '',
  especialidad: '',
  geolocalizacion: false,
  inmediata: false,
  ingles: false,
  ordenar: 'cercania'
});

watch(filters, () => {
  searchDoctors();
}, { deep: true });

const isLoading = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

const searchDoctors = async () => {
  if (timeout) clearTimeout(timeout);
  isLoading.value = true;
  timeout = setTimeout(async () => {
    try {
      const data = await directoryRepo.getDoctors(filters);
      doctors.value = data || [];
    } finally {
      isLoading.value = false;
    }
  }, 300);
};

const fetchSpecialties = async () => {
  try {
    const response = await api.get('/especialidades');
    specialties.value = response.data || [];
  } catch (error) {
    console.error("Error especialidades:", error);
  }
};

const loadUser = () => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson);
      userData.value = {
        id: parsed.id,
        nombre: parsed.nombre,
        email: parsed.email || ''
      };
    } catch {
      console.warn("Error parseando usuario");
    }
  }
};

const clearFilters = () => {
  filters.search = '';
  filters.especialidad = '';
  filters.inmediata = false;
  filters.ingles = false;
  filters.ordenar = 'cercania';
  searchDoctors();
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/');
};

onMounted(async () => {
  loadUser();
  await fetchSpecialties();
  await searchDoctors();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
