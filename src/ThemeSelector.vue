<template>
  <div class="theme-selector">
    <label for="theme-select">Personaliza tu interfaz: </label>

    <!-- El menú desplegable donde se incluye tu versión -->
    <select id="theme-select" @change="cambiarTemaBase($event)">
      <option value="mi-edicion">Mi Edición (Por defecto)</option>
      <option value="aura">Estilo Moderno (Aura Original)</option>
      <option value="lara">Estilo Corporativo (Lara)</option>
      <option value="nora">Estilo Elegante (Nora)</option>
    </select>

    <!-- Opciones de color rápido solo si eligen un tema estándar -->
    <div v-if="mostrarPaletaRapida" class="color-palette" style="margin-top: 10px;">
      <p>Modificar color de acento:</p>
      <button @click="cambiarColor('#3B82F6')" style="background: #3B82F6;">Azul</button>
      <button @click="cambiarColor('#EC4899')" style="background: #EC4899;">Rosa</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Lara from '@primevue/themes/lara';
import Nora from '@primevue/themes/nora';
import MiEdicionPreset from '@/theme/miEdicion'; // Importas tu diseño

const primevue = usePrimeVue();
const mostrarPaletaRapida = ref(false);

// SOLUCIÓN: Definimos 'event' como un tipo 'Event' global de HTML
const cambiarTemaBase = (event: Event) => {
  // Hacemos cast a HTMLSelectElement para que TypeScript sepa que tiene la propiedad .value
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

// SOLUCIÓN: Definimos 'nuevoColorHex' estrictamente como un 'string'
const cambiarColor = (nuevoColorHex: string) => {
  primevue.config.theme.setPrimary({
    500: nuevoColorHex
  });
};
</script>


<style scoped>
button {
  border: none;
  color: white;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 4px;
}
select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
