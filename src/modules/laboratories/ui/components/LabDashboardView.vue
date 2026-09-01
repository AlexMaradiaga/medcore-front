<!-- src/modules/laboratories/ui/components/LabDashboardView.vue -->
<template>
  <div class="min-h-screen bg-[#f8fafc] flex text-left font-premium select-none">
    <!-- ==================== SIDEBAR LATERAL ==================== -->
    <aside class="w-64 bg-[#edf2f4] border-r border-slate-200/80 flex flex-col justify-between p-6 shrink-0 min-h-screen">
      <div class="space-y-8">
        <!-- LOGO / BRANDING CON ESTILO Y LOGO 3D -->
        <div class="flex items-center gap-3">
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
            <div class="flex items-center gap-0.5">
              <span class="text-xl font-black tracking-tight text-slate-800">MedGo</span>
              <span class="text-xl font-black text-[#008ba3]">+</span>
            </div>
            <span class="text-[8px] text-[#008ba3] font-black uppercase tracking-widest mt-0.5">Gestión Médica Digital</span>
          </div>
        </div>

        <!-- MENÚ DE NAVEGACIÓN EN ESPAÑOL -->
        <nav class="space-y-1.5">
          <button
            v-for="tab in navTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer',
              activeTab === tab.id
                ? 'bg-[#d6e6ed] text-[#0d5c75] font-black shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            ]"
          >
            <v-icon :name="tab.icon" scale="0.95" />
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </div>

      <!-- BOTÓN INFERIOR Y PERFIL DE USUARIO -->
      <div class="space-y-4 pt-6 border-t border-slate-200/60">
        <button
          @click="abrirModalQR"
          class="w-full py-3 px-4 bg-[#0d5c75] hover:bg-[#09475b] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <v-icon name="bi-qr-code-scan" scale="0.9" /> Escanear / Validar QR
        </button>

        <!-- FOOTER PERFIL -->
        <div class="flex items-center gap-3 px-1 pt-1">
          <div class="w-9 h-9 rounded-full bg-[#0d5c75] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
            {{ authStore.user?.nombre?.[0] || 'A' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-black text-slate-800 truncate leading-tight">{{ authStore.user?.nombre || 'Administrador' }}</p>
            <p class="text-[10px] text-slate-400 font-bold truncate">Perfil Director de Laboratorio</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- ==================== ÁREA PRINCIPAL ==================== -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- HEADER SUPERIOR -->
      <header class="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
        <!-- BUSCADOR -->
        <div class="relative w-80">
          <v-icon name="bi-search" class="absolute left-3.5 top-2.5 text-slate-400" scale="0.85" />
          <input
            v-model="busquedaExamen"
            type="text"
            placeholder="Buscar en el laboratorio..."
            class="w-full bg-[#f8fafc] border border-slate-200 rounded-lg py-1.5 pl-9 pr-3 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-[#0d5c75] transition-all"
          />
        </div>

        <!-- BOTONES DE ACCIÓN RÁPIDA -->
        <div class="flex items-center gap-3">
          <button
            @click="abrirModalQR"
            class="px-4 py-2 bg-[#008ba3] hover:bg-[#00748a] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <v-icon name="bi-qr-code-scan" scale="0.9" /> Validar QR
          </button>

          <!-- CAMPANITA CON BADGE Y MENÚ DESPLEGABLE -->
          <div class="relative">
            <button
              @click="mostrarNotificaciones = !mostrarNotificaciones"
              class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer relative"
              title="Notificaciones de Órdenes Emitidas"
            >
              <v-icon name="bi-bell" scale="1.0" />
              <span
                v-if="ordenesEmitidas.length > 0"
                class="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black h-5 min-w-5 px-1 rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-xs"
              >
                {{ ordenesEmitidas.length }}
              </span>
            </button>

            <!-- MENÚ DESPLEGABLE DE NOTIFICACIONES -->
            <div
              v-if="mostrarNotificaciones"
              class="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 text-left space-y-3 animate-fade-in"
            >
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <v-icon name="bi-bell" class="text-rose-500" scale="0.85" />
                  Solicitudes por Aceptar ({{ ordenesEmitidas.length }})
                </h4>
                <button @click="mostrarNotificaciones = false" class="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer">✕</button>
              </div>

              <div v-if="ordenesEmitidas.length === 0" class="py-6 text-center text-slate-400 font-bold text-xs uppercase tracking-wider">
                No hay órdenes pendientes de aceptación
              </div>

              <div v-else class="max-h-64 overflow-y-auto space-y-2 pr-1">
                <div
                  v-for="ord in ordenesEmitidas"
                  :key="ord.OrdenID"
                  class="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between gap-2 hover:bg-blue-50/50 transition-colors"
                >
                  <div class="overflow-hidden">
                    <p class="text-xs font-black text-slate-800 uppercase truncate">{{ ord.Paciente }}</p>
                    <p class="text-[10px] font-mono text-[#008ba3] font-bold">{{ ord.CodigoOrden || `#ORD-${ord.OrdenID}` }}</p>
                    <span class="text-[9px] font-black text-emerald-600">${{ Number(ord.MontoTotal || 0).toFixed(2) }}</span>
                  </div>

                  <button
                    @click="procesarAceptarOrden(ord.OrdenID); mostrarNotificaciones = false;"
                    class="px-3 py-1.5 bg-[#008ba3] hover:bg-[#00748a] text-white rounded-lg font-black text-[9px] uppercase tracking-wider cursor-pointer shadow-2xs shrink-0"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" title="Configuración">
            <v-icon name="bi-gear" scale="1.0" />
          </button>
          <button
            @click="handleLogout"
            title="Cerrar Sesión"
            class="w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center bg-slate-50 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer ml-1"
          >
            <v-icon name="bi-box-arrow-right" class="text-slate-500 hover:text-rose-600" scale="0.9" />
          </button>
        </div>
      </header>

      <!-- CONTENIDO DE LA PÁGINA -->
      <main class="flex-1 p-8 overflow-y-auto space-y-6">
        <!-- BANNER DE BIENVENIDA -->
        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-7 shadow-2xs relative overflow-hidden space-y-3">
          <div class="inline-flex items-center gap-2 bg-[#008ba3] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-2xs">
            <v-icon name="si-flask" scale="0.8" />
            PANEL DE CONTROL DE LABORATORIO
          </div>
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
            BIENVENIDO, <span class="text-[#008ba3] font-black">{{ authStore.user?.nombre || 'ADMIN' }}</span>
          </h2>
          <p class="text-slate-500 text-xs font-bold flex items-center gap-2">
            <v-icon name="bi-clock-history" scale="0.85" class="text-[#008ba3]" />
            Gestión analítica, validación de QR y procesamiento de exámenes de la entidad
          </p>
        </div>

        <!-- ================= PESTAÑA: RESUMEN OPERATIVO ================= -->
        <div v-if="activeTab === 'resumen'" class="space-y-6 animate-fade-in">
          <!-- GRID DE KPIS -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col justify-between h-36">
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Órdenes Totales</span>
                <v-icon name="bi-list-task" class="text-[#008ba3]" scale="1.1" />
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-800 tracking-tight">{{ dashboardData.kpis?.TotalOrdenes ?? 0 }}</h3>
                <p class="text-[11px] font-bold text-slate-400 mt-1">+12% vs mes anterior</p>
              </div>
            </div>

            <div class="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col justify-between h-36">
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Procesamiento</span>
                <v-icon name="si-flask" class="text-[#008ba3]" scale="1.1" />
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-800 tracking-tight">{{ dashboardData.kpis?.OrdenesPendientes ?? 0 }}</h3>
                <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div class="bg-[#008ba3] h-full w-2/5 rounded-full"></div>
                </div>
              </div>
            </div>

            <div class="bg-white border-2 border-rose-500/80 rounded-xl p-5 shadow-2xs flex flex-col justify-between h-36">
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reactivos Críticos</span>
                <v-icon name="bi-exclamation-triangle" class="text-rose-500" scale="1.1" />
              </div>
              <div>
                <h3 class="text-3xl font-black text-rose-600 tracking-tight">{{ dashboardData.kpis?.AlertasStock ?? 0 }}</h3>
                <p class="text-[11px] font-bold text-slate-500 mt-1">Requieren atención inmediata</p>
              </div>
            </div>

            <div class="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col justify-between h-36">
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facturación Total</span>
                <span class="text-[#008ba3] font-black text-lg">$</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-[#0d5c75] tracking-tight">L. {{ dashboardData.kpis?.IngresosTotales ?? '0.00' }}</h3>
                <p class="text-[11px] font-bold text-slate-400 mt-1">Actualizado hoy 08:00 AM</p>
              </div>
            </div>
          </div>

          <!-- SECCIÓN ÚLTIMAS MUESTRAS RECIBIDAS (TABLA OPTIMIZADA) -->
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div class="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 class="text-lg font-black text-slate-800 tracking-tight">Últimas Muestras Recibidas</h3>
              <button @click="activeTab = 'ordenes'" class="text-xs font-black text-[#008ba3] hover:underline cursor-pointer">
                Ver todas
              </button>
            </div>

            <div v-if="dashboardData.ordenes_recientes.length > 0" class="overflow-x-auto border border-slate-100 rounded-xl">
              <table class="w-full text-sm text-left text-slate-700">
                <thead class="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 font-black">
                  <tr>
                    <th class="px-6 py-3.5">Código Muestra</th>
                    <th class="px-6 py-3.5">Paciente</th>
                    <th class="px-6 py-3.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-semibold">
                  <tr v-for="orden in dashboardData.ordenes_recientes" :key="orden.OrdenID" class="hover:bg-slate-50/60 transition-colors">
                    <td class="px-6 py-3.5 font-mono font-black text-[#008ba3] uppercase text-xs">#{{ orden.CodigoOrden || orden.OrdenID }}</td>
                    <td class="px-6 py-3.5 font-bold text-slate-800 text-xs uppercase">{{ orden.Paciente }}</td>
                    <td class="px-6 py-3.5 text-center">
                      <span :class="getEstadoClass(orden.Estado || orden.EstadoOrden)" class="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border shadow-3xs">
                        {{ orden.Estado || orden.EstadoOrden || 'Emitida' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="py-16 text-center space-y-3">
              <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 mx-auto flex items-center justify-center text-slate-400">
                <v-icon name="bi-box-seam" scale="1.2" />
              </div>
              <div class="space-y-1">
                <p class="text-sm font-bold text-slate-600">No hay muestras recientes</p>
                <p class="text-xs text-slate-400 font-medium">Las nuevas muestras aparecerán aquí una vez registradas en el sistema.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= PESTAÑA ÓRDENES Y MUESTRAS ================= -->
        <div v-if="activeTab === 'ordenes'" class="space-y-6 animate-fade-in">
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Filtrar Estado:</span>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="est in ['Todos', 'Emitida', 'Aceptada', 'Paciente Recibido', 'Completada']"
                  :key="est"
                  @click="filtroEstado = est"
                  :class="filtroEstado === est ? 'bg-[#008ba3] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'"
                  class="px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer transition-all"
                >
                  {{ est }}
                </button>
              </div>
            </div>
            <button @click="cargarOrdenesOperativas(false)" title="Recargar Lista" class="p-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all cursor-pointer">
              <v-icon name="bi-arrow-clockwise" scale="0.9" />
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
            <div v-if="cargandoOrdenes" class="py-16 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
              Sincronizando órdenes analíticas...
            </div>
            <div v-else-if="ordenesFiltradas.length === 0" class="py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-2xl">
              No existen órdenes registradas bajo el filtro seleccionado.
            </div>
            <div v-else class="overflow-x-auto border border-slate-100 rounded-xl">
              <table class="w-full text-left text-xs border-collapse">
                <thead class="bg-slate-50 text-slate-500 font-black uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th class="p-4">Código / ID</th>
                    <th class="p-4">Paciente</th>
                    <th class="p-4">Estudios / Exámenes</th>
                    <th class="p-4">Médico / Remitente</th>
                    <th class="p-4 text-center">Estado Actual</th>
                    <th class="p-4 text-right">Monto Total</th>
                    <th class="p-4 text-center">Acción Requerida</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
                  <tr v-for="orden in ordenesFiltradas" :key="orden.OrdenID" class="hover:bg-slate-50/60 transition-colors">
                    <!-- Código Clickeable para abrir el Modal -->
                    <td class="p-4 font-mono font-black text-[#008ba3] uppercase">
                      <button
                        @click="abrirModalDetalle(orden)"
                        class="hover:underline flex items-center gap-1.5 cursor-pointer text-left group"
                        title="Ver detalle completo de la orden"
                      >
                        <span>{{ orden.CodigoOrden || `ORD-2026-${orden.OrdenID}` }}</span>
                        <v-icon name="bi-eye" scale="0.8" class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                      </button>
                    </td>

                    <td class="p-4 font-bold text-slate-800 uppercase">
                      {{ orden.Paciente }}
                      <span v-if="orden.PacienteDNI" class="block text-[9px] font-mono text-slate-400">DNI: {{ orden.PacienteDNI }}</span>
                    </td>

                    <!-- Columna de Exámenes / Pruebas (Filtra los exámenes en estado 'Cancelado') -->
                    <td class="p-4">
                      <div v-if="orden.examenes && orden.examenes.some(e => e.Estado !== 'Cancelado')" class="flex flex-wrap gap-1 max-w-xs">
                        <span
                          v-for="ex in orden.examenes.filter(e => e.Estado !== 'Cancelado')"
                          :key="ex.ExamID"
                          class="bg-blue-50 text-[#008ba3] border border-blue-100 text-[9.5px] font-black px-2 py-0.5 rounded-md uppercase"
                        >
                          {{ ex.NombreExamen }}
                        </span>
                      </div>
                      <div v-else-if="orden.Examen" class="text-xs text-slate-800 font-bold uppercase">
                        {{ orden.Examen }}
                      </div>
                      <span v-else class="text-slate-400 italic text-[10px]">Sin desglose</span>
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
                      <div class="flex items-center justify-center gap-2">
                        <button
                          v-if="orden.Estado === 'Emitida'"
                          @click="procesarAceptarOrden(orden.OrdenID)"
                          class="px-3.5 py-2 bg-[#008ba3] hover:bg-[#00748a] text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-xs transition-all"
                        >
                          Aceptar Orden
                        </button>
                        <button
                          v-else-if="orden.Estado === 'Aceptada'"
                          @click="marcarPacienteRecibido(orden.CodigoOrden || `ORD-2026-${orden.OrdenID}`)"
                          class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-xs transition-all"
                        >
                          Recibir Paciente
                        </button>
                        <button
                          v-else-if="orden.Estado === 'Paciente Recibido'"
                          @click="abrirModalUploadPDF(orden)"
                          class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-xs transition-all flex items-center gap-1.5 mx-auto"
                        >
                          <v-icon name="bi-check-circle-fill" /> Completar Orden
                        </button>
                        <a
                          v-else-if="orden.Estado === 'Completada' && orden.ArchivoPdfPath"
                          :href="`/storage/${orden.ArchivoPdfPath}`"
                          target="_blank"
                          class="text-xs font-black text-[#008ba3] underline hover:text-[#00748a] inline-flex items-center gap-1"
                        >
                          <v-icon name="bi-file-earmark-pdf-fill" /> Ver PDF
                        </a>

                        <!-- Botón de inspección detallada -->
                        <button
                          @click="abrirModalDetalle(orden)"
                          class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                          title="Ver Ficha Clínica Completa"
                        >
                          <v-icon name="bi-info-circle-fill" scale="0.9" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= PESTAÑA: GESTIÓN DE TARIFARIO ================= -->
        <div v-if="activeTab === 'tarifario'" class="space-y-6 animate-fade-in">
          <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
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
            <div v-else class="overflow-x-auto border border-slate-100 rounded-xl">
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
                          class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-xs font-black text-slate-800 outline-none focus:bg-white focus:border-[#008ba3] transition-all"
                        />
                      </div>
                    </td>
                    <td class="p-4 text-center">
                      <button
                        @click="actualizarPrecioExamen(item)"
                        :disabled="guardandoPrecioId === item.ExamID"
                        class="bg-[#008ba3]/10 text-[#008ba3] hover:bg-[#008ba3]/20 disabled:opacity-50 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
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

        <!-- ================= PESTAÑA: AUDITORÍA Y CALIDAD ================= -->
        <div v-if="activeTab === 'calidad'" class="animate-fade-in">
          <QualityAuditModule entityType="Laboratorio" :entityId="labId" />
        </div>

        <!-- ================= PESTAÑA: CATÁLOGO PRUEBAS ================= -->
        <div v-if="activeTab === 'catalogo'" class="space-y-6 animate-fade-in">
          <div class="space-y-2">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categorías de Exámenes</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categoriasCatalogo"
                :key="cat"
                @click="categoriaSeleccionada = cat"
                :class="categoriaSeleccionada === cat ? 'bg-[#008ba3] text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
                class="px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lote de Exámenes Analíticos</h4>
            <div v-if="loadingCatalogo" class="py-12 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
              Sincronizando catálogo con base de datos...
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="examen in examenesFiltradosPorCategoria"
                :key="examen.ExamID"
                class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between gap-4 hover:border-[#008ba3]/40 transition-all group"
              >
                <div class="text-left">
                  <h5 class="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-[#008ba3] transition-colors">
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
                <span class="text-lg font-black text-[#008ba3]">${{ Number(examen.Precio || 0).toFixed(2) }}</span>
              </div>
              <div v-if="examenesFiltradosPorCategoria.length === 0" class="py-12 bg-white rounded-2xl border border-slate-200/80 text-center text-slate-400 font-bold text-xs uppercase tracking-widest shadow-2xs">
                No hay estudios registrados bajo la categoría "{{ categoriaSeleccionada }}" o criterios de búsqueda.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- ================= MODAL DETALLE DE ORDEN (CON REFRESCO REACTIVO) ================= -->
    <OrderDetailsModal
      :is-open="showDetailsModal"
      :orden="ordenParaDetalle"
      @close="showDetailsModal = false"
      @updated="handleOrdenActualizada"
    />

    <!-- ================= MODAL 1: ESCANEO Y VALIDACIÓN DE QR ================= -->
    <div v-if="showQRModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 text-left">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 class="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <v-icon name="bi-qr-code-scan" class="text-[#008ba3]" /> Recepción de Paciente por QR
          </h3>
          <button @click="showQRModal = false" class="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
        </div>
        <p class="text-xs text-slate-500 font-medium">Ingrese o escanee el código de orden impreso en la boleta del paciente:</p>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Código de Orden (ORD-2026-XXXXX)</label>
          <input
            v-model="qrInputCodigo"
            type="text"
            placeholder="Ej. ORD-2026-00104"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-black font-mono text-slate-800 uppercase focus:border-[#008ba3] outline-none"
            @keyup.enter="ejecutarValidacionQR"
          />
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showQRModal = false" class="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Cancelar</button>
          <button @click="ejecutarValidacionQR" class="px-6 py-2.5 bg-[#008ba3] hover:bg-[#00748a] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md cursor-pointer">
            Validar Recepción
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL 2: CARGA DE PDF / COMPLETAR ORDEN ================= -->
    <div v-if="showUploadModal && ordenParaSubir" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6 text-left">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-800 uppercase tracking-tight">Finalizar y Completar Orden</h3>
            <p class="text-[10px] font-bold text-slate-400 font-mono">{{ ordenParaSubir.CodigoOrden || `ORD-2026-${ordenParaSubir.OrdenID}` }}</p>
          </div>
          <button @click="showUploadModal = false" class="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">✕</button>
        </div>
        <div class="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
          <span class="text-[10px] font-black text-amber-800 uppercase tracking-wider block">Cálculo de Comisión SaaS</span>
          <div class="flex justify-between items-center text-xs font-black text-slate-800">
            <span>Monto Total Orden: ${{ Number(ordenParaSubir.MontoTotal || 0).toFixed(2) }}</span>
            <span class="text-emerald-600">Comisión MedGo+  (5%): ${{ (Number(ordenParaSubir.MontoTotal || 0) * 0.05).toFixed(2) }}</span>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Adjuntar Reporte Oficial PDF (Opcional)</label>
          <input @change="handleFileChange" type="file" accept=".pdf" class="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-slate-900 file:text-white cursor-pointer" />
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button @click="showUploadModal = false" class="px-5 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Cancelar</button>
          <button
            @click="ejecutarSubidaPDF"
            :disabled="subiendoPDF"
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
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { addIcons } from 'oh-vue-icons';
import {
  BiGridFill, BiGraphUp, BiEyedropper, BiBoxSeam, BiReceipt,
  BiBell, BiGear, BiSearch, BiQrCodeScan, BiBoxArrowRight,
  BiListTask, BiExclamationTriangle, BiArrowClockwise, BiFileEarmarkPdfFill,
  BiExclamationTriangleFill, BiClockHistory, BiEye, BiInfoCircleFill, BiXLg,
  BiCheckCircleFill
} from 'oh-vue-icons/icons';
import { SiFlask } from 'oh-vue-icons/icons';
import QualityAuditModule from '@/shared/ui/components/QualityAuditModule.vue';
import OrderDetailsModal from './OrderDetailsModal.vue';
import type { SessionUser } from '@/shared/Domain/dashboard.interface';
import { usePolling } from '@/shared/infrastructure/usePolling';
// Importaciones desde Dominio e Infraestructura
import { LaboratoryRepository } from '../../infrastructure/LaboratoryRepository';
import { LaboratoryDashboardRepository } from '../../infrastructure/LaboratoryDashboardRepository';
import type {
  CatalogoExamen,
  LaboratoryOrderDTO,
  EstadoOrdenLaboratorio
} from '../../domain/LaboratoryModels';
import type { LaboratoryDashboardData, ApiErrorResponse } from '../../domain/LaboratoryDashboard';

// Polling optimizado a 15 segundos y refresco silencioso en segundo plano
usePolling(async () => {
  if (labId.value && labId.value !== 0) {
    await loadDashboardData();
    await cargarOrdenesOperativas(true);
  }
}, 15000);

addIcons(
  BiGridFill, BiGraphUp, BiEyedropper, BiBoxSeam, BiReceipt,
  BiBell, BiGear, BiSearch, BiQrCodeScan, BiBoxArrowRight,
  BiListTask, BiExclamationTriangle, BiArrowClockwise, BiFileEarmarkPdfFill,
  BiExclamationTriangleFill, SiFlask, BiClockHistory, BiEye, BiInfoCircleFill, BiXLg,
  BiCheckCircleFill
);

const labRepo = new LaboratoryRepository();
const labDashboardRepo = new LaboratoryDashboardRepository();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const activeTab = ref<'resumen' | 'ordenes' | 'tarifario' | 'calidad' | 'catalogo'>('resumen');
const navTabs = [
  { id: 'resumen', label: 'Panel Principal', icon: 'bi-grid-fill' },
  { id: 'calidad', label: 'Auditoría y Calidad', icon: 'bi-graph-up' },
  { id: 'ordenes', label: 'Órdenes y Muestras', icon: 'bi-eyedropper' },
  { id: 'catalogo', label: 'Catálogo Pruebas', icon: 'bi-box-seam' },
  { id: 'tarifario', label: 'Tarifario y Facturación', icon: 'bi-receipt' }
] as const;

const busquedaExamen = ref<string>('');
const categoriaSeleccionada = ref<string>('Todos');
const loadingCatalogo = ref<boolean>(false);
const guardandoPrecioId = ref<number | null>(null);

const filtroEstado = ref<string>('Todos');
const listaOrdenes = ref<LaboratoryOrderDTO[]>([]);
const cargandoOrdenes = ref<boolean>(false);

const mostrarNotificaciones = ref<boolean>(false);

// CONTROL DEL MODAL DE DETALLES CLÍNICOS
const showDetailsModal = ref<boolean>(false);
const ordenParaDetalle = ref<LaboratoryOrderDTO | null>(null);

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
const listaExamenes = ref<CatalogoExamen[]>([]);

const ordenesEmitidas = computed<LaboratoryOrderDTO[]>(() => {
  return listaOrdenes.value.filter(o => o.Estado === 'Emitida');
});

const ordenesFiltradas = computed<LaboratoryOrderDTO[]>(() => {
  if (filtroEstado.value === 'Todos') return listaOrdenes.value;
  return listaOrdenes.value.filter(o => o.Estado === filtroEstado.value);
});

const categoriasCatalogo = computed<string[]>(() => {
  const categoriasUnicas = new Set(listaExamenes.value.map((ex: CatalogoExamen) => ex.Categoria));
  return ['Todos', ...Array.from(categoriasUnicas)];
});

const loadDashboardData = async (): Promise<void> => {
  if (!labId.value || labId.value === 0) return;
  try {
    dashboardData.value = await labDashboardRepo.getDashboardMetrics(labId.value);
  } catch (e: unknown) {
    const err = e as ApiErrorResponse;
    console.error("[LabDashboard] Error cargando KPIs:", err.message);
  }
};

const loadCatalogoExamenes = async (): Promise<void> => {
  loadingCatalogo.value = true;
  try {
    listaExamenes.value = await labRepo.getCatalogo();
  } catch {
    toast.error("Error al cargar el catálogo de exámenes.");
  } finally {
    loadingCatalogo.value = false;
  }
};

const actualizarPrecioExamen = async (item: CatalogoExamen): Promise<void> => {
  if (item.Precio === undefined || item.Precio < 0) return;
  guardandoPrecioId.value = item.ExamID;
  try {
    await labRepo.actualizarPrecioExamen(item.ExamID, Number(item.Precio), labId.value);
    toast.success(`Precio de ${item.NombreExamen} actualizado a $${Number(item.Precio || 0).toFixed(2)}`);
  } catch {
    toast.error("Fallo al actualizar la tarifa en la base de datos.");
  } finally {
    guardandoPrecioId.value = null;
  }
};

/**
 * Carga las órdenes e inmediatamente complementa los exámenes en tiempo real de forma reactiva
 * @param esBackground Si es true, actualiza los datos sin mostrar la animación de carga
 */
const cargarOrdenesOperativas = async (esBackground = false): Promise<void> => {
  if (!labId.value || labId.value === 0) return;

  if (!esBackground) {
    cargandoOrdenes.value = true;
  }

  try {
    const ordenes = await labRepo.getOrdenes(labId.value, 'Todos');

    // Obtenemos los exámenes individualizados para cada orden en paralelo
    const ordenesConDetalles = await Promise.all(
      ordenes.map(async (orden) => {
        if (!orden.examenes || orden.examenes.length === 0) {
          try {
            const examenesCargados = await labRepo.getDetalleExamenesOrden(orden.OrdenID);
            return { ...orden, examenes: examenesCargados };
          } catch {
            return orden;
          }
        }
        return orden;
      })
    );

    listaOrdenes.value = ordenesConDetalles;
  } catch {
    if (!esBackground) {
      toast.error("Error al obtener la lista de órdenes.");
    }
  } finally {
    if (!esBackground) {
      cargandoOrdenes.value = false;
    }
  }
};

/**
 * Abre el modal y garantiza el refresco del desglose de la orden elegida
 */
const abrirModalDetalle = async (orden: LaboratoryOrderDTO): Promise<void> => {
  ordenParaDetalle.value = { ...orden };
  showDetailsModal.value = true;

  if (!ordenParaDetalle.value.examenes || ordenParaDetalle.value.examenes.length === 0) {
    try {
      const examenesCargados = await labRepo.getDetalleExamenesOrden(orden.OrdenID);
      ordenParaDetalle.value.examenes = examenesCargados;
    } catch (e) {
      console.error("Error al obtener los exámenes para el modal de detalles:", e);
    }
  }
};

/**
 * Refresca la vista completa tras haber editado los exámenes en el modal
 */
const handleOrdenActualizada = async (): Promise<void> => {
  await cargarOrdenesOperativas(false);
  await loadDashboardData();
};

const procesarAceptarOrden = async (ordenId: number): Promise<void> => {
  try {
    await labRepo.aceptarOrden(ordenId);
    toast.success("Orden aceptada correctamente.");
    await cargarOrdenesOperativas(false);
    await loadDashboardData();
  } catch {
    toast.error("No se pudo aceptar la orden.");
  }
};

const abrirModalQR = (): void => {
  qrInputCodigo.value = '';
  showQRModal.value = true;
};

const ejecutarValidacionQR = async (): Promise<void> => {
  if (!qrInputCodigo.value.trim()) return;
  try {
    await labRepo.validarCodigoQR(qrInputCodigo.value.trim(), labId.value);
    toast.success("Recepción de paciente confirmada.");
    showQRModal.value = false;
    await cargarOrdenesOperativas(false);
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

const ejecutarSubidaPDF = async (): Promise<void> => {
  if (!ordenParaSubir.value) return;
  subiendoPDF.value = true;
  try {
    const res = await labRepo.subirResultadosPDF(ordenParaSubir.value.OrdenID, archivoPDFSeleccionado.value);
    toast.success(`Orden completada exitosamente. Comisión SaaS 5% registrada: $${res.comision_generada.toFixed(2)}`);
    showUploadModal.value = false;
    await cargarOrdenesOperativas(false);
    await loadDashboardData();
  } catch {
    toast.error("Error al finalizar la orden en el sistema.");
  } finally {
    subiendoPDF.value = false;
  }
};

const examenesFiltradosPorCategoria = computed<CatalogoExamen[]>(() => {
  let resultado = listaExamenes.value;
  if (categoriaSeleccionada.value !== 'Todos') {
    resultado = resultado.filter((ex: CatalogoExamen) =>
      ex.Categoria.toLowerCase() === categoriaSeleccionada.value.toLowerCase()
    );
  }
  const query = busquedaExamen.value.toLowerCase().trim();
  if (query) {
    resultado = resultado.filter((ex: CatalogoExamen) =>
      ex.NombreExamen.toLowerCase().includes(query) ||
      (ex.CondicionesPaciente && ex.CondicionesPaciente.toLowerCase().includes(query))
    );
  }
  return resultado;
});

const getEstadoClass = (estado?: string | null) => {
  const e = estado ? estado.toLowerCase() : '';
  if (e.includes('pendiente') || e.includes('espera') || e.includes('emitida')) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  if (e.includes('listo') || e.includes('completado') || e.includes('entregado') || e.includes('finalizado')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  return 'bg-teal-500/10 text-[#008ba3] border-teal-500/20';
};

const getBadgeEstadoBadge = (estado: EstadoOrdenLaboratorio | string) => {
  switch (estado) {
    case 'Emitida': return 'bg-slate-100 text-slate-700 border border-slate-200';
    case 'Aceptada': return 'bg-[#008ba3] text-white';
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
      void cargarOrdenesOperativas(false);
    }
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
.contenedor-mini-logo-3d {
  width: 44px;
  height: 44px;
  perspective: 600px;
  animation: miniFlotarImagen 4.5s ease-in-out infinite;
}

.mini-logo-cuerpo-3d {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  padding: 1.5px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.15) 100%);
  box-shadow:
    0 8px 16px rgba(0, 120, 160, 0.22),
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1.5px 3px rgba(255, 255, 255, 0.8);
  transform: rotateX(8deg) rotateY(-5deg);
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mini-logo-cuerpo-3d:hover {
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

.animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>