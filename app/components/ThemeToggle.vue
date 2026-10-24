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
      <AppIcon name="sun" />
    </span>
    <span
      class="theme-moon"
      aria-hidden="true"
    >
      <AppIcon name="moon" />
    </span>
  </button>
</template>

<script setup lang="ts">
const { toggle } = useTheme();
</script>

<style scoped lang="scss">
.theme-toggle {
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    &:hover > span {
      transform: rotate(20deg);
    }
  }

  > span {
    transition: transform 0.3s;
  }
}

.theme-sun {
  display: inline-flex;
}

.theme-moon {
  display: none;
}
:global([data-theme='light'] .theme-sun) {
  display: none;
}
:global([data-theme='light'] .theme-moon) {
  display: inline-flex;
}
</style>
