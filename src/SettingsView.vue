<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xs max-w-2xl mx-auto space-y-8 animate-fade-in text-left font-premium">

    <div class="space-y-4">
      <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
        <v-icon name="bi-translate" class="text-[#005596]" /> {{ t('settings.languageTitle', 'Idioma del Sistema') }}
      </h3>
      <p class="text-xs text-slate-400 font-bold">{{ t('settings.languageSubtitle', 'Seleccione su idioma de preferencia para toda la plataforma MedCore') }}</p>

      <div class="grid grid-cols-2 gap-4">
        <button
          @click="cambiarIdiomaSistema('es')"
          :class="locale === 'es' ? 'bg-sky-50 text-[#005596] border-2 border-[#005596] font-black' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 font-bold'"
          class="p-4 rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          🇭🇳 Español (ES)
        </button>
        <button
          @click="cambiarIdiomaSistema('en')"
          :class="locale === 'en' ? 'bg-sky-50 text-[#005596] border-2 border-[#005596] font-black' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 font-bold'"
          class="p-4 rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          🇺🇸 English (EN)
        </button>
      </div>
    </div>

    <hr class="border-slate-100" />

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
          ☀️ {{ locale === 'en' ? 'Light Mode' : 'Modo Claro' }}
        </button>

        <button
          @click="alternarModoOscuro(true)"
          :class="esOscuro ? 'bg-slate-800 text-white border-2 border-slate-600 font-black' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 font-bold'"
          class="p-4 rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          🌙 {{ locale === 'en' ? 'Dark Skin' : 'Modo Oscuro' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const esOscuro = ref(document.documentElement.classList.contains('p-dark') || document.documentElement.classList.contains('dark'));

// 🔍 CAMBIO DE IDIOMA SISTÉMICO GLOBAL
const cambiarIdiomaSistema = (nuevoIdioma: 'es' | 'en') => {
  locale.value = nuevoIdioma;
  localStorage.setItem('medcore_lang', nuevoIdioma);
};

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
</script>
