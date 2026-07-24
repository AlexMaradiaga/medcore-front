<template>
  <div class="flex items-center justify-center">
    <!-- Canvas 3D de mayor tamaño (80x80px) solo con la esfera -->
    <canvas ref="canvasRef" width="80" height="80" class="w-20 h-20 shrink-0"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'working' | 'thinking' | 'searching' | 'solving';
}>(), {
  variant: 'working'
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number;

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 30; // 🟢 Radio incrementado para una esfera más grande

  const numPoints = props.variant === 'thinking' ? 220 : 120;
  const points: Point3D[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < numPoints; i++) {
    const y = 1 - (i / (numPoints - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points.push({
      x: x * radius,
      y: y * radius,
      z: z * radius,
      baseX: x * radius,
      baseY: y * radius,
      baseZ: z * radius,
      size: Math.random() * 1.2 + 0.8 // Puntos un poco más visibles
    });
  }

  let angleX = 0;
  let angleY = 0;

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    angleY += 0.025;
    angleX += 0.012;

    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);

    const projectedPoints = points.map(p => {
      // Rotación Y (Uso de const para corregir ESLint)
      let x1 = p.baseX * cosY - p.baseZ * sinY;
      const z1 = p.baseZ * cosY + p.baseX * sinY;

      // Rotación X (Uso de const para corregir ESLint)
      let y1 = p.baseY * cosX - z1 * sinX;
      const z2 = z1 * cosX + p.baseY * sinX;

      if (props.variant === 'working') {
        const noise = Math.sin(angleY * 2 + p.baseY) * 1.2;
        x1 += noise;
        y1 += noise;
      }

      const scale = (z2 + radius * 2) / (radius * 3);
      const alpha = Math.max(0.15, Math.min(1, (z2 + radius) / (radius * 2)));

      return {
        px: centerX + x1,
        py: centerY + y1,
        size: p.size * scale,
        alpha,
        z: z2
      };
    });

    projectedPoints.sort((a, b) => a.z - b.z);

    projectedPoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 85, 150, ${p.alpha})`; 
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(animate);
  };

  animate();
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>
