<template>
  <DoctorLayout>
    <main class="p-8 max-w-350 mx-auto animate-fade-in">
      <PatientLabView />
    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import PatientLabView from '@/modules/laboratories/ui/PatientLabView.vue';
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
