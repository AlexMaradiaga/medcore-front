<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6 font-premium animate-fade-in text-left">

    <div class="border-b border-slate-200 pb-4">
      <h2 class="text-2xl font-black text-slate-800 tracking-tight">Cierre de Consulta</h2>
      <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Gestión de pago y finalización</p>
    </div>

    <div class="border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-3xs bg-gradient-tornasol relative overflow-hidden backdrop-blur-xs">
      <div class="space-y-0.5 relative z-10">
        <h3 class="text-base font-black text-[#005596] uppercase tracking-tight">
          {{ pacienteNombreFiltrado }}
        </h3>
        <p class="text-xs text-slate-600 font-black uppercase tracking-wider">
          Consulta completada • {{ fechaActual }}
        </p>
      </div>
      <div class="text-right relative z-10">
        <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Monto Total</span>
        <span class="text-2xl font-black text-blue-600 tracking-tight bg-white/60 px-3 py-0.5 rounded-xl border border-white/40 shadow-3xs">
          $ {{ totalNeto.toFixed(0) }}
        </span>
      </div>
    </div>

    <div class="space-y-2.5">
      <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        <span>$</span> Ubicación de Pago
      </h4>
      <p class="text-xs text-slate-400 font-medium -mt-1">Seleccione dónde se realizará el pago</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          @click="cambiarUbicacionPago('app')"
          :class="[
            'p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 relative group cursor-pointer w-full bg-white',
            ubicacionPago === 'app'
              ? 'bg-blue-100 border-blue-400 text-blue-950 shadow-3xs scale-[1.01]'
              : 'bg-blue-50/40 border-blue-100/40 text-blue-700/70 hover:bg-blue-50/70'
          ]"
        >
          <div class="p-3 rounded-full transition-colors duration-300" :class="ubicacionPago === 'app' ? 'bg-blue-200/70' : 'bg-blue-100/50'">
            <VIcon name="bi-credit-card-fill" scale="1.3" :class="ubicacionPago === 'app' ? 'text-blue-800' : 'text-blue-500'" />
          </div>
          <span class="text-sm font-black tracking-tight">Pago por App</span>
          <span class="text-xs font-bold" :class="ubicacionPago === 'app' ? 'text-blue-800/70' : 'text-blue-600/60'">Enlace o QR digital inmediato</span>

          <div v-if="ubicacionPago === 'app'" class="absolute bottom-3 text-blue-600 animate-scale-up">
            <VIcon name="bi-check-circle-fill" scale="0.95" />
          </div>
        </button>

        <button
          @click="cambiarUbicacionPago('clinic')"
          :class="[
            'p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 relative group cursor-pointer w-full bg-white',
            ubicacionPago === 'clinic'
              ? 'bg-purple-100 border-purple-400 text-purple-950 shadow-3xs scale-[1.01]'
              : 'bg-purple-50/40 border-purple-100/40 text-purple-700/70 hover:bg-purple-50/70'
          ]"
        >
          <div class="p-3 rounded-full transition-colors duration-300" :class="ubicacionPago === 'clinic' ? 'bg-purple-200/70' : 'bg-purple-100/50'">
            <VIcon name="bi-building" scale="1.3" :class="ubicacionPago === 'clinic' ? 'text-purple-800' : 'text-purple-500'" />
          </div>
          <span class="text-sm font-black tracking-tight">Pago en Clínica</span>
          <span class="text-xs font-bold" :class="ubicacionPago === 'clinic' ? 'text-purple-800/70' : 'text-purple-600/60'">Caja física en recepción</span>

          <div v-if="ubicacionPago === 'clinic'" class="absolute bottom-3 text-purple-600 animate-scale-up">
            <VIcon name="bi-check-circle-fill" scale="0.95" />
          </div>
        </button>
      </div>
    </div>

    <div v-if="ubicacionPago === 'clinic'" class="bg-amber-50 border border-amber-200/70 rounded-2xl p-5 space-y-2 text-left animate-fade-in">
      <div class="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-wider">
        <VIcon name="bi-exclamation-circle-fill" scale="0.95" /> Gestión Pendiente en Recepción
      </div>
      <p class="text-xs text-amber-700 font-medium leading-relaxed">
        El cobro se procesará manualmente en la recepción del centro médico. Se generará una orden interna para el libro de caja diaria.
      </p>
    </div>

    <div class="space-y-2.5">
      <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        <span>📋</span> Método de Pago
      </h4>
      <p class="text-xs text-slate-400 font-medium -mt-1">Seleccione el canal físico o digital a procesar</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          @click="metodoPago = 'card'"
          :class="[
            'p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 cursor-pointer text-left w-full bg-white',
            metodoPago === 'card' ? 'bg-blue-100 border-blue-400 text-blue-950 font-black shadow-3xs' : 'bg-blue-50/40 border-blue-100/40 text-blue-700/70 hover:bg-blue-50/60'
          ]"
        >
          <div class="w-2 h-2 rounded-full transition-colors" :class="metodoPago === 'card' ? 'bg-blue-700' : 'bg-blue-400'"></div>
          <VIcon name="bi-credit-card-fill" scale="1" :class="metodoPago === 'card' ? 'text-blue-800' : 'text-slate-400'" />
          <div class="flex flex-col">
            <span class="text-xs font-black uppercase tracking-wide">Tarjeta</span>
            <span class="text-[10px] font-bold text-slate-400">POS o Link API</span>
          </div>
        </button>

        <button
          @click="metodoPago = 'cash'"
          :class="[
            'p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 cursor-pointer text-left w-full bg-white',
            metodoPago === 'cash' ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black shadow-3xs' : 'bg-emerald-50/40 border-emerald-100/40 text-emerald-700/70 hover:bg-emerald-50/60'
          ]"
        >
          <div class="w-2 h-2 rounded-full transition-colors" :class="metodoPago === 'cash' ? 'bg-emerald-700' : 'bg-emerald-400'"></div>
          <VIcon name="bi-cash-coin" scale="1" :class="metodoPago === 'cash' ? 'text-emerald-800' : 'text-slate-400'" />
          <div class="flex flex-col">
            <span class="text-xs font-black uppercase tracking-wide">Efectivo</span>
            <span class="text-[10px] font-bold text-slate-400">Pago en ventanilla</span>
          </div>
        </button>

        <button
          @click="metodoPago = 'transfer'"
          :class="[
            'p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 cursor-pointer text-left w-full bg-white',
            metodoPago === 'transfer' ? 'bg-sky-100 border-sky-400 text-sky-950 font-black shadow-3xs' : 'bg-sky-50/40 border-sky-100/40 text-sky-700/70 hover:bg-sky-50/60'
          ]"
        >
          <div class="w-2 h-2 rounded-full transition-colors" :class="metodoPago === 'transfer' ? 'bg-sky-700' : 'bg-sky-400'"></div>
          <VIcon name="bi-bank" scale="1" :class="metodoPago === 'transfer' ? 'text-sky-800' : 'text-slate-400'" />
          <div class="flex flex-col">
            <span class="text-xs font-black uppercase tracking-wide">Transferencia</span>
            <span class="text-[10px] font-bold text-slate-400">Banca en Línea HN</span>
          </div>
        </button>
      </div>
    </div>

    <div v-if="metodoPago !== ''" class="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4 animate-fade-in">

      <div v-if="metodoPago === 'cash'" class="space-y-4">
        <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2.5">
          <VIcon name="bi-person-check-fill" class="text-emerald-600" scale="1.1" />
          <p class="text-xs font-bold text-emerald-800">
            Recibiendo caja física para: <span class="uppercase font-black text-emerald-950">{{ pacienteNombreFiltrado }}</span>
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Monto Recibido</label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-xs font-bold text-slate-400">$</span>
              <input type="number" v-model.number="montoRecibido" placeholder="0.00" class="w-full pl-8 pr-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cambio a Entregar</label>
            <div class="px-4 py-2 bg-white border border-slate-200 rounded-xl h-8.5 flex items-center justify-between">
              <span class="text-xs font-bold text-slate-400">$</span>
              <span :class="['text-xs font-black', cambioCalculado >= 0 ? 'text-blue-600' : 'text-rose-500']">{{ cambioCalculado.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="metodoPago === 'card' && ubicacionPago === 'app'" class="space-y-4 animate-fade-in">
        <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2.5">
          <VIcon name="bi-phone-vibrate" class="text-blue-600 animate-pulse" scale="1.1" />
          <p class="text-xs font-bold text-blue-800">
            API de Cobro Cifrado: <span class="font-black text-blue-950">Opcional: ingresá el número para chat directo, o dejalo vacío para buscarlo en WhatsApp</span>
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div class="space-y-1.5 sm:col-span-2">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Número Telefónico del Paciente (Opcional)</label>
            <input type="text" v-model="pacienteCelularLink" placeholder="Ej. 94558822 (O dejar vacío)" class="w-full px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500" />
          </div>
          <button @click="dispararCobroAPI" class="w-full py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer hover:bg-blue-700 h-8.5 transition-all border-b-2 border-blue-800">
            Generar QR de Cobro
          </button>
        </div>
      </div>

      <div v-else-if="metodoPago === 'card' && ubicacionPago === 'clinic'" class="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
        <div class="space-y-1.5 sm:col-span-2">
          <div class="p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-center gap-2.5">
            <VIcon name="bi-building" class="text-purple-600" scale="1.1" />
            <p class="text-xs font-bold text-purple-800">
              Registro de Auditoría Interna: <span class="uppercase font-black text-purple-950">Datáfono / POS de Recepción</span>
            </p>
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Código de Autorización (Voucher Físico)</label>
          <input type="text" v-model="tarjetaAuthCode" placeholder="Ej. 842105" class="w-full px-4 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-purple-500" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Adquirente de Terminal (Honduras)</label>
          <select v-model="tarjetaBancoPOS" class="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-purple-500">
            <option value="BAC">BAC Credomatic</option>
            <option value="BANPAIS">Banpaís Conecta</option>
            <option value="ATLANTIDA">Banco Atlántida</option>
            <option value="FICOHSA">Ficohsa Express</option>
          </select>
        </div>
      </div>

      <div v-else-if="metodoPago === 'transfer'" class="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
        <div class="space-y-1.5 sm:col-span-2">
          <div class="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-center gap-2.5">
            <VIcon name="bi-bank" class="text-sky-600" scale="1.1" />
            <p class="text-xs font-bold text-sky-800">
              Registro de Depósito Directo: <span class="uppercase font-black text-sky-950">Verificación de Banca Electrónica</span>
            </p>
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Número de Referencia de Transferencia</label>
          <input type="text" v-model="transferenciaRef" placeholder="Ej. TXN-94820148" class="w-full px-4 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Banco Receptor (Cuenta de la Clínica)</label>
          <select v-model="transferenciaBanco" class="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500">
            <option value="BAC">BAC Credomatic</option>
            <option value="ATLANTIDA">Banco Atlántida</option>
            <option value="FICOHSA">Banco Ficohsa</option>
            <option value="BANPAIS">Banpaís</option>
            <option value="OCCIDENTE">Banco de Occidente</option>
          </select>
        </div>
      </div>
    </div>

    <div id="comprobante-visual" class="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
      <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider border-b pb-2 border-slate-100">
        Resumen de Consulta
      </h4>

      <div class="space-y-3 text-xs font-medium text-slate-600">
        <div class="flex justify-between border-b border-slate-50 pb-2">
          <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Paciente:</span>
          <span class="font-black text-slate-800 uppercase">{{ pacienteNombreFiltrado }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-50 pb-2">
          <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Fecha:</span>
          <span class="font-bold text-slate-700">{{ fechaActual }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-50 pb-2">
          <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Hora:</span>
          <span class="font-mono text-slate-700">{{ horaActual }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-50 pb-2">
          <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Ubicación de Pago:</span>
          <span class="font-black text-slate-700 uppercase">{{ ubicacionPago === 'app' ? 'Por App' : 'En Clínica' }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-50 pb-2">
          <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Método Seleccionado:</span>
          <span class="font-black text-slate-700 uppercase">
            {{ metodoPago === 'card' ? 'Tarjeta' : metodoPago === 'cash' ? 'Efectivo' : metodoPago === 'transfer' ? 'Transferencia Bancaria' : 'Ninguno' }}
          </span>
        </div>
        <div class="flex justify-between items-center pt-2 font-black text-sm">
          <span class="text-slate-800 uppercase tracking-wide">Total:</span>
          <span class="text-xl font-black text-blue-600 bg-blue-50/50 px-3 py-1 rounded-lg border border-blue-100 shadow-3xs">
            $ {{ totalNeto.toFixed(2) }} USD
          </span>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-slate-200">
      <div class="flex items-center gap-2.5">
        <button @click="descargarReportePdf" title="Descargar Reporte PDF" class="h-9 w-11 bg-blue-50 hover:bg-blue-100 text-[#005596] border border-blue-200 rounded-xl transition-all cursor-pointer flex items-center justify-center border-b-4 border-b-blue-300 shadow-[0_0_12px_rgba(0,85,150,0.15)] active:translate-y-0.5 active:border-b-0">
          <VIcon name="bi-download" scale="0.9" />
        </button>
        <button @click="compartirReporteCanal" title="Compartir Comprobante PDF por WhatsApp" class="h-9 w-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center justify-center border-b-4 border-b-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] active:translate-y-0.5 active:border-b-0">
          <VIcon name="bi-share-fill" scale="0.85" />
        </button>
      </div>

      <div class="flex items-center gap-2.5">
        <button @click="cancelarCierre" class="h-9 px-4 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center border-b-4 border-b-slate-300 active:translate-y-0.5 active:border-b-0">
          Cancelar
        </button>
        <button @click="finalizarCierreConsulta" class="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_4px_12px_rgba(16,185,129,0.25)] border-b-4 border-b-emerald-800 active:translate-y-0.5 active:border-b-0 flex items-center justify-center gap-1.5 cursor-pointer">
          <VIcon name="bi-check-circle-fill" scale="0.85" /> Cerrar Consulta
        </button>
      </div>
    </div>

    <div v-if="mostrarQrModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
      <div class="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-5 border border-slate-100 transform scale-100 transition-all">
        <div class="space-y-1">
          <h3 class="font-black text-lg text-slate-800 tracking-tight">Código QR de Cobro</h3>
          <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">MedGo+ Cobros Digitales</p>
        </div>

        <div class="flex justify-center p-3 bg-slate-50 border border-slate-100 rounded-2xl shadow-3xs">
          <img v-if="qrGenerado" :src="qrGenerado" alt="QR de Pago Clínico" class="w-60 h-60 object-contain" />
        </div>

        <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-left space-y-1">
          <span class="text-[10px] font-black text-blue-800 uppercase tracking-wider block">Resumen de Transacción</span>
          <div class="flex justify-between text-xs font-bold text-slate-600">
            <span>ID Consulta:</span> <span class="font-black text-slate-800">#{{ billingDataLocal.consultationId }}</span>
          </div>
          <div class="flex justify-between text-xs font-bold text-slate-600">
            <span>Total a Cobrar:</span> <span class="font-black text-blue-700">$ {{ totalNeto.toFixed(2) }} USD</span>
          </div>
        </div>

        <button @click="mostrarQrModal = false" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-b-4 border-b-slate-950 active:translate-y-0.5 active:border-b-0">
          Cerrar Ventana
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useMedicalStore } from '@/stores/medicalStore';
import * as QRCode from 'qrcode';

import { ApiPagoRepository } from '../../infrastructure/ApiPagoRepository';
import type { PagoPayload } from '../../domain/Pago';

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiCreditCard2FrontFill, BiCreditCardFill, BiBuilding, BiCheckCircleFill,
  BiCashCoin, BiExclamationCircleFill, BiDownload, BiShareFill, BiPersonCheckFill, BiPhoneVibrate, BiBank
} from 'oh-vue-icons/icons';

addIcons(
  BiCreditCard2FrontFill, BiCreditCardFill, BiBuilding, BiCheckCircleFill,
  BiCashCoin, BiExclamationCircleFill, BiDownload, BiShareFill, BiPersonCheckFill, BiPhoneVibrate, BiBank
);

interface PdfMakeCustomInstance {
  getBlob(callback: (blob: Blob) => void): void;
  download(defaultFileName?: string): void;
}

interface NavigatorShare {
  canShare?: (data: ShareData) => boolean;
  share?: (data: ShareData) => Promise<void>;
}

interface MedicalStoreState {
  currentConsultaId?: string | number;
  currentPatientName?: string;
  patientFullName?: string;
  token?: string;
}

const vfsFonts = pdfFonts as unknown as { pdfMake?: { vfs: Record<string, string> }; vfs: Record<string, string> };
const pdfMakeContext = pdfMake as unknown as { vfs: Record<string, string> };
pdfMakeContext.vfs = vfsFonts.pdfMake ? vfsFonts.pdfMake.vfs : vfsFonts.vfs;

const router = useRouter();
const route = useRoute();
const toast = useToast();
const medicalStore = useMedicalStore();
const pgoRepository = new ApiPagoRepository();

const qrGenerado = ref<string>('');
const mostrarQrModal = ref<boolean>(false);

const billingDataLocal = ref({
  consultationId: '',
  citaId: 0,
  servicioId: 0,
  patientName: '',
  basePrice: 0.00
});

const medicoNombre = ref('');
const ubicacionPago = ref<'app' | 'clinic'>('app');
const metodoPago = ref<'card' | 'cash' | 'transfer' | ''>('card');
const montoRecibido = ref<number | ''>('');
const discount = ref(0);
const extras = ref(0);
const pacienteCelularLink = ref('');

const tarjetaAuthCode = ref('');
const tarjetaBancoPOS = ref('BAC');
const transferenciaRef = ref('');
const transferenciaBanco = ref('BAC');

const pacienteNombreFiltrado = computed<string>(() => {
  const storeCasteado = medicalStore as unknown as MedicalStoreState;
  return String(storeCasteado.currentPatientName || storeCasteado.patientFullName || billingDataLocal.value.patientName || 'Cargando...');
});

const fechaActual = computed(() => {
  const hoy = new Date();
  return `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
});

const horaActual = computed(() => {
  return new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit', hour12: false });
});

const subtotal = computed(() => billingDataLocal.value.basePrice);
const totalNeto = computed(() => Math.max(0, subtotal.value + extras.value - discount.value));

const cambioCalculado = computed(() => {
  if (!montoRecibido.value || montoRecibido.value < totalNeto.value) return 0;
  return montoRecibido.value - totalNeto.value;
});

const cambiarUbicacionPago = (target: 'app' | 'clinic') => {
  ubicacionPago.value = target;
  if (target === 'app' && metodoPago.value === 'transfer') {
    metodoPago.value = 'card';
  }
};

const dispararCobroAPI = async (): Promise<void> => {
  if (!billingDataLocal.value.consultationId) {
    toast.error("Datos contables inconsistentes para procesar pasarela.");
    return;
  }

  const payloadCripto = JSON.stringify({
    plataforma: 'MedGo+',
    consulta_id: billingDataLocal.value.consultationId,
    monto_total: totalNeto.value,
    fecha_emision: fechaActual.value
  });

  try {
    qrGenerado.value = await QRCode.toDataURL(payloadCripto, {
      margin: 2,
      width: 300
    });
    mostrarQrModal.value = true;
    toast.success("¡QR de cobro generado!");
  } catch (err: unknown) {
    console.error("Fallo de renderizado QR:", err);
    toast.error("Ocurrió un error en la renderización del código QR.");
  }
};

onMounted(async () => {
  const store = medicalStore as unknown as MedicalStoreState;
  const idCitaFinal = String(route.params['id'] || window.localStorage.getItem('MedGo+_current_consulta_id') || store.currentConsultaId || '');

  if (!idCitaFinal) {
    toast.error("Identificador de cita no encontrado.");
    router.push('/medico/dashboard');
    return;
  }

  try {
    const res = await pgoRepository.obtenerDetalleFacturacion(idCitaFinal);

    const precioParseado = Number(res.PrecioActual);
    billingDataLocal.value = {
      consultationId: String(res.ConsultaID),
      citaId: res.CitaID,
      servicioId: res.ServicioID,
      patientName: res.NombrePaciente,
      basePrice: precioParseado > 0 ? precioParseado : 50
    };
    medicoNombre.value = res.NombreMedico;
    pacienteCelularLink.value = res.CelularPaciente || res.CellularPaciente || "";
  } catch (error) {
    console.error("Fallo de inicialización contable con cliente API:", error);
    toast.error("Error al cargar la información de facturación.");
  }
});

const construirDocumentoDef = (): TDocumentDefinitions => {
  const metodoMapeado = metodoPago.value === 'card'
    ? `Tarjeta (POS: ${tarjetaBancoPOS.value})`
    : metodoPago.value === 'cash'
      ? 'Efectivo Arqueado'
      : metodoPago.value === 'transfer'
        ? `Transferencia (${transferenciaBanco.value})`
        : 'Pendiente';

  const definicionRaw: unknown = {
    content: [
      { text: 'MedGo+', fontSize: 24, bold: true, color: '#005596', alignment: 'center' },
      { text: 'COMPROBANTE DE CAJA OFICIAL', fontSize: 10, bold: true, color: '#94a3b8', alignment: 'center', margin: [0, 2, 0, 15] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, strokeColor: '#e2e8f0' }] },
      { text: 'DETALLE DE LA TRANSACCIÓN', fontSize: 11, bold: true, color: '#1e293b', margin: [0, 15, 0, 10] },
      {
        table: {
          widths: [150, '*'],
          body: [
            [{ text: 'ID Consulta:', bold: true, color: '#64748b' }, { text: `#${billingDataLocal.value.consultationId}` }],
            [{ text: 'Paciente:', bold: true, color: '#64748b' }, { text: pacienteNombreFiltrado.value.toUpperCase(), bold: true }],
            [{ text: 'Fecha Emisión:', bold: true, color: '#64748b' }, { text: fechaActual.value }],
            [{ text: 'Hora Registro:', bold: true, color: '#64748b' }, { text: horaActual.value }],
            [{ text: 'Ubicación de Caja:', bold: true, color: '#64748b' }, { text: ubicacionPago.value === 'app' ? 'Pasarela Digital' : 'Ventanilla Clínica' }],
            [{ text: 'Método de Pago:', bold: true, color: '#64748b' }, { text: metodoMapeado }]
          ]
        },
        layout: 'noBorders'
      },
      { text: '', margin: [0, 15] },
      {
        table: {
          widths: ['*', 120],
          body: [
            [
              { text: 'TOTAL PROCESADO (USD):', bold: true, fontSize: 12, alignment: 'right', margin: [0, 5] },
              { text: `$ ${totalNeto.value.toFixed(2)}`, bold: true, fontSize: 14, color: '#005596', alignment: 'center', backgroundColor: '#f0fdf4', margin: [0, 5] }
            ]
          ]
        },
        layout: { hLineColor: () => '#e2e8f0', vLineColor: () => '#e2e8f0' }
      },
      { text: '✓ Transacción Validada Exitosamente en el Libro de Caja', fontSize: 10, bold: true, color: '#10b981', alignment: 'center', margin: [0, 30, 0, 0] }
    ],
    defaultStyle: { fontSize: 11, color: '#334155' }
  };

  return definicionRaw as TDocumentDefinitions;
};

const descargarReportePdf = (): void => {
  const pdfDoc = pdfMake.createPdf(construirDocumentoDef()) as unknown as PdfMakeCustomInstance;
  pdfDoc.download(`Comprobante_MedGo+_#${billingDataLocal.value.consultationId}.pdf`);
  toast.success("¡PDF descargado con éxito!");
};

const compartirReporteCanal = async (): Promise<void> => {
  toast.info("Abriendo canal de WhatsApp...");

  const textoMensaje = `
*MedGo+ - COMPROBANTE DE COBRO*
---------------------------------------
*ID Consulta:* #${billingDataLocal.value.consultationId}
*Paciente:* ${pacienteNombreFiltrado.value.toUpperCase()}
*Fecha:* ${fechaActual.value}
*Hora:* ${horaActual.value}
*Canal:* ${ubicacionPago.value === 'app' ? 'Digital App' : 'Caja General'}
*Método:* ${metodoPago.value === 'card' ? 'Tarjeta' : metodoPago.value === 'cash' ? 'Efectivo' : 'Transferencia'}
---------------------------------------
*TOTAL PROCESADO:* $ ${totalNeto.value.toFixed(2)} USD
---------------------------------------
_Estado: Transacción Validada Exitosamente._
  `.trim();

  const celularLimpio = pacienteCelularLink.value.replace(/\D/g, '');
  const urlWhatsApp = celularLimpio
    ? `https://api.whatsapp.com/send?phone=${celularLimpio}&text=${encodeURIComponent(textoMensaje)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(textoMensaje)}`;

  try {
    await navigator.clipboard.writeText(textoMensaje);
    const nuevaVentana = window.open(urlWhatsApp, '_blank');

    const pdfLib = pdfMakeContext as unknown as { createPdf: (def: TDocumentDefinitions) => { getBase64: (cb: (base64: string) => void) => void; download: (name: string) => void } };
    const pdfDocInstance = pdfLib.createPdf(construirDocumentoDef());
    const nombreArchivo = `Comprobante_Consulta_${billingDataLocal.value.consultationId}.pdf`;

    pdfDocInstance.getBase64((base64String: string) => {
      try {
        const byteCharacters = atob(base64String);
        const byteArray = Uint8Array.from(byteCharacters, (_, i) => byteCharacters.charCodeAt(i));
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const archivoPdf = new window.File([blob], nombreArchivo, { type: 'application/pdf' });

        const navRecord = navigator as unknown as NavigatorShare;
        const payloadCompartir: ShareData = {
          files: [archivoPdf],
          title: 'Comprobante MedGo+',
          text: textoMensaje
        };

        if (navRecord.canShare && navRecord.share && navRecord.canShare(payloadCompartir)) {
          navRecord.share(payloadCompartir)
            .then(() => {
              toast.success("¡Comprobante compartido!");
            })
            .catch((e: unknown) => {
              console.warn("Compartición nativa cancelada, ejecutando Plan B:", e);
              if (nuevaVentana) window.open(urlWhatsApp, '_blank');
            });
        } else {
          pdfDocInstance.download(nombreArchivo);
          toast.success("¡Texto copiado al portapapeles y PDF listo!");
        }
      } catch (innerError) {
        console.warn("Flujo secundario de PDF saltado, WhatsApp principal activo.", innerError);
      }
    });

  } catch (error: unknown) {
    console.error("Error crítico en el botón de compartir:", error);
    window.open(urlWhatsApp, '_blank');
    toast.success("Redirigiendo al canal de comunicación.");
  }
};

const cancelarCierre = () => { router.back(); };

const finalizarCierreConsulta = async (): Promise<void> => {
  let refFinal = "Pago en Caja";
  if (metodoPago.value === 'card' && ubicacionPago.value === 'clinic')
    refFinal = `POS ${tarjetaBancoPOS.value} - Auth: ${tarjetaAuthCode.value}`;
  if (metodoPago.value === 'transfer')
    refFinal = `Ref: ${transferenciaRef.value} (${transferenciaBanco.value})`;

  const payload: PagoPayload = {
    cita_id: Number(billingDataLocal.value.citaId),
    servicio_id: Number(billingDataLocal.value.servicioId) || 1,
    monto: Number(totalNeto.value),
    metodo: metodoPago.value as 'cash' | 'card' | 'transfer',
    referencia: refFinal
  };

  try {
    await pgoRepository.procesarPago(payload);
    toast.success("Consulta cerrada oficialmente y transada.");
    router.push("/medico/dashboard");
  } catch (error) {
    console.error("Error en el flujo de infraestructura:", error);
    toast.error("Error al procesar el cierre contable.");
  }
};
</script>
