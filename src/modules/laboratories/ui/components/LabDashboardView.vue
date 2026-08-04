<template>
  <div class="min-h-screen bg-[#f1f5f9] text-left font-premium p-8 animate-fade-in select-none">

    <!-- CABECERA PRINCIPAL -->
    <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-8 gap-6">
      <div class="space-y-1">
        <span class="bg-linear-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-xs">
          Panel de Control de Laboratorio
        </span>
        <h2 class="text-4xl font-black text-slate-800 uppercase tracking-tight mt-3">
          Bienvenido, <span class="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-600">{{ authStore.user?.nombre || 'Administrador' }}</span>
        </h2>
        <p class="text-slate-500 text-xs font-bold flex items-center gap-2 mt-1">
          <v-icon name="si-flask" scale="0.75" class="text-cyan-500" />
          Gestión analítica, validación de QR y procesamiento de exámenes de la entidad
        </p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Botón para validación rápida de QR -->
        <button
          @click="abrirModalQR"
          class="px-5 py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <v-icon name="bi-qr-code-scan" scale="1.1" /> Escanear / Validar QR
        </button>

        <button @click="handleLogout" title="Cerrar Sesión" class="p-4 bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl shadow-sm border border-slate-200 transition-all cursor-pointer flex items-center justify-center">
          <v-icon name="bi-box-arrow-right" scale="1.1" />
        </button>
      </div>
    </header>

    <!-- TABs DE NAVEGACIÓN -->
    <div class="flex flex-wrap bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 shadow-inner mb-8 w-fit gap-1">
      <button @click="activeTab = 'resumen'" :class="activeTab === 'resumen' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
        <v-icon name="bi-bar-chart-fill" scale="0.85" /> Resumen Operativo
      </button>
      <button @click="activeTab = 'ordenes'" :class="activeTab === 'ordenes' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
        <v-icon name="bi-file-earmark-medical-fill" scale="0.85" /> Órdenes y Muestras
      </button>
      <button @click="activeTab = 'tarifario'" :class="activeTab === 'tarifario' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
        <v-icon name="bi-cash-stack" scale="0.85" /> Gestión de Tarifario
      </button>
      <button @click="activeTab = 'calidad'" :class="activeTab === 'calidad' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
        <v-icon name="bi-shield-fill-check" scale="0.85" /> Auditoría y Calidad
      </button>
      <button @click="activeTab = 'catalogo'" :class="activeTab === 'catalogo' ? 'bg-slate-900 text-white font-black shadow-sm ring-1 ring-black/20 scale-102' : 'text-slate-400 font-bold hover:text-slate-200'" class="px-5 py-2.5 text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2">
        <v-icon name="bi-folder-fill" scale="0.85" /> Catálogo Pruebas
      </button>
    </div>

    <!-- PESTAÑA: RESUMEN OPERATIVO -->
    <div v-if="activeTab === 'resumen'" class="space-y-8 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Órdenes Totales</p>
          <h3 class="text-3xl font-black text-white mt-2">{{ dashboardData.kpis?.TotalOrdenes ?? 0 }}</h3>
          <v-icon name="bi-file-earmark-medical" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Procesamiento</p>
          <h3 class="text-3xl font-black text-cyan-400 mt-2">{{ dashboardData.kpis?.OrdenesPendientes ?? 0 }}</h3>
          <v-icon name="bi-hourglass-split" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reactivos Críticos</p>
          <h3 class="text-3xl font-black text-rose-400 mt-2">{{ dashboardData.kpis?.AlertasStock ?? 0 }}</h3>
          <v-icon name="bi-exclamation-triangle" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facturación Total</p>
          <h3 class="text-3xl font-black text-emerald-400 mt-2">L. {{ dashboardData.kpis?.IngresosTotales ?? 0 }}</h3>
          <v-icon name="bi-cash-stack" class="absolute right-4 bottom-4 text-slate-800" scale="2.5" />
        </div>
      </div>

      <div class="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 shadow-xs">
        <h3 class="text-xl font-black text-white uppercase tracking-tight mb-6">Últimas Muestras Recibidas</h3>
        <div class="overflow-x-auto border border-slate-800 rounded-2xl">
          <table class="w-full text-sm text-left text-slate-300">
            <thead class="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th class="px-6 py-4">Código Muestra</th>
                <th class="px-6 py-4">Paciente</th>
                <th class="px-6 py-4">Estudio</th>
                <th class="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="orden in dashboardData.ordenes_recientes" :key="orden.OrdenID" class="border-b border-slate-800/60 bg-slate-900 hover:bg-slate-800/40 transition-colors">
                <td class="px-6 py-4 font-mono font-black text-cyan-400 uppercase text-xs">#{{ orden.CodigoOrden || orden.OrdenID }}</td>
                <td class="px-6 py-4 font-bold text-white text-xs uppercase">{{ orden.Paciente }}</td>
                <td class="px-6 py-4 text-xs text-slate-300">{{ orden.Examen }}</td>
                <td class="px-6 py-4">
                  <span :class="getEstadoClass(orden.Estado)" class="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border shadow-3xs">
                    {{ orden.Estado }}
                  </span>
                </td>
              </tr>
              <tr v-if="dashboardData.ordenes_recientes.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                  No se registran órdenes pendientes en el sistema.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PESTAÑA: ÓRDENES Y MUESTRAS (FLUJO OPERATIVO COMPLETO) -->
    <div v-if="activeTab === 'ordenes'" class="space-y-6 animate-fade-in">

      <!-- Filtros de Estado de Órdenes -->
      <div class="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Filtrar Estado:</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="est in ['Todos', 'Emitida', 'Aceptada', 'Paciente Recibido', 'Completada']"
              :key="est"
              @click="filtroEstado = est; void cargarOrdenesOperativas();"
              :class="filtroEstado === est ? 'bg-[#005596] text-white shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'"
              class="px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer transition-all"
            >
              {{ est }}
            </button>
          </div>
        </div>
        <button @click="cargarOrdenesOperativas" title="Recargar Lista" class="p-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all cursor-pointer">
          <v-icon name="bi-arrow-clockwise" scale="0.9" />
        </button>
      </div>

      <!-- Tabla de Procesamiento Operativo -->
      <div class="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xs">
        <div v-if="cargandoOrdenes" class="py-16 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
          Sincronizando órdenes analíticas...
        </div>
        <div v-else-if="listaOrdenes.length === 0" class="py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-2xl">
          No existen órdenes registradas bajo el filtro seleccionado.
        </div>
        <div v-else class="overflow-x-auto border border-slate-100 rounded-2xl">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-50 text-slate-500 font-black uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th class="p-4">Código / ID</th>
                <th class="p-4">Paciente</th>
                <th class="p-4">Médico / Remitente</th>
                <th class="p-4 text-center">Estado Actual</th>
                <th class="p-4 text-right">Monto Total</th>
                <th class="p-4 text-center">Acción Requerida</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
              <tr v-for="orden in listaOrdenes" :key="orden.OrdenID" class="hover:bg-slate-50/60 transition-colors">
                <td class="p-4 font-mono font-black text-[#005596] uppercase">{{ orden.CodigoOrden || `ORD-2026-${orden.OrdenID}` }}</td>
                <td class="p-4 font-bold text-slate-800 uppercase">
                  {{ orden.Paciente }}
                  <span v-if="orden.PacienteDNI" class="block text-[9px] font-mono text-slate-400">DNI: {{ orden.PacienteDNI }}</span>
                </td>
                <td class="p-4 text-slate-500 uppercase">{{ orden.Doctor || 'Solicitud Directa' }}</td>
                <td class="p-4 text-center">
                  <span :class="getBadgeEstadoBadge(orden.Estado)" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-3xs">
                    {{ orden.Estado }}
                  </span>
                </td>
                <td class="p-4 text-right font-mono font-black text-emerald-600 text-sm">
                  ${{ Number(orden.MontoTotal || 0).toFixed(2) }}
                  <span v-if="orden.Estado === 'Completada'" class="block text-[8px] text-amber-600">Comisión (5%): ${{ Number(orden.ComisionMonto || 0).toFixed(2) }}</span>
                </td>
                <td class="p-4 text-center">
                  <!-- Transición 1: Aceptar Orden -->
                  <button
                    v-if="orden.Estado === 'Emitida'"
                    @click="procesarAceptarOrden(orden.OrdenID)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-xs transition-all"
                  >
                    Aceptar Orden
                  </button>

                  <!-- Transición 2: Recepción de Paciente -->
                  <button
                    v-else-if="orden.Estado === 'Aceptada'"
                    @click="marcarPacienteRecibido(orden.CodigoOrden || `ORD-2026-${orden.OrdenID}`)"
                    class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-xs transition-all"
                  >
                    Recibir Paciente
                  </button>

                  <!-- Transición 3: Carga de Resultados PDF -->
                  <button
                    v-else-if="orden.Estado === 'Paciente Recibido'"
                    @click="abrirModalUploadPDF(orden)"
                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-xs transition-all flex items-center gap-1.5 mx-auto"
                  >
                    <v-icon name="bi-file-earmark-pdf-fill" /> Cargar PDF
                  </button>

                  <!-- Estado Final: Ver Reporte -->
                  <a
                    v-else-if="orden.Estado === 'Completada' && orden.ArchivoPdfPath"
                    :href="`/storage/${orden.ArchivoPdfPath}`"
                    target="_blank"
                    class="text-xs font-black text-[#005596] underline hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <v-icon name="bi-file-earmark-pdf-fill" /> Ver PDF
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PESTAÑA: GESTIÓN DE TARIFARIO DE EXÁMENES -->
    <div v-if="activeTab === 'tarifario'" class="space-y-6 animate-fade-in">
      <div class="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xs space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">Gestión de Tarifario por Examen</h3>
            <p class="text-xs text-slate-400 font-bold mt-0.5">Establezca los precios que los pacientes visualizarán al agendar análisis</p>
          </div>
          <button @click="loadCatalogoExamenes" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 cursor-pointer">
            <v-icon name="bi-arrow-clockwise" /> Sincronizar Tarifas
          </button>
        </div>

        <div v-if="loadingCatalogo" class="py-12 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
          Cargando arancel de exámenes...
        </div>

        <div v-else class="overflow-x-auto border border-slate-100 rounded-2xl">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase text-[9px] tracking-wider">
              <tr>
                <th class="p-4">Estudio Analítico</th>
                <th class="p-4">Categoría</th>
                <th class="p-4">Condiciones Paciente</th>
                <th class="p-4 w-44">Precio Público (US$)</th>
                <th class="p-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
              <tr v-for="item in listaExamenes" :key="item.ExamID" class="hover:bg-slate-50/60 transition-colors">
                <td class="p-4 font-bold text-slate-800 uppercase">{{ item.NombreExamen }}</td>
                <td class="p-4">
                  <span class="bg-slate-100 text-slate-500 font-black text-[9px] px-2.5 py-1 rounded-md uppercase">{{ item.Categoria }}</span>
                </td>
                <td class="p-4 text-slate-400 italic text-[11px]">{{ item.CondicionesPaciente || 'Ninguna especificada' }}</td>
                <td class="p-4">
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                    <input
                      v-model.number="item.Precio"
                      type="number"
                      step="0.5"
                      min="0"
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-xs font-black text-slate-800 outline-none focus:bg-white focus:border-cyan-600 transition-all"
                    />
                  </div>
                </td>
                <td class="p-4 text-center">
                  <button
                    @click="actualizarPrecioExamen(item)"
                    :disabled="guardandoPrecioId === item.ExamID"
                    class="bg-cyan-50 text-cyan-700 hover:bg-cyan-100 disabled:opacity-50 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {{ guardandoPrecioId === item.ExamID ? 'Guardando...' : 'Guardar Precio' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PESTAÑA: AUDITORÍA Y CALIDAD -->
    <div v-if="activeTab === 'calidad'" class="animate-fade-in">
      <QualityAuditModule entityType="Laboratorio" :entityId="labId" />
    </div>

    <!-- PESTAÑA: CATÁLOGO PRUEBAS -->
    <div v-if="activeTab === 'catalogo'" class="space-y-8 animate-fade-in">
      <div class="relative max-w-xl">
        <input
          v-model="busquedaExamen"
          type="text"
          placeholder="Buscar exámenes dentro del catálogo..."
          class="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 pl-12 outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#005596] transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
        />
        <v-icon name="bi-search" class="absolute left-4 top-4.5 text-slate-400" scale="0.9" />
      </div>

      <div class="space-y-3">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Categorías de Exámenes</h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categoriasCatalogo"
            :key="cat"
            @click="categoriaSeleccionada = cat"
            :class="categoriaSeleccionada === cat ? 'bg-[#005596] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
            class="px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Lote de Exámenes Analíticos</h4>

        <div v-if="loadingCatalogo" class="py-12 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
          Sincronizando catálogo con base de datos...
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="examen in examenesFiltradosPorCategoria"
            :key="examen.ExamID"
            class="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs flex items-center justify-between gap-4 hover:border-blue-200 transition-all group"
          >
            <div class="text-left">
              <h5 class="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-[#005596] transition-colors">
                {{ examen.NombreExamen }}
              </h5>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <span class="bg-slate-100 text-slate-500 font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {{ examen.Categoria }}
                </span>
                <span v-if="examen.CondicionesPaciente" class="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <v-icon name="bi-exclamation-triangle-fill" scale="0.7" class="text-amber-500" />
                  {{ examen.CondicionesPaciente }}
                </span>
              </div>
            </div>
            <!-- PRECIO DINÁMICO DESDE BASE DE DATOS -->
            <span class="text-lg font-black text-blue-600">${{ Number(examen.Precio || 0).toFixed(2) }}</span>
          </div>

          <div v-if="examenesFiltradosPorCategoria.length === 0" class="py-12 bg-white rounded-2xl border border-slate-100 text-center text-slate-400 font-bold text-xs uppercase tracking-widest shadow-2xs">
            No hay estudios registrados bajo la categoría "{{ categoriaSeleccionada }}" o criterios de búsqueda.
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 1: ESCANEO Y VALIDACIÓN DE QR -->
    <div v-if="showQRModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 text-left">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 class="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <v-icon name="bi-qr-code-scan" class="text-cyan-600" /> Recepción de Paciente por QR
          </h3>
          <button @click="showQRModal = false" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
        </div>
        <p class="text-xs text-slate-500 font-medium">Ingrese o escanee el código de orden impreso en la boleta del paciente:</p>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Código de Orden (ORD-2026-XXXXX)</label>
          <input
            v-model="qrInputCodigo"
            type="text"
            placeholder="Ej. ORD-2026-00104"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-black font-mono text-slate-800 uppercase focus:border-cyan-600 outline-none"
            @keyup.enter="ejecutarValidacionQR"
          />
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showQRModal = false" class="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
          <button @click="ejecutarValidacionQR" class="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md">
            Validar Recepción
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: CARGA DE PDF DE RESULTADOS -->
    <div v-if="showUploadModal && ordenParaSubir" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6 text-left">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-800 uppercase tracking-tight">Finalizar Orden y Cargar PDF</h3>
            <p class="text-[10px] font-bold text-slate-400 font-mono">{{ ordenParaSubir.CodigoOrden || `ORD-2026-${ordenParaSubir.OrdenID}` }}</p>
          </div>
          <button @click="showUploadModal = false" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <div class="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
          <span class="text-[10px] font-black text-amber-800 uppercase tracking-wider block">Cálculo de Comisión SaaS</span>
          <div class="flex justify-between items-center text-xs font-black text-slate-800">
            <span>Monto Total Orden: ${{ Number(ordenParaSubir.MontoTotal || 0).toFixed(2) }}</span>
            <span class="text-emerald-600">Comisión MedCore (5%): ${{ (Number(ordenParaSubir.MontoTotal || 0) * 0.05).toFixed(2) }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Adjuntar Reporte Oficial (PDF)</label>
          <input @change="handleFileChange" type="file" accept=".pdf" class="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-slate-900 file:text-white cursor-pointer" />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button @click="showUploadModal = false" class="px-5 py-3 text-xs font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
          <button
            @click="ejecutarSubidaPDF"
            :disabled="subiendoPDF || !archivoPDFSeleccionado"
            class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            {{ subiendoPDF ? 'Procesando...' : 'Completar Orden & Facturar' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { addIcons } from 'oh-vue-icons';
import api from '@/shared/infrastructure/api';

import {
  BiBarChartFill, BiFileEarmarkMedicalFill, BiShieldFillCheck, BiFolderFill,
  BiCalendarEvent, BiClockHistory, BiCashStack, BiHourglassSplit,
  BiExclamationTriangle, BiFileEarmarkMedical, SiFlask, BiBoxArrowRight,
  BiSearch, BiClock, BiExclamationTriangleFill, BiQrCodeScan, BiArrowClockwise,
  BiFileEarmarkPdfFill
} from 'oh-vue-icons/icons';
import { GiStethoscope } from 'oh-vue-icons/icons';

import QualityAuditModule from '@/shared/ui/components/QualityAuditModule.vue';
import type { SessionUser } from '@/shared/Domain/dashboard.interface';

addIcons(
  BiBarChartFill, BiFileEarmarkMedicalFill, BiShieldFillCheck, BiFolderFill,
  BiCalendarEvent, BiClockHistory, BiCashStack, GiStethoscope,
  BiHourglassSplit, BiExclamationTriangle, BiFileEarmarkMedical, SiFlask, BiBoxArrowRight,
  BiSearch, BiClock, BiExclamationTriangleFill, BiQrCodeScan, BiArrowClockwise,
  BiFileEarmarkPdfFill
);

export type EstadoOrdenLaboratorio = 'Emitida' | 'Aceptada' | 'Paciente Recibido' | 'Completada';

export interface LaboratoryOrderDTO {
  OrdenID: number;
  CodigoOrden?: string;
  Paciente: string;
  PacienteDNI?: string;
  PacienteTelefono?: string;
  Doctor?: string;
  Estado: EstadoOrdenLaboratorio;
  MontoTotal: number;
  ComisionMonto: number;
  ArchivoPdfPath?: string | null;
  FechaOrden?: string;
  FechaCompletado?: string | null;
}

interface LaboratoryKpis {
  TotalOrdenes: number;
  OrdenesPendientes: number;
  AlertasStock: number;
  IngresosTotales: number;
}

interface RecentOrder {
  OrdenID: number;
  CodigoOrden?: string;
  Paciente: string;
  Examen: string;
  Estado: string;
}

interface LaboratoryDashboardData {
  kpis: LaboratoryKpis | null;
  ordenes_recientes: RecentOrder[];
}

export interface ExamenCatalogo {
  ExamID: number;
  NombreExamen: string;
  Categoria: string;
  CondicionesPaciente?: string;
  Precio?: number;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const activeTab = ref<'resumen' | 'ordenes' | 'tarifario' | 'calidad' | 'catalogo'>('resumen');
const busquedaExamen = ref<string>('');
const categoriaSeleccionada = ref<string>('Todos');
const loadingCatalogo = ref<boolean>(false);
const guardandoPrecioId = ref<number | null>(null);

// Estados para la Consola Operativa
const filtroEstado = ref<string>('Todos');
const listaOrdenes = ref<LaboratoryOrderDTO[]>([]);
const cargandoOrdenes = ref<boolean>(false);

// Modales y formularios
const showQRModal = ref<boolean>(false);
const qrInputCodigo = ref<string>('');
const showUploadModal = ref<boolean>(false);
const ordenParaSubir = ref<LaboratoryOrderDTO | null>(null);
const archivoPDFSeleccionado = ref<File | null>(null);
const subiendoPDF = ref<boolean>(false);

const labId = computed<number>(() => {
  const user = authStore.user as SessionUser | null;
  let idRaw = user?.EntidadID;

  if (!idRaw) {
    const localUserRaw = localStorage.getItem('user');
    if (localUserRaw) {
      const localUser = JSON.parse(localUserRaw) as { entidadId?: number; EntidadID?: number; entidad_id?: number };
      idRaw = localUser.entidadId ?? localUser.EntidadID ?? localUser.entidad_id;
    }
  }
  const parsedId = Number(idRaw);
  return isNaN(parsedId) ? 0 : parsedId;
});

const dashboardData = ref<LaboratoryDashboardData>({ kpis: null, ordenes_recientes: [] });
const listaExamenes = ref<ExamenCatalogo[]>([]);

const categoriasCatalogo = computed<string[]>(() => {
  const categoriasUnicas = new Set(listaExamenes.value.map((ex: ExamenCatalogo) => ex.Categoria));
  return ['Todos', ...Array.from(categoriasUnicas)];
});

// Carga de Métricas KPI
const loadDashboardData = async (): Promise<void> => {
  if (!labId.value || labId.value === 0) return;
  try {
    const response = await api.get('/laboratorio/dashboard-metrics', {
      params: { laboratorio_id: labId.value }
    });
    if (response.data && response.data.status === 'success') {
      dashboardData.value = response.data.data as LaboratoryDashboardData;
    }
  } catch (e: unknown) {
    const err = e as ApiErrorResponse;
    console.error("[LabDashboard] Error cargando KPIs:", err.message);
  }
};

// Carga de Catálogo
const loadCatalogoExamenes = async (): Promise<void> => {
  loadingCatalogo.value = true;
  try {
    const response = await api.get('/laboratorio/catalogo');
    listaExamenes.value = (response.data.datos as ExamenCatalogo[]) || [];
  } catch {
    toast.error("Error al cargar el catálogo de exámenes.");
  } finally  {
    loadingCatalogo.value = false;
  }
};

// Actualizar precio público individual de examen
const actualizarPrecioExamen = async (item: ExamenCatalogo): Promise<void> => {
  guardandoPrecioId.value = item.ExamID;
  try {
    await api.put(`/laboratorio/tarifario/${item.ExamID}`, {
      precio: item.Precio,
      laboratorio_id: labId.value
    });
    toast.success(`Precio de ${item.NombreExamen} actualizado a $${Number(item.Precio || 0).toFixed(2)}`);
  } catch {
    toast.error("Fallo al actualizar la tarifa en la base de datos.");
  } finally {
    guardandoPrecioId.value = null;
  }
};

// Carga de Órdenes Operativas
const cargarOrdenesOperativas = async (): Promise<void> => {
  if (!labId.value || labId.value === 0) return;
  cargandoOrdenes.value = true;
  try {
    const response = await api.get('/laboratorio/ordenes', {
      params: { laboratorio_id: labId.value, estado: filtroEstado.value }
    });
    listaOrdenes.value = (response.data.datos as LaboratoryOrderDTO[]) || [];
  } catch {
    toast.error("Error al obtener la lista de órdenes.");
  } finally {
    cargandoOrdenes.value = false;
  }
};

// Transición 1: Aceptar Orden
const procesarAceptarOrden = async (ordenId: number): Promise<void> => {
  try {
    await api.put(`/laboratorio/ordenes/${ordenId}/aceptar`);
    toast.success("Orden aceptada correctamente.");
    await cargarOrdenesOperativas();
    await loadDashboardData();
  } catch {
    toast.error("No se pudo aceptar la orden.");
  }
};

// Modal Recepción QR
const abrirModalQR = (): void => {
  qrInputCodigo.value = '';
  showQRModal.value = true;
};

// Transición 2: Validar QR
const ejecutarValidacionQR = async (): Promise<void> => {
  if (!qrInputCodigo.value.trim()) return;
  try {
    await api.post('/laboratorio/ordenes/escanear-qr', {
      codigo_orden: qrInputCodigo.value.trim(),
      laboratorio_id: labId.value
    });
    toast.success("Recepción de paciente confirmada.");
    showQRModal.value = false;
    await cargarOrdenesOperativas();
    await loadDashboardData();
  } catch (e: unknown) {
    const err = e as ApiErrorResponse;
    const msg = err.response?.data?.message || "Código QR inválido o expirado.";
    toast.error(msg);
  }
};

const marcarPacienteRecibido = async (codigo: string): Promise<void> => {
  qrInputCodigo.value = codigo;
  await ejecutarValidacionQR();
};

// Modal Subida PDF
const abrirModalUploadPDF = (orden: LaboratoryOrderDTO): void => {
  ordenParaSubir.value = orden;
  archivoPDFSeleccionado.value = null;
  showUploadModal.value = true;
};

const handleFileChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    archivoPDFSeleccionado.value = input.files[0];
  }
};

// Transición 3: Subir PDF y Registrar Comisión 5%
const ejecutarSubidaPDF = async (): Promise<void> => {
  if (!ordenParaSubir.value || !archivoPDFSeleccionado.value) return;
  subiendoPDF.value = true;
  try {
    const formData = new FormData();
    formData.append('archivo_pdf', archivoPDFSeleccionado.value);

    const response = await api.post(
      `/laboratorio/ordenes/${ordenParaSubir.value.OrdenID}/subir-resultados`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    const comision = (response.data.comision_generada as number) || 0;
    toast.success(`Resultados cargados. Comisión SaaS 5% registrada: $${comision.toFixed(2)}`);
    showUploadModal.value = false;
    await cargarOrdenesOperativas();
    await loadDashboardData();
  } catch {
    toast.error("Error al adjuntar el PDF de resultados.");
  } finally {
    subiendoPDF.value = false;
  }
};

const examenesFiltradosPorCategoria = computed<ExamenCatalogo[]>(() => {
  let resultado = listaExamenes.value;

  if (categoriaSeleccionada.value !== 'Todos') {
    resultado = resultado.filter((ex: ExamenCatalogo) =>
      ex.Categoria.toLowerCase() === categoriaSeleccionada.value.toLowerCase()
    );
  }

  const query = busquedaExamen.value.toLowerCase().trim();
  if (query) {
    resultado = resultado.filter((ex: ExamenCatalogo) =>
      ex.NombreExamen.toLowerCase().includes(query) ||
      (ex.CondicionesPaciente && ex.CondicionesPaciente.toLowerCase().includes(query))
    );
  }

  return resultado;
});

const getEstadoClass = (estado: string) => {
  const e = estado.toLowerCase();
  if (e.includes('pendiente') || e.includes('espera')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  if (e.includes('listo') || e.includes('completado') || e.includes('entregado') || e.includes('finalizado')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
};

const getBadgeEstadoBadge = (estado: EstadoOrdenLaboratorio | string) => {
  switch (estado) {
    case 'Emitida': return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'Aceptada': return 'bg-[#005596] text-white';
    case 'Paciente Recibido': return 'bg-amber-500 text-white';
    case 'Completada': return 'bg-emerald-600 text-white';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const handleLogout = () => {
  if (!confirm('¿Está seguro que desea cerrar la sesión del panel de laboratorio?')) return;
  localStorage.clear();
  router.push('/');
};

watch(
  () => authStore.user,
  () => {
    if (labId.value && labId.value !== 0) {
      void loadDashboardData();
      void loadCatalogoExamenes();
      void cargarOrdenesOperativas();
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (labId.value && labId.value !== 0) {
    void loadDashboardData();
    void loadCatalogoExamenes();
    void cargarOrdenesOperativas();
  }
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>
