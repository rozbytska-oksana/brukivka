<template>
  <img
    v-if="availableAssets.has(src) || editedImageDimensions[src]"
    :src="asset(src)"
    :alt="alt"
    v-bind="$attrs"
    :width="dimensions?.width"
    :height="dimensions?.height"
  />
  <div
    v-else
    v-bind="$attrs"
    class="missing-photo"
    role="img"
    :aria-label="`${alt}. Оригінальне фото поки недоступне.`"
  >
    <span aria-hidden="true">▧</span>
    <span>{{ alt }}</span>
    <small>Очікуємо оригінальне фото</small>
  </div>
</template>

<script setup lang="ts">
import { availableAssets, assetDimensions } from '~/data/available-assets';
import { editedImageDimensions } from '~/data/edited-images';
defineOptions({ inheritAttrs: false });
const props = defineProps<{ src: string; alt: string }>();
const dimensions = computed(() => editedImageDimensions[props.src] ?? assetDimensions[props.src]);
const asset = useAsset();
</script>

<style scoped lang="scss">
.missing-photo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 180px;
  background: var(--photo-bg);
  color: #54483d;
  padding: 24px;
  font-size: var(--text-small);

  > span:first-child {
    font-size: 2rem;
    opacity: 0.6;
  }
  small {
    font-size: var(--text-small);
  }
}
</style>
