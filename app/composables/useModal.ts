// Native modal dialogs make the background inert and contain keyboard focus.
export function useModal(dialog: Ref<HTMLDialogElement | null>) {
  const opened = ref(false);
  const contentVisible = ref(false);
  let trigger: HTMLElement | null = null;
  let previousOverflow = '';
  let timer: ReturnType<typeof setTimeout> | undefined;
  async function open() {
    if (opened.value || !dialog.value) return;
    trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousOverflow = document.body.style.overflow;
    opened.value = true;
    contentVisible.value = true;
    await nextTick();
    if (!opened.value || !contentVisible.value) return;
    dialog.value?.showModal();
    document.body.style.overflow = 'hidden';
  }
  function restore() {
    clearTimeout(timer);
    contentVisible.value = false;
    if (!opened.value) return;
    document.body.style.overflow = previousOverflow;
    opened.value = false;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  }
  function finish() {
    dialog.value?.close();
    restore();
  }
  function close() {
    if (!opened.value) return;
    contentVisible.value = false;
    clearTimeout(timer);
    timer = setTimeout(
      finish,
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180,
    );
  }
  onBeforeUnmount(finish);
  return { opened, contentVisible, open, close, restore };
}
