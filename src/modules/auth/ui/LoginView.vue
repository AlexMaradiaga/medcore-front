<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-vibrante relative overflow-hidden font-sans">

    <div class="hidden lg:block absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full circulo-azul blur-[130px]"></div>
    <div class="hidden lg:block absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full circulo-teal blur-[130px]"></div>

    <div class="w-full h-screen sm:h-auto sm:max-w-md bg-white sm:rounded-[2.5rem] sm:shadow-[0_30px_70px_rgba(0,50,150,0.18)] overflow-hidden z-10 flex flex-col border border-gray-50/80 backdrop-blur-md">

      <div class="bg-medgo-gradient p-10 text-center text-white relative pt-14 pb-12">
        <div class="absolute inset-0 opacity-5 pointer-events-none">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
          </svg>
        </div>

        <div class="relative z-10 flex flex-col items-center">
          <div class="contenedor-icono-3d mb-6 relative">
            <div class="icono-cuerpo-3d">
              <div class="texto-med">Med</div>
              <div class="texto-go">Go+</div>
            </div>
          </div>

          <h2 class="text-3xl font-black tracking-tight drop-shadow-sm">
          Bienvenido a MedGo+
          </h2>
          <h3 class="text-blue-50/90 text-xs mt-3 font-semibold max-w-70 leading-relaxed">
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
            <a href="#" class="text-medgo-blue font-black hover:text-blue-800 transition-colors hover:underline underline-offset-4">
              ¿Olvidaste tu clave?
            </a>
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
              :class="userType === 'paciente' ? 'bg-medgo-blue hover:bg-blue-600 shadow-[0_8px_20px_rgba(0,102,204,0.3)]' : 'bg-medgo-teal hover:bg-cyan-600 shadow-[0_8px_20px_rgba(0,196,204,0.3)]'"
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
</script>

<style scoped>
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
  font-family: sans-serif;

  box-shadow:
    0 12px 24px rgba(0, 50, 150, 0.25),
    inset 0 4px 6px rgba(255, 255, 255, 0.45),
    inset 0 -6px 12px rgba(0, 0, 0, 0.18);

  transform: rotateX(8deg) rotateY(-4deg);
  transform-style: preserve-3d;
}

.texto-med {
  font-size: 21px;
  font-weight: 900;
  letter-spacing: -0.5px;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.texto-go {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.15);
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

@keyframes flotar {
  0% {
    transform: translateY(0px) rotateX(8deg) rotateY(-4deg);
  }
  50% {
    transform: translateY(-10px) rotateX(12deg) rotateY(2deg);
  }
  100% {
    transform: translateY(0px) rotateX(8deg) rotateY(-4deg);
  }
}
</style>
