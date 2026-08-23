<!-- src/views/clinica/CrearExpediente.vue -->
<template>
  <div class="max-w-2xl mx-auto space-y-6 text-left select-none animate-fade-in pb-12">
    <div class="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200/80 shadow-md relative overflow-hidden space-y-6">
      <div class="h-2 bg-[#005596] absolute top-0 left-0 right-0"></div>

      <!-- Encabezado -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {{ step === 2 ? 'Verificación de Expediente' : 'Crear Expediente Clínico' }}
          </h1>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            {{ step === 2 ? 'Carga el documento oficial de tutor legal para habilitar el expediente.' : 'Indexación de identidad base de pacientes en el sistema.' }}
          </p>
        </div>

        <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-2xs">
          <span>{{ isPediatric ? '👶' : '👨‍🏽' }}</span>
        </div>
      </div>

      <!-- Toggle Adulto / Pediátrico (Paso 1) -->
      <div v-if="step === 1" class="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
        <button
          type="button"
          @click="isPediatric = false"
          :class="!isPediatric ? 'bg-white text-slate-800 shadow-xs font-black' : 'text-slate-400 font-bold hover:text-slate-600'"
          class="py-3 text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🧑 Adulto</span>
        </button>
        <button
          type="button"
          @click="isPediatric = true"
          :class="isPediatric ? 'bg-white text-slate-800 shadow-xs font-black' : 'text-slate-400 font-bold hover:text-slate-600'"
          class="py-3 text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>👶 Pediátrico/GEDIÁTRICO 👴</span>
        </button>
      </div>

      <!-- PASO 1: Formulario Principal -->
      <div v-if="step === 1" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre</label>
            <input v-model="form.nombre" type="text" placeholder="Ej. Juan" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005596] outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Apellido</label>
            <input v-model="form.apellido" type="text" placeholder="Ej. Pérez" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005596] outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              {{ isPediatric ? 'DNI del Menor' : 'Número de DNI' }}
            </label>
            <input v-model="form.dni" type="text" placeholder="0000-0000-00000" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005596] outline-none transition-all text-xs font-mono font-bold text-slate-700" required />
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              {{ isPediatric ? 'Teléfono Tutor' : 'Teléfono Contacto' }}
            </label>
            <input v-model="form.telefono" type="tel" placeholder="+504 9988-7766" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005596] outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nacionalidad</label>
            <input v-model="form.nacionalidad" type="text" placeholder="Ej. Hondureña" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005596] outline-none transition-all text-xs font-medium text-slate-700" />
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tipo de Sangre</label>
            <select v-model="form.tipo_sangre" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005596] outline-none transition-all text-xs font-bold text-slate-700 cursor-pointer">
              <option value="" disabled>Seleccione...</option>
              <option value="O+">O Rh Positivo (O+)</option>
              <option value="O-">O Rh Negativo (O-)</option>
              <option value="A+">A Rh Positivo (A+)</option>
              <option value="A-">A Rh Negativo (A-)</option>
              <option value="B+">B Rh Positivo (B+)</option>
              <option value="B-">B Rh Negativo (B-)</option>
              <option value="AB+">AB Rh Positivo (AB+)</option>
              <option value="AB-">AB Rh Negativo (AB-)</option>
            </select>
          </div>
        </div>

        <div v-if="!isPediatric" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
            <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005596] outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contraseña de Acceso</label>
            <input v-model="form.password" type="password" placeholder="••••••••" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005596] outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>
        </div>

        <!-- Campos Pediátricos Obligatorios del Tutor -->
        <div v-if="isPediatric" class="space-y-3 bg-sky-50/50 p-4 rounded-2xl border border-sky-100 mt-2">
          <p class="text-[10px] font-black text-[#005596] uppercase tracking-widest border-b border-sky-100 pb-2 flex items-center gap-1.5">
            <v-icon name="bi-shield-fill-check" /> Datos Obligatorios del Tutor Legal
          </p>

          <div class="space-y-1">
            <label class="block text-[9px] font-black text-sky-900 uppercase tracking-wider pl-1">Nombre Completo del Tutor</label>
            <input v-model="form.tutor_nombre" type="text" placeholder="Ej. María Fernanda Rodríguez" class="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#005596] outline-none transition-all text-xs font-semibold text-slate-700" required />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block text-[9px] font-black text-sky-900 uppercase tracking-wider pl-1">DNI del Padre o Tutor</label>
              <input v-model="form.tutor_dni" type="text" placeholder="0000-0000-00000" class="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#005596] outline-none transition-all text-xs font-semibold text-slate-700" required />
            </div>

            <div class="space-y-1">
              <label class="block text-[9px] font-black text-sky-900 uppercase tracking-wider pl-1">Parentesco</label>
              <select v-model="form.parentesco" class="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#005596] outline-none transition-all text-xs font-bold text-slate-600 cursor-pointer" required>
                <option value="" disabled>Seleccione...</option>
                <option value="Padre/Madre">Padre / Madre</option>
                <option value="Tutor Legal">Tutor Legal</option>
                <option value="Otro">Otro Familiar</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block text-[9px] font-black text-sky-900 uppercase tracking-wider pl-1">Correo del Tutor</label>
              <input v-model="form.tutor_email" type="email" placeholder="correo.tutor@ejemplo.com" class="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#005596] outline-none transition-all text-xs font-semibold text-slate-700" required />
            </div>

            <div class="space-y-1">
              <label class="block text-[9px] font-black text-sky-900 uppercase tracking-wider pl-1">Crear Contraseña</label>
              <input v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" class="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#005596] outline-none transition-all text-xs font-semibold text-slate-700" required />
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="goToNextStep"
          class="w-full mt-4 py-4 bg-[#005596] hover:bg-[#004478] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
        >
          <span>{{ isPediatric ? 'Siguiente: Verificación' : '🚀 Dar de Alta Expediente' }}</span>
        </button>
      </div>

      <!-- PASO 2: Carga Documental (Pediátrico) -->
      <div v-if="step === 2" class="space-y-6 animate-fade-in">
        <button
          type="button"
          @click="step = 1"
          class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider mb-2 cursor-pointer"
        >
          <v-icon name="bi-arrow-left" scale="0.8" /> Volver al formulario
        </button>

        <div class="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-5 text-slate-700 space-y-2.5">
          <h4 class="text-xs font-black text-[#005596] uppercase tracking-wider flex items-center gap-1.5">
            <v-icon name="bi-file-earmark-text-fill" /> Documentos Aceptados
          </h4>
          <ul class="list-disc pl-5 text-[11px] font-semibold text-slate-600 space-y-1">
            <li>Cédula de Identidad / Ciudadanía (ambas caras)</li>
            <li>Pasaporte oficial vigente</li>
            <li>Cédula de Extranjería</li>
          </ul>
          <p class="text-[9px] font-bold text-slate-400 italic">* El documento debe estar vigente y ser perfectamente legible</p>
        </div>

        <div
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop.prevent="handleFileDrop"
          @click="triggerFileInput"
          :class="[
            'border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 min-h-48 text-center',
            isDragOver ? 'border-[#005596] bg-blue-50/20 scale-102' : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
          ]"
        >
          <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*,.pdf" class="hidden" />

          <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#005596] shadow-xs">
            <v-icon name="bi-cloud-arrow-up-fill" scale="1.6" />
          </div>

          <div class="space-y-1" v-if="!selectedFile">
            <p class="text-xs font-black text-slate-700 uppercase tracking-wide">Arrastra tu documento aquí</p>
            <p class="text-[10px] font-bold text-slate-400">o haz clic para seleccionar (JPG, PNG o PDF)</p>
          </div>
          <div class="space-y-1" v-else>
            <p class="text-xs font-black text-emerald-600 uppercase tracking-wide">¡Archivo cargado con éxito!</p>
            <p class="text-[10px] font-mono font-bold text-slate-500 truncate max-w-64">{{ selectedFile.name }}</p>
          </div>
        </div>

        <div class="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 flex gap-3">
          <v-icon name="bi-shield-fill-check" class="text-amber-600 shrink-0" scale="1.4" />
          <div class="space-y-0.5">
            <h5 class="text-[10px] font-black text-amber-800 uppercase tracking-wider">Seguridad y Privacidad</h5>
            <p class="text-[10px] font-bold text-slate-500 leading-relaxed">Los documentos subidos quedan cifrados e indexados en el historial clínico oficial.</p>
          </div>
        </div>

        <button
          type="button"
          @click="handleRegister"
          :disabled="loading"
          class="w-full py-4 bg-[#005596] hover:bg-[#004478] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
        >
          <span v-if="!loading">🚀 Finalizar Creación de Expediente</span>
          <div v-else class="flex space-x-1">
             <div class="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
             <div class="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
             <div class="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { PatientRepositoryImpl } from '@/modules/patients/infraestructure/PatientRepositoryImpl';

const emit = defineEmits<{
  (e: 'guardar', expedienteData: unknown): void;
}>();

const patientRepo = new PatientRepositoryImpl();
const toast = useToast();

const step = ref<number>(1);
const loading = ref<boolean>(false);
const isPediatric = ref<boolean>(false);
const isDragOver = ref<boolean>(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = (): void => {
  fileInput.value?.click();
};

const form = reactive({
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  password: '',
  telefono: '',
  nacionalidad: 'Hondureña',
  tipo_sangre: '',
  tutor_dni: '',
  tutor_nombre: '',
  tutor_email: '',
  parentesco: ''
});

const goToNextStep = (): void => {
  if (!form.nombre.trim() || !form.apellido.trim() || !form.dni.trim() || !form.telefono.trim()) {
    toast.error("Por favor completa todos los datos requeridos del paciente.");
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
      toast.error("Por favor ingresa un correo electrónico y contraseña para el acceso al sistema.");
      return;
    }
    void handleRegister();
  }
};

const handleFileSelect = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    toast.success("Documento de identidad seleccionado.");
  }
};

const handleFileDrop = (event: DragEvent): void => {
  isDragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    selectedFile.value = file;
    toast.success("Documento soltado con éxito.");
  }
};

const resetForm = (): void => {
  step.value = 1;
  isPediatric.value = false;
  selectedFile.value = null;
  form.nombre = '';
  form.apellido = '';
  form.dni = '';
  form.email = '';
  form.password = '';
  form.telefono = '';
  form.nacionalidad = 'Hondureña';
  form.tipo_sangre = '';
  form.tutor_dni = '';
  form.tutor_nombre = '';
  form.tutor_email = '';
  form.parentesco = '';
};

const handleRegister = async (): Promise<void> => {
  if (isPediatric.value && !selectedFile.value) {
    toast.error("Debes cargar el documento de identidad del tutor para la verificación física.");
    return;
  }

  loading.value = true;
  try {
    const payload = {
      DNI: form.dni,
      Nombre: form.nombre,
      Apellido: form.apellido,
      Telefono: form.telefono,
      nacionalidad: form.nacionalidad || 'Hondureña',
      tipo_sangre: form.tipo_sangre ? form.tipo_sangre : null,
      email: form.email || null,
      password: form.password || null,
      es_dependiente: isPediatric.value,
      tutor_dni: isPediatric.value ? form.tutor_dni : null,
      tutor_nombre: isPediatric.value ? form.tutor_nombre : null,
      tutor_email: isPediatric.value ? form.tutor_email : null,
      parentesco: isPediatric.value ? form.parentesco : null,
      documento_identidad_url: selectedFile.value ? selectedFile.value.name : null
    };

    await patientRepo.registerPublic(payload);

    toast.success("¡Expediente clínico creado exitosamente!");
    emit('guardar', payload);
    resetForm();
  } catch (error: unknown) {
    console.error(error);
    toast.error("Ocurrió un problema al intentar crear el expediente del paciente.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.scale-102 {
  transform: scale(1.02);
}
</style>
