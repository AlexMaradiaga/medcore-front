<template>
  <DoctorLayout class="layout-medico-print">

    <main class="p-6 min-h-screen bg-slate-50/60 max-w-4xl mx-auto space-y-6 animate-fade-in text-left font-premium print:hidden">

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div class="text-left">
          <h2 class="text-xl font-black text-[#005596] tracking-tight uppercase flex items-center gap-2">
            <VIcon name="bi-file-earmark-medical" scale="1.1" /> Prescripción Médica
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button @click="compartirDocumentoFisico" :disabled="cargandoReceta || medicamentosPrescritos.length === 0 || procesandoFisico" class="h-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 rounded-xl font-black uppercase text-[9px] tracking-wider shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1 border-b-4 border-b-emerald-300 active:translate-y-0.5 active:border-b-0 disabled:opacity-40">
            <VIcon name="bi-share-fill" scale="0.8" /> Compartir
          </button>

          <button @click="descargarPdfDirecto" :disabled="cargandoReceta || medicamentosPrescritos.length === 0 || procesandoFisico" class="h-9 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3.5 rounded-xl font-black uppercase text-[9px] tracking-wider shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1 border-b-4 border-b-purple-300 active:translate-y-0.5 active:border-b-0 disabled:opacity-40">
            <VIcon name="bi-download" scale="0.8" /> Descargar
          </button>

          <button @click="imprimirDocumentoReceta" :disabled="cargandoReceta || medicamentosPrescritos.length === 0 || procesandoFisico" class="h-9 bg-cyan-50 hover:bg-cyan-100 text-[#005596] border border-cyan-200 px-3.5 rounded-xl font-black uppercase text-[9px] tracking-wider shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1 border-b-4 border-b-cyan-300 active:translate-y-0.5 active:border-b-0 disabled:opacity-40">
            <VIcon name="bi-printer-fill" scale="0.8" /> Imprimir
          </button>

          <button @click="finalizarYIrAlPago" class="h-9 bg-sky-400 hover:bg-sky-500 text-slate-900 px-4 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer border-b-4 border-b-sky-600 active:translate-y-0.5 active:border-b-0 flex items-center justify-center gap-1.5">
            <VIcon name="bi-check-circle-fill" scale="0.85" /> Finalizar
          </button>
        </div>
      </div>

      <div v-if="cargandoReceta" class="text-center py-32 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005596] mb-4"></div>
        <span class="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Cargando datos...</span>
      </div>

      <div v-else class="max-w-3xl mx-auto" id="contenedor-receta-pdf">
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 2rem; padding: 40px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden;" class="context-pdf-canvas">

          <div style="border-bottom: 4px solid #005596; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="text-align: left;">
              <span style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(to right, #ebf3fc, #f3effa, #eaf7ee); color: #005596; border: 1px solid #b3d1eb; padding: 6px 12px; border-radius: 0.75rem; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
                <VIcon name="bi-file-earmark-medical" scale="0.8" /> Receta Médica Autorizada
              </span>
              <h3 style="font-size: 18px; font-weight: 900; color: #1e293b; text-transform: uppercase; margin: 0; line-height: 1.2;">
                Dr. {{ nombreDoctor }}
              </h3>
              <p style="font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; margin-top: 4px;">
                Especialidad: <span style="color: #005596;">{{ doctorEspecialidad }}</span>
              </p>
            </div>
            <div style="text-align: right; font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase;">
              <div style="background-color: #f8fafc; padding: 6px 12px; border-radius: 0.75rem; border: 1px solid #e2e8f0; margin-bottom: 8px; color: #475569;">
                N° Colegiado: <span style="font-family: monospace;">{{ numeroColegiadoDoctor }}</span>
              </div>
              <p style="margin: 0;">Emisión: <span style="color: #334155;">{{ fechaActual }}</span></p>
              <p style="font-family: monospace; font-size: 9px; text-transform: lowercase; margin: 0;">ID: {{ segmentoRxSeguridad }}</p>
            </div>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col mb-6">
            <div class="bg-linear-to-r from-blue-500/15 via-blue-500/5 to-transparent border-b border-blue-100 px-6 py-3">
              <h4 class="text-xs font-black text-[#005596] uppercase tracking-widest flex items-center gap-2">
                <VIcon name="bi-person-badge-fill" scale="0.85" /> Información del Paciente Asignado
              </h4>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div class="space-y-1">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <VIcon name="bi-person-fill" scale="0.8" class="text-slate-400" /> Nombre Completo
                </p>
                <p class="text-sm font-black text-slate-800 uppercase tracking-tight">{{ nombrePaciente }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <VIcon name="bi-calendar-event" scale="0.8" class="text-slate-400" /> Edad
                </p>
                <p class="text-sm font-black text-slate-700 font-mono">{{ edadPaciente }} Años</p>
              </div>
              <div class="space-y-1">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <VIcon name="bi-telephone-fill" scale="0.8" class="text-slate-400" /> Teléfono
                </p>
                <p class="text-sm font-black text-slate-700 font-mono tracking-tight">{{ telefonoPaciente }}</p>
              </div>
            </div>
          </div>

          <!-- BLOQUE DE CITA DE SEGUIMIENTO PROGRAMADA (WEB RECETA) -->
          <div v-if="fechaSeguimiento" style="background-color: #f3e8ff; border: 1px solid #d8b4fe; border-left: 6px solid #9333ea; border-radius: 1rem; padding: 14px 20px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 11px; font-weight: 900; color: #581c87; text-transform: uppercase; display: flex; align-items: center; gap: 6px;">
              <VIcon name="bi-calendar-event" scale="0.9" /> Próxima Cita de Revisión / Seguimiento Programada
            </p>
            <p style="margin-top: 4px; margin-bottom: 0; font-size: 12px; font-weight: 700; color: #6b21a8;">
              El paciente debe regresar para evaluar la evolución de su tratamiento el día:
              <strong style="font-family: monospace; font-size: 13px; color: #3b0764; background-color: #ffffff; padding: 2px 8px; border-radius: 0.375rem; border: 1px solid #e9d5ff; margin-left: 4px;">{{ formatearFechaEspecifica(fechaSeguimiento) }}</strong>
            </p>
          </div>

          <div style="border: 1px solid #e2e8f0; border-radius: 1rem; overflow: hidden; margin-bottom: 32px;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead style="background-color: #e6eff7; border-bottom: 1px solid #ccdfef;">
                <tr>
                  <th style="padding: 16px; font-size: 10px; font-weight: 900; color: #005596; text-transform: uppercase;">#</th>
                  <th style="padding: 16px; font-size: 10px; font-weight: 900; color: #005596; text-transform: uppercase;">Medicamento</th>
                  <th style="padding: 16px; font-size: 10px; font-weight: 900; color: #005596; text-transform: uppercase;">Dosis</th>
                  <th style="padding: 16px; font-size: 10px; font-weight: 900; color: #005596; text-transform: uppercase;">Indicaciones Médicas de Consumo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(med, index) in medicamentosPrescritos" :key="index" style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 16px; font-size: 12px; color: #94a3b8;">{{ index + 1 }}</td>
                  <td style="padding: 16px;">
                    <div style="background-color: #eaf2f9; border: 1px solid #b3d1eb; padding: 6px 12px; border-radius: 0.75rem; color: #005596; font-size: 11px; font-weight: 900; text-transform: uppercase; width: fit-content;">
                      {{ med.NombreMedicamento }}
                    </div>
                  </td>
                  <td style="padding: 16px; font-size: 12px; font-weight: 900; color: #1e293b;">{{ med.Dosis }}</td>
                  <td style="padding: 16px; font-size: 12px; color: #64748b; font-style: italic;">{{ med.Indicaciones }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="display: flex; align-items: center; gap: 20px; text-align: left;">
              <img :src="urlQrVista" crossorigin="anonymous" style="width: 80px; height: 80px;" alt="QR" />
              <div style="max-width: 320px;">
                <p style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin: 0;">Validación Electrónica QR</p>
                <p style="font-size: 11px; font-weight: 900; color: #f59e0b; text-transform: uppercase; margin: 0; line-height: 1.2;">
                  Escanee este código para verificar la firma del especialista y mitigar alteraciones físicas en la receta.
                </p>
              </div>
            </div>
            <div style="text-align: center; width: 220px;">
              <div style="border-top: 1px solid #94a3b8; margin-bottom: 6px;"></div>
              <p style="font-size: 10px; font-weight: 900; color: #1e293b; text-transform: uppercase; margin: 0;">Dr. {{ nombreDoctor }}</p>
              <p style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 0;">Firma y Sello Autorizado</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- DOCUMENTO NATIVO PARA IMPRESIÓN FÍSICA -->
    <div class="hidden print:block w-full text-black font-sans bg-white p-0 text-left leading-normal">
      <div class="border-b-4 border-black pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold uppercase tracking-tight">Receta Médica Autorizada</h1>
          <h2 class="text-lg font-bold mt-1 uppercase">Dr. {{ nombreDoctor }}</h2>
          <p class="text-xs font-semibold tracking-wide">ESPECIALIDAD: {{ doctorEspecialidad }}</p>
        </div>
        <div class="text-right text-xs font-mono">
          <p><strong>COLEGIADO:</strong> {{ numeroColegiadoDoctor }}</p>
          <p><strong>EMISIÓN:</strong> {{ fechaActual }}</p>
          <p><strong>ID:</strong> {{ segmentoRxSeguridad }}</p>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-xs font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">I. Información del Paciente Asignado</h3>
        <table class="w-full text-xs border border-black text-left">
          <tbody>
            <tr>
              <td class="p-2 border border-black w-1/4 font-bold bg-slate-50">Nombre Completo:</td>
              <td class="p-2 border border-black font-bold uppercase" colspan="3">{{ nombrePaciente }}</td>
            </tr>
            <tr>
              <td class="p-2 border border-black w-1/4 font-bold bg-slate-50">Edad:</td>
              <td class="p-2 border border-black">{{ edadPaciente }} Años</td>
              <td class="p-2 border border-black w-1/4 font-bold bg-slate-50">Teléfono:</td>
              <td class="p-2 border border-black font-mono">{{ telefonoPaciente }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CITA DE SEGUIMIENTO IMPRESA -->
      <div v-if="fechaSeguimiento" class="mb-6 border border-black p-3 rounded bg-slate-50 text-xs">
        <p class="font-bold uppercase">⚠️ Próxima Cita de Revisión / Seguimiento Programada</p>
        <p class="mt-1 font-semibold">
          El paciente debe regresar para su cita de control el día: <strong class="font-mono text-sm underline">{{ formatearFechaEspecifica(fechaSeguimiento) }}</strong>
        </p>
      </div>

      <div class="mb-8">
        <h3 class="text-xs font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">II. Prescripción Médica</h3>
        <table class="w-full text-xs border border-black text-left">
          <thead>
            <tr class="bg-slate-100 font-bold">
              <th class="p-2 border border-black w-10 text-center">#</th>
              <th class="p-2 border border-black w-1/3">Medicamento / Presentación</th>
              <th class="p-2 border border-black w-1/4">Posología / Dosis</th>
              <th class="p-2 border border-black">Indicaciones Médicas de Consumo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(med, idx) in medicamentosPrescritos" :key="idx">
              <td class="p-2 border border-black text-center font-bold">{{ idx + 1 }}</td>
              <td class="p-2 border border-black font-bold uppercase">{{ med.NombreMedicamento }}</td>
              <td class="p-2 border border-black font-semibold">{{ med.Dosis }}</td>
              <td class="p-2 border border-black italic">{{ med.Indicaciones }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="page-break-inside: avoid; break-inside: avoid;" class="mt-10 flex justify-between items-end">
        <div class="flex items-center gap-4">
          <img :src="urlQrVista" crossorigin="anonymous" style="width: 110px; height: 110px;" alt="Código QR Validación" />
          <div class="max-w-xs text-left">
            <p class="text-[11px] font-bold uppercase">Validación Electrónica QR</p>
            <p class="text-[9px] mt-1 text-black">Escanee este código para verificar la firma del especialista y mitigar alteraciones físicas en la receta.</p>
          </div>
        </div>

        <div class="w-64 text-center">
          <div class="border-t border-black mb-1"></div>
          <p class="text-[11px] font-bold uppercase">Dr. {{ nombreDoctor }}</p>
          <p class="text-[9px] font-semibold uppercase tracking-widest mt-1">Firma y Sello Autorizado</p>
        </div>
      </div>
    </div>

    <div v-if="procesandoFisico" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="h-16 w-16 animate-spin rounded-full border-4 border-black border-t-[#00ff66] shadow-[0_0_15px_#00ff66]"></div>
      <p class="mt-4 font-mono text-sm tracking-widest text-[#00ff66] drop-shadow-[0_0_5px_#00ff66]">
        PROCESANDO DOCUMENTO ELECTRÓNICO...
      </p>
    </div>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import { useMedicalStore } from '@/stores/medicalStore';
import { DoctorRepository } from '../infrastructure/DoctorRepository';

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiPrinterFill, BiFileEarmarkMedical, BiShareFill, BiDownload,
  BiPersonFill, BiCalendarEvent, BiTelephoneFill, BiCheckCircleFill, BiPersonBadgeFill
} from 'oh-vue-icons/icons';

addIcons(
  BiPrinterFill, BiFileEarmarkMedical, BiShareFill, BiDownload,
  BiPersonFill, BiCalendarEvent, BiTelephoneFill, BiCheckCircleFill, BiPersonBadgeFill
);

interface ExtendedPdfMake {
  vfs: Record<string, string>;
  createPdf: (docDefinition: TDocumentDefinitions) => {
    download: (filename: string) => void;
    getBlob: (cb: (blob: Blob) => void) => void;
  };
}

interface FilaReceta {
  NombreMedicamento: string;
  Dosis: string;
  Indicaciones: string;
  CodigoCanje?: string;
}

const pdfMakeTyped = pdfMake as unknown as ExtendedPdfMake;
pdfMakeTyped.vfs = (pdfFonts as unknown as { vfs: Record<string, string> }).vfs;

const route = useRoute();
const router = useRouter();
const toast = useToast();
const medicalStore = useMedicalStore();
const repo = new DoctorRepository();

const medicamentosPrescritos = ref<FilaReceta[]>([]);
const cargandoReceta = ref<boolean>(true);
const procesandoFisico = ref<boolean>(false);
const pacienteBackup = ref({ nombre: '', edad: '', tel: '' });
const fechaSeguimiento = ref<string>('');

const nombrePaciente = computed(() => pacienteBackup.value.nombre || 'Paciente');
const edadPaciente = computed(() => pacienteBackup.value.edad || '---');
const telefonoPaciente = computed(() => pacienteBackup.value.tel || '---');

const doctorMapeado = computed<Record<string, unknown>>(() => {
  return (medicalStore.doctor || {}) as Record<string, unknown>;
});

const nombreDoctor = computed(() => {
  if (medicalStore.doctorFullName && medicalStore.doctorFullName !== 'Dr. Usuario' && medicalStore.doctorFullName !== 'Médico Especialista') {
    return medicalStore.doctorFullName;
  }
  const nombre = doctorMapeado.value.Nombre ? String(doctorMapeado.value.Nombre) : '';
  const apellido = doctorMapeado.value.Apellido ? String(doctorMapeado.value.Apellido) : '';
  return `${nombre} ${apellido}`.trim() || 'Carlos Villeda';
});

const doctorEspecialidad = computed(() => String(doctorMapeado.value.Especialidad || 'Medicina General'));
const numeroColegiadoDoctor = computed(() => String(doctorMapeado.value.NumeroColegiado || 'CMH-9482'));

const fechaActual = computed(() => new Date().toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' }));
const codigoCanjeReal = computed(() => medicamentosPrescritos.value[0]?.CodigoCanje || '111877DA-3EEB-6C48-05B6-36330CD1F136');
const segmentoRxSeguridad = computed(() => codigoCanjeReal.value.split('-').pop() || 'RX-SEC');

const urlQrVista = computed(() => {
  const payloadTexto = `MedGo+\nMedico: ${nombreDoctor.value}\nColegiacion: ${numeroColegiadoDoctor.value}\nRecetaID: ${codigoCanjeReal.value}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(payloadTexto)}&ecc=M`;
});

const formatearFechaEspecifica = (fechaRaw: string) => {
  if (!fechaRaw) return '--';
  try {
    const d = new Date(fechaRaw.replace(' ', 'T'));
    return d.toLocaleDateString('es-HN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return fechaRaw;
  }
};

const getBase64ImageFromUrl = async (url: string): Promise<string> => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result as string);
  });
};

const obtenerDefinicionPdf = (qrBase64: string): TDocumentDefinitions => {
  const def: TDocumentDefinitions = {
    pageSize: 'LETTER',
    pageMargins: [40, 40, 40, 40],
    content: [
      { text: 'RECETA MÉDICA AUTORIZADA', style: 'header' },
      { text: `Doctor: ${nombreDoctor.value}`, style: 'info' },
      { text: `Especialidad: ${doctorEspecialidad.value}`, style: 'info' },
      { text: `Nº Colegiado: ${numeroColegiadoDoctor.value}`, style: 'info', margin: [0, 0, 0, 20] },
      { text: 'INFORMACIÓN DEL PACIENTE', style: 'subheader' },
      {
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            ['Nombre', 'Edad', 'Teléfono'],
            [nombrePaciente.value, edadPaciente.value, telefonoPaciente.value]
          ]
        },
        margin: [0, 0, 0, 15]
      }
    ],
    styles: {
      header: { fontSize: 20, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5], decoration: 'underline' },
      info: { fontSize: 12, margin: [0, 2, 0, 2] }
    }
  };

  if (fechaSeguimiento.value) {
    (def.content as Array<unknown>).push({
      table: {
        widths: ['*'],
        body: [
          [{
            text: `⚠️ EL PACIENTE DEBE REGRESAR PARA SU CITA DE SEGUIMIENTO EL DÍA: ${formatearFechaEspecifica(fechaSeguimiento.value)}`,
            bold: true,
            fontSize: 10,
            fillColor: '#f3e8ff',
            color: '#581c87'
          }]
        ]
      },
      margin: [0, 0, 0, 15]
    });
  }

  (def.content as Array<unknown>).push(
    { text: 'MEDICAMENTOS PRESCRITOS', style: 'subheader' },
    {
      table: {
        widths: [20, 150, 100, '*'],
        body: [
          ['#', 'Medicamento', 'Dosis', 'Indicaciones'],
          ...medicamentosPrescritos.value.map((med, i) => [
            i + 1, med.NombreMedicamento, med.Dosis, med.Indicaciones
          ])
        ]
      },
      margin: [0, 0, 0, 30]
    },
    {
      table: {
        widths: ['auto', '*'],
        body: [
          [{ text: 'Validación Electrónica', style: 'subheader', colSpan: 2, margin: [0, 0, 0, 5] }, {}],
          [
            { image: qrBase64, width: 80, margin: [0, 5, 40, 0] },
            {
              margin: [70, 0, 0, 0],
              stack: [
                { text: '__________________________________', margin: [0, 30, 15, 5] },
                { text: 'DR. MÉDICO\nFIRMA Y SELLO AUTORIZADO', fontSize: 10, bold: true }
              ]
            }
          ],
          [{
            stack: [
              { text: `ID Seguridad: ${codigoCanjeReal.value}`, fontSize: 9, italics: true },
              { text: 'Escanee este código para verificar la firma del especialista y mitigar alteraciones físicas en la receta.', fontSize: 10, margin: [0, 10, 0, 5] },
            ],
            colSpan: 2,
            margin: [0, 5, 0, 0]
          }, {}]
        ]
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 0]
    }
  );

  return def;
};

onMounted(async () => {
  try {
    const idUrl = Number(route.params.id);
    const resGuardado = localStorage.getItem('MedGo+_resumen_compartir') || localStorage.getItem('medcore_resumen_compartir');

    if (resGuardado) {
      const d = JSON.parse(resGuardado);
      medicamentosPrescritos.value = d.detalle_medicamentos || [];
      pacienteBackup.value = { nombre: d.paciente || '', edad: d.edad || '', tel: d.telefono || '' };

      // 🟢 LECTURA LIMPIA DE LA VARIABLE ÚNICA ESTANDARIZADA
      fechaSeguimiento.value = d.fechaSeguimiento || '';
    }

    if (medicamentosPrescritos.value.length === 0 && idUrl > 0) {
      const res = await repo.getRecetaPorConsulta(idUrl);
      if (res.estado === 'success' && res.datos) {
        medicamentosPrescritos.value = res.datos;
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    cargandoReceta.value = false;
  }
});

const imprimirDocumentoReceta = async () => {
  procesandoFisico.value = true;
  await nextTick();
  setTimeout(() => {
    procesandoFisico.value = false;
    window.print();
  }, 800);
};

const descargarPdfDirecto = async () => {
  if (procesandoFisico.value) return;
  procesandoFisico.value = true;
  toast.info("Generando PDF...");
  try {
    const qrBase64 = await getBase64ImageFromUrl(urlQrVista.value);
    const docDefinition = obtenerDefinicionPdf(qrBase64);
    pdfMakeTyped.createPdf(docDefinition).download(`Receta_${nombrePaciente.value}.pdf`);
    toast.success("Receta descargada.");
  } catch (e) {
    console.error(e);
    toast.error("Error al procesar el PDF.");
  } finally {
    procesandoFisico.value = false;
  }
};

const compartirDocumentoFisico = async () => {
  if (procesandoFisico.value) return;
  procesandoFisico.value = true;
  try {
    const listadoMedicamentos = medicamentosPrescritos.value.map((med, i) =>
      `${i + 1}. 💊 *${med.NombreMedicamento.toUpperCase()}*\n   Dosis: ${med.Dosis}\n   Indicaciones: _${med.Indicaciones}_`
    ).join('\n\n');

    let textoCompartir =
      `🏥 *MedGo+* \n*PRESCRIPCIÓN MÉDICA AUTORIZADA*\n\n` +
      `👤 *Paciente:* ${nombrePaciente.value}\n👨‍⚕️ *Doctor:* ${nombreDoctor.value}\n📅 *Fecha:* ${fechaActual.value}\n\n`;

    if (fechaSeguimiento.value) {
      textoCompartir += `⚠️ *REVISIÓN / CITA DE SEGUIMIENTO (REGRESAR):* ${formatearFechaEspecifica(fechaSeguimiento.value)}\n\n`;
    }

    textoCompartir +=
      `📋 *MEDICAMENTOS:* \n\n${listadoMedicamentos}\n\n` +
      `------------------------------------------\n` +
      `🔐 *ID:* ${codigoCanjeReal.value}\n🌐 *Ver receta oficial:* \n${window.location.href}`;

    if (navigator.share) {
      await navigator.share({
        title: `Receta Médica - ${nombrePaciente.value}`,
        text: textoCompartir,
        url: window.location.href
      });
      toast.success("Menú abierto.");
    } else {
      await navigator.clipboard.writeText(textoCompartir);
      toast.success("Copiado al portapapeles.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    procesandoFisico.value = false;
  }
};

const finalizarYIrAlPago = () => {
  const idConsultaActual = route.params.id ? String(route.params.id) : '';

  if (!idConsultaActual) {
    toast.error("No se pudo recuperar el identificador de la consulta activa.");
    return;
  }

  window.localStorage.setItem('MedGo+_current_consulta_id', idConsultaActual);

  toast.success("Prescripción guardada. Procediendo al cierre de consulta.");

  router.push(`/medico/consulta/cierre/${idConsultaActual}`);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Inter:wght@400;600;800&display=swap');
.font-premium { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; }

.shadow-3xs { box-shadow: 0 1px 2px rgba(0,0,0,0.01); }
.shadow-2xs { box-shadow: 0 2px 6px rgba(0,0,0,0.03); }

.custom-scrollbar::-webkit-scrollbar { height: 5px; width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

@media print {
  :global(div[class*="fixed"]),
  :global(div[class*="sticky"]),
  :global(div[style*="position: fixed"]),
  :global(div[style*="position:fixed"]),
  :global(.fixed),
  :global(.sticky),
  :global(button[class*="rounded-full"]),
  :global([class*="floating"]),
  :global([class*="widget"]),
  :global([class*="gratis"]) {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    height: 0 !important;
    width: 0 !important;
  }

  * {
    -webkit-print-color-adjust: economy !important;
    print-color-adjust: economy !important;
    background-image: none !important;
    color: #000000 !important;
    background-color: #ffffff !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  @page {
    size: letter;
    margin: 10mm 15mm 10mm 15mm !important;
  }

  .layout-medico-print :deep(header),
  .layout-medico-print :deep(nav),
  .layout-medico-print :deep(aside),
  .layout-medico-print :deep(footer),
  div.fixed,
  div.sticky,
  button,
  iframe,
  a {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    opacity: 0 !important;
  }

  #contenedor-receta-pdf {
    display: block !important;
    width: 100% !important;
    max-height: 245mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
  }

  #contenedor-receta-pdf table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin-bottom: 8px !important;
  }

  #contenedor-receta-pdf th,
  #contenedor-receta-pdf td {
    border: 1px solid #000000 !important;
    padding: 6px 10px !important;
    color: #000000 !important;
  }

  #contenedor-receta-pdf th,
  #contenedor-receta-pdf th * {
    font-weight: bold !important;
  }

  #contenedor-receta-pdf div[style*="border-top: 1px solid #e2e8f0"],
  #contenedor-receta-pdf :deep(div[style*="border-top: 1px solid #e2e8f0"]) {
    display: block !important;
    border-top: 1px solid #000000 !important;
    margin-top: 15px !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}
</style>
