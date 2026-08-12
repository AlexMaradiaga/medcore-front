<template>
  <div class="space-y-8 animate-fade-in text-left font-premium select-none">

    <!-- CABECERA DE LA VISTA -->
    <div class="flex justify-between items-end border-b border-slate-100 pb-5">
      <div>
        <h2 class="text-4xl font-black text-[#005596] uppercase tracking-tight flex items-center gap-3">
          <v-icon :name="viewMode === 'recetas' ? 'bi-credit-card-fill' : 'bi-folder-fill'" scale="1.6" class="text-[#005596]" />
          {{ viewMode === 'recetas' ? 'Mi Historial de Recetas' : 'Mi Historial Clínico' }}
        </h2>
        <p class="text-slate-500 font-medium italic mt-1">
          {{ viewMode === 'recetas' ? 'Consulte sus recetas médicas y folios digitales prescritos en tiempo real' : 'Consulte sus consultas previas y laboratorios en tiempo real' }}
        </p>
      </div>
    </div>

    <!-- PESTAÑAS PRINCIPALES (FILTRADAS SEGÚN EL MODO) -->
    <div class="flex gap-2 border-b border-slate-200/60 pb-0 overflow-x-auto">
      <button
        v-for="subTab in filtradosSubTabs"
        :key="subTab.id"
        @click="activeSubTab = subTab.id"
        :class="activeSubTab === subTab.id ? 'text-[#005596] border-b-4 border-[#005596] font-black' : 'text-slate-400 font-bold hover:text-slate-600'"
        class="px-5 pb-4 uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center gap-2 shrink-0"
      >
        <v-icon v-if="subTab.id === 'consultas'" name="bi-calendar-event" scale="0.9" />
        <v-icon v-else-if="subTab.id === 'laboratorio'" name="bi-cone-striped" scale="0.9" />
        <v-icon v-else-if="subTab.id === 'recetas'" name="bi-credit-card-fill" scale="0.9" />
        {{ subTab.label }}
      </button>
    </div>

    <!-- INDICADOR DE CARGA -->
    <div v-if="loading" class="py-24 text-center flex justify-center items-center">
      <OrbsLoader />
    </div>

    <div v-else class="mt-8">

      <!-- SUBTAB 1: CONSULTAS MÉDICAS -->
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
                    class="w-full px-4 py-2.5 bg-linear-to-r from-[#005596] to-[#00345c] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs hover:brightness-110 active:scale-[0.98]"
                  >
                    <v-icon name="bi-search" scale="0.8" /> Ver Expediente
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

      <!-- SUBTAB 2: LABORATORIO -->
      <div v-if="activeSubTab === 'laboratorio'" class="py-20 bg-white border border-slate-100 rounded-[2.5rem] text-center space-y-5 shadow-2xs animate-fade-in my-4">
        <div class="w-24 h-24 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto border border-amber-100 shadow-inner">
          <v-icon name="bi-cone-striped" scale="3.0" />
        </div>
        <div class="space-y-2 max-w-md mx-auto px-4">
          <h3 class="text-3xl font-black text-slate-800 uppercase tracking-tight">Próximamente</h3>
          <p class="text-slate-500 font-bold text-sm leading-relaxed">
            El módulo de <strong class="text-slate-700">Exámenes de Laboratorio</strong> se encuentra actualmente en desarrollo y estará disponible en una próxima actualización.
          </p>
        </div>
        <div>
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/70 text-amber-800 rounded-xl text-xs font-black uppercase tracking-wider border border-amber-200/60 shadow-3xs">
            <v-icon name="bi-tools" scale="0.85" /> Módulo en Construcción
          </span>
        </div>
      </div>

      <!-- SUBTAB 3: RECETAS (SÓLO VISIBLE EN MODO 'MIS RECETAS') -->
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

    <!-- MODAL DE EXPEDIENTE (AQUÍ SÍ SE MUESTRAN DIAGNÓSTICO, EXAMEN FÍSICO Y RECETA) -->
    <Teleport to="body">
      <div v-if="selectedItem" class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
        <div class="bg-white w-full max-w-3xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-slate-100 my-auto flex flex-col justify-between max-h-[90vh]">

          <!-- Encabezado Principal Modal -->
          <div>
            <div class="flex justify-between items-start border-b border-slate-100 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-50 text-[#005596] rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
                  <v-icon name="bi-file-earmark-text-fill" scale="1.2" />
                </div>
                <div class="text-left">
                  <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Expediente de Atención</h3>
                  <p class="text-xs text-slate-400 font-bold uppercase">
                    Dr. {{ selectedItem.Doctor }} • Cita #{{ selectedItem.CitaID }}
                  </p>
                </div>
              </div>
              <button @click="selectedItem = null" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black flex items-center justify-center cursor-pointer transition-all">
                ✕
              </button>
            </div>

            <!-- Segmented Control Interno (Diagnóstico, Examen Físico, Receta) -->
            <div class="grid grid-cols-3 gap-2 bg-slate-100/80 p-1.5 rounded-2xl mt-5">
              <button
                @click="modalTab = 'diagnostico'"
                :class="modalTab === 'diagnostico' ? 'bg-white text-[#005596] shadow-sm font-black' : 'text-slate-500 font-bold hover:text-slate-700'"
                class="py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <v-icon name="bi-check-circle-fill" scale="0.8" />
                Diagnóstico
              </button>

              <button
                @click="modalTab = 'examenes'"
                :class="modalTab === 'examenes' ? 'bg-white text-teal-700 shadow-sm font-black' : 'text-slate-500 font-bold hover:text-slate-700'"
                class="py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <v-icon name="bi-folder-fill" scale="0.8" />
                Examen ({{ examenesDeCita.length }})
              </button>

              <button
                @click="modalTab = 'recetas'"
                :class="modalTab === 'recetas' ? 'bg-white text-indigo-700 shadow-sm font-black' : 'text-slate-500 font-bold hover:text-slate-700'"
                class="py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <v-icon name="bi-credit-card-fill" scale="0.8" />
                Receta ({{ recetasDeCita.length }})
              </button>
            </div>
          </div>

          <!-- Cuerpo Dinámico del Modal -->
          <div class="my-6 overflow-y-auto pr-1 text-left min-h-64 flex flex-col justify-center">

            <!-- PESTAÑA MODAL 1: DIAGNÓSTICO -->
            <div v-if="modalTab === 'diagnostico'" class="space-y-4 animate-fade-in my-auto">
              <div class="bg-linear-to-br from-slate-50 to-sky-50/30 p-6 rounded-3xl border border-sky-100/60 space-y-4">
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Motivo / Diagnóstico Clínico</span>
                  <p class="text-slate-800 font-black text-xl leading-snug uppercase">{{ selectedItem.Motivo }}</p>
                </div>
                <div v-if="selectedItem.Sintomas" class="pt-3 border-t border-slate-200/50">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Sintomatología Registrada</span>
                  <p class="text-slate-600 font-medium text-sm italic leading-relaxed">"{{ selectedItem.Sintomas }}"</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500">
                <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span class="text-[9px] text-slate-400 block uppercase font-black">Establecimiento</span>
                  <span class="text-slate-700">{{ selectedItem.Clinica }}</span>
                </div>
                <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span class="text-[9px] text-slate-400 block uppercase font-black">Fecha de Atención</span>
                  <span class="text-slate-700">{{ selectedItem.FechaHora }}</span>
                </div>
              </div>
            </div>

            <!-- PESTAÑA MODAL 2: EXAMEN FÍSICO POR SISTEMAS (DE ESTA CITA) -->
            <div v-else-if="modalTab === 'examenes'" class="space-y-3 animate-fade-in my-auto">
              <div v-if="examenesDeCita.length === 0" class="text-center py-10 bg-slate-50 rounded-3xl border border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                No se registraron evaluaciones de examen físico en esta cita.
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                <div
                  v-for="exam in examenesDeCita"
                  :key="exam.ExamenSistemaID || exam.SistemaID"
                  class="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs flex flex-col justify-between space-y-2 hover:border-teal-200 transition-all"
                >
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-black text-slate-800 uppercase tracking-tight">Sistema {{ exam.SistemaID }}</span>
                    <span
                      :class="exam.EsNormal === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                      class="text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider shrink-0"
                    >
                      {{ exam.EsNormal === 1 ? 'Normal' : 'Hallazgo' }}
                    </span>
                  </div>
                  <p v-if="exam.NotasAdicionales" class="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-snug">
                    "{{ exam.NotasAdicionales }}"
                  </p>
                </div>
              </div>
            </div>

            <!-- PESTAÑA MODAL 3: RECETA Y POSOLOGÍA DE ESTA CITA -->
            <div v-else-if="modalTab === 'recetas'" class="space-y-3 animate-fade-in my-auto">
              <div v-if="recetasDeCita.length === 0" class="text-center py-10 bg-slate-50 rounded-3xl border border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                No se emitieron recetas médicas durante esta atención.
              </div>

              <div v-else class="space-y-3 max-h-80 overflow-y-auto pr-1">
                <div
                  v-for="receta in recetasDeCita"
                  :key="receta.RecetaID"
                  class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-200 transition-all"
                >
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-black text-slate-800 uppercase tracking-tight">{{ receta.NombreMedicamento }}</h4>
                      <span class="bg-indigo-50 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded-md border border-indigo-100">Folio #{{ receta.RecetaID }}</span>
                    </div>
                    <p class="text-xs text-blue-600 font-bold">
                      <span class="text-slate-400 font-normal">Posología:</span> {{ receta.Dosis }}
                    </p>
                    <p v-if="receta.Indicaciones" class="text-[11px] text-slate-500 italic leading-snug">
                      "{{ receta.Indicaciones }}"
                    </p>
                  </div>

                  <button
                    @click="abrirVisualizadorPDF(receta.RecetaID)"
                    class="w-full sm:w-auto px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border border-indigo-200 shrink-0 transition-all flex items-center justify-center gap-1.5"
                  >
                    <v-icon name="bi-search" scale="0.8" /> Abrir PDF
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Botón de Cierre -->
          <button @click="selectedItem = null" class="w-full py-4 bg-linear-to-r from-[#005596] to-[#00345c] text-white rounded-2xl font-black uppercase shadow-sm active:scale-[0.99] cursor-pointer text-xs tracking-widest transition-all">
            Cerrar Expediente
          </button>

        </div>
      </div>
    </Teleport>

    <!-- VISOR INSTITUCIONAL PDF DE RECETA -->
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
  BiBuilding, BiCheckCircleFill, BiExclamationCircleFill, BiSearch, BiPeopleFill,
  BiDownload, BiShareFill, BiConeStriped, BiTools
} from 'oh-vue-icons/icons';

addIcons(
  BiFolderFill, BiCalendarEvent, BiFileEarmarkTextFill, BiCreditCardFill,
  BiBuilding, BiCheckCircleFill, BiExclamationCircleFill, BiSearch, BiPeopleFill,
  BiDownload, BiShareFill, BiConeStriped, BiTools
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

// Estado de navegación interna del Modal (3 pestañas)
const modalTab = ref<'diagnostico' | 'examenes' | 'recetas'>('diagnostico');

const activeSubTab = ref<string>(props.viewMode === 'recetas' ? 'recetas' : 'consultas');
const loading = ref<boolean>(false);

const paginaRecetas = ref<number>(1);
const tarjetasPorPagina = 4;

const pdfUrl = ref<string | null>(null);
const pdfLoading = ref<boolean>(false);
const recetaSeleccionadaId = ref<number>(0);

// PESTAÑAS BASE DISPONIBLES
const subTabs = [
  { id: 'consultas', label: 'Consultas' },
  { id: 'laboratorio', label: 'Laboratorio' },
  { id: 'recetas', label: 'Recetas' }
];

// FILTRADO DE PESTAÑAS PRINCIPALES SEGÚN EL VIEWMODE
const filtradosSubTabs = computed(() => {
  if (props.viewMode === 'recetas') {
    // Modo "Mis Recetas": muestra únicamente el tab de Recetas
    return subTabs.filter(tab => tab.id === 'recetas');
  }
  // Modo "Historial Clínico": muestra únicamente Consultas y Laboratorio
  return subTabs.filter(tab => tab.id !== 'recetas');
});

watch(() => props.viewMode, (newMode) => {
  activeSubTab.value = newMode === 'recetas' ? 'recetas' : 'consultas';
});

watch(activeSubTab, () => {
  paginaRecetas.value = 1;
});

const totalPaginasRecetas = computed(() => Math.ceil(prescriptions.value.length / tarjetasPorPagina));
const recetasPaginadas = computed(() => {
  const inicio = (paginaRecetas.value - 1) * tarjetasPorPagina;
  return prescriptions.value.slice(inicio, inicio + tarjetasPorPagina);
});

// CRUCE DE EXÁMENES DE LA CITA
const examenesDeCita = computed(() => {
  if (!selectedItem.value) return [];
  const targetCitaId = Number(selectedItem.value.CitaID);
  const targetFechaHora = selectedItem.value.FechaHora;

  const filtrados = exams.value.filter(e => {
    const eCitaId = (e as Record<string, unknown>).CitaID;
    if (eCitaId !== undefined && eCitaId !== null) {
      return Number(eCitaId) === targetCitaId;
    }
    return e.FechaHora === targetFechaHora;
  });

  const mapaUnicos = new Map<string, Exam>();
  filtrados.forEach(item => {
    const clave = item.SistemaID.toLowerCase().trim();
    if (!mapaUnicos.has(clave)) {
      mapaUnicos.set(clave, item);
    }
  });

  return Array.from(mapaUnicos.values());
});

// CRUCE DE RECETAS DE LA CITA
const recetasDeCita = computed(() => {
  if (!selectedItem.value) return [];
  const targetCitaId = Number(selectedItem.value.CitaID);
  const targetFechaHora = selectedItem.value.FechaHora;

  const filtrados = prescriptions.value.filter(p => {
    const pCitaId = (p as Record<string, unknown>).CitaID;
    if (pCitaId !== undefined && pCitaId !== null) {
      return Number(pCitaId) === targetCitaId;
    }
    if (p.RecetaID && Number(p.RecetaID) === targetCitaId) {
      return true;
    }
    return p.FechaEmision === targetFechaHora;
  });

  const mapaUnicos = new Map<string | number, Prescription>();
  filtrados.forEach(item => {
    const clave = item.RecetaID || item.NombreMedicamento;
    if (!mapaUnicos.has(clave)) {
      mapaUnicos.set(clave, item);
    }
  });

  return Array.from(mapaUnicos.values());
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
  } catch (err: unknown) {
    console.error("Error al generar código QR:", err);
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
_Extracto oficial verificado_
  `.trim();

  const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoMensaje)}`;

  try {
    await navigator.clipboard.writeText(textoMensaje);
    window.open(urlWhatsApp, '_blank');
    const docDef = await generarEstructuraPdfDef(item);
    const pdfDocInstance = pdfMake.createPdf(docDef) as unknown as PdfMakeCustomInstance;
    pdfDocInstance.download(`Comprobante_Atencion_${item.CitaID}.pdf`);
  } catch {
    window.open(urlWhatsApp, '_blank');
  }
};

const abrirVisualizadorPDF = async (recetaId: number): Promise<void> => {
  if (!recetaId) {
    toast.error("El identificador de la receta digital no es válido.");
    return;
  }

  recetaSeleccionadaId.value = recetaId;
  pdfLoading.value = true;

  try {
    const response = await api.get(`recetas/pdf/${recetaId}`, { responseType: 'blob' });
    const blob = new Blob([response.data as BlobPart], { type: 'application/pdf' });
    pdfUrl.value = window.URL.createObjectURL(blob);
  } catch (error: unknown) {
    console.error("Error al renderizar la receta:", error);
    toast.error("No se pudo previsualizar la receta médica.");
    pdfUrl.value = null;
    pdfLoading.value = false;
  }
};

const cerrarVisualizador = (): void => {
  if (pdfUrl.value) window.URL.revokeObjectURL(pdfUrl.value);
  pdfUrl.value = null;
  recetaSeleccionadaId.value = 0;
  pdfLoading.value = false;
};

interface EncryptedPayload {
  payload?: string;
  data?: unknown;
}

function isEncryptedPayload(res: unknown): res is EncryptedPayload {
  return typeof res === 'object' && res !== null && ('payload' in res || 'data' in res);
}

const extraerArreglo = <T>(res: unknown): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (isEncryptedPayload(res) && Array.isArray(res.data)) return res.data as T[];
  return [];
};

const loadData = async (): Promise<void> => {
  if (!props.usuarioId || props.usuarioId === 0) return;

  loading.value = true;

  try {
    const [rawHistory, rawExams, rawPrescriptions] = await Promise.all([
      repo.getMedicalHistory(props.usuarioId),
      repo.getExams(props.usuarioId),
      repo.getPrescriptions(props.usuarioId)
    ]);

    history.value = extraerArreglo<MedicalRecord>(rawHistory);
    exams.value = extraerArreglo<Exam>(rawExams);
    prescriptions.value = extraerArreglo<Prescription>(rawPrescriptions);

  } catch (error: unknown) {
    console.error("❌ Error en la llamada HTTP de historial clínico:", error);
    toast.error("Error de sincronización con los servicios de MedCore Global.");
  } finally {
    loading.value = false;
  }
};

const showDetail = (item: MedicalRecord): void => {
  selectedItem.value = item;
  modalTab.value = 'diagnostico';
};

onMounted(() => {
  void loadData();
});
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; }
.animate-fade-in { animation: fadeIn 0.35s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
