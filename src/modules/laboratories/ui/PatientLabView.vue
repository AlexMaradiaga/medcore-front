<template>
  <div class="space-y-8 animate-fade-in text-left font-sans select-none p-4 md:p-8 bg-[#f8fafc]">
    <div v-if="!mostrarComprobante" class="space-y-8">
      <!-- CABECERA DE BÚSQUEDA Y TÍTULO -->
      <div class="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-center gap-4 shadow-2xs">
        <div class="w-12 h-12 bg-[#005596] text-white rounded-2xl flex items-center justify-center text-xl shadow-xs">
          🧪
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-950 tracking-tight">Directorio de Laboratorios</h3>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Ordena exámenes y genera solicitudes digitales en tiempo real</p>
        </div>
      </div>

      <div class="relative max-w-xl">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar laboratorios o exámenes..."
          class="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 pl-12 outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#005596] transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
        />
        <v-icon name="bi-search" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div class="lg:col-span-2 space-y-10">
          <!-- LABORATORIOS DISPONIBLES (OBTENIDOS DE BASE DE DATOS) -->
          <div class="space-y-4">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Laboratorios Habilitados</h4>
            <div v-if="cargandoLaboratorios" class="text-xs font-bold text-slate-400 animate-pulse">
              Cargando laboratorios registrados...
            </div>
            <div v-else-if="laboratorios.length === 0" class="text-xs font-bold text-slate-400 italic">
              No hay laboratorios registrados en la red.
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="lab in laboratorios" :key="lab.EntidadID" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex items-start gap-4">
                <span class="text-2xl">🔬</span>
                <div>
                  <h5 class="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    {{ lab.NombreEntidad }}
                  </h5>
                  <p class="text-slate-400 text-[11px] font-bold mt-0.5">📍 {{ lab.Direccion || 'Sede Principal' }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="bg-blue-50 text-[#005596] font-black text-[9px] px-2 py-0.5 rounded-md">📞 {{ lab.Telefono || 'Atención en Línea' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FILTRO POR CATEGORÍAS -->
          <div class="space-y-3">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Categorías de Exámenes</h4>
            <div class="flex flex-wrap gap-2">
              <button
                @click="categoriaSeleccionada = 'Todos'"
                :class="categoriaSeleccionada === 'Todos' ? 'bg-[#005596] text-white' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'"
                class="px-4 py-2 rounded-xl text-xs font-black transition-colors shadow-3xs cursor-pointer"
              >
                Todos
              </button>
              <button
                v-for="cat in categoriasCalculadas" :key="cat"
                @click="categoriaSeleccionada = cat"
                :class="categoriaSeleccionada === cat ? 'bg-[#005596] text-white' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'"
                class="px-4 py-2 rounded-xl text-xs font-black transition-colors shadow-3xs cursor-pointer"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- LOTE DE EXÁMENES CON PRECIOS DESDE BD -->
          <div class="space-y-4">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Lote de Exámenes Analíticos</h4>
            <div v-if="cargando" class="py-12 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
              Sincronizando catálogo con base de datos...
            </div>
            <div v-else-if="examenesFiltrados.length === 0" class="py-8 text-center text-xs font-bold text-slate-400 uppercase">
              No hay exámenes que coincidan con la búsqueda.
            </div>
            <div v-else class="space-y-3">
              <label
                v-for="examen in examenesFiltrados"
                :key="examen.ExamID"
                class="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs flex items-center justify-between gap-4 cursor-pointer hover:border-blue-200 transition-all group select-none relative"
              >
                <div class="flex items-center gap-4">
                  <input
                    type="checkbox"
                    :value="examen"
                    v-model="carrito"
                    class="w-4 h-4 rounded-sm border-slate-300 text-[#005596] focus:ring-[#005596] cursor-pointer"
                  />
                  <div class="text-left">
                    <h5 class="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-[#005596] transition-colors">
                      {{ examen.NombreExamen }}
                    </h5>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="bg-slate-100 text-slate-500 font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">{{ examen.Categoria }}</span>
                      <span v-if="examen.CondicionesPaciente" class="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">⚠️ {{ examen.CondicionesPaciente }}</span>
                    </div>
                  </div>
                </div>
                <!-- PRECIO REAL EXTRAÍDO DE BASE DE DATOS -->
                <span class="text-base font-black text-blue-600">${{ Number(examen.Precio || 0).toFixed(2) }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- PANEL LATERAL DE SOLICITUD -->
        <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
          <div class="flex items-center gap-2 border-b border-slate-100 pb-4">
            <v-icon name="bi-file-earmark-medical" class="text-blue-500 h-5 w-5" />
            <div class="text-left">
              <h4 class="text-sm font-black text-slate-900 uppercase tracking-tight">Solicitud de Exámenes</h4>
              <p class="text-[11px] font-bold text-slate-400">{{ carrito.length }} exámenes agregados</p>
            </div>
          </div>
          <div class="space-y-4 text-left">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Paciente Asegurado *</label>
              <input
                type="text"
                v-model="formSolicitud.nombre"
                placeholder="Nombre completo"
                class="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Código de Expediente</label>
              <input
                type="text"
                v-model="formSolicitud.identificador"
                placeholder="Código o Identidad"
                class="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1 text-left">
            <p v-if="carrito.length === 0" class="text-xs text-slate-400 font-bold italic py-2">No has seleccionado exámenes en el catálogo.</p>
            <div v-for="item in carrito" :key="item.ExamID" class="bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
              <span class="font-bold text-slate-700 truncate max-w-45">{{ item.NombreExamen }}</span>
              <span class="font-black text-slate-900">${{ Number(item.Precio || 0).toFixed(2) }}</span>
            </div>
          </div>
          <div class="border-t border-slate-100 pt-4 flex justify-between items-center">
            <span class="text-xs font-black text-slate-800 uppercase tracking-wider">Total Estimado:</span>
            <span class="text-2xl font-black text-blue-600">${{ totalEstimado.toFixed(2) }}</span>
          </div>
          <button
            @click="procesarSolicitudDigital"
            :disabled="carrito.length === 0 || !formSolicitud.nombre"
            class="w-full bg-linear-to-r from-blue-600 to-[#005596] hover:brightness-105 disabled:brightness-90 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>+ Generar Solicitud Digital</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MOSTRAR COMPROBANTE CON CÓDIGO QR -->
    <div v-else class="max-w-2xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl space-y-6 animate-fade-in">
      <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2 text-left">
        <div class="flex items-center gap-2 text-slate-700 font-bold text-sm">
          <v-icon name="bi-person-fill" class="text-slate-400 h-4 w-4" />
          <span class="font-black text-[#005596] text-base">{{ solicitudProcesada.paciente }}</span>
          <span class="text-slate-400 text-xs font-medium">({{ solicitudProcesada.codigoExpediente || 'Sin Código' }})</span>
        </div>
        <div class="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <v-icon name="bi-calendar-event" class="h-3.5 w-3.5" />
          <span>{{ solicitudProcesada.fecha }}</span>
        </div>
      </div>

      <div class="text-left space-y-3">
        <h4 class="text-sm font-black text-slate-900 tracking-tight">Exámenes Solicitados ({{ solicitudProcesada.items.length }})</h4>
        <div class="border border-slate-100 rounded-2xl p-4 space-y-4 bg-white">
          <div v-for="(item, index) in solicitudProcesada.items" :key="item.ExamID" class="flex justify-between items-center pb-2 border-b border-slate-50 last:border-0 last:pb-0">
            <div class="text-left">
              <p class="text-xs font-black text-slate-800"><span class="text-slate-300 mr-1">{{ index + 1 }}.</span> {{ item.NombreExamen }}</p>
              <span class="bg-slate-100 text-slate-400 font-bold text-[8px] px-1.5 py-0.5 rounded-md uppercase tracking-wider mt-0.5 inline-block">{{ item.Categoria }}</span>
            </div>
            <span class="text-xs font-black text-blue-600">${{ Number(item.Precio || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center border-t border-slate-100 pt-4">
        <span class="text-sm font-black text-slate-800 uppercase tracking-wider">Total:</span>
        <span class="text-2xl font-black text-blue-600">${{ solicitudProcesada.total.toFixed(2) }}</span>
      </div>

      <div class="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
        <div class="bg-white p-4 rounded-2xl shadow-xs border border-slate-100">
          <img :src="qrDataUrl" alt="Código QR de la orden" class="w-44 h-44 object-contain" />
        </div>
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3">Código QR para escanear en el laboratorio</span>
      </div>

      <div class="space-y-3 pt-2">
        <button @click="mostrarComprobante = false; carrito = [];" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md">
          <v-icon name="bi-check-circle-fill" /> Finalizar y Volver al Directorio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { LaboratoryRepository } from '../infrastructure/LaboratoryRepository';
import type { CatalogoExamen } from '../domain/LaboratoryModels';
import api from '@/shared/infrastructure/api';
import * as QRCode from 'qrcode';

interface EntidadLaboratorio {
  EntidadID: number;
  NombreEntidad: string;
  Direccion?: string;
  Telefono?: string;
  TipoEntidad: string;
}

const repo = new LaboratoryRepository();
const toast = useToast();
const catalogos = ref<CatalogoExamen[]>([]);
const laboratorios = ref<EntidadLaboratorio[]>([]);
const carrito = ref<CatalogoExamen[]>([]);
const cargando = ref<boolean>(true);
const cargandoLaboratorios = ref<boolean>(true);
const busqueda = ref<string>('');
const categoriaSeleccionada = ref<string>('Todos');
const mostrarComprobante = ref<boolean>(false);
const qrDataUrl = ref<string>('');

const solicitudProcesada = ref({
  paciente: '',
  codigoExpediente: '',
  fecha: '',
  items: [] as CatalogoExamen[],
  total: 0
});

const formSolicitud = reactive({
  nombre: '',
  identificador: ''
});

// Categorías calculadas dinámicamente según la base de datos
const categoriasCalculadas = computed(() => {
  const cats = new Set(catalogos.value.map(item => item.Categoria));
  return Array.from(cats);
});

const examenesFiltrados = computed(() => {
  return catalogos.value.filter(ex => {
    const cumpleCat = categoriaSeleccionada.value === 'Todos' || ex.Categoria.toLowerCase() === categoriaSeleccionada.value.toLowerCase();
    const cumpleBusqueda = !busqueda.value || ex.NombreExamen.toLowerCase().includes(busqueda.value.toLowerCase());
    return cumpleCat && cumpleBusqueda;
  });
});

// Cálculo dinámico del total acumulado sumando el precio real
const totalEstimado = computed(() => {
  return carrito.value.reduce((acc, item) => acc + Number(item.Precio || 0), 0);
});

const cargarLaboratoriosPublicos = async () => {
  try {
    cargandoLaboratorios.value = true;
    const response = await api.get('/entidades-publicas');
    const data: EntidadLaboratorio[] = response.data || [];
    laboratorios.value = data.filter(e => e.TipoEntidad === 'Laboratorio');
  } catch (err) {
    console.error("Error al obtener laboratorios de la BD:", err);
  } finally {
    cargandoLaboratorios.value = false;
  }
};

const cargarCatalogoExamenes = async () => {
  try {
    cargando.value = true;
    const data = await repo.getCatalogo();
    catalogos.value = data || [];
  } catch (err) {
    console.error(err);
    toast.error("Error al sincronizar el catálogo de exámenes médicos.");
  } finally {
    cargando.value = false;
  }
};

const procesarSolicitudDigital = async () => {
  try {
    const ahora = new Date();
    solicitudProcesada.value = {
      paciente: formSolicitud.nombre,
      codigoExpediente: formSolicitud.identificador,
      fecha: ahora.toLocaleString('es-HN'),
      items: [...carrito.value],
      total: totalEstimado.value
    };
    const payloadQR = JSON.stringify({
      paciente: solicitudProcesada.value.paciente,
      expediente: solicitudProcesada.value.codigoExpediente,
      fecha: solicitudProcesada.value.fecha,
      total: solicitudProcesada.value.total,
      examenes: solicitudProcesada.value.items.map(i => i.ExamID)
    });
    qrDataUrl.value = await QRCode.toDataURL(payloadQR, { margin: 1, width: 250 });
    mostrarComprobante.value = true;
    toast.success("Solicitud digital preparada correctamente.");
  } catch (err) {
    console.error(err);
    toast.error("Fallo al construir la orden QR.");
  }
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user && user.nombre) {
    formSolicitud.nombre = user.nombre;
    formSolicitud.identificador = user.id ? `PAC-${user.id}` : '';
  }
  cargarLaboratoriosPublicos();
  cargarCatalogoExamenes();
});
</script>
