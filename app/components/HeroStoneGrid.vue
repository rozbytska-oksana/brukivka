<template>
  <div
    class="stone-grid"
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
            <ReferenceImage
              :src="stone.src"
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
import stones from '~/data/galleries/stones';
import { heroStoneRows } from '~/data/hero-stone-rows';
defineProps<{ running: boolean }>();
// Eight original files are reused throughout the lattice; duplicate tiles share
// their URLs and browser cache. Never use the legacy 90px thumbnails in this hero.
const swatches = [
  stones[0]!,
  stones[1]!,
  stones[2]!,
  stones[3]!,
  stones[5]!,
  stones[6]!,
  stones[10]!,
  stones[14]!,
];
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
    display: flex;
    flex-direction: column;
    gap: var(--tile-gap);
    transform: translate(-50%, -50%) rotate(-12deg);
    transform-origin: center;
  }
  &-row {
    display: flex;
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
    aspect-ratio: 1.46;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 5px 18px #00000014;
    :deep(img) {
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
