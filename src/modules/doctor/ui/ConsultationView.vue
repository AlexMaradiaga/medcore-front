<template>
  <DoctorLayout>
    <main class="h-screen max-h-screen bg-slate-50/50 font-premium selection:bg-[#005596]/10 flex flex-col overflow-hidden">

      <!-- Cabecera de Paciente -->
      <div class="bg-linear-to-r from-[#005596] via-[#004b84] to-[#00345c] text-white px-12 py-5 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg relative overflow-hidden shrink-0">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none"></div>

        <div class="flex items-center gap-8 relative z-10">
          <button @click="router.back()" class="flex items-center gap-2 text-[10px] font-black bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition-all uppercase tracking-widest cursor-pointer active:scale-95 border border-white/10">
            <v-icon name="bi-arrow-left" scale="0.8" /> Volver
          </button>
          <div class="text-left border-l border-white/20 pl-8">
            <h2 class="text-2xl font-black tracking-tight uppercase leading-none mb-1.5">{{ appointment?.Paciente }}</h2>
            <span class="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10 text-blue-50">
              <v-icon name="bi-person-badge-fill" scale="0.7" /> {{ appointment?.Edad }} Años • {{ appointment?.Genero === 'M' ? 'Masculino' : 'Femenino' }}
            </span>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2 mt-4 md:mt-0 w-full md:w-auto relative z-10">
          <div class="flex items-center gap-4 w-full md:w-auto bg-black/10 px-4 py-2.5 rounded-2xl border border-white/5">
            <span class="text-[10px] font-black uppercase tracking-wider text-blue-100">Progreso de Ficha: {{ progress }}%</span>
            <div class="w-40 h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <div class="h-full bg-linear-to-r from-cyan-400 to-emerald-400 transition-all duration-500 shadow-xs" :style="{ width: progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pestañas de Navegación del Historial -->
      <nav class="bg-white border-b border-slate-200/80 px-12 flex justify-center shadow-xs shrink-0 z-30 backdrop-blur-md">
        <div class="flex gap-3 py-3 w-full max-w-2xl justify-center">
          <button
            v-for="tab in ['Subjetivo', 'Objetivo', 'Evaluación', 'Plan']"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl cursor-pointer active:scale-95 flex items-center justify-center gap-2 flex-1 sm:flex-initial',
              activeTab === tab
                ? 'bg-linear-to-r from-[#005596] to-blue-600 text-white shadow-md shadow-blue-500/15 scale-102'
                : 'text-slate-600 hover:text-[#005596] hover:bg-slate-100/80 font-bold'
            ]"
          >
            <v-icon :name="getTabIcon(tab)" scale="0.9" /> {{ tab }}
          </button>
        </div>
      </nav>

      <!-- Cuerpo Principal Asíncrono -->
      <div class="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto animate-fade-in custom-scrollbar pb-32">
        <div class="bg-white border border-slate-200/60 rounded-[2.5rem] p-10 shadow-xl min-h-125 relative overflow-hidden">

          <!-- PESTAÑA: SUBJETIVO -->
          <div v-if="activeTab === 'Subjetivo'" class="space-y-8 animate-fade-in text-left">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Datos Subjetivos del Paciente</h3>
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Sintomatología reportada en la entrevista inicial</p>
            </div>

            <div class="bg-linear-to-r from-slate-50/50 to-white rounded-3xl p-8 border-l-4 border-l-[#005596] border-y border-r border-slate-200/60 space-y-5 relative shadow-xs">
              <div class="flex justify-between items-center">
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <v-icon name="bi-file-earmark-text-fill" class="text-[#005596]" /> Motivo de Consulta y Síntomas
                </h4>
                <div class="flex items-center gap-2">
                  <span class="bg-blue-50 text-[#005596] border border-blue-100/70 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-3xs">Pre-llenado de Admisión</span>
                  <button v-if="!isEditingSubjetivo" @click="startEditingSubjetivo" class="text-slate-400 hover:text-[#005596] transition-all bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl shadow-3xs cursor-pointer text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <v-icon name="bi-pencil-square" scale="0.8" /> Editar
                  </button>
                </div>
              </div>
              <div class="space-y-6">
                <PatientBackgroundTabs
                  :enfermedadesText="appointment?.Sintomas || null"
                  :alergiasText="appointment?.Alergias || null"
                  :medicamentosText="appointment?.MedicamentosActuales || null"
                />
              </div>
              <div v-if="!isEditingSubjetivo" class="animate-fade-in pt-1">
                <p class="text-slate-600 font-semibold leading-relaxed text-sm bg-white p-5 rounded-2xl border border-slate-100 shadow-inner">
                  {{ editableSubjetivo || (appointment?.Motivo + ' - ' + (appointment?.Sintomas || 'Sin síntomas registrados')) }}
                </p>
              </div>

              <div class="space-y-4 animate-fade-in" v-else>
                <textarea v-model="tempSubjetivo" class="w-full bg-white border-2 border-slate-200 rounded-2xl p-5 outline-hidden focus:border-blue-300 transition-all font-bold text-slate-700 min-h-32 shadow-inner"></textarea>
                <div class="flex gap-3">
                  <button @click="saveSubjetivo" class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-wider flex items-center gap-2 shadow-md shadow-emerald-500/10 transition-all cursor-pointer">Guardar Cambios</button>
                  <button @click="isEditingSubjetivo = false" class="bg-white hover:bg-slate-50 text-slate-400 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-wider border border-slate-200 transition-all cursor-pointer">Cancelar</button>
                </div>
              </div>
            </div>
          </div>

          <!-- PESTAÑA: OBJETIVO -->
          <div v-if="activeTab === 'Objetivo'" class="space-y-8 animate-fade-in text-left">
            <section class="space-y-4">
              <div class="border-b border-slate-100 pb-2">
                <h3 class="text-lg font-black text-slate-900 tracking-tight">Signos Vitales Actuales</h3>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Constantes fisiológicas tomadas en el triaje clínico</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="campo in listaCamposSignos" :key="campo.key" class="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between shadow-3xs hover:bg-white hover:border-slate-300 transition-all duration-200">
                  <div class="space-y-1 flex-1">
                    <label class="text-[9px] font-black uppercase text-slate-400 tracking-widest block pl-0.5">{{ campo.label }}</label>
                    <div class="relative flex items-center">
                      <input
                        type="text"
                        v-model="form.signos_vitales[campo.key]"
                        :placeholder="campo.key === 'temp' ? '36.5°C' : '120/80'"
                        class="w-full bg-white border border-slate-200/80 focus:border-[#005596] outline-hidden rounded-xl py-2 pl-9 pr-3 font-black text-slate-800 text-xs shadow-inner font-mono transition-all focus:ring-2 focus:ring-blue-50"
                      >
                      <span class="absolute left-3 flex items-center pointer-events-none">
                        <v-icon :name="getSignoIcon(campo.key).icon" :class="getSignoIcon(campo.key).color" scale="0.85" />
                      </span>
                    </div>
                  </div>
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center ml-4 shrink-0 shadow-3xs', getSignoIcon(campo.key).bgColor]">
                    <v-icon :name="getSignoIcon(campo.key).icon" :class="getSignoIcon(campo.key).color" scale="0.95" />
                  </div>
                </div>
              </div>
            </section>

            <div v-if="obtenerEspecialidadLogueada === 8" class="pt-4 border-t border-slate-100 animate-fade-in">
              <OdontologyModule @update:specialtyData="capturarDataEspecialidad" />
            </div>

            <section v-if="obtenerEspecialidadLogueada !== 8" class="space-y-4">
              <div class="border-b border-slate-100 pb-2">
                <h3 class="text-lg font-black text-slate-900 tracking-tight">Examen Físico Anatómico</h3>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Exploración segmentaria y hallazgos patológicos</p>
              </div>

              <!-- CONTENEDOR DE SISTEMAS FÍSICOS REESTRUCTURADO SIN ANIDACIÓN EN BUTTON -->
              <div class="space-y-3.5">
                <div v-for="(sistema, index) in sistemasFisicos" :key="sistema.id" class="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-200">

                  <!-- Cabecera Clickable (Div en lugar de button evita que se cierre al pulsar dentro del contenido expuesto) -->
                  <div @click="toggleSistema(index)" class="w-full flex justify-between items-center p-4 hover:bg-slate-50/70 transition-all cursor-pointer text-left select-none">
                    <div class="flex items-center gap-4">
                      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center border shadow-3xs', getSistemaStyles(sistema.nombre).bgClass]">
                        <v-icon :name="getSistemaStyles(sistema.nombre).icon" scale="0.9" />
                      </div>
                      <span class="font-black text-slate-800 text-xs uppercase tracking-wider">{{ sistema.nombre }}</span>
                      <span v-if="countHallazgos(index) > 0 && !sistema.isNormal" class="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-3xs animate-pulse flex items-center gap-1">
                        <v-icon name="bi-exclamation-triangle-fill" scale="0.7" /> {{ countHallazgos(index) }} hallazgos
                      </span>
                      <span v-else-if="sistema.isNormal" class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-3xs flex items-center gap-1">
                        <v-icon name="bi-check-circle-fill" scale="0.7" /> Normal
                      </span>
                    </div>
                    <v-icon name="bi-chevron-down" :class="['text-slate-400 transition-transform duration-200 mr-2', sistema.open ? 'rotate-180' : '']" scale="0.8" />
                  </div>

                  <!-- Bloque Opciones Desplegable -->
                  <div v-if="sistema.open" class="p-6 bg-slate-50/40 border-t border-slate-100 animate-fade-in space-y-5 text-left">
                    <label class="flex items-center gap-3 cursor-pointer group bg-white p-3.5 rounded-xl border border-slate-100 shadow-3xs w-fit">
                      <input type="checkbox" v-model="sistema.isNormal" @change="handleNormalChange(index)" class="w-4 h-4 rounded border-slate-300 text-[#005596] focus:ring-0">
                      <span class="text-xs font-black uppercase tracking-wide text-slate-600 group-hover:text-slate-900 transition-colors">Marcar Sistema como Sano / Normal</span>
                    </label>

                    <!-- SE ENRIQUECE CON v-if PARA EVITAR CRASHES DURANTE CARGA ASÍNCRONA -->
                    <div v-if="!sistema.isNormal && form.examen_fisico_opciones[sistema.id]" class="space-y-3 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-3xs animate-fade-in">
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Catálogo Clínico de Hallazgos Auxiliares:</p>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <label v-for="opcion in sistema.opciones" :key="opcion" class="flex items-center gap-3 cursor-pointer group bg-slate-50/50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 p-3 rounded-xl transition-all">
                          <input type="checkbox" v-model="form.examen_fisico_opciones[sistema.id][opcion]" class="w-4 h-4 rounded border-slate-300 text-[#005596] focus:ring-0">
                          <span class="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{{ opcion }}</span>
                        </label>
                      </div>
                    </div>

                    <div class="space-y-1.5 pt-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notas Médicas Adicionales:</label>
                      <textarea v-model="form.examen_fisico_notes[sistema.id]" placeholder="Describa la anomalía con sus especificaciones clínicas..." class="w-full bg-white border border-slate-200 rounded-xl p-4 outline-hidden focus:border-blue-400 font-bold text-slate-700 min-h-20 transition-all text-xs shadow-inner"></textarea>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </div>

          <!-- PESTAÑA: EVALUACIÓN -->
          <div v-if="activeTab === 'Evaluación'" class="space-y-6 animate-fade-in text-left">
            <div class="border-b border-slate-100 pb-2">
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Juicio Diagnóstico de la Sesión</h3>
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Mapeo automatizado de patologías OMS CIE-11 y análisis facultativo libre</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div class="space-y-5">
                <div class="relative w-full">
                  <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block mb-2">Buscador Oficial CIE-11</label>
                  <div class="relative flex items-center">
                    <span class="absolute left-5 text-slate-400 flex items-center">
                      <v-icon name="bi-search" scale="0.8" />
                    </span>
                    <input type="text" v-model="busquedaDiag" @input="onBusquedaInput" @focus="mostrarDropdown = true" placeholder="Ingrese palabras clave..." class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 focus:bg-white focus:border-[#005596] outline-hidden font-bold text-slate-800 text-sm transition-all shadow-inner" />
                    <span v-if="buscandoAPI" class="absolute right-6 flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    </span>
                  </div>

                  <div v-if="mostrarDropdown && resultadosDiagnosticos.length > 0" v-click-outside="cerrarDropdown" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-56 overflow-y-auto animate-fade-in custom-scrollbar">
                    <ul class="divide-y divide-slate-100">
                      <li v-for="diag in resultadosDiagnosticos" :key="diag.codigo" @click="seleccionarDiagnostico(diag)" class="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer group">
                        <span class="group-hover:text-slate-900 uppercase tracking-tight">{{ diag.descripcion }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="space-y-2.5 max-h-76 overflow-y-auto pr-1 custom-scrollbar">
                  <div v-if="form.diagnostico.length === 0" class="text-center py-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 tracking-widest flex flex-col items-center justify-center gap-2">
                    <v-icon name="bi-folder-x" scale="1.2" class="text-slate-300" /> Ningún código OMS anexado a la consulta.
                  </div>
                  <div v-else v-for="(diagEstablecido, idx) in form.diagnostico" :key="idx" class="bg-blue-50/40 border border-blue-100/60 rounded-xl p-3.5 flex justify-between items-center animate-fade-in shadow-3xs">
                    <div class="text-left space-y-0.5 flex-1 pr-4">
                      <p class="text-[9px] font-black text-[#005596] uppercase tracking-widest">Diagnóstico OMS #{{ Number(idx) + 1 }}</p>
                      <p class="text-xs font-black text-slate-800 leading-tight uppercase tracking-tight">{{ diagEstablecido }}</p>
                    </div>
                    <button type="button" @click="removerDiagnostico(Number(idx))" class="text-[9px] font-black text-rose-500 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-all uppercase tracking-wider cursor-pointer flex items-center gap-1">
                      <v-icon name="bi-trash-fill" scale="0.8" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex flex-col h-full space-y-2">
                <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Notas de Evolución y Criterio Clínico Libre</label>
                <textarea v-model="form.diagnostico_extenso" class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-hidden focus:bg-white focus:border-[#005596] font-bold text-slate-700 transition-all shadow-inner resize-none min-h-60 lg:min-h-72 flex-1 text-xs leading-relaxed" placeholder="Redacte aquí detalles de la patología..."></textarea>
              </div>
            </div>
          </div>

          <!-- PESTAÑA: PLAN -->
          <div v-if="activeTab === 'Plan'" class="space-y-6 animate-fade-in text-left font-premium">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Plan de Tratamiento Estructurado</h3>
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Prescripción de fármacos para la orden de farmacia digital</p>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
              <div class="xl:col-span-1 bg-linear-to-b from-blue-50/40 to-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
                <h4 class="text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <v-icon name="ri-capsule-fill" class="text-blue-600" /> Nueva Dosificación
                </h4>

                <div class="space-y-4 text-xs font-bold text-slate-600">
                  <div class="space-y-1.5">
                    <label class="uppercase text-[9px] text-slate-400 tracking-wider ml-0.5">Medicamento / Fármaco</label>
                    <input v-model="nuevoMedPlan.NombreMedicamento" type="text" class="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-[#005596] outline-hidden uppercase text-[11px] font-black text-slate-800 shadow-2xs" placeholder="Ej. Amoxicilina 500mg" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="uppercase text-[9px] text-slate-400 tracking-wider ml-0.5">Dosis y Posología</label>
                    <input v-model="nuevoMedPlan.Dosis" type="text" class="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-[#005596] outline-hidden text-[11px] font-bold shadow-2xs" placeholder="Ej. 1 cápsula cada 8 horas" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="uppercase text-[9px] text-slate-400 tracking-wider ml-0.5">Indicaciones de Consumo</label>
                    <textarea v-model="nuevoMedPlan.Indicaciones" rows="3" class="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-[#005596] outline-hidden text-[11px] resize-none font-medium shadow-2xs leading-relaxed" placeholder="Ej. Tomar después de las comidas..."></textarea>
                  </div>
                  <button @click="agregarMedicamentoAlPlan" class="w-full bg-linear-to-r from-[#005596] to-blue-600 hover:from-blue-600 hover:to-[#005596] text-white py-4 rounded-xl uppercase tracking-widest text-[10px] font-black mt-2 transition-all duration-300 cursor-pointer active:scale-95 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2">
                    <v-icon name="bi-plus-circle-fill" scale="0.9" /> Anexar Fármaco al Plan
                  </button>
                </div>
              </div>

              <div class="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 min-h-84 flex flex-col justify-between shadow-xs overflow-hidden">
                <div class="overflow-x-auto custom-scrollbar">
                  <table class="w-full text-left border-collapse min-w-112.5">
                    <thead>
                      <tr class="border-b border-slate-200 text-slate-400 font-black text-[9px] uppercase tracking-wider bg-slate-50/50">
                        <th class="py-3 px-3 w-10 text-center">#</th>
                        <th class="py-3 px-3">Medicamento</th>
                        <th class="py-3 px-3 w-1/4">Dosis</th>
                        <th class="py-3 px-3 w-1/3">Indicaciones de Receta</th>
                        <th class="py-3 px-2 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="form.detalle_medicamentos.length === 0">
                        <td colspan="5" class="text-center py-20 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/20 rounded-2xl border border-dashed border-slate-200">
                          <div class="flex flex-col items-center justify-center gap-2">
                            <v-icon name="bi-exclamation-circle" scale="1.3" class="text-slate-300" /> Ningún fármaco registrado.
                          </div>
                        </td>
                      </tr>
                      <tr v-else v-for="(med, index) in form.detalle_medicamentos" :key="index" class="border-b border-slate-100 odd:bg-slate-50/30 hover:bg-blue-50/30 transition-all font-bold text-slate-700 text-xs animate-fade-in">
                        <td class="py-4 px-2 text-center text-slate-400 font-mono font-black">{{ Number(index) + 1 }}</td>
                        <td class="py-4 px-3 text-[#005596] font-black uppercase text-[11px] tracking-tight">{{ med.NombreMedicamento }}</td>
                        <td class="py-4 px-3 text-slate-800 font-bold">{{ med.Dosis }}</td>
                        <td class="py-4 px-3 text-slate-500 font-medium italic leading-relaxed">{{ med.Indicaciones }}</td>
                        <td class="py-4 px-2 text-center">
                          <button @click="removerMedicamentoDelPlan(Number(index))" class="text-slate-300 hover:text-rose-600 font-black p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center">
                            <v-icon name="bi-x-lg" scale="0.8" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Barra Inferior de Guardado -->
      <footer class="fixed bottom-0 left-0 right-0 bg-white/90 border-t border-slate-200 p-5 flex justify-center gap-4 z-40 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.04)] shrink-0">
        <div class="max-w-7xl w-full flex justify-end gap-4">
          <button @click="handleSaveDraft" class="flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-wider transition-all shadow-3xs cursor-pointer active:scale-95">
            <v-icon name="bi-save-fill" scale="0.8" /> Guardar Borrador
          </button>
          <button @click="handleSubmit" :disabled="loading" class="flex items-center gap-2 px-10 py-3.5 bg-linear-to-r from-[#005596] to-[#00345c] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer active:scale-95">
            <v-icon name="ri-rocket-fill" scale="0.8" /> {{ loading ? 'Procesando...' : 'Finalizar Consulta' }}
          </button>
        </div>
      </footer>
    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import { useMedicalStore } from '@/stores/medicalStore';
import { DoctorRepository } from '../infrastructure/DoctorRepository';
import type { DoctorAppointment, DiagnosticoCIE11, SistemaExamenUI, OdontologyPayload } from '../domain/DoctorAppointment';
import type { DirectiveBinding } from 'vue';
import PatientBackgroundTabs from '../ui/components/PatientHistory/PatientBackgroundTabs.vue';
import { GiLungs, GiStomach } from "oh-vue-icons/icons/gi";
import { FaBrain, FaFemale, FaBone } from "oh-vue-icons/icons/fa";
import { addIcons } from "oh-vue-icons";

addIcons(GiLungs, GiStomach, FaBrain, FaFemale, FaBone);

const OdontologyModule = defineAsyncComponent(() =>
  import('../../consultations/ui/components/odontology/OdontologyModule.vue')
);

interface HTMLElementWithClickOutside extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void;
}

interface SignosVitales {
  presion: string;
  pulso: string;
  temp: string;
  respiracion: string;
}

interface FilaMedicamentoConsulta {
  NombreMedicamento: string;
  Dosis: string;
  Indicaciones: string;
}

const router = useRouter();
const toast = useToast();
const medicalStore = useMedicalStore();
const repo = new DoctorRepository();
const appointment = ref<DoctorAppointment | null>(null);
const loading = ref(false);
const activeTab = ref('Subjetivo');
const isEditingSubjetivo = ref(false);
const editableSubjetivo = ref('');
const tempSubjetivo = ref('');

const sistemasFisicos = ref<SistemaExamenUI[]>([]);
const busquedaDiag = ref('');
const buscandoAPI = ref(false);
const mostrarDropdown = ref(false);
const resultadosDiagnosticos = ref<DiagnosticoCIE11[]>([]);
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const presupuestoEspecialidad = ref<number>(0);
const datosOdontologiaExtra = ref<OdontologyPayload | null>(null);

const nuevoMedPlan = ref<FilaMedicamentoConsulta>({
  NombreMedicamento: '',
  Dosis: '',
  Indicaciones: ''
});

const obtenerEspecialidadLogueada = computed<number>(() => {
  if (medicalStore.doctor) {
    const specId = medicalStore.doctor.EspecialidadID || medicalStore.doctor.especialidad_id;
    if (specId) return Number(specId);
  }
  if (appointment.value && appointment.value.EspecialidadID) {
    return Number(appointment.value.EspecialidadID);
  }
  return 1;
});

const getTabIcon = (tab: string): string => {
  const icons: Record<string, string> = {
    'Subjetivo': 'bi-file-earmark-text-fill',
    'Objetivo': 'bi-activity',
    'Evaluación': 'bi-check-circle-fill',
    'Plan': 'ri-capsule-fill'
  };
  return icons[tab] || 'bi-activity';
};

const getSignoIcon = (key: string): { icon: string; color: string; bgColor: string } => {
  const mapping: Record<string, { icon: string; color: string; bgColor: string }> = {
    presion: { icon: 'bi-droplet-fill', color: 'text-rose-500', bgColor: 'bg-rose-50' },
    pulso: { icon: 'bi-heart-fill', color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    temp: { icon: 'bi-thermometer-half', color: 'text-amber-500', bgColor: 'bg-amber-50' },
    respiracion: { icon: 'bi-activity', color: 'text-sky-500', bgColor: 'bg-sky-50' }
  };
  return mapping[key] || { icon: 'bi-activity', color: 'text-slate-400', bgColor: 'bg-slate-50' };
};

const getSistemaStyles = (nombre: string): { icon: string; bgClass: string } => {
  const n = nombre.toUpperCase();

  if (n.includes('APARIENCIA') || n.includes('GENERAL')) {
    return { icon: 'bi-person-fill', bgClass: 'bg-blue-50 text-blue-600 border-blue-100' };
  }
  if (n.includes('ORL') || n.includes('OTORRINO')) {
    return { icon: 'bi-ear', bgClass: 'bg-purple-50 text-purple-600 border-purple-100' };
  }
  if (n.includes('CARDIO')) {
    return { icon: 'bi-heart-fill', bgClass: 'bg-rose-50 text-rose-600 border-rose-100' };
  }
  if (n.includes('RESPIRATORIO')) {
    return { icon: 'gi-lungs', bgClass: 'bg-cyan-50 text-cyan-600 border-cyan-100' };
  }
  if (n.includes('ABDOMEN') || n.includes('DIGESTIVO')) {
    return { icon: 'gi-stomach', bgClass: 'bg-amber-50 text-amber-600 border-amber-100' };
  }
  if (n.includes('OSTEOMUSCULAR') || n.includes('SISTEMA OSEO')) {
    return { icon: 'fa-bone', bgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  }
  if (n.includes('NEUROLÓGICO') || n.includes('NEUROLOGICO')) {
    return { icon: 'fa-brain', bgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
  }
  if (n.includes('GINECOLÓGICO') || n.includes('GINECOLOGICO')) {
    return { icon: 'fa-female', bgClass: 'bg-pink-50 text-pink-600 border-pink-100' };
  }
  if (n.includes('GENITALES') || n.includes('UROLOGICO') || n.includes('UROLÓGICO')) {
    return { icon: 'bi-gender-ambiguous', bgClass: 'bg-slate-100 text-slate-700 border-slate-200' };
  }

  return { icon: 'bi-activity', bgClass: 'bg-slate-50 text-slate-600 border-slate-100' };
};

const obtenerBorradorInicial = () => {
  // Estructura limpia y segura por defecto
  const defaultForm = {
    cita_id: 0,
    signos_vitales: { presion: '', pulso: '', temp: '', respiracion: '' } as SignosVitales,
    examen_fisico_opciones: {} as Record<string, Record<string, boolean>>,
    examen_fisico_notes: {} as Record<string, string>,
    diagnostico: [] as string[],
    diagnostico_extenso: '',
    notas_medicas: '',
    detalle_medicamentos: [] as FilaMedicamentoConsulta[]
  };

  const borradorGuardado = localStorage.getItem('draft_consulta_actual');
  if (borradorGuardado) {
    try {
      const parsed = JSON.parse(borradorGuardado);
      // Fusionamos el borrador para asegurar la existencia de propiedades internas críticas
      return {
        cita_id: parsed.cita_id ?? defaultForm.cita_id,
        signos_vitales: { ...defaultForm.signos_vitales, ...parsed.signos_vitales },
        examen_fisico_opciones: parsed.examen_fisico_opciones || {},
        examen_fisico_notes: parsed.examen_fisico_notes || {},
        diagnostico: parsed.diagnostico || [],
        diagnostico_extenso: parsed.diagnostico_extenso || '',
        notas_medicas: parsed.notas_medicas || '',
        detalle_medicamentos: parsed.detalle_medicamentos || []
      };
    } catch (e) {
      console.error("Error al parsear borrador clínico:", e);
    }
  }
  return defaultForm;
};

const form = ref(obtenerBorradorInicial());

watch(form, (nuevoEstado) => {
  localStorage.setItem('draft_consulta_actual', JSON.stringify(nuevoEstado));
}, { deep: true });

const listaCamposSignos = [
  { label: 'Presión Arterial', key: 'presion' as keyof SignosVitales },
  { label: 'Frecuencia Cardíaca', key: 'pulso' as keyof SignosVitales },
  { label: 'Temperatura', key: 'temp' as keyof SignosVitales },
  { label: 'Frecuencia Resp.', key: 'respiracion' as keyof SignosVitales }
];

const onBusquedaInput = () => {
  mostrarDropdown.value = true;
  if (debounceTimeout) clearTimeout(debounceTimeout);
  const query = busquedaDiag.value.trim();
  if (query.length < 3) { resultadosDiagnosticos.value = []; return; }

  buscandoAPI.value = true;
  debounceTimeout = setTimeout(async () => {
    try { resultadosDiagnosticos.value = await repo.buscarDiagnosticosCIE11(query); }
    catch (err) { console.error(err); }
    finally { buscandoAPI.value = false; }
  }, 380);
};

const seleccionarDiagnostico = (diag: DiagnosticoCIE11) => {
  if (!form.value.diagnostico.includes(diag.descripcion)) { form.value.diagnostico.push(diag.descripcion); }
  busquedaDiag.value = '';
  mostrarDropdown.value = false;
};

const removerDiagnostico = (index: number) => { form.value.diagnostico.splice(index, 1); };
const cerrarDropdown = () => { setTimeout(() => { mostrarDropdown.value = false; }, 250); };
const toggleSistema = (index: number) => {
  const s = sistemasFisicos.value[index];
  if (s) {
    s.open = !s.open;
  }
};

const handleNormalChange = (index: number) => {
  const s = sistemasFisicos.value[index];
  if (s && s.isNormal) {
    form.value.examen_fisico_opciones[s.id] = {};
    form.value.examen_fisico_notes[s.id] = '';
  }
};

const countHallazgos = (index: number): number => {
  const s = sistemasFisicos.value[index];
  if (!s) return 0;
  const opciones = form.value.examen_fisico_opciones[s.id];
  return opciones ? Object.values(opciones).filter(v => v).length : 0;
};

const progress = computed(() => {
  const tabs = ['Subjetivo', 'Objetivo', 'Evaluación', 'Plan'];
  const index = tabs.indexOf(activeTab.value) !== -1 ? tabs.indexOf(activeTab.value) : 1;
  return Math.round(((index + 1) / tabs.length) * 100);
});

const capturarDataEspecialidad = (data: OdontologyPayload) => {
  presupuestoEspecialidad.value = data.totalPresupuesto;
  datosOdontologiaExtra.value = data;
};

onMounted(async () => {
  try {
    const catalogoCrudo = await repo.getCatalogoExamenFisico();

    sistemasFisicos.value = catalogoCrudo.map((sistema) => ({
      ...sistema,
      open: false,
      isNormal: true
    }));

    sistemasFisicos.value.forEach((sistema) => {
      if (!form.value.examen_fisico_opciones[sistema.id]) {
        form.value.examen_fisico_opciones[sistema.id] = {};
      }
      if (!form.value.examen_fisico_notes[sistema.id]) {
        form.value.examen_fisico_notes[sistema.id] = '';
      }
    });
  } catch (err) {
    console.error("Error al cargar examen físico:", err);
  }

  const saved = localStorage.getItem('current_appointment');
  if (!saved) {
    router.push('/medico/dashboard');
    return;
  }
  appointment.value = JSON.parse(saved);

  if (appointment.value) {
    form.value.cita_id = appointment.value.CitaID;
    if (form.value.notas_medicas) {
      editableSubjetivo.value = form.value.notas_medicas;
      tempSubjetivo.value = form.value.notas_medicas;
    }
  }
  if (!medicalStore.isConsultationActive) {
    medicalStore.setConsultationActive(true);
  }
});

const startEditingSubjetivo = () => {
  if (!tempSubjetivo.value && appointment.value) {
    tempSubjetivo.value = `${appointment.value.Motivo} - ${appointment.value.Sintomas || 'Sin síntomas registrados'}`;
  }
  isEditingSubjetivo.value = true;
};

const saveSubjetivo = () => {
  editableSubjetivo.value = tempSubjetivo.value;
  isEditingSubjetivo.value = false;
  form.value.notas_medicas = tempSubjetivo.value;
};

const agregarMedicamentoAlPlan = (): void => {
  if (!nuevoMedPlan.value.NombreMedicamento || !nuevoMedPlan.value.NombreMedicamento.trim()) {
    toast.error("El campo 'Medicamento' es obligatorio.");
    return;
  }
  form.value.detalle_medicamentos.push({
    NombreMedicamento: nuevoMedPlan.value.NombreMedicamento.trim(),
    Dosis: nuevoMedPlan.value.Dosis ? nuevoMedPlan.value.Dosis.trim() : 'Según criterio clínico',
    Indicaciones: nuevoMedPlan.value.Indicaciones ? nuevoMedPlan.value.Indicaciones.trim() : 'Sin indicaciones especiales.'
  });
  nuevoMedPlan.value = { NombreMedicamento: '', Dosis: '', Indicaciones: '' };
};

const removerMedicamentoDelPlan = (index: number) => { form.value.detalle_medicamentos.splice(index, 1); };
const handleSaveDraft = () => {
  localStorage.setItem('draft_consulta_actual', JSON.stringify(form.value));
  toast.success('Borrador clínico respaldado de forma segura.');
};

const handleSubmit = async () => {
  if (form.value.diagnostico.length === 0 && !form.value.diagnostico_extenso.trim()) {
    toast.error('Por favor registre un diagnóstico antes de finalizar.');
    return;
  }
  if (form.value.detalle_medicamentos.length === 0) {
    toast.error('Por favor agregue al menos un medicamento en la pestaña de Plan.');
    return;
  }

  loading.value = true;
  try {
    const payload = JSON.parse(JSON.stringify(form.value));
    payload.cita_id = Number(payload.cita_id);

    let diagnosticoFinal = form.value.diagnostico.join(', ');
    if (form.value.diagnostico_extenso.trim()) {
      diagnosticoFinal = diagnosticoFinal
        ? `${diagnosticoFinal} | Nota de Criterio Clínico: ${form.value.diagnostico_extenso.trim()}`
        : `Nota de Criterio Clínico: ${form.value.diagnostico_extenso.trim()}`;
    }
    payload.diagnostico = diagnosticoFinal;

    if (obtenerEspecialidadLogueada.value === 8 && datosOdontologiaExtra.value) {
      payload.presupuesto_total = datosOdontologiaExtra.value.totalPresupuesto;
      payload.odontograma_json = datosOdontologiaExtra.value.odontograma;
      payload.examenes_odontologicos_json = datosOdontologiaExtra.value.examenesBase || [];
    }

    await repo.completeConsultation(payload);
    toast.success('¡Consulta Odontológica finalizada con éxito!');

    const hallazgosExamenFisico: Array<{
      sistema: string;
      isNormal: boolean;
      opciones: string[];
      notas: string;
    }> = [];

    if (sistemasFisicos.value && sistemasFisicos.value.length > 0) {
      sistemasFisicos.value.forEach((sistema) => {
        const id = sistema.id;
        const notes = form.value.examen_fisico_notes?.[id]?.trim() || '';
        const opcionesSeleccionadas: string[] = [];

        const opciones = form.value.examen_fisico_opciones?.[id];
        if (opciones) {
          Object.keys(opciones).forEach((opc) => {
            if (opciones[opc]) {
              opcionesSeleccionadas.push(opc);
            }
          });
        }

        hallazgosExamenFisico.push({
          sistema: sistema.nombre,
          isNormal: !!sistema.isNormal,
          opciones: opcionesSeleccionadas,
          notas: notes
        });
      });
    }

    const objetoResumen = {
      paciente: appointment.value?.Paciente || 'Paciente',
      edad: appointment.value?.Edad || 'No registrada',
      genero: appointment.value?.Genero || 'No especificado',
      telefono: appointment.value?.Telefono || 'No disponible',
      email: appointment.value?.EmailPaciente || 'No disponible',
      diagnostico: payload.diagnostico,
      detalle_medicamentos: form.value.detalle_medicamentos || [],
      signos_vitales: form.value.signos_vitales,

      antecedentes: {
        cronicas: appointment.value?.Sintomas || 'No registra',
        alergias: appointment.value?.Alergias || 'Ninguna conocida',
        medicamentos: appointment.value?.MedicamentosActuales || 'Ninguno'
      },
      sintomas: {
        motivo: appointment.value?.Motivo  || payload.motivo_consulta || 'Consulta de seguimiento',
        dolor: form.value.notas_medicas || editableSubjetivo.value  || (appointment.value ? (appointment.value.Motivo + ' - ' + (appointment.value.Sintomas || 'Sin síntomas registrados')) : 'Sin síntomas registrados')
      },
      hallazgos_examen_fisico: hallazgosExamenFisico
    };

    localStorage.setItem('MedGo+_resumen_compartir', JSON.stringify(objetoResumen));

    localStorage.removeItem('draft_consulta_actual');
    medicalStore.setConsultationActive(false);
    medicalStore.clearPatient();
    localStorage.removeItem('current_appointment');

    router.push(`/medico/consulta/${payload.cita_id}/resumen`);
  } catch (error) {
    console.error("[Submit Error]", error);
    toast.error('Error crítico al intentar finalizar la consulta.');
  } finally {
    loading.value = false;
  }
};

const vClickOutside = {
  mounted(el: HTMLElementWithClickOutside, binding: DirectiveBinding<(event: Event) => void>) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) { binding.value(event); }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: HTMLElementWithClickOutside) {
    if (el.clickOutsideEvent) document.removeEventListener('click', el.clickOutsideEvent);
  }
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
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    background-image: none !important;
  }
  @page {
    size: letter;
    margin: 15mm 15mm 15mm 15mm !important;
  }
  .layout-medico-print :deep(header),
  .layout-medico-print :deep(nav),
  .layout-medico-print :deep(aside),
  .layout-medico-print :deep(footer),
  div.fixed,
  div.sticky,
  button,
  iframe {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    opacity: 0 !important;
  }
}
</style>
