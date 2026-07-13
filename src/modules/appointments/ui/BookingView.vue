<template>
  <div class="space-y-8 animate-fade-in pb-20 text-left">

    <div class="flex justify-between items-center border-b border-slate-100 pb-4">
      <div class="text-left">
        <h2 class="text-3xl font-black text-slate-800 tracking-tight uppercase">Agendar Nueva Cita</h2>
        <p class="text-slate-400 font-bold text-xs mt-1">Paso {{ currentStep }} de 4: {{ totalSteps[currentStep - 1]?.shortTitle }}</p>
      </div>
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
      >
        ← Volver
      </button>
    </div>

    <transition name="fade">
      <div
        v-if="form.fecha && form.hora"
        class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4.5 flex items-center gap-4 text-emerald-800 shadow-3xs"
      >
        <div class="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center text-xl animate-pulse">
          <v-icon name="bi-calendar-event" scale="1.1" />
        </div>
        <div class="text-left flex-1">
          <p class="text-[10px] font-black uppercase tracking-widest text-emerald-600 leading-none">Horario Reservado Localmente</p>
          <p class="text-sm font-black mt-1">
            Su cita médica quedará agendada firmemente el día <span class="underline">{{ form.fecha }}</span> a las <span class="underline">{{ form.hora }} HS</span>.
          </p>
        </div>
      </div>
    </transition>

    <div v-if="selectedDoctor" class="bg-white border border-slate-100 rounded-[2.5rem] p-6 text-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-3xs">
      <div class="flex items-center gap-5 w-full sm:w-auto">
        <div class="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner border border-slate-100 shrink-0">
          <v-icon name="bi-people-fill" scale="2.0" class="text-slate-400" />
        </div>
        <div class="text-left space-y-1">
          <div class="flex items-center gap-2">
            <span class="bg-sky-50 text-sky-600 border border-sky-200/50 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">Especialista Verificado</span>
          </div>
          <h3 class="text-xl font-black text-slate-800 tracking-tight">Dr. {{ selectedDoctor.Nombre }} {{ selectedDoctor.Apellido }}</h3>
          <p class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ selectedDoctor.Especialidad }}</p>
        </div>
      </div>
      <div class="text-right bg-slate-50/80 px-6 py-3.5 rounded-2xl border border-slate-100/60 w-full sm:w-auto shrink-0">
        <p class="text-[9px] uppercase font-black text-slate-400 tracking-widest leading-none">Costo de Consulta</p>
        <p class="text-2xl font-black text-emerald-600 mt-1">
          ${{ (selectedDoctor as DoctorExtended).CostoConsulta || (selectedDoctor as DoctorExtended).Precio || 90 }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] p-10 shadow-3xs border border-slate-100 min-h-130 flex flex-col justify-between">

      <div class="flex items-center justify-between border-b border-slate-50 pb-6 mb-4 select-none">
        <div v-for="(step, idx) in totalSteps" :key="step.id" class="flex items-center flex-1 last:flex-none">
          <div class="flex items-center gap-2.5">
            <div
              :class="currentStep === step.id ? 'bg-sky-500 text-white font-black scale-105 shadow-md shadow-sky-100' : currentStep > step.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-400'"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
            >
              <v-icon v-if="currentStep > step.id" name="bi-check" scale="0.9" />
              <span v-else>{{ step.id }}</span>
            </div>
            <span :class="currentStep === step.id ? 'text-slate-800 font-black' : 'text-slate-400 font-bold'" class="text-xs uppercase tracking-wider hidden md:inline">
              {{ step.shortTitle }}
            </span>
          </div>
          <div v-if="idx < totalSteps.length - 1" class="flex-1 h-0.5 mx-4 bg-slate-100 rounded">
            <div class="h-full bg-sky-400 transition-all duration-300" :style="{ width: currentStep > step.id ? '100%' : '0%' }"></div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="flex-1 flex flex-col justify-between space-y-8">

        <div v-if="currentStep === 1" class="space-y-6 animate-step-in">
          <div class="flex items-center gap-2.5 border-l-4 border-sky-400 pl-4">
            <h4 class="text-sm font-black text-slate-700 uppercase tracking-widest">01. Planificación de Fecha y Hora</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700">
                <v-icon name="bi-calendar-event" class="h-4 w-4 text-sky-500"/> Seleccione la Fecha *
              </label>
              <input v-model="form.fecha" type="date" class="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all" />
            </div>
            <div class="space-y-2 text-left">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700">
                <v-icon name="bi-search" class="h-4 w-4 text-sky-500"/> Seleccione o ingrese la hora de atención *
              </label>
              <input v-model="form.hora" type="time" class="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all bg-slate-50/50" />
            </div>
            <div class="md:col-span-2 space-y-2">
              <label class="block text-xs font-bold text-slate-700">Motivo Principal de Consulta *</label>
              <input v-model="form.motivo" type="text" placeholder="Ej: Control dermatológico anual..." class="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div v-if="currentStep === 2" class="space-y-6 animate-step-in">
          <div class="flex items-center gap-2.5 border-l-4 border-sky-400 pl-4">
            <h4 class="text-sm font-black text-slate-700 uppercase tracking-widest">02. Información del Paciente y Emergencia</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700">
                <v-icon name="bi-people-fill" class="h-4 w-4 text-sky-500"/> Nombre Completo
              </label>
              <input v-model="userData.nombre" type="text" readonly class="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 text-xs font-bold text-slate-500 outline-none cursor-not-allowed" />
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700">
                <v-icon name="bi-file-earmark-text-fill" class="h-4 w-4 text-sky-500"/> Correo Electrónico
              </label>
              <input v-model="userData.email" type="email" readonly class="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 text-xs font-bold text-slate-500 outline-none cursor-not-allowed" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Teléfono de Contacto *</label>
              <input v-model="form.telefono" type="text" placeholder="Ej: +504 9999-9999" class="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700">Edad *</label>
                <input v-model="form.edad" type="number" placeholder="Ej: 28" class="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700">Género *</label>
                <select v-model="form.genero" class="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-bold focus:border-sky-400 outline-none bg-white">
                  <option value="">Seleccione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>
          </div>
          <div class="pt-6 border-t border-slate-100 space-y-4">
            <h5 class="text-xs font-black text-slate-500 uppercase tracking-wider">Contacto de Emergencia Asociado</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700">Nombre del Responsable *</label>
                <input v-model="form.contactoNombre" type="text" placeholder="Nombre completo del contacto" class="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-bold focus:border-sky-400 outline-none" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700">Teléfono de Emergencia *</label>
                <input v-model="form.contactoTel" type="text" placeholder="Ej: +504 9999-0000" class="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-bold focus:border-sky-400 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="space-y-5">
          <div class="flex items-center gap-2.5 border-l-4 border-sky-400 pl-4 mb-2">
            <h4 class="text-sm font-black text-slate-700 uppercase tracking-widest">03. Historial e Información Médica</h4>
          </div>

          <div class="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
            <button
              type="button"
              v-for="subTab in subTabs" :key="subTab.id"
              @click="activeSubTab = subTab.id"
              :class="activeSubTab === subTab.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-black shadow-3xs' : 'text-slate-400 hover:bg-slate-50 font-bold'"
              class="px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer"
            >
              {{ subTab.label }}
            </button>
          </div>

          <div v-if="activeSubTab === 'sintomas'" class="space-y-4 animate-fade-in text-left">
            <div class="bg-white rounded-2xl border border-slate-100 p-5 space-y-3 shadow-3xs">
              <div class="flex items-center gap-2 text-rose-500">
                <v-icon name="bi-people-fill" class="h-4 w-4" />
                <p class="text-xs font-black uppercase text-slate-700 tracking-wider">Enfermedades Crónicas</p>
              </div>
              <p class="text-[11px] text-slate-400 font-bold">Selecciona todas las que apliquen</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label
                  v-for="cronica in listaCronicas" :key="cronica.EnfermedadID"
                  :class="form.cronicasSeleccionadasIds.includes(cronica.EnfermedadID) ? 'bg-sky-50/50 border-sky-300 text-sky-700 font-black' : 'bg-slate-50 border-slate-100 text-slate-600'"
                  class="p-3.5 border rounded-xl flex items-center gap-3.5 cursor-pointer transition-all text-xs font-bold"
                >
                  <input type="checkbox" :value="cronica.EnfermedadID" v-model="form.cronicasSeleccionadasIds" class="rounded border-slate-300 text-sky-500 focus:ring-sky-400 w-4 h-4" />
                  <span>{{ cronica.NombreEnfermedad }}</span>
                </label>
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Describa los Síntomas Actuales</label>
              <textarea v-model="form.sintomas" rows="3" placeholder="Ej: Enrojecimiento en zona del antebrazo..." class="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-bold outline-none resize-none focus:border-sky-400"></textarea>
            </div>
          </div>

          <div v-if="activeSubTab === 'alergias'" class="space-y-4 animate-fade-in text-left">
            <div class="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-3xs">
              <div class="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100 max-w-max">
                <button
                  type="button"
                  v-for="catTab in subTabsAlergias" :key="catTab.id"
                  @click="activeCategoriaAlergia = catTab.id"
                  :class="activeCategoriaAlergia === catTab.id ? 'bg-white text-sky-600 border-slate-200/60 shadow-3xs font-black' : 'text-slate-400 border-transparent font-bold hover:text-slate-600'"
                  class="px-3.5 py-1.5 border rounded-lg text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  {{ catTab.label }}
                </button>
              </div>

              <div class="relative mt-2">
                <input v-model="searchAlergiaQuery" type="text" placeholder="Buscar alergia en esta sección..." class="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 pl-10 outline-none focus:border-sky-400 focus:bg-white transition-all text-xs font-bold" />
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  <v-icon name="bi-search" scale="0.8" />
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1 border border-slate-50 p-2 rounded-2xl bg-slate-50/30">
                <div
                  v-for="alergia in filteredAlergiasCatalogo" :key="alergia.AlergiaID"
                  @click="toggleAlergia(alergia.NombreAlergia)"
                  :class="isAlergiaSelected(alergia.NombreAlergia) ? 'border-sky-400 bg-sky-50/50 font-black text-sky-700' : 'border-slate-100 bg-white'"
                  class="p-3.5 border rounded-xl cursor-pointer transition-all flex flex-col text-left shadow-3xs hover:border-slate-200"
                >
                  <span class="text-xs font-black text-slate-800">{{ alergia.NombreAlergia }}</span>
                  <span class="text-[9px] text-sky-600 font-bold uppercase tracking-wider mt-0.5">Clasificación: {{ alergia.Categoria }}</span>
                </div>
              </div>

              <div class="space-y-2 pt-2 border-t border-slate-100">
                <p class="text-xs font-black text-slate-800">¿Sufre de otra alergia no listada?</p>
                <div class="flex gap-2">
                  <input v-model="customAlergiaName" type="text" placeholder="Escriba el nombre del alérgeno..." class="flex-1 border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-sky-400" />
                  <button type="button" @click="addCustomAlergia" class="px-5 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-black uppercase transition-all">+ Añadir</button>
                </div>
              </div>
              <button type="button" @click="clearAllAlergias" class="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-wider transition-all text-center">
                No padezco de ninguna alergia
              </button>
              <div v-if="form.alergiasList.length > 0" class="flex flex-wrap gap-1.5 mt-1">
                <span v-for="(al, idx) in form.alergiasList" :key="idx" class="bg-rose-50 text-rose-700 px-3 py-1 rounded-lg text-xs font-bold border border-rose-100 flex items-center gap-1.5">
                  {{ al.nombre }} <button type="button" @click="removeAlergia(idx)" class="text-rose-600 font-bold hover:text-rose-900">✕</button>
                </span>
              </div>
            </div>
          </div>

          <div v-if="activeSubTab === 'medicamentos'" class="space-y-4 animate-fade-in text-left">
            <div class="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-3xs">
              <div class="flex items-center gap-1.5 text-slate-800">
                <v-icon name="bi-search" class="h-4 w-4 text-sky-500" />
                <p class="text-xs font-black uppercase tracking-wider">Medicamentos que tomas actualmente</p>
              </div>
              <div class="relative">
                <input v-model="searchMedQuery" type="text" placeholder="Buscar medicamento..." class="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 pl-10 outline-none focus:border-sky-400 focus:bg-white transition-all text-xs font-bold" />
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1 border border-slate-50 p-2 rounded-2xl bg-slate-50/30">
                <div
                  v-for="med in filteredMedicamentosCatalogo" :key="med.MedicamentoID"
                  @click="toggleMedicamento(med.NombreComercial)"
                  :class="isMedSelected(med.NombreComercial) ? 'border-sky-400 bg-sky-50/50 font-black text-sky-700' : 'border-slate-100 bg-white'"
                  class="p-3.5 border rounded-xl cursor-pointer transition-all flex flex-col text-left shadow-3xs hover:border-slate-200"
                >
                  <span class="text-xs font-black text-slate-800">{{ med.NombreComercial }}</span>
                  <span class="text-[10px] text-slate-400 font-bold mt-0.5">Componente: {{ med.ComponenteActivo || 'N/A' }} ({{ med.Presentacion }})</span>
                </div>
              </div>
              <div class="space-y-2 pt-2 border-t border-slate-100">
                <p class="text-xs font-black text-slate-800">¿No encuentras tu medicamento?</p>
                <div class="flex gap-2">
                  <input v-model="customMedName" type="text" placeholder="Escribe el nombre del medicamento..." class="flex-1 border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-sky-400" />
                  <button type="button" @click="addCustomMedicamento" class="px-5 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-black uppercase transition-all">+ Agregar</button>
                </div>
              </div>
              <button type="button" @click="clearAllMedicamentos" class="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-wider transition-all text-center">
                No tomo ningún medicamento
              </button>
              <div v-if="form.medicamentosList.length > 0" class="flex flex-wrap gap-1.5 mt-1">
                <span v-for="(m, idx) in form.medicamentosList" :key="idx" class="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
                  {{ m.nombre }} <button type="button" @click="removeMedicamento(idx)" class="text-red-500 font-bold hover:text-red-700">✕</button>
                </span>
              </div>
            </div>
          </div>

          <div v-if="activeSubTab === 'seguro'" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left animate-fade-in">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Compañía Aseguradora</label>
              <input v-model="form.aseguradora" type="text" placeholder="Ej: Palic Seguro" class="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-bold outline-none focus:border-sky-400" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Número de Póliza / Cobertura</label>
              <input v-model="form.poliza" type="text" placeholder="Ej: POL-99482-A" class="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-bold outline-none focus:border-sky-400" />
            </div>
          </div>
        </div>

        <div v-if="currentStep === 4" class="space-y-6 animate-step-in">
          <div class="flex items-center gap-2.5 border-l-4 border-emerald-400 pl-4">
            <h4 class="text-sm font-black text-slate-700 uppercase tracking-widest">04. Método de Pago de Consulta</h4>
          </div>

          <div class="space-y-3">
            <label class="block text-xs font-black text-slate-400 uppercase tracking-wider">
              Seleccione Modalidad de Pago de la Consulta
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div
                @click="form.metodoPago = 'cash'; ubicacionPago = 'clinic'"
                :class="form.metodoPago === 'cash' ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-3xs font-black' : 'bg-slate-50 text-slate-500 border-slate-100/70'"
                class="p-4.5 rounded-2xl border text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-between select-none"
              >
                <div class="flex items-center gap-3">💵 Ventanilla / Efectivo</div>
                <div class="w-4 h-4 rounded-full border flex items-center justify-center bg-white" :class="form.metodoPago === 'cash' ? 'border-emerald-500' : 'border-slate-300'">
                  <div v-if="form.metodoPago === 'cash'" class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
              </div>

              <div
                @click="form.metodoPago = 'Tarjeta/Transferencia'; ubicacionPago = 'app'"
                :class="form.metodoPago === 'Tarjeta/Transferencia' ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-3xs font-black' : 'bg-slate-50 text-slate-500 border-slate-100/70'"
                class="p-4.5 rounded-2xl border text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-between select-none"
              >
                <div class="flex items-center gap-3">💳 Tarjeta / Transferencia Digital</div>
                <div class="w-4 h-4 rounded-full border flex items-center justify-center bg-white" :class="form.metodoPago === 'Tarjeta/Transferencia' ? 'border-blue-500' : 'border-slate-300'">
                  <div v-if="form.metodoPago === 'Tarjeta/Transferencia'" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="flex justify-between items-center pt-6 border-t border-slate-50 mt-auto select-none">
          <button type="button" :disabled="currentStep === 1" @click="currentStep--" :class="currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'" class="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer">Atrás</button>
          <button type="button" v-if="currentStep < 4" @click="handleNextStep" class="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-100 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.95] cursor-pointer">Siguiente</button>
          <button type="submit" v-else class="px-8 py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white shadow-md shadow-emerald-100 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.95] cursor-pointer">
            {{ form.metodoPago === 'Efectivo' ? 'Confirmar y Guardar Cita' : 'Proceder al Pago en Línea' }}
          </button>
        </div>

      </form>
    </div>

    <div v-if="mostrarPasarelaModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div class="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto text-left border border-slate-100 font-premium">

        <div class="border-b border-slate-200 pb-4">
          <h2 class="text-2xl font-black text-slate-800 tracking-tight">Pasarela de Cobro Digital</h2>
          <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Gestión de pago y finalización de reserva</p>
        </div>

        <div class="border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-3xs bg-gradient-tornasol relative overflow-hidden backdrop-blur-xs">
          <div class="space-y-0.5 relative z-10">
            <h3 class="text-base font-black text-[#005596] uppercase tracking-tight">
              {{ userData.nombre }}
            </h3>
            <p class="text-xs text-slate-600 font-black uppercase tracking-wider">
              Cita médica reservada • {{ fechaActual }}
            </p>
          </div>
          <div class="text-right relative z-10">
            <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Monto Total</span>
            <span class="text-2xl font-black text-blue-600 tracking-tight bg-white/60 px-3 py-0.5 rounded-xl border border-white/40 shadow-3xs">
              $ {{ billingDataLocal.basePrice.toFixed(2) }}
            </span>
          </div>
        </div>

        <div class="space-y-2.5">
          <h4 class="text-xs font-black text-slate-400 tracking-widest uppercase flex items-center gap-1.5">
            <span>$</span> Ubicación de Pago
          </h4>
          <p class="text-xs text-slate-400 font-medium -mt-1">Seleccione dónde se realizará el pago</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              @click="cambiarUbicacionPago('app')"
              :class="[
                'p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 relative group cursor-pointer w-full bg-white',
                ubicacionPago === 'app'
                  ? 'bg-blue-100 border-blue-400 text-blue-950 shadow-3xs scale-[1.01]'
                  : 'bg-blue-50/40 border-blue-100/40 text-blue-700/70 hover:bg-blue-50/70'
              ]"
            >
              <div class="p-3 rounded-full transition-colors duration-300" :class="ubicacionPago === 'app' ? 'bg-blue-200/70' : 'bg-blue-100/50'">
                <v-icon name="bi-credit-card-fill" scale="1.3" :class="ubicacionPago === 'app' ? 'text-blue-800' : 'text-blue-500'" />
              </div>
              <span class="text-sm font-black tracking-tight">Pago por App</span>
              <span class="text-xs font-bold" :class="ubicacionPago === 'app' ? 'text-blue-800/70' : 'text-blue-600/60'">Enlace o QR digital inmediato</span>

              <div v-if="ubicacionPago === 'app'" class="absolute bottom-3 text-blue-600 animate-scale-up">
                <v-icon name="bi-check-circle-fill" scale="0.95" />
              </div>
            </button>

            <button
              type="button"
              @click="cambiarUbicacionPago('clinic')"
              :class="[
                'p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 relative group cursor-pointer w-full bg-white',
                ubicacionPago === 'clinic'
                  ? 'bg-purple-100 border-purple-400 text-purple-950 shadow-3xs scale-[1.01]'
                  : 'bg-purple-50/40 border-purple-100/40 text-purple-700/70 hover:bg-purple-50/70'
              ]"
            >
              <div class="p-3 rounded-full transition-colors duration-300" :class="ubicacionPago === 'clinic' ? 'bg-purple-200/70' : 'bg-purple-100/50'">
                <v-icon name="bi-building" scale="1.3" :class="ubicacionPago === 'clinic' ? 'text-purple-800' : 'text-purple-500'" />
              </div>
              <span class="text-sm font-black tracking-tight">Pago en Clínica</span>
              <span class="text-xs font-bold" :class="ubicacionPago === 'clinic' ? 'text-purple-800/70' : 'text-purple-600/60'">Caja física en recepción</span>

              <div v-if="ubicacionPago === 'clinic'" class="absolute bottom-3 text-purple-600 animate-scale-up">
                <v-icon name="bi-check-circle-fill" scale="0.95" />
              </div>
            </button>
          </div>
        </div>

        <div v-if="ubicacionPago === 'clinic'" class="bg-amber-50 border border-amber-200/70 rounded-2xl p-5 space-y-2 text-left animate-fade-in">
          <div class="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-wider">
            <v-icon name="bi-exclamation-circle-fill" scale="0.95" /> Gestión Pendiente en Recepción
          </div>
          <p class="text-xs text-amber-700 font-medium leading-relaxed">
            El cobro se procesará manualmente en la recepción del centro médico. Se generará una orden interna vinculada a su número de cita.
          </p>
        </div>

        <div class="space-y-2.5">
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>📋</span> Método de Pago
          </h4>
          <p class="text-xs text-slate-400 font-medium -mt-1">Seleccione el canal físico o digital a procesar</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              @click="metodoPago = 'card'"
              :class="[
                'p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 cursor-pointer text-left w-full bg-white',
                metodoPago === 'card' ? 'bg-blue-100 border-blue-400 text-blue-950 font-black shadow-3xs' : 'bg-blue-50/40 border-blue-100/40 text-blue-700/70 hover:bg-blue-50/60'
              ]"
            >
              <div class="w-2 h-2 rounded-full transition-colors" :class="metodoPago === 'card' ? 'bg-blue-700' : 'bg-blue-400'"></div>
              <v-icon name="bi-credit-card-fill" :class="metodoPago === 'card' ? 'text-blue-800' : 'text-slate-400'" />
              <div class="flex flex-col">
                <span class="text-xs font-black uppercase tracking-wide">Tarjeta</span>
                <span class="text-[10px] font-bold text-slate-400">POS o Link API</span>
              </div>
            </button>

            <button
              type="button"
              @click="metodoPago = 'transfer'"
              :class="[
                'p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 cursor-pointer text-left w-full bg-white',
                metodoPago === 'transfer' ? 'bg-sky-100 border-sky-400 text-sky-950 font-black shadow-3xs' : 'bg-sky-50/40 border-sky-100/40 text-sky-700/70 hover:bg-sky-50/60'
              ]"
            >
              <div class="w-2 h-2 rounded-full transition-colors" :class="metodoPago === 'transfer' ? 'bg-sky-700' : 'bg-sky-400'"></div>
              <v-icon name="bi-bank" :class="metodoPago === 'transfer' ? 'text-sky-800' : 'text-slate-400'" />
              <div class="flex flex-col">
                <span class="text-xs font-black uppercase tracking-wide">Transferencia</span>
                <span class="text-[10px] font-bold text-slate-400">Banca en Línea HN</span>
              </div>
            </button>
          </div>
        </div>

        <div v-if="metodoPago !== ''" class="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4 animate-fade-in">
          <div v-if="metodoPago === 'card' && ubicacionPago === 'app'" class="space-y-4 animate-fade-in">
            <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2.5">
              <v-icon name="bi-phone-vibrate" class="text-blue-600 animate-pulse" />
              <p class="text-xs font-bold text-blue-800">
                API de Cobro Cifrado: Generá el código QR dinámico de pago inmediato para esta consulta.
              </p>
            </div>
            <button type="button" @click="dispararCobroAPI" class="w-full py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition-all border-b-2 border-blue-800">
              Generar QR de Cobro
            </button>
          </div>

          <div v-else-if="metodoPago === 'card' && ubicacionPago === 'clinic'" class="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div class="space-y-1.5 sm:col-span-2">
              <div class="p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-center gap-2.5">
                <v-icon name="bi-building" class="text-purple-600" />
                <p class="text-xs font-bold text-purple-800">
                  Registro de Auditoría Interna: <span class="uppercase font-black text-purple-950">Datáfono / POS de Recepción</span>
                </p>
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Código de Autorización (Voucher Físico)</label>
              <input type="text" v-model="tarjetaAuthCode" placeholder="Ej. 842105" class="w-full px-4 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl focus:border-purple-500" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Adquirente de Terminal (Honduras)</label>
              <select v-model="tarjetaBancoPOS" class="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:border-purple-500">
                <option value="BAC">BAC Credomatic</option>
                <option value="BANPAIS">Banpaís Conecta</option>
                <option value="ATLANTIDA">Banco Atlántida</option>
                <option value="FICOHSA">Ficohsa Express</option>
              </select>
            </div>
          </div>

          <div v-else-if="metodoPago === 'transfer'" class="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div class="space-y-1.5 sm:col-span-2">
              <div class="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-center gap-2.5">
                <v-icon name="bi-bank" class="text-sky-600" />
                <p class="text-xs font-bold text-sky-800">
                  Registro de Depósito Directo: <span class="uppercase font-black text-sky-950">Verificación de Banca Electrónica</span>
                </p>
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Número de Referencia de Transferencia</label>
              <input type="text" v-model="transferenciaRef" placeholder="Ej. TXN-94820148" class="w-full px-4 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl focus:border-sky-500" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Banco Receptor (Cuenta de la Clínica)</label>
              <select v-model="transferenciaBanco" class="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:border-sky-500">
                <option value="BAC">BAC Credomatic</option>
                <option value="ATLANTIDA">Banco Atlántida</option>
                <option value="FICOHSA">Banco Ficohsa</option>
                <option value="BANPAIS">Banpaís</option>
                <option value="OCCIDENTE">Banco de Occidente</option>
              </select>
            </div>
          </div>
        </div>

        <div id="comprobante-visual" class="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
          <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider border-b pb-2 border-slate-100">
            Resumen de Transacción
          </h4>
          <div class="space-y-3 text-xs font-medium text-slate-600">
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Paciente:</span>
              <span class="font-black text-slate-800 uppercase">{{ userData.nombre }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Fecha Cita:</span>
              <span class="font-bold text-slate-700">{{ form.fecha }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Ubicación de Pago:</span>
              <span class="font-black text-slate-700 uppercase">{{ ubicacionPago === 'app' ? 'Por App' : 'En Clínica' }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Método Seleccionado:</span>
              <span class="font-black text-slate-700 uppercase">
                {{ metodoPago === 'card' ? 'Tarjeta' : metodoPago === 'transfer' ? 'Transferencia Bancaria' : 'Ninguno' }}
              </span>
            </div>
            <div class="flex justify-between items-center pt-2 font-black text-sm">
              <span class="text-slate-800 uppercase tracking-wide">Total:</span>
              <span class="text-xl font-black text-blue-600 bg-blue-50/50 px-3 py-1 rounded-lg border border-blue-100 shadow-3xs">
                $ {{ billingDataLocal.basePrice.toFixed(2) }} USD
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-slate-200">
          <div class="flex items-center gap-2.5">
            <button type="button" @click="descargarReportePdf" title="Descargar Reporte PDF" class="h-9 w-11 bg-blue-50 hover:bg-blue-100 text-[#005596] border border-blue-200 rounded-xl transition-all cursor-pointer flex items-center justify-center border-b-4 border-b-blue-300 active:translate-y-0.5 active:border-b-0">
              <v-icon name="bi-download" scale="0.9" />
            </button>
            <button type="button" @click="compartirReporteCanal" title="Compartir Comprobante por WhatsApp" class="h-9 w-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center justify-center border-b-4 border-b-emerald-300 active:translate-y-0.5 active:border-b-0">
              <v-icon name="bi-share-fill" scale="0.85" />
            </button>
          </div>

          <div class="flex items-center gap-2.5">
            <button type="button" @click="mostrarPasarelaModal = false; $emit('cancel')" class="h-9 px-4 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center border-b-4 border-b-slate-300 active:translate-y-0.5 active:border-b-0">
              Omitir Pago por Ahora
            </button>
            <button type="button" @click="finalizarCierreConsulta" class="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_4px_12px_rgba(16,185,129,0.25)] border-b-4 border-b-emerald-800 active:translate-y-0.5 active:border-b-0 flex items-center justify-center gap-1.5 cursor-pointer">
              <v-icon name="bi-check-circle-fill" scale="0.85" /> Registrar Transacción
            </button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="mostrarQrModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
      <div class="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-5 border border-slate-100 transform scale-100 transition-all">
        <div class="space-y-1">
          <h3 class="font-black text-lg text-slate-800 tracking-tight">Código QR de Cobro</h3>
          <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">MedGo+ Cobros Digitales</p>
        </div>

        <div class="flex justify-center p-3 bg-slate-50 border border-slate-100 rounded-2xl shadow-3xs">
          <img v-if="qrGenerado" :src="qrGenerado" alt="QR de Pago Clínico" class="w-60 h-60 object-contain" />
        </div>

        <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-left space-y-1">
          <span class="text-[10px] font-black text-blue-800 uppercase tracking-wider block">Resumen de Transacción</span>
          <div class="flex justify-between text-xs font-bold text-slate-600">
            <span>ID Cita:</span> <span class="font-black text-slate-800">#{{ billingDataLocal.citaId }}</span>
          </div>
          <div class="flex justify-between text-xs font-bold text-slate-600">
            <span>Total a Cobrar:</span> <span class="font-black text-blue-700">$ {{ billingDataLocal.basePrice.toFixed(2) }} USD</span>
          </div>
        </div>

        <button type="button" @click="mostrarQrModal = false" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-b-4 border-b-slate-950 active:translate-y-0.5 active:border-b-0">
          Cerrar Ventana
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import * as QRCode from 'qrcode';
import { useI18n } from 'vue-i18n';

import api from '@/shared/infrastructure/api';
import { AppointmentRepository } from '../../appointments/infrastructure/AppointmentRepo';
import { ApiPagoRepository } from '../../consultations/infrastructure/ApiPagoRepository';

import type { AppointmentRequest, EnfermedadCronica, MedicamentoBase, AlergiaBase, AppointmentResponse} from '../../appointments/domain/Appointment';
import type { Doctor } from '../../directory/domain/entities/Doctor';
import type { PatientExtendedProfile } from '../../patients/domain/entities/Patient';

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiBoxArrowRight, BiPeopleFill, BiCalendarEvent, BiFileEarmarkTextFill,
  BiFolderFill, BiSearch, BiCheck, BiHouseFill, BiChevronRight,
  BiCreditCard2FrontFill, BiCreditCardFill, BiBuilding, BiCheckCircleFill,
  BiCashCoin, BiExclamationCircleFill, BiDownload, BiShareFill, BiPersonCheckFill, BiPhoneVibrate, BiBank
} from 'oh-vue-icons/icons';

addIcons(
  BiBoxArrowRight, BiPeopleFill, BiCalendarEvent, BiFileEarmarkTextFill,
  BiFolderFill, BiSearch, BiCheck, BiHouseFill, BiChevronRight,
  BiCreditCard2FrontFill, BiCreditCardFill, BiBuilding, BiCheckCircleFill,
  BiCashCoin, BiExclamationCircleFill, BiDownload, BiShareFill, BiPersonCheckFill, BiPhoneVibrate, BiBank
);

interface PdfMakeCustomInstance {
  getBlob(callback: (blob: Blob) => void): void;
  download(defaultFileName?: string): void;
}


const { t, locale } = useI18n();
type DoctorExtended = Doctor & { CostoConsulta?: number; Precio?: number };

const vfsFonts = pdfFonts as unknown as { pdfMake?: { vfs: Record<string, string> }; vfs: Record<string, string> };
const pdfMakeContext = pdfMake as unknown as { vfs: Record<string, string> };
pdfMakeContext.vfs = vfsFonts.pdfMake ? vfsFonts.pdfMake.vfs : vfsFonts.vfs;

const props = defineProps<{
  selectedDoctor: Doctor | null;
  patientProfile?: PatientExtendedProfile;
  idioma?: string;
}>();


const emit = defineEmits(['cancel']);
const appointmentRepo = new AppointmentRepository();
const pgoRepository = new ApiPagoRepository();
const toast = useToast();

const userData = ref({ id: 0, nombre: '', email: '' });
const currentStep = ref(1);

const mostrarPasarelaModal = ref(false);
const qrGenerado = ref('');
const mostrarQrModal = ref(false);

const billingDataLocal = ref({
  consultationId: '',
  citaId: 0,
  servicioId: 1,
  basePrice: 0.00
});

const ubicacionPago = ref<'app' | 'clinic'>('app');
const metodoPago = ref<'card' | 'transfer' | ''>('card');
const tarjetaAuthCode = ref('');
const tarjetaBancoPOS = ref('BAC');
const transferenciaRef = ref('');
const transferenciaBanco = ref('BAC');

const totalSteps = computed(() => [
  { id: 1, shortTitle: t('schedule.step1') },
  { id: 2, shortTitle: t('schedule.step2') },
  { id: 3, shortTitle: t('schedule.step3') },
  { id: 4, shortTitle: t('schedule.step4') }
]);

const activeSubTab = ref('sintomas');
const subTabs = [
  { id: 'sintomas', label: 'Síntomas' },
  { id: 'alergias', label: 'Alergias' },
  { id: 'medicamentos', label: 'Medicamentos' },
  { id: 'seguro', label: 'Seguro Médico' }
];

const activeCategoriaAlergia = ref('general');
const subTabsAlergias = [
  { id: 'general', label: 'Todas' },
  { id: 'medicamentosa', label: 'Medicamentos' },
  { id: 'alimentaria', label: 'Alimentos' },
  { id: 'ambiental', label: 'Ambientales' }
];

const listaCronicas = ref<EnfermedadCronica[]>([]);
const listaMedicamentosDB = ref<MedicamentoBase[]>([]);
const listaAlergiasDB = ref<AlergiaBase[]>([]);

const searchAlergiaQuery = ref('');
const customAlergiaName = ref('');
const searchMedQuery = ref('');
const customMedName = ref('');

const form = reactive({
  fecha: '', hora: '', motivo: '', sintomas: '', edad: '' as string | number,
  genero: '', alergias: '', aseguradora: '', poliza: '', contactoNombre: '',
  contactoTel: '', telefono: '', metodoPago: 'Efectivo',
  cronicasSeleccionadasIds: [] as number[],
  medicamentosList: [] as { nombre: string }[],
  alergiasList: [] as { nombre: string }[]
});

const fechaActual = computed(() => {
  const hoy = new Date();
  return `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
});

const filteredAlergiasCatalogo = computed(() => {
  return listaAlergiasDB.value.filter(a => {
    if (activeCategoriaAlergia.value !== 'general' && a.Categoria.toLowerCase() !== activeCategoriaAlergia.value) {
      return false;
    }
    return a.NombreAlergia.toLowerCase().includes(searchAlergiaQuery.value.toLowerCase()) ||
           a.Categoria.toLowerCase().includes(searchAlergiaQuery.value.toLowerCase());
  });
});

const filteredMedicamentosCatalogo = computed(() => {
  return listaMedicamentosDB.value.filter(m =>
    m.NombreComercial.toLowerCase().includes(searchMedQuery.value.toLowerCase()) ||
    (m.ComponenteActivo && m.ComponenteActivo.toLowerCase().includes(searchMedQuery.value.toLowerCase()))
  );
});

const fetchEnfermedadesCronicas = async () => {
  try {
    const response = await api.get('/enfermedades-cronicas');
    listaCronicas.value = response.data || [];
  } catch (error) {
    console.error("Error:", error);
  }
};

const fetchCatalogoMedicamentos = async () => {
  try {
    const response = await api.get('/catalogo-medicamentos');
    listaMedicamentosDB.value = response.data || [];
  } catch (error) {
    console.error("Error:", error);
  }
};

const fetchCatalogoAlergias = async () => {
  try {
    const response = await api.get('/catalogo-alergias');
    listaAlergiasDB.value = response.data || [];
  } catch (error) {
    console.error("Error:", error);
  }
};

const toggleAlergia = (nombre: string) => {
  const existIdx = form.alergiasList.findIndex(a => a.nombre === nombre);
  if (existIdx > -1) form.alergiasList.splice(existIdx, 1);
  else form.alergiasList.push({ nombre });
};
const isAlergiaSelected = (nombre: string) => form.alergiasList.some(a => a.nombre === nombre);
const addCustomAlergia = () => {
  if (!customAlergiaName.value.trim()) return;
  if (!isAlergiaSelected(customAlergiaName.value)) {
    form.alergiasList.push({ nombre: customAlergiaName.value.trim() });
  }
  customAlergiaName.value = '';
};
const removeAlergia = (idx: number) => form.alergiasList.splice(idx, 1);
const clearAllAlergias = () => { form.alergiasList = []; };

const cambiarUbicacionPago = (target: 'app' | 'clinic') => {
  ubicacionPago.value = target;
};

const dispararCobroAPI = async (): Promise<void> => {
  const payloadCripto = JSON.stringify({
    plataforma: 'MedGo+ Pasarela Paciente',
    cita_id: billingDataLocal.value.citaId,
    monto_total: billingDataLocal.value.basePrice,
    fecha_emision: fechaActual.value
  });

  try {
    qrGenerado.value = await QRCode.toDataURL(payloadCripto, {
      margin: 2,
      width: 300
    });
    mostrarQrModal.value = true;
    toast.success("¡QR de cobro generado!");
  } catch (err: unknown) {
    console.error(err);
    toast.error("Ocurrió un error en la renderización del código QR.");
  }
};

// HANDLESUBMIT CONDICIONAL INTERACTIVO ADAPTADO
const handleSubmit = async () => {
  if (!props.selectedDoctor) return;

  const medicamentosTexto = form.medicamentosList.map(m => m.nombre).join(', ');
  const alergiasTexto = form.alergiasList.map(a => a.nombre).join(', ');

  const payload: AppointmentRequest = {
    UsuarioID: userData.value.id,
    doctor_id: Number(props.selectedDoctor.DoctorID),
    entidad_id: props.selectedDoctor.EntidadID || 1,
    fecha_hora: `${form.fecha} ${form.hora}:00`,
    motivo: form.motivo,
    sintomas: form.sintomas,
    alergias: alergiasTexto || 'Ninguna',
    edad: Number(form.edad),
    genero: form.genero,
    aseguradora: form.aseguradora,
    numero_poliza: form.poliza,
    nombre_contacto_emergencia: form.contactoNombre,
    telefono_contacto_emergencia: form.contactoTel,
    medicamentos_actuales: medicamentosTexto || 'Ninguno',
    cronicas_ids: form.cronicasSeleccionadasIds
  };

  try {
    // 1. Almacenamos la cita en la base de datos por medio de la API
    await appointmentRepo.create(payload);

    const docExt = props.selectedDoctor as DoctorExtended;
    const precioConsulta = docExt.CostoConsulta || docExt.Precio || 90;

    if (form.metodoPago === 'Efectivo') {
      // Flujo de efectivo directo en ventanilla usando la interfaz PagoPayload estricta
      await pgoRepository.procesarPago({
        cita_id: 0,
        servicio_id: 1,
        monto: Number(precioConsulta),
        metodo: 'cash',
        referencia: 'Ventanilla física - Pago en Recepción'
      });
      toast.success("¡Cita médica agendada en ventanilla correctamente!");
      emit('cancel');
    } else {
      toast.info("Sincronizando última reserva con la base de datos...");

      const idDetectado = await obtenerUltimaCitaCreada(userData.value.id);


      billingDataLocal.value = {
        consultationId: String(idDetectado),
        citaId: idDetectado,
        servicioId: 1,
        basePrice: Number(precioConsulta)
      };

      if (idDetectado === 0) {
        toast.warning("La cita se guardó, pero hubo un retraso al mapear el número de orden.");
      }

      mostrarPasarelaModal.value = true;
      toast.success("¡Pasarela digital sincronizada con la base de datos!");
    }
  } catch {
    toast.error("Error en el flujo transaccional de la cita.");
  }
};

const finalizarCierreConsulta = async (event?: Event): Promise<void> => {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  let refFinal = "Pago por App Paciente";
  if (metodoPago.value === 'card' && ubicacionPago.value === 'clinic')
    refFinal = `POS ${tarjetaAuthCode.value ? tarjetaBancoPOS.value : 'General'} - Auth: ${tarjetaAuthCode.value || 'N/A'}`;
  if (metodoPago.value === 'transfer')
    refFinal = `Ref: ${transferenciaRef.value || 'N/A'} (${transferenciaBanco.value})`;

  await pgoRepository.procesarPago({
    cita_id: Number(billingDataLocal.value.citaId || 0),
    servicio_id: Number(billingDataLocal.value.servicioId) || 1,
    monto: Number(billingDataLocal.value.basePrice),
    metodo: metodoPago.value || 'card',
    referencia: refFinal
  });

  try {
    toast.success("¡Pago digital registrado con éxito. Cita confirmada!");
    mostrarPasarelaModal.value = false;
    emit('cancel');
  } catch (error: unknown) {
    console.error("[MedCore Contable] Fallo en la inserción del pago:", error);
    toast.error("Error al procesar el cierre contable en el servidor.");
  }
};

const obtenerUltimaCitaCreada = async (usuarioId: number): Promise<number> => {
  try {
    const responseHistorial = await api.get(`/citas/historial/${usuarioId}`);

    if (responseHistorial.data && Array.isArray(responseHistorial.data) && responseHistorial.data.length > 0) {
      const listaCitas = responseHistorial.data as AppointmentResponse[];

      const idMaximo = Math.max(...listaCitas.map(c => Number(c.CitaID || 0)));

      return idMaximo > 0 ? idMaximo : 0;
    }

    console.warn("[MedGo+ Servicio] El endpoint de historial regresó un arreglo vacío.");
    return 0;
  } catch (error) {
    console.error("[MedGo+ Servicio] Error crítico al consultar el historial en la base de datos:", error);
    return 0;
  }
};

const construirDocumentoDef = (): TDocumentDefinitions => {
  const metodoMapeado = metodoPago.value === 'card'
    ? `Tarjeta (POS: ${tarjetaBancoPOS.value})`
    : metodoPago.value === 'transfer'
      ? `Transferencia (${transferenciaBanco.value})`
      : 'Pendiente';

  const definicionRaw: unknown = {
    content: [
      { text: 'MedGo+', fontSize: 24, bold: true, color: '#005596', alignment: 'center' },
      { text: 'COMPROBANTE DE RESERVA DIGITAL', fontSize: 10, bold: true, color: '#94a3b8', alignment: 'center', margin: [0, 2, 0, 15] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, strokeColor: '#e2e8f0' }] },
      { text: 'DETALLE DE RESERVA', fontSize: 11, bold: true, color: '#1e293b', margin: [0, 15, 0, 10] },
      {
        table: {
          widths: [150, '*'],
          body: [
            [{ text: 'ID Cita:', bold: true, color: '#64748b' }, { text: `#${billingDataLocal.value.citaId}` }],
            [{ text: 'Paciente:', bold: true, color: '#64748b' }, { text: userData.value.nombre.toUpperCase(), bold: true }],
            [{ text: 'Fecha Cita:', bold: true, color: '#64748b' }, { text: form.fecha }],
            [{ text: 'Ubicación de Caja:', bold: true, color: '#64748b' }, { text: ubicacionPago.value === 'app' ? 'Pasarela Digital Paciente' : 'Validación en Recepción' }],
            [{ text: 'Método de Pago:', bold: true, color: '#64748b' }, { text: metodoMapeado }]
          ]
        },
        layout: 'noBorders'
      },
      { text: '', margin: [0, 15] },
      {
        table: {
          widths: ['*', 120],
          body: [
            [
              { text: 'TOTAL PROCESADO (USD):', bold: true, fontSize: 12, alignment: 'right', margin: [0, 5] },
              { text: `$ ${billingDataLocal.value.basePrice.toFixed(2)}`, bold: true, fontSize: 14, color: '#005596', alignment: 'center', backgroundColor: '#f0fdf4', margin: [0, 5] }
            ]
          ]
        },
        layout: { hLineColor: () => '#e2e8f0', vLineColor: () => '#e2e8f0' }
      }
    ],
    defaultStyle: { fontSize: 11, color: '#334155' }
  };

  return definicionRaw as TDocumentDefinitions;
};

const descargarReportePdf = (): void => {
  const pdfDoc = pdfMake.createPdf(construirDocumentoDef()) as unknown as PdfMakeCustomInstance;
  pdfDoc.download(`Comprobante_Reserva_MedGo+_#${billingDataLocal.value.citaId}.pdf`);
  toast.success("¡PDF descargado con éxito!");
};

const compartirReporteCanal = async (): Promise<void> => {
  toast.info("Abriendo canal de WhatsApp...");
  const textoMensaje = `
*MedGo+ - RESERVA DE CITA*
*Sistema de Gestión Médica Digital*
---------------------------------------
*ID Cita:* #${billingDataLocal.value.citaId}
*Paciente:* ${userData.value.nombre.toUpperCase()}
*Fecha Cita:* ${form.fecha}
*Método:* ${metodoPago.value === 'card' ? 'Tarjeta' : 'Transferencia'}
---------------------------------------
*TOTAL PROCESADO:* $ ${billingDataLocal.value.basePrice.toFixed(2)} USD
  `.trim();

  const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoMensaje)}`;

  try {
    await navigator.clipboard.writeText(textoMensaje);
    window.open(urlWhatsApp, '_blank');
    const pdfDocInstance = pdfMake.createPdf(construirDocumentoDef());
    pdfDocInstance.download(`Comprobante_Reserva_${billingDataLocal.value.citaId}.pdf`);
  } catch {
    window.open(urlWhatsApp, '_blank');
  }
};

const toggleMedicamento = (nombre: string) => {
  const existIdx = form.medicamentosList.findIndex(m => m.nombre === nombre);
  if (existIdx > -1) form.medicamentosList.splice(existIdx, 1);
  else form.medicamentosList.push({ nombre });
};
const isMedSelected = (nombre: string) => form.medicamentosList.some(m => m.nombre === nombre);
const addCustomMedicamento = () => {
  if (!customMedName.value.trim()) return;
  if (!isMedSelected(customMedName.value)) form.medicamentosList.push({ nombre: customMedName.value.trim() });
  customMedName.value = '';
};
const removeMedicamento = (idx: number) => form.medicamentosList.splice(idx, 1);
const clearAllMedicamentos = () => { form.medicamentosList = []; };

const handleNextStep = () => {
  if (currentStep.value === 1 && (!form.fecha || !form.hora || !form.motivo)) {
    toast.warning("Por favor complete los campos obligatorios."); return;
  }
  if (currentStep.value === 2 && (!form.telefono || !form.edad || !form.genero || !form.contactoNombre || !form.contactoTel)) {
    toast.warning("Por favor complete los datos de contacto."); return;
  }
  currentStep.value++;
};

const asignarCamposFormulario = (perfil: PatientExtendedProfile) => {
  userData.value = {
    id: perfil.id || Number(perfil.UsuarioID) || 0,
    nombre: perfil.nombre || perfil.Nombre || 'Paciente',
    email: perfil.email || ''
  };
  const p = perfil as PatientExtendedProfile & Record<string, unknown>;
  form.telefono = String(p.telefono || p.Telefono || '');
  form.genero = String(p.genero || p.Genero || '');
  form.aseguradora = String(p.aseguradora || p.Aseguradora || '');
  form.poliza = String(p.poliza || p.NumeroPoliza || '');
  form.contactoNombre = String(p.nombre_contacto_emergencia || p.NombreContactoEmergencia || '');
  form.contactoTel = String(p.telefono_contacto_emergencia || p.TelefonoContactoEmergencia || '');
  form.edad = String(p.fecha_nacimiento || p.Edad || '');
};

watch(() => props.patientProfile, (nuevoPerfil) => {
  if (nuevoPerfil) {
    const p = nuevoPerfil as PatientExtendedProfile & Record<string, unknown>;
    if (p.telefono || p.Telefono || p.id || p.UsuarioID) asignarCamposFormulario(nuevoPerfil);
  }
}, { deep: true, immediate: true });

onMounted(() => {
  fetchEnfermedadesCronicas();
  fetchCatalogoMedicamentos();
  fetchCatalogoAlergias();

  if (props.patientProfile && (props.patientProfile.Telefono || props.patientProfile.Edad || props.patientProfile.id)) {
    asignarCamposFormulario(props.patientProfile);
    return;
  }
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson);
      userData.value = { id: parsed.id ?? 0, nombre: parsed.nombre ?? 'Usuario', email: parsed.email ?? '' };
    } catch {
      console.warn("Error en sesión local.");
    }
  }
});
watch(() => props.idioma, (nuevoIdioma) => {
  if (nuevoIdioma) {
    locale.value = nuevoIdioma;
  }
}, { immediate: true });

</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-step-in { animation: stepIn 0.2s ease-out forwards; }
@keyframes stepIn { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
