# Архітектура

## Основні рішення

Стиль коду погоджено 20.10.2026: порядок Vue-блоків template → script → style, TypeScript із крапками з комою після інструкцій, scoped SCSS, LF наприкінці файла. Глобальний стиль — app/assets/styles/main.scss. Prettier і .editorconfig визначають форматування, ESLint — порядок/мови блоків; npm run lint перевіряє обидва. Команди й винятки — у README. Sass/Prettier є build/development-залежностями, без клієнтського runtime.

У Vue-шаблонах Prettier налаштовано на htmlWhitespaceSensitivity: ignore / bracketSameLine: false: закривальні теги батьківських елементів окремим рядком, без розриву самого тега перед >, вкладений контент із відступом. Короткі текстові leaf-елементи можуть залишатися в одному рядку. Пробіли в inline-тексті/біля пунктуації перевіряємо під час форматування.

Адаптивність: mobile-first, лише medium 768px і x-large 1200px. Спільний SCSS-модуль app/assets/styles/_breakpoints.scss експортує $medium / $x-large та міксини medium / x-large. Компоненти підключають його через відносний @use з namespace bp, розміщують @include всередині відповідного селектора й групують елементи/стани через &. Для нових компонентів — BEM-іменування; спільні utility-класи окремі. Значення ширини не дублюються в SCSS компонентів; HTML sizes використовує ті самі пороги. Запити можливостей hover/reduced-motion/forced-colors збережені. Компіляцію всіх стилів, дозволені width queries і граничні стани основних сіток/меню перевіряє tests/responsive.test.mjs; це не замінює браузерний layout QA.

Nuxt 4 + Vue 3 + TypeScript strict; script setup / Composition API. Scoped CSS і спільні tokens. Nuxt SSR залишається увімкненим під час статичної генерації. Вивід `nuxt generate` — `.output/public`. Цей каталог розгортається як статичні файли. У production Node-процес для базового релізу не потрібен.

Контент зберігати у типізованих TS/JSON-файлах. Категорії та фото не класти у глобальний store. Дані потрібної категорії передавати в компоненти; уникати завантаження всього великого каталогу у загальний client bundle без потреби. Моделі: Category, CatalogItem, Stone, Project, ImageAsset, BusinessContacts, SeoMetadata.

## Маршрути — актуальне рішення 20.10.2026

Користувачка погодила спрощення: **головна-лендинг + шість категорій + 404**. Інформаційні сторінки об’єднані з головною; старий багатосторінковий план у DEVELOPMENT_PLAN є історією погоджень і не перевизначає це рішення.

| URL                                 | Призначення                                                |
| ----------------------------------- | ---------------------------------------------------------- |
| `/`                                 | Повний лендинг                                             |
| `/#kataloh`                         | Шість категорій із прямими посиланнями на їхні сторінки    |
| `/#pro-kamin`                       | Фактура й характер матеріалу                               |
| `/#kamin`                           | Усі 18 зразків, галерея                                    |
| `/#roboty`                          | Усі 14 записів об’єктів                                    |
| `/#posluhy`                         | Доставка, монтаж, порядок обговорення та шість фото складу |
| `/#zvernennia`                      | Звернення через WhatsApp/email                             |
| `/#kontakty`                        | Обидва телефони/email, адреса й карта                      |
| `/kataloh/brukivka-kolota/`         | Колота бруківка                                            |
| `/kataloh/brukivka-pyliana/`        | Пиляна термооброблена                                      |
| `/kataloh/brukivka-pyliano-kolota/` | Пиляно-колота                                              |
| `/kataloh/plytka/`                  | Плитка та фасадні матеріали                                |
| `/kataloh/fihurni-vyroby/`          | Фігурні вироби                                             |
| `/kataloh/bordiur/`                 | Бордюр                                                     |

`app/data/navigation.ts` задає меню та карту старих URL → секція. `config/routes.ts` задає сім контентних адрес для prerender/sitemap/перевірок. Hash-секції не є окремими сторінками sitemap. Усі галерейні посилання наявні в SSR HTML; додаткові фото приховані лише нативним `details`, доступним без JS.

Для старих `/kataloh/`, `/kamin/`, `/roboty/`, `/posluhy/`, `/kontakty/` та адрес старого сайту збережено переходи до відповідних якорів. Nuxt middleware повертає 301 у dev/server rendering; готовий static output містить короткі redirect-документи з meta refresh, звичайним посиланням і location.replace. Вони мають HTTP 200 на простому static server і **не називаються 301**. Для Apache підготовлено точні RewriteRule у deployment/hostpro.htaccess.example; на фактичному сервері ще не перевірено. Невідомі адреси не переписуються на головну з 200.

## Папки

`app/pages/`, `app/layouts/`, `app/components/`, `app/composables/`, `app/data/`, `app/types/`, `app/assets/styles/`, `public/img/`, `public/fonts/`, `tests/`, `scripts/`, `docs/`.

Компоненти: AppHeader, AppFooter, ThemeToggle, HeroSection, CategoryCard, ProductCard, StoneCard, ProjectCard, ImageGallery, Breadcrumbs, ContactForm, ScrollProgress. Composables: useTheme, useReveal, useGallery, useContactIntent. Це напрям декомпозиції, а не вимога створити порожній файл під кожну назву.

## SSR/SSG та життєвий цикл

Browser API — після mount; cleanup — при unmount. useReveal має реагувати на нову сторінку/елементи після NuxtLink-навігації. Не робити всі сторінки ClientOnly. Тема відновлюється до першого малювання, але серверний HTML і початкова Vue-розмітка мають бути узгоджені; theme-specific іконки краще керувати атрибутом/CSS або явно hydration-safe станом.

Навігація без JS у AppHeader — noscript із готовим HTML через renderNoJsNavigation (app/utils/noJsNavigation.ts). HTML формується лише зі спільних даних sectionNavigation та deployment baseURL, усі вставлені значення екрануються. Vue не створює для нього дочірніх VNode: із JS браузер парсить вміст noscript як текст, без JS — як розмітку. Не повертати NuxtLink/v-for всередину noscript і не підставляти туди зовнішній HTML. CSS на внутрішній nav використовує :deep. Активна секція за route.hash застосовується після mount: фрагмент URL не передається серверу й недоступний SSG, початковий HTML має залишатися однаковим.

## SEO

useSeoMeta для title/description/Open Graph, useHead для canonical, lang=uk та JSON-LD. Sitemap — файл, згенерований із реєстру маршрутів під час build; він має існувати в статичному output. Робочі robots.txt, canonical, breadcrumbs, 404. Schema для бізнесу і breadcrumbs; Product лише коли є реальна товарна сторінка з достовірними даними. Не обіцяти rich results або позиції.

usePageSeo використовує окремі seoTitle категорій та реальні розміри фото для OG, додає og:site_name, alt і Twitter card. app/utils/seo.ts нормалізує абсолютні canonical/asset URL з deployment base, екранує JSON-LD і формує LocalBusiness з підтверджених контактів. WebSite/WebPage/CollectionPage/BreadcrumbList пов’язані стабільними @id; назва сайту задається на головній. Дані категорій містять видимі поради з вибору, прив’язані до збережених зразків. Preview/demo — noindex з дозволеним обходом robots; production стає indexable лише через явний прапорець. verify:release перевіряє готовий релізний HTML без публікації. Детальний стан і джерела — SEO_AUDIT_UA.md.

## Фото

BrandLogo у хедері й футері — спільний inline SVG із декларативною геометрією app/assets/brand/geometry.json. Літери також є контурами: логотип не залежить від шрифтового завантаження. Компонент бере кольори з CSS-теми й не потребує browser API. scripts/prepare_brand_assets.py експортує ті самі контури в public/brand та створює спрощені favicon SVG/PNG/ICO стандартною бібліотекою Python; npm run brand:prepare відтворює assets і docs/BRAND_PREVIEW.png. Head-посилання на всі іконки враховують baseURL; локальний static-server має MIME для SVG/ICO. Наявний оригінальний logo.png не перезаписується. Фактичні assets/посилання перевіряють verify:output і verify:http.

Завантажити весь asset manifest і зіставити всі gallery entries. Зберегти байти та відносні шляхи. Виносити до public/img з потрібною підтримкою baseURL. Реальні src/srcset у HTML, коректні sizes і розміри. Не стискати повторно наявний WebP. Великі фото галереї — при відкритті, без попереднього завантаження всього архіву.

## Продуктивність

Орієнтири: LCP ≤2,5 с, INP ≤200 мс, CLS ≤0,1 для польового p75; Lighthouse mobile 90+, бажано 95+. Початковий JS разом із runtime орієнтовно до 150 КБ gzip, CSS до 35 КБ gzip; перевірити на першому прототипі. Це бюджети, не виконані результати. SSG не усуває клієнтську гідратацію Vue. Карта завантажується після взаємодії; шрифти — локальні WOFF2 з кирилицею. Мінімізувати дублювання payload, великі blur та зайві бібліотеки.
