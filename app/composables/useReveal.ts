export function useReveal(root: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | undefined;
  let media: MediaQueryList | undefined;
  let frame = 0;
  const seen = new WeakSet<Element>();
  const showAll = () =>
    root.value
      ?.querySelectorAll('.reveal-ready')
      .forEach((el) => el.classList.remove('reveal-ready'));
  const onFocus = (event: FocusEvent) =>
    (event.target as HTMLElement)?.closest('[data-reveal]')?.classList.remove('reveal-ready');
  const observe = () => {
    if (media?.matches || !observer) {
      showAll();
      return;
    }
    root.value?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, index) => {
      if (seen.has(el) || el.closest('details:not([open])')) return;
      seen.add(el);
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.setProperty('--reveal-delay', `${(index % 3) * 55}ms`);
      el.classList.add('reveal-ready');
      observer?.observe(el);
    });
  };
  const refresh = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(observe);
  };
  const onMotionChange = () => {
    if (media?.matches) showAll();
    else refresh();
  };
  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!('IntersectionObserver' in window)) return;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove('reveal-ready');
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.06, rootMargin: '0px 0px -20px 0px' },
      );
      observe();
      root.value?.addEventListener('focusin', onFocus);
      root.value?.addEventListener('toggle', refresh, true);
      media.addEventListener('change', onMotionChange);
    } catch {
      showAll();
    }
  });
  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
    media?.removeEventListener('change', onMotionChange);
    root.value?.removeEventListener('focusin', onFocus);
    root.value?.removeEventListener('toggle', refresh, true);
    showAll();
  });
}
