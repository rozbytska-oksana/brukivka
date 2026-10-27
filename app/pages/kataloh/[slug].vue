<template>
  <main
    id="main"
    ref="root"
    class="wrap"
  >
    <SiteBreadcrumbs :items="[{ label: 'Каталог', to: '/#kataloh' }, { label: category.title }]" />
    <header class="page-intro">
      <span class="eyebrow">Каталог / {{ category.count }} фото</span>
      <h1>{{ category.title }}</h1>
      <p>{{ category.description }}</p>
    </header>
    <p class="notice">
      Наявність, остаточні розміри, обробку й вартість уточнюємо перед замовленням. Збережіть фото з
      галереї, яке вам подобається, — так буде простіше обговорити деталі.
    </p>
    <ImageGallery
      v-if="items"
      :items="items"
      :label="category.title"
    />
    <section
      class="category-guide"
      aria-labelledby="selection-heading"
    >
      <h2 id="selection-heading">{{ category.guide.title }}</h2>
      <p>{{ category.guide.text }}</p>
      <h3>Що підготувати для обговорення</h3>
      <ul>
        <li
          v-for="item in category.guide.checklist"
          :key="item"
        >
          {{ item }}
        </li>
      </ul>
      <p>
        Зверніться до BRUKIVKA у Житомирі за телефоном або через форму нижче. Ціну, доставку та
        роботи погодимо для вашого запиту.
      </p>
    </section>
    <div class="section"><ContactPanel /></div>
    <section class="section">
      <div class="section-heading">
        <h2>
          Інші
          <em>вироби</em>
        </h2>
        <NuxtLink
          class="text-link"
          to="/#kataloh"
        >
          <span class="text-link-label">Увесь каталог</span>
        </NuxtLink>
      </div>
      <div class="related">
        <NuxtLink
          v-for="other in categories.filter((c) => c.slug !== category.slug)"
          :key="other.slug"
          :to="`/kataloh/${other.slug}/`"
          class="button"
        >
          {{ other.title }}
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { categories } from '~/data/categories';
import { withEditedImage } from '~/data/edited-images';
import type { ImageAsset } from '~/types/catalog';
const route = useRoute();
const category = categories.find((c) => c.slug === route.params.slug);
if (!category) throw createError({ statusCode: 404, statusMessage: 'Категорію не знайдено' });
const loaders: Record<string, () => Promise<{ default: ImageAsset[] }>> = {
  'cat-1': () => import('~/data/galleries/cat-1'),
  'cat-2': () => import('~/data/galleries/cat-2'),
  'cat-3': () => import('~/data/galleries/cat-3'),
  'cat-4': () => import('~/data/galleries/cat-4'),
  'cat-5': () => import('~/data/galleries/cat-5'),
  'cat-6': () => import('~/data/galleries/cat-6'),
};
const { data: items } = await useAsyncData(`gallery-${category.group}`, async () =>
  (await loaders[category.group]!()).default.map(withEditedImage),
);
const root = ref<HTMLElement | null>(null);
useReveal(root);
usePageSeo(category.seoTitle, category.description, category.cover, category.title);
</script>

<style scoped lang="scss">
.category-guide {
  max-width: 900px;
  margin-top: 48px;

  h2 {
    font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  }

  h3 {
    margin-top: 24px;
    font-size: var(--text-body);
  }

  p,
  ul {
    margin-top: 16px;
    color: var(--muted);
  }

  ul {
    padding-inline-start: 1.25em;
  }

  li + li {
    margin-top: 8px;
  }
}

.related {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  .button {
    white-space: normal;
  }
}
</style>
