<template>
  <div class="min-h-screen bg-white p-12 max-w-4xl mx-auto text-left font-sans text-slate-800">

    <div class="no-print mb-8 bg-slate-100 p-4 rounded-2xl flex justify-between items-center border border-slate-200">
      <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-600">Vista Previa del Reporte Ejecutivo</h4>
        <p class="text-[11px] text-slate-400 font-medium">Filtro activo: <span class="font-bold text-[#005596] uppercase">{{ tipoFiltro }}</span></p>
      </div>
      <div class="flex gap-3">
        <button
          v-if="loading"
          disabled
          class="px-6 py-2.5 bg-slate-300 text-slate-500 font-black text-xs uppercase tracking-wider rounded-xl"
        >
          Sincronizando Base de Datos...
        </button>
        <button
          v-else
          @click="mandarAImprimir"
          class="px-6 py-2.5 bg-[#005596] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
        >
          🖨️ Confirmar Impresión / Guardar PDF
        </button>
      </div>
    </div>

    <header class="border-b-4 border-[#005596] pb-6 mb-8 flex justify-between items-end">
      <div>
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-[#005596]">MedCore Global — Corporate Analytics</span>
        <h1 class="text-3xl font-black text-slate-900 uppercase tracking-tight mt-1">Reporte Ejecutivo de Auditoría</h1>
        <p class="text-xs text-slate-400 font-bold mt-0.5">Control de Indicadores de Calidad e Infraestructura Médica</p>
      </div>
      <div class="text-right text-xs font-mono font-bold text-slate-500">
        <p>FECHA: {{ fechaEmision }}</p>
        <p>EMISIÓN: Panel Central Admin</p>
      </div>
    </header>

    <div class="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
      <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Resumen Ejecutivo General</h3>

      <p v-if="tipoFiltro.startsWith('saas-')" class="text-xs text-slate-600 leading-relaxed font-medium">
        El presente apartado detalla la auditoría de infraestructura transaccional y comercial correspondiente al aprovisionamiento de licencias SaaS del ecosistema MedCore Global. El análisis evalúa de forma estricta la recaudación del Ingreso Recurrente Mensual (MRR), la distribución volumétrica de los nodos institucionales activos y la participación comercial de cada plan para la optimización de servidores locales virtuales.
      </p>
      <p v-else class="text-xs text-slate-600 leading-relaxed font-medium">
        Este documento consolida las misiones y métricas críticas obtenidas transaccionalmente desde los repositorios de datos corporativos de MedCore Global. El objetivo de la presente auditoría es identificar desviaciones operativas, evaluar los niveles de respuesta clínica por departamento y garantizar el cumplimiento de los estándares internacionales de seguridad y atención médica.
      </p>
    </div>

    <section v-if="['general', 'seguridad'].includes(tipoFiltro)" class="seccion-reporte mb-10 break-inside-avoid shadow-3xs p-6 rounded-2xl border border-slate-100">
      <h2 class="text-sm font-black uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
        <span>1.</span> Indicadores de Seguridad Clínica y Funnel Operacional
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div class="p-2 h-56 flex items-center justify-center">
          <apexchart v-if="!loading" type="bar" height="200" class="w-full" :options="chartFunnelOptions" :series="chartFunnelSeries" />
          <div v-else class="text-xs font-bold text-slate-300 animate-pulse">Cargando Gráfica de Seguridad...</div>
        </div>
        <div class="space-y-2">
          <h4 class="text-xs font-black text-slate-700 uppercase">Análisis Descriptivo Técnico:</h4>
          <p class="text-xs text-slate-500 leading-relaxed font-medium">
            Se evidencia un estricto control de mitigación de riesgos operacionales analizando el volumen de consultas por estado corporativo. Los índices de errores de validación permanecen en márgenes controlados. Las alertas garantizan un apego normativo superior en la protección de datos e integridad clínica del paciente.
          </p>
        </div>
      </div>
    </section>

    <section v-if="['general', 'eficiencia'].includes(tipoFiltro)" class="seccion-reporte mb-10 break-inside-avoid shadow-3xs p-6 rounded-2xl border border-slate-100">
      <h2 class="text-sm font-black uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
        <span>2.</span> Evolución de Demanda, Eficacia y Tiempos
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div class="p-2 h-56 flex items-center justify-center">
          <apexchart v-if="!loading" type="line" height="200" class="w-full" :options="chartEvolucionOptions" :series="chartEvolucionSeries" />
          <div v-else class="text-xs font-bold text-slate-300 animate-pulse">Cargando Gráfica de Evolución...</div>
        </div>
        <div class="space-y-2">
          <h4 class="text-xs font-black text-slate-700 uppercase">Análisis Descriptivo Técnico:</h4>
          <p class="text-xs text-slate-500 leading-relaxed font-medium">
            La tasa de productividad mensual refleja un promedio estable, reduciendo los cuellos de botella en el procesamiento de agendas principales. La correlación entre consultas concluidas y facturación total optimiza los costes del SaaS, mitigando las pérdidas financieras por inasistencias de profesionales.
          </p>
        </div>
      </div>
    </section>

    <section v-if="['general', 'pacientes'].includes(tipoFiltro)" class="seccion-reporte mb-10 break-inside-avoid shadow-3xs p-6 rounded-2xl border border-slate-100">
      <h2 class="text-sm font-black uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
        <span>3.</span> Relación e Interacción con Pacientes (Densidad Horaria)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div class="p-2 h-56 flex items-center justify-center">
          <apexchart v-if="!loading" type="heatmap" height="200" class="w-full" :options="chartHeatmapOptions" :series="chartHeatmapSeries" />
          <div v-else class="text-xs font-bold text-slate-300 animate-pulse">Cargando Mapa de Agendas...</div>
        </div>
        <div class="space-y-2">
          <h4 class="text-xs font-black text-slate-700 uppercase">Análisis Descriptivo Técnico:</h4>
          <p class="text-xs text-slate-500 leading-relaxed font-medium">
            Los indicadores de saturación por hora día permiten predecir los picos de demandas. Las quejas estructuradas disminuyeron gracias al módulo de reprogramación automática. Se recomienda potenciar las ventanas de atención en las horas críticas detectadas en el mapa térmico de calor superior.
          </p>
        </div>
      </div>
    </section>

    <section v-if="tipoFiltro === 'saas-general'" class="seccion-reporte mb-10 break-inside-avoid shadow-3xs p-6 rounded-2xl border border-slate-100 animate-fade-in">
      <h2 class="text-sm font-black uppercase tracking-wider text-[#005596] border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
        <span>📊</span> Auditoría Consolidada de Control SaaS (Métricas Base)
      </h2>
      <p class="text-xs text-slate-500 font-medium leading-relaxed mb-5">
        Métricas macro calculadas mediante aislamiento transaccional. Evalúa la cantidad total de identidades operacionales con conectividad activa y el cómputo finalizado del Ingreso Recurrente Mensual (MRR).
      </p>

      <div class="overflow-hidden border border-slate-200 rounded-xl">
        <table class="w-full border-collapse bg-white text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-600 font-black uppercase border-b border-slate-200">
              <th class="p-4 text-left">Categoría de Auditoría</th>
              <th class="p-4 text-right w-44">Valor Transaccional</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
            <tr v-for="(row, idx) in saasTablaData" :key="idx" class="hover:bg-slate-50/50">
              <td class="p-4 uppercase tracking-tight text-slate-900">{{ row.Categoria }}</td>
              <td class="p-4 text-right font-mono font-black text-slate-800 text-sm">{{ row.Valor }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="tipoFiltro === 'saas-plan'" class="seccion-reporte mb-10 break-inside-avoid shadow-3xs p-6 rounded-2xl border border-slate-100 animate-fade-in">
      <h2 class="text-sm font-black uppercase tracking-wider text-purple-700 border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
        <span>💎</span> Distribución Comercial y Penetración por Plan SaaS
      </h2>
      <p class="text-xs text-slate-500 font-medium leading-relaxed mb-5">
        Análisis de participación de mercado segmentado por modelo de suscripción. Permite evaluar la eficiencia comercial y el impacto económico individualizado por categoría de licenciamiento.
      </p>

      <div class="overflow-hidden border border-slate-200 rounded-xl">
        <table class="w-full border-collapse bg-white text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-600 font-black uppercase border-b border-slate-200">
              <th class="p-4 text-left">Plan SaaS</th>
              <th class="p-4 text-center">Nº Usuarios</th>
              <th class="p-4 text-right">Ingreso Neto</th>
              <th class="p-4 text-right">Participación</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-semibold text-slate-700 uppercase">
            <tr v-for="(row, idx) in saasTablaData" :key="idx" class="hover:bg-slate-50/50">
              <td class="p-4 font-black text-[#005596]">{{ row.NombrePlan }}</td>
              <td class="p-4 text-center font-mono font-bold">{{ row.CantidadUsuarios }}</td>
              <td class="p-4 text-right font-mono font-black text-emerald-600 text-sm">$ {{ Number(row.IngresoGenerado || 0).toFixed(2) }}</td>
              <td class="p-4 text-right font-mono text-slate-500">{{ Number(row.PorcentajeParticipacion || 0).toFixed(1) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <footer class="border-t border-slate-200 pt-6 mt-12 flex justify-between text-[10px] text-slate-400 font-mono">
      <p>MedCore Global S.A. — Documento de Auditoría Interna Confidencial</p>
      <p>SaaS Engine Rev: 2026.06</p>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { ReportRepository} from '../../../src/modules/admin/infrastructure/ReportRepository';
import type { DashboardAnalyticsResponse } from '../../../src/modules/admin/domain/Analytics';

const route = useRoute();
const toast = useToast();
const repo = new ReportRepository();

const loading = ref<boolean>(true);
const analyticsData = ref<DashboardAnalyticsResponse>({
  funnel: [], pacientes: [], heatmap: [], evolucion: [], profesionales: []
});

// INTERFAZ LOCAL ROBUSTA: Define propiedades opcionales para evitar ANY
interface SaasRenderRow {
  Categoria?: string;
  Valor?: string | number;
  NombrePlan?: string;
  CantidadUsuarios?: number;
  IngresoGenerado?: number;
  PorcentajeParticipacion?: number;
}

const saasTablaData = ref<SaasRenderRow[]>([]);

const tipoFiltro = computed(() => (route.query.tipo as string) || 'general');

const fechaEmision = computed(() => {
  return new Date().toLocaleDateString('es-HN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
});

const cargarMétricasReporte = async () => {
  loading.value = true;
  try {
    if (tipoFiltro.value === 'saas-general') {
      const res = await repo.obtenerReporteSaaS('general');
      saasTablaData.value = res as SaasRenderRow[];
    } else if (tipoFiltro.value === 'saas-plan') {
      const res = await repo.obtenerReporteSaaS('por-plan');
      saasTablaData.value = res as SaasRenderRow[];
    } else {
      analyticsData.value = await repo.obtenerMatrizAnalitica();
    }
  } catch {
    toast.error("Fallo de red al capturar métricas analíticas.");
  } finally {
    loading.value = false;
  }
};

// --- CONFIGURACIÓN DE APEXCHARTS DE TUS REPORTES EXISTENTES ---
const chartFunnelSeries = computed(() => [{ name: 'Consultas', data: analyticsData.value.funnel.map(f => Number(f.cantidad)) }]);
const chartFunnelOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: false } },
  colors: ['#005596', '#10b981', '#f59e0b', '#f43f5e'],
  plotOptions: { bar: { borderRadius: 4, horizontal: false, distributed: true, columnWidth: '60%' } },
  xaxis: { categories: analyticsData.value.funnel.map(f => f.estado.toUpperCase()), labels: { style: { fontSize: '9px', fontWeight: 'bold' } } },
  dataLabels: { enabled: true, style: { fontSize: '10px' } },
  legend: { show: false }
}));

const chartEvolucionSeries = computed(() => [
  { name: 'Citas', type: 'column', data: analyticsData.value.evolucion.map(e => Number(e.TotalCitas)) },
  { name: 'Ingresos ($)', type: 'line', data: analyticsData.value.evolucion.map(e => Number(e.FacturacionTotal)) }
]);
const chartEvolucionOptions = computed(() => ({
  chart: { toolbar: { show: false }, animations: { enabled: false } },
  stroke: { width: [0, 3], curve: 'smooth' },
  colors: ['#3b82f6', '#10b981'],
  xaxis: { categories: analyticsData.value.evolucion.map(e => `${e.Mes}/${e.Anio}`), labels: { style: { fontSize: '9px' } } },
  dataLabels: { enabled: false },
  legend: { position: 'top', fontSize: '10px', fontWeight: 'bold' }
}));

const chartHeatmapSeries = computed(() => {
  const diasLabels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  return diasLabels.map((dia, idx) => {
    const diaNum = idx + 1;
    const horasData = Array.from({ length: 11 }, (_, i) => {
      const horaTarget = i + 7;
      const matchingRecord = analyticsData.value.heatmap.find(h => Number(h.DiaSemana) === diaNum && Number(h.HoraDia) === horaTarget);
      return { x: `${horaTarget}h`, y: matchingRecord ? Number(matchingRecord.TotalCitas) : 0 };
    });
    return { name: dia, data: horasData };
  });
});
const chartHeatmapOptions = computed(() => ({
  chart: { type: 'heatmap', toolbar: { show: false }, animations: { enabled: false } },
  dataLabels: { enabled: false }, colors: ["#005596"], xaxis: { labels: { style: { fontSize: '8px' } } }
}));

const mandarAImprimir = () => { window.print(); };

onMounted(() => { cargarMétricasReporte(); });
</script>

<style scoped>
@media print {
  .no-print { display: none !important; }
  body { background: white !important; color: black !important; }
  .break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
}
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>
