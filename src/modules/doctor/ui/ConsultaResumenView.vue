<template>
  <DoctorLayout class="layout-medico-print">
    <main class="min-h-screen bg-slate-50/60 pb-32 font-premium select-none animate-fade-in text-left print:hidden">
      <div class="max-w-7xl mx-auto p-6 space-y-8">

        <!-- CABECERA -->
        <div class="bg-linear-to-r from-blue-100/80 via-purple-100/50 to-emerald-100/70 border border-slate-200/80 border-t-8 border-t-[#005596] rounded-4xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,85,150,0.07)]">
          <div class="space-y-4 flex-1 w-full">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-3xs">
                <VIcon name="bi-check-circle-fill" scale="0.8" /> Consulta Completada
              </span>
              <span class="inline-flex items-center gap-1 bg-blue-500/10 text-[#005596] border border-blue-200/50 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-3xs">
                <VIcon name="bi-shield-check" scale="0.8" /> Expediente Sincronizado
              </span>
            </div>
            <h2 class="text-2xl font-black tracking-tight text-slate-800 uppercase leading-none drop-shadow-3xs">
              {{ datos.paciente || '--' }}
            </h2>
            <p class="text-slate-500 text-[11px] font-black uppercase tracking-widest flex flex-wrap items-center gap-3">
              <span class="flex items-center gap-1.5"><VIcon name="bi-calendar-event" scale="0.85" /> {{ fechaFormateada }}</span>
              <span class="text-slate-300 font-normal">|</span>
              <span class="flex items-center gap-1.5"><VIcon name="fa-hourglass-half" scale="0.8" /> {{ datos.edad || '--' }} Años</span>
              <span class="text-slate-300 font-normal">|</span>
              <span class="flex items-center gap-1.5"><VIcon name="bi-gender-ambiguous" scale="0.85" /> Género: {{ datos.genero === 'M' ? 'Masculino' : (datos.genero === 'F' ? 'Femenino' : '--') }}</span>
            </p>
            <div class="flex flex-wrap items-center gap-3 pt-1">
              <div class="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200/50 shadow-3xs">
                <VIcon name="bi-telephone-fill" scale="0.75" class="text-slate-400" />
                <span class="text-xs font-black text-slate-700 tracking-tight font-mono">{{ datos.telefono || '--' }}</span>
              </div>
              <div class="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200/50 shadow-3xs max-w-xs truncate">
                <VIcon name="hi-mail" scale="0.85" class="text-slate-400" />
                <span class="text-xs font-black text-slate-700 tracking-tight lowercase truncate">{{ datos.email || '--' }}</span>
              </div>
            </div>
          </div>

          <div class="w-full lg:w-auto flex items-center justify-end gap-3 shrink-0 relative">
            <button
              @click="imprimirResumen"
              class="bg-white text-slate-700 border border-slate-200 px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-2 border-b-4 border-b-slate-300 active:translate-y-1 active:border-b-0 active:bg-slate-50"
            >
              <VIcon name="bi-download" scale="0.95" /> Descargar
            </button>
            <div class="relative">
              <button
                @click="menuCompartirAbierto = !menuCompartirAbierto"
                class="bg-[#005596] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2 border-b-4 border-b-blue-900 active:translate-y-1 active:border-b-0"
              >
                <VIcon name="bi-share-fill" scale="0.95" /> Compartir
              </button>
              <div v-if="menuCompartirAbierto" class="absolute right-0 mt-2 bg-white/95 backdrop-blur-md border border-slate-200/80 p-2 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-fade-in">
                <button @click="ejecutarCompartir('whatsapp')" class="w-10 h-10 bg-[#25D366] text-white rounded-lg flex items-center justify-center cursor-pointer transition-transform active:scale-95"><VIcon name="io-logo-whatsapp" scale="1.2" /></button>
                <button @click="ejecutarCompartir('correo')" class="w-10 h-10 bg-[#ea4335] text-white rounded-lg flex items-center justify-center cursor-pointer transition-transform active:scale-95"><VIcon name="hi-mail" scale="1.2" /></button>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">

          <div class="bg-white border border-slate-200/80 rounded-4xl shadow-[0_12px_30px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
            <div class="bg-linear-to-r from-blue-500/15 via-blue-500/5 to-transparent border-b border-blue-100 px-6 py-4">
              <h4 class="text-xs font-black text-[#005596] uppercase tracking-widest flex items-center gap-2">
                <span class="bg-white w-6 h-6 rounded-lg flex items-center justify-center border border-blue-100 text-[#005596] shadow-3xs"><VIcon name="bi-person-bounding-box" scale="0.85" /></span> Datos Subjetivos
              </h4>
            </div>
            <div class="p-6 space-y-4 flex-1 flex flex-col justify-start">
              <div class="space-y-1.5">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo de Consulta</p>
                <div class="text-xs font-bold text-slate-700 bg-slate-50/60 p-4 rounded-xl border border-slate-200/40">
                  {{ datos.motivoConsulta || '--' }}
                </div>
              </div>
              <div class="space-y-1.5 pt-1">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Historia / Sintomatología</p>
                <div class="text-xs font-bold text-slate-700 bg-slate-50/60 p-4 rounded-xl border border-slate-200/40 min-h-20">
                  {{ datos.historiaActual || '--' }}
                </div>
              </div>

              <div class="border-t border-slate-100 pt-3 space-y-3">
                <p class="text-[9px] font-black text-purple-700 uppercase tracking-widest ml-1">Antecedentes Clínicos</p>
                <div class="grid grid-cols-1 gap-2">
                  <div class="text-[11px] font-medium text-slate-700 bg-purple-50/40 border border-purple-100/60 p-2.5 rounded-xl">
                    <strong class="text-purple-900 font-bold block text-[9px] uppercase tracking-wide mb-0.5">Enfermedades Crónicas:</strong>
                    {{ datos.antecedentes?.cronicas || 'Ninguna registrada' }}
                  </div>
                  <div class="text-[11px] font-medium text-slate-700 bg-amber-50/40 border border-amber-100/60 p-2.5 rounded-xl">
                    <strong class="text-amber-900 font-bold block text-[9px] uppercase tracking-wide mb-0.5">Reacciones Alérgicas:</strong>
                    {{ datos.antecedentes?.alergias || 'Ninguna registrada' }}
                  </div>
                  <div class="text-[11px] font-medium text-slate-700 bg-sky-50/40 border border-sky-100/60 p-2.5 rounded-xl">
                    <strong class="text-sky-900 font-bold block text-[9px] uppercase tracking-wide mb-0.5">Medicación Actual:</strong>
                    {{ datos.antecedentes?.medicamentos || 'Ninguna registrada' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-4xl shadow-[0_12px_30px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
            <div class="bg-linear-to-r from-purple-500/15 via-purple-500/5 to-transparent border-b border-purple-100 px-6 py-4">
              <h4 class="text-xs font-black text-purple-700 uppercase tracking-widest flex items-center gap-2">
                <span class="bg-white w-6 h-6 rounded-lg flex items-center justify-center border border-purple-100 text-purple-700 shadow-3xs"><VIcon name="bi-heart-pulse-fill" scale="0.85" /></span> Datos Objetivos
              </h4>
            </div>
            <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div class="grid grid-cols-2 gap-3.5 mb-3">
                <div class="bg-linear-to-b from-blue-50/40 to-white border border-blue-200/50 rounded-xl p-3.5 shadow-3xs">
                  <p class="text-[9px] font-black text-blue-500 uppercase tracking-widest">Presión Art.</p>
                  <p class="text-sm font-black text-blue-900 mt-1 font-mono">{{ datos.signos_vitales.presion || '--' }} <span v-if="datos.signos_vitales.presion" class="text-[9px] font-bold text-blue-400 font-sans">mmHg</span></p>
                </div>
                <div class="bg-linear-to-b from-rose-50/40 to-white border border-rose-200/50 rounded-xl p-3.5 shadow-3xs">
                  <p class="text-[9px] font-black text-rose-500 uppercase tracking-widest">Frec. Cardíaca</p>
                  <p class="text-sm font-black text-rose-900 mt-1 font-mono">{{ datos.signos_vitales.pulso || '--' }} <span v-if="datos.signos_vitales.pulso" class="text-[9px] font-bold text-rose-400 font-sans">LPM</span></p>
                </div>
                <div class="bg-linear-to-b from-amber-50/40 to-white border border-amber-200/50 rounded-xl p-3.5 shadow-3xs">
                  <p class="text-[9px] font-black text-amber-600 uppercase tracking-widest">Temperatura</p>
                  <p class="text-sm font-black text-amber-900 mt-1 font-mono">{{ datos.signos_vitales.temp || '--' }} <span v-if="datos.signos_vitales.temp" class="text-[9px] font-bold text-amber-500 font-sans">°C</span></p>
                </div>
                <div class="bg-linear-to-b from-emerald-50/40 to-white border border-emerald-200/50 rounded-xl p-3.5 shadow-3xs">
                  <p class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Frec. Resp.</p>
                  <p class="text-sm font-black text-emerald-900 mt-1 font-mono">{{ datos.signos_vitales.respiracion || '--' }} <span v-if="datos.signos_vitales.respiracion" class="text-[9px] font-bold text-emerald-400 font-sans">RPM</span></p>
                </div>
              </div>

              <div v-if="datos.hallazgos_examen_fisico && datos.hallazgos_examen_fisico.length > 0" class="border-t border-slate-100 pt-3 space-y-2">
                <p class="text-[9px] font-black text-emerald-700 uppercase tracking-widest ml-1">Examen Físico Segmentario</p>
                <div class="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  <div v-for="h in datos.hallazgos_examen_fisico" :key="h.sistema" class="p-2.5 rounded-xl border text-[11px] font-semibold leading-tight"
                    :class="h.isNormal ? 'bg-emerald-50/20 border-emerald-100/60 text-slate-700' : 'bg-amber-50/30 border-amber-100/60 text-slate-700'"
                  >
                    <div class="flex justify-between items-center mb-0.5">
                      <span class="font-bold text-slate-800 uppercase text-[9px] tracking-wide">{{ h.sistema }}</span>
                      <span v-if="h.isNormal" class="inline-flex items-center gap-1 text-[8px] font-black uppercase text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-md">
                        <VIcon name="bi-check-circle-fill" scale="0.6" /> Sano / Normal
                      </span>
                      <span v-else class="inline-flex items-center gap-1 text-[8px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md animate-pulse">
                        ⚠️ Hallazgos
                      </span>
                    </div>
                    <div v-if="!h.isNormal" class="space-y-1 mt-1 font-medium text-slate-600">
                      <p v-if="h.opciones && h.opciones.length > 0" class="text-[10px]"><span class="text-amber-800">●</span> {{ h.opciones.join(', ') }}</p>
                      <p v-if="h.notas" class="text-[10px] italic bg-white/80 p-1.5 rounded-lg border border-slate-100">"{{ h.notas }}"</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="bg-linear-to-r from-emerald-50/50 to-white border border-emerald-200 text-emerald-800 rounded-xl p-3 text-[11px] font-bold shadow-3xs flex items-center gap-2">
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></span> Examen Físico Segmentario Concluido.
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-4xl shadow-[0_12px_30px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col md:col-span-2 lg:col-span-1">
            <div class="bg-linear-to-r from-orange-500/15 via-orange-500/5 to-transparent border-b border-orange-100 px-6 py-4">
              <h4 class="text-xs font-black text-orange-700 uppercase tracking-widest flex items-center gap-2">
                <span class="bg-white w-6 h-6 rounded-lg flex items-center justify-center border border-orange-100 text-orange-700 shadow-3xs"><VIcon name="bi-bookmark-star-fill" scale="0.85" /></span> Evaluación y CIE-11
              </h4>
            </div>
            <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div class="flex flex-wrap gap-2 overflow-y-auto max-h-36 custom-scrollbar pr-1">
                <div v-for="(diag, idx) in listaDiagnosticos" :key="idx" class="bg-linear-to-b from-orange-50 to-white border border-orange-200 text-orange-950 font-black text-[10px] uppercase px-3 py-2 rounded-xl shadow-3xs flex items-center gap-1.5">
                  <span class="text-orange-500 font-mono text-[9px]">#{{ idx + 1 }}</span> {{ diag }}
                </div>
              </div>
              <div v-if="criterioExtenso" class="border-t border-slate-100 pt-3">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Criterio / Evolución</p>
                <p class="text-xs font-semibold text-slate-600 bg-slate-50/40 border border-slate-100 p-3 rounded-xl line-clamp-2 italic">"{{ criterioExtenso }}"</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-slate-200/90 rounded-4xl shadow-[0_20px_45px_rgba(0,0,0,0.03)] overflow-hidden text-left">
          <div class="bg-linear-to-r from-blue-100/80 via-purple-100/50 to-emerald-100/70 border-b border-slate-200/80 border-t-8 border-t-[#005596] px-8 py-6 flex justify-between items-center">
            <div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">Receta Médica Digital</h3>
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Medicamentos e indicaciones validadas para dispensación electrónica</p>
            </div>
            <span class="text-[10px] font-black bg-emerald-600 text-white px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm font-mono border border-emerald-500/20 flex items-center gap-1.5">
              <VIcon name="bi-file-earmark-medical" scale="0.9" /> Total: {{ datos.detalle_medicamentos?.length || 0 }} ítems
            </span>
          </div>
          <div class="p-8">
            <div class="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/10">
              <table class="w-full text-left border-collapse min-w-140">
                <thead>
                  <tr class="bg-blue-500/15 text-[#005596] font-black text-[10px] uppercase tracking-widest border-b border-blue-100">
                    <th class="py-4 px-5 w-12 text-center border-r border-blue-100/40">#</th>
                    <th class="py-4 px-5 border-r border-blue-100/40">Medicamento / Presentación</th>
                    <th class="py-4 px-5 w-1/4 border-r border-blue-100/40">Dosis</th>
                    <th class="py-4 px-5 w-1/2">Indicaciones Médicas de Consumo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(med, idx) in datos.detalle_medicamentos" :key="idx" class="border-b border-slate-100 last:border-0 bg-white odd:bg-slate-50/10 text-slate-700 text-xs">
                    <td class="py-5 px-5 text-center text-slate-400 font-mono font-black border-r border-slate-100">{{ idx + 1 }}</td>
                    <td class="py-5 px-5 border-r border-slate-100">
                      <div class="bg-blue-50/70 border border-blue-200/60 px-4 py-2.5 rounded-xl text-[#005596] font-black uppercase text-[11px] tracking-tight w-fit shadow-3xs">
                        {{ med?.NombreMedicamento || '--' }}
                      </div>
                    </td>
                    <td class="py-5 px-5 text-slate-800 font-black border-r border-slate-100">{{ med?.Dosis || '--' }}</td>
                    <td class="py-5 px-5 text-slate-500 font-medium italic leading-relaxed">{{ med?.Indicaciones || '--' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-3.5 pt-4">
          <button
            @click="router.push(`/medico/receta/${route.params.id}`)"
            class="px-8 py-3.5 bg-[#005596] hover:bg-blue-800 text-white rounded-xl font-black uppercase text-[10px] tracking-widest border-b-4 border-b-blue-900 active:translate-y-1 active:border-b-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <VIcon name="bi-printer-fill" scale="0.9" /> Generar Receta Digital
          </button>
        </div>
      </div>
    </main>

    <div class="hidden print:block w-full text-black font-sans bg-white p-0 text-left leading-normal selection:bg-transparent">
      <div class="border-b-4 border-[#005596] pb-4 flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight uppercase">Resumen de Consulta Clínica</h1>
          <p class="text-xs font-semibold text-[#005596] tracking-wide">MedGo+ — Sistema de Gestión Médica Digital</p>
        </div>
        <div class="text-right text-[11px] text-slate-600 font-mono">
          <p><strong>Fecha:</strong> {{ fechaFormateada }}</p>
          <p><strong>Folio:</strong> #{{ route.params.id || '2026-Rx' }}</p>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-xs font-bold uppercase text-[#005596] tracking-wider border-b border-slate-200 pb-1 mb-2">I. Información General del Paciente</h3>
        <table class="w-full text-xs border border-slate-300 text-left">
          <tbody>
            <tr>
              <td class="p-2 border border-slate-300 bg-slate-50 w-1/4 font-bold">Nombre Completo:</td>
              <td class="p-2 border border-slate-300 font-semibold uppercase" colspan="3">{{ datos.paciente || '--' }}</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-300 bg-slate-50 w-1/4 font-bold">Edad Cronológica:</td>
              <td class="p-2 border border-slate-300">{{ datos.edad || '--' }} Años</td>
              <td class="p-2 border border-slate-300 bg-slate-50 w-1/4 font-bold">Género Biológico:</td>
              <td class="p-2 border border-slate-300">{{ datos.genero === 'M' ? 'Masculino' : (datos.genero === 'F' ? 'Femenino' : '--') }}</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-300 bg-slate-50 w-1/4 font-bold">Teléfono Registro:</td>
              <td class="p-2 border border-slate-300 font-mono">{{ datos.telefono || '--' }}</td>
              <td class="p-2 border border-slate-300 bg-slate-50 w-1/4 font-bold">Correo Electrónico:</td>
              <td class="p-2 border border-slate-300 lowercase">{{ datos.email || '--' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-xs font-bold uppercase text-[#005596] tracking-wider border-b border-slate-200 pb-1 mb-2">II. Anamnesis (Datos Subjetivos)</h3>
          <div class="border border-slate-300 p-3 rounded-lg text-xs min-h-24 bg-white whitespace-pre-line">
            <p class="mb-1"><strong>Motivo de Consulta:</strong></p>
            <p class="text-slate-700 italic mb-3">{{ datos.motivoConsulta || '--' }}</p>
            <p class="mb-1"><strong>Historia / Sintomatología:</strong></p>
            <p class="text-slate-700 italic mb-3">{{ datos.historiaActual || '--' }}</p>
            <div class="pt-2 border-t border-slate-150 text-[10px] space-y-0.5">
              <p><strong>Enfermedades Crónicas:</strong> {{ datos.antecedentes?.cronicas || 'Ninguna registrada' }}</p>
              <p><strong>Reacciones Alérgicas:</strong> {{ datos.antecedentes?.alergias || 'Ninguna registrada' }}</p>
              <p><strong>Medicación Actual:</strong> {{ datos.antecedentes?.medicamentos || 'Ninguna registrada' }}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-xs font-bold uppercase text-[#005596] tracking-wider border-b border-slate-200 pb-1 mb-2">III. Signos Vitales y Examen Físico (Objetivos)</h3>
          <table class="w-full text-xs border border-slate-300 text-left mb-3">
            <thead>
              <tr class="bg-slate-100 text-slate-700 font-bold text-[10px]">
                <th class="p-1.5 border border-slate-300">Signo Vital</th>
                <th class="p-1.5 border border-slate-300 text-center">Valor Registrado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-1.5 border border-slate-300">Presión Arterial (PA)</td>
                <td class="p-1.5 border border-slate-300 text-center font-mono font-bold">{{ datos.signos_vitales.presion || '--' }} mmHg</td>
              </tr>
              <tr>
                <td class="p-1.5 border border-slate-300">Frecuencia Cardíaca (FC)</td>
                <td class="p-1.5 border border-slate-300 text-center font-mono font-bold">{{ datos.signos_vitales.pulso || '--' }} LPM</td>
              </tr>
              <tr>
                <td class="p-1.5 border border-slate-300">Temperatura Corporal</td>
                <td class="p-1.5 border border-slate-300 text-center font-mono font-bold">{{ datos.signos_vitales.temp || '--' }} °C</td>
              </tr>
              <tr>
                <td class="p-1.5 border border-slate-300">Frecuencia Respiratoria</td>
                <td class="p-1.5 border border-slate-300 text-center font-mono font-bold">{{ datos.signos_vitales.respiracion || '--' }} RPM</td>
              </tr>
            </tbody>
          </table>

          <div v-if="datos.hallazgos_examen_fisico && datos.hallazgos_examen_fisico.length > 0" class="border border-slate-300 p-2.5 rounded-lg text-[10px]">
            <p class="font-bold text-[#005596] uppercase tracking-wide mb-1">Detalle de Hallazgos Segmentarios:</p>
            <ul class="space-y-1 max-h-24 overflow-hidden">
              <li v-for="h in datos.hallazgos_examen_fisico" :key="h.sistema" class="leading-normal">
                <strong>{{ h.sistema }}:</strong>
                <span v-if="h.isNormal" class="text-emerald-700 font-semibold">Normal</span>
                <span v-else class="text-amber-800 font-semibold">
                  Anomalías ({{ h.opciones.join(', ') }})
                  <span v-if="h.notas" class="text-slate-500 font-normal italic">- "{{ h.notas }}"</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-xs font-bold uppercase text-[#005596] tracking-wider border-b border-slate-200 pb-1 mb-2">IV. Impresión Diagnóstica (CIE-11)</h3>
        <div class="border border-slate-300 p-3 rounded-lg text-xs">
          <ul class="list-disc pl-5 space-y-1 font-semibold uppercase">
            <li v-for="(diag, idx) in listaDiagnosticos" :key="idx">
              Código Diagnóstico OMS: {{ diag }}
            </li>
          </ul>
          <div v-if="criterioExtenso" class="mt-3 pt-2 border-t border-slate-200 italic text-slate-600">
            <strong>Criterio / Evolución Clínica:</strong> "{{ criterioExtenso }}"
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-xs font-bold uppercase text-[#005596] tracking-wider border-b border-slate-200 pb-1 mb-2">V. Plan Terapéutico (Receta Médica Digital)</h3>
        <table class="w-full text-xs border border-slate-400 text-left">
          <thead>
            <tr class="bg-slate-100 font-bold border-b border-slate-400 text-[10px]">
              <th class="p-1.5 border border-slate-400 w-12 text-center">#</th>
              <th class="p-1.5 border border-slate-400 w-1/3">Medicamento / Presentación</th>
              <th class="p-1.5 border border-slate-400 w-1/4">Dosis</th>
              <th class="p-1.5 border border-slate-400">Indicaciones de Consumo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(med, idx) in datos.detalle_medicamentos" :key="idx" class="border-b border-slate-300">
              <td class="p-1.5 border border-slate-300 text-center font-bold">{{ idx + 1 }}</td>
              <td class="p-1.5 border border-slate-300 font-bold uppercase text-[#005596]">{{ med?.NombreMedicamento || '--' }}</td>
              <td class="p-1.5 border border-slate-300 font-semibold text-slate-800">{{ med?.Dosis || '--' }}</td>
              <td class="p-1.5 border border-slate-300 text-slate-700 italic">{{ med?.Indicaciones || '--' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-16 flex justify-between items-end text-[10px] uppercase font-semibold text-slate-500">
        <div>
          <p>Documento Clínico Autenticado Electrónicamente</p>
          <p class="font-mono lowercase text-slate-400 mt-1">Hash Canje: MCG-AUTOGEN-2026</p>
        </div>
        <div class="w-56 border-t border-slate-500 text-center pt-2 font-bold italic tracking-wide">
          Firma y Sello Médico Autorizado
        </div>
      </div>
    </div>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';

import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiDownload, BiShareFill, IoLogoWhatsapp, HiMail, BiHouseDoorFill, BiPrinterFill,
  BiCheckCircleFill, BiShieldCheck, BiCalendarEvent, FaHourglassHalf, BiGenderAmbiguous,
  BiTelephoneFill, BiPersonBoundingBox, BiHeartPulseFill, BiBookmarkStarFill, BiFileEarmarkMedical
} from 'oh-vue-icons/icons';

addIcons(
  BiDownload, BiShareFill, IoLogoWhatsapp, HiMail, BiHouseDoorFill, BiPrinterFill,
  BiCheckCircleFill, BiShieldCheck, BiCalendarEvent, FaHourglassHalf, BiGenderAmbiguous,
  BiTelephoneFill, BiPersonBoundingBox, BiHeartPulseFill, BiBookmarkStarFill, BiFileEarmarkMedical
);

const router = useRouter();
const route = useRoute();
const toast = useToast();

const menuCompartirAbierto = ref(false);

const datos = ref({
  paciente: '',
  telefono: '',
  email: '',
  edad: '',
  genero: '',
  diagnostico: '',
  motivoConsulta: '',
  historiaActual: '',
  signos_vitales: { presion: '', pulso: '', temp: '', respiracion: '' },
  antecedentes: { cronicas: '', alergias: '', medicamentos: '' },
  hallazgos_examen_fisico: [] as Array<{ sistema: string; isNormal: boolean; opciones: string[]; notas: string; }>,
  detalle_medicamentos: [] as Array<{ NombreMedicamento: string; Dosis: string; Indications?: string; Indicaciones: string; }>
});

const fechaFormateada = computed(() => {
  return new Date().toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const listaDiagnosticos = computed(() => {
  if (!datos.value.diagnostico) return [];
  const partes = datos.value.diagnostico.split(' | Nota de Criterio Clínico:');
  const codigosRaw = partes[0] || '';
  return codigosRaw.split(', ').filter(d => d.trim().length > 0);
});

const criterioExtenso = computed(() => {
  if (!datos.value.diagnostico) return '';
  const partes = datos.value.diagnostico.split(' | Nota de Criterio Clínico:');
  return partes[1] ? partes[1].trim() : '';
});

onMounted(() => {
  const resumenGuardado = localStorage.getItem('MedGo+_resumen_compartir') || localStorage.getItem('medcore_resumen_compartir');

  if (resumenGuardado) {
    const parsed = JSON.parse(resumenGuardado);

    let fallbackMotivo = parsed.motivoConsulta || parsed.sintomas?.motivo || '';
    if (!fallbackMotivo && parsed.diagnostico) {
      const deags = parsed.diagnostico.split(' | ')[0];
      fallbackMotivo = `Evaluación clínica por: ${deags.split(', ')[0]}`;
    }

    let fallbackHistoria = parsed.historiaActual || parsed.sintomas?.dolor || '';
    if (!fallbackHistoria && parsed.diagnostico) {
      const partes = parsed.diagnostico.split(' | Nota de Criterio Clínico:');
      fallbackHistoria = partes[1] ? partes[1].trim() : 'Evolución estable documentada.';
    }

    datos.value = {
      paciente: parsed.paciente || '',
      telefono: parsed.telefono || '',
      email: parsed.email || '',
      edad: parsed.edad || '',
      genero: parsed.genero || '',
      diagnostico: parsed.diagnostico || '',
      motivoConsulta: fallbackMotivo || 'Consulta de seguimiento',
      historiaActual: fallbackHistoria || 'Estable durante la evaluación.',
      signos_vitales: {
        presion: parsed.signos_vitales?.presion || '',
        pulso: parsed.signos_vitales?.pulso || '',
        temp: parsed.signos_vitales?.temp || '',
        respiracion: parsed.signos_vitales?.respiracion || ''
      },
      antecedentes: {
        cronicas: parsed.antecedentes?.cronicas || 'No registra',
        alergias: parsed.antecedentes?.alergias || 'Ninguna conocida',
        medicamentos: parsed.antecedentes?.medicamentos || 'Ninguno'
      },
      hallazgos_examen_fisico: parsed.hallazgos_examen_fisico || [],
      detalle_medicamentos: parsed.detalle_medicamentos || []
    };
  } else {
    const state = window.history.state?.resumenCompartir;
    if (state) {
      datos.value = state;
    } else {
      toast.error("No se detectaron datos de la consulta completada.");
      router.push('/medico/dashboard');
    }
  }
});

const construirTextoResumen = () => {
  let texto = `*MedGo+ - RESUMEN DE CONSULTA*\n\n`;
  texto += `*Paciente:* ${datos.value.paciente}\n`;
  texto += `*Motivo:* ${datos.value.motivoConsulta}\n`;
  texto += `*Diagnósticos OMS:* ${listaDiagnosticos.value.join(', ') || 'Ninguno'}\n`;
  if (criterioExtenso.value) {
    texto += `*Criterio Clínico:* ${criterioExtenso.value}\n`;
  }
  texto += `\n*TRATAMIENTO PRESCRITO:*\n`;

  datos.value.detalle_medicamentos.forEach((med, idx) => {
    texto += `${idx + 1}. ${med.NombreMedicamento} - ${med.Dosis}\n    _Indicaciones:_ ${med.Indicaciones}\n`;
  });

  return texto;
};

const imprimirResumen = () => {
  toast.info("Generando reporte clínico oficial...");
  window.print();
};

const ejecutarCompartir = (tipo: 'whatsapp' | 'correo') => {
  menuCompartirAbierto.value = false;

  if (tipo === 'whatsapp') {
    if (!datos.value.telefono) {
      toast.error("El paciente no cuenta con un número telefónico registrado.");
      return;
    }
    const numeroLimpio = datos.value.telefono.replace(/[^0-9+]/g, '');
    const mensajeEncode = encodeURIComponent(construirTextoResumen());
    window.open('https://api.whatsapp.com/send?phone=' + numeroLimpio + '&text=' + mensajeEncode, '_blank');
  } else if (tipo === 'correo') {
    if (!datos.value.email) {
      toast.error("El paciente no cuenta con un correo electrónico registrado.");
      return;
    }
    const asunto = encodeURIComponent(`Resumen de Consulta Médica - MedGo+`);
    const cuerpo = encodeURIComponent(construirTextoResumen().replace(/\*/g, ''));
    window.location.href = `mailto:${datos.value.email}?subject=${asunto}&body=${cuerpo}`;
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

:deep(div[class*="fixed"]),
:deep(div[class*="sticky"]),
:deep(div[style*="position: fixed"]),
:deep(div[style*="position:fixed"]),
:deep(.fixed),
:deep(.sticky),
:deep(button[class*="rounded-full"]),
:deep(.bg-gradient-to-tr.from-purple-500),
:deep(.bg-amber-400),
:deep(.bg-yellow-400) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  height: 0 !important;
  width: 0 !important;
}

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
