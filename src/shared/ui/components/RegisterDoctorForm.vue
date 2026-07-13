<template>
  <div class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xs relative overflow-hidden h-fit">
    <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-teal-500 to-emerald-500"></div>

    <div class="mb-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
      <div>
        <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">Registrar Especialista</h3>
        <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">Se vinculará automáticamente a su entidad</p>
      </div>

      <!-- SECCIÓN: CARGA DE FOTOGRAFÍA (Restaurada de tu prod) -->
      <div class="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 self-start sm:self-center">
        <div class="w-14 h-14 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center relative group">
          <img v-if="fotoPreview" :src="fotoPreview" class="w-full h-full object-cover" />
          <span v-else class="text-[10px] font-black text-slate-400 text-center uppercase p-1">Sin Foto</span>
        </div>
        <div class="text-left">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Fotografía Profesional</label>
          <input @change="handleFotoUpload" type="file" accept=".jpg,.png" class="hidden" id="foto-doctor-clinic" required />
          <label for="foto-doctor-clinic" class="mt-1 inline-block bg-teal-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg cursor-pointer hover:brightness-110 transition-all">
            Seleccionar
          </label>
        </div>
      </div>
    </div>

    <form @submit.prevent="registrarDoctor" class="space-y-5 text-left">
      <!-- Datos Personales -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Nombre</label>
          <input v-model="form.nombre" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-teal-500 transition-all text-slate-700" required />
        </div>
        <div class="space-y-1">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Apellido</label>
          <input v-model="form.apellido" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-teal-500 transition-all text-slate-700" required />
        </div>
      </div>

      <!-- Credenciales Clínicas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Especialidad</label>
          <select v-model="form.especialidad_id" required class="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700 cursor-pointer">
            <option :value="null" disabled>Seleccione una especialidad...</option>
            <option v-for="esp in specialties" :key="esp.EspecialidadID" :value="esp.EspecialidadID">
              {{ esp.NombreEspecialidad }}
            </option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Nº Colegiación</label>
          <input v-model="form.numero_colegiado" type="text" placeholder="Ej. CMH-12345" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-teal-500 transition-all text-slate-700 uppercase font-mono" required />
        </div>
      </div>

      <!-- Acceso de Cuenta -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
          <input v-model="form.email" type="email" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-teal-500 transition-all text-slate-700" required />
        </div>
        <div class="space-y-1">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Contraseña</label>
          <input v-model="form.password" type="password" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-teal-500 transition-all text-slate-700" required />
        </div>
      </div>

      <!-- SECCIÓN: ACORDONES Y APARTADOS ESPECÍFICOS DE CARGA DOCUMENTAL (Restaurado) -->
      <div class="bg-slate-50/60 p-5 rounded-3xl border border-slate-200/60 space-y-4">
        <h3 class="text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Documentación Legal Requerida (Archivos independientes)</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
            <label class="block text-[10px] font-black text-slate-700 uppercase tracking-tight">1. Título de Médico General</label>
            <input @change="handleFileChange($event, 'titulo_medico')" type="file" accept=".pdf,.jpg,.png" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white file:cursor-pointer cursor-pointer" required />
          </div>
          <div class="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
            <label class="block text-[10px] font-black text-slate-700 uppercase tracking-tight">2. Título de Especialidad</label>
            <input @change="handleFileChange($event, 'titulo_especialista')" type="file" accept=".pdf,.jpg,.png" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white file:cursor-pointer cursor-pointer" required />
          </div>
          <div class="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
            <label class="block text-[10px] font-black text-slate-700 uppercase tracking-tight">3. Constancia del Colegio Médico</label>
            <input @change="handleFileChange($event, 'constancia_colegio')" type="file" accept=".pdf,.jpg,.png" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white file:cursor-pointer cursor-pointer" required />
          </div>
          <div class="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
            <label class="block text-[10px] font-black text-slate-700 uppercase tracking-tight">4. Documento de Identidad / DNI</label>
            <input @change="handleFileChange($event, 'dni')" type="file" accept=".pdf,.jpg,.png" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white file:cursor-pointer cursor-pointer" required />
          </div>
        </div>
      </div>

      <button type="submit" :disabled="loading" class="w-full py-4 bg-linear-to-r from-teal-600 to-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md flex items-center justify-center">
        {{ loading ? 'Procesando...' : '🚀 Registrar Especialista' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import api from '@/shared/infrastructure/api';
import type { SessionUser } from '../../Domain/dashboard.interface';
import { ClinicRepository } from '../../../modules/clinic/infrastructure/ClinicRepository';
import type { Specialty, } from '../../../modules/clinic/Domain/Clinic';

const repo = new ClinicRepository();
const emit = defineEmits<{ (e: 'success'): void }>();
const props = defineProps<{ entidadId?: number }>();

const toast = useToast();
const authStore = useAuthStore();
const loading = ref(false);
const fotoPreview = ref<string | null>(null);
const specialties = ref<Specialty[]>([]);

const Entidad = computed<number>(() => {
  // 1. Intentar leer de las props si el padre lo envió
  if (props.entidadId && props.entidadId !== 0) {
    return Number(props.entidadId);
  }

  // 2. Intentar leer del estado de Pinia
  const userStore = authStore.user as SessionUser | null;
  if (userStore?.EntidadID) {
    const idStore = userStore.EntidadID;
    return Number(idStore);
  }

  const localUserRaw = localStorage.getItem('user');
  if (localUserRaw) {
    const localUser = JSON.parse(localUserRaw);
    // Evaluamos la propiedad exacta 'entidadId' que viste en tu log anterior
    const idLocal = localUser.entidadId ?? localUser.entidad_id ?? localUser.EntidadID;
    if (idLocal) {
      return Number(idLocal);
    }
  }

  return 0;
});

const form = ref({
  nombre: '', apellido: '', especialidad_id: '', numero_colegiado: '', email: '', password: ''
});

const loadSpecialties = async () => {
  try {
    specialties.value = await repo.getSpecialties();
  } catch {
    toast.error("Error cargando especialidades");
  }
};

interface ExpedienteDoctores {
  fotografia: File | null;
  titulo_medico: File | null;
  titulo_especialista: File | null;
  constancia_colegio: File | null;
  dni: File | null;
}

const archivos = ref<ExpedienteDoctores>({
  fotografia: null, titulo_medico: null, titulo_especialista: null, constancia_colegio: null, dni: null
});

const handleFotoUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0] as File;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La fotografía no debe superar los 2 MB.");
      input.value = "";
      archivos.value.fotografia = null;
      fotoPreview.value = null;
      return;
    }
    archivos.value.fotografia = file;
    fotoPreview.value = URL.createObjectURL(file);
  } else {
    archivos.value.fotografia = null;
    fotoPreview.value = null;
  }
};

const handleFileChange = (event: Event, tipoKey: keyof ExpedienteDoctores) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0] as File;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("El documento no debe superar los 3 MB.");
      input.value = "";
      archivos.value[tipoKey] = null;
      return;
    }
    archivos.value[tipoKey] = file;
  } else {
    archivos.value[tipoKey] = null;
  }
};

const registrarDoctor = async () => {
  if (!archivos.value.fotografia || !archivos.value.titulo_medico || !archivos.value.titulo_especialista || !archivos.value.constancia_colegio || !archivos.value.dni) {
    return toast.warning("Debe adjuntar todos los documentos requeridos.");
  }

  // 🌟 Validar que la entidad no sea cero antes de disparar la petición
  if (Entidad.value === 0) {
    return toast.error("Error de sesión: No se detectó el ID de la clínica. Por favor, reincie sesión.");
  }

  loading.value = true;
  const formData = new FormData();
  formData.append('nombre', form.value.nombre);
  formData.append('apellido', form.value.apellido);
  formData.append('especialidad_id', form.value.especialidad_id);
  formData.append('numero_colegiado', form.value.numero_colegiado);
  formData.append('email', form.value.email);
  formData.append('password', form.value.password);

  // Adjuntamos el ID convertido de forma segura a String
  formData.append('entidad_id', String(Entidad.value));

  formData.append('fotografia', archivos.value.fotografia);
  formData.append('titulo_medico', archivos.value.titulo_medico);
  formData.append('titulo_especialista', archivos.value.titulo_especialista);
  formData.append('constancia_colegio', archivos.value.constancia_colegio);
  formData.append('dni', archivos.value.dni);

  try {
    // 🌟 CAMBIO AQUÍ: Apuntamos al controlador del Admin y su endpoint correspondiente
    await api.post('/admin/doctores', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast.success("Doctor y credenciales de usuario creados con éxito.");

    form.value = { nombre: '', apellido: '', especialidad_id: '', numero_colegiado: '', email: '', password: '' };
    fotoPreview.value = null;
    emit('success');
  } catch (error) {
    console.error("Error en registro administrativo:", error);
    toast.error("Ocurrió un error al procesar el alta del médico.");
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  loadSpecialties();
});
</script>
