<template>
  <button
    class="icon-button theme-toggle"
    type="button"
    aria-label="Перемкнути світлу / темну тему"
    @click="toggle"
  >
    <span
      class="theme-sun"
      aria-hidden="true"
    >
      ☼
    </span>
    <span
      class="theme-moon"
      aria-hidden="true"
    >
      ☾
    </span>
  </button>
</template>

<script setup lang="ts">
const { toggle } = useTheme();
</script>

<style scoped lang="scss">
.theme-toggle {
  font-size: 1.5rem;
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    &:hover > span {
      transform: rotate(20deg);
    }
  }

  > span {
    transition: transform 0.3s;
  }
}

.theme-moon {
  display: none;
}
:global([data-theme='light'] .theme-sun) {
  display: none;
}
:global([data-theme='light'] .theme-moon) {
  display: inline;
}
</style>
