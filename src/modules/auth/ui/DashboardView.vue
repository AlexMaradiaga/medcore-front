<template>
  <div class="min-h-screen bg-[#f1f5f9] text-left font-premium p-8 animate-fade-in select-none">

    <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-8 gap-6">
      <div class="space-y-1">
        <span class="bg-linear-to-r from-[#005596] to-blue-600 text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-xs">

        </span>
        <h2 class="text-4xl font-black text-slate-800 uppercase tracking-tight mt-3">
          Bienvenido, <span class="text-transparent bg-clip-text bg-linear-to-r from-[#005596] to-cyan-600">{{ authStore.user?.nombre || 'Admin' }}</span>
        </h2>
        <p class="text-slate-500 text-xs font-bold flex items-center gap-2 mt-1">
          <v-icon name="bi-gear-fill" scale="0.75" class="text-slate-400 animate-spin-slow" />
          Gestión de infraestructura, credenciales y planes SaaS de MedCore Global
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-4 self-end md:self-center z-40 relative">

        <div class="relative group">
          <button class="px-5 py-3 bg-white text-slate-700 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-transparent shadow-xs flex items-center gap-2.5 hover:border-emerald-400 hover:text-emerald-600 hover:shadow-md transition-all cursor-pointer relative">
            <v-icon name="bi-briefcase-fill" class="text-emerald-500" scale="0.95" />
            Operaciones

            <span v-if="doctoresPendientes.length > 0" class="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-md font-sans">
              {{ doctoresPendientes.length }}
            </span>

            <v-icon name="bi-chevron-down" scale="0.7" class="group-hover:rotate-180 transition-transform duration-200" />
          </button>

          <div class="absolute right-0 pt-2 w-64 hidden group-hover:block animate-slide-up">
            <div class="bg-white border border-slate-100 rounded-3xl shadow-2xl p-2.5 space-y-1 ring-8 ring-black/5">
              <button @click="setTab('alta-pacientes')" :class="activeAdminTab === 'alta-pacientes' ? 'bg-emerald-50 text-emerald-700 font-black ring-1 ring-emerald-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-3 text-xs uppercase rounded-xl transition-all flex items-center gap-3">
                <v-icon name="bi-person-fill" class="text-emerald-500" scale="0.9" /> Alta de Pacientes
              </button>
              <button @click="setTab('usuarios')" :class="activeAdminTab === 'usuarios' ? 'bg-emerald-50 text-emerald-700 font-black ring-1 ring-emerald-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-3 text-xs uppercase rounded-xl transition-all flex items-center gap-3">
                <v-icon name="bi-people-fill" class="text-emerald-500" scale="0.9" /> Usuarios Registrados
              </button>
              <button @click="setTab('doctores')" :class="activeAdminTab === 'doctores' ? 'bg-emerald-50 text-emerald-700 font-black ring-1 ring-emerald-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-3 text-xs uppercase rounded-xl transition-all flex items-center gap-3">
                <v-icon name="gi-stethoscope" class="text-emerald-500" scale="0.9" /> Alta de Doctores
              </button>

              <button @click="setTab('aprobaciones')" :class="activeAdminTab === 'aprobaciones' ? 'bg-emerald-50 text-emerald-700 font-black ring-1 ring-emerald-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-3 text-xs uppercase rounded-xl transition-all flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <v-icon name="bi-check-circle-fill" class="text-emerald-500" scale="0.9" /> Aprobaciones
                </div>
                <span v-if="doctoresPendientes.length > 0" class="bg-rose-100 text-rose-700 text-[9px] font-black px-2 py-0.5 rounded-md font-sans">
                  {{ doctoresPendientes.length }} PEND
                </span>
              </button>

              <button @click="setTab('catalogos')" :class="activeAdminTab === 'catalogos' ? 'bg-emerald-50 text-emerald-700 font-black ring-1 ring-emerald-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-3 text-xs uppercase rounded-xl transition-all flex items-center gap-3">
                <v-icon name="bi-folder-fill" class="text-emerald-500" scale="0.9" /> Catálogos Especialidad
              </button>
              <button @click="setTab('planes')" :class="activeAdminTab === 'planes' ? 'bg-emerald-50 text-emerald-700 font-black ring-1 ring-emerald-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-3 text-xs uppercase rounded-xl transition-all flex items-center gap-3">
                <v-icon name="bi-credit-card-fill" class="text-emerald-500" scale="0.9" /> Suscripciones SaaS
              </button>
            </div>
          </div>
        </div>

        <div class="relative group">
          <button class="px-5 py-3 bg-linear-to-br from-[#005596] to-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-900/10 flex items-center gap-2.5 hover:brightness-110 transition-all cursor-pointer">
            <v-icon name="bi-bar-chart-fill" scale="0.95" />
            Auditoría de Calidad
            <v-icon name="bi-chevron-down" scale="0.7" class="group-hover:rotate-180 transition-transform duration-200" />
          </button>

          <div class="absolute right-0 pt-2 w-72 hidden group-hover:block animate-slide-up z-50">
            <div class="bg-white border border-slate-100 rounded-3xl shadow-2xl p-2.5 space-y-1 ring-8 ring-black/5">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-2 pb-1">Visualizar en Panel</p>
              <button @click="setTab('resumen')" :class="activeAdminTab === 'resumen' ? 'bg-blue-50 text-[#005596] font-black ring-1 ring-blue-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-2.5 text-xs uppercase rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-graph-up" class="text-blue-600" scale="0.9" /> Módulo Estadístico Base
              </button>
              <button @click="setTab('ind-seguridad')" :class="activeAdminTab === 'ind-seguridad' ? 'bg-blue-50 text-[#005596] font-black ring-1 ring-blue-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-2.5 text-xs uppercase rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-shield-fill-check" class="text-[#005596]" scale="0.9" /> Indicadores de Seguridad
              </button>
              <button @click="setTab('ind-eficiencia')" :class="activeAdminTab === 'ind-eficiencia' ? 'bg-blue-50 text-[#005596] font-black ring-1 ring-blue-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-2.5 text-xs uppercase rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-clock-history" class="text-emerald-500" scale="0.9" /> Eficiencia y Tiempos
              </button>
              <button @click="setTab('ind-paciente')" :class="activeAdminTab === 'ind-paciente' ? 'bg-blue-50 text-[#005596] font-black ring-1 ring-blue-100' : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900'" class="w-full text-left px-4 py-2.5 text-xs uppercase rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-heart-fill" class="text-rose-500" scale="0.9" /> Relación con Paciente
              </button>

              <div class="border-t border-slate-100 my-2"></div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-1 pb-1">Generar Reporte Impreso</p>

              <button @click="emitirReporteEjecutivo('general')" class="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#005596] rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-file-earmark-text-fill" class="text-slate-400" scale="0.9" /> Consolidado Clínico General
              </button>
              <button @click="emitirReporteEjecutivo('seguridad')" class="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-shield-fill-check" class="text-blue-500" scale="0.9" /> Reporte Seguridad Clínica
              </button>
              <button @click="emitirReporteEjecutivo('eficiencia')" class="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-clock-history" class="text-emerald-500" scale="0.9" /> Reporte Eficiencia y Tiempos
              </button>
              <button @click="emitirReporteEjecutivo('pacientes')" class="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-heart-fill" class="text-rose-500" scale="0.9" /> Reporte Relación Paciente
              </button>
              <button @click="emitirReporteEjecutivo('saas-general')" class="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-file-earmark-text-fill" class="text-indigo-500" scale="0.9" /> Auditoría Global Licencias SaaS
              </button>
              <button @click="emitirReporteEjecutivo('saas-plan')" class="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-all flex items-center gap-3 cursor-pointer">
                <v-icon name="bi-credit-card-fill" class="text-purple-500" scale="0.9" /> Distribución Comercial por Plan
              </button>
            </div>
          </div>
        </div>

        <button
          @click="handleLogout"
          title="Cerrar Sesión"
          class="p-4 bg-linear-to-br from-red-500 to-rose-600 text-white rounded-2xl shadow-md shadow-red-200 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border-none"
        >
          <v-icon name="bi-box-arrow-right" scale="1.1" class="text-white" />
        </button>
      </div>
    </header>

    <IndicadoresAuditoria v-if="activeAdminTab.startsWith('ind-')" :subTab="activeAdminTab" />

    <div v-if="activeAdminTab === 'resumen'" class="space-y-8 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-7 rounded-4xl shadow-xs border-b-4 border-teal-500 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
          <div class="space-y-1">
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Pacientes</p>
            <p v-if="!loadingAnalytics" class="text-4xl font-black text-slate-800 tracking-tight">{{ totalPacientesContados }}</p>
            <p v-else class="animate-pulse text-slate-200 text-4xl font-black">...</p>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
            <v-icon name="bi-person-fill" scale="1.3" />
          </div>
        </div>

        <div class="bg-white p-7 rounded-4xl shadow-xs border-b-4 border-blue-500 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
          <div class="space-y-1">
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">Citas Totales</p>
            <p v-if="!loadingAnalytics" class="text-4xl font-black text-slate-800 tracking-tight">{{ totalCitasRegistradas }}</p>
            <p v-else class="animate-pulse text-slate-200 text-4xl font-black">...</p>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
            <v-icon name="bi-calendar-event" scale="1.3" />
          </div>
        </div>

        <div class="bg-white p-7 rounded-4xl shadow-xs border-b-4 border-rose-500 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
          <div class="space-y-1">
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">Tasa Cancelación</p>
            <p v-if="!loadingAnalytics" class="text-4xl font-black text-rose-600 tracking-tight">{{ tasaCancelacionGeneral }}%</p>
            <p v-else class="animate-pulse text-slate-200 text-4xl font-black">...</p>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
            <v-icon name="bi-graph-down" scale="1.3" />
          </div>
        </div>

        <div class="bg-white p-7 rounded-4xl shadow-xs border-b-4 border-emerald-500 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
          <div class="space-y-1">
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">Ingreso Estimado</p>
            <p v-if="!loadingAnalytics" class="text-4xl font-black text-emerald-600 tracking-tight">$ {{ totalIngresosAcumulados }}</p>
            <p v-else class="animate-pulse text-slate-200 text-4xl font-black">...</p>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <v-icon name="bi-cash-stack" scale="1.3" />
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-4xl border border-slate-100 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-50 text-[#005596] rounded-2xl shadow-inner"><v-icon name="bi-cpu-fill" scale="1.2" /></div>
          <div>
            <h4 class="text-sm font-black text-slate-800 uppercase tracking-tight">Estructura Dinámica del Funnel</h4>
            <p class="text-[10px] text-slate-400 font-bold">Modifica la geometría espacial del renderizado analítico en caliente</p>
          </div>
        </div>
        <div class="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <button @click="tipoGraficoInteractivo = 'bar'" :class="tipoGraficoInteractivo === 'bar' ? 'bg-white text-[#005596] font-black shadow-md scale-105' : 'text-slate-400 font-bold hover:text-slate-600'" class="px-4 py-2.5 text-[10px] uppercase rounded-xl cursor-pointer transition-all">📊 Histograma</button>
          <button @click="tipoGraficoInteractivo = 'donut'" :class="tipoGraficoInteractivo === 'donut' ? 'bg-white text-[#005596] font-black shadow-md scale-105' : 'text-slate-400 font-bold hover:text-slate-600'" class="px-4 py-2.5 text-[10px] uppercase rounded-xl cursor-pointer transition-all">🍩 Pastel 3D</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xs hover:shadow-xl transition-shadow duration-300">
          <h4 class="text-sm font-black text-slate-700 uppercase tracking-wide mb-6 flex items-center gap-2">
            <v-icon name="bi-filter-square-fill" class="text-blue-500" /> Funnel de Conversión Analítico
          </h4>
          <div v-if="!loadingAnalytics">
            <apexchart :type="tipoGraficoInteractivo" height="320" :options="chartFunnelOptions" :series="chartFunnelSeries" />
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xs hover:shadow-xl transition-shadow duration-300">
          <h4 class="text-sm font-black text-slate-700 uppercase tracking-wide mb-6 flex items-center gap-2">
            <v-icon name="bi-activity" class="text-emerald-500" /> Evolución de Demanda e Ingresos
          </h4>
          <div v-if="!loadingAnalytics">
            <apexchart type="line" height="320" :options="chartEvolucionOptions" :series="chartEvolucionSeries" />
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xs hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
          <h4 class="text-sm font-black text-slate-700 uppercase tracking-wide mb-6 flex items-center gap-2">
            <v-icon name="bi-clock-history" class="text-indigo-500" /> Mapa Térmico de Demanda de Agendas
          </h4>
          <div v-if="!loadingAnalytics">
            <apexchart type="heatmap" height="320" :options="chartHeatmapOptions" :series="chartHeatmapSeries" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] border border-slate-50 shadow-xs p-8">
        <h4 class="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">Métricas Críticas de Inasistencias (No-Show Rate)</h4>
        <p class="text-xs text-slate-400 font-bold mb-6">Patrones financieros e impacto operacional por profesional médico</p>

        <div class="overflow-x-auto rounded-2xl border border-slate-100">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/70 text-slate-400 font-black text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th class="p-5">Profesional Médico</th>
                <th class="p-5 text-center">Citas Asignadas</th>
                <th class="p-5 text-center">Canceladas</th>
                <th class="p-5 text-center text-rose-600">Inasistencias (No-Show)</th>
                <th class="p-5 text-center">Eficiencia de Agenda</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-xs font-medium text-slate-600">
              <tr v-for="item in analyticsData.profesionales" :key="item.Profesional" class="hover:bg-slate-50/60 transition-colors">
                <td class="p-5 font-black text-slate-700 uppercase tracking-tight">{{ item.Profesional }}</td>
                <td class="p-5 text-center font-bold">{{ item.TotalCitas }}</td>
                <td class="p-5 text-center text-amber-600 font-mono font-bold">{{ item.Cancelaciones }}</td>
                <td class="p-5 text-center text-rose-600 font-mono font-black">{{ item.Inasistencias }}</td>
                <td class="p-5 text-center">
                  <span class="px-3 py-1.5 rounded-xl font-black shadow-3xs" :class="((item.TotalCitas - item.Inasistencias) / item.TotalCitas * 100) > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'">
                    {{ ((item.TotalCitas - item.Inasistencias) / Math.max(1, item.TotalCitas) * 100).toFixed(0) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="activeAdminTab === 'usuarios'" class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 space-y-8 animate-fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div class="space-y-1">
          <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <v-icon name="bi-people-fill" class="text-[#005596]" scale="1.1" />
            Control de Usuarios Registrados
          </h3>
          <p class="text-xs text-slate-400 font-bold">Auditoría transaccional de accesos, perfiles institucionales y estados en SQL Server</p>
        </div>

        <div class="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
          <button @click="cambiarFiltroRol(2)" :class="subFiltroRol === 2 ? 'bg-white text-[#005596] font-black shadow-sm ring-1 ring-black/5 scale-102' : 'text-slate-400 font-bold hover:text-slate-600'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
            <v-icon name="gi-stethoscope" scale="0.85" /> Médicos Especialistas
          </button>
          <button @click="cambiarFiltroRol(3)" :class="subFiltroRol === 3 ? 'bg-white text-teal-600 font-black shadow-sm ring-1 ring-black/5 scale-102' : 'text-slate-400 font-bold hover:text-slate-600'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
            <v-icon name="bi-person-fill" scale="0.85" /> Expedientes Pacientes
          </button>
        </div>
      </div>

      <div v-if="loadingUsuarios" class="py-16 text-center">
        <div class="animate-spin inline-block w-10 h-10 border-4 border-[#005596] border-t-transparent rounded-full shadow-xs"></div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Consultando bases de datos corporativas...</p>
      </div>

      <div v-else class="overflow-x-auto rounded-3xl shadow-xl border border-slate-200">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-100 text-slate-500 font-black text-[11px] uppercase tracking-wider border-b border-slate-200">
              <th class="p-5 text-center w-20 rounded-tl-3xl">ID</th>
              <th class="p-5">Identificación / Nombre Completo</th>
              <th class="p-5">Correo Electrónico Corporativo</th>
              <th class="p-5 w-45 text-center">Rol Asignado</th>
              <th class="p-5 text-center w-36">Estado Cuenta</th>
              <th class="p-5 text-center w-44 rounded-tr-3xl">Acciones Críticas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm font-medium text-slate-600 bg-white">
            <tr v-for="user in listaUsuarios" :key="user.UsuarioID" class="hover:bg-blue-50/40 transition-all duration-150">
              <td class="p-5 text-center font-mono font-black text-slate-400 bg-slate-50/40 text-xs">{{ String(user.UsuarioID).padStart(4, '0') }}</td>
              <td class="p-5 font-black text-slate-800 uppercase tracking-tight text-xs">{{ user.NombreCompleto }}</td>
              <td class="p-5 font-mono text-xs text-slate-500 font-semibold">{{ user.Email }}</td>
              <td class="p-5">
                <span :class="user.RolID === 1 ? 'bg-purple-50 text-purple-600 border-purple-100' : user.RolID === 2 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-teal-50 text-teal-600 border-teal-100'" class="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg border block text-center shadow-3xs">
                  {{ user.NombreRol }}
                </span>
              </td>
              <td class="p-5 text-center">
                <span :class="user.Estado == 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase border tracking-wider shadow-3xs">
                  {{ user.Estado == 1 ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="p-5 text-center">
                <button @click="conmutarEstadoUsuario(user)" :class="user.Estado == 1 ? 'bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white border-amber-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border-emerald-200'" class="px-4 py-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer uppercase tracking-tight shadow-3xs">
                  {{ user.Estado == 1 ? '🚫 Suspender' : '⚡ Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeAdminTab === 'alta-pacientes'" class="max-w-2xl mx-auto animate-fade-in">
      <RegisterPatientForm @success="setTab('resumen')" />
    </div>

    <div v-if="activeAdminTab === 'aprobaciones'" class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 space-y-6 animate-fade-in text-left">
      <div class="border-b border-slate-100 pb-4">
        <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
          <v-icon name="bi-check-circle-fill" class="text-emerald-500" scale="1.1" />
          Módulo de Auditoría y Alta Médica
        </h3>
        <p class="text-xs text-slate-400 font-bold uppercase mt-1">Verificación cruzada de credenciales, fotografía clínica y documentación legal indexada</p>
      </div>

      <div v-if="doctoresPendientes.length === 0" class="py-16 text-center text-slate-400 font-black uppercase tracking-widest text-xs bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <v-icon name="bi-shield-fill-check" scale="2.0" class="text-slate-300 mb-2 block mx-auto" />
        No se registran solicitudes de alta pendientes en la cola de auditoría.
      </div>

      <div v-else class="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-wider border-b border-slate-200">
              <th class="p-5 w-24">Foto</th>
              <th class="p-5">Médico / Especialidad</th>
              <th class="p-5">Nº Colegiación</th>
              <th class="p-5 text-center">Expediente Digital (Auditar Enlaces)</th>
              <th class="p-5 text-center w-36">Acción Final</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs font-medium text-slate-600 bg-white">
            <tr v-for="doc in doctoresPendientes" :key="doc.DoctorID" class="hover:bg-slate-50/50 transition-colors">

              <td class="p-5">
                <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-2xs flex items-center justify-center">
                  <img v-if="doc.RutaFoto" :src="'http://localhost:8000/storage/' + doc.RutaFoto" class="w-full h-full object-cover" />
                  <v-icon v-else name="bi-person-fill" class="text-slate-300" scale="1.2" />
                </div>
              </td>

              <td class="p-5">
                <p class="font-black text-slate-800 uppercase text-sm tracking-tight">Dr. {{ doc.Nombre }} {{ doc.Apellido }}</p>
                <span class="text-[10px] font-bold text-slate-400 uppercase">Especialidad Código: {{ doc.EspecialidadID }}</span>
              </td>

              <td class="p-5 font-mono font-bold uppercase text-slate-700 tracking-wider">
                {{ doc.NumeroColegiado }}
              </td>

              <td class="p-5">
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <a v-if="doc.RutaTituloMedico" :href="'http://localhost:8000/storage/' + doc.RutaTituloMedico" target="_blank" class="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-3xs">
                    📜 M. General
                  </a>
                  <a v-if="doc.RutaTituloEspecialista" :href="'http://localhost:8000/storage/' + doc.RutaTituloEspecialista" target="_blank" class="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-3xs">
                    🎓 Especialidad
                  </a>
                  <a v-if="doc.RutaConstanciaColegio" :href="'http://localhost:8000/storage/' + doc.RutaConstanciaColegio" target="_blank" class="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-3xs">
                    🏥 CMH Valido
                  </a>
                  <a v-if="doc.RutaDni" :href="'http://localhost:8000/storage/' + doc.RutaDni" target="_blank" class="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-3xs">
                    🪪 DNI / ID
                  </a>
                </div>
              </td>

              <td class="p-5 text-center">
                <button @click="aprobarDoctor(doc.DoctorID)" class="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md cursor-pointer transition-all active:scale-97 flex items-center justify-center gap-1">
                  <v-icon name="bi-check-circle-fill" scale="0.8" /> Autorizar Alta
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeAdminTab === 'doctores'" class="max-w-2xl mx-auto animate-fade-in relative">
      <!-- Pasamos la entidad base por defecto '2' requerida para el alta inicial -->
      <RegisterDoctorForm :entidadId="2" @success="setTab('resumen')" />
    </div>

    <div v-if="activeAdminTab === 'catalogos'" class="animate-fade-in bg-white p-8 rounded-[2.5rem] shadow-xs">
      <SpecialtyClinicManager />
    </div>

    <div v-if="activeAdminTab === 'planes'" class="space-y-8 animate-fade-in">
      <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="space-y-1">
          <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2.5">
            <v-icon name="bi-credit-card-fill" class="text-blue-600" scale="1.1" />
            Monitoreo Estratégico de Suscripciones SaaS
          </h3>
          <p class="text-xs text-slate-400 font-bold">Auditoría en tiempo real de recaudos comerciales, planes activos y flujos de pasarela de pago</p>
        </div>
        <button @click="cargarDatosMonitoreoSaaS" class="px-5 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-2">
          🔄 Sincronizar Pasarela
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">Ingreso Recurrente (MRR)</p>
            <p class="text-2xl font-black text-slate-800 font-mono">$ {{ saasMonitorData.kpis.MRR }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-3xs"><v-icon name="bi-cash-stack" scale="1.1" /></div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">Premium Activos</p>
            <p class="text-2xl font-black text-emerald-600 font-mono">{{ saasMonitorData.kpis.PremiumActivos }} Entidades</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-3xs"><v-icon name="fa-crown" scale="1.1" /></div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">Planes Gratuitos</p>
            <p class="text-2xl font-black text-slate-500 font-mono">{{ saasMonitorData.kpis.PlanesGratis }} Base</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shadow-3xs"><v-icon name="bi-star-fill" scale="1.1" /></div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">Alertas de Expiración</p>
            <p class="text-2xl font-black text-rose-600 font-mono">{{ saasMonitorData.kpis.PorVencer }} Críticos</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-3xs"><v-icon name="bi-lightning-charge-fill" scale="1.1" /></div>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <v-icon name="gi-stethoscope" class="text-teal-600" scale="1.1" /> Estatus de Licencias: Médicos Especialistas
            </h4>
            <p class="text-xs text-slate-400 font-bold">Profesionales independientes en control clínico autónomo</p>
          </div>
          <span class="text-[10px] font-black bg-teal-50 text-teal-600 px-3 py-1 rounded-full uppercase">Total: {{ medicosFiltrados.length }}</span>
        </div>
        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-500 font-black text-[11px] uppercase tracking-wider border-none">
                <th class="p-4">Giro / Entidad</th>
                <th class="p-4">Razón Social Auditada</th>
                <th class="p-4 text-center">Plan de Licencia</th>
                <th class="p-4 text-center">Tarifa Recurrente</th>
                <th class="p-4 text-center">Tiempo Restante</th>
                <th class="p-4 text-center">Estatus</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-600 bg-white">
              <tr v-for="item in medicosPaginados" :key="item.UsuarioID" class="hover:bg-slate-50/70 transition-colors">
                <td class="p-4 font-black text-[10px] uppercase"><span class="px-2.5 py-1 rounded-lg shadow-3xs bg-teal-50 text-teal-600">{{ item.TipoEntidad }}</span></td>
                <td class="p-4 font-black text-slate-700 uppercase tracking-tight">{{ item.RazonSocial }}</td>
                <td class="p-4 text-center font-bold text-slate-500 tracking-wide">{{ item.PlanAsignado }}</td>
                <td class="p-4 text-center font-mono font-black text-slate-800">$ {{ Number(item.MontoLicencia).toFixed(2) }}</td>
                <td class="p-4 text-center font-medium">
                  <span :class="item.DiasRestantes <= 7 ? 'text-rose-600 font-black' : 'text-slate-500'">{{ item.PlanAsignado === 'Gratis' ? 'Indefinido' : `En ${item.DiasRestantes} días` }}</span>
                </td>
                <td class="p-4 text-center"><span :class="item.EstadoSaaS == 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'" class="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider shadow-3xs">{{ item.EstadoSaaS == 1 ? 'Activo' : 'Suspendido' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-between items-center pt-4 border-t border-slate-50 mt-2">
          <button :disabled="paginaMedicos === 1" @click="paginaMedicos--" class="px-4 py-2 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-30">Anterior</button>
          <span class="text-[10px] font-bold text-slate-400 uppercase">Página {{ paginaMedicos }} de {{ totalPaginasMedicos }}</span>
          <button :disabled="paginaMedicos === totalPaginasMedicos" @click="paginaMedicos++" class="px-4 py-2 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-30">Siguiente</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SpecialtyClinicManager from '@/modules/directory/ui/SpecialtyClinicManager.vue';
import IndicadoresAuditoria from '../../admin/components/IndicadoresAuditoria.vue';
import api from '@/shared/infrastructure/api';
import { ReportRepository } from '../../admin/infrastructure/ReportRepository';
import type { DashboardAnalyticsResponse, UsuarioAdminContract } from '../../admin/domain/Analytics';
import RegisterPatientForm from '@/shared/ui/components/RegisterPatientForm.vue';

import RegisterDoctorForm from '@/shared/ui/components/RegisterDoctorForm.vue';
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiBoxArrowRight, BiChevronDown, BiBriefcaseFill, BiPeopleFill,
  BiCheckCircleFill, BiFolderFill, BiCreditCardFill, BiBarChartFill,
  BiGraphUp, BiShieldFillCheck, BiHeartFill, BiPersonFill,
  BiCalendarEvent, BiGraphDown, BiCashStack, BiClockHistory, BiCpuFill, BiFilterSquareFill, BiActivity, BiGearFill,
  BiFileEarmarkTextFill, BiStarFill, BiLightningChargeFill
} from 'oh-vue-icons/icons';
import { GiStethoscope, FaCrown} from 'oh-vue-icons/icons';

addIcons(
  BiBoxArrowRight, BiChevronDown, BiBriefcaseFill, BiPeopleFill,
  BiCheckCircleFill, BiFolderFill, BiCreditCardFill, BiBarChartFill,
  BiGraphUp, BiShieldFillCheck, BiHeartFill, BiPersonFill,
  BiCalendarEvent, BiGraphDown, BiCashStack, BiClockHistory, GiStethoscope,
  BiCpuFill, BiFilterSquareFill, BiActivity, BiGearFill, BiFileEarmarkTextFill,
  BiStarFill, BiLightningChargeFill, FaCrown
);

interface DoctorPendienteContract {
  DoctorID: number;
  Nombre: string;
  Apellido: string;
  EspecialidadID: number;
  NumeroColegiado: string;
  RutaFoto: string | null;
  RutaTituloMedico: string | null;
  RutaTituloEspecialista: string | null;
  RutaConstanciaColegio: string | null;
  RutaDni: string | null;
}

interface SuscripcionSaaSContract {
  UsuarioID: number;
  RazonSocial: string;
  TipoEntidad: string;
  PlanAsignado: string;
  MontoLicencia: number;
  DiasRestantes: number;
  EstadoSaaS: number;
}

interface TransaccionSaaSContract {
  TransaccionID: string;
  RazonSocial: string;
  PlanPagado: string;
  MontoFacturado: number;
  FechaPago: string;
}

interface MonitorSaaSContainer {
  kpis: { MRR: string; PremiumActivos: number; PlanesGratis: number; PorVencer: number };
  suscripciones: SuscripcionSaaSContract[];
  transacciones: TransaccionSaaSContract[];
}

const authStore = useAuthStore();
const reportesInfraestructura = new ReportRepository();
const toast = useToast();
const router = useRouter();

const activeAdminTab = ref<string>('resumen');
const subFiltroRol = ref<number | null>(2);

const loadingAnalytics = ref<boolean>(true);
const loadingUsuarios = ref<boolean>(false);
const tipoGraficoInteractivo = ref<string>('bar');

const listaUsuarios = ref<UsuarioAdminContract[]>([]);
const doctoresPendientes = ref<DoctorPendienteContract[]>([]);
const analyticsData = ref<DashboardAnalyticsResponse>({
  funnel: [], pacientes: [], heatmap: [], evolucion: [], profesionales: []
});

const totalCitasRegistradas = computed<number>(() => analyticsData.value.funnel.reduce((acc, curr) => acc + Number(curr.cantidad), 0));
const totalPacientesContados = computed<number>(() => analyticsData.value.pacientes.reduce((acc, curr) => acc + Number(curr.Total), 0));
const totalIngresosAcumulados = computed<string>(() => analyticsData.value.evolucion.reduce((acc, curr) => acc + Number(curr.FacturacionTotal), 0).toFixed(0));

const tasaCancelacionGeneral = computed<string>(() => {
  const canceladas = analyticsData.value.funnel.find(f => f.estado.toUpperCase() === 'CANCELADA')?.cantidad || 0;
  const totales = totalCitasRegistradas.value;
  return totales === 0 ? '0' : ((Number(canceladas) / totales) * 100).toFixed(1);
});

const setTab = (tabId: string) => {
  activeAdminTab.value = tabId;
};

const chartFunnelSeries = computed(() => {
  if (tipoGraficoInteractivo.value === 'donut') {
    return analyticsData.value.funnel.map(f => Number(f.cantidad));
  }
  return [{ name: 'Consultas', data: analyticsData.value.funnel.map(f => Number(f.cantidad)) }];
});

const chartFunnelOptions = computed(() => {
  const baseOptions = {
    chart: { dropShadow: { enabled: true, top: 8, left: 0, blur: 8, opacity: 0.1 }, toolbar: { show: false } },
    colors: ['#0ea5e9', '#10b981', '#f59e0b', '#f43f5e'],
  };
  if (tipoGraficoInteractivo.value === 'donut') {
    return {
      ...baseOptions,
      labels: analyticsData.value.funnel.map(f => f.estado.toUpperCase()),
      plotOptions: { pie: { donut: { size: '70%', labels: { show: true, total: { show: true, label: 'TOTAL' } } } } }
    };
  }
  return {
    ...baseOptions,
    plotOptions: { bar: { borderRadius: 8, horizontal: false, distributed: true, columnWidth: '55%' } },
    xaxis: { categories: analyticsData.value.funnel.map(f => f.estado.toUpperCase()) },
    dataLabels: { enabled: false }
  };
});

const chartEvolucionSeries = computed(() => [
  { name: 'Citas Concluidas', type: 'area', data: analyticsData.value.evolucion.map(e => Number(e.TotalCitas)) },
  { name: 'Facturación ($)', type: 'line', data: analyticsData.value.evolucion.map(e => Number(e.FacturacionTotal)) }
]);
const chartEvolucionOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  stroke: { width: [2, 4], curve: 'smooth' },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 } },
  colors: ['#3b82f6', '#10b981'],
  xaxis: { categories: analyticsData.value.evolucion.map(e => `Mes ${e.Mes}/${e.Anio}`) },
  yaxis: [{ title: { text: 'Volumen de Citas' } }, { opposite: true, title: { text: 'Ingresos USD ($)' } }]
}));

const chartHeatmapSeries = computed(() => {
  const diasLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return diasLabels.map((dia, idx) => {
    const diaNum = idx + 1;
    const horasData = Array.from({ length: 11 }, (_, i) => {
      const horaTarget = i + 7;
      const matchingRecord = analyticsData.value.heatmap.find(h => Number(h.DiaSemana) === diaNum && Number(h.HoraDia) === horaTarget);
      return { x: `${horaTarget}:00`, y: matchingRecord ? Number(matchingRecord.TotalCitas) : 0 };
    });
    return { name: dia, data: horasData };
  });
});
const chartHeatmapOptions = ref({ chart: { type: 'heatmap', toolbar: { show: false } }, dataLabels: { enabled: false }, colors: ["#005596"] });

const cargarMatrizAnalitica = async () => {
  loadingAnalytics.value = true;
  try {
    analyticsData.value = await reportesInfraestructura.obtenerMatrizAnalitica();
  } catch {
    toast.error("No se pudo sincronizar la matriz de gráficos de MedCore.");
  } finally {
    loadingAnalytics.value = false;
  }
};

const cargarUsuariosSegmentados = async () => {
  loadingUsuarios.value = true;
  try {
    const url = subFiltroRol.value ? `admin/usuarios/agrupados?rol_id=${subFiltroRol.value}` : 'admin/usuarios/agrupados';
    const response = await api.get(url);
    listaUsuarios.value = response.data.data;
  } catch {
    toast.error("Error al segmentar el listado de usuarios.");
  } finally {
    loadingUsuarios.value = false;
  }
};

const conmutarEstadoUsuario = async (user: UsuarioAdminContract) => {
  const nuevoEstado = user.Estado == 1 ? 0 : 1;
  const textoInformativo = nuevoEstado === 0 ? 'suspendido' : 'activado';
  try {
    await reportesInfraestructura.actualizarEstadoUsuario(user.UsuarioID, nuevoEstado);
    user.Estado = nuevoEstado;
    toast.success(`Usuario ${user.NombreCompleto} ha sido ${textoInformativo} con éxito.`);
  } catch {
    toast.error("No se pudo mutar el estado transaccional en SQL Server.");
  }
};

const cargarDoctoresPendientes = async () => {
  try {
    const res = await api.get('admin/doctores-pendientes');
    doctoresPendientes.value = res.data;
  } catch {
    toast.error('Error al cargar solicitudes pendientes');
  }
};

const aprobarDoctor = async (id: number) => {
  try {
    await api.put('admin/doctores/' + id + '/aprobar');
    toast.success('Doctor aprobado exitosamente.');
    await cargarDoctoresPendientes();
  } catch (error) {
    console.error(error);
    toast.error('No se pudo aprobar al doctor.');
  }
};

const cambiarFiltroRol = (rol: number | null) => {
  subFiltroRol.value = rol;
  cargarUsuariosSegmentados();
};

const handleLogout = () => {
  toast.warning("Desconectando sesión segura del Panel de Control...", {
    timeout: 2000,
    onClose: () => {
      localStorage.clear();
      router.push('/');
    }
  });
};

const emitirReporteEjecutivo = (tipoReporte: string) => {
  const routeData = router.resolve({ path: '/reporte-ejecutivo', query: { tipo: tipoReporte } });
  window.open(routeData.href, '_blank');
};

const saasMonitorData = ref<MonitorSaaSContainer>({
  kpis: { MRR: "0.00", PremiumActivos: 0, PlanesGratis: 0, PorVencer: 0 },
  suscripciones: [], transacciones: []
});

const cargarDatosMonitoreoSaaS = async () => {
  try {
    const response = await api.get('admin/saas/monitoreo');
    if (response.data && response.data.status === 'success') {
      saasMonitorData.value = response.data.data;
    }
  } catch {
    toast.error("Error al sincronizar el estado transaccional SaaS.");
  }
};

watch(activeAdminTab, (nuevaTab: string) => {
  if (nuevaTab === 'usuarios') cargarUsuariosSegmentados();
  if (nuevaTab === 'resumen') cargarMatrizAnalitica();
  if (nuevaTab === 'aprobaciones') cargarDoctoresPendientes();
  if (nuevaTab === 'planes') cargarDatosMonitoreoSaaS();
});

const paginaMedicos = ref<number>(1);
const itemsPorPagina = 5;

watch(() => saasMonitorData.value.suscripciones, () => {
  paginaMedicos.value = 1;
});

const medicosFiltrados = computed(() => saasMonitorData.value.suscripciones.filter((item: SuscripcionSaaSContract) => item.TipoEntidad.toLowerCase().includes('médico') || item.TipoEntidad.toLowerCase().includes('profesional')));
const medicosPaginados = computed(() => { const inicio = (paginaMedicos.value - 1) * itemsPorPagina; return medicosFiltrados.value.slice(inicio, inicio + itemsPorPagina); });
const totalPaginasMedicos = computed(() => Math.ceil(medicosFiltrados.value.length / itemsPorPagina) || 1);

onMounted(() => {
  cargarMatrizAnalitica();
  cargarDoctoresPendientes();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
