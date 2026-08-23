<!-- ui/components/RegistrarEspecialista.vue -->
<template>
  <div class="max-w-5xl mx-auto space-y-6 text-left select-none font-sans animate-fade-in">
    <!-- Card Formulario -->
    <div class="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden space-y-8">
      <div class="h-1.5 bg-[#00a884] absolute top-0 left-0 right-0"></div>

      <!-- Header y Fotografía Profesional -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">REGISTRAR ESPECIALISTA</h1>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            SE VINCULARÁ AUTOMÁTICAMENTE A SU ENTIDAD
          </p>
        </div>

        <!-- Box Fotografía Profesional -->
        <div class="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-slate-200/80 text-slate-500 flex items-center justify-center font-black text-[10px] text-center leading-tight overflow-hidden">
            <img v-if="fotoPreview" :src="fotoPreview" class="w-full h-full object-cover" />
            <span v-else>SIN<br>FOTO</span>
          </div>
          <div>
            <span class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">FOTOGRAFÍA PROFESIONAL</span>
            <label class="mt-1 inline-block px-4 py-1.5 bg-[#00a884] hover:bg-[#008f70] text-white text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all shadow-xs">
              SELECCIONAR
              <input type="file" accept="image/*" class="hidden" @change="handleFotoUpload" />
            </label>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Grid Campos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">NOMBRE</label>
            <input v-model="form.nombre" type="text" required class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#00a884]" />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">APELLIDO</label>
            <input v-model="form.apellido" type="text" required class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#00a884]" />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">ESPECIALIDAD</label>
            <select v-model="form.especialidad_id" required class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-[#00a884] cursor-pointer">
              <option :value="null" disabled>Seleccione...</option>
              <option v-for="esp in especialidadesList" :key="esp.EspecialidadID" :value="esp.EspecialidadID">
                {{ esp.NombreEspecialidad }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">N° COLEGIACIÓN</label>
            <input v-model="form.numero_colegiado" type="text" placeholder="EJ. CMH-12345" required class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono font-bold text-slate-800 outline-none focus:bg-white focus:border-[#00a884]" />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">CORREO ELECTRÓNICO</label>
            <input v-model="form.email" type="email" required class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#00a884]" />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">CONTRASEÑA</label>
            <input v-model="form.password" type="password" required class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#00a884]" />
          </div>
        </div>

        <!-- Documentación Legal Requerida -->
        <div class="bg-slate-50/60 rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h3 class="text-xs font-black text-slate-700 uppercase tracking-wider">
            DOCUMENTACIÓN LEGAL REQUERIDA (ARCHIVOS INDEPENDIENTES)
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 1. Título General -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span class="block text-[10px] font-black text-slate-800 uppercase">1. TÍTULO DE MÉDICO GENERAL</span>
                <span class="text-[11px] text-slate-400 font-medium truncate block max-w-xs">{{ docFiles.titulo_medico ? docFiles.titulo_medico.name : 'No se ha seleccionado ningún archivo' }}</span>
              </div>
              <label class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0">
                Elegir archivo
                <input type="file" accept=".pdf,image/*" class="hidden" @change="(e) => handleFileChange(e, 'titulo_medico')" />
              </label>
            </div>

            <!-- 2. Título Especialidad -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span class="block text-[10px] font-black text-slate-800 uppercase">2. TÍTULO DE ESPECIALIDAD</span>
                <span class="text-[11px] text-slate-400 font-medium truncate block max-w-xs">{{ docFiles.titulo_especialista ? docFiles.titulo_especialista.name : 'No se ha seleccionado ningún archivo' }}</span>
              </div>
              <label class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0">
                Elegir archivo
                <input type="file" accept=".pdf,image/*" class="hidden" @change="(e) => handleFileChange(e, 'titulo_especialista')" />
              </label>
            </div>

            <!-- 3. Constancia del Colegio -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span class="block text-[10px] font-black text-slate-800 uppercase">3. CONSTANCIA DEL COLEGIO MÉDICO</span>
                <span class="text-[11px] text-slate-400 font-medium truncate block max-w-xs">{{ docFiles.constancia_colegio ? docFiles.constancia_colegio.name : 'No se ha seleccionado ningún archivo' }}</span>
              </div>
              <label class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0">
                Elegir archivo
                <input type="file" accept=".pdf,image/*" class="hidden" @change="(e) => handleFileChange(e, 'constancia_colegio')" />
              </label>
            </div>

            <!-- 4. DNI -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span class="block text-[10px] font-black text-slate-800 uppercase">4. DOCUMENTO DE IDENTIDAD / DNI</span>
                <span class="text-[11px] text-slate-400 font-medium truncate block max-w-xs">{{ docFiles.dni ? docFiles.dni.name : 'No se ha seleccionado ningún archivo' }}</span>
              </div>
              <label class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0">
                Elegir archivo
                <input type="file" accept=".pdf,image/*" class="hidden" @change="(e) => handleFileChange(e, 'dni')" />
              </label>
            </div>
          </div>
        </div>

        <!-- Botón verde registrar -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-[#00a884] hover:bg-[#008f70] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
        >
          <span v-if="!loading">🚀 REGISTRAR ESPECIALISTA</span>
          <span v-else class="flex items-center gap-2">PROCESANDO REGISTRO...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import type { DoctorRegistrationForm, Specialty } from '../../Domain/Clinic';
import { ClinicRepository } from '../../infrastructure/ClinicRepository';

interface Props {
  especialidades?: Specialty[];
  entidadId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  especialidades: () => [],
  entidadId: 1
});

const emit = defineEmits<{
  (e: 'guardar', form: DoctorRegistrationForm): void;
  (e: 'cancelar'): void;
}>();

const repo = new ClinicRepository();
const toast = useToast();
const authStore = useAuthStore();

const especialidadesList = ref<Specialty[]>([]);
const loading = ref(false);
const fotoPreview = ref<string | null>(null);

const form = ref<DoctorRegistrationForm>({
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  telefono: '',
  password: '',
  numero_colegiado: '',
  especialidad_id: null,
  consultorio: '',
  dias_atencion: ['lunes', 'miercoles', 'viernes'],
  tarifa_consulta: 1200,
  entidad_id: props.entidadId
});

const docFiles = ref({
  fotografia: null as File | null,
  titulo_medico: null as File | null,
  titulo_especialista: null as File | null,
  constancia_colegio: null as File | null,
  dni: null as File | null
});

const clinicId = computed<number>(() => {
  const user = authStore.user as Record<string, unknown> | null;
  let idRaw = user?.['EntidadID'] ?? user?.['entidad_id'];
  if (!idRaw) {
    const localUserRaw = localStorage.getItem('user');
    if (localUserRaw) {
      try {
        const localUser = JSON.parse(localUserRaw) as Record<string, unknown>;
        idRaw = localUser['entidadId'] ?? localUser['EntidadID'] ?? localUser['entidad_id'];
      } catch {
        idRaw = 0;
      }
    }
  }
  const parsedId = Number(idRaw);
  return isNaN(parsedId) || parsedId === 0 ? props.entidadId || 1 : parsedId;
});

const handleFotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    docFiles.value.fotografia = file;
    fotoPreview.value = URL.createObjectURL(file);
  }
};

const handleFileChange = (event: Event, key: keyof typeof docFiles.value) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    docFiles.value[key] = target.files[0];
  }
};

const handleSubmit = async () => {
  if (!form.value.especialidad_id) {
    toast.error('Por favor seleccione una especialidad.');
    return;
  }

  if (!docFiles.value.fotografia) {
    toast.error('Por favor seleccione la fotografía profesional.');
    return;
  }

  if (
    !docFiles.value.titulo_medico ||
    !docFiles.value.titulo_especialista ||
    !docFiles.value.constancia_colegio ||
    !docFiles.value.dni
  ) {
    toast.error('Por favor adjunte los 4 documentos legales requeridos.');
    return;
  }

  loading.value = true;

  try {
    const formData = new FormData();
    formData.append('email', form.value.email);
    formData.append('password', form.value.password || '123456');
    formData.append('nombre', form.value.nombre);
    formData.append('apellido', form.value.apellido);
    formData.append('especialidad_id', String(form.value.especialidad_id));
    formData.append('numero_colegiado', form.value.numero_colegiado);
    formData.append('entidad_id', String(clinicId.value));

    formData.append('fotografia', docFiles.value.fotografia);
    formData.append('titulo_medico', docFiles.value.titulo_medico);
    formData.append('titulo_especialista', docFiles.value.titulo_especialista);
    formData.append('constancia_colegio', docFiles.value.constancia_colegio);
    formData.append('dni', docFiles.value.dni);

    await repo.registerDoctor(formData);

    toast.success('¡Especialista registrado y verificado exitosamente!');
    emit('guardar', { ...form.value });
  } catch (error: unknown) {
    console.error('Error registrando doctor:', error);
    const errObj = error as { response?: { data?: { message?: string } } };
    const msg = errObj.response?.data?.message || 'Error al procesar el alta del médico.';
    toast.error(msg);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (props.especialidades.length > 0) {
    especialidadesList.value = props.especialidades;
  } else {
    try {
      especialidadesList.value = await repo.getSpecialties();
    } catch{
      toast.error('No se pudieron cargar las especialidades desde el servidor.');
      especialidadesList.value = [];
    }
  }
});
</script>
