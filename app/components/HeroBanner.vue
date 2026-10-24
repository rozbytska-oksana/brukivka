<template>
  <section
    ref="root"
    class="hero-banner"
    aria-labelledby="hero-heading"
  >
    <HeroStoneGrid :running="running" />
    <div
      class="hero-shade"
      aria-hidden="true"
    />
    <div class="hero-inner wrap">
      <div class="hero-copy">
        <span class="experience-badge">
          <span
            class="status-dot"
            :class="{ 'is-running': running }"
            aria-hidden="true"
          />
          <span>
            Житомир · працюємо з
            <time :datetime="String(businessContacts.sinceYear)">
              {{ businessContacts.sinceYear }} року
            </time>
          </span>
        </span>
        <h1 id="hero-heading">
          <span>Гранітна</span>
          <span>бруківка.</span>
          <em>Природа у деталях.</em>
        </h1>
        <p>
          Від фактури доріжки до лінії сходів. Бруківка, плитка та вироби з природного каменю для
          простору з вашим характером.
        </p>
        <div class="hero-actions">
          <NuxtLink
            class="button primary"
            to="/#kataloh"
          >
            Обрати камінь
          </NuxtLink>
          <NuxtLink
            class="text-link"
            to="/#zvernennia"
          >
            <span class="text-link-label">Обговорити проєкт</span>
          </NuxtLink>
        </div>
        <div class="hero-notes">
          <span>Жива фактура</span>
          <span>Природні відтінки</span>
          <span>Різні види обробки</span>
        </div>
        <span
          v-if="demo"
          class="hero-demo"
        >
          Портфоліо-демо · без приймання заявок
        </span>
      </div>
      <div class="hero-bottom">
        <NuxtLink
          class="scroll-cue link-effect"
          to="/#kataloh"
        >
          <AppIcon
            class="scroll-cue-icon"
            name="arrow-down"
          />
          <span class="text-link-label">Відкрийте палітру можливостей</span>
        </NuxtLink>
        <button
          v-if="controlsAvailable"
          type="button"
          class="motion-toggle"
          :aria-label="paused ? 'Відновити анімації банера' : 'Призупинити анімації банера'"
          @click="paused = !paused"
        >
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              v-if="paused"
              d="m7 4 9 6-9 6z"
            />
            <path
              v-else
              d="M6 4v12M14 4v12"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { businessContacts } from '~/data/contacts';
const root = ref<HTMLElement | null>(null);
const { paused, running, controlsAvailable } = useBackgroundMotion(root);
const { demo } = useRuntimeConfig().public;
</script>

<style scoped lang="scss">
@use '../assets/styles/breakpoints' as bp;

.hero {
  &-banner {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
  }
  &-shade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(
        180deg,
        rgb(var(--bg-rgb) / 0.9),
        rgb(var(--bg-rgb) / 0.94) 42%,
        rgb(var(--bg-rgb) / 0.75) 68%,
        rgb(var(--bg-rgb) / 0.72)
      ),
      linear-gradient(90deg, rgb(var(--bg-rgb) / 0.6), transparent 90%);
    @include bp.medium {
      background:
        linear-gradient(
          90deg,
          rgb(var(--bg-rgb) / 0.98),
          rgb(var(--bg-rgb) / 0.96) 60%,
          rgb(var(--bg-rgb) / 0.4) 100%
        ),
        linear-gradient(0deg, var(--bg), transparent 40%);
    }
    @include bp.x-large {
      background:
        linear-gradient(
          90deg,
          rgb(var(--bg-rgb) / 0.99) 0%,
          rgb(var(--bg-rgb) / 0.98) 28%,
          rgb(var(--bg-rgb) / 0.96) 48%,
          rgb(var(--bg-rgb) / 0.35) 72%,
          rgb(var(--bg-rgb) / 0.12) 100%
        ),
        linear-gradient(
          180deg,
          rgb(var(--bg-rgb) / 0.42),
          transparent 24%,
          transparent 70%,
          var(--bg)
        );
    }
  }
  &-inner {
    position: relative;
    min-height: clamp(660px, calc(100svh - var(--header-height)), 760px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-block: 40px 24px;
    @include bp.medium {
      min-height: clamp(660px, calc(100svh - var(--header-height)), 820px);
      padding-block: 56px 28px;
    }
  }
  &-copy {
    max-width: 820px;
    > p {
      max-width: 440px;
      color: var(--text);
      font-size: var(--text-body);
      line-height: 1.75;
      @include bp.medium {
        max-width: 540px;
      }
    }
    @include bp.medium {
      max-width: 700px;
    }
    @include bp.x-large {
      max-width: 820px;
    }
  }
  &-actions {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 28px;
    @include bp.medium {
      gap: 26px;
      margin-top: 32px;
    }
  }
  &-notes {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    color: var(--text);
    font-size: var(--text-small);
    margin-top: 28px;
    span + span::before {
      content: '·';
      margin-right: 8px;
      color: var(--accent);
      @include bp.medium {
        margin-right: 16px;
      }
    }
    @include bp.medium {
      gap: 10px 16px;
    }
  }
  &-demo {
    display: block;
    font-size: var(--text-small);
    color: var(--muted);
    margin-top: 18px;
  }
  &-bottom {
    margin-top: 32px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 44px;
    @include bp.medium {
      margin-top: 40px;
      gap: 24px;
    }
  }
}
h1 {
  margin-block: 24px;
  font-size: clamp(2.7rem, 10.5vw, 4rem);
  line-height: 1.03;
  > * {
    display: block;
  }
  > span {
    animation: headline-in 0.65s both;
    &:nth-child(2) {
      animation-delay: 0.08s;
    }
  }
  > em {
    max-width: 340px;
    font-size: 0.82em;
    line-height: 1.15;
    animation: headline-in 0.65s 0.16s both;
    @include bp.medium {
      max-width: none;
    }
  }
  @include bp.medium {
    margin: 24px 0 26px;
    font-size: clamp(3.2rem, 6.4vw, 6.3rem);
  }
  @media (prefers-reduced-motion: reduce) {
    > * {
      animation: none;
    }
  }
}

.experience-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--surface);
  color: var(--text);
  font-size: var(--text-small);
  font-weight: 600;
  line-height: 1.5;
  time {
    white-space: nowrap;
  }
}
.status-dot {
  position: relative;
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: 1px solid var(--accent);
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
  }
  &.is-running::before,
  &.is-running::after {
    animation: status-ripple 2.8s cubic-bezier(0.2, 0.55, 0.45, 1) infinite;
  }
  &.is-running::after {
    animation-delay: -1.4s;
  }
  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      display: none;
    }
  }
}
.scroll-cue {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: var(--text-small);
  color: var(--text);
  transition: color 0.22s;
  > .scroll-cue-icon {
    color: var(--accent);
    transition: transform 0.2s;
    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
  &:focus-visible {
    color: var(--accent);
  }
  @media (hover: hover) {
    &:hover {
      color: var(--accent);
    }
  }
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    &:hover > .scroll-cue-icon {
      transform: translateY(4px);
    }
  }
}
.motion-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 30px;
  padding: 10px 14px;
  background: var(--surface);
  color: var(--text);
  font-size: var(--text-small);
  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }
  @media (hover: hover) {
    &:hover {
      border-color: var(--accent);
    }
  }
}
@keyframes status-ripple {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  12% {
    opacity: 0.55;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
@keyframes headline-in {
  from {
    opacity: 0.25;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
