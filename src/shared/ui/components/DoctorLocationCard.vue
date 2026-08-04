<template>
  <div class="flex items-center justify-between gap-3 w-full">

    <div class="flex flex-wrap gap-2">
      <span
        v-if="esVerdadero(doctor.HablaIngles)"
        class="bg-sky-50 text-sky-700 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase border border-sky-200/60 shadow-xs"
      >
        Inglés
      </span>
      <span
        v-if="esVerdadero(doctor.DisponibleDomicilio)"
        class="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase border border-emerald-200/60 shadow-xs"
      >
        Visitas a Domicilio
      </span>
    </div>

    <button
      @click="abrirMapaRuta"
      type="button"
      class="bg-linear-to-b from-white to-slate-100 border border-slate-200/80 text-[#005596] font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shrink-0 shadow-xs hover:shadow-md transition-all active:scale-95"
    >
      <v-icon name="bi-geo-alt-fill" class="text-rose-500 animate-bounce" />
      <span>{{ distanciaCalculada }} km</span>
    </button>

    <!-- MODAL CON MAPA EN PERSPECTIVA 3D -->
    <Teleport to="body">
      <div
        v-if="verMapa"
        class="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4"
        style="margin: 0; top: 0; left: 0; width: 100vw; height: 100vh;"
      >
        <div class="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl relative z-10000 border border-slate-100">

          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <h3 class="font-black text-slate-800 uppercase text-sm tracking-wide">
                Dr. {{ doctor.Apellido }}
              </h3>
            </div>
            <button
              @click="verMapa = false"
              type="button"
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- CONTENEDOR DEL MAPA CON PERSPECTIVA Y EFECTO 3D -->
          <div class="map-3d-wrapper rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
            <div id="mapaRuta" class="h-84 w-full"></div>
          </div>

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-bold text-slate-500 pt-1">
            <span class="truncate max-w-md text-slate-600">
              📍 {{ doctor.DireccionConsultorio || 'Consultorio Médico' }}
            </span>
            <a
              :href="`https://www.google.com/maps/dir/?api=1&destination=${doctor.Latitud},${doctor.Longitud}`"
              target="_blank"
              class="bg-[#005596] hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-wider transition-all shrink-0 shadow-md"
            >
              Abrir en Google Maps →
            </a>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { calcularDistanciaKm } from '../../infrastructure/geo';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface DoctorLocation {
  Nombre: string;
  Apellido: string;
  Especialidad: string;
  HablaIngles?: boolean | number | string | null;
  DisponibleDomicilio?: boolean | number | string | null;
  Latitud?: number | null;
  Longitud?: number | null;
  DireccionConsultorio?: string | null;
}

const props = defineProps<{
  doctor: DoctorLocation;
  userLat: number;
  userLon: number;
}>();

const verMapa = ref(false);

// VALIDACIÓN DE DATOS (Filtra de forma estricta los valores de la BD)
const esVerdadero = (val: unknown): boolean => {
  return val === true || val === 1 || val === '1' || val === 'true';
};

const distanciaCalculada = computed(() => {
  if (!props.doctor.Latitud || !props.doctor.Longitud) return 'N/A';
  return calcularDistanciaKm(props.userLat, props.userLon, Number(props.doctor.Latitud), Number(props.doctor.Longitud));
});

const abrirMapaRuta = async () => {
  if (!props.doctor.Latitud || !props.doctor.Longitud) return;

  verMapa.value = true;
  await nextTick();

  const mapContainer = document.getElementById('mapaRuta');
  if (!mapContainer) return;

  mapContainer.innerHTML = '';

  const lat = Number(props.doctor.Latitud);
  const lon = Number(props.doctor.Longitud);

  const map = L.map('mapaRuta', {
    zoomControl: true,
  }).setView([lat, lon], 16);

  // Capa híbrida/satelital con relieve para experiencia tipo 3D
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri Satellite 3D',
    maxZoom: 19
  }).addTo(map);

  // Capa de etiquetas y calles superpuesta
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map);

  // Marcador personalizable para el doctor
  L.marker([lat, lon])
    .addTo(map)
    .bindPopup(`<b>Dr. ${props.doctor.Nombre} ${props.doctor.Apellido}</b><br>${props.doctor.DireccionConsultorio || ''}`)
    .openPopup();

  // Marcador de tu ubicación
  if (props.userLat && props.userLon) {
    L.marker([props.userLat, props.userLon]).addTo(map).bindPopup('Tu Ubicación');
  }

  setTimeout(() => map.invalidateSize(), 200);
};
</script>

<style scoped>
.map-3d-wrapper {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.map-3d-wrapper #mapaRuta {
  transform: rotateX(22deg) scale(1.05);
  transition: transform 0.4s ease;
  transform-origin: center center;
}

.map-3d-wrapper:hover #mapaRuta {
  transform: rotateX(10deg) scale(1);
}
</style>
