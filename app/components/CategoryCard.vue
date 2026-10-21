<template>
  <NuxtLink
    :to="`/kataloh/${category.slug}/`"
    class="category-card"
    data-reveal
  >
    <div class="card-image">
      <ReferenceImage
        class="reference-image"
        :src="cover?.src ?? category.cover"
        :srcset="srcset"
        sizes="(min-width: 1200px) 424px, (min-width: 768px) calc((100vw - 80px) / 2), calc(100vw - 36px)"
        :alt="category.title"
        width="480"
        height="397"
        loading="lazy"
        decoding="async"
      />
      <span class="card-index">0{{ index + 1 }}</span>
      <span
        class="card-arrow"
        aria-hidden="true"
      >
        ↗
      </span>
    </div>
    <div class="card-text">
      <h3>{{ category.title }}</h3>
      <span>{{ category.count }} фото</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Category } from '~/types/catalog';
import { editedImages } from '~/data/edited-images';
const props = defineProps<{ category: Category; index: number }>();
const asset = useAsset();
const cover = computed(() => editedImages[props.category.cover]);
const srcset = computed(() =>
  cover.value?.variants.map((variant) => `${asset(variant.src)} ${variant.width}w`).join(', '),
);
</script>

<style scoped lang="scss">
.category-card {
  display: block;
  min-width: 0;

  &:focus-visible .card-arrow {
    background: var(--accent);
    color: var(--on-accent);
  }

  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    &:hover .reference-image {
      transform: scale(1.045);
    }
  }
}
.card {
  &-image {
    position: relative;
    border-radius: 18px;
    background: var(--surface);
    overflow: hidden;
    aspect-ratio: 4 / 3;

    .reference-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.5s cubic-bezier(0.2, 0.65, 0.3, 1);
    }
  }
  &-index {
    position: absolute;
    top: 16px;
    left: 18px;
    color: var(--text);
    background: var(--surface);
    border-radius: 6px;
    padding: 4px 8px;
    font-size: var(--text-small);
  }
  &-arrow {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--bg);
    color: var(--text);
    transition:
      background 0.25s,
      color 0.25s;
  }
  &-text {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 8px 16px;
    flex-wrap: wrap;
    padding: 20px 0 6px;

    h3 {
      font-size: 1.125rem;
      flex: 1 1 14rem;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    > span {
      color: var(--muted);
      font-size: var(--text-small);
      white-space: nowrap;
      padding-top: 3px;
      flex-shrink: 0;
    }
  }
}
</style>
