<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xs max-w-2xl mx-auto space-y-8 animate-fade-in text-left font-premium">

    <!-- SECCIÓN: CAMBIO DE IDIOMA -->
    <div class="space-y-4">
      <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
        <v-icon name="bi-translate" class="text-[#005596]" /> {{ t('settings.languageTitle') }}
      </h3>
      <p class="text-xs text-slate-400 font-bold">{{ t('settings.languageSubtitle') }}</p>

      <div class="grid grid-cols-2 gap-4">
        <button
          @click="cambiarIdiomaSistema('es')"
          :class="locale === 'es' ? 'bg-sky-50 text-[#005596] border-2 border-[#005596] font-black' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 font-bold'"
          class="p-4 rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          Español (ES)
        </button>
        <button
          @click="cambiarIdiomaSistema('en')"
          :class="locale === 'en' ? 'bg-sky-50 text-[#005596] border-2 border-[#005596] font-black' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 font-bold'"
          class="p-4 rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          English (EN)
        </button>
      </div>
    </div>

    <hr class="border-slate-100" />

    <!-- SECCIÓN: MODO DE PANTALLA (CLARO / OSCURO) -->
    <div class="space-y-4">
      <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
        <v-icon name="bi-moon-stars-fill" class="text-indigo-500" /> {{ locale === 'en' ? 'Display Mode' : 'Modo de Pantalla' }}
      </h3>
      <p class="text-xs text-slate-400 font-bold">
        {{ locale === 'en' ? 'Switch between light and dark skin for the platform' : 'Cambie entre la apariencia clara y oscura para la plataforma MedCore' }}
      </p>
      <div class="grid grid-cols-2 gap-4">
        <button
          @click="alternarModoOscuro(false)"
          :class="!esOscuro ? 'bg-sky-50 text-[#005596] border-2 border-[#005596] font-black' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 font-bold'"
          class="p-4 rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          {{ locale === 'en' ? 'Light Mode' : 'Modo Claro' }}
        </button>
        <button
          @click="alternarModoOscuro(true)"
          :class="esOscuro ? 'bg-slate-800 text-white border-2 border-slate-600 font-black' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 font-bold'"
          class="p-4 rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          {{ locale === 'en' ? 'Dark Skin' : 'Modo Oscuro' }}
        </button>
      </div>
    </div>

    <hr class="border-slate-100" />

    <!-- SECCIÓN NUEVA: PERSONALIZACIÓN DE TEMA BASE Y COLOR DE ACENTO -->
    <div class="space-y-4">
      <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
        <v-icon name="bi-palette-fill" class="text-teal-600" /> {{ t('settings.themeTitle') }}
      </h3>
      <p class="text-xs text-slate-400 font-bold">
        {{ t('settings.themeSubtitle') }}
      </p>

      <div class="space-y-3">
        <label for="theme-select" class="block text-xs font-bold text-slate-600">
          {{ t('settings.selectLabel') }}
        </label>
        <select
          id="theme-select"
          @change="cambiarTemaBase($event)"
          class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-[#005596] transition-all cursor-pointer"
        >
          <option value="mi-edicion">Mi Edición ({{ t('settings.themeDefault') }})</option>
          <option value="aura">Estilo Moderno (Aura Original)</option>
          <option value="lara">Estilo Corporativo (Lara)</option>
          <option value="nora">Estilo Elegante (Nora)</option>
        </select>
      </div>

      <!-- Paleta rápida de color de acento (Solo visible al elegir Aura, Lara o Nora) -->
      <div v-if="mostrarPaletaRapida" class="pt-2 space-y-2">
        <p class="text-xs font-bold text-slate-600">{{ t('settings.accentColor') }}</p>
        <div class="flex gap-3">
          <button
            @click="cambiarColor('#3B82F6')"
            class="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs hover:brightness-110 cursor-pointer"
          >
            Azul
          </button>
          <button
            @click="cambiarColor('#EC4899')"
            class="px-4 py-2 bg-pink-500 text-white rounded-xl text-xs font-bold shadow-xs hover:brightness-110 cursor-pointer"
          >
            Rosa
          </button>
          <button
            @click="cambiarColor('#10B981')"
            class="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs hover:brightness-110 cursor-pointer"
          >
            Verde
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePrimeVue } from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Lara from '@primevue/themes/lara';
import Nora from '@primevue/themes/nora';
import MiEdicionPreset from '@/theme/miEdicion';

const { t, locale } = useI18n();
const primevue = usePrimeVue();

const esOscuro = ref(document.documentElement.classList.contains('p-dark') || document.documentElement.classList.contains('dark'));
const mostrarPaletaRapida = ref(false);

// Cambio de idioma
const cambiarIdiomaSistema = (nuevoIdioma: 'es' | 'en') => {
  locale.value = nuevoIdioma;
  localStorage.setItem('medcore_lang', nuevoIdioma);
};

// Alternar tema claro / oscuro
const alternarModoOscuro = (activarDark: boolean) => {
  esOscuro.value = activarDark;
  const element = document.documentElement;
  if (activarDark) {
    element.classList.add('my-app-dark');
    element.classList.add('dark');
    localStorage.setItem('medcore_theme', 'dark');
  } else {
    element.classList.remove('my-app-dark');
    element.classList.remove('dark');
    localStorage.setItem('medcore_theme', 'light');
  }
};

// Cambiar preset del tema en PrimeVue
const cambiarTemaBase = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const seleccion = target.value;
  if (seleccion === 'mi-edicion') {
    primevue.config.theme.updatePreset(MiEdicionPreset);
    mostrarPaletaRapida.value = false;
  } else {
    mostrarPaletaRapida.value = true;
    if (seleccion === 'aura') primevue.config.theme.updatePreset(Aura);
    if (seleccion === 'lara') primevue.config.theme.updatePreset(Lara);
    if (seleccion === 'nora') primevue.config.theme.updatePreset(Nora);
  }
};

// Cambiar color primario/acento en PrimeVue
const cambiarColor = (nuevoColorHex: string) => {
  primevue.config.theme.setPrimary({
    500: nuevoColorHex
  });
};
</script>
