interface ThemeTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}
type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ThemeTransition;
};

export function useTheme() {
  let busy = false;
  async function toggle(event: MouseEvent) {
    if (busy) return;
    const doc = document as TransitionDocument;
    const next = doc.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    const apply = () => {
      doc.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('brukivka-theme', next);
      } catch {
        /* Storage can be unavailable. */
      }
    };
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    busy = true;
    try {
      const transition = doc.startViewTransition(apply);
      await transition.ready;
      doc.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' },
      );
      await transition.finished;
    } catch {
      apply();
    } finally {
      busy = false;
    }
  }
  return { toggle };
}
