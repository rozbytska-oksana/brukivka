<template>
  <svg
    class="brand-logo"
    :class="{ 'brand-logo--large': large }"
    :viewBox="geometry.wordmark.viewBox"
    width="360"
    height="64"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <g class="brand-logo__mark">
      <polygon
        v-for="(points, index) in markPolygons"
        :key="index"
        :points="points"
      />
    </g>
    <g fill="currentColor">
      <path
        v-for="glyph in glyphs"
        :key="glyph.x"
        :d="glyph.path"
        :transform="`translate(${glyph.x} ${geometry.wordmark.baselineOffset})`"
        fill-rule="evenodd"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import geometry from '~/assets/brand/geometry.json';

defineProps<{ large?: boolean }>();

const markPolygons = [...geometry.mark.outline, ...geometry.mark.stones];
const glyphs = geometry.wordmark.glyphs.map((glyph) => ({
  x: glyph.x,
  path: glyph.contours.map((points) => `M${points.replaceAll(' ', 'L')}Z`).join(' '),
}));
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.brand-logo {
  display: block;
  flex-shrink: 0;
  width: 164px;
  max-width: 100%;
  height: auto;

  @include bp.medium {
    width: 200px;
  }

  @include bp.x-large {
    width: 216px;
  }

  &--large {
    width: 240px;

    @include bp.medium {
      width: 260px;
    }
  }

  &__mark {
    fill: var(--accent);

    @media (forced-colors: active) {
      fill: currentColor;
    }
  }
}
</style>
