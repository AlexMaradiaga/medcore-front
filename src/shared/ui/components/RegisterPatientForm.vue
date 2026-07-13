<template>
  <div class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden text-left animate-fade-in">
    <div class="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-sky-600 to-emerald-500"></div>

    <div class="border-b border-slate-50 pb-4 mb-6">
      <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">
        {{ step === 2 ? 'Verificación Jurídica' : 'Crear Expediente Clínico' }}
      </h3>
      <p class="text-xs text-slate-400 font-bold uppercase mt-0.5">
        {{ step === 2 ? 'Carga de documento oficial del tutor legal' : 'Indexación de identidad base de pacientes en el sistema' }}
      </p>
    </div>

    <!-- Cambiar Tipo de Expediente (Solo disponible en paso 1) -->
    <div v-if="step === 1" class="mb-6">
      <div class="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1.5 shadow-inner">
        <button
          type="button"
          @click="isPediatric = false"
          :class="!isPediatric ? 'bg-white text-slate-800 font-black shadow-sm' : 'text-slate-400 font-bold hover:text-slate-600'"
          class="flex-1 py-2.5 text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
        >
          <span>🧑 Adulto</span>
        </button>
        <button
          type="button"
          @click="isPediatric = true"
          :class="isPediatric ? 'bg-white text-slate-800 font-black shadow-sm' : 'text-slate-400 font-bold hover:text-slate-600'"
          class="flex-1 py-2.5 text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
        >
          <span>👶 Pediátrico</span>
        </button>
      </div>
    </div>

    <!-- PASO 1: RECOPILACIÓN DE IDENTIDAD -->
    <form v-if="step === 1" @submit.prevent="goToNextStep" class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
          <input v-model="form.Nombre" type="text" placeholder="Ej. Juan" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-sky-500 outline-hidden transition-all text-slate-700" required />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellido</label>
          <input v-model="form.Apellido" type="text" placeholder="Ej. Pérez" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-sky-500 outline-hidden transition-all text-slate-700" required />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            {{ isPediatric ? 'DNI del Menor' : 'Documento Identidad (DNI)' }}
          </label>
          <input v-model="form.DNI" type="text" placeholder="Ej. 0102202015478" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-mono text-sm focus:bg-white focus:border-sky-500 outline-hidden transition-all text-slate-700" required />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            {{ isPediatric ? 'Teléfono del Tutor' : 'Teléfono de Contacto' }}
          </label>
          <input v-model="form.Telefono" type="text" placeholder="Ej. 98741256" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-sky-500 outline-hidden transition-all text-slate-700" required />
        </div>
      </div>

      <!-- CAMPOS EXCLUSIVOS SI ES ADULTO (Para crear credenciales de acceso inmediatas) -->
      <div v-if="!isPediatric" class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
        <div class="space-y-1.5">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
          <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-sky-500 outline-hidden transition-all text-slate-700" required />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña de Acceso</label>
          <input v-model="form.password" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 font-medium text-sm focus:bg-white focus:border-sky-500 outline-hidden transition-all text-slate-700" required />
        </div>
      </div>

      <!-- CAMPOS EXCLUSIVOS SI ES PEDIÁTRICO (Vinculación de Tutor Responsable) -->
      <div v-if="isPediatric" class="space-y-4 bg-sky-50/40 p-4 rounded-2xl border border-sky-100/40">
        <p class="text-[9px] font-black text-sky-600 uppercase tracking-widest border-b border-sky-100/60 pb-1.5 mb-1 flex items-center gap-1.5">
          📌 Datos Obligatorios del Tutor Legal
        </p>

        <div class="space-y-1.5">
          <label class="block text-[8px] font-black text-sky-700 uppercase tracking-wider ml-1">Nombre Completo del Tutor</label>
          <input v-model="form.tutor_nombre" type="text" placeholder="Ej. María Fernanda Rodríguez" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-hidden transition-all text-xs font-semibold text-slate-700" required />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-[8px] font-black text-sky-700 uppercase tracking-wider ml-1">DNI del Padre o Tutor</label>
            <input v-model="form.tutor_dni" type="text" placeholder="0000-0000-00000" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-hidden transition-all text-xs font-semibold text-slate-700" required />
          </div>
          <div class="space-y-1.5">
            <label class="block text-[8px] font-black text-sky-700 uppercase tracking-wider ml-1">Parentesco</label>
            <select v-model="form.parentesco" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-hidden transition-all text-xs font-bold text-slate-600 cursor-pointer" required>
              <option value="" disabled>Seleccione...</option>
              <option value="Padre/Madre">Padre / Madre</option>
              <option value="Tutor Legal">Tutor Legal</option>
              <option value="Otro">Otro Familiar</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-[8px] font-black text-sky-700 uppercase tracking-wider ml-1">Correo del Tutor</label>
            <input v-model="form.tutor_email" type="email" placeholder="correo.tutor@ejemplo.com" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-hidden transition-all text-xs font-semibold text-slate-700" required />
          </div>
          <div class="space-y-1.5">
            <label class="block text-[8px] font-black text-sky-700 uppercase tracking-wider ml-1">Contraseña Cuenta Menor</label>
            <input v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-hidden transition-all text-xs font-semibold text-slate-700" required />
          </div>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" class="w-full py-4 bg-linear-to-r from-sky-600 to-sky-800 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center border-none">
          <span>{{ isPediatric ? 'Siguiente: Verificación' : '🚀 Dar de Alta Expediente' }}</span>
        </button>
      </div>
    </form>

    <!-- PASO 2: VERIFICACIÓN (SOLO MENORES) -->
    <div v-else class="space-y-6">
      <button type="button" @click="step = 1" class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider border-none bg-transparent cursor-pointer">
        ← Volver al formulario
      </button>

      <div
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleFileDrop"
        @click="triggerFileInput"
        :class="[
          'border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 min-h-44 text-center',
          isDragOver ? 'border-sky-600 bg-sky-50/20' : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
        ]"
      >
        <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*,.pdf" class="hidden" />
        <div class="space-y-1" v-if="!selectedFile">
          <p class="text-xs font-black text-slate-700 uppercase tracking-wide">Arrastra el documento legal del tutor aquí</p>
          <p class="text-[10px] font-bold text-slate-400">o haz clic para seleccionar (JPG, PNG o PDF)</p>
        </div>
        <div class="space-y-1" v-else>
          <p class="text-xs font-black text-emerald-600 uppercase tracking-wide">¡Documento cargado con éxito!</p>
          <p class="text-[10px] font-mono font-bold text-slate-500 truncate max-w-64">{{ selectedFile.name }}</p>
        </div>
      </div>

      <div class="pt-4">
        <button type="button" @click="handleSubmit" :disabled="loading" class="w-full py-4 bg-linear-to-r from-emerald-600 to-emerald-800 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer border-none flex items-center justify-center">
          <span v-if="!loading">🚀 Finalizar y Guardar Alta Familiar</span>
          <span v-else class="animate-pulse">Sincronizando con SQL Server...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { PatientRepositoryImpl } from '@/modules/patients/infraestructure/PatientRepositoryImpl';

const props = defineProps<{
  tutorUsuarioId?: number;
  initialNombre?: string;
  initialApellido?: string;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const toast = useToast();
const patientRepo = new PatientRepositoryImpl();

const step = ref<number>(1);
const loading = ref<boolean>(false);
const isPediatric = ref<boolean>(false);
const isDragOver = ref<boolean>(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const form = reactive({
  Nombre: props.initialNombre || '',
  Apellido: props.initialApellido || '',
  DNI: '',
  Telefono: '',
  email: '',
  password: '',
  tutor_dni: '',
  tutor_nombre: '',
  tutor_email: '',
  parentesco: ''
});

watch(() => props.initialNombre, (newVal) => { if(newVal) form.Nombre = newVal; });
watch(() => props.initialApellido, (newVal) => { if(newVal) form.Apellido = newVal; });

const triggerFileInput = (): void => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) selectedFile.value = file;
};

const handleFileDrop = (event: DragEvent): void => {
  isDragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) selectedFile.value = file;
};

const goToNextStep = (): void => {
  if (!form.Nombre.trim() || !form.Apellido.trim() || !form.DNI.trim() || !form.Telefono.trim()) {
    toast.error("Por favor completa los datos requeridos.");
    return;
  }

  if (isPediatric.value) {
    if (!form.tutor_nombre.trim() || !form.tutor_dni.trim() || !form.tutor_email.trim() || !form.parentesco) {
      toast.error("Por favor completa los datos obligatorios del tutor legal.");
      return;
    }
    step.value = 2;
  } else {
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Por favor ingresa correo y contraseña.");
      return;
    }
    void handleSubmit();
  }
};

const handleSubmit = async () => {
  if (isPediatric.value && !selectedFile.value) {
    toast.error("Debe adjuntar la documentación de identidad del tutor legal.");
    return;
  }

  loading.value = true;
  try {
    // Orquestamos la misma petición pública que tiene RegisterView
    await patientRepo.registerPublic({
      DNI: form.DNI,
      Nombre: form.Nombre,
      Apellido: form.Apellido,
      Telefono: form.Telefono,
      email: form.email,
      password: form.password,
      es_dependiente: isPediatric.value,
      tutor_dni: isPediatric.value ? form.tutor_dni : undefined,
      tutor_nombre: isPediatric.value ? form.tutor_nombre : undefined,
      tutor_email: isPediatric.value ? form.tutor_email : undefined,
      parentesco: isPediatric.value ? form.parentesco : undefined,
      documento_identidad_url: selectedFile.value ? selectedFile.value.name : undefined
    });

    toast.success("¡Expediente indexado de forma segura en MedCore Global!");

    // Reseteo de control
    form.DNI = '';
    form.Telefono = '';
    form.email = '';
    form.password = '';
    selectedFile.value = null;
    step.value = 1;

    emit('success');
  } catch (error: unknown) {
    console.error(error);
    toast.error("Error en la consistencia de datos relacionales.");
  } finally {
    loading.value = false;
  }
};
</script>
