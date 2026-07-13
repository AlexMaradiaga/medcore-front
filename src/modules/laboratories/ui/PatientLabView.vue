<template>
  <div class="space-y-8 animate-fade-in text-left font-sans select-none p-4 md:p-8 bg-[#f8fafc]">

    <div v-if="!mostrarComprobante" class="space-y-8">
      <div class="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-center gap-4 shadow-2xs">
        <div class="w-12 h-12 bg-[#005596] text-white rounded-2xl flex items-center justify-center text-xl shadow-xs">
          🔬
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

          <div class="space-y-4">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Laboratorios Disponibles</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="lab in laboratorios" :key="lab.id" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex items-start gap-4">
                <span class="text-2xl">{{ lab.emoji }}</span>
                <div>
                  <h5 class="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    {{ lab.nombre }} <span class="text-emerald-500 text-[10px]">✔</span>
                  </h5>
                  <p class="text-slate-400 text-[11px] font-bold mt-0.5">📍 {{ lab.ubicacion }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="bg-blue-50 text-[#005596] font-black text-[9px] px-2 py-0.5 rounded-md">⏱ {{ lab.tiempo }}</span>
                    <span class="bg-emerald-50 text-emerald-700 font-black text-[9px] px-2 py-0.5 rounded-md">{{ lab.precioRango }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                v-for="cat in categorias" :key="cat"
                @click="categoriaSeleccionada = cat"
                :class="categoriaSeleccionada === cat ? 'bg-[#005596] text-white' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'"
                class="px-4 py-2 rounded-xl text-xs font-black transition-colors shadow-3xs cursor-pointer"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Lote de Exámenes Analíticos</h4>

            <div v-if="cargando" class="py-12 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
              Sincronizando catálogo con base de datos...
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
                <span class="text-base font-black text-blue-600">${{ obtenerPrecioSimulado(examen.ExamID) }}</span>
              </label>
            </div>
          </div>

        </div>

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
              <span class="font-black text-slate-900">${{ obtenerPrecioSimulado(item.ExamID) }}</span>
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
        <div class="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <v-icon name="bi-file-earmark-medical" class="h-3.5 w-3.5" />
          <span>Orden de Laboratorio Digital</span>
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
            <span class="text-xs font-black text-blue-600">${{ obtenerPrecioSimulado(item.ExamID) }}.00</span>
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
        <div class="grid grid-cols-2 gap-4">
          <button @click="descargarPDF" class="bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs">
            <v-icon name="bi-file-earmark-pdf-fill" /> Descargar PDF
          </button>
          <button @click="descargarQR" class="bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs">
            <v-icon name="bi-qr-code" /> Descargar QR
          </button>
        </div>

        <button @click="guardarEnExpediente" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md">
          <v-icon name="bi-check-circle-fill" /> Guardar en Expediente del Paciente
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

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import * as QRCode from 'qrcode';

// 1. Definimos una interfaz estricta local para mapear el objeto de fuentes de pdfmake sin usar any
interface PdfFontsObject {
  pdfMake?: {
    vfs: Record<string, string>;
  };
  vfs?: Record<string, string>;
}

interface PdfMakeCustomModule {
  vfs: Record<string, string>;
}

const fuentesValidadas = pdfFonts as unknown as PdfFontsObject;
let virtualFileSystem: Record<string, string> | undefined = undefined;

if (fuentesValidadas.pdfMake && fuentesValidadas.pdfMake.vfs) {
  virtualFileSystem = fuentesValidadas.pdfMake.vfs;
} else if (fuentesValidadas.vfs) {
  virtualFileSystem = fuentesValidadas.vfs;
}

if (virtualFileSystem) {
  (pdfMake as unknown as PdfMakeCustomModule).vfs = virtualFileSystem;
}

const repo = new LaboratoryRepository();
const toast = useToast();

const catalogos = ref<CatalogoExamen[]>([]);
const carrito = ref<CatalogoExamen[]>([]);
const cargando = ref<boolean>(true);
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

const laboratorios = [
  { id: 1, nombre: 'Laboratorio Clínico Integral', ubicacion: 'West Bay, Roatán', tiempo: '24 hrs', precioRango: '$10 - $150', emoji: '🧪' },
  { id: 2, nombre: 'BioLab Roatán', ubicacion: 'French Harbor, Roatán', tiempo: '48 hrs', precioRango: '$15 - $200', emoji: '🔬' }
];

const categorias = ['Hematología', 'Química Sanguínea', 'Hormonas', 'Microbiología', 'Inmunología'];

const obtenerPrecioSimulado = (id: number): number => {
  const precios: Record<number, number> = { 1: 25, 2: 15, 3: 20, 4: 10, 5: 45, 6: 15 };
  return precios[id] || 35;
};

const examenesFiltrados = computed(() => {
  return catalogos.value.filter(ex => {
    const cumpleCat = categoriaSeleccionada.value === 'Todos' || ex.Categoria.toLowerCase() === categoriaSeleccionada.value.toLowerCase();
    const cumpleBusqueda = !busqueda.value || ex.NombreExamen.toLowerCase().includes(busqueda.value.toLowerCase());
    return cumpleCat && cumpleBusqueda;
  });
});

const totalEstimado = computed(() => {
  return carrito.value.reduce((acc, item) => acc + obtenerPrecioSimulado(item.ExamID), 0);
});

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
    toast.error("Fallo al construir el nodo QR.");
  }
};

const descargarPDF = () => {
  const filasExamenes: TableCell[][] = solicitudProcesada.value.items.map((item, idx) => [
    { text: `${idx + 1}. ${item.NombreExamen}`, fontSize: 10, margin: [0, 4, 0, 4] },
    { text: item.Categoria, fontSize: 9, color: '#64748b', margin: [0, 4, 0, 4] },
    { text: `$${obtenerPrecioSimulado(item.ExamID)}.00`, fontSize: 10, alignment: 'right', margin: [0, 4, 0, 4] }
  ]);

  const encabezadoTabla: TableCell[] = [
    { text: 'Examen', bold: true },
    { text: 'Categoría', bold: true },
    { text: 'Precio', bold: true, alignment: 'right' }
  ];

  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: 'MEDGO+ GLOBAL - ORDEN DE LABORATORIO', style: 'header' },
      { text: `Paciente: ${solicitudProcesada.value.paciente}`, style: 'subheader' },
      { text: `Expediente: ${solicitudProcesada.value.codigoExpediente || 'No especificado'}`, style: 'meta' },
      { text: `Fecha: ${solicitudProcesada.value.fecha}`, style: 'meta' },
      { text: '\n' },
      {
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            encabezadoTabla,
            ...filasExamenes
          ]
        },
        layout: 'lightHorizontalLines'
      },
      { text: '\n' },
      { text: `TOTAL ESTIMADO: $${solicitudProcesada.value.total}.00`, bold: true, alignment: 'right', fontSize: 14, color: '#005596' },
      { text: '\n\n' },
      { image: qrDataUrl.value, alignment: 'center', width: 130 }
    ],
    styles: {
      header: { fontSize: 16, bold: true, color: '#005596', margin: [0, 0, 0, 10] },
      subheader: { fontSize: 12, bold: true, margin: [0, 0, 0, 4] },
      meta: { fontSize: 10, color: '#64748b' }
    }
  };

  pdfMake.createPdf(docDefinition).download(`Orden_Lab_${solicitudProcesada.value.paciente}.pdf`);
};

const descargarQR = () => {
  const link = document.createElement('a');
  link.href = qrDataUrl.value;
  link.download = `QR_Laboratorio_${solicitudProcesada.value.paciente}.png`;
  link.click();
};

const guardarEnExpediente = () => {
  toast.success("Orden analítica guardada en el historial local.");
  mostrarComprobante.value = false;
  carrito.value = [];
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user && user.nombre) {
    formSolicitud.nombre = user.nombre;
    formSolicitud.identificador = user.id ? `PAC-${user.id}` : '';
  }
  cargarCatalogoExamenes();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
