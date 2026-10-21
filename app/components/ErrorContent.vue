<template>
  <main
    id="main"
    class="error-page wrap"
  >
    <span class="eyebrow">BRUKIVKA / {{ status }}</span>
    <h1>{{ status === 404 ? 'Цей шлях ще не вимощено.' : 'Не вдалося відкрити сторінку.' }}</h1>
    <p class="muted">Поверніться на головну й оберіть потрібний розділ.</p>
    <a
      :href="home"
      class="button primary"
    >
      На головну ↗
    </a>
  </main>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ status?: number }>(), { status: 404 });
const home = useAsset()('');
</script>

<style scoped lang="scss">
.error-page {
  padding-block: 15vh;
  max-width: 900px;

  h1 {
    margin-block: 30px;
  }
  .button {
    margin-top: 30px;
  }
}
</style>
