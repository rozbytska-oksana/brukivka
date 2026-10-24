<template>
  <footer class="footer wrap">
    <div>
      <NuxtLink
        to="/"
        class="footer-brand"
        aria-label="BRUKIVKA — головна"
      >
        <BrandLogo large />
      </NuxtLink>
      <p class="muted">Природний камінь у вашому просторі.</p>
    </div>
    <nav aria-label="Навігація у футері">
      <NuxtLink
        class="link-effect"
        to="/#kataloh"
        aria-current="false"
      >
        <span class="text-link-label">Каталог</span>
      </NuxtLink>
      <NuxtLink
        class="link-effect"
        to="/#roboty"
        aria-current="false"
      >
        <span class="text-link-label">Роботи</span>
      </NuxtLink>
      <NuxtLink
        class="link-effect"
        to="/#kontakty"
        aria-current="false"
      >
        <span class="text-link-label">Контакти</span>
      </NuxtLink>
    </nav>
    <address class="footer-contacts">
      <div>
        <template
          v-for="phone in businessContacts.phones"
          :key="phone.number"
        >
          <span v-if="demo">{{ phone.label }}</span>
          <a
            v-else
            class="link-effect"
            :href="`tel:${phone.number}`"
          >
            <span class="text-link-label">{{ phone.label }}</span>
          </a>
        </template>
      </div>
      <div>
        <template
          v-for="email in businessContacts.emails"
          :key="email"
        >
          <span v-if="demo">{{ email }}</span>
          <a
            v-else
            class="link-effect"
            :href="`mailto:${email}`"
          >
            <span class="text-link-label">{{ email }}</span>
          </a>
        </template>
      </div>
      <span>{{ businessContacts.address.label }}</span>
    </address>
    <p
      v-if="demo"
      class="demo-note"
    >
      Портфоліо-демо · Реальні звернення вимкнені.
    </p>
    <!-- prettier-ignore -->
    <p
      v-if="demo"
      class="attribution"
    >
      Дизайн і фотографії — на основі
      <a
        class="link-effect"
        href="https://nexgen-fullstack.github.io/brukivka-site/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="text-link-label">наданого референсу</span>
      </a>. Розробка на Nuxt / Vue.
    </p>
    <p
      v-else
      class="copyright"
    >
      © BRUKIVKA.ORG · Житомир · працюємо з {{ businessContacts.sinceYear }} року
    </p>
  </footer>
</template>

<script setup lang="ts">
import { businessContacts } from '~/data/contacts';
const { demo } = useRuntimeConfig().public;
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  padding-block: 56px 30px;
  gap: 28px;
  border-top: 1px solid var(--line);

  @include bp.medium {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  &-brand {
    display: inline-flex;
    align-items: center;
    min-height: 48px;
    max-width: 100%;
  }
  &-contacts {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    overflow-wrap: anywhere;
    font-style: normal;
    font-size: var(--text-small);

    @include bp.medium {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    > div {
      min-width: 0;
      display: grid;
      gap: 8px;
    }
    > span {
      grid-column: 1 / -1;
      color: var(--muted);
    }
    a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
    }
  }
}
nav {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: start;

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
}
.attribution {
  --link-idle-color: var(--muted);
  grid-column: 1 / -1;
  color: var(--muted);
  font-size: var(--text-small);
}
.demo-note {
  font-size: var(--text-small);
  color: var(--accent);
}
.copyright {
  color: var(--muted);
  font-size: var(--text-small);
}
</style>
