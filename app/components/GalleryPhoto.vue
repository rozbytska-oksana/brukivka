<template>
  <a
    :href="asset(item.large)"
    class="photo-card"
    :data-gallery-id="item.id"
    :aria-label="`Відкрити фото: ${item.caption}`"
    data-reveal
    @click="open"
  >
    <div class="photo">
      <ReferenceImage
        class="reference-image"
        :src="item.src"
        :srcset="srcset"
        :sizes="sizes"
        :width="item.width"
        :height="item.height"
        :alt="item.alt"
        loading="lazy"
        decoding="async"
      />
      <span
        class="expand"
        aria-hidden="true"
      >
        ↗
      </span>
    </div>
    <p>{{ item.caption }}</p>
  </a>
</template>

<script setup lang="ts">
import type { ImageAsset } from '~/types/catalog';
const props = withDefaults(defineProps<{ item: ImageAsset; sizes?: string }>(), {
  sizes: '(min-width: 1200px) 40vw, (min-width: 768px) 44vw, 90vw',
});
const emit = defineEmits<{ open: [] }>();
const asset = useAsset();
const srcset = computed(
  () => props.item.variants.map((v) => `${asset(v.src)} ${v.width}w`).join(', ') || undefined,
);
function open(event: MouseEvent) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
    return;
  event.preventDefault();
  emit('open');
}
</script>

<style scoped lang="scss">
.photo-card {
  min-width: 0;
  display: flex;
  flex-direction: column;

  p {
    font-size: var(--text-small);
    line-height: 1.6;
    overflow-wrap: anywhere;
    padding-top: 12px;
  }

  &:focus-visible .expand {
    background: var(--accent);
    color: var(--on-accent);
  }

  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    &:hover .reference-image {
      transform: scale(1.045);
    }
  }
}
.photo {
  aspect-ratio: var(--photo-ratio, 4 / 3);
  position: relative;
  background: var(--surface);
  border-radius: 16px;
  overflow: hidden;

  .reference-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    position: absolute;
    inset: 0;
    transition: transform 0.5s cubic-bezier(0.2, 0.65, 0.3, 1);
  }
}
.expand {
  position: absolute;
  right: 12px;
  bottom: 12px;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 50%;
  height: 34px;
  width: 34px;
  display: grid;
  place-items: center;
  transition:
    background 0.25s,
    color 0.25s;
}
</style>
