<template>
  <section
    class="contact-panel"
    data-reveal
  >
    <div class="contact-copy">
      <span class="eyebrow">05 / Ваш наступний крок</span>
      <h2>
        Почнімо
        <br />
        з
        <em>вашої ідеї.</em>
      </h2>
      <p class="muted">
        Оберіть приклад із каталогу та розкажіть про свій простір. Матеріал, формат і місце
        використання допоможуть обговорити деталі.
      </p>
      <div
        class="contact-materials"
        aria-hidden="true"
      >
        <ReferenceImage
          src="images/kamen1/1_2.jpg"
          alt=""
          loading="lazy"
        />
        <ReferenceImage
          src="images/kamen1/1_3.jpg"
          alt=""
          loading="lazy"
        />
        <ReferenceImage
          src="images/kamen1/1_7.jpg"
          alt=""
          loading="lazy"
        />
        <span>
          Кожен проєкт
          <br />
          починається з вибору.
        </span>
      </div>
      <NuxtLink
        to="/#kataloh"
        class="text-link"
      >
        <span class="text-link-label">Повернутися до каталогу ↗</span>
      </NuxtLink>
    </div>
    <div class="contact-intent">
      <p
        v-if="config.demo"
        class="demo-label"
      >
        Це портфоліо-демо. Введення даних і реальні звернення вимкнені.
      </p>
      <label>
        Ваш проєкт
        <textarea
          v-model="message"
          :disabled="config.demo"
          rows="3"
          maxlength="2000"
          placeholder="Виріб, обсяг, населений пункт…"
        />
      </label>
      <label>
        Спосіб звернення
        <select
          v-model="channel"
          :disabled="config.demo"
        >
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </label>
      <button
        v-if="config.demo"
        class="button primary"
        disabled
      >
        Звернення вимкнені в демо
      </button>
      <a
        v-else
        :href="intent"
        class="button primary"
        :target="channel === 'whatsapp' ? '_blank' : undefined"
        rel="noopener"
      >
        {{ channel === 'whatsapp' ? 'Відкрити WhatsApp' : 'Відкрити поштовий застосунок' }} ↗
      </a>
      <p class="small muted">
        Текст відкриється у вибраному застосунку. Надсилання ви підтверджуєте там самостійно.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { businessContacts } from '~/data/contacts';
const config = useRuntimeConfig().public;
const message = ref('');
const channel = ref('email');
const intent = computed(() => {
  if (config.demo) return undefined;
  const text = `Вітаю! Мене цікавлять гранітні вироби. ${message.value}`;
  return channel.value === 'whatsapp'
    ? `https://wa.me/${businessContacts.phones[0].number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
    : `mailto:${businessContacts.emails[0]}?subject=${encodeURIComponent('Запит щодо гранітних виробів')}&body=${encodeURIComponent(text)}`;
});
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.contact {
  &-panel {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 24px;
    padding: clamp(24px, 5vw, 64px);
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;

    @include bp.medium {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 50px;
    }
  }

  &-copy {
    display: flex;
    flex-direction: column;
    align-items: start;
    min-width: 0;

    h2 {
      margin: 24px 0;
    }
    > p {
      font-size: var(--text-body);
      max-width: 370px;
    }
  }

  &-materials {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-block: 28px 24px;
    flex-wrap: wrap;

    :deep(img) {
      width: 58px;
      height: 58px;
      object-fit: cover;
      border-radius: 8px;
    }
    span {
      font-size: var(--text-small);
      padding-left: 8px;
      color: var(--muted);
    }
  }

  &-intent {
    display: grid;
    gap: 16px;
    min-width: 0;
  }
}

label {
  display: grid;
  gap: 8px;
  font-size: var(--text-small);
}
textarea,
select {
  padding: 14px;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
  border-radius: 8px;
  resize: vertical;
  font: inherit;
  font-size: var(--text-body);
  min-height: 52px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus-visible {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--interaction-glow);
  }
  @media (hover: hover) {
    &:enabled:hover {
      border-color: var(--accent);
    }
  }
}
.demo-label {
  color: var(--accent);
  font-size: var(--text-small);
}
</style>
