<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-vibrante relative overflow-hidden font-sans">

    <div class="hidden lg:block absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full circulo-azul blur-[130px]"></div>
    <div class="hidden lg:block absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full circulo-teal blur-[130px]"></div>

    <div class="w-full h-screen sm:h-auto sm:max-w-md bg-white sm:rounded-[2.5rem] sm:shadow-[0_25px_60px_rgba(0,102,204,0.2)] overflow-hidden z-10 flex flex-col border-t sm:border border-gray-100">

      <div class="bg-medgo-gradient p-10 text-center text-white relative">
        <div class="absolute inset-0 opacity-5 pointer-events-none">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
          </svg>
        </div>

        <div class="relative z-10">
          <div class="inline-block bg-white/20 p-4 rounded-2xl mb-4 shadow-inner">
            <span class="text-3xl font-black tracking-tighter">M+</span>
          </div>
          <h2 class="text-3xl font-extrabold tracking-tight">Iniciar Sesión</h2>
          <p class="text-blue-50 text-sm mt-2 font-medium">Portal Médico Integral</p>
        </div>
      </div>

      <div class="flex p-2 bg-slate-50 mx-8 mt-6 rounded-2xl border border-slate-100">
        <button
          @click="userType = 'paciente'"
          :class="userType === 'paciente' ? 'bg-white text-medgo-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'"
          class="flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300"
        >
          Paciente
        </button>
        <button
          @click="userType = 'prestador'"
          :class="userType === 'prestador' ? 'bg-white text-medgo-teal shadow-sm' : 'text-slate-400 hover:text-slate-600'"
          class="flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300"
        >
          Prestador
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="p-8 space-y-6 flex-1">
        <div class="space-y-2">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Correo Electrónico</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="ejemplo@medgo.com"
            class="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue focus:ring-4 focus:ring-medgo-blue/5 outline-none transition-all text-slate-700 placeholder:text-slate-300"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue focus:ring-4 focus:ring-medgo-blue/5 outline-none transition-all text-slate-700 placeholder:text-slate-300"
            required
          />
        </div>

        <div class="flex items-center justify-between text-xs px-1">
          <label class="flex items-center text-slate-500 cursor-pointer group">
            <div class="relative flex items-center">
              <input type="checkbox" class="peer h-5 w-5 opacity-0 absolute cursor-pointer" />
              <div class="h-5 w-5 bg-slate-100 border border-slate-200 rounded-md peer-checked:bg-medgo-blue peer-checked:border-medgo-blue transition-all"></div>
              <svg class="h-3 w-3 text-white absolute left-1 hidden peer-checked:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <span class="ml-2 font-semibold group-hover:text-slate-700 transition-colors">Recordarme</span>
          </label>
          <a href="#" class="text-medgo-blue font-bold hover:text-blue-700 transition-colors">¿Olvidaste tu clave?</a>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full group relative pt-2"
        >
          <div class="absolute inset-x-0 -bottom-1 h-full bg-black/10 rounded-2xl"></div>
          <div :class="userType === 'paciente' ? 'bg-medgo-blue' : 'bg-medgo-teal'"
            class="relative py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest active:translate-y-0.5 transition-all flex items-center justify-center space-x-2">
            <span v-if="!loading">Entrar como {{ userType }}</span>
            <div v-else class="flex space-x-1">
               <div class="w-2 h-2 bg-white rounded-full animate-bounce"></div>
               <div class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
               <div class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        </button>

        <p class="text-center text-[13px] text-slate-400 font-medium pt-4">
          ¿No tienes una cuenta?
          <router-link to="/register" class="text-medgo-blue font-black hover:underline ml-1">
            Regístrate aquí
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const userType = ref('paciente');
const loading = ref(false);

const form = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  if (!form.email || !form.password) return;
  loading.value = true;

  try {
    const result = await authStore.login(form);

    if (result.success) {
      const user = authStore.user;
      const role = user?.rol_id;

      console.log("Login exitoso. Rol detectado:", role);

      switch (role) {
        case 1: // Si en tu DB el 1 es el Admin
          router.push('/dashboard');
          break;

        case 2: // Si en tu DB el 2 es el DOCTOR
          router.push('/medico/dashboard');
          break;

        case 3: // Si en tu DB el 3 es el Paciente
          router.push('/directorio');
          break;

        default:
          console.warn("Rol no reconocido, enviando a inicio");
          router.push('/');
          break;
      }
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error en redirección:", error);
  } finally {
    loading.value = false;
  }
};
</script>
