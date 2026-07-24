import type { DirectiveBinding } from 'vue';

export const vLocked = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { isLocked, message } = binding.value;

    if (isLocked) {
      el.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none', 'relative');

      const lockIcon = document.createElement('div');
      lockIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>`;
      lockIcon.className = 'absolute -top-2 -right-2 bg-slate-800 text-white p-1 rounded-full shadow-md flex items-center justify-center';

      const tooltip = document.createElement('div');
      tooltip.innerText = message || 'Función bloqueada en su plan actual';
      tooltip.className = 'absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 transition-opacity duration-300';

      el.style.pointerEvents = 'auto';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, true);

      el.addEventListener('mouseenter', () => tooltip.classList.replace('opacity-0', 'opacity-100'));
      el.addEventListener('mouseleave', () => tooltip.classList.replace('opacity-100', 'opacity-0'));

      el.appendChild(lockIcon);
      el.appendChild(tooltip);
    }
  }
};
