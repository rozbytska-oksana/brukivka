// Native details is the no-JS fallback; enhanced controls sit after the photos.
export function useGalleryDisclosure(trigger?: Ref<HTMLElement | null>) {
  const details = ref<HTMLDetailsElement | null>(null);
  const enhanced = ref(false);
  onMounted(() => {
    enhanced.value = true;
  });

  async function expand(event: MouseEvent) {
    if (!enhanced.value || !details.value) return;
    event.preventDefault();
    details.value.open = true;
    await nextTick();
    details.value?.querySelector<HTMLAnchorElement>('[data-gallery-id]')?.focus();
  }

  async function collapse() {
    if (!details.value) return;
    details.value.open = false;
    await nextTick();
    const returnTarget = trigger?.value ?? details.value?.querySelector('summary');
    returnTarget?.focus();
  }

  return { details, enhanced, expand, collapse };
}
