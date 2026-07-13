<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-vibrante relative overflow-hidden font-sans transition-all duration-700">

    <template v-if="!isPediatric">
      <div class="hidden lg:block absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full circulo-azul blur-[130px]"></div>
      <div class="hidden lg:block absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full circulo-teal blur-[130px]"></div>
    </template>
    <template v-else>
      <div class="hidden lg:block absolute top-[12%] left-[8%] text-7xl opacity-20 hover:opacity-30 transition-all select-none animate-bounce" style="animation-duration: 4s;">🧸</div>
      <div class="hidden lg:block absolute bottom-[18%] left-[12%] text-6xl opacity-20 hover:opacity-30 transition-all select-none animate-bounce" style="animation-duration: 5s;">🎈</div>
      <div class="hidden lg:block absolute top-[10%] right-[12%] text-7xl opacity-20 hover:opacity-30 transition-all select-none animate-bounce" style="animation-duration: 4.5s;">🚀</div>
      <div class="hidden lg:block absolute bottom-[14%] right-[8%] text-6xl opacity-20 hover:opacity-30 transition-all select-none animate-bounce" style="animation-duration: 5.5s;">✈️</div>
      <div class="hidden lg:block absolute top-[38%] left-[4%] text-5xl opacity-15 select-none animate-pulse">🧸</div>
      <div class="hidden lg:block absolute bottom-[42%] right-[5%] text-5xl opacity-15 select-none animate-pulse">🎈</div>
    </template>

    <div class="w-full h-screen sm:h-auto sm:max-w-md bg-white sm:rounded-[2.5rem] shadow-xl overflow-hidden z-10 flex flex-col border-t sm:border border-gray-100 my-8 relative transition-all duration-500">

      <div class="absolute right-6 top-6 z-20 w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 hover:rotate-6 select-none pointer-events-none">
        <span v-if="isPediatric" class="text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]">🧸</span>
        <v-icon
          v-else
          name="bi-person-lines-fill"
          class="text-white filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
          scale="2"
        />
      </div>

      <!-- ENCABEZADO -->
      <div class="bg-medgo-gradient p-10 text-center text-white relative pt-14 pb-12 transition-all duration-700 overflow-hidden">
        <div class="relative z-10 flex flex-col items-center">
          <div class="contenedor-icono-3d mb-6 relative">
            <div class="icono-cuerpo-3d transition-all duration-700" :class="isPediatric ? 'bg-gradient-pediatric' : ''">
              <div class="texto-med">Med</div>
              <div class="texto-go">Go+</div>
            </div>
          </div>

          <h2 class="text-3xl font-black tracking-tight drop-shadow-sm transition-all">
            {{ step === 2 ? 'Verificación' : (isPediatric ? 'Registro Pediátrico' : 'Bienvenido a MedGo+') }}
          </h2>
          <h3 class="text-blue-50/90 text-xs mt-3 font-semibold max-w-70 leading-relaxed transition-all text-center uppercase tracking-wide">
            {{ step === 2 ? 'Carga tu documento oficial de tutor legal para habilitar el acceso.' : (isPediatric ? 'Gestiona la ficha de tu menor vinculada a tu cuenta de tutor responsable.' : 'Gestión y control clínico integral.') }}
          </h3>
        </div>
      </div>

      <div v-if="step === 1" class="px-8 pt-6">
        <div class="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1.5 shadow-inner">
          <button
            type="button"
            @click="isPediatric = false"
            :class="!isPediatric ? 'bg-white text-slate-800 font-black shadow-sm' : 'text-slate-400 font-bold hover:text-slate-600'"
            class="flex-1 py-2.5 text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🧑 Adulto</span>
          </button>
          <button
            type="button"
            @click="isPediatric = true"
            :class="isPediatric ? 'bg-white text-slate-800 font-black shadow-sm' : 'text-slate-400 font-bold hover:text-slate-600'"
            class="flex-1 py-2.5 text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>👶 Pediátrico</span>
          </button>
        </div>
      </div>

      <div v-if="step === 1" class="px-6 py-4 space-y-3.5 flex-1 text-left">
        <div class="grid grid-cols-2 gap-3.5">
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre</label>
            <input v-model="form.nombre" type="text" placeholder="Ej. Juan" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Apellido</label>
            <input v-model="form.apellido" type="text" placeholder="Ej. Pérez" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">
              {{ isPediatric ? 'DNI del Menor' : 'Número de DNI' }}
            </label>
            <input v-model="form.dni" type="text" placeholder="0000-0000-00000" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">
              {{ isPediatric ? 'Teléfono Tutor' : 'Teléfono Contacto' }}
            </label>
            <input v-model="form.telefono" type="tel" placeholder="+504 9988-7766" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>
        </div>

        <div v-if="!isPediatric" class="grid grid-cols-2 gap-3.5">
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
            <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Contraseña</label>
            <input v-model="form.password" type="password" placeholder="••••••••" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-xs font-medium text-slate-700" required />
          </div>
        </div>

        <div v-if="isPediatric" class="space-y-2.5 bg-blue-50/40 p-3.5 rounded-2xl border border-blue-100/40">
          <p class="text-[9px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100/60 pb-1.5 mb-1 flex items-center gap-1.5">
            <v-icon name="bi-shield-fill-check" /> Datos Obligatorios del Tutor Legal
          </p>

          <div class="space-y-1">
            <label class="block text-[8px] font-black text-blue-700 uppercase tracking-wider pl-1">Nombre Completo del Tutor</label>
            <input v-model="form.tutor_nombre" type="text" placeholder="Ej. María Fernanda Rodríguez" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-medgo-blue outline-none transition-all text-xs font-semibold text-slate-700" required />
          </div>

          <div class="grid grid-cols-2 gap-3.5">
            <div class="space-y-1">
              <label class="block text-[8px] font-black text-blue-700 uppercase tracking-wider pl-1">DNI del Padre o Tutor</label>
              <input v-model="form.tutor_dni" type="text" placeholder="0000-0000-00000" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-medgo-blue outline-none transition-all text-xs font-semibold text-slate-700" required />
            </div>
            <div class="space-y-1">
              <label class="block text-[8px] font-black text-blue-700 uppercase tracking-wider pl-1">Parentesco</label>
              <select v-model="form.parentesco" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-medgo-blue outline-none transition-all text-xs font-bold text-slate-600 cursor-pointer" required>
                <option value="" disabled>Seleccione...</option>
                <option value="Padre/Madre">Padre / Madre</option>
                <option value="Tutor Legal">Tutor Legal</option>
                <option value="Otro">Otro Familiar</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3.5">
            <div class="space-y-1">
              <label class="block text-[8px] font-black text-blue-700 uppercase tracking-wider pl-1">Correo del Tutor</label>
              <input v-model="form.tutor_email" type="email" placeholder="correo.tutor@ejemplo.com" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-medgo-blue outline-none transition-all text-xs font-semibold text-slate-700" required />
            </div>
            <div class="space-y-1">
              <label class="block text-[8px] font-black text-blue-700 uppercase tracking-wider pl-1">Crear Contraseña</label>
              <input v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-medgo-blue outline-none transition-all text-xs font-semibold text-slate-700" required />
            </div>
          </div>
        </div>

        <button type="button" @click="goToNextStep" class="w-full group relative pt-2 cursor-pointer">
          <div class="absolute inset-x-0 -bottom-1 h-full bg-black/10 rounded-2xl"></div>
          <div class="relative bg-medgo-blue py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest active:translate-y-0.5 transition-all flex items-center justify-center">
            <span>{{ isPediatric ? 'Siguiente: Verificación' : 'Completar Registro' }}</span>
          </div>
        </button>

        <p class="text-center text-[13px] text-slate-400 font-medium pt-2">
          ¿Ya tienes una cuenta?
          <router-link to="/" class="text-medgo-blue font-black hover:underline ml-1">Inicia Sesión</router-link>
        </p>
      </div>

      <div v-if="step === 2" class="p-8 space-y-6 flex-1 text-left animate-fade-in">
        <button type="button" @click="step = 1" class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider mb-4">
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

          <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#005596] shadow-sm">
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
            <p class="text-[10px] font-bold text-slate-500 leading-relaxed">Tus documentos están protegidos con encriptación de nivel bancario y solo serán usados para verificación de identidad.</p>
          </div>
        </div>

        <button type="button" @click="handleRegister" :disabled="loading" class="w-full group relative pt-4 cursor-pointer">
          <div class="absolute inset-x-0 -bottom-1 h-full bg-black/10 rounded-2xl"></div>
          <div class="relative bg-medgo-blue py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest active:translate-y-0.5 transition-all flex items-center justify-center">
            <span v-if="!loading">Enviar para Verificación</span>
            <div v-else class="flex space-x-1">
               <div class="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
               <div class="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
               <div class="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { PatientRepositoryImpl } from '@/modules/patients/infraestructure/PatientRepositoryImpl';

const router = useRouter();
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
      toast.error("Por favor ingresa tu correo electrónico y contraseña de acceso.");
      return;
    }
    handleRegister();
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

const handleRegister = async (): Promise<void> => {
  if (isPediatric.value && !selectedFile.value) {
    toast.error("Debes cargar el documento de identidad del tutor para la verificación física.");
    return;
  }

  loading.value = true;
  try {
    await patientRepo.registerPublic({
      DNI: form.dni,
      Nombre: form.nombre,
      Apellido: form.apellido,
      Telefono: form.telefono,
      email: form.email,
      password: form.password,
      es_dependiente: isPediatric.value,
      tutor_dni: isPediatric.value ? form.tutor_dni : undefined,
      tutor_nombre: isPediatric.value ? form.tutor_nombre : undefined,
      tutor_email: isPediatric.value ? form.tutor_email : undefined,
      parentesco: isPediatric.value ? form.parentesco : undefined,
      documento_identidad_url: selectedFile.value ? selectedFile.value.name : undefined
    });

    toast.success("¡Registro completado y enviado para verificación física!");
    router.push('/');
  } catch (error: unknown) {
    console.error(error);
    toast.error("Ocurrió un problema al procesar su solicitud de registro.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.scale-102 {
  transform: scale(1.02);
}

.contenedor-icono-3d {
  width: 92px;
  height: 92px;
  perspective: 1000px;
  animation: flotar 4.5s ease-in-out infinite;
}

.icono-cuerpo-3d {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  background: linear-gradient(135deg, #007bff 0%, #00c4cc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow:
    0 12px 24px rgba(0, 50, 150, 0.25),
    inset 0 4px 6px rgba(255, 255, 255, 0.45),
    inset 0 -6px 12px rgba(0, 0, 0, 0.18);
  transform: rotateX(8deg) rotateY(-4deg);
  transform-style: preserve-3d;
}

.bg-gradient-pediatric {
  background: linear-gradient(135deg, #ff7675 0%, #ffb142 100%) !important;
  box-shadow:
    0 12px 24px rgba(235, 77, 75, 0.25),
    inset 0 4px 6px rgba(255, 255, 255, 0.45),
    inset 0 -6px 12px rgba(0, 0, 0, 0.15) !important;
}

.texto-med {
  font-size: 21px;
  font-weight: 900;
  line-height: 1;
}

.texto-go {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
}

@keyframes flotar {
  0% { transform: translateY(0px) rotateX(8deg) rotateY(-4deg); }
  50% { transform: translateY(-10px) rotateX(12deg) rotateY(2deg); }
  100% { transform: translateY(0px) rotateX(8deg) rotateY(-4deg); }
}
</style>
