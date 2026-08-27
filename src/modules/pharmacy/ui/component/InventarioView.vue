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
          <span class="text-xl font-black tracking-tighter leading-none bg-linear-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">MedGo+</span>
          <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestión Médica Digital</span>
        </div>

        <nav class="space-y-1">
          <router-link
            to="/farmacia/dashboard"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <span class="text-base">📊</span>
            <span>Dashboard</span>
          </router-link>

          <div
            class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#e6f7f8] text-[#00a8b5] font-black text-xs uppercase tracking-wider transition-all"
          >
            <span class="text-base">📦</span>
            <span>Inventario</span>
          </div>
        </nav>
      </div>
    </aside>

    <!-- 2. ÁREA PRINCIPAL -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="h-20 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0">
        <div>
          <h2 class="text-lg font-black text-slate-900 uppercase tracking-tight">Catálogo & Control de Stock</h2>
          <p class="text-[11px] font-bold text-slate-400">Módulo de Administración de Insumos</p>
        </div>
      </header>

      <main class="flex-1 p-6 flex items-center justify-center">
        <!-- CARD EN CONSTRUCCIÓN -->
        <div class="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm text-center space-y-6 relative overflow-hidden">

          <!-- Fondo decorativo sutil -->
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-[#e6f7f8] rounded-full blur-2xl opacity-60"></div>

          <!-- Icono con animación sutil -->
          <div class="relative w-20 h-20 mx-auto rounded-3xl bg-[#e6f7f8] border border-[#00a8b5]/20 flex items-center justify-center shadow-inner">
            <span class="text-4xl animate-bounce">🚧</span>
            <span class="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a8b5] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-[#00a8b5]"></span>
            </span>
          </div>

          <div class="space-y-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-[#00a8b5] bg-[#e6f7f8] px-3 py-1 rounded-full inline-block">
              Próximamente
            </span>
            <h3 class="text-xl font-black text-slate-800 tracking-tight">
              Módulo de Inventario en Desarrollo
            </h3>
            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              Estamos construyendo las herramientas para el control de lotes, fechas de vencimiento y ajuste automático de existencias.
            </p>
          </div>

          <div class="pt-2">
            <router-link
              to="/farmacia/dashboard"
              class="inline-flex items-center gap-2 bg-[#00a8b5] hover:bg-[#008b9b] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#00a8b5]/20"
            >
              <span>◀ Regresar al Dashboard</span>
            </router-link>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.contenedor-mini-logo-3d {
  width: 46px;
  height: 46px;
}
.mini-logo-cuerpo-3d {
  width: 100%;
  height: 100%;
  border-radius: 13px;
  padding: 1.5px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.15) 100%);
  box-shadow: 0 8px 16px rgba(0, 120, 160, 0.22);
}
</style>
