# medgo-front

Plataforma de Gestión Médica e Historial Clínico Unificado **MedGo+ Frontend**, desarrollada con **Vue 3**, **Vite**, **TypeScript** y **Tailwind CSS**.

## Configuración Recomendada de IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desactivar Vetur).

## Configuración Recomendada del Navegador

- Navegadores basados en Chromium (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Activar Custom Object Formatter en Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Activar Custom Object Formatter en Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Soporte de Tipos para Archivos `.vue` en TypeScript

TypeScript no procesa información de tipos para archivos `.vue` de forma nativa, por lo que reemplazamos el CLI de `tsc` con `vue-tsc` para la verificación de tipos. En el editor se utiliza [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para habilitar el servicio de lenguaje TypeScript en componentes `.vue`.

## Configuración de Vite

Consulte la [Referencia de Configuración de Vite](https://vite.dev/config/).

## Instalación y Ejecución

```sh
# Instalación de dependencias
npm install

# Compilación y recarga en vivo para desarrollo
npm run dev

# Verificación de tipos, compilación y minificación para producción
npm run build

# Análisis de código con ESLint
npm run lint