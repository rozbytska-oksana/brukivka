<template>
  <section
    id="kontakty"
    class="section wrap"
    aria-labelledby="contacts-heading"
  >
    <div
      class="section-heading"
      data-reveal
    >
      <div>
        <span class="eyebrow">06 / Завжди є з чого почати</span>
        <h2 id="contacts-heading">
          Ваш простір
          <br />
          <em>Наша розмова</em>
        </h2>
      </div>
      <p class="section-description">
        Зателефонуйте, напишіть або знайдіть нас у Житомирі. Обговорімо матеріал, кількість та ваш
        задум.
      </p>
    </div>
    <div
      v-if="config.demo"
      class="notice"
    >
      Це окреме портфоліо-демо BRUKIVKA. Контакти наведено зі старого сайту; дзвінки та звернення у
      цій версії вимкнені.
    </div>
    <section
      class="contacts"
      aria-label="Контактні дані"
    >
      <div class="contact-card">
        <h3 class="eyebrow">Телефони</h3>
        <div
          v-for="phone in businessContacts.phones"
          :key="phone.number"
          class="phone-group"
        >
          <span
            v-if="config.demo"
            class="contact-value"
          >
            {{ phone.label }}
          </span>
          <a
            v-else
            :href="`tel:${phone.number}`"
            class="contact-value link-effect"
          >
            <span class="text-link-label">{{ phone.label }}</span>
          </a>
          <div
            v-if="!config.demo"
            class="messengers"
          >
            <a
              v-for="messenger in messengerLinks(phone.number)"
              :key="messenger.label"
              class="link-effect"
              :href="messenger.href"
              :target="messenger.label === 'Viber' ? undefined : '_blank'"
              rel="noopener noreferrer"
              :aria-label="`${messenger.label}: ${phone.label}`"
            >
              <span class="text-link-label">{{ messenger.label }}</span>
            </a>
          </div>
        </div>
      </div>
      <div class="contact-card other-contacts">
        <h3 class="eyebrow">Email</h3>
        <template
          v-for="email in businessContacts.emails"
          :key="email"
        >
          <span
            v-if="config.demo"
            class="contact-value"
          >
            {{ email }}
          </span>
          <a
            v-else
            :href="`mailto:${email}`"
            class="contact-value link-effect"
          >
            <span class="text-link-label">{{ email }}</span>
          </a>
        </template>
        <div class="address-group">
          <h3 class="eyebrow">Адреса</h3>
          <address>{{ businessContacts.address.label }}</address>
          <a
            v-if="!config.demo"
            class="text-link"
            :href="`https://www.google.com/maps/search/?api=1&query=${mapQuery}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="text-link-label">Прокласти маршрут</span>
          </a>
        </div>
      </div>
    </section>
    <section
      v-if="!config.demo"
      class="map-section"
      aria-label="Розташування BRUKIVKA"
    >
      <iframe
        v-if="mapVisible"
        :src="`https://www.google.com/maps?q=${mapQuery}&output=embed`"
        title="Карта: Житомир, вул. Покровська 239В"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      />
      <div
        v-else
        class="map-placeholder"
      >
        <p>{{ businessContacts.address.city }}, {{ businessContacts.address.street }}</p>
        <button
          class="button"
          @click="mapVisible = true"
        >
          Показати карту
        </button>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { businessContacts, messengerLinks } from '~/data/contacts';
import { businessSchema, serializeJsonLd } from '~/utils/seo';
const config = useRuntimeConfig().public;
const mapVisible = ref(false);
const mapQuery = encodeURIComponent(
  `${businessContacts.address.city}, ${businessContacts.address.street}`,
);
useHead(() => ({
  script: config.demo
    ? []
    : [
        {
          key: 'business-contacts',
          type: 'application/ld+json',
          innerHTML: serializeJsonLd(businessSchema(config.siteURL)),
        },
      ],
}));
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.contacts {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;

  @include bp.medium {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.contact {
  &-card {
    display: grid;
    align-content: start;
    gap: 20px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 24px;
    min-width: 0;

    @include bp.medium {
      padding: 30px;
    }
    .eyebrow {
      letter-spacing: 0.08em;
    }
  }
  &-value {
    font-size: clamp(1.125rem, 2.1vw, 1.7rem);
    overflow-wrap: anywhere;
    line-height: 1.4;
  }
}
.phone-group {
  display: grid;
  gap: 12px;
}
a.contact-value {
  width: fit-content;
  max-width: 100%;
}
.messengers {
  --link-idle-color: var(--text);
  display: flex;
  gap: 12px 20px;
  flex-wrap: wrap;
  font-size: var(--text-small);
  color: var(--accent);

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
}
.address-group {
  display: grid;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--line);

  address {
    font-style: normal;
    font-size: clamp(1rem, 2vw, 1.4rem);
  }
  .text-link {
    justify-self: start;
  }
}
.map {
  &-section {
    margin-top: 24px;

    iframe {
      display: block;
      width: 100%;
      height: 380px;
      border: 1px solid var(--line);
      border-radius: 18px;
    }
  }
  &-placeholder {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
    gap: 24px;
    padding: 30px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 18px;

    @include bp.medium {
      flex-direction: row;
      align-items: center;
    }
  }
}
</style>
