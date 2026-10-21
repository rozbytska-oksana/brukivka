<template>
  <header
    class="header"
    :class="{ scrolled }"
  >
    <div
      class="scroll-progress"
      :style="{ transform: `scaleX(${progress})` }"
      aria-hidden="true"
    />
    <div class="header-inner wrap">
      <NuxtLink
        to="/"
        class="brand"
        aria-label="BRUKIVKA — головна"
      >
        <BrandLogo />
      </NuxtLink>
      <nav
        class="desktop-nav"
        aria-label="Основна навігація"
      >
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          class="link-effect"
          :to="item.to"
          :aria-current="activeSection === item.to.slice(1) ? 'location' : undefined"
        >
          <span class="text-link-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>
      <div class="header-actions">
        <a
          v-if="!demo"
          class="header-phone link-effect"
          :href="`tel:${businessContacts.phones[0].number}`"
        >
          <span class="text-link-label">{{ businessContacts.phones[0].label }}</span>
        </a>
        <ThemeToggle />
        <button
          class="icon-button menu-trigger"
          aria-label="Відкрити меню"
          aria-controls="mobile-menu"
          :aria-expanded="opened"
          @click="open"
        >
          <span aria-hidden="true">☰</span>
        </button>
      </div>
    </div>
  </header>
  <dialog
    id="mobile-menu"
    ref="dialog"
    class="menu-dialog"
    aria-labelledby="menu-title"
    @close="restore"
    @cancel.prevent="close"
    @click="
      (event) => {
        if (event.target === dialog) close();
      }
    "
  >
    <Transition name="menu">
      <div
        v-if="contentVisible"
        class="menu-content"
      >
        <div class="menu-top">
          <span
            id="menu-title"
            class="eyebrow"
          >
            Навігація
          </span>
          <button
            class="icon-button"
            aria-label="Закрити меню"
            autofocus
            @click="close"
          >
            ×
          </button>
        </div>
        <nav aria-label="Мобільна навігація">
          <NuxtLink
            v-for="(item, i) in nav"
            :key="item.to"
            class="link-effect"
            :to="item.to"
            :aria-current="activeSection === item.to.slice(1) ? 'location' : undefined"
            :style="{ '--i': i }"
            @click="close"
          >
            <span class="eyebrow">0{{ i + 1 }}</span>
            <span class="text-link-label">{{ item.label }}</span>
            <span aria-hidden="true">↗</span>
          </NuxtLink>
        </nav>
        <div
          v-if="!demo"
          class="menu-contacts"
        >
          <a
            v-for="phone in businessContacts.phones"
            :key="phone.number"
            class="link-effect"
            :href="`tel:${phone.number}`"
          >
            <span class="text-link-label">{{ phone.label }}</span>
          </a>
          <a
            v-for="email in businessContacts.emails"
            :key="email"
            class="link-effect"
            :href="`mailto:${email}`"
          >
            <span class="text-link-label">{{ email }}</span>
          </a>
          <address>{{ businessContacts.address.label }}</address>
        </div>
      </div>
    </Transition>
  </dialog>
  <!-- Browser parsing of noscript differs with scripting enabled; keep its HTML opaque to Vue. -->
  <!-- eslint-disable vue/no-v-html -- renderNoJsNavigation escapes project-owned data and the base URL. -->
  <noscript
    class="nojs-fallback"
    v-html="noJsNavigation"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script setup lang="ts">
import { sectionNavigation } from '~/data/navigation';
import { businessContacts } from '~/data/contacts';
import { renderNoJsNavigation } from '~/utils/noJsNavigation';
const { demo } = useRuntimeConfig().public;
const nav = sectionNavigation.map((section) => ({ to: `/#${section.id}`, label: section.label }));
const noJsNavigation = renderNoJsNavigation(useAsset()(''));
const dialog = ref<HTMLDialogElement | null>(null);
const { opened, contentVisible, open, close, restore } = useModal(dialog);
const progress = ref(0);
const scrolled = ref(false);
const route = useRoute();
const hydrated = ref(false);
// The URL fragment is absent from SSR requests, including prerendered pages.
const activeSection = computed(() => (hydrated.value && route.path === '/' ? route.hash : ''));
let frame = 0;
let resize: ResizeObserver | undefined;
const update = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const height = document.documentElement.scrollHeight - innerHeight;
    progress.value = height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0;
    scrolled.value = scrollY > 24;
  });
};
watch(
  () => route.fullPath,
  async () => {
    close();
    await nextTick();
    update();
  },
);
onMounted(() => {
  hydrated.value = true;
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  resize = new ResizeObserver(update);
  resize.observe(document.body);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener('scroll', update);
  window.removeEventListener('resize', update);
  resize?.disconnect();
});
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.header {
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  transition:
    background 0.25s,
    box-shadow 0.25s;
  &.scrolled {
    background: var(--surface);
    box-shadow: 0 8px 30px #0002;
  }
  &-inner,
  &-actions {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-inner {
    gap: 12px;
    @include bp.medium {
      gap: 16px;
    }
  }
  &-actions {
    gap: 8px;
    @include bp.medium {
      gap: 16px;
    }
  }
  &-phone {
    display: none;
    align-items: center;
    min-height: 44px;
    font-size: var(--text-small);
    white-space: nowrap;
    @include bp.x-large {
      display: inline-flex;
    }
  }
}
.brand {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  flex-shrink: 0;
}
.desktop-nav {
  display: none;
  align-items: center;
  gap: 24px;
  font-size: var(--text-small);
  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
  @include bp.x-large {
    display: flex;
  }
}
nav a[aria-current='location'] {
  color: var(--accent);
  --link-idle-color: var(--accent);
}
.scroll-progress {
  position: absolute;
  top: 0;
  height: 3px;
  background: var(--accent);
  width: 100%;
  transform-origin: left;
}
.menu {
  &-trigger {
    display: inline-grid;
    @include bp.x-large {
      display: none;
    }
  }
  &-contacts {
    display: grid;
    gap: 12px;
    font-size: var(--text-small);
    overflow-wrap: anywhere;
    a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
    }
    address {
      font-style: normal;
      color: var(--muted);
    }
  }
  &-dialog {
    position: fixed;
    inset: 0 0 0 auto;
    width: min(100%, 520px);
    height: 100dvh;
    max-height: 100dvh;
    max-width: 100%;
    padding: 18px;
    margin: 0;
    border: 0;
    color: var(--text);
    background: var(--surface);
    nav {
      display: grid;
      margin: 30px 0;
      a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 22px 0;
        font-size: clamp(1.25rem, 5vw, 2rem);
        animation: arrive 0.3s both;
        animation-delay: calc(var(--i) * 40ms);
      }
    }
  }
  &-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    transform: translateX(20px);
  }
}
.nojs-fallback {
  :deep(.nojs-nav) {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 20px;
  }
}
@keyframes arrive {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}
</style>
