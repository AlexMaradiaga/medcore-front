import { onMounted, onUnmounted } from 'vue';

export function usePolling(
  callback: () => Promise<void> | void,
  intervalMs: number = 5000
) {
  let timer: number | null = null;

  onMounted(() => {
    void callback(); // Ejecución inicial
    timer = window.setInterval(() => {
      void callback();
    }, intervalMs);
  });

  onUnmounted(() => {
    if (timer !== null) {
      clearInterval(timer);
    }
  });
}
