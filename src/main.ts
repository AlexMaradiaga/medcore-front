import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import MiEdicionPreset from './theme/miEdicion';
import 'primeicons/primeicons.css';

import VueApexCharts from "vue3-apexcharts";
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import i18n from '../src/i18n';

import { OhVueIcon as OhVueIconComponent, addIcons } from "oh-vue-icons";
import * as BiIcons from "oh-vue-icons/icons/bi";

import { RiBuildingFill, RiCapsuleFill, RiRocketFill, RiHospitalFill, RiStethoscopeLine } from "oh-vue-icons/icons/ri";

const Bi = Object.values({ ...BiIcons });

addIcons(...Bi, RiBuildingFill, RiCapsuleFill, RiRocketFill, RiHospitalFill, RiStethoscopeLine);

const app = createApp(App)

app.component("v-icon", OhVueIconComponent);

app.use(PrimeVue, {
    theme: {
        preset: MiEdicionPreset,
        options: {
            darkModeSelector: '.my-app-dark'
        }
    }
});

app.use(createPinia())
app.use(router)
app.use(VueApexCharts);
app.use(i18n);

app.use(Toast, {
    position: "top-right",
    timeout: 4000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false
});

app.mount('#app')
