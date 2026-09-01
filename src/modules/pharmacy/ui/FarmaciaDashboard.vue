<template>
  <div class="flex min-h-screen bg-[#f4f8f8] font-sans text-slate-800 text-left">
    <!-- 1. BARRA LATERAL (SIDEBAR) -->
    <aside class="w-64 bg-white border-r border-slate-200/80 hidden xl:flex flex-col justify-between p-5 shrink-0 select-none">
      <div class="space-y-6">
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

        <!-- NAV INTERACTIVO -->
        <nav class="space-y-1">
          <button
            @click="tabActual = 'pendientes'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer',
              tabActual === 'pendientes'
                ? 'bg-[#e6f7f8] text-[#00a8b5]'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-bold'
            ]"
          >
            <span class="text-base">📊</span>
            <span>Dashboard</span>
          </button>

          <router-link
            to="/farmacia/inventario"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <span class="text-base">📦</span>
            <span>Inventario</span>
          </router-link>

          <button
            @click="tabActual = 'historico'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer',
              tabActual === 'historico'
                ? 'bg-[#e6f7f8] text-[#00a8b5]'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-bold'
            ]"
          >
            <span class="text-base">📋</span>
            <span>Recetas & Histórico</span>
          </button>
        </nav>
      </div>

      <div class="space-y-4 pt-4 border-t border-slate-100">
        <button
          @click="enfocarBusqueda"
          class="w-full bg-[#00a8b5] hover:bg-[#008b9b] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#00a8b5]/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>➕ Nuevo Pedido</span>
        </button>
        <button
          @click="cerrarSesion"
          class="w-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200/60"
        >
          <span>🚪 Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- 2. ÁREA CONTENEDORA PRINCIPAL -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="h-20 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h2 class="text-lg font-black text-slate-900 uppercase tracking-tight">Gestión de Farmacia & Stock</h2>
          <p class="text-[11px] font-bold text-slate-400 hidden sm:block">Sede ID: #{{ farmaciaId }} | Canal de Dispensación Directa</p>
        </div>

        <div class="flex-1 max-w-xl mx-4 relative hidden md:block">
          <input
            ref="inputBuscador"
            v-model="criterioBusqueda"
            @keyup.enter="buscarRecetas(false)"
            @input="onSearchInput"
            type="search"
            placeholder="Buscar medicamentos, código de barras, receta o cliente..."
            class="w-full bg-[#faf9f5] border border-slate-200 rounded-2xl pl-11 pr-24 py-2.5 font-bold text-xs text-slate-800 outline-none focus:border-[#00a8b5] focus:bg-white transition-all"
          />
          <span class="absolute left-4 top-3 text-slate-400 text-sm">🔍</span>
          <button
            @click="buscarRecetas(false)"
            :disabled="cargando"
            class="absolute right-1.5 top-1.5 bg-[#00a8b5] hover:bg-[#008b9b] text-white px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer"
          >
            {{ cargando ? '...' : 'Buscar' }}
          </button>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex justify-between items-start">
            <div>
              <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Medicamentos</p>
              <h3 class="text-2xl font-black text-slate-800 mt-1">{{ metricas.inventario_activo }}</h3>
              <div class="flex items-center gap-1.5 mt-3">
                <span class="text-[10px] font-black text-[#00a8b5] bg-[#e6f7f8] px-2 py-0.5 rounded-md">Ítems activos</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-[#e6f7f8] text-[#00a8b5] flex items-center justify-center font-bold text-lg">💊</div>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex justify-between items-start">
            <div>
              <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Recetas por Despachar</p>
              <h3 class="text-2xl font-black text-slate-800 mt-1">{{ metricas.recetas_pendientes }}</h3>
              <div class="mt-3">
                <span class="text-[10px] font-black text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-md">Requiere atención</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">📄</div>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex justify-between items-start">
            <div>
              <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Stock Bajo / Alertas</p>
              <h3 class="text-2xl font-black text-slate-800 mt-1">{{ metricas.alertas_stock }}</h3>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-[10px] font-black text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-md">Nivel Crítico</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">⚠️</div>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex justify-between items-start">
            <div>
              <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Ventas del Día</p>
              <h3 class="text-2xl font-black text-slate-800 mt-1">
                L. {{ (metricas?.facturacion_diaria ?? 0).toLocaleString('es-HN', { minimumFractionDigits: 2 }) }}
              </h3>
              <div class="mt-3">
                <span class="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Facturación hoy</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">💵</div>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">

            <!-- CABECERA DE TABLA CON SELECTOR DE PESTAÑAS (PENDIENTES vs HISTÓRICO) -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <h3 class="text-base font-black text-slate-800 tracking-tight">Pedidos & Consultas Médicas</h3>

              <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
                <button
                  @click="tabActual = 'pendientes'"
                  :class="[
                    'px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer',
                    tabActual === 'pendientes'
                      ? 'bg-white text-[#00a8b5] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  ]"
                >
                  📋 Por Despachar
                </button>
                <button
                  @click="tabActual = 'historico'"
                  :class="[
                    'px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer',
                    tabActual === 'historico'
                      ? 'bg-white text-[#00a8b5] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  ]"
                >
                  ✅ Histórico (Surtidas)
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th class="py-3 px-2">Paciente / Cliente</th>
                    <th class="py-3 px-2">Medicamentos Prescritos</th>
                    <th class="py-3 px-2">Médico</th>
                    <th class="py-3 px-2">Fecha</th>
                    <th class="py-3 px-2 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs">
                  <tr v-for="grupo in consultasFiltradas" :key="grupo.ConsultaID" class="hover:bg-[#faf9f5]/80 transition-colors">
                    <td class="py-4 px-2 align-top">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-[#00a8b5]/10 text-[#00a8b5] font-black flex items-center justify-center text-[11px] shrink-0">
                          {{ getIniciales(grupo.Paciente) }}
                        </div>
                        <div>
                          <p class="font-black text-slate-800 uppercase">{{ grupo.Paciente }}</p>
                          <div class="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span class="text-[10px] font-bold text-[#00a8b5]">Consulta #{{ grupo.ConsultaID }}</span>
                            <span class="text-[10px] font-semibold text-slate-400">| DNI: {{ grupo.PacienteDNI }}</span>
                          </div>
                         <!-- CÓDIGO DE CANJE EN LA TABLA (SOLO CÓDIGO SELECCIONABLE) -->
                          <div v-if="grupo.CodigoCanje" class="mt-1">
                            <div
                              class="inline-flex items-center gap-1 text-[9px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 hover:bg-slate-200/60 transition-colors"
                              :title="grupo.CodigoCanje"
                            >
                              <span class="select-none">🔑</span>
                              <span class="font-bold tracking-tight break-all select-all text-slate-700">
                                {{ grupo.CodigoCanje }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td class="py-4 px-2">
                      <div class="space-y-1.5 max-w-sm max-h-36 overflow-y-auto pr-1">
                        <div
                          v-for="med in grupo.Medicamentos"
                          :key="med.RecetaID"
                          class="bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex items-center justify-between gap-2"
                        >
                          <div>
                            <p class="font-black text-slate-800 text-[11px]">💊 {{ med.NombreMedicamento }}</p>
                            <p class="text-[10px] text-[#008b9b] font-bold" v-if="med.Dosis">{{ med.Dosis }}</p>
                          </div>

                          <button
                            @click.stop="avanzarEstadoReceta(med, grupo)"
                            :title="'Clic para cambiar estado'"
                            :class="getBadgeClass(med.EstadoReceta)"
                            class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            {{ med.EstadoReceta }}
                          </button>
                        </div>
                      </div>
                    </td>

                    <td class="py-4 px-2 font-bold text-slate-600 align-top">{{ grupo.MedicoTratante || 'Mostrador' }}</td>
                    <td class="py-4 px-2 font-bold text-slate-500 text-[11px] align-top">{{ formatearFecha(grupo.FechaEmision) }}</td>

                    <td class="py-4 px-2 text-right align-top">
                      <button
                        @click="abrirModalSurtidoConsulta(grupo)"
                        :class="[
                          'px-3.5 py-2 rounded-xl font-black text-[10px] uppercase cursor-pointer shadow-xs transition-all',
                          tabActual === 'pendientes'
                            ? 'bg-[#00a8b5] text-white hover:bg-[#008b9b]'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        ]"
                      >
                        {{ tabActual === 'pendientes' ? 'Gestionar / Surtir' : 'Ver Detalle' }}
                      </button>
                    </td>
                  </tr>

                  <!-- MENSAJE DE ESTADO VACÍO -->
                  <tr v-if="consultasFiltradas.length === 0">
                    <td colspan="5" class="py-8 text-center text-slate-400 font-bold text-xs">
                      {{ tabActual === 'pendientes' ? 'No hay recetas pendientes por despachar.' : 'No hay recetas registradas en el histórico de surtidas.' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="pagination.last_page > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              <div>
                Mostrando página <span class="font-black text-slate-800">{{ pagination.current_page }}</span> de <span class="font-black text-slate-800">{{ pagination.last_page }}</span> ({{ pagination.total }} registros totales)
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  @click="cambiarPagina(pagination.current_page - 1)"
                  :disabled="pagination.current_page === 1"
                  class="px-3 py-1.5 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  ◀ Anterior
                </button>

                <div class="flex items-center gap-1">
                  <button
                    v-for="page in paginasVisibles"
                    :key="page"
                    @click="cambiarPagina(page)"
                    :class="[
                      'w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center',
                      page === pagination.current_page
                        ? 'bg-[#00a8b5] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>

                <button
                  @click="cambiarPagina(pagination.current_page + 1)"
                  :disabled="pagination.current_page === pagination.last_page"
                  class="px-3 py-1.5 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Siguiente ▶
                </button>
              </div>
            </div>
          </div>

          <!-- BLOQUE ESCÁNER MÁS PEQUEÑO Y COMPACTO -->
          <div class="lg:col-span-4 space-y-4">
            <div class="bg-[#00685b] text-white rounded-2xl p-4 shadow-sm text-center space-y-2 relative overflow-hidden">
              <div class="w-8 h-8 rounded-xl bg-white/10 mx-auto flex items-center justify-center text-base">📷</div>
              <h3 class="text-xs font-black uppercase tracking-tight">+ Nuevo Despacho / Escáner</h3>
              <p class="text-[10px] text-white/80 font-medium leading-tight">Escanee código de barras o DNI del paciente.</p>
              <button
                @click="ejecutarEscanerLector"
                class="w-full bg-white text-[#00685b] hover:bg-slate-50 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-xs mt-1"
              >
                Activar Escáner
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- MODAL ESTILO RECETA ELECTRÓNICA -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-slate-100 space-y-6 text-left max-h-[90vh] overflow-y-auto">

        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-[#00a8b5]/10 text-[#00a8b5] flex items-center justify-center text-lg font-black">📋</div>
            <h3 class="text-base font-black text-slate-800 uppercase tracking-tight">Sistema de Receta Electrónica - MedGo+</h3>
          </div>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer">✕</button>
        </div>

        <div v-if="consultaSeleccionada" class="bg-[#f0f9fa] border border-[#00a8b5]/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-[#00a8b5] text-white font-black flex items-center justify-center text-lg shadow-sm">
              {{ getIniciales(consultaSeleccionada.Paciente) }}
            </div>
            <div>
              <h4 class="text-sm font-black text-slate-900 uppercase leading-snug">{{ consultaSeleccionada.Paciente }}</h4>
              <p class="text-[11px] font-bold text-slate-500">DNI: {{ consultaSeleccionada.PacienteDNI }}</p>
            </div>
          </div>

          <div class="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
            <p class="text-[11px] font-black text-slate-700">Consulta ID: #{{ consultaSeleccionada.ConsultaID }}</p>
            <p v-if="consultaSeleccionada.CodigoCanje" class="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block my-0.5">
              🔑 {{ consultaSeleccionada.CodigoCanje }}
            </p>
            <p class="text-[10px] font-bold text-slate-400">{{ formatearFecha(consultaSeleccionada.FechaEmision) }}</p>
            <p class="text-[10px] font-bold text-[#00a8b5]">{{ consultaSeleccionada.MedicoTratante || 'Médico General' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-slate-800">Receta Activa: Seleccione Medicamentos a Adquirir</span>
              <span class="text-[10px] font-bold text-slate-400">{{ recetasIdsSeleccionadasEnModal.length }} de {{ consultaSeleccionada?.Medicamentos.length }} seleccionados</span>
            </div>

            <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              <div
                v-for="med in consultaSeleccionada?.Medicamentos"
                :key="med.RecetaID"
                class="p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3"
                :class="[
                  esMedicamentoSeleccionado(med.RecetaID)
                    ? 'bg-[#e6f7f8] border-[#00a8b5] text-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                ]"
              >
                <div class="flex items-center gap-3 cursor-pointer" @click="toggleMedicamentoModal(med.RecetaID)">
                  <div
                    :class="[
                      'w-5 h-5 rounded-md flex items-center justify-center font-black text-xs transition-colors',
                      esMedicamentoSeleccionado(med.RecetaID) ? 'bg-[#00a8b5] text-white' : 'bg-white border-2 border-slate-300 text-transparent'
                    ]"
                  >
                    ✓
                  </div>
                  <div>
                    <p class="text-xs font-black" :class="esMedicamentoSeleccionado(med.RecetaID) ? 'text-slate-900' : 'text-slate-500 line-through'">
                      💊 {{ med.NombreMedicamento }}
                    </p>
                    <p class="text-[10px] font-bold mt-0.5" :class="esMedicamentoSeleccionado(med.RecetaID) ? 'text-[#008b9b]' : 'text-slate-400'">
                      {{ med.Dosis || 'Según indicación médica' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    @click.stop="avanzarEstadoReceta(med)"
                    :class="getBadgeClass(med.EstadoReceta)"
                    class="text-[9px] font-black uppercase px-2.5 py-1 rounded-md cursor-pointer hover:opacity-80 transition-all"
                  >
                    {{ med.EstadoReceta }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 bg-[#faf9f5] border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <h5 class="text-xs font-black uppercase text-slate-800 border-b border-slate-200 pb-2">
                Resumen de Selección
              </h5>

              <div class="space-y-1 text-xs font-bold text-slate-600">
                <div class="flex justify-between">
                  <span>Prescripciones:</span>
                  <span class="font-black text-slate-900">{{ recetasIdsSeleccionadasEnModal.length }} ítems</span>
                </div>
                <div class="flex justify-between text-[11px] text-slate-400">
                  <span>Pendientes:</span>
                  <span>{{ (consultaSeleccionada?.Medicamentos.length || 0) - recetasIdsSeleccionadasEnModal.length }} ítems</span>
                </div>
              </div>

              <div class="space-y-1 pt-2">
                <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total a Cobrar (L.)</label>
                <input
                  v-model.number="precioTotalInput"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full bg-white border-2 border-slate-200 rounded-xl p-2.5 text-base font-black font-mono text-slate-800 focus:border-[#00a8b5] outline-none"
                />
              </div>

              <div class="bg-[#e6f7f8] border border-[#00a8b5]/30 p-2.5 rounded-xl flex justify-between items-center text-[11px] font-bold text-[#008b9b]">
                <span>Comisión (3%):</span>
                <span class="font-black font-mono">L. {{ comisionCalculada.toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-2 pt-2">
              <button
                @click="ejecutarSurtidoSeleccion"
                :disabled="surtiendo || recetasIdsSeleccionadasEnModal.length === 0 || precioTotalInput <= 0"
                class="w-full bg-[#00a8b5] hover:bg-[#008b9b] disabled:opacity-50 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                {{ surtiendo ? 'Procesando...' : 'Confirmar & Entregar' }}
              </button>
              <button @click="showModal = false" class="w-full py-1 text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer">
                Cancelar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { PharmacyRepository } from '../infrastructure/PharmacyRepository';
import type { RecetaFarmaciaDTO, EstadoReceta, PharmacyMetricsDTO, PaginationDTO, ConsultaAgrupadaDTO } from '../domain/PharmacyModels';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const repo = new PharmacyRepository();
const toast = useToast();
const authStore = useAuthStore();

const inputBuscador = ref<HTMLInputElement | null>(null);

// Pestaña activa ('pendientes' | 'historico')
const tabActual = ref<'pendientes' | 'historico'>('pendientes');

const metricas = ref<PharmacyMetricsDTO>({
  inventario_activo: 0,
  recetas_pendientes: 0,
  alertas_stock: 0,
  facturacion_diaria: 0
});

const pagination = ref<PaginationDTO>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
});

const router = useRouter();

const cerrarSesion = (): void => {
  if (typeof authStore.logout === 'function') {
    authStore.logout();
  } else {
    authStore.token = '';
    authStore.user = null;
  }
  toast.info('Sesión finalizada.');
  router.push('/');
};

const criterioBusqueda = ref<string>('');
const cargando = ref<boolean>(false);
const recetas = ref<RecetaFarmaciaDTO[]>([]);

const consultasAgrupadas = computed<ConsultaAgrupadaDTO[]>(() => {
  const mapa = new Map<number, ConsultaAgrupadaDTO>();

  for (const p of recetas.value) {
    const idGrupo = p.ConsultaID ?? p.RecetaID;

    if (!mapa.has(idGrupo)) {
      mapa.set(idGrupo, {
        ConsultaID: idGrupo,
        CodigoCanje: p.CodigoCanje || '',
        Paciente: p.Paciente || 'Paciente General',
        PacienteDNI: p.PacienteDNI || 'N/D',
        MedicoTratante: p.MedicoTratante || 'Médico General',
        FechaEmision: p.FechaEmision,
        Medicamentos: []
      });
    }
    mapa.get(idGrupo)?.Medicamentos.push(p);
  }

  return Array.from(mapa.values());
});

const consultasFiltradas = computed<ConsultaAgrupadaDTO[]>(() => {
  const q = criterioBusqueda.value.trim().toLowerCase().replace('#', '');
  if (!q) return consultasAgrupadas.value;

  return consultasAgrupadas.value.filter((item: ConsultaAgrupadaDTO) => {
    const nombreCompleto = (item.Paciente || '').toLowerCase();
    const dni = String(item.PacienteDNI || '').toLowerCase();
    const consultaId = String(item.ConsultaID || '').toLowerCase();
    const token = String(item.CodigoCanje || '').toLowerCase();

    const tieneMedicamento = Array.isArray(item.Medicamentos)
      ? item.Medicamentos.some((m: RecetaFarmaciaDTO) =>
          (m.NombreMedicamento || '').toLowerCase().includes(q)
        )
      : false;

    return (
      nombreCompleto.includes(q) ||
      dni.includes(q) ||
      consultaId.includes(q) ||
      token.includes(q) ||
      tieneMedicamento
    );
  });
});

const showModal = ref<boolean>(false);
const consultaSeleccionada = ref<ConsultaAgrupadaDTO | null>(null);
const recetasIdsSeleccionadasEnModal = ref<number[]>([]);
const precioTotalInput = ref<number>(0);
const surtiendo = ref<boolean>(false);

const farmaciaId = computed<number>(() => {
  const userObj = authStore.user as (Record<string, unknown> & { entidadId?: number; entidad_id?: number }) | null;
  const id = userObj?.entidad_id || userObj?.entidadId;
  return id ? Number(id) : 5;
});

const comisionCalculada = computed<number>(() => {
  return (precioTotalInput.value || 0) * 0.03;
});

const paginasVisibles = computed<number[]>(() => {
  const pages: number[] = [];
  const start = Math.max(1, pagination.value.current_page - 2);
  const end = Math.min(pagination.value.last_page, pagination.value.current_page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

watch(tabActual, () => {
  pagination.value.current_page = 1;
  cargarMetricas(1);
});

const cargarMetricas = async (page: number = 1): Promise<void> => {
  try {
    const yaCanjeadaVal = tabActual.value === 'historico' ? 1 : 0;
    const res = await repo.getMetrics(farmaciaId.value, page, yaCanjeadaVal);

    if (res && res.metricas) metricas.value = res.metricas;
    if (res && res.pedidos) recetas.value = res.pedidos;
    if (res && res.pagination) pagination.value = res.pagination;
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    toast.error('No se pudieron obtener los datos de la farmacia.');
  }
};

const cambiarPagina = async (nuevaPagina: number): Promise<void> => {
  if (nuevaPagina >= 1 && nuevaPagina <= pagination.value.last_page) {
    await cargarMetricas(nuevaPagina);
  }
};

onMounted(() => {
  cargarMetricas(1);
});

const onSearchInput = async (): Promise<void> => {
  if (!criterioBusqueda.value.trim()) {
    await cargarMetricas(1);
  }
};

const buscarRecetas = async (isBackground = false): Promise<void> => {
  if (!criterioBusqueda.value.trim()) {
    await cargarMetricas(1);
    return;
  }

  if (!isBackground) cargando.value = true;
  try {
    recetas.value = await repo.buscarReceta(criterioBusqueda.value.trim());
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: recetas.value.length,
      total: recetas.value.length
    };
    if (!isBackground) toast.success('Búsqueda completada.');
  } catch (error: unknown) {
    recetas.value = [];
    if (!isBackground) {
      toast.error(error instanceof Error ? error.message : 'Sin resultados.');
    }
  } finally {
    if (!isBackground) cargando.value = false;
  }
};

const ejecutarEscanerLector = async (): Promise<void> => {
  if (!criterioBusqueda.value.trim()) {
    enfocarBusqueda();
    toast.info('Escanee o digite el código en la barra de búsqueda superior.');
    return;
  }

  try {
    const ordenEscaneada = await repo.scanBarcode(criterioBusqueda.value.trim());
    toast.success(`Orden #${ordenEscaneada.id} encontrada para ${ordenEscaneada.patient}`);
    await buscarRecetas(false);
  } catch {
    toast.error('Código no encontrado en el sistema.');
  }
};

const avanzarEstadoReceta = async (receta: RecetaFarmaciaDTO, grupo?: ConsultaAgrupadaDTO): Promise<void> => {
  let siguienteEstado: EstadoReceta = 'Recibida por Farmacia';

  if (receta.EstadoReceta === 'Emitida') {
    siguienteEstado = 'Recibida por Farmacia';
  } else if (receta.EstadoReceta === 'Recibida por Farmacia') {
    siguienteEstado = 'Reservada';
  } else if (receta.EstadoReceta === 'Reservada') {
    if (grupo) {
      abrirModalSurtidoConsulta(grupo);
    } else if (consultaSeleccionada.value) {
      recetasIdsSeleccionadasEnModal.value = [receta.RecetaID];
    } else {
      const targetGrupo = consultasAgrupadas.value.find(g => g.Medicamentos.some(m => m.RecetaID === receta.RecetaID));
      if (targetGrupo) abrirModalSurtidoConsulta(targetGrupo);
    }
    return;
  } else {
    return;
  }

  try {
    await repo.cambiarEstado(receta.RecetaID, siguienteEstado, farmaciaId.value);
    receta.EstadoReceta = siguienteEstado;
    toast.success(`Receta #${receta.RecetaID} actualizada a '${siguienteEstado}'`);
    await cargarMetricas(pagination.value.current_page);
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : 'Error al cambiar estado.');
  }
};

const abrirModalSurtidoConsulta = (grupo: ConsultaAgrupadaDTO): void => {
  consultaSeleccionada.value = grupo;
  recetasIdsSeleccionadasEnModal.value = grupo.Medicamentos
    .filter(m => m.EstadoReceta !== 'Surtida')
    .map(m => m.RecetaID);
  precioTotalInput.value = 0;
  showModal.value = true;
};

const toggleMedicamentoModal = (recetaId: number) => {
  const index = recetasIdsSeleccionadasEnModal.value.indexOf(recetaId);
  if (index > -1) {
    recetasIdsSeleccionadasEnModal.value.splice(index, 1);
  } else {
    recetasIdsSeleccionadasEnModal.value.push(recetaId);
  }
};

const esMedicamentoSeleccionado = (recetaId: number): boolean => {
  return recetasIdsSeleccionadasEnModal.value.includes(recetaId);
};

const ejecutarSurtidoSeleccion = async (): Promise<void> => {
  if (!consultaSeleccionada.value || recetasIdsSeleccionadasEnModal.value.length === 0 || precioTotalInput.value <= 0) return;
  surtiendo.value = true;

  try {
    const res = await repo.surtirRecetasLote(recetasIdsSeleccionadasEnModal.value, precioTotalInput.value, farmaciaId.value);

    toast.success(`¡Despacho exitoso! Comisión MedGo+ (3%): L. ${res.comision_medgo.toFixed(2)}`);
    showModal.value = false;
    await cargarMetricas(pagination.value.current_page);
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : 'Error al procesar el surtido.');
  } finally {
    surtiendo.value = false;
  }
};

const getBadgeClass = (estado: EstadoReceta | string): string => {
  switch (estado) {
    case 'Emitida': return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'Recibida por Farmacia': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'Reservada': return 'bg-[#e6f7f8] text-[#008b9b] border border-[#00a8b5]/30';
    case 'Surtida': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const getIniciales = (nombre: string): string => {
  if (!nombre) return 'PA';
  const partes = nombre.trim().split(' ').filter((p) => p.length > 0);
  return `${partes[0]?.charAt(0) || ''}${partes[1]?.charAt(0) || ''}`.toUpperCase() || 'PA';
};

const formatearFecha = (fechaStr?: string): string => {
  if (!fechaStr) return 'N/D';
  return fechaStr.split(' ')[0]?.split('T')[0] ?? 'N/D';
};

const enfocarBusqueda = (): void => {
  inputBuscador.value?.focus();
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

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

  box-shadow:
    0 8px 16px rgba(0, 120, 160, 0.22),
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1.5px 3px rgba(255, 255, 255, 0.8);

  transform: rotateX(8deg) rotateY(-5deg);
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

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
