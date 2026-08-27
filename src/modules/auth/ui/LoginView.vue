<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-vibrante relative overflow-hidden font-sans">

    <div class="hidden lg:block absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full circulo-azul blur-[130px]"></div>
    <div class="hidden lg:block absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full circulo-teal blur-[130px]"></div>

    <div class="w-full h-screen sm:h-auto sm:max-w-md bg-white sm:rounded-[2.5rem] sm:shadow-[0_30px_70px_rgba(0,50,150,0.18)] overflow-hidden z-10 flex flex-col border border-gray-50/80 backdrop-blur-md">

      <div class="bg-linear-to-r from-[#2055a4] via-[#00a8b5] to-[#12d3c7] p-10 text-center text-white relative pt-14 pb-12">
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
          </svg>
        </div>

        <div class="relative z-10 flex flex-col items-center">
          <div class="contenedor-logo-3d mb-6 relative cursor-pointer">
            <div class="logo-cuerpo-3d">
              <img
                src="/logo-medgo.jpg"
                alt="MedGo+ Logo"
                class="w-full h-full object-cover rounded-3xl shadow-md"
              />
            </div>
          </div>

          <h2 class="text-3xl font-black tracking-tight drop-shadow-sm text-white">
            Bienvenido a MedGo+
          </h2>
          <h3 class="text-cyan-50/90 text-xs mt-3 font-semibold max-w-70 leading-relaxed">
            Tu plataforma integral de gestión médica. Conectando pacientes y profesionales de la salud.
          </h3>
        </div>
      </div>

      <div class="flex p-1.5 bg-slate-100/80 mx-8 mt-8 rounded-2xl border border-slate-200/50">
        <button
          @click="userType = 'paciente'"
          :class="userType === 'paciente' ? 'bg-white text-medgo-blue shadow-[0_4px_12px_rgba(0,102,204,0.15)] font-black' : 'text-slate-500 hover:text-slate-800 font-bold'"
          class="flex-1 py-3 text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
        >
          Paciente
        </button>
        <button
          @click="userType = 'prestador'"
          :class="userType === 'prestador' ? 'bg-white text-medgo-teal shadow-[0_4px_12px_rgba(0,196,204,0.15)] font-black' : 'text-slate-500 hover:text-slate-800 font-bold'"
          class="flex-1 py-3 text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
        >
          Prestador
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="p-8 space-y-6 flex-1 flex flex-col justify-between">

        <div class="space-y-5">
          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">
              Correo Electrónico
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="ejemplo@medgo.com"
              class="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 focus:bg-white focus:border-medgo-blue focus:ring-4 focus:ring-medgo-blue/5 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400/70 shadow-inner"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">
              Contraseña
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 focus:bg-white focus:border-medgo-blue focus:ring-4 focus:ring-medgo-blue/5 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400/70 shadow-inner"
              required
            />
          </div>

          <div class="flex items-center justify-between text-xs px-1 pt-1">
            <label class="flex items-center text-slate-600 cursor-pointer group select-none">
              <div class="relative flex items-center">
                <input type="checkbox" class="peer h-5 w-5 opacity-0 absolute cursor-pointer" />
                <div class="h-5 w-5 bg-slate-50 border-2 border-slate-200 rounded-md peer-checked:bg-medgo-blue peer-checked:border-medgo-blue transition-all shadow-sm"></div>
                <svg class="h-3 w-3 text-white absolute left-1 top-1 hidden peer-checked:block pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="ml-2 font-bold group-hover:text-slate-900 transition-colors">Recordarme</span>
            </label>
            <!-- En tu plantilla sustituye el <a> de '¿Olvidaste tu clave?' por: -->
            <a
              href="#"
              @click.prevent="showForgotModal = true"
              class="text-medgo-blue font-black hover:text-blue-800 transition-colors hover:underline underline-offset-4 cursor-pointer"
            >
              ¿Olvidaste tu clave?
            </a>

            <!-- Al final del template de LoginView.vue (antes de cerrar </template>), agrega el modal: -->
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="showForgotModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Fondo translúcido -->
                <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md" @click="showForgotModal = false"></div>

                <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 relative z-10 text-left space-y-6">
                  <div class="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h3 class="text-xl font-black text-slate-800 tracking-tight uppercase">Restablecer Clave</h3>
                      <p class="text-xs text-slate-400 font-bold mt-0.5">Ingresa tu correo institucional y tu nueva contraseña</p>
                    </div>
                    <button @click="showForgotModal = false" class="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
                  </div>

                  <form @submit.prevent="handleResetPassword" class="space-y-4">
                    <div class="space-y-1.5">
                      <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                      <input
                        v-model="forgotForm.email"
                        type="email"
                        placeholder="ejemplo@medgo.com"
                        class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-medgo-blue outline-none transition-all"
                        required
                      />
                    </div>

                    <div class="space-y-1.5">
                      <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                      <input
                        v-model="forgotForm.nueva_password"
                        type="password"
                        placeholder="••••••••"
                        class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-medgo-blue outline-none transition-all"
                        required
                      />
                    </div>

                    <div class="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        @click="showForgotModal = false"
                        class="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        :disabled="resetLoading"
                        class="px-6 py-2.5 bg-medgo-blue hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        {{ resetLoading ? 'Actualizando...' : 'Cambiar Clave' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <div class="mt-8 space-y-5">
          <button
            type="submit"
            :disabled="loading"
            class="w-full group relative pt-2"
          >
            <div class="absolute inset-x-0 -bottom-1 h-full bg-black/15 rounded-2xl blur-[1px]"></div>
            <div
              :class="userType === 'paciente'
                ? 'bg-linear-to-r from-[#0077b6] via-[#00b4d8] to-[#12d3c7] hover:opacity-95 shadow-[0_8px_20px_rgba(0,180,216,0.35)]'
                : 'bg-linear-to-r from-[#0096c7] via-[#00c4cc] to-[#48cae4] hover:opacity-95 shadow-[0_8px_20px_rgba(0,196,204,0.35)]'"
              class="relative py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest active:translate-y-0.5 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span v-if="!loading">Entrar como {{ userType }}</span>
              <div v-else class="flex space-x-1">
                <div class="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          </button>

          <p class="text-center text-[13px] text-slate-500 font-bold pt-2">
            <template v-if="userType === 'paciente'">
              ¿No tienes una cuenta?
              <router-link to="/register" class="text-medgo-blue font-black hover:underline ml-1 underline-offset-4">
                Regístrate aquí
              </router-link>
            </template>
            <template v-else>
              ¿Eres profesional de la salud?
              <router-link to="/register-doctor" class="text-medgo-teal font-black hover:underline ml-1 underline-offset-4">
                Solicita tu alta médica
              </router-link>
            </template>
          </p>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const userType = ref('paciente');
const loading = ref(false);

const showForgotModal = ref(false);
const resetLoading = ref(false);
const forgotForm = reactive({
  email: '',
  nueva_password: ''
});

const form = reactive({
  email: '',
  password: ''
});

interface UserSessionData {
  id: number;
  email: string;
  rol_id: number;
  RolID?: number;
  entidad_id?: string | number;
  EntidadID?: string | number;
  tipo_entidad?: string;
  TipoEntidad?: string;
}

const handleLogin = async () => {
  if (!form.email || !form.password) return;
  loading.value = true;
  toast.clear();

  try {
    const result = await authStore.login(form) as unknown as { success: boolean; message?: string };

    if (result && result.success) {
      let role: number | undefined = undefined;
      let entidadId: number | null = null;
      let tipoEntidad: string = '';

      const localUserRaw = localStorage.getItem('user');

      if (localUserRaw) {
        const localUser = JSON.parse(localUserRaw) as UserSessionData;
        role = localUser.rol_id || localUser.RolID;
        const rawEntidadId = localUser.entidad_id || localUser.EntidadID;
        entidadId = rawEntidadId ? Number(rawEntidadId) : null;
        const rawTipo = localUser.tipo_entidad || localUser.TipoEntidad;
        tipoEntidad = rawTipo ? String(rawTipo).trim().toLowerCase() : '';
      } else {
        role = authStore.user?.rol_id;
        entidadId = authStore.user?.entidadId ? Number(authStore.user.entidadId) : null;
        tipoEntidad = authStore.user?.tipo_entidad ? String(authStore.user.tipo_entidad).trim().toLowerCase() : '';
      }

      switch (role) {
        case 1:
          if (!entidadId || entidadId === 1) {
            router.push('/dashboard');
          } else {
            if (tipoEntidad === 'laboratorio') {
              router.push('/laboratorio/dashboard');
            } else if (tipoEntidad === 'farmacia') {
              router.push('/farmacia/dashboard');
            } else {
              router.push('/clinica/dashboard');
            }
          }
          break;
        case 2:
          router.push('/medico/dashboard');
          break;
        case 3:
          router.push('/directorio');
          break;
        case 4:
          router.push('/farmacia/dashboard');
          break;
        case 5:
          router.push('/laboratorio/dashboard');
          break;
        default:
          router.push('/');
          break;
      }
    } else {
      const msg = result && 'message' in result ? result.message : 'Credenciales incorrectas.';
      setTimeout(() => { toast.error(msg, { timeout: 4000 }); }, 100);
    }
  } catch {
    setTimeout(() => { toast.error('Credenciales inválidas. Intente de nuevo.', { timeout: 4000 }); }, 100);
  } finally {
    setTimeout(() => { loading.value = false; }, 150);
  }
};
const handleResetPassword = async () => {
  if (!forgotForm.email || !forgotForm.nueva_password) return;
  resetLoading.value = true;

  try {
    const res = await authStore.changePassword({
      email: forgotForm.email,
      new_password: forgotForm.nueva_password
    });

    if (res.success) {
      toast.success(res.message);
      showForgotModal.value = false;
      forgotForm.email = '';
      forgotForm.nueva_password = '';
    } else {
      toast.error(res.message);
    }
  } catch {
    toast.error('Error de comunicación con el servidor.');
  } finally {
    resetLoading.value = false;
  }
};
</script>

<style scoped>
.contenedor-logo-3d {
  width: 96px;
  height: 96px;
  perspective: 1000px;
  /* Animación de flotado suave */
  animation: flotarImagen 4.5s ease-in-out infinite;
}

.logo-cuerpo-3d {
  width: 100%;
  height: 100%;
  border-radius: 26px;
  padding: 2px; /* Pequeño borde interno para resaltar la iluminación */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 100%);

  /* Sombras para dar profundidad y volumen real a la imagen */
  box-shadow:
    0 16px 32px rgba(0, 120, 160, 0.35),
    0 4px 8px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);

  /* Inclinación 3D */
  transform: rotateX(8deg) rotateY(-5deg);
  transform-style: preserve-3d;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

/* Efecto hover opcional: se endereza ligeramente cuando pasas el cursor */
.contenedor-logo-3d:hover .logo-cuerpo-3d {
  transform: rotateX(0deg) rotateY(0deg) scale(1.05);
  box-shadow:
    0 20px 40px rgba(0, 160, 200, 0.45),
    0 6px 12px rgba(0, 0, 0, 0.12);
}
.etiqueta-nuevo {
  top: -8px;
  right: -12px;
  background-color: #003666;
  color: white;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  letter-spacing: 0.12em;
  z-index: 10;
  transform: rotateZ(8deg);
}

@keyframes flotarImagen {
  0% {
    transform: translateY(0px) rotateX(8deg) rotateY(-5deg);
  }
  50% {
    transform: translateY(-10px) rotateX(12deg) rotateY(3deg);
  }
  100% {
    transform: translateY(0px) rotateX(8deg) rotateY(-5deg);
  }
}
</style>
