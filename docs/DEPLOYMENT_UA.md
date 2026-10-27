# Розміщення: GitHub Pages і HostPro

## GitHub Pages: повна версія для клієнтського тестування

За рішенням користувачки від 27.10.2026 GitHub Pages тимчасово використовує `BRUKIVKA_TARGET=production`: звернення через Email, WhatsApp і Viber активні, демонстраційні плашки й обмеження прибрані. Це перевірка перед перенесенням на основний домен. Серверної доставки форми немає: форма відкриває поштовий застосунок/месенджер, для Viber текст копіюється окремо. Надсилання підтверджує користувач у застосунку.

`BRUKIVKA_ALLOW_INDEXING=false` зберігає noindex. Canonical, OG URL, sitemap та ресурси використовують адресу Pages з підшляхом `/brukivka/`, а не майбутній основний домен. `base_url` і `base_path` беруться з `actions/configure-pages`, із завершальним `/`. Окремий режим `BRUKIVKA_TARGET=demo` лишається доступним для портфоліо, але workflow його зараз не використовує.

Workflow `.github/workflows/pages.yml` запускається лише вручну: **Actions → Verify and deploy GitHub Pages → Run workflow**. `publish=false` типово виконує перевірки й завантажує артефакт без deploy. Для публікації користувачка вмикає `publish`. Автоматичного деплою після push немає. У **Settings → Pages → Source** має бути вибрано **GitHub Actions**.

Workflow запускає typecheck, lint/Prettier, тести, generate, verify:output і verify:http. Публікується лише `.output/public`, із `.nojekyll` та читабельним `404.html`. Після публікації перевірити прямі URL категорій і refresh, невідому адресу з HTTP 404, теми, галерею, мобільну навігацію, всі три способи звернення та noindex. Реальний перехід у Viber/WhatsApp потрібно перевірити на телефоні.

Локальна перевірка такої ж конфігурації:

```bash
export BRUKIVKA_TARGET=production
export BRUKIVKA_ALLOW_INDEXING=false
export NUXT_APP_BASE_URL=/brukivka/
export BRUKIVKA_SITE_URL=https://rozbytska-oksana.github.io/brukivka/
npm run generate
npm run verify:output
npm run verify:http
```

Ці команди нічого не публікують. Змінні потрібні під час генерації й перевірок: готовий статичний output не перечитує налаштування хостингу.

## HostPro

Для статичного релізу достатньо хостингу HTML/CSS/JS: Node на production не потрібен. Конкретний тариф, панель і document root перевірити за наданим доступом. Не припускати, що public_html завжди є коренем потрібного домену.

Згенерувати production build із baseURL=/, правильними canonical і sitemap. Зробити backup старого сайту, перевірити HTML index кожної категорії, HTTPS, 404, кешування й перенаправлення. Правила .htaccess використовувати лише якщо фактичний сервер їх підтримує. Не ставити загальний rewrite всіх адрес на головну з 200.

Не включати noindex демо у production. Перед запуском перевірити поточні URL і підготувати точні 301. Файли зі стабільними назвами повинні оновлюватися без застарілого кешу; хешовані assets можна кешувати довго.

## Якщо знадобиться бекенд

Статичний output не запускає server/api Nuxt. Для доставки заявок прямо на email потрібен окремий endpoint (можливо PHP на HostPro або зовнішній сервіс) чи серверний deployment Nuxt із сумісним тарифом. Це окремий обсяг. Поки форма production відкриває погоджений месенджер/email із текстом.

Джерела: https://nuxt.com/deploy/github-pages ; https://nuxt.com/docs/4.x/getting-started/prerendering ; https://hostpro.ua/blog/ua/how-to-create-a-website-using-html/.

## Реалізовані налаштування — 20.10.2026

Основний режим за замовчуванням — `BRUKIVKA_TARGET=production`, `NUXT_APP_BASE_URL=/`, canonical/site URL — `https://brukivka.org/`. Обидва телефони, обидві пошти та адреса беруться з `app/data/contacts.ts`, за прямою вказівкою користувачки. Звернення активні: WhatsApp/email із підготовленим текстом; серверної доставки немає.

До публічного запуску `BRUKIVKA_ALLOW_INDEXING=false`: це передрелізне обмеження індексації, а не режим демо. Для погодженого публічного релізу передати `BRUKIVKA_ALLOW_INDEXING=true` під час генерації — тоді отримуємо index/follow. robots.txt дозволяє обхід в усіх режимах: робот має прочитати noindex у preview/demo HTML. Disallow не є заміною noindex; підкаталожний robots.txt GitHub Pages не керує всім доменом. Приватне staging-середовище за потреби закривають авторизацією на хостингу, а не покладаються на noindex як контроль доступу. [Пояснення Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Локальна перевірка майбутнього індексованого релізу, без публікації:

```bash
BRUKIVKA_TARGET=production BRUKIVKA_ALLOW_INDEXING=true NUXT_APP_BASE_URL=/ BRUKIVKA_SITE_URL=https://brukivka.org/ npm run generate
BRUKIVKA_TARGET=production BRUKIVKA_ALLOW_INDEXING=true NUXT_APP_BASE_URL=/ BRUKIVKA_SITE_URL=https://brukivka.org/ npm run verify:release
```

verify:release вимагає production та явний прапорець індексації, потім перевіряє саме створений HTML: index/follow на контентних сторінках, noindex на 404, canonical/OG/schema/sitemap та ресурси. Вона не змінює .env, не публікує сайт і не запускає Search Console. Не завантажувати передрелізний output з noindex замість цієї збірки. Комерційна збірка, яка дозволяє індексацію, потребує HTTPS siteURL.

Окреме портфоліо-демо можна згенерувати з `BRUKIVKA_TARGET=demo`, власним base path і site URL. Поточний Pages workflow використовує повну передрелізну версію з noindex, як описано вище.

Apache-приклад — `deployment/hostpro.htaccess.example`: ErrorDocument 404 без SPA rewrite. Для іншого сервера потрібен його еквівалент. Фактичний document root, тип сервера, HTTPS, redirects, backup/rollback та HTTP-поведінку хостингу ще не перевірено; нічого не опубліковано.

Шаблон також обробляє старі URL з /index.html та прибирає явний index.html у поточних адресах через THE_REQUEST, щоб не зачепити внутрішній DirectoryIndex. Нормалізація HTTP/www подана закоментованим прикладом: увімкнути лише після перевірки TLS/reverse proxy на фактичному HostPro, інакше можливий цикл. Локальні Node HTTP-перевірки не виконують .htaccess і не підтверджують ці 301.

Команди `verify:output` та `verify:http` читають змінні оболонки; параметри підшляху треба передати їм так само, як генерації.

## Перенесення інформаційних сторінок у лендинг

Поточний sitemap містить головну й шість категорій. Карту попередніх адрес задає `app/data/navigation.ts`: вони ведуть до секцій головної. Для Apache додано точні RewriteRule із HTTP 301 у `deployment/hostpro.htaccess.example`. Самостійний static output (включно з Pages) містить redirect HTML із meta refresh, посиланням і location.replace; відповідь такого документа на простому сервері — 200. На HostPro застосувати й перевірити серверні правила, а не називати HTML-перехід 301. Невідомі маршрути зберігають 404.
