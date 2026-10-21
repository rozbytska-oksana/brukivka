<template>
  <main
    id="main"
    ref="root"
  >
    <HeroBanner />

    <div class="material-index wrap">
      <NuxtLink to="/#kataloh">
        <strong>06</strong>
        <span>категорій виробів</span>
        <span aria-hidden="true">↗</span>
      </NuxtLink>
      <NuxtLink to="/#kamin">
        <strong>18</strong>
        <span>зразків каменю</span>
        <span aria-hidden="true">↗</span>
      </NuxtLink>
      <NuxtLink to="/#roboty">
        <strong>14</strong>
        <span>фото готових об’єктів</span>
        <span aria-hidden="true">↗</span>
      </NuxtLink>
    </div>

    <section
      id="kataloh"
      class="section wrap"
      aria-labelledby="catalog-heading"
    >
      <div
        class="section-heading"
        data-reveal
      >
        <div>
          <span class="eyebrow">01 / Каталог</span>
          <h2 id="catalog-heading">
            Від першої доріжки
            <br />
            до
            <em>останньої деталі.</em>
          </h2>
        </div>
        <p class="section-description">
          Шість напрямків роботи з каменем. Оберіть виріб — у кожній категорії є повна галерея
          фактур і форматів.
        </p>
      </div>
      <div class="category-grid">
        <CategoryCard
          v-for="(category, i) in categories"
          :key="category.slug"
          :category="category"
          :index="i"
        />
      </div>
    </section>

    <section
      id="pro-kamin"
      class="material-story"
      aria-labelledby="material-heading"
    >
      <div class="wrap story-layout">
        <div
          class="story-images"
          data-reveal="left"
        >
          <img
            class="story-main"
            :src="asset('images/edited/material-story-1200.jpg')"
            :srcset="`${asset('images/edited/material-story-600.jpg')} 600w, ${asset('images/edited/material-story-1200.jpg')} 1200w`"
            sizes="(min-width: 1200px) 560px, (min-width: 768px) 45vw, 90vw"
            width="1200"
            height="861"
            alt="Фактура пиляно-колотої гранітної бруківки"
            loading="lazy"
            decoding="async"
          />
          <div class="story-detail">
            <ReferenceImage
              :src="stones[2]!.src"
              :alt="stones[2]!.alt"
              loading="lazy"
            />
            <span class="eyebrow">Дідковичі / зразок каменю</span>
          </div>
        </div>
        <div
          class="story-copy"
          data-reveal="right"
        >
          <span class="eyebrow">Не буває двох однакових</span>
          <h2 id="material-heading">
            У каменю
            <br />
            є свій
            <em>почерк.</em>
          </h2>
          <p>
            Прожилки, зерно, природні переходи кольору. Обробка відкриває різні сторони одного
            матеріалу — від нерівних колотих граней до рівної пиляної поверхні.
          </p>
          <div class="surface-notes">
            <span>01 / Природний відтінок</span>
            <span>02 / Виразна поверхня</span>
            <span>03 / Ваше поєднання</span>
          </div>
          <NuxtLink
            class="text-link"
            to="/#kamin"
          >
            <span class="text-link-label">Знайти свій камінь ↗</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section
      id="kamin"
      class="section wrap"
      aria-labelledby="stone-heading"
    >
      <div
        class="section-heading"
        data-reveal
      >
        <div>
          <span class="eyebrow">02 / Палітра природи</span>
          <h2 id="stone-heading">
            Вісімнадцять відтінків.
            <br />
            <em>Без зайвих слів.</em>
          </h2>
        </div>
        <p class="section-description">
          Придивіться до зразків і відкрийте фото ближче. Природний малюнок та відтінок конкретного
          каменю погоджуються окремо.
        </p>
      </div>
      <ImageGallery
        :items="stones"
        :preview-count="6"
        layout="stones"
        label="Види каменю"
      />
    </section>

    <section
      id="roboty"
      class="section wrap"
      aria-labelledby="projects-heading"
    >
      <div
        class="section-heading"
        data-reveal
      >
        <div>
          <span class="eyebrow">03 / Камінь у просторі</span>
          <h2 id="projects-heading">
            Ідея набуває
            <br />
            <em>своєї форми.</em>
          </h2>
        </div>
        <p class="section-description">
          Поєднання матеріалів, лінії мощення та деталі оздоблення. Готові об’єкти з нашої галереї.
        </p>
      </div>
      <ImageGallery
        :items="projectHighlights"
        :preview-count="3"
        layout="projects"
        label="Готові об’єкти"
      />
    </section>

    <section
      id="posluhy"
      class="section wrap"
      aria-labelledby="services-heading"
    >
      <div
        class="section-heading"
        data-reveal
      >
        <div>
          <span class="eyebrow">04 / Від задуму до втілення</span>
          <h2 id="services-heading">
            Обрати. Доставити.
            <br />
            <em>Втілити.</em>
          </h2>
        </div>
        <p class="section-description">
          Розкажіть про місце й обсяг робіт. Маршрут, строки, вартість доставки та монтажу погодимо
          для вашого проєкту.
        </p>
      </div>
      <div class="service-grid">
        <article
          class="service-card"
          data-reveal="left"
        >
          <div class="service-photo">
            <img
              :src="asset('images/edited/service-delivery-1200.jpg')"
              :srcset="`${asset('images/edited/service-delivery-600.jpg')} 600w, ${asset('images/edited/service-delivery-1200.jpg')} 1200w`"
              sizes="(min-width: 1200px) 648px, (min-width: 768px) calc((100vw - 80px) / 2), calc(100vw - 36px)"
              width="1200"
              height="861"
              alt="Продукція на фото з галереї складу"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="service-body">
            <span class="service-number">01</span>
            <div>
              <h3>Доставка до вашого об’єкта</h3>
              <p>
                По Україні та за кордон. Для обговорення підготуйте населений пункт, назву виробу й
                орієнтовний обсяг.
              </p>
            </div>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M2 5h12v12H2zM14 9h4l4 5v3h-8M5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
              />
            </svg>
          </div>
        </article>
        <article
          class="service-card"
          data-reveal="right"
        >
          <div class="service-photo">
            <img
              :src="asset('images/edited/service-installation-1200.jpg')"
              :srcset="`${asset('images/edited/service-installation-600.jpg')} 600w, ${asset('images/edited/service-installation-1200.jpg')} 1200w`"
              sizes="(min-width: 1200px) 648px, (min-width: 768px) calc((100vw - 80px) / 2), calc(100vw - 36px)"
              width="1200"
              height="886"
              alt="Приклад гранітного оздоблення готового об’єкта"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="service-body">
            <span class="service-number">02</span>
            <div>
              <h3>Монтаж та укладання</h3>
              <p>
                Бруківка, плитка, сходи, бордюри. Обговорімо площу, особливості ділянки й бажане
                поєднання матеріалів.
              </p>
            </div>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7" />
            </svg>
          </div>
        </article>
      </div>
      <div class="order-steps">
        <div data-reveal>
          <span>01 / Вибір</span>
          <p>Знайдіть виріб і камінь у каталозі.</p>
        </div>
        <div data-reveal>
          <span>02 / Деталі</span>
          <p>Розкажіть про площу, формат та місце.</p>
        </div>
        <div data-reveal>
          <span>03 / Узгодження</span>
          <p>Обговоріть розрахунок, доставку й роботи.</p>
        </div>
      </div>
      <WarehouseGallery />
    </section>

    <div class="section wrap"><ContactPanel id="zvernennia" /></div>
    <LandingContacts />
  </main>
</template>

<script setup lang="ts">
import { categories } from '~/data/categories';
import stones from '~/data/galleries/stones';
import projects from '~/data/galleries/objects';
import { withEditedImage } from '~/data/edited-images';
const asset = useAsset();
const projectHighlights = [
  projects[11]!,
  projects[12]!,
  projects[4]!,
  ...projects.filter((_, index) => ![11, 12, 4].includes(index)),
].map(withEditedImage);
const root = ref<HTMLElement | null>(null);
useReveal(root);
usePageSeo(
  'Гранітна бруківка та плитка в Житомирі',
  'Гранітна бруківка, плитка, бордюри та фігурні вироби. 18 зразків каменю, галерея робіт, доставка й укладання. BRUKIVKA: Житомир, вул. Покровська 239В.',
  'images/obcekt/1_12.jpg',
  'Двокольорове мощення з гранітної бруківки — приклад із галереї BRUKIVKA',
);
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.material {
  &-index {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    border-block: 1px solid var(--line);
    a {
      min-width: 0;
      display: grid;
      grid-template-columns: 3ch minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      transition: background 0.25s;
      + a {
        border-top: 1px solid var(--line);
        @include bp.medium {
          border-top: 0;
          border-left: 1px solid var(--line);
        }
      }
      > span:first-of-type {
        font-size: var(--text-small);
        color: var(--muted);
        overflow-wrap: anywhere;
      }
      > span:last-child {
        margin-left: auto;
        color: var(--accent);
        transition: transform 0.25s;
      }
      &:focus-visible {
        background: var(--interaction-tint);
      }
      @media (hover: hover) {
        &:hover {
          background: var(--interaction-tint);
        }
      }
      @media (hover: hover) and (prefers-reduced-motion: no-preference) {
        &:hover > span:last-child {
          transform: translate(3px, -3px);
        }
      }
      @include bp.medium {
        grid-template-columns: auto minmax(0, 1fr) auto;
        padding: 20px;
        gap: 10px;
      }
      @include bp.x-large {
        padding: 22px 28px;
        gap: 16px;
        &:first-child {
          padding-left: 0;
        }
      }
    }
    strong {
      font-size: 1.8rem;
      font-weight: 450;
      letter-spacing: -0.05em;
    }
    @include bp.medium {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  &-story {
    background: var(--surface);
    border-block: 1px solid var(--line);
    padding-block: 60px;
  }
}
.story {
  &-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    gap: 32px;
    @include bp.medium {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: clamp(30px, 7vw, 96px);
    }
  }
  &-images {
    position: relative;
    width: 100%;
    max-width: 560px;
    padding: 0 56px 56px 0;
    @include bp.medium {
      max-width: none;
    }
  }
  &-main {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 16px;
  }
  &-detail {
    width: 54%;
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    background: var(--bg);
    overflow: hidden;
    :deep(img) {
      width: 100%;
      height: auto;
      aspect-ratio: 1.45;
      object-fit: cover;
    }
    .eyebrow {
      font-size: var(--text-small);
      letter-spacing: 0.02em;
      text-transform: none;
      padding: 10px 12px;
    }
  }
  &-copy {
    min-width: 0;
    h2 {
      margin-block: 22px;
    }
    > p {
      color: var(--muted);
      font-size: var(--text-body);
    }
  }
}
.surface-notes {
  display: grid;
  gap: 10px;
  margin-block: 24px;
  font-size: var(--text-small);
  > span {
    border-bottom: 1px solid var(--line);
    padding-bottom: 10px;
  }
}
.service {
  &-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    @include bp.medium {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  &-card {
    background: var(--surface);
    border-radius: 18px;
    overflow: hidden;
  }
  &-photo {
    aspect-ratio: 1.9;
    background: var(--surface);
    position: relative;
    :deep(img) {
      width: 100%;
      height: 100%;
      position: absolute;
      object-fit: cover;
      object-position: center;
    }
  }
  &-body {
    display: flex;
    gap: 18px;
    align-items: start;
    padding: 20px;
    h3 {
      font-size: 1.25rem;
      margin-bottom: 12px;
    }
    p {
      font-size: var(--text-body);
      color: var(--muted);
    }
    svg {
      display: none;
      min-width: 30px;
      width: 30px;
      fill: none;
      stroke: var(--accent);
      stroke-width: 1.2;
      @include bp.x-large {
        display: block;
      }
    }
    @include bp.x-large {
      padding: 26px;
    }
  }
  &-number {
    color: var(--accent);
    font-size: var(--text-small);
  }
}
.order-steps {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin-top: 30px;
  gap: 18px;
  > div {
    border-top: 1px solid var(--line);
    padding-top: 18px;
  }
  span {
    color: var(--accent);
    font-size: var(--text-small);
  }
  p {
    font-size: var(--text-body);
    margin-top: 10px;
    color: var(--muted);
  }
  @include bp.medium {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }
}
</style>
