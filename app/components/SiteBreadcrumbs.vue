<template>
  <nav
    aria-label="Хлібні крихти"
    class="breadcrumbs"
  >
    <NuxtLink
      class="link-effect"
      to="/"
    >
      <span class="text-link-label">Головна</span>
    </NuxtLink>
    <template
      v-for="(item, i) in items"
      :key="i"
    >
      <span aria-hidden="true">/</span>
      <NuxtLink
        v-if="item.to"
        class="link-effect"
        :to="item.to"
      >
        <span class="text-link-label">{{ item.label }}</span>
      </NuxtLink>
      <span
        v-else
        aria-current="page"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { absoluteSiteUrl, canonicalPageUrl, serializeJsonLd } from '~/utils/seo';
const props = defineProps<{ items: { label: string; to?: string }[] }>();
const config = useRuntimeConfig().public;
const route = useRoute();
useHead(() => ({
  script: config.siteURL
    ? [
        {
          key: 'breadcrumbs-schema',
          type: 'application/ld+json',
          innerHTML: serializeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            '@id': `${canonicalPageUrl(config.siteURL, route.path)}#breadcrumbs`,
            itemListElement: [{ label: 'Головна', to: '/' }, ...props.items].map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: item.label,
              item: item.to
                ? absoluteSiteUrl(config.siteURL, item.to)
                : canonicalPageUrl(config.siteURL, route.path),
            })),
          }),
        },
      ]
    : [],
}));
</script>

<style scoped lang="scss">
.breadcrumbs {
  --link-idle-color: var(--muted);
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  overflow-wrap: anywhere;
  color: var(--muted);
  font-size: var(--text-small);
  padding-top: 30px;

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
}
</style>
