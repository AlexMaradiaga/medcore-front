<template>
  <div class="min-h-screen bg-slate-100 flex font-sans selection:bg-sky-500/10 text-left">

    <!-- BARRA LATERAL (ASIDE) -->
    <aside class="w-72 bg-white border-r border-slate-100 flex flex-col justify-between p-6 sticky top-0 h-screen z-30 shrink-0 shadow-xs">
      <div class="space-y-8">
        <div class="flex items-center gap-4 px-2 cursor-pointer group/logo" @click="activeTab = 'home'; subViewInstituciones = 'clinicas'">

          <div class="contenedor-mini-logo-3d relative shrink-0">
            <div class="mini-logo-cuerpo-3d">
              <img
                src="/logo-medgo.jpg"
                alt="MedGo+ Logo"
                class="w-full h-full object-cover rounded-[11px] shadow-xs"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-black tracking-tighter leading-none bg-linear-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent group-hover/logo:opacity-90 transition-opacity">MedGo+</span>
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestión Médica Digital</span>
          </div>
        </div>

        <nav class="space-y-1.5">
          <button
            @click="activeTab = 'home'; subViewInstituciones = 'clinicas'"
            :class="activeTab === 'home' ? 'bg-sky-50 text-sky-600 font-black border-l-4 border-sky-400' : 'text-slate-500 font-bold hover:bg-slate-50 border-l-4 border-transparent'"
            class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-r-2xl text-xs uppercase tracking-wider transition-all cursor-pointer group"
          >
            <v-icon name="bi-house-fill" class="h-4 w-4 text-sky-500 transition-transform group-hover:scale-110" /> Inicio
          </button>

          <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id; if(tab.id === 'instituciones') subViewInstituciones = 'clinicas'"
            :class="activeTab === tab.id ? 'bg-sky-50 text-sky-600 font-black border-l-4 border-sky-400' : 'text-slate-500 font-bold hover:bg-slate-50 border-l-4 border-transparent'"
            class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-r-2xl text-xs uppercase tracking-wider transition-all cursor-pointer group"
          >
            <v-icon :name="tab.icon" :class="['h-4 w-4 transition-transform group-hover:scale-110', tab.color]" />
            {{ te(tab.label) ? t(tab.label) : tab.fallback }}
          </button>
        </nav>
      </div>

      <button
        @click="resetBooking(); activeTab = 'schedule'"
        class="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-200/60 shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
      >
        <v-icon name="bi-calendar-event" class="h-4 w-4 text-emerald-600" /> + Agendar Cita
      </button>
    </aside>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="flex-1 flex flex-col min-h-screen overflow-x-hidden">

      <!-- ENCABEZADO -->
      <header class="bg-white border-b border-slate-100 px-10 py-4 flex justify-end items-center sticky top-0 z-20 shadow-xs">
        <div class="flex items-center gap-6">

          <!-- SELECTOR DE PACIENTE/DEPENDIENTE AJUSTADO -->
          <div v-if="esTutor || misDependientes.length > 0" class="flex items-center gap-3 bg-amber-50/60 px-3.5 py-1.5 rounded-2xl border border-amber-200/50 animate-fade-in shadow-2xs">
            <div class="flex items-center gap-2">
              <label class="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <v-icon name="bi-people-fill" class="h-3 w-3 text-amber-600" /> Paciente:
              </label>
              <select
                class="bg-transparent text-xs font-black text-slate-800 outline-none cursor-pointer border-none p-0 pr-4 focus:ring-0"
                @change="evaluarSeleccionPaciente($event)"
              >
                <option v-for="(dep, idx) in misDependientes" :key="String(dep.PacienteID || idx)" :value="idx">
                  {{ dep.Nombre || dep.nombre }} {{ dep.TutorID === null || dep.es_dependiente === 0 ? '(Titular / Tutor)' : '(Dependiente)' }}
                </option>
                <option v-if="necesitaPerfilTutor" value="crear_mi_perfil">+ Crear mi perfil de paciente</option>
              </select>
            </div>

            <button
              v-if="pacienteActualSeleccionado?.es_dependiente === 1"
              @click="openEmancipateModal"
              class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Independizar Hijo
            </button>
          </div>

          <div class="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <div class="w-8 h-8 bg-linear-to-tr from-sky-400/30 to-emerald-400/30 rounded-full flex items-center justify-center text-sky-700 font-black text-xs uppercase">
              {{ userData.nombre.charAt(0) }}
            </div>
            <div class="text-left">
              <p class="text-xs font-black text-slate-700 leading-none">{{ userData.nombre }}</p>
              <p class="text-[10px] text-slate-400 font-medium mt-0.5">{{ userSessionData.email }}</p>
            </div>
          </div>
          <button @click="handleLogout" class="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer">
            <v-icon name="bi-box-arrow-right" class="h-4 w-4 text-rose-500" /> Salir
          </button>
        </div>
      </header>

      <!-- ÁREA DE VISTAS (MAIN) -->
      <main class="p-10 flex-1 max-w-7xl w-full mx-auto space-y-12">

        <!-- INICIO -->
        <section v-if="activeTab === 'home'" class="space-y-10 animate-fade-in">
          <div>
            <h2 class="text-4xl font-black text-slate-800 tracking-tight">Hola, {{ userData.nombre.split(' ')[0] }}</h2>
            <p class="text-slate-400 font-bold text-sm mt-1">Roatán • Islas de la Bahía</p>
          </div>

          <div class="bg-white rounded-[2.5rem] p-8 text-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs border border-slate-100 relative overflow-hidden">
            <div class="flex items-center gap-5 relative z-10">
              <div class="w-16 h-16 bg-slate-50 text-slate-600 rounded-2xl border border-slate-100 flex items-center justify-center shadow-2xs">
                <v-icon name="ri-hospital-fill" scale="1.8" class="text-sky-600" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="bg-amber-400/20 text-amber-800 border border-amber-300/40 font-black text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <v-icon name="bi-star-fill" scale="0.7" class="mb-0.5"/> Destacado
                  </span>
                  <span class="bg-emerald-500/10 text-emerald-700 border border-emerald-200/40 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">Premium</span>
                </div>
                <h3 class="text-2xl font-black tracking-tight mt-2 text-slate-800">Clínica Médica del Caribe</h3>
                <p class="text-slate-500 text-xs font-semibold mt-1">Atención médica de excelencia • Equipamiento de última generación</p>
                <div class="flex items-center gap-4 mt-3 text-[11px] font-black text-slate-500">
                  <span class="flex items-center gap-1.5"><v-icon name="bi-people-fill" class="text-sky-500" scale="0.75"/> 15+ Especialistas</span>
                  <span class="flex items-center gap-1.5"><v-icon name="bi-calendar-event" class="text-emerald-500" scale="0.75"/> Citas hoy disponibles</span>
                </div>
              </div>
            </div>
            <button @click="seleccionarClinicaDirectaDesdeHome(2)" class="bg-white hover:bg-sky-50 text-sky-600 border border-sky-100 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-2xs shrink-0 relative z-10 cursor-pointer">
              Ver más →
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div @click="activeTab = 'directory'" class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-3xs hover:border-sky-100 hover:shadow-xs transition-all cursor-pointer flex items-center gap-6 group">
              <div class="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all">
                <v-icon name="bi-people-fill" class="h-6 w-6" />
              </div>
              <div class="flex-1">
                <h4 class="text-xl font-black text-slate-800 group-hover:text-sky-600 transition-colors">Mis Médicos</h4>
                <p class="text-slate-400 text-xs font-semibold mt-1">Directorio verificado de especialistas de la región.</p>
              </div>
              <v-icon name="bi-chevron-right" class="text-slate-300 group-hover:text-sky-500 transition-colors" />
            </div>

            <div @click="resetBooking(); activeTab = 'schedule'" class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-3xs hover:border-emerald-100 hover:shadow-xs transition-all cursor-pointer flex items-center gap-6 group">
              <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <v-icon name="bi-calendar-event" class="h-6 w-6" />
              </div>
              <div class="flex-1">
                <h4 class="text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">Agendar Cita</h4>
                <p class="text-slate-400 text-xs font-semibold mt-1">Reserva y asegura tu espacio médico en segundos.</p>
              </div>
              <v-icon name="bi-chevron-right" class="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          </div>

          <div class="bg-emerald-50/40 border border-emerald-100/70 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-3xs">
                <v-icon name="ri-capsule-fill" scale="1.2" />
              </div>
              <div>
                <p class="text-xs font-bold text-emerald-800 flex items-center gap-1.5">Farmacia Salud Plus <span class="bg-emerald-500/10 text-emerald-600 font-black text-[8px] px-1.5 py-0.5 rounded-md uppercase">Patrocinado</span></p>
                <p class="text-slate-400 text-xs font-semibold mt-0.5">20% de descuento en medicamentos genéricos • Envío gratis +L500</p>
              </div>
            </div>
            <button class="text-emerald-600 font-black text-xs uppercase tracking-widest hover:text-emerald-800 shrink-0 cursor-pointer">Ver ofertas →</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div @click="activeTab = 'laboratory'" class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-3xs hover:border-blue-100 hover:shadow-xs transition-all cursor-pointer flex items-center gap-6 group">
              <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                <v-icon name="bi-droplet-half" class="h-6 w-6" />
              </div>
              <div class="flex-1">
                <h4 class="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">Mis Laboratorios</h4>
                <p class="text-slate-400 text-xs font-semibold mt-1">Monitorea tus órdenes clínicas y resultados analíticos.</p>
              </div>
              <v-icon name="bi-chevron-right" class="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>

            <div @click="activeTab = 'instituciones'; subViewInstituciones = 'clinicas'; fetchClinicas()" class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-3xs hover:border-purple-100 hover:shadow-xs transition-all cursor-pointer flex items-center gap-6 group">
              <div class="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                <v-icon name="ri-building-fill" class="h-6 w-6" />
              </div>
              <div class="flex-1">
                <h4 class="text-xl font-black text-slate-800 group-hover:text-purple-600 transition-colors">Instituciones</h4>
                <p class="text-slate-400 text-xs font-semibold mt-1">Clínicas, laboratorios autorizados y farmacias integradas.</p>
              </div>
              <v-icon name="bi-chevron-right" class="text-slate-300 group-hover:text-purple-500 transition-colors" />
            </div>
          </div>

          <div class="space-y-4 pt-4 border-t border-slate-100">
            <h5 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Acceso Rápido</h5>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

              <div @click="historyViewMode = 'citas_gestion'; activeTab = 'history'" class="bg-white p-5 rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-3.5 group">
                <v-icon name="bi-calendar-check-fill" class="text-sky-500 h-5 w-5" />
                <span class="text-xs font-black text-slate-700 uppercase tracking-wide group-hover:text-sky-600">
                  Mis Citas Activas
                </span>
              </div>

              <div @click="historyViewMode = 'recetas'; activeTab = 'history'" class="bg-white p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-3.5 group">
                <v-icon name="ri-capsule-fill" class="text-emerald-500 h-5 w-5" />
                <span class="text-xs font-black text-slate-700 uppercase tracking-wide group-hover:text-emerald-600">
                  {{ locale === 'en' ? 'My Prescriptions' : 'Mis Recetas' }}
                </span>
              </div>

              <div @click="activeTab = 'laboratory'" class="bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-3.5 group">
                <v-icon name="bi-droplet-half" class="text-blue-500 h-5 w-5" />
                <span class="text-xs font-black text-slate-700 uppercase tracking-wide group-hover:text-blue-600">
                  {{ locale === 'en' ? 'Labs' : 'Laboratorios' }}
                </span>
              </div>

              <div @click="activeTab = 'configuracion'" class="bg-white p-5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-3.5 group">
                <v-icon name="bi-gear-fill" class="text-slate-400 h-5 w-5" />
                <span class="text-xs font-black text-slate-700 uppercase tracking-wide group-hover:text-slate-600">
                  {{ locale === 'en' ? 'Settings' : 'Configuración' }}
                </span>
              </div>

            </div>
          </div>
        </section>

        <!-- DIRECTORIO MÉDICO -->
        <section v-if="activeTab === 'directory'" class="space-y-8 animate-fade-in">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-4xl font-black text-slate-800 tracking-tight uppercase">Mis Médicos</h2>
              <p class="text-slate-400 font-bold text-xs mt-1">Directorio de médicos verificados en Roatán</p>
            </div>

            <!-- TARJETA INTEGRADORA DE SELECCIÓN DE PACIENTE / DEPENDIENTE -->
            <div v-if="misDependientes.length > 0" class="bg-sky-50 border border-sky-100 p-4 rounded-2xl flex items-center gap-4">
              <div class="w-10 h-10 bg-sky-500 text-white rounded-xl flex items-center justify-center font-black text-sm">
                {{ perfilPacienteActivo.nombre.charAt(0) }}
              </div>
              <div class="text-left">
                <p class="text-[10px] font-black uppercase text-sky-600 tracking-wider">Agendando como:</p>
                <p class="text-sm font-black text-slate-800 leading-tight">
                  {{ perfilPacienteActivo.nombre }}
                  <span class="text-xs font-semibold text-slate-500">
                    {{ perfilPacienteActivo.es_dependiente ? '(Dependiente)' : '(Tutor)' }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-[2.5rem] p-8 shadow-xs border border-slate-100 space-y-5">
            <div class="flex flex-col lg:flex-row gap-4 items-center">
              <div class="flex-1 w-full relative">
                <input v-model="filters.search" type="text" placeholder="Buscar por nombre o especialidad..." class="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 pl-14 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 focus:bg-white transition-all text-slate-700 font-bold placeholder:text-slate-300 text-sm" />
                <v-icon name="bi-search" class="h-5 w-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select v-model="filters.especialidad" class="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 text-slate-700 font-bold text-xs cursor-pointer">
                <option value="">Todas las especialidades</option>
                <option v-for="spec in specialties" :key="spec.EspecialidadID" :value="spec.NombreEspecialidad">
                  {{ spec.NombreEspecialidad }}
                </option>
              </select>

              <select v-model="filters.ordenar" class="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 text-slate-700 font-bold text-xs cursor-pointer">
                <option value="cercania">Más cercano</option>
                <option value="precio-bajo">Precio: menor a mayor</option>
                <option value="precio-alto">Precio: mayor a menor</option>
              </select>
            </div>

            <div class="flex flex-wrap items-center gap-6 pt-1">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <div class="relative">
                  <input type="checkbox" v-model="filters.inmediata" class="sr-only peer" />
                  <div class="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-sky-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                </div>
                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <v-icon name="bi-clock" class="h-3.5 w-3.5 text-sky-500" /> Disponible ahora
                </div>
              </label>

              <label class="flex items-center gap-2 cursor-pointer select-none">
                <div class="relative">
                  <input type="checkbox" v-model="filters.ingles" class="sr-only peer" />
                  <div class="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-sky-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                </div>
                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <v-icon name="bi-translate" class="h-3.5 w-3.5 text-sky-500" /> {{ te('directory.speaksEnglish') ? t('directory.speaksEnglish') : 'Habla inglés' }}
                </div>
              </label>

              <label class="flex items-center gap-2 cursor-pointer select-none">
                <div class="relative">
                  <input type="checkbox" v-model="filters.domicilio" class="sr-only peer" />
                  <div class="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </div>
                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <v-icon name="bi-house-fill" class="h-3.5 w-3.5 text-emerald-500" /> Visita a Domicilio
                </div>
              </label>
            </div>
          </div>

          <div v-if="doctors.length > 0" class="space-y-4">
            <div v-for="doctor in doctors" :key="doctor.DoctorID" class="bg-white rounded-3xl p-6 border border-slate-100 shadow-3xs flex flex-col md:flex-row justify-between items-center gap-6 relative group transition-all hover:border-sky-200/60">

              <div class="flex items-center gap-6 w-full md:flex-1">
                <div class="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner relative border border-slate-100 shrink-0">
                  <v-icon name="ri-stethoscope-line" scale="2" class="text-slate-400" />
                </div>
                <div class="text-left space-y-1 flex-1">
                  <h3 class="text-xl font-black text-slate-800 leading-tight group-hover:text-sky-600 transition-colors">Dr. {{ doctor.Nombre }} {{ doctor.Apellido }}</h3>
                  <p class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ doctor.Especialidad }}</p>

                  <div class="pt-2">
                    <DoctorLocationCard
                      :doctor="doctor"
                      :userLat="userLat"
                      :userLon="userLon"
                    />
                  </div>
                </div>
              </div>

              <button @click="startBooking(doctor)" class="w-full md:w-auto bg-sky-50 hover:bg-sky-100 text-sky-700 px-6 py-2.5 rounded-xl font-black uppercase text-xs transition-all cursor-pointer">
                Agendar
              </button>

            </div>
          </div>
          <div v-else class="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <p class="text-slate-400 font-bold text-sm">No se encontraron doctores que coincidan con los criterios seleccionados.</p>
          </div>
        </section>

        <!-- INSTITUCIONES -->
        <section v-if="activeTab === 'instituciones'" class="space-y-8 animate-fade-in">
          <div v-if="subViewInstituciones === 'clinicas'" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <div v-for="clinica in listaClinicasDB" :key="clinica.EntidadID" class="bg-white rounded-[2.5rem] p-8 text-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs border border-slate-100 hover:border-purple-200 transition-all">
                <div class="flex items-center gap-5">
                  <div class="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 flex items-center justify-center shadow-2xs"><v-icon name="ri-building-fill" scale="1.4" /></div>
                  <div class="text-left"><h3 class="text-2xl font-black tracking-tight text-slate-800">{{ clinica.NombreInstitucion }}</h3></div>
                </div>
                <button @click="seleccionarClinica(clinica)" class="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer">Ver Especialistas →</button>
              </div>
            </div>
          </div>
          <div v-else-if="subViewInstituciones === 'personal_clinica'" class="space-y-6">
            <div v-if="doctorsInClinic.length > 0" class="space-y-4">
              <div v-for="doc in doctorsInClinic" :key="doc.DoctorID" class="bg-white rounded-3xl p-6 border border-slate-100 shadow-3xs flex flex-col md:flex-row justify-between items-center gap-6 relative group transition-all">
                <div class="flex items-center gap-6 w-full md:flex-1">
                  <div class="text-left"><h3 class="text-xl font-black text-slate-800">Dr. {{ doc.Nombre }} {{ doc.Apellido }}</h3></div>
                </div>
                <button @click="startBooking(doc)" class="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-black uppercase text-xs transition-all cursor-pointer shadow-sm">Agendar Cita</button>
              </div>
            </div>
          </div>
        </section>

        <!-- AGENDAR CITA -->
        <section v-if="activeTab === 'schedule'" class="animate-fade-in space-y-6">
          <div v-if="!selectedDoctor" class="space-y-6 w-full text-left">
            <div>
              <h2 class="text-4xl font-black text-slate-800 tracking-tight uppercase">Agendar Nueva Cita</h2>
              <p class="text-slate-400 font-bold text-xs mt-1">Seleccione médico, fecha y hora</p>
            </div>

            <div class="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center space-y-4 min-h-87.5">
              <div class="text-slate-300 flex items-center justify-center">
                <v-icon name="bi-person" scale="3.5" class="text-slate-300" />
              </div>
              <h3 class="text-xl font-black text-slate-800 tracking-tight mt-2">No hay médico seleccionado</h3>
              <p class="text-sm font-bold text-slate-400">Por favor selecciona un médico del directorio primero</p>

              <button
                @click="activeTab = 'directory'"
                class="mt-4 bg-[#005596] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95"
              >
                Volver al Directorio
              </button>
            </div>
          </div>

          <BookingView
            v-else
            :selectedDoctor="selectedDoctor"
            :patientProfile="perfilPacienteActivo"
            :idioma="locale"
            @cancel="resetBooking"
          />
        </section>

        <!-- LABORATORIO -->
        <section v-if="activeTab === 'laboratory'" class="animate-fade-in"><PatientLabView /></section>

        <!-- HISTORIAL Y CITAS -->
        <section v-if="activeTab === 'history'" class="animate-fade-in space-y-6 text-left">

          <div class="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200 shadow-inner w-fit gap-1 mb-2">
            <button
              @click="historyViewMode = historyViewMode === 'citas_gestion' ? 'completo' : historyViewMode"
              :class="historyViewMode !== 'citas_gestion' ? 'bg-white text-purple-600 font-black shadow-xs scale-102' : 'text-slate-500 font-bold hover:text-slate-800'"
              class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2 border-none"
            >
              <v-icon name="bi-folder-fill" scale="0.85" /> Historial Clínico
            </button>
            <button
              @click="historyViewMode = 'citas_gestion'"
              :class="historyViewMode === 'citas_gestion' ? 'bg-white text-[#005596] font-black shadow-xs scale-102' : 'text-slate-500 font-bold hover:text-slate-800'"
              class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2 border-none"
            >
              <v-icon name="bi-calendar-check-fill" scale="0.85" /> Control de Citas
            </button>
          </div>

          <div v-if="historyViewMode === 'citas_gestion'">
            <PatientAppointmentsView />
          </div>
          <div v-else>
            <MedicalHistoryView :usuarioId="Number(idClinicoActivo)" :viewMode="historyViewMode" />
          </div>
        </section>

        <!-- CONFIGURACIÓN -->
        <section v-if="activeTab === 'configuracion'" class="space-y-6 animate-fade-in"><SettingsView /></section>

      </main>

      <footer class="bg-slate-900 text-white/80 py-10 px-12 mt-auto border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold">
        <div>MedGo+ © 2026 Todos los derechos reservados.</div>
      </footer>

    </div>
  </div>

  <!-- MODAL DE AUTO-REGISTRO -->
  <div v-if="showAutoRegistroModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl animate-fade-in">
      <h3 class="text-xl font-bold mb-4 text-slate-800">Crear mi Perfil Clínico</h3>
      <p class="text-slate-500 text-xs font-semibold mb-6">Completa tu información clínica base para poder agendar citas médicas a tu nombre como titular.</p>

      <div class="space-y-4">
        <input v-model="formAutoRegistro.Nombre" placeholder="Nombre" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium text-slate-700" />
        <input v-model="formAutoRegistro.Apellido" placeholder="Apellido" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium text-slate-700" />
        <input v-model="formAutoRegistro.DNI" placeholder="DNI" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium text-slate-700" />
        <input v-model="formAutoRegistro.Telefono" placeholder="Teléfono" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium text-slate-700" />
      </div>

      <div class="flex justify-end mt-8 gap-3">
        <button @click="showAutoRegistroModal = false" class="px-4 py-2 text-slate-400 font-bold hover:text-slate-600 cursor-pointer">Cancelar</button>
        <button @click="ejecutarAutoRegistro" class="bg-sky-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-sky-700 transition cursor-pointer shadow-xs">Confirmar Registro</button>
      </div>
    </div>
  </div>

  <!-- MODAL DE EMANCIPACIÓN -->
  <div v-if="showEmancipateModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl animate-fade-in">
      <h3 class="text-xl font-bold mb-3 text-slate-800">Dar Acceso Propio a tu Hijo</h3>
      <p class="text-slate-500 text-xs font-semibold mb-6">
        Estás independizando el expediente de <span class="text-slate-800 font-black">{{ pacienteActualSeleccionado?.Nombre }}</span>. Podrá entrar a la app con sus propias credenciales y gestionar su historial.
      </p>

      <div class="space-y-4">
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Correo de tu Hijo</label>
          <input v-model="formEmancipacion.email" type="email" placeholder="ejemplo@correo.com" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700" />
        </div>
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Contraseña Temporal</label>
          <input v-model="formEmancipacion.password" type="password" placeholder="Mínimo 6 caracteres" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700" />
        </div>
      </div>

      <div class="flex justify-end mt-8 gap-3">
        <button @click="showEmancipateModal = false" class="px-4 py-2 text-slate-400 font-bold hover:text-slate-600 cursor-pointer">Cancelar</button>
        <button @click="ejecutarEmancipacionTutor" class="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition cursor-pointer shadow-xs">Conceder Cuenta Propia</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import SettingsView from '@/SettingsView.vue';
import api from '@/shared/infrastructure/api';

import DoctorLocationCard from '@/shared/ui/components/DoctorLocationCard.vue';
import { DirectoryRepositoryImpl } from '../infrastructure/DirectoryRepositoryImpl';
import type { Doctor } from '../domain/entities/Doctor';
import type { DoctorFilters } from '../domain/repository/DirectoryRepository';
import BookingView from '@/modules/appointments/ui/BookingView.vue';
import type { PatientExtendedProfile } from '../../patients/domain/entities/Patient';
import MedicalHistoryView from '@/modules/appointments/ui/MedicalHistoryView.vue';
import PatientLabView from '../../laboratories/ui/PatientLabView.vue';

import PatientAppointmentsView from '@/modules/appointments/ui/PatientAppointmentsView.vue';
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import { BiCalendarCheckFill, BiCalendarRangeFill, BiGearFill, BiPeopleFill, BiClock, BiTranslate, BiHouseFill, BiSearch } from 'oh-vue-icons/icons/bi';
addIcons(BiCalendarCheckFill, BiCalendarRangeFill, BiGearFill, BiPeopleFill, BiClock, BiTranslate, BiHouseFill, BiSearch);

interface Clinica { EntidadID: number; NombreInstitucion: string; Descripcion?: string; Direccion?: string; }
interface EntidadBackend { EntidadID: number | string; NombreComercial?: string; Nombre?: string; Descripcion?: string; Direccion?: string; }
type DoctorExtended = Doctor & { CostoConsulta?: number; Precio?: number; costo?: number };

interface Specialty { EspecialidadID: number; NombreEspecialidad: string; }
interface Dependiente {
  UsuarioID?: number | string | null;
  usuario_id?: number | string | null;
  Nombre?: string;
  nombre?: string;
  Telefono?: string;
  telefono?: string;
  Genero?: string;
  genero?: string;
  Edad?: number | string;
  edad?: number | string;
  fecha_nacimiento?: number | string;
  PacienteID?: number | string;
  id?: number | string;
  TutorID?: number | string | null;
  tutor_id?: number | string | null;
  es_dependiente?: number;
  DNI?: string;
  dni?: string;
  TipoSangre?: string;
  tipo_sangre?: string;
}

interface PacienteRecord extends Dependiente {
  Apellido?: string; apellido?: string;
  Aseguradora?: string; aseguradora?: string;
  NumeroPoliza?: string; poliza?: string;
  nombre_contacto_emergencia?: string; NombreContactoEmergencia?: string;
  telefono_contacto_emergencia?: string; TelefonoContactoEmergencia?: string; contacto_emergencia?: string;
}

const userLat = ref(16.3298);
const userLon = ref(-86.5332);

const toast = useToast();
const historyViewMode = ref<'completo' | 'recetas' | 'citas_gestion'>('completo');
const idClinicoActivo = ref<number>(0);

const router = useRouter();
const directoryRepo = new DirectoryRepositoryImpl();
const { t, te, locale } = useI18n();

const doctors = ref<Doctor[]>([]);
const specialties = ref<Specialty[]>([]);
const listaClinicasDB = ref<Clinica[]>([]);
const doctorsInClinic = ref<Doctor[]>([]);
const subViewInstituciones = ref<'clinicas' | 'personal_clinica'>('clinicas');
const clinicaActiva = ref<Clinica | null>(null);

const userData = ref({
  id: 0, nombre: 'Usuario', email: '', telefono: '', genero: '',
  fecha_nacimiento: '', aseguradora: '', poliza: '',
  nombre_contacto_emergencia: '', telefono_contacto_emergencia: ''
});

const userSessionData = ref({ email: '' });
const esTutor = ref(false);
const misDependientes = ref<Dependiente[]>([]);
const pacienteActualSeleccionado = ref<Dependiente | null>(null);

const necesitaPerfilTutor = ref(false);
const showAutoRegistroModal = ref(false);
const showEmancipateModal = ref(false);

const formAutoRegistro = ref({ DNI: '', Nombre: '', Apellido: '', Telefono: '' });
const formEmancipacion = ref({ email: '', password: '' });

const activeTab = ref('home');
const selectedDoctor = ref<Doctor | null>(null);

const tabs = [
  { id: 'directory', label: 'tabs.directory', fallback: 'Directorio', icon: 'bi-people-fill', color: 'text-sky-500' },
  { id: 'instituciones', label: 'tabs.institutions', fallback: 'Instituciones', icon: 'ri-building-fill', color: 'text-purple-500' },
  { id: 'schedule', label: 'tabs.schedule', fallback: 'Agendar', icon: 'bi-calendar-event', color: 'text-emerald-500' },
  { id: 'laboratory', label: 'tabs.laboratory', fallback: 'Laboratorio', icon: 'bi-droplet-half', color: 'text-blue-500' },
  { id: 'history', label: 'tabs.history', fallback: 'Historial', icon: 'bi-folder-fill', color: 'text-purple-500' },
];

const filters = reactive<DoctorFilters & { domicilio?: boolean }>({
  search: '',
  especialidad: '',
  geolocalizacion: false,
  inmediata: false,
  ingles: false,
  domicilio: false,
  ordenar: 'cercania'
});

const perfilPacienteActivo = computed<PatientExtendedProfile>(() => {
  const p = pacienteActualSeleccionado.value;
  if (!p) {
    return {
      id: userData.value.id,
      nombre: userData.value.nombre,
      email: userSessionData.value.email,
      PacienteID: String(userData.value.id),
      UsuarioID: String(userData.value.id),
      DNI: '',
      Nombre: userData.value.nombre,
      Apellido: '',
      Telefono: userData.value.telefono,
      Genero: userData.value.genero,
      Edad: userData.value.fecha_nacimiento,
      TipoSangre: '', // <-- Agregado
      Estado: '1',
      Aseguradora: userData.value.aseguradora || null,
      NumeroPoliza: userData.value.poliza || null,
      nombre_contacto_emergencia: userData.value.nombre_contacto_emergencia || null,
      telefono_contacto_emergencia: userData.value.telefono_contacto_emergencia || null
    };
  }

  const pRecord = p as PacienteRecord;
  const idPaciente = Number(p.PacienteID || p.id || p.UsuarioID || p.usuario_id || userData.value.id || 0);

  return {
    id: idPaciente,
    nombre: String(p.Nombre || p.nombre || userData.value.nombre),
    email: userSessionData.value.email,
    PacienteID: String(p.PacienteID || p.id || idPaciente),
    UsuarioID: String(p.UsuarioID || p.usuario_id || idPaciente),
    DNI: String(pRecord.DNI || pRecord.dni || ''),
    Nombre: String(p.Nombre || p.nombre || ''),
    Apellido: String(pRecord.Apellido || pRecord.apellido || ''),
    Telefono: String(p.Telefono || p.telefono || userData.value.telefono || ''),
    Genero: String(p.Genero || p.genero || userData.value.genero || ''),
    Edad: (p.Edad || p.edad || userData.value.fecha_nacimiento || '') as string | number,
    TipoSangre: String(p.TipoSangre || p.tipo_sangre || ''), // <-- Mapeo del tipo de sangre
    Estado: '1',
    Aseguradora: String(pRecord.Aseguradora || pRecord.aseguradora || userData.value.aseguradora || '') || null,
    NumeroPoliza: String(pRecord.NumeroPoliza || pRecord.poliza || userData.value.poliza || '') || null,
    nombre_contacto_emergencia: String(
      pRecord.nombre_contacto_emergencia ||
      pRecord.NombreContactoEmergencia ||
      userData.value.nombre_contacto_emergencia || ''
    ) || null,
    telefono_contacto_emergencia: String(
      pRecord.telefono_contacto_emergencia ||
      pRecord.TelefonoContactoEmergencia ||
      pRecord.contacto_emergencia ||
      userData.value.telefono_contacto_emergencia || ''
    ) || null,
    es_dependiente: Boolean(p.es_dependiente),
    TutorID: p.TutorID !== undefined && p.TutorID !== null ? Number(p.TutorID) : undefined
  };
});

const fetchClinicas = async () => {
  try {
    const response = await api.get('/entidades');
    const entidades = (response.data || []) as EntidadBackend[];

    listaClinicasDB.value = entidades
      .filter((e: EntidadBackend) => e.EntidadID !== 1 && e.EntidadID !== '1')
      .map((e: EntidadBackend) => ({
        EntidadID: Number(e.EntidadID),
        NombreInstitucion: e.NombreComercial || e.Nombre || 'Clínica Asociada',
        Descripcion: e.Descripcion || 'Centro médico con equipamiento avanzado.',
        Direccion: e.Direccion || 'Área Médica Autorizada'
      }));
  } catch {
    console.warn("Endpoint /entidades no encontrado. Usando respaldo.");
    listaClinicasDB.value = [
      { EntidadID: 2, NombreInstitucion: 'Clínica Médica del Caribe', Descripcion: 'Atención médica de excelencia', Direccion: 'Roatán • Islas de la Bahía' }
    ];
  }
};

const seleccionarClinica = async (clinica: Clinica) => {
  clinicaActiva.value = clinica;
  try {
    const response = await api.get(`/doctores/entidad/${clinica.EntidadID}`);
    doctorsInClinic.value = response.data || [];
  } catch {
    console.warn("Error al obtener personal de la clínica. Cargando listado completo.");
    doctorsInClinic.value = doctors.value;
  } finally {
    subViewInstituciones.value = 'personal_clinica';
  }
};

const seleccionarClinicaDirectaDesdeHome = async (idEntidad: number) => {
  activeTab.value = 'instituciones';
  clinicaActiva.value = {
    EntidadID: idEntidad,
    NombreInstitucion: 'Clínica Médica del Caribe'
  };
  try {
    const response = await api.get(`/doctores/entidad/${idEntidad}`);
    doctorsInClinic.value = response.data || [];
  } catch {
    console.warn("Error directo desde home. Cargando listado completo.");
    doctorsInClinic.value = doctors.value;
  } finally {
    subViewInstituciones.value = 'personal_clinica';
  }
};

const startBooking = (doctor: Doctor) => {
  const docExt = doctor as DoctorExtended;
  selectedDoctor.value = docExt;
  activeTab.value = 'schedule';
};

const resetBooking = () => { selectedDoctor.value = null; };

const esVerdadero = (val: unknown): boolean => {
  return val === true || val === 1 || val === '1' || val === 'true';
};

const searchDoctors = async () => {
  try {
    const data = await directoryRepo.getDoctors(filters);
    let listado = data || [];

    if (filters.ingles) {
      listado = listado.filter((doc) => esVerdadero(doc.HablaIngles));
    }
    if (filters.domicilio) {
      listado = listado.filter((doc) => esVerdadero(doc.DisponibleDomicilio));
    }

    doctors.value = listado;
  } catch (error) {
    console.error("Error consultando doctores", error);
  }
};

const fetchSpecialties = async () => {
  try { const response = await api.get('/especialidades'); specialties.value = response.data || []; }
  catch (error) { console.error("Error especialidades:", error); }
};

const cambiarPacienteSeleccionado = (index: number) => {
  const paciente = misDependientes.value[index];
  if (!paciente) return;

  const idClinico = paciente.PacienteID || paciente.id;

  // Si es el tutor (índice 0) y no tiene PacienteID registrado todavía
  if (!idClinico && index === 0) {
    toast.info("Para agendar citas a tu nombre, primero debes completar tu perfil clínico de paciente.");
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const parsed = JSON.parse(userJson);
      const nombres = (parsed.nombre || '').split(' ');
      formAutoRegistro.value.Nombre = nombres[0] || '';
      formAutoRegistro.value.Apellido = nombres.slice(1).join(' ') || '';
    }
    showAutoRegistroModal.value = true;
    return;
  }

  pacienteActualSeleccionado.value = paciente;
  idClinicoActivo.value = idClinico ? Number(idClinico) : 0;

  const idPaciente = paciente.UsuarioID || paciente.usuario_id;
  if (idPaciente) {
    userData.value.id = Number(idPaciente);
  }

  userData.value.nombre = String(paciente.Nombre || paciente.nombre || userData.value.nombre);
  userData.value.telefono = String(paciente.Telefono || paciente.telefono || '');
  userData.value.genero = String(paciente.Genero || paciente.genero || '');
  userData.value.email = userSessionData.value.email;
  const edadPaciente = paciente.Edad || paciente.edad;
  userData.value.fecha_nacimiento = edadPaciente ? String(edadPaciente) : '';

  if (idClinico) {
    localStorage.setItem('paciente_actual_id', String(idClinico));
  }
};

const evaluarSeleccionPaciente = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (target.value === 'crear_mi_perfil') {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const parsed = JSON.parse(userJson);
      const nombres = (parsed.nombre || '').split(' ');
      formAutoRegistro.value.Nombre = nombres[0] || '';
      formAutoRegistro.value.Apellido = nombres.slice(1).join(' ') || '';
    }
    showAutoRegistroModal.value = true;
    target.value = "0";
  } else {
    cambiarPacienteSeleccionado(Number(target.value));
  }
};

const ejecutarAutoRegistro = async () => {
  if (!formAutoRegistro.value.DNI || !formAutoRegistro.value.Nombre || !formAutoRegistro.value.Apellido || !formAutoRegistro.value.Telefono) {
    toast.warning("Por favor completes todos los campos clínicos requeridos.");
    return;
  }

  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) return;
    const parsed = JSON.parse(userJson);

    await api.post('/pacientes/auto-registro', {
      UsuarioID: Number(parsed.id),
      ...formAutoRegistro.value
    });

    toast.success("¡Tu perfil clínico individual ha sido creado! Ya puedes seleccionarte en el menú superior.");
    showAutoRegistroModal.value = false;
    necesitaPerfilTutor.value = false;

    await loadUser();
  } catch (error: unknown) {
    console.error(error);
    toast.error("Ocurrió un error al intentar crear el perfil clínico. Verifica tu DNI.");
  }
};

const openEmancipateModal = () => {
  formEmancipacion.value = { email: '', password: '' };
  showEmancipateModal.value = true;
};

const ejecutarEmancipacionTutor = async () => {
  if (!formEmancipacion.value.email || !formEmancipacion.value.password) {
    toast.warning("Por favor rellene las credenciales de la nueva cuenta.");
    return;
  }

  try {
    const targetId = pacienteActualSeleccionado.value?.PacienteID || pacienteActualSeleccionado.value?.id;
    if (!targetId) return;

    await api.post(`/pacientes/${targetId}/emancipar`, {
      email: formEmancipacion.value.email,
      password: formEmancipacion.value.password
    });

    toast.success(`¡Felicidades! Se ha creado la cuenta independiente de ${pacienteActualSeleccionado.value?.Nombre}.`);
    showEmancipateModal.value = false;

    await loadUser();
  } catch (error: unknown) {
    console.error(error);
    toast.error("No se pudo procesar la emancipación. Verifica el correo único.");
  }
};

const loadUser = async () => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson);

      userData.value.id = parsed.id;
      userData.value.nombre = parsed.nombre || 'Paciente';
      userSessionData.value.email = parsed.email || '';

      const response = await api.get(`/pacientes/usuario/${parsed.id}`);

      if (response.data) {
        const rootData = response.data;
        const payload = rootData.data || rootData;

        esTutor.value = !!rootData.es_tutor || (Array.isArray(rootData.todos_los_dependientes) && rootData.todos_los_dependientes.length > 0);
        necesitaPerfilTutor.value = !!rootData.necesita_perfil_tutor;

        if (payload && (payload.nombre || payload.Nombre)) {
          userData.value.nombre = String(payload.nombre || payload.Nombre);
        }

        const perfilTutorComoOpcion: Dependiente = {
          id: payload.id ?? payload.PacienteID ?? undefined,
          PacienteID: payload.id ?? payload.PacienteID ?? undefined,
          UsuarioID: payload.usuario_id ?? payload.UsuarioID ?? parsed.id,
          usuario_id: payload.usuario_id ?? payload.UsuarioID ?? parsed.id,
          Nombre: payload.nombre ?? payload.Nombre ?? userData.value.nombre,
          nombre: payload.nombre ?? payload.Nombre ?? userData.value.nombre,
          Telefono: payload.telefono ?? payload.Telefono ?? '',
          telefono: payload.telefono ?? payload.Telefono ?? '',
          Genero: payload.genero ?? payload.Genero ?? '',
          genero: payload.genero ?? payload.Genero ?? '',
          es_dependiente: 0,
          TutorID: null,
          DNI: payload.dni ?? payload.DNI ?? '',
          dni: payload.dni ?? payload.DNI ?? ''
        };

        const dependientesCrudos: Dependiente[] = rootData.todos_los_dependientes || rootData.dependientes || [];

        // TIPADO STRICTO: (d: Dependiente) en lugar de (d: any)
        const dependientesNormalizados: Dependiente[] = dependientesCrudos.map((d: Dependiente) => ({
          id: d.PacienteID ?? d.id,
          PacienteID: d.PacienteID ?? d.id,
          UsuarioID: d.UsuarioID ?? d.usuario_id ?? null,
          usuario_id: d.UsuarioID ?? d.usuario_id ?? null,
          Nombre: d.Nombre ?? d.nombre,
          nombre: d.Nombre ?? d.nombre,
          Telefono: d.Telefono ?? d.telefono ?? '',
          telefono: d.Telefono ?? d.telefono ?? '',
          Genero: d.Genero ?? d.genero ?? '',
          genero: d.Genero ?? d.genero ?? '',
          Edad: d.Edad ?? d.edad ?? d.fecha_nacimiento ?? '',
          edad: d.Edad ?? d.edad ?? d.fecha_nacimiento ?? '',
          es_dependiente: 1,
          TutorID: d.TutorID ?? d.tutor_id ?? 5,
          DNI: d.DNI ?? d.dni ?? ''
        }));

        misDependientes.value = [perfilTutorComoOpcion, ...dependientesNormalizados];

        if (misDependientes.value.length > 0) {
          cambiarPacienteSeleccionado(0);
        }
      }
    } catch (error: unknown) {
      console.warn("Error cargando perfil clínico:", error);
    }
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('paciente_actual_id');
  router.push('/');
};

watch(filters, () => { searchDoctors(); }, { deep: true });
watch(() => filters.ingles, (newVal) => { locale.value = newVal ? 'en' : 'es'; });

onMounted(async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLon.value = pos.coords.longitude;
      },
      (err) => console.warn('Ubicación predeterminada activada (Roatán):', err.message)
    );
  }

  await loadUser();
  await fetchSpecialties();
  await searchDoctors();
  await fetchClinicas();
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* Mini Logo con Efecto 3D y Flotación para el Sidebar */
.contenedor-mini-logo-3d {
  width: 46px;
  height: 46px;
  perspective: 600px;
  animation: miniFlotarImagen 4.5s ease-in-out infinite;
}

.mini-logo-cuerpo-3d {
  width: 100%;
  height: 100%;
  border-radius: 13px;
  padding: 1.5px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.15) 100%);

  /* Sombras y bisel para efecto de volumen miniaturizado */
  box-shadow:
    0 8px 16px rgba(0, 120, 160, 0.22),
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1.5px 3px rgba(255, 255, 255, 0.8);

  transform: rotateX(8deg) rotateY(-5deg);
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Efecto al pasar el cursor sobre el área del logo */
.group\/logo:hover .mini-logo-cuerpo-3d {
  transform: rotateX(0deg) rotateY(0deg) scale(1.06);
  box-shadow:
    0 10px 20px rgba(0, 150, 190, 0.32),
    0 3px 6px rgba(0, 0, 0, 0.1);
}

@keyframes miniFlotarImagen {
  0% { transform: translateY(0px) rotateX(8deg) rotateY(-5deg); }
  50% { transform: translateY(-4px) rotateX(11deg) rotateY(2deg); }
  100% { transform: translateY(0px) rotateX(8deg) rotateY(-5deg); }
}
</style>
