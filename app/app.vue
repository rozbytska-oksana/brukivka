<template>
  <NuxtRouteAnnouncer />
  <a
    class="skip-link"
    href="#main"
  >
    Перейти до вмісту
  </a>
  <AppHeader />
  <NuxtPage :page-key="(route) => route.path" />
  <AppFooter />
</template>
