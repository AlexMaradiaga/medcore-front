<template>
  <div class="space-y-8 animate-fade-in text-left font-premium select-none">

    <div class="flex justify-between items-end border-b border-slate-100 pb-5">
      <div>
        <h2 class="text-4xl font-black text-[#005596] uppercase tracking-tight flex items-center gap-3">
          <v-icon :name="viewMode === 'recetas' ? 'bi-credit-card-fill' : 'bi-folder-fill'" scale="1.6" class="text-[#005596]" />
          {{ viewMode === 'recetas' ? 'Mi Historial de Recetas' : 'Mi Historial Clínico' }}
        </h2>
        <p class="text-slate-500 font-medium italic mt-1">
          {{ viewMode === 'recetas' ? 'Consulte sus recetas médicas y folios digitales prescritos en tiempo real' : 'Consulte sus consultas previas, exámenes físicos y recetas prescritas en tiempo real' }}
        </p>
      </div>
    </div>

    <div class="flex gap-2 border-b border-slate-200/60 pb-0">
      <button
        v-for="subTab in filtradosSubTabs" :key="subTab.id"
        @click="activeSubTab = subTab.id"
        :class="activeSubTab === subTab.id ? 'text-[#005596] border-b-4 border-[#005596] font-black' : 'text-slate-400 font-bold hover:text-slate-600'"
        class="px-6 pb-4 uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center gap-2"
      >
        <v-icon v-if="subTab.id === 'consultas'" name="bi-calendar-event" scale="0.9" />
        <v-icon v-else-if="subTab.id === 'examenes'" name="bi-file-earmark-text-fill" scale="0.9" />
        <v-icon v-else-if="subTab.id === 'recetas'" name="bi-credit-card-fill" scale="0.9" />
        {{ subTab.label }}
      </button>
    </div>

    <div v-if="loading" class="py-24 text-center flex justify-center items-center">
      <OrbsLoader />
    </div>

    <div v-else class="mt-8">

      <div v-if="activeSubTab === 'consultas'" class="space-y-6">
        <div v-if="history.length === 0" class="text-center py-16 bg-white border border-slate-100 rounded-[2.5rem] text-slate-400 font-black uppercase text-xs tracking-widest flex flex-col items-center justify-center gap-3">
          <v-icon name="bi-exclamation-circle-fill" scale="2.0" class="text-slate-300" />
          No cuenta con consultas médicas registradas en su expediente.
        </div>

        <div v-else class="relative border-l-2 border-slate-200 ml-4 md:ml-32 space-y-12 py-4">
          <div
            v-for="(item, idx) in history"
            :key="item.CitaID"
            class="relative flex flex-col md:flex-row items-start gap-6 animate-fade-in"
          >
            <div class="hidden md:block absolute -left-32 top-1.5 w-24 text-right">
              <p class="text-xs font-black text-[#005596] uppercase tracking-wider leading-none">
                {{ item.FechaHora.split(' ')[0] }}
              </p>
              <p class="text-[10px] text-slate-400 font-bold mt-1">
                {{ item.FechaHora.split(' ')[1] || '00:00' }} HS
              </p>
            </div>

            <div
              :class="item.EstadoCita?.toLowerCase() === 'completada' ? 'bg-emerald-500 ring-emerald-100' : 'bg-amber-500 ring-amber-100'"
              class="absolute -left-2.25 top-1.5 w-4 h-4 rounded-full ring-4 z-10 transition-all duration-300"
            ></div>

            <div
              :class="idx % 2 === 0 ? 'border-l-4 border-l-[#005596]' : 'border-l-4 border-l-cyan-500'"
              class="bg-white p-6 rounded-4xl border border-slate-100 shadow-xs flex-1 grid grid-cols-1 md:grid-cols-4 items-center gap-6 ml-4 hover:shadow-md hover:border-slate-200/80 transition-all duration-300 w-full"
            >
              <div class="md:col-span-3 flex items-center gap-5">
                <div class="w-14 h-14 bg-sky-50 text-[#005596] rounded-2xl flex items-center justify-center border border-sky-100/60 shrink-0">
                  <v-icon name="bi-people-fill" scale="1.4" />
                </div>
                <div class="space-y-1 text-left">
                  <span class="md:hidden bg-slate-100 text-slate-500 font-black text-[9px] uppercase px-2 py-0.5 rounded-md tracking-wider block max-w-max mb-1">
                    {{ item.FechaHora }}
                  </span>
                  <h4 class="text-lg font-black text-slate-800 tracking-tight">Dr. {{ item.Doctor }}</h4>
                  <p class="text-blue-600 font-black text-xs uppercase tracking-wide">
                    {{ item.Especialidad || 'Especialista Verificado' }}
                  </p>
                  <p class="text-slate-400 text-[11px] font-bold flex items-center gap-1">
                    <v-icon name="bi-building" scale="0.75" /> {{ item.Clinica }}
                  </p>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row md:flex-col justify-end items-stretch md:items-end gap-3 w-full md:col-span-1">
                <span
                  :class="item.EstadoCita?.toLowerCase() === 'completada' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'"
                  class="text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest text-center shadow-3xs"
                >
                  {{ item.EstadoCita || 'Pendiente' }}
                </span>

                <div class="flex flex-col gap-2 w-full">
                  <button
                    @click="showDetail(item)"
                    class="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <v-icon name="bi-search" scale="0.8" /> Ver Notas
                  </button>

                  <div v-if="item.EstadoCita?.toLowerCase() === 'completada'" class="flex gap-2 w-full">
                    <button
                      @click="descargarHistorialPdf(item)"
                      title="Descargar Comprobante Clínico"
                      class="flex-1 h-9 bg-blue-50 hover:bg-blue-100 text-[#005596] border border-blue-200 rounded-xl transition-all cursor-pointer flex items-center justify-center border-b-4 border-b-blue-300 active:translate-y-0.5 active:border-b-0"
                    >
                      <v-icon name="bi-download" scale="0.85" />
                    </button>
                    <button
                      @click="compartirHistorialWhatsApp(item)"
                      title="Compartir por WhatsApp"
                      class="flex-1 h-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center justify-center border-b-4 border-b-emerald-300 active:translate-y-0.5 active:border-b-0"
                    >
                      <v-icon name="bi-share-fill" scale="0.8" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <div v-if="activeSubTab === 'examenes'" class="space-y-8">
        <div v-if="exams.length === 0" class="text-center py-16 bg-white border border-slate-100 rounded-[2.5rem] text-slate-400 font-black uppercase text-xs tracking-widest flex flex-col items-center justify-center gap-3">
          <v-icon name="bi-exclamation-circle-fill" scale="2.0" class="text-slate-300" />
          No se registran evaluaciones de examen físico por sistemas.
        </div>

        <div v-else class="space-y-8">
          <section class="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl space-y-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-white"><v-icon name="bi-bank" scale="5.0" /></div>

            <div class="border-b border-slate-800 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 relative z-10">
              <div>
                <h3 class="text-lg font-black text-blue-400 uppercase tracking-tight flex items-center gap-2">
                  Análisis de Evolución Médica
                  <div class="group relative inline-block text-slate-400 hover:text-white cursor-help normal-case">
                    <v-icon name="bi-exclamation-circle-fill" scale="0.85" />
                    <div class="pointer-events-none opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 text-slate-200 text-[11px] font-bold p-4 rounded-xl shadow-2xl border border-slate-700 transition-all duration-300 z-50 space-y-2 leading-relaxed">
                      <p class="text-blue-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1">Leyenda del Historial</p>
                      <p class="text-slate-300">• <span class="text-green-400 font-black">N</span> = Estado Normal / Saludable.</p>
                      <p class="text-slate-300">• <span class="text-red-400 font-black">A</span> = Anormal / Hallazgo Clínico.</p>
                      <p class="pt-1 text-slate-400 font-medium border-t border-slate-700/50 mt-1">El system evalúa de izquierda a derecha el progreso de sus últimas 3 consultas médicas.</p>
                    </div>
                  </div>
                </h3>
                <p class="text-slate-400 text-xs font-bold">Métrica comparativa automática basada en sus últimas 3 evaluaciones</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div v-for="sistema in metricasEvolutivas" :key="sistema.nombre" class="bg-slate-800/50 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-inner">
                <div>
                  <p class="text-xs font-black uppercase text-slate-400 tracking-wider">Sistema {{ sistema.nombre }}</p>
                  <p class="text-[10px] text-slate-500 font-bold mt-1">Tendencia de salud actual</p>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <span :class="sistema.status === 'mejora' ? 'bg-green-500/10 text-green-400 border-green-500/20' : sistema.status === 'empeoro' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'" class="px-3 py-1 rounded-lg text-xs font-black border uppercase tracking-widest">
                    {{ sistema.status === 'mejora' ? '🟢 Mejoró' : sistema.status === 'empeoro' ? '🔴 Empeoró' : '🔵 Estable' }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">Historial: {{ sistema.recorrido }}</span>
                </div>
              </div>
            </div>
          </section>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="exam in examenesPaginados" :key="exam.ExamenSistemaID" class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center animate-fade-in hover:shadow-md transition-all duration-300">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center border border-teal-100/50 shrink-0">
                    <v-icon name="bi-file-earmark-text-fill" scale="1.3" />
                  </div>
                  <div class="text-left">
                    <p class="text-base font-black text-slate-800 leading-none uppercase tracking-tight">Sistema {{ exam.SistemaID }}</p>
                    <p class="text-[10px] text-slate-400 font-bold mt-1.5 uppercase">Dr. {{ exam.Doctor }} • {{ exam.FechaHora }}</p>
                    <span :class="exam.EsNormal === 1 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'" class="inline-block text-[9px] font-black px-2 py-0.5 rounded-md border mt-2 uppercase tracking-wider">
                      {{ exam.EsNormal === 1 ? '✅ Normal' : '⚠️ Hallazgo Clínico' }}
                    </span>
                  </div>
                </div>
                <button @click="verDetalleSistema(exam)" class="p-3 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-xl transition-all cursor-pointer text-sm font-bold flex items-center justify-center">
                  <v-icon name="bi-search" scale="0.9" />
                </button>
              </div>
            </div>

            <div v-if="totalPaginasExams > 1" class="flex justify-center items-center gap-4 pt-4">
              <button @click="paginaExams--" :disabled="paginaExams === 1" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer shadow-3xs">Anterior</button>
              <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Página {{ paginaExams }} de {{ totalPaginasExams }}</span>
              <button @click="paginaExams++" :disabled="paginaExams === totalPaginasExams" class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer shadow-3xs">Siguiente</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeSubTab === 'recetas'" class="space-y-8">
        <div v-if="prescriptions.length === 0" class="text-center py-16 bg-white border border-slate-100 rounded-[2.5rem] text-slate-400 font-black uppercase text-xs tracking-widest flex flex-col items-center justify-center gap-3">
          <v-icon name="bi-exclamation-circle-fill" scale="2.0" class="text-slate-300" />
          No cuenta con folios de recetas emitidos en sus atenciones.
        </div>

        <div v-else class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              v-for="receta in recetasPaginadas"
              :key="receta.RecetaID"
              class="bg-linear-to-b from-white to-slate-50/40 border border-slate-100 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-200/60 transition-all duration-300 relative overflow-hidden"
            >
              <div class="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-[#005596] to-cyan-500"></div>

              <div class="space-y-5">
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-linear-to-br from-blue-50 to-indigo-50/50 text-[#005596] rounded-xl flex items-center justify-center text-xl shadow-xs border border-blue-100/40 shrink-0">
                      <v-icon name="bi-credit-card-fill" scale="1.1" />
                    </div>
                    <div class="text-left">
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">Prescripción</span>
                      <h3 class="text-lg font-black text-slate-800 mt-1">Folio Digital #{{ receta.RecetaID }}</h3>
                    </div>
                  </div>
                  <span :class="receta.YaCanjeada === 1 ? 'bg-slate-100 text-slate-400 border-slate-200/50' : 'bg-emerald-50 text-emerald-600 border-emerald-100/70'" class="text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider shadow-2xs">
                    {{ receta.YaCanjeada === 1 ? 'Entregada' : 'Disponible' }}
                  </span>
                </div>

                <div class="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-2xs text-left space-y-2">
                  <h4 class="text-base font-black text-slate-800 tracking-tight uppercase">{{ receta.NombreMedicamento }}</h4>
                  <div class="flex flex-col gap-1 text-xs">
                    <p class="text-blue-600 font-bold flex items-center gap-1.5">
                      <span class="text-slate-400 font-medium">Dosis indicada:</span> {{ receta.Dosis }}
                    </p>
                    <p class="text-slate-400 font-medium">
                      Emisión: <span class="text-slate-600 font-bold">{{ receta.FechaEmision }}</span>
                    </p>
                  </div>
                </div>

                <div class="text-left bg-slate-100/60 p-4 rounded-2xl border border-slate-200/30 min-h-19 flex flex-col justify-center">
                  <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Indicaciones del Doctor:</p>
                  <p class="text-xs text-slate-600 font-medium italic leading-relaxed line-clamp-2">
                    "{{ receta.Indicaciones || 'Consulte la posología completa abriendo el visor institucional.' }}"
                  </p>
                </div>
              </div>

              <div class="mt-6">
                <button
                  @click="abrirVisualizadorPDF(receta.RecetaID)"
                  class="w-full py-3.5 bg-linear-to-r from-[#005596] to-[#00345c] text-white rounded-xl text-xs font-black uppercase shadow-xs hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer tracking-widest flex items-center justify-center gap-2"
                >
                  <v-icon name="bi-search" scale="0.85" /> Abrir Receta Médica
                </button>
              </div>
            </div>
          </div>

          <div v-if="totalPaginasRecetas > 1" class="flex justify-center items-center gap-4 pt-6">
            <button
              @click="paginaRecetas--"
              :disabled="paginaRecetas === 1"
              class="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
            >
              Anterior
            </button>
            <span class="text-xs font-black text-slate-500 uppercase tracking-widest">
              Página {{ paginaRecetas }} de {{ totalPaginasRecetas }}
            </span>
            <button
              @click="paginaRecetas++"
              :disabled="paginaRecetas === totalPaginasRecetas"
              class="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

    </div>

    <Teleport to="body">
      <div v-if="selectedItem" class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
        <div class="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl border border-slate-100 my-auto">
          <h3 class="text-3xl font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-2">
            <v-icon name="bi-check-circle-fill" scale="1.2" class="text-[#005596]" /> Diagnóstico Clínico
          </h3>
          <div class="bg-slate-50 p-8 rounded-3xl space-y-6 text-left border border-slate-200/40">
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conclusión Médica</p>
              <p class="text-slate-700 font-bold text-xl mt-2 leading-relaxed uppercase">Dr. {{ selectedItem.Doctor }} • Cita #{{ selectedItem.CitaID }}</p>
              <p class="text-slate-600 font-bold mt-2 text-lg">Motivo: {{ selectedItem.Motivo }}</p>
            </div>
            <div v-if="selectedItem.Sintomas">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Síntomas Reportados</p>
              <p class="text-slate-600 font-semibold mt-1 text-base italic leading-relaxed">"{{ selectedItem.Sintomas }}"</p>
            </div>
          </div>
          <button @click="selectedItem = null" class="w-full mt-8 py-4.5 bg-linear-to-r from-[#005596] to-[#00345c] text-white rounded-2xl font-black uppercase border-b-4 border-b-[#00213b] active:translate-y-0.5 active:border-b-0 cursor-pointer text-xs tracking-widest">Cerrar Expediente</button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="selectedSistema" class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
        <div class="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl border border-slate-100 my-auto">
          <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Evaluación de Sistema</h3>
          <div class="bg-slate-50 p-6 rounded-3xl text-left space-y-4 border border-slate-200/40">
            <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Área Analizada</p><p class="text-xl font-black text-[#005596] uppercase mt-1">Sistema {{ selectedSistema.SistemaID }}</p></div>
            <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado de Condición</p><span :class="selectedSistema.EsNormal === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-3 py-1 text-xs font-black rounded-lg uppercase tracking-wider inline-block">{{ selectedSistema.EsNormal === 1 ? 'Sistema Saludable / Normal' : 'Anormalidad / Hallazgo Clínico' }}</span></div>
            <div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notas Clínicas del Especialista</p><p class="text-slate-700 font-medium italic text-sm mt-1 bg-white p-4 rounded-xl border border-slate-100 leading-relaxed">{{ selectedSistema.NotasAdicionales || 'El especialista no registró anotaciones adicionales específicas para este sistema.' }}</p></div>
          </div>
          <button @click="selectedSistema = null" class="w-full mt-6 py-4 bg-slate-800 text-white rounded-xl font-black uppercase cursor-pointer text-xs tracking-wider">Cerrar Detalle</button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="pdfUrl" class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div class="bg-white w-full max-w-4xl h-[85vh] rounded-[2.5rem] p-6 shadow-2xl flex flex-col justify-between border border-slate-100 my-auto">
          <div class="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div class="text-left">
              <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Prescripción Médica Digital</h3>
              <p class="text-xs text-slate-400 font-bold uppercase">MedCore Global • Visor de Documentos Oficiales</p>
            </div>
            <button @click="cerrarVisualizador" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black flex items-center justify-center cursor-pointer transition-all">
              ✕
            </button>
          </div>

          <div class="flex-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
            <iframe :src="pdfUrl" class="w-full h-full border-none" @load="pdfLoading = false"></iframe>

            <div v-if="pdfLoading" class="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center z-20">
              <OrbsLoader />
            </div>
          </div>

          <div class="flex gap-4 mt-4">
            <button @click="cerrarVisualizador" class="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all">
              Cerrar Visor
            </button>
            <a :href="pdfUrl" :download="'Receta_MedCore_' + recetaSeleccionadaId + '.pdf'" class="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center block shadow-sm transition-all">
              Descargar Copia Física
            </a>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { AppointmentRepository } from '../infrastructure/AppointmentRepo';
import type { MedicalRecord, Exam, Prescription } from '../../appointments/domain/Appointment';
import api from '@/shared/infrastructure/api';

import OrbsLoader from '../../../components/common/OrbsLoader.vue';

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as QRCode from 'qrcode';

import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiFolderFill, BiCalendarEvent, BiFileEarmarkTextFill, BiCreditCardFill,
  BiBuilding, BiCheckCircleFill, BiExclamationCircleFill, BiSearch, BiPeopleFill, BiBank,
  BiDownload, BiShareFill
} from 'oh-vue-icons/icons';

addIcons(
  BiFolderFill, BiCalendarEvent, BiFileEarmarkTextFill, BiCreditCardFill,
  BiBuilding, BiCheckCircleFill, BiExclamationCircleFill, BiSearch, BiPeopleFill, BiBank,
  BiDownload, BiShareFill
);

interface PdfMakeCustomInstance {
  download(defaultFileName?: string): void;
}

const vfsFonts = pdfFonts as unknown as { pdfMake?: { vfs: Record<string, string> }; vfs: Record<string, string> };
const pdfMakeContext = pdfMake as unknown as { vfs: Record<string, string> };
pdfMakeContext.vfs = vfsFonts.pdfMake ? vfsFonts.pdfMake.vfs : vfsFonts.vfs;

const props = withDefaults(defineProps<{
  usuarioId: number;
  viewMode?: 'completo' | 'recetas';
}>(), {
  viewMode: 'completo'
});

const repo = new AppointmentRepository();
const toast = useToast();

const history = ref<MedicalRecord[]>([]);
const exams = ref<Exam[]>([]);
const prescriptions = ref<Prescription[]>([]);
const selectedItem = ref<MedicalRecord | null>(null);
const selectedSistema = ref<Exam | null>(null);

const activeSubTab = ref(props.viewMode === 'recetas' ? 'recetas' : 'consultas');
const loading = ref(false);

const paginaExams = ref(1);
const paginaRecetas = ref(1);
const tarjetasPorPagina = 4;

const pdfUrl = ref<string | null>(null);
const pdfLoading = ref(false);
const recetaSeleccionadaId = ref<number>(0);

const subTabs = [
  { id: 'consultas', label: 'Consultas' },
  { id: 'examenes', label: 'Examen Físico' },
  { id: 'recetas', label: 'Recetas' }
];

const filtradosSubTabs = computed(() => {
  if (props.viewMode === 'recetas') {
    return subTabs.filter(tab => tab.id === 'recetas');
  }
  return subTabs;
});

watch(() => props.viewMode, (newMode) => {
  activeSubTab.value = newMode === 'recetas' ? 'recetas' : 'consultas';
  loadData();
});

watch(activeSubTab, () => {
  paginaExams.value = 1;
  paginaRecetas.value = 1;
  loadData();
});

const totalPaginasExams = computed(() => Math.ceil(exams.value.length / tarjetasPorPagina));
const examenesPaginados = computed(() => {
  const inicio = (paginaExams.value - 1) * tarjetasPorPagina;
  return exams.value.slice(inicio, inicio + tarjetasPorPagina);
});

const totalPaginasRecetas = computed(() => Math.ceil(prescriptions.value.length / tarjetasPorPagina));
const recetasPaginadas = computed(() => {
  const inicio = (paginaRecetas.value - 1) * tarjetasPorPagina;
  return prescriptions.value.slice(inicio, inicio + tarjetasPorPagina);
});

const metricasEvolutivas = computed(() => {
  const sistemasUnicos = ['general', 'cardiovascular', 'respiratorio', 'abdomen', 'neurológico'];

  return sistemasUnicos.map(nombreSistema => {
    const muestras = exams.value
      .filter(e => e.SistemaID.toLowerCase().trim() === nombreSistema)
      .slice(0, 3);

    let status = 'estable';
    let recorrido = '---';

    if (muestras.length >= 2) {
      const ultima = muestras[0]?.EsNormal ?? 1;
      const anterior = muestras[1]?.EsNormal ?? 1;
      recorrido = muestras.map(m => m?.EsNormal === 1 ? 'N' : 'A').reverse().join(' ➔ ');
      if (anterior === 0 && ultima === 1) status = 'mejora';
      if (anterior === 1 && ultima === 0) status = 'empeoro';
    } else if (muestras.length === 1) {
      const unica = muestras[0]?.EsNormal ?? 1;
      recorrido = unica === 1 ? 'N' : 'A';
    }

    return { nombre: nombreSistema, status, recorrido };
  });
});

const generarEstructuraPdfDef = async (item: MedicalRecord): Promise<TDocumentDefinitions> => {
  const payloadQrCripto = JSON.stringify({
    plataforma: 'MedCore Global - Verificación Institucional',
    cita_id: item.CitaID,
    doctor: item.Doctor,
    fecha_emision: item.FechaHora
  });

  let qrBase64 = '';
  try {
    qrBase64 = await QRCode.toDataURL(payloadQrCripto, { margin: 1, width: 120 });
  } catch (err) {
    console.error("Error QR:", err);
  }

  const definicionRaw: unknown = {
    content: [
      { text: 'MEDCORE GLOBAL SYSTEM', fontSize: 22, bold: true, color: '#005596', alignment: 'center' },
      { text: 'REPORTE CLÍNICO DE CONSULTA FINALIZADA', fontSize: 9, bold: true, color: '#94a3b8', alignment: 'center', margin: [0, 2, 0, 15] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, strokeColor: '#e2e8f0' }] },
      { text: 'DATOS GENERALES DE LA ATENCIÓN', fontSize: 11, bold: true, color: '#1e293b', margin: [0, 15, 0, 10] },
      {
        columns: [
          {
            table: {
              widths: [100, '*'],
              body: [
                [{ text: 'Identificador:', bold: true, color: '#64748b' }, { text: `#${item.CitaID}` }],
                [{ text: 'Médico Tratante:', bold: true, color: '#64748b' }, { text: `Dr. ${item.Doctor}`, bold: true }],
                [{ text: 'Especialidad:', bold: true, color: '#64748b' }, { text: item.Especialidad || 'Medicina General' }],
                [{ text: 'Establecimiento:', bold: true, color: '#64748b' }, { text: item.Clinica }],
                [{ text: 'Fecha y Hora:', bold: true, color: '#64748b' }, { text: item.FechaHora }]
              ]
            },
            layout: 'noBorders'
          },
          qrBase64 ? { image: qrBase64, alignment: 'right', width: 90 } : { text: '' }
        ]
      },
      { text: '', margin: [0, 10] },
      { text: 'EVOLUCIÓN DIAGNÓSTICA Y CONCLUSIÓN', fontSize: 11, bold: true, color: '#1e293b', margin: [0, 5, 0, 5] },
      {
        table: {
          widths: ['*'],
          body: [
            [{ text: 'Motivo / Diagnóstico Principal:', bold: true, color: '#005596', fontSize: 10, backgroundColor: '#f8fafc', margin: [5, 5, 5, 5] }],
            [{ text: item.Motivo || 'N/A', fontSize: 11, margin: [5, 5, 5, 10] }],
            [{ text: 'Sintomatología Desarrollada:', bold: true, color: '#005596', fontSize: 10, backgroundColor: '#f8fafc', margin: [5, 5, 5, 5] }],
            [{ text: item.Sintomas || 'No se registraron síntomas adicionales en el expediente.', fontStyle: 'italic', fontSize: 10, margin: [5, 5, 5, 5] }]
          ]
        },
        layout: { hLineColor: () => '#e2e8f0', vLineColor: () => '#e2e8f0' }
      },
      { text: 'Este documento constituye un extracto oficial firmado digitalmente por el sistema contable-clínico de MedCore.', fontSize: 8, color: '#94a3b8', alignment: 'center', margin: [0, 30, 0, 0] }
    ],
    defaultStyle: { fontSize: 11, color: '#334155' }
  };

  return definicionRaw as TDocumentDefinitions;
};

const descargarHistorialPdf = async (item: MedicalRecord): Promise<void> => {
  toast.info("Generando reporte oficial en formato PDF...");
  const docDef = await generarEstructuraPdfDef(item);
  const pdfDoc = pdfMake.createPdf(docDef) as unknown as PdfMakeCustomInstance;
  pdfDoc.download(`Expediente_MedCore_#${item.CitaID}.pdf`);
  toast.success("¡Documento descargado correctamente!");
};

const compartirHistorialWhatsApp = async (item: MedicalRecord): Promise<void> => {
  toast.info("Preparando canal de WhatsApp...");
  const textoMensaje = `
*MEDCORE GLOBAL - EXPEDIENTE CLÍNICO*
---------------------------------------
*Cita ID:* #${item.CitaID}
*Médico:* Dr. ${item.Doctor}
*Especialidad:* ${item.Especialidad || 'General'}
*Fecha:* ${item.FechaHora}
---------------------------------------
*DIAGNÓSTICO:* ${item.Motivo}
*SÍNTOMAS:* ${item.Sintomas || 'Ninguno'}
---------------------------------------
_Extracto oficial verificado en SQL Server_
  `.trim();

  const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoMensaje)}`;

  try {
    await navigator.clipboard.writeText(textoMensaje);
    window.open(urlWhatsApp, '_blank');
    const docDef = await generarEstructuraPdfDef(item);
    const pdfDocInstance = pdfMake.createPdf(docDef);
    pdfDocInstance.download(`Comprobante_Atencion_${item.CitaID}.pdf`);
  } catch {
    window.open(urlWhatsApp, '_blank');
  }
};

const abrirVisualizadorPDF = async (recetaId: number) => {
  if (!recetaId) {
    toast.error("El identificador de la receta digital no es válido.");
    return;
  }

  recetaSeleccionadaId.value = recetaId;
  pdfLoading.value = true;

  try {
    const response = await api.get(`recetas/pdf/${recetaId}`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    pdfUrl.value = window.URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error al renderizar la receta:", error);
    toast.error("No se pudo previsualizar la receta médica.");
    pdfUrl.value = null;
    pdfLoading.value = false;
  }
};

const cerrarVisualizador = () => {
  if (pdfUrl.value) window.URL.revokeObjectURL(pdfUrl.value);
  pdfUrl.value = null;
  recetaSeleccionadaId.value = 0;
  pdfLoading.value = false;
};

const loadData = async () => {
  if (props.usuarioId === 0) return;
  loading.value = true;

  try {
    if (activeSubTab.value === 'consultas') {
      history.value = await repo.getMedicalHistory(props.usuarioId);
    } else if (activeSubTab.value === 'examenes') {
      exams.value = await repo.getExams(props.usuarioId);
    } else if (activeSubTab.value === 'recetas') {
      prescriptions.value = await repo.getPrescriptions(props.usuarioId);
    }
  } catch (error) {
    console.error("Error cargando historial clínico:", error);
    toast.error("Error de sincronización con los servicios de MedCore Global.");
  } finally {
    loading.value = false;
  }
};

const showDetail = (item: MedicalRecord) => { selectedItem.value = item; };
const verDetalleSistema = (sistema: Exam) => { selectedSistema.value = sistema; };

onMounted(loadData);
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; }
.animate-fade-in { animation: fadeIn 0.35s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
