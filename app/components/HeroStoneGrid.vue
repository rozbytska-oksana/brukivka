<template>
  <div
    class="stone-grid"
    :style="{ '--row-count': rows.length }"
    :data-running="running"
    aria-hidden="true"
  >
    <div class="stone-plane">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="stone-row"
        :style="{ '--row-duration': `${row.duration}s`, '--row-offset': `${row.offset}s` }"
      >
        <div
          v-for="copy in 2"
          :key="copy"
          class="stone-group"
        >
          <div
            v-for="(stone, column) in row.items"
            :key="`${stone.id}-${column}`"
            class="stone-tile"
          >
            <img
              :src="asset(stone.src)"
              :srcset="
                stone.variants
                  .map((variant) => `${asset(variant.src)} ${variant.width}w`)
                  .join(', ')
              "
              sizes="max(200px, 20vw)"
              :width="stone.width"
              :height="stone.height"
              alt=""
              loading="eager"
              decoding="async"
              :fetchpriority="rowIndex === 0 && column === 0 && copy === 1 ? 'high' : 'low'"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { heroImages } from '~/data/hero-images';
import { heroStoneRows } from '~/data/hero-stone-rows';
defineProps<{ running: boolean }>();
const asset = useAsset();
// Only decorative previews use these exports; galleries retain their originals.
// Duplicate tiles share URLs and the browser cache.
const swatches = heroImages;
const rows = heroStoneRows.map((row) => ({
  duration: row.duration,
  offset: row.offset,
  items: row.order.map((index) => swatches[index]!),
}));
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.stone {
  &-grid {
    --tile-width: max(200px, 20vw);
    --tile-height: calc(var(--tile-width) / 1.46);
    --tile-gap: 8px;
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    contain: paint;
    @include bp.medium {
      --tile-gap: 10px;
    }
    &[data-running='true'] .stone-row {
      animation-play-state: running;
      will-change: transform;
    }
    @media (prefers-reduced-motion: reduce) {
      .stone-row {
        animation: none !important;
        will-change: auto;
      }
    }
  }
  &-plane {
    position: absolute;
    left: 50%;
    top: 50%;
    width: calc(100% + 720px);
    // Reserve all rows before their HTML/images arrive: centering must not jump.
    height: calc(var(--row-count) * var(--tile-height) + (var(--row-count) - 1) * var(--tile-gap));
    display: flex;
    flex-direction: column;
    gap: var(--tile-gap);
    transform: translate(-50%, -50%) rotate(-12deg);
    transform-origin: center;
  }
  &-row {
    display: flex;
    flex: 0 0 var(--tile-height);
    height: var(--tile-height);
    width: max-content;
    animation: stone-drift var(--row-duration) linear infinite;
    animation-delay: var(--row-offset);
    animation-play-state: paused;
    &:nth-child(even) {
      animation-direction: reverse;
      @media (prefers-reduced-motion: reduce) {
        transform: translate3d(-15%, 0, 0);
      }
    }
  }
  &-group {
    display: flex;
    flex-shrink: 0;
    gap: var(--tile-gap);
    padding-right: var(--tile-gap);
  }
  &-tile {
    position: relative;
    flex: 0 0 var(--tile-width);
    width: var(--tile-width);
    height: 100%;
    aspect-ratio: 1.46;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 5px 18px #00000014;
    :deep(img) {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      user-select: none;
    }
    @include bp.medium {
      border-radius: 14px;
    }
  }
}
@keyframes stone-drift {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
