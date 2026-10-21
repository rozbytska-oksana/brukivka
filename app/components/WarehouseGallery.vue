<template>
  <section
    class="warehouse"
    :class="{ 'is-enhanced': enhanced }"
    aria-label="Склад і виробництво"
    data-reveal
  >
    <div class="warehouse-intro">
      <span
        class="warehouse-preview"
        aria-hidden="true"
      >
        <ReferenceImage
          :src="warehouse[0]!.src"
          :srcset="
            warehouse[0]!.variants
              .map((variant) => `${asset(variant.src)} ${variant.width}w`)
              .join(', ')
          "
          sizes="(min-width: 768px) 300px, calc(100vw - 76px)"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
      <span class="warehouse-copy">
        <span class="eyebrow">За лаштунками</span>
        <strong>Склад і виробництво</strong>
        <span class="warehouse-description">Фото виробництва, пакування та складу.</span>
        <button
          v-if="enhanced"
          v-show="!opened"
          ref="trigger"
          type="button"
          class="button primary warehouse-action"
          :aria-controls="galleryId"
          :aria-expanded="opened"
          @click="openGallery"
        >
          Переглянути {{ warehouse.length }} фото
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </button>
      </span>
    </div>
    <details
      :id="galleryId"
      ref="details"
      class="warehouse-disclosure"
      aria-label="Фотографії складу і виробництва"
      @toggle="opened = ($event.target as HTMLDetailsElement).open"
    >
      <summary class="warehouse-action warehouse-fallback">
        <span class="when-closed">Переглянути {{ warehouse.length }} фото</span>
        <span class="when-open">Згорнути фото</span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </summary>
      <div class="warehouse-content">
        <p class="notice">Актуальну наявність виробів уточнюйте перед замовленням.</p>
        <ImageGallery
          :items="warehouse"
          layout="warehouse"
          label="Склад і виробництво"
        />
        <button
          v-if="enhanced"
          type="button"
          class="text-link warehouse-collapse"
          @click="closeGallery"
        >
          <span class="text-link-label">Згорнути добірку ↑</span>
        </button>
      </div>
    </details>
  </section>
</template>

<script setup lang="ts">
import originalWarehouse from '~/data/galleries/cat-7';
import { withEditedImage } from '~/data/edited-images';
const warehouse = originalWarehouse.map(withEditedImage);
const asset = useAsset();
const trigger = ref<HTMLButtonElement | null>(null);
const opened = ref(false);
const galleryId = useId();
const { details, enhanced, expand, collapse } = useGalleryDisclosure(trigger);
async function openGallery(event: MouseEvent) {
  opened.value = true;
  await expand(event);
}
async function closeGallery() {
  opened.value = false;
  await collapse();
}
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.warehouse {
  margin-top: 48px;
  border-radius: 20px;
  background: var(--surface);

  &.is-enhanced .warehouse-fallback {
    display: none;
  }

  &-intro {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    gap: 20px;
    padding: 20px;

    @include bp.medium {
      grid-template-columns: minmax(180px, 300px) minmax(0, 1fr);
      gap: clamp(24px, 4vw, 48px);
      padding: 24px;
    }
  }
  &-preview {
    display: block;
    aspect-ratio: 2 / 1;
    overflow: hidden;
    border-radius: 12px;

    @include bp.medium {
      aspect-ratio: 3 / 2;
    }
    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-copy {
    display: grid;
    justify-items: start;
    gap: 10px;
    min-width: 0;

    strong {
      font-size: clamp(1.25rem, 2.3vw, 1.8rem);
      line-height: 1.35;
      overflow-wrap: anywhere;
    }
  }
  &-description {
    color: var(--muted);
    font-size: var(--text-body);
  }
  &-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 48px;
    max-width: 100%;
    margin-top: 6px;
    padding: 10px 18px;
    border-radius: 30px;
    background: var(--accent);
    color: var(--on-accent);
    font-size: var(--text-small);
    font-weight: 650;
    line-height: 1.5;

    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 0.25s;
    }
  }
  &-fallback {
    margin: 0 20px 24px;
    cursor: pointer;
    list-style: none;

    @include bp.medium {
      margin-inline: 24px;
    }
    &::-webkit-details-marker {
      display: none;
    }
  }
  &-disclosure[open] {
    .when-closed {
      display: none;
    }
    .when-open {
      display: inline;
    }
    .warehouse-action svg {
      transform: rotate(180deg);
    }
  }
  &-content {
    padding: 0 20px 20px;

    @include bp.medium {
      padding: 0 24px 24px;
    }
  }
  &-collapse {
    display: flex;
    width: fit-content;
    max-width: 100%;
    min-height: 48px;
    margin: 20px auto 0;
    padding: 10px 4px;
    border: 0;
    text-align: center;
  }
}
.when-open {
  display: none;
}
</style>
