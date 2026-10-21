// A user pause survives visibility changes. OS reduced motion always takes priority.
export function useBackgroundMotion(root: Ref<HTMLElement | null>) {
  const paused = ref(false);
  const ready = ref(false);
  const reduced = ref(true);
  const inView = ref(true);
  const tabVisible = ref(true);
  let observer: IntersectionObserver | undefined;
  let media: MediaQueryList | undefined;
  const updateMotion = () => {
    reduced.value = media?.matches ?? true;
  };
  const updateVisibility = () => {
    tabVisible.value = !document.hidden;
  };
  const running = computed(
    () => ready.value && !reduced.value && !paused.value && inView.value && tabVisible.value,
  );
  const controlsAvailable = computed(() => ready.value && !reduced.value);

  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)');
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    if ('IntersectionObserver' in window && root.value) {
      observer = new IntersectionObserver(
        (entries) => {
          inView.value = entries[0]?.isIntersecting ?? false;
        },
        { threshold: 0 },
      );
      observer.observe(root.value);
    }
    ready.value = true;
  });
  onBeforeUnmount(() => {
    observer?.disconnect();
    media?.removeEventListener('change', updateMotion);
    document.removeEventListener('visibilitychange', updateVisibility);
  });
  return { paused, running, controlsAvailable };
}
