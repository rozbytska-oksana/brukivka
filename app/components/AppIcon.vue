<template>
  <svg
    class="app-icon"
    :class="{ 'app-icon--arrow': name.startsWith('arrow-') }"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name]" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ name: keyof typeof paths }>();

const paths = {
  'arrow-up-right': 'M6 18 18 6M6 6h12v12',
  'arrow-down': 'M12 4v16m-7-7 7 7 7-7',
  'arrow-left': 'M20 12H4m7-7-7 7 7 7',
  'arrow-right': 'M4 12h16m-7-7 7 7-7 7',
  close: 'm6 6 12 12M6 18 18 6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  moon: 'M20.5 13a8.5 8.5 0 1 1-9.5-9.5A7 7 0 0 0 20.5 13Z',
  image:
    'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm-1 13 5-5 5 5 3-3 5 5M9 7h.01',
};
</script>

<style scoped lang="scss">
.app-icon {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  vertical-align: middle;

  &--arrow {
    width: 1rem;
    height: 1rem;
    stroke-width: 1.5;
  }
}
</style>
