<template>
  <div
    class="gallery"
    :class="`gallery-${layout}`"
  >
    <div class="gallery-grid gallery-preview">
      <GalleryPhoto
        v-for="(item, i) in preview"
        :key="item.id"
        :item="item"
        :sizes="previewSizes"
        @open="show(i)"
      />
    </div>
    <details
      v-if="remaining.length"
      ref="more"
      class="gallery-more"
      :class="{ 'is-enhanced': enhanced }"
      :aria-label="label"
    >
      <summary
        class="gallery-toggle link-effect"
        @click="expand"
      >
        <span class="more-label text-link-label">Переглянути ще {{ remaining.length }} фото</span>
        <span class="less-label text-link-label">Згорнути добірку</span>
        <svg
          class="summary-icon"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </summary>
      <div class="gallery-grid gallery-rest">
        <GalleryPhoto
          v-for="(item, i) in remaining"
          :key="item.id"
          :item="item"
          :sizes="imageSizes"
          @open="show(i + preview.length)"
        />
      </div>
      <button
        v-if="enhanced"
        type="button"
        class="gallery-toggle gallery-collapse link-effect"
        @click="collapse"
      >
        <span class="text-link-label">Згорнути добірку</span>
        <svg
          class="summary-icon"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>
    </details>
  </div>
  <dialog
    ref="dialog"
    class="lightbox"
    :aria-label="label"
    @close="restore"
    @cancel.prevent="close"
    @keydown="keydown"
    @click="
      (event) => {
        if (event.target === dialog) close();
      }
    "
  >
    <Transition name="lightbox">
      <div
        v-if="contentVisible && current"
        class="lightbox-content"
      >
        <div class="lightbox-top">
          <span class="eyebrow">{{ label }} / {{ index + 1 }} з {{ items.length }}</span>
          <button
            class="icon-button"
            aria-label="Закрити галерею"
            autofocus
            @click="close"
          >
            ×
          </button>
        </div>
        <div
          ref="stage"
          class="stage"
          :aria-busy="loading"
          @touchstart.passive="
            (event) => {
              touchX = event.touches[0]?.clientX ?? 0;
              touchY = event.touches[0]?.clientY ?? 0;
            }
          "
          @touchend.passive="swipe"
        >
          <span
            v-if="loading"
            class="loading"
            role="status"
          >
            Завантаження фото…
          </span>
          <Transition
            name="photo"
            mode="out-in"
          >
            <ReferenceImage
              :key="current.id"
              class="reference-image"
              :src="current.large"
              :alt="current.alt"
              @load="loading = false"
              @error="
                loading = false;
                failed = true;
              "
            />
          </Transition>
          <p
            v-if="failed"
            class="load-error"
            role="status"
          >
            Не вдалося завантажити фото.
            <a
              class="link-effect"
              :href="asset(current.large)"
            >
              <span class="text-link-label">Відкрити фото ↗</span>
            </a>
          </p>
        </div>
        <div class="lightbox-bottom">
          <button
            class="icon-button"
            aria-label="Попереднє фото"
            @click="move(-1)"
          >
            ←
          </button>
          <p
            aria-live="polite"
            aria-atomic="true"
          >
            {{ current.caption }}
          </p>
          <button
            class="icon-button"
            aria-label="Наступне фото"
            @click="move(1)"
          >
            →
          </button>
        </div>
      </div>
    </Transition>
  </dialog>
</template>

<script setup lang="ts">
import type { ImageAsset } from '~/types/catalog';
const props = withDefaults(
  defineProps<{
    items: ImageAsset[];
    label: string;
    previewCount?: number;
    layout?: 'default' | 'stones' | 'projects' | 'warehouse';
  }>(),
  { layout: 'default', previewCount: 0 },
);
const preview = computed(() =>
  props.previewCount ? props.items.slice(0, props.previewCount) : props.items,
);
const remaining = computed(() => (props.previewCount ? props.items.slice(props.previewCount) : []));
const imageSizes = computed(() =>
  props.layout === 'projects' || props.layout === 'warehouse'
    ? '(min-width: 1200px) 424px, (min-width: 768px) calc((100vw - 80px) / 2), calc(100vw - 36px)'
    : undefined,
);
const previewSizes = computed(() =>
  props.layout === 'projects'
    ? '(min-width: 1200px) 648px, (min-width: 768px) calc((100vw - 80px) / 2), calc(100vw - 36px)'
    : imageSizes.value,
);
const { details: more, enhanced, expand, collapse } = useGalleryDisclosure();
const asset = useAsset();
const dialog = ref<HTMLDialogElement | null>(null);
const { contentVisible, open, close, restore } = useModal(dialog);
const index = ref(0);
const current = computed(() => props.items[index.value]);
const loading = ref(false);
const failed = ref(false);
const stage = ref<HTMLElement | null>(null);
const touchX = ref(0);
const touchY = ref(0);
function show(i: number) {
  if (contentVisible.value && index.value === i) return;
  index.value = i;
  loading.value = true;
  failed.value = false;
  open();
}
function move(direction: number) {
  index.value = (index.value + direction + props.items.length) % props.items.length;
  loading.value = true;
  failed.value = false;
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    move(1);
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    move(-1);
  }
  if (event.key === 'Home') {
    event.preventDefault();
    show(0);
  }
  if (event.key === 'End') {
    event.preventDefault();
    show(props.items.length - 1);
  }
}
function swipe(event: TouchEvent) {
  const touch = event.changedTouches[0];
  if (!touch) return;
  const dx = touch.clientX - touchX.value;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(touch.clientY - touchY.value))
    move(dx < 0 ? 1 : -1);
}
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.gallery {
  --gallery-row-gap: 28px;
  @include bp.medium {
    --gallery-row-gap: 30px;
  }
  &-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--gallery-row-gap) 28px;
    @include bp.medium {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 24px;
    }
    @include bp.x-large {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  &-more {
    margin-top: 20px;
    .gallery-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: fit-content;
      max-width: 100%;
      min-height: 48px;
      margin-inline: auto;
      padding: 10px 4px;
      border: 0;
      background: transparent;
      color: var(--text);
      font-size: var(--text-small);
      line-height: 1.5;
      text-align: center;
      cursor: pointer;
      list-style: none;
      transition: color 0.22s;
      &:focus-visible {
        color: var(--accent);
      }
      @media (hover: hover) {
        &:hover {
          color: var(--accent);
        }
      }
    }
    summary::-webkit-details-marker {
      display: none;
    }
    &[open] {
      margin-top: var(--gallery-row-gap);
      .more-label {
        display: none;
      }
      .less-label {
        display: inline;
      }
      .summary-icon {
        transform: rotate(180deg);
      }
    }
    &.is-enhanced[open] > summary {
      display: none;
    }
    &:not(.is-enhanced)[open] .gallery-rest {
      padding-top: var(--gallery-row-gap);
    }
  }
  &-collapse {
    margin-top: 20px;
  }
  &-stones {
    --photo-ratio: 1.45;
    --gallery-row-gap: 24px;
    .gallery-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 16px;
      @include bp.medium {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        column-gap: 18px;
      }
      @include bp.x-large {
        grid-template-columns: repeat(6, minmax(0, 1fr));
      }
    }
    :deep(.photo-card p) {
      font-size: var(--text-small);
      line-height: 1.6;
    }
  }
  &-projects {
    .gallery-preview {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
      > :first-child {
        grid-row: auto;
        --photo-ratio: 4 / 3;
        :deep(.photo) {
          aspect-ratio: 4 / 3;
          min-height: 0;
          @include bp.medium {
            flex: 1;
            aspect-ratio: auto;
            min-height: 260px;
          }
        }
        @include bp.medium {
          grid-row: span 2;
        }
      }
      > :not(:first-child) {
        --photo-ratio: 4 / 3;
        @include bp.medium {
          --photo-ratio: 1.8;
        }
      }
      @include bp.medium {
        grid-template-columns: 1.4fr 1fr;
      }
    }
  }
  &-warehouse {
    --photo-ratio: 1.45;
  }
}
.less-label {
  display: none;
}
.summary-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.25s;
}
.lightbox {
  padding: 0;
  width: min(1100px, 96vw);
  max-width: 96vw;
  max-height: 96dvh;
  border: 1px solid var(--line);
  border-radius: 20px;
  color: var(--text);
  background: var(--surface);
  &-content {
    padding: 12px;
    animation: open 0.25s ease-out;
    @include bp.medium {
      padding: 16px 24px;
    }
  }
  &-top,
  &-bottom {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }
  &-top .eyebrow {
    font-size: var(--text-small);
    text-transform: none;
    letter-spacing: 0.04em;
    @include bp.medium {
      letter-spacing: 0.02em;
    }
  }
  &-bottom p {
    min-width: 0;
    overflow-wrap: anywhere;
    text-align: center;
    font-size: var(--text-small);
    line-height: 1.6;
  }
  &-enter-active,
  &-leave-active {
    transition:
      opacity 0.18s,
      transform 0.18s;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(12px);
  }
}
.stage {
  position: relative;
  display: grid;
  place-items: center;
  height: min(64dvh, 700px);
  margin: 12px 0;
  background: var(--bg);
  border-radius: 10px;
  .reference-image {
    width: 100%;
    height: 100%;
    min-height: 0;
    object-fit: contain;
    position: absolute;
  }
}
.loading,
.load-error {
  position: absolute;
  z-index: 1;
  background: var(--bg);
  color: var(--text);
  padding: 12px;
  border-radius: 8px;
}
.photo {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.14s;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
@keyframes open {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
</style>
