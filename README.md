# BRUKIVKA

Комерційний український каталог гранітних виробів на **Nuxt 4 / Vue 3 / TypeScript**. SSR під час статичної генерації; готовий сайт — `.output/public`.

Головна-лендинг, шість сторінок категорій і 404. На головній — каталог, усі 18 зразків каменю, 14 записів робіт, послуги, склад, звернення та контакти. Меню веде до секцій; додаткові фото відкриваються на місці. Графітова та пісочна теми, модальна галерея, мобільне меню, scroll reveal. Публікацію не виконано.

## Локальний запуск

Ініціалізацію та встановлення залежностей виконує власниця проєкту. Scaffold уже є, повторна ініціалізація не потрібна.

```bash
nvm use
npm install
npm run dev
```

Node зафіксовано у `.nvmrc`: 24.22.0. Nuxt 4.6.2 вимагає `^22.22.3 || ^24.15.0 || >=26.0.0`; Node 20 із початкового середовища агента не підходить. npm використовує наявний `package-lock.json`.

## Перевірки

```bash
npm run typecheck
npm run lint
npm test
npm run generate
npm run verify:output
npm run verify:http
npm run preview:static
```

`typecheck` і `lint` запускають лише локальні утиліти, без прихованого встановлення через npx. `verify:output` перевіряє HTML, локальні посилання, assets, srcset, метадані, sitemap і demo-обмеження. `verify:http` короткочасно запускає локальний сервер і перевіряє прямі URL, фото та реальні 404. Це не перевірка налаштувань HostPro/GitHub Pages.

SEO-аудит, результати та незавершені перевірки — `docs/SEO_AUDIT_UA.md`. `verify:output` перевіряє також унікальність і узгодженість canonical/OG/Twitter, JSON-LD, індексацію всіх сторінок і видимий контент категорій. Для підготовленої індексованої production-збірки є `npm run verify:release`; вона потребує `BRUKIVKA_ALLOW_INDEXING=true` та перевіряє output без публікації. Точні команди — у `docs/DEPLOYMENT_UA.md`.

## Стиль вихідного коду

Vue-компоненти: `template` → `script setup lang="ts"` → `style scoped lang="scss"`, з порожнім рядком між наявними блоками. JS/TS-інструкції завершуються `;`; відступ — два пробіли, файли завершуються LF-переносом рядка. Python зберігає відступ у чотири пробіли.

Для Vue-шаблонів Prettier використовує `htmlWhitespaceSensitivity: "ignore"` і `bracketSameLine: false`: вкладений контент і закривальний тег батьківського елемента розташовуються окремими рядками, `</NuxtLink>` не розривається перед `>`. Короткі текстові елементи на кшталт `<span>Каталог</span>` можуть залишатися одним рядком. Під час змін шаблонів перевіряємо пробіли біля inline-тексту та пунктуації.

Точковий `prettier-ignore` у реченні атрибуції зберігає щільне прилягання крапки до попереднього тексту. Фрагмент також має цілі закривальні теги й читабельні переноси; виняток не поширюється на файл. Векторний BrandLogo у хедері й футері не потребує винятків форматера.

Налаштування: `.editorconfig`, `.prettierrc.json`, `eslint.config.mjs`. `npm run lint` перевіряє також форматування. Команди для роботи:

```bash
npm run format
npm run format:check
npm run lint:fix
```

`format` застосовує Prettier, а `lint:fix` спочатку виправляє ESLint-порушення, включно з порядком Vue-блоків, і потім форматує код. Підготовка gallery-даних через `npm run assets:prepare` також завершується форматуванням `app/data`.

Глобальні стилі — `app/assets/styles/main.scss`; Sass компілюється під час dev/build, Prettier працює лише з вихідними файлами. Обидва пакети — devDependencies, код форматера й Sass не завантажується браузером. Production JS/CSS мінімізуються окремими збірковими файлами; читабельні вихідні відступи й крапки з комою не збільшують кінцевий код через саме форматування. Наявний статичний `public/fonts/fonts.css` залишається готовим CSS для браузера.

Оригінальні `reference/`, `public/`, lockfile та build-output виключені з Prettier. Їхні байти й походження не змінюються заради форматування.

Адаптивність — mobile-first: базові стилі для вузького екрана, лише два брекпоінти `medium: 768px` і `x-large: 1200px`. Значення та міксини зберігаються в `app/assets/styles/_breakpoints.scss`. У компоненті:

```scss
@use '../assets/styles/breakpoints' as bp;

.card {
  display: grid;

  &__title {
    color: var(--text);
  }

  @include bp.medium {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include bp.x-large {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

Шлях `@use` відносний до файла; для `pages/index.vue` він такий самий, як у прикладі. Споріднені класи й стани групуємо через `&`, для нових компонентів використовуємо BEM `block__element--modifier`. Наявні назви класів збережено; спільні utility-класи залишаються окремими. Медіазапити `hover`, `prefers-reduced-motion`, `forced-colors` зберігають доступність і не є додатковими брекпоінтами ширини. `npm test` компілює всі SCSS-стилі та перевіряє дозволені пороги й зміни меню/сіток на їхніх межах.

## Фото й контент

Логотип: спільний `BrandLogo.vue` у хедері й футері, геометрія — `app/assets/brand/geometry.json`. Оновлення зберігає будинок і два камені оригінального знака; напис BRUKIVKA накреслено векторами без залежності від шрифтів. Кольори компонента беруться з теми сайту. Статичні версії — `public/brand/logo-dark.svg`, `logo-light.svg`, `mark.svg`; перегляд — `docs/BRAND_PREVIEW.png`. Оригінальний `public/images/logo.png` збережений.

`npm run brand:prepare` відтворює SVG, favicon.ico (16/32/48px), PNG 16/32px, Apple touch icon 180px, окрему іконку 512px та preview лише засобами стандартної бібліотеки Python. Для favicon знак спрощено під малі розміри; графітова підкладка з теракотовим знаком зберігає контраст у світлих/темних вкладках. Посилання на іконки в Nuxt враховують deployment baseURL. Нові пакети не потрібні.

Дизайн-основа — [наданий референс](https://nexgen-fullstack.github.io/brukivka-site/) і `reference/site/index.html`. Станом на 20.10.2026 його 278 assets повертають 404. Користувачка надала [старий сайт](https://brukivka.org/) як джерело оригіналів.

Зіставлено 125/125 gallery-записів за групами, порядком і підписами. Перенесено 253 оригінальні JPG/PNG (включно з мініатюрами та зображеннями головної); байти перевірено SHA-256. WebP-версії недоступного референсу не відновлювалися й не генерувалися. Єдина відмінність підписів — друкарська помилка старого сайту в описі об’єкта №13; використано виправлений підпис зі snapshot.

Звіти й відповідність: `reference/legacy/asset-manifest.json`, `reference/legacy/site/download-report.json`, `reference/legacy/copy-report.json`.

Оригінали зберігаються один раз у `public/images/`. Дублікати у `reference/legacy/site/images/` прибрано; ця папка є ігнорованим кешем завантаження. Snapshot HTML, маніфести, ліцензії шрифтів і хеші залишені для перевірки походження та незмінності ресурсів. Збірка й тести працюють без кешу. Застарілі стартові файли пакета та скрипт підготовки недоступних WebP видалені; актуальні інструкції — цей README та `AGENTS.md`.

Повторне завантаження кешу та підготовка, тільки якщо потрібно повторно створити gallery-дані (для звичайної збірки не потрібні):

```bash
python3 scripts/download_reference_assets.py --manifest reference/legacy/asset-manifest.json --destination reference/legacy/site
npm run assets:prepare
```

Скрипт підготовки перевіряє хеші, читає реальні розміри JPG/PNG, копіює файли без перетворення та генерує типізовані галереї. Маленькі 90px thumbnails збережено; для карток використано оригінальні великі фото, придатні для показу на сучасних екранах. Категорії завантажують лише свою галерею; великі зображення діалогу з’являються після його відкриття.

Шрифти Manrope / Unbounded локальні, з кирилицею та `font-display: swap`. Походження записано в `reference/font-report.json`; SIL OFL ліцензії — `public/fonts/`.

## Середовища

Налаштування передаються **під час генерації**. Зразок — `.env.example`; деталі — `docs/DEPLOYMENT_UA.md`.

- `BRUKIVKA_TARGET=production` — типово: комерційний сайт з активними контактами оригіналу.
- `BRUKIVKA_TARGET=demo` — окремий режим для GitHub Pages: noindex, видимий статус демо, без активних звернень.
- `NUXT_APP_BASE_URL` — `/` або `/<repository>/`, з обома слешами.
- `BRUKIVKA_SITE_URL` — повна адреса з тим самим підшляхом; для основного сайту типово `https://brukivka.org/`. В окремому демо адресу потрібно задати явно.
- Контакти зберігаються в `app/data/contacts.ts`: +38 (067) 709-33-12, +38 (063) 269-26-96; info@brukivka.org, labradorites@gmail.com; Україна, м. Житомир, вул. Покровська 239В. Їх перенесення з оригіналу прямо доручено користувачкою; додаткові env-змінні для контактів не потрібні.
- `BRUKIVKA_ALLOW_INDEXING=true` — явне відкриття індексації production. До запуску залишити `false`.

У preview/demo HTML має noindex, а robots.txt дозволяє обхід, щоб пошуковик міг прочитати цю директиву. Demo залишається noindex навіть із BRUKIVKA_ALLOW_INDEXING=true. .env і передрелізний output не переводяться в індексований режим автоматично.

Production-звернення відкриває WhatsApp/email із текстом; відправлення користувач підтверджує у своєму застосунку. Серверної доставки немає.

Приклад перевірки підшляху **з тестовим доменом, без публікації**:

```bash
BRUKIVKA_TARGET=demo NUXT_APP_BASE_URL=/brukivka/ BRUKIVKA_SITE_URL=https://example.test/brukivka/ npm run generate
BRUKIVKA_TARGET=demo NUXT_APP_BASE_URL=/brukivka/ BRUKIVKA_SITE_URL=https://example.test/brukivka/ npm run verify:output
NUXT_APP_BASE_URL=/brukivka/ npm run verify:http
```

Готовий workflow — `.github/workflows/pages.yml`. Він запускається лише вручну, отримує URL і підшлях із GitHub Pages, перевіряє код/фото, генерує demo та завантажує тільки `.output/public`. Типово `publish=false`: збірка перевіряється без публікації. Для окремо погодженого деплою користувачка обирає `publish=true`. Push не запускає публікацію. Налаштування репозиторію та точні кроки — у `docs/DEPLOYMENT_UA.md`. Apache-приклад збережено для майбутнього основного сайту: `deployment/hostpro.htaccess.example`.

## Архітектура та межі перевірки

`app/data/` містить контент, `app/types/` — модель, `app/components/` — повторювану розмітку, `app/composables/` — браузерну поведінку. `config/routes.ts` спільний для prerender, sitemap та перевірок: сім контентних URL. `app/data/navigation.ts` задає якірне меню й карту перенесених адрес. Старі URL ведуть до секцій лендингу: Nuxt middleware/Apache — 301, на простому static hosting — redirect HTML із meta refresh (HTTP 200). Немає UI-бібліотеки, глобального store чи бекенда.

Тему застосовує короткий head-скрипт до малювання; іконки перемикаються CSS без залежної від localStorage SSR-розмітки. Reveal підключається після mount кожної сторінки та очищається при демонтажі. Нативний `dialog` забезпечує модальність; composable керує фокусом і scroll lock. Анімація теми використовує View Transitions із fallback.

Реальні browser/mobile/reduced-motion/no-JS сценарії, hydration, Lighthouse й польові CWV ще потребують перевірки. Детальний фактичний стан — `docs/PROGRESS_UA.md`, сценарії — `tests/MANUAL_QA_UA.md`.

Дизайн і фотографії надані як вихідні матеріали. Нова реалізація створена за участю AI з локальними перевірками; авторство вихідних фото й дизайну не приписується розробниці. Права на публічне розміщення матеріалів слід підтвердити перед публікацією.
